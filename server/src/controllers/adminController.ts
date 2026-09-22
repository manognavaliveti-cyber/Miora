import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { getAdminAuth } from '../lib/firebaseAdmin';
import { adminService } from '../services/adminService';
import { storeService } from '../services/storeService';
import { getPricingSettings, savePricingSettings } from '../services/pricingService';

import { ModerationAction, SafetyReportStatus } from '../types';

function auditContext(req: AuthedRequest) {
  return { adminUid: req.userId || 'unknown', adminEmail: req.userEmail };
}

export const getDashboard = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const matchesCount = storeService.getMatches().length;
    const stats = await adminService.getDashboardStats(matchesCount);
    res.json(stats);
  } catch (err: any) {
    console.error('admin.getDashboard error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load dashboard stats', error: err.message });
  }
};

export const getUsers = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const items = await adminService.listUsers(search);
    res.json({ items });
  } catch (err: any) {
    console.error('admin.getUsers error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load users', error: err.message });
  }
};

export const getUserDetail = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const user = await adminService.getUserDetail(req.params.uid);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    console.error('admin.getUserDetail error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load user', error: err.message });
  }
};

export const warnUser = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const reason = (req.query.reason as string) || 'Policy Violation';
    await adminService.applyModerationAction(uid, 'WARN', reason);
    await adminService.writeAuditLog({
      ...auditContext(req),
      action: 'WARN',
      targetUserId: uid,
      details: reason
    });
    res.json({ success: true, message: `Warning issued to ${uid}` });
  } catch (err: any) {
    console.error('admin.warnUser error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to warn user', error: err.message });
  }
};

export const suspendUser = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const suspend = req.query.suspend !== 'false';
    const reason = (req.query.reason as string) || 'Account Suspension';

    if (suspend) {
      await adminService.applyModerationAction(uid, 'SUSPEND', reason);
    } else {
      await adminService.setModerationFlags(uid, { suspended: false });
    }

    await adminService.writeAuditLog({
      ...auditContext(req),
      action: suspend ? 'SUSPEND' : 'UNSUSPEND',
      targetUserId: uid,
      details: reason
    });

    res.json({ success: true, message: `${suspend ? 'Suspended' : 'Unsuspended'} ${uid}` });
  } catch (err: any) {
    console.error('admin.suspendUser error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update suspension status', error: err.message });
  }
};

export const banUser = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    const ban = req.query.ban !== 'false';
    const reason = (req.query.reason as string) || 'Account Banned';

    if (ban) {
      await adminService.applyModerationAction(uid, 'BAN', reason);
    } else {
      await adminService.setModerationFlags(uid, { banned: false });
      try {
        await getAdminAuth().updateUser(uid, { disabled: false });
      } catch {
        /* ignore — user may not exist anymore */
      }
    }

    await adminService.writeAuditLog({
      ...auditContext(req),
      action: ban ? 'BAN' : 'UNBAN',
      targetUserId: uid,
      details: reason
    });

    res.json({ success: true, message: `${ban ? 'Banned' : 'Unbanned'} ${uid}` });
  } catch (err: any) {
    console.error('admin.banUser error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update ban status', error: err.message });
  }
};

export const deleteUser = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const { uid } = req.params;
    await adminService.softDeleteUser(uid);
    await adminService.writeAuditLog({
      ...auditContext(req),
      action: 'DELETE',
      targetUserId: uid,
      details: 'Account soft-deleted and disabled by admin'
    });
    res.json({ success: true, message: `Deleted ${uid}` });
  } catch (err: any) {
    console.error('admin.deleteUser error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
};

export const getReports = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const items = await adminService.listReports();
    res.json({ items });
  } catch (err: any) {
    console.error('admin.getReports error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load reports', error: err.message });
  }
};

export const updateReport = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, moderationAction, resolutionNote } = req.body as {
      status: SafetyReportStatus;
      moderationAction?: ModerationAction | null;
      resolutionNote?: string;
    };

    if (!status) {
      res.status(400).json({ success: false, message: 'status is required' });
      return;
    }

    const updated = await adminService.updateReport(id, { status, moderationAction, resolutionNote });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    // If the admin chose a punitive action while resolving the report, apply it to the reported user too.
    if (moderationAction && moderationAction !== 'NONE') {
      await adminService.applyModerationAction(
        updated.reportedUserId,
        moderationAction,
        resolutionNote || `Resolved via report ${id}`
      );
    }

    await adminService.writeAuditLog({
      ...auditContext(req),
      action: `REPORT_${status}`,
      targetUserId: updated.reportedUserId,
      details: resolutionNote || `Report ${id} marked ${status}`
    });

    res.json(updated);
  } catch (err: any) {
    console.error('admin.updateReport error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update report', error: err.message });
  }
};

export const getPayments = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const stats = await adminService.getPaymentStats();
    res.json(stats);
  } catch (err: any) {
    console.error('admin.getPayments error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load payment stats', error: err.message });
  }
};

export const getAuditLogs = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const logs = await adminService.listAuditLogs();
    res.json(logs);
  } catch (err: any) {
    console.error('admin.getAuditLogs error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load audit logs', error: err.message });
  }
};


export const getPricing = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    res.json(await getPricingSettings());
  } catch (err: any) {
    console.error('admin.getPricing error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load pricing settings', error: err.message });
  }
};

export const updatePricing = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const allowed = ['chatPerMinuteInr', 'audioCallPerMinuteCoins', 'videoCallPerMinuteCoins', 'proPriceInr', 'vipPriceInr', 'gameChargeCoins', 'normalGameChargeCoins', 'interestingGameChargeCoins'] as const;
    const updates: Record<string, number> = {};
    for (const key of allowed) {
      if (req.body?.[key] !== undefined) updates[key] = Number(req.body[key]);
    }
    const pricing = await savePricingSettings(updates, req.userEmail || req.userId);
    await adminService.writeAuditLog({
      ...auditContext(req),
      action: 'UPDATE_PRICING',
      details: `Chat ₹${pricing.chatPerMinuteInr}/min, audio ${pricing.audioCallPerMinuteCoins} coins/min, video ${pricing.videoCallPerMinuteCoins} coins/min, PRO ₹${pricing.proPriceInr}, VIP ₹${pricing.vipPriceInr}, games normal ₹${pricing.normalGameChargeCoins}, interesting ₹${pricing.interestingGameChargeCoins}`
    });
    res.json(pricing);
  } catch (err: any) {
    console.error('admin.updatePricing error:', err.message);
    res.status(400).json({ success: false, message: err.message || 'Failed to update pricing' });
  }
};
