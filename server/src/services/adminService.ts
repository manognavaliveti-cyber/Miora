import { getAdminAuth, getAdminFirestore } from '../lib/firebaseAdmin';
import {
  AdminUserDetail,
  AdminUserSummary,
  AuditLogRecord,
  DashboardStats,
  ModerationAction,
  SafetyReportRecord,
  SafetyReportStatus,
  TransactionStats,
  UserModerationFlags
} from '../types';

// Collection names. `safety_reports` matches the existing firestore.rules
// (field `reporterId`); everything else is Admin-SDK-only so it is safe to
// name however this service likes — the default-deny catch-all rule already
// blocks client access to it.
const USERS_COLLECTION = 'users';
const REPORTS_COLLECTION = 'safety_reports';
const AUDIT_LOG_COLLECTION = 'audit_logs';
const TRANSACTIONS_COLLECTION = 'paymentTransactions';

function statusFor(flags: UserModerationFlags): AdminUserSummary['status'] {
  if (flags.deleted) return 'DELETED';
  if (flags.banned) return 'BANNED';
  if (flags.suspended) return 'SUSPENDED';
  return 'ACTIVE';
}

/**
 * There is no per-user profile document written on sign-up in this project
 * (see client/src/services/authService.ts) — Firebase Authentication is the
 * source of truth for name/email, while Firestore `users/{uid}` only holds
 * wallet + moderation fields (written by razorpayService / this service).
 * So the admin user list merges both.
 */
