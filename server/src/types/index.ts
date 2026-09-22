export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  distanceKm: number;
  bio: string;
  photos: string[];
  interests: string[];
  compatibility: number; // Percentage, e.g. 88
  online: boolean;
  gender: 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
  occupation?: string;
  education?: string;
  height?: string;
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    workout?: string;
    zodiac?: string;
  };
  matchedInterests?: string[];
  likedByCurrentUser?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  age: number;
  dateOfBirth?: string;
  gender: 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  profileCompletion: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  interestedIn: 'women' | 'men' | 'everyone';
  ageRange: {
    min: number;
    max: number;
  };
  maxDistanceKm: number;
  location: string;
}

export interface Match {
  id: string;
  profileId: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string; // 'me' or profileId
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ReportItem {
  id: string;
  targetProfileId: string;
  targetProfileName: string;
  reason: string;
  details?: string;
  createdAt: string;
}

export interface BlockItem {
  id: string;
  profileId: string;
  profileName: string;
  profilePhoto: string;
  blockedAt: string;
}

// ==========================================
// Admin Panel
// ==========================================

/** Moderation + billing flags kept on the Firestore `users/{uid}` doc. */
export interface UserModerationFlags {
  suspended?: boolean;
  banned?: boolean;
  deleted?: boolean;
  warned?: boolean;
  warningReason?: string;
  isPremium?: boolean;
  subscriptionTier?: string;
  online?: boolean;
}

export interface AdminUserSummary extends UserModerationFlags {
  id: string;
  name: string;
  email: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DELETED';
  disabled: boolean;
  createdAt?: string;
  lastSignInAt?: string;
  online?: boolean;
}

export interface AdminUserDetail extends AdminUserSummary {
  photos?: string[];
  gender?: string;
  location?: string;
  bio?: string;
  walletBalance?: number;
  updatedAt?: string;
}

export type SafetyReportStatus = 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
export type ModerationAction = 'NONE' | 'WARN' | 'SUSPEND' | 'BAN';

export interface SafetyReportRecord {
  id: string;
  reporterUserId: string;
  reportedUserId: string;
  reason: string;
  details?: string;
  status: SafetyReportStatus;
  createdAt: string;
  resolvedAt?: string;
  moderationAction?: ModerationAction;
  resolutionNote?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  adminUid: string;
  adminEmail?: string;
  action: string;
  targetUserId?: string;
  details: string;
}

export interface DashboardActivity {
  type: 'registration' | 'login' | 'payment';
  title: string;
  detail: string;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProfiles: number;
  loggedInUsers: number;
  activeUsers: number;
  newUsersLast7Days: number;
  totalMatches: number;
  totalReports: number;
  pendingReports: number;
  suspendedUsers: number;
  bannedUsers: number;
  premiumUsers: number;
  vipSubscriptions: number;
  proSubscriptions: number;
  totalRevenue: number;
  dailyRevenue: number;
  revenueByDay: { date: string; revenue: number }[];
  recentActivity: DashboardActivity[];
  totalTransactions: number;
  totalTransactionAmount: number;
}

export interface TransactionStats {
  totalTransactions: number;
  totalAmount: number;
  dailyAmount: number;
  revenueByDay: { date: string; revenue: number }[];
}