async function listAllAuthUsers(): Promise<import('firebase-admin').auth.UserRecord[]> {
  const auth = getAdminAuth();
  const all: import('firebase-admin').auth.UserRecord[] = [];
  let pageToken: string | undefined;
  do {
    const page = await auth.listUsers(1000, pageToken);
    all.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return all;
}

async function getModerationFlagsMap(): Promise<Map<string, UserModerationFlags & { walletBalance?: number; updatedAt?: string; subscriptionExpiresAt?: string; online?: boolean }>> {
  const db = getAdminFirestore();
  const snap = await db.collection(USERS_COLLECTION).get();
  const map = new Map<string, UserModerationFlags & { walletBalance?: number; updatedAt?: string; subscriptionExpiresAt?: string; online?: boolean }>();
  snap.forEach((doc) => {
    const d = doc.data() || {};
    map.set(doc.id, {
      suspended: Boolean(d.suspended),
      banned: Boolean(d.banned),
      deleted: Boolean(d.deleted),
      warned: Boolean(d.warned),
      warningReason: d.warningReason,
      isPremium: Boolean(d.isPremium),
      subscriptionTier: d.subscriptionTier,
      online: Boolean(d.online),
      subscriptionExpiresAt: d.subscriptionExpiresAt,
      walletBalance: d.walletBalance ?? d.coinBalance,
      updatedAt: d.updatedAt
    });
  });
  return map;
}

function toSummary(
  u: import('firebase-admin').auth.UserRecord,
  flags: UserModerationFlags | undefined
): AdminUserSummary {
  const f: UserModerationFlags = flags || {};
  return {
    id: u.uid,
    name: u.displayName || 'Unnamed User',
    email: u.email || 'N/A',
    disabled: Boolean(u.disabled),
    createdAt: u.metadata.creationTime,
    lastSignInAt: u.metadata.lastSignInTime,
    status: statusFor(f),
    suspended: f.suspended,
    banned: f.banned,
    deleted: f.deleted,
    warned: f.warned,
    warningReason: f.warningReason,
    isPremium: f.isPremium,
    subscriptionTier: f.subscriptionTier,
    online: Boolean((f as any).online)
  };
}

export const adminService = {
  async listUsers(search?: string): Promise<AdminUserSummary[]> {
    const [authUsers, flagsMap] = await Promise.all([listAllAuthUsers(), getModerationFlagsMap()]);
    let summaries = authUsers.map((u) => toSummary(u, flagsMap.get(u.uid)));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      summaries = summaries.filter(
        (u) => u.id.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    // Newest first.
    summaries.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return summaries;
  },

  async getUserDetail(uid: string): Promise<AdminUserDetail | null> {
    const auth = getAdminAuth();
    let authUser: import('firebase-admin').auth.UserRecord;
    try {
      authUser = await auth.getUser(uid);
    } catch {
      return null;
    }

    const db = getAdminFirestore();
    const doc = await db.collection(USERS_COLLECTION).doc(uid).get();
    const d = doc.data() || {};
    const flags: UserModerationFlags = {
      suspended: Boolean(d.suspended),
      banned: Boolean(d.banned),
      deleted: Boolean(d.deleted),
      warned: Boolean(d.warned),
      warningReason: d.warningReason,
      isPremium: Boolean(d.isPremium),
      subscriptionTier: d.subscriptionTier
    };

    return {
      ...toSummary(authUser, flags),
      photos: d.photos,
      gender: d.gender,
      location: d.location,
      bio: d.bio,
      walletBalance: d.walletBalance ?? d.coinBalance,
      updatedAt: d.updatedAt
    };
  },

  /** Merges moderation flags onto users/{uid}; never touches wallet/premium fields. */
  async setModerationFlags(uid: string, updates: Partial<UserModerationFlags>): Promise<void> {
    const db = getAdminFirestore();
    await db
      .collection(USERS_COLLECTION)
      .doc(uid)
      .set({ ...updates, updatedAt: new Date().toISOString() }, { merge: true });
  },

  async applyModerationAction(uid: string, action: Exclude<ModerationAction, 'NONE'>, reason: string): Promise<void> {
    if (action === 'WARN') {
      await this.setModerationFlags(uid, { warned: true, warningReason: reason });
    } else if (action === 'SUSPEND') {
      await this.setModerationFlags(uid, { suspended: true });
    } else if (action === 'BAN') {
      await this.setModerationFlags(uid, { banned: true });
      // A ban also locks the person out of Firebase Auth itself.
      try {
        await getAdminAuth().updateUser(uid, { disabled: true });
      } catch {
        /* user may already be disabled or not exist — flag on the doc is still recorded */
      }
    }
  },

  async softDeleteUser(uid: string): Promise<void> {
    await this.setModerationFlags(uid, { deleted: true });
    try {
      await getAdminAuth().updateUser(uid, { disabled: true });
    } catch {
      /* ignore */
    }
  },

  async listReports(): Promise<SafetyReportRecord[]> {
    const db = getAdminFirestore();
    const snap = await db.collection(REPORTS_COLLECTION).orderBy('createdAt', 'desc').limit(200).get();
    return snap.docs.map((doc) => {
      const d = doc.data() as any;
      return {
        id: doc.id,
        reporterUserId: d.reporterId || d.reporterUserId || 'unknown',
        reportedUserId: d.reportedUserId || d.targetProfileId || 'unknown',
        reason: d.reason || 'Unspecified',
        details: d.details,
        status: (d.status || 'PENDING') as SafetyReportStatus,
        createdAt: d.createdAt || new Date().toISOString(),
        resolvedAt: d.resolvedAt,
        moderationAction: d.moderationAction,
        resolutionNote: d.resolutionNote
      };
    });
  },

  async updateReport(
    reportId: string,
    updates: { status: SafetyReportStatus; moderationAction?: ModerationAction | null; resolutionNote?: string }
  ): Promise<SafetyReportRecord | null> {
    const db = getAdminFirestore();
    const ref = db.collection(REPORTS_COLLECTION).doc(reportId);
    const snap = await ref.get();
    if (!snap.exists) return null;

    const patch: Record<string, any> = {
      status: updates.status,
      resolutionNote: updates.resolutionNote || null,
      resolvedAt: new Date().toISOString()
    };
    if (updates.moderationAction && updates.moderationAction !== 'NONE') {
      patch.moderationAction = updates.moderationAction;
    }
    await ref.set(patch, { merge: true });

    const d = snap.data() as any;
    return {
      id: ref.id,
      reporterUserId: d.reporterId || d.reporterUserId || 'unknown',
      reportedUserId: d.reportedUserId || d.targetProfileId || 'unknown',
      reason: d.reason || 'Unspecified',
      details: d.details,
      ...patch
    } as SafetyReportRecord;
  },

  async getPaymentStats(): Promise<TransactionStats> {
    const db = getAdminFirestore();
    const snap = await db.collection(TRANSACTIONS_COLLECTION).get();
    let totalAmount = 0;
    let dailyAmount = 0;
    let successfulTransactions = 0;
    const revenueByDayMap = new Map<string, number>();
    const now = new Date();
    const indiaNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const indiaStartMs = Date.UTC(indiaNow.getUTCFullYear(), indiaNow.getUTCMonth(), indiaNow.getUTCDate()) - 5.5 * 60 * 60 * 1000;
    const startOfToday = indiaStartMs;

    snap.forEach((doc) => {
      const d = doc.data() as any;
      if (d.status !== 'SUCCESS') return;
      successfulTransactions += 1;
      const amount = Number(d.priceInr || 0);
      totalAmount += amount;
      const created = d.createdAt ? new Date(d.createdAt) : null;
      if (created && !Number.isNaN(created.getTime())) {
        if (created.getTime() >= startOfToday) dailyAmount += amount;
        const indiaCreated = new Date(created.getTime() + 5.5 * 60 * 60 * 1000);
        const day = indiaCreated.toISOString().slice(0, 10);
        revenueByDayMap.set(day, (revenueByDayMap.get(day) || 0) + amount);
      }
    });

    const revenueByDay = Array.from({ length: 7 }).map((_, index) => {
      const d = new Date(Date.UTC(indiaNow.getUTCFullYear(), indiaNow.getUTCMonth(), indiaNow.getUTCDate() - (6 - index)));
      const key = d.toISOString().slice(0, 10);
      return { date: key, revenue: revenueByDayMap.get(key) || 0 };
    });

    return {
      totalTransactions: successfulTransactions,
      totalAmount,
      dailyAmount,
      revenueByDay
    };
  },

  async listAuditLogs(): Promise<AuditLogRecord[]> {
    const db = getAdminFirestore();
    const snap = await db.collection(AUDIT_LOG_COLLECTION).orderBy('timestamp', 'desc').limit(200).get();
    return snap.docs.map((doc) => {
      const d = doc.data() as any;
      return {
        id: doc.id,
        timestamp: d.timestamp,
        adminUid: d.adminUid,
        adminEmail: d.adminEmail,
        action: d.action,
        targetUserId: d.targetUserId,
        details: d.details
      };
    });
  },

  async writeAuditLog(entry: {
    adminUid: string;
    adminEmail?: string;
    action: string;
    targetUserId?: string;
    details: string;
  }): Promise<void> {
    const db = getAdminFirestore();
    await db.collection(AUDIT_LOG_COLLECTION).add({
      ...entry,
      timestamp: new Date().toISOString()
    });
  },

  async getDashboardStats(matchesCount: number): Promise<DashboardStats> {
    const [authUsers, flagsMap, reports, payments] = await Promise.all([
      listAllAuthUsers(),
      getModerationFlagsMap(),
      this.listReports(),
      this.getPaymentStats()
    ]);

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let activeUsers = 0;
    let loggedInUsers = 0;
    let newUsersLast7Days = 0;
    let suspendedUsers = 0;
    let bannedUsers = 0;
    let premiumUsers = 0;
    let vipSubscriptions = 0;
    let proSubscriptions = 0;

    const recentActivity: DashboardStats['recentActivity'] = [];

    for (const u of authUsers) {
      const flags: any = flagsMap.get(u.uid) || {};
      const blocked = Boolean(flags.banned || flags.suspended || flags.deleted || u.disabled);
      if (flags.suspended) suspendedUsers += 1;
      if (flags.banned) bannedUsers += 1;
      if (!blocked) activeUsers += 1;
      if (u.metadata.lastSignInTime) loggedInUsers += 1;

      const createdMs = u.metadata.creationTime ? new Date(u.metadata.creationTime).getTime() : 0;
      if (createdMs >= sevenDaysAgo) {
        newUsersLast7Days += 1;
        recentActivity.push({
          type: 'registration',
          title: 'New user registered',
          detail: u.email || u.displayName || u.uid,
          timestamp: u.metadata.creationTime || new Date().toISOString()
        });
      }

      const tier = String(flags.subscriptionTier || '').toLowerCase();
      const expiry = flags.subscriptionExpiresAt ? new Date(flags.subscriptionExpiresAt).getTime() : 0;
      const subscriptionActive = !expiry || expiry > Date.now();
      if (subscriptionActive && tier === 'vip') vipSubscriptions += 1;
      if (subscriptionActive && (tier === 'gold' || tier === 'pro')) proSubscriptions += 1;
      if (subscriptionActive && (tier === 'vip' || tier === 'gold' || tier === 'pro' || flags.isPremium)) premiumUsers += 1;

      if (u.metadata.lastSignInTime) {
        recentActivity.push({
          type: 'login',
          title: 'User login',
          detail: u.email || u.displayName || u.uid,
          timestamp: u.metadata.lastSignInTime
        });
      }
    }

    // Add the most recent successful payments to the activity feed.
    const db = getAdminFirestore();
    const paymentSnap = await db.collection(TRANSACTIONS_COLLECTION).where('status', '==', 'SUCCESS').get();
    paymentSnap.forEach((doc) => {
      const d = doc.data() as any;
      recentActivity.push({
        type: 'payment',
        title: d.type === 'VIP_SUBSCRIPTION' ? 'VIP subscription payment' : d.type === 'GOLD_SUBSCRIPTION' ? 'Pro subscription payment' : 'Wallet payment',
        detail: `₹${Number(d.priceInr || 0)} · ${d.packageId || 'payment'}`,
        timestamp: d.createdAt || new Date().toISOString()
      });
    });

    recentActivity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return {
      totalUsers: authUsers.length,
      totalProfiles: authUsers.length,
      loggedInUsers,
      activeUsers,
      newUsersLast7Days,
      totalMatches: matchesCount,
      totalReports: reports.length,
      pendingReports: reports.filter((r) => r.status === 'PENDING').length,
      suspendedUsers,
      bannedUsers,
      premiumUsers,
      vipSubscriptions,
      proSubscriptions,
      totalTransactions: payments.totalTransactions,
      totalTransactionAmount: payments.totalAmount,
      totalRevenue: payments.totalAmount,
      dailyRevenue: payments.dailyAmount,
      revenueByDay: payments.revenueByDay,
      recentActivity: recentActivity.slice(0, 12)
    };
  }
};
