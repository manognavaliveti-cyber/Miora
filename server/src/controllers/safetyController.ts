import { Request, Response } from 'express';
import { storeService } from '../services/storeService';
import { getAdminAuth, getAdminFirestore } from '../lib/firebaseAdmin';

export const blockUser = (req: Request, res: Response): void => {
  try {
    const { profileId } = req.body;
    if (!profileId) {
      res.status(400).json({ success: false, message: 'profileId is required' });
      return;
    }

    const success = storeService.blockUser(profileId);
    if (!success) {
      res.status(404).json({ success: false, message: 'User not found or already blocked' });
      return;
    }

    res.json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to block user', error });
  }
};

export const unblockUser = (req: Request, res: Response): void => {
  try {
    const { profileId } = req.body;
    if (!profileId) {
      res.status(400).json({ success: false, message: 'profileId is required' });
      return;
    }

    storeService.unblockUser(profileId);
    res.json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unblock user', error });
  }
};

export const getBlockedUsers = (req: Request, res: Response): void => {
  try {
    const blockedList = storeService.getBlockedUsers();
    res.json({
      success: true,
      data: blockedList
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blocked users', error });
  }
};

export const reportUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { targetProfileId, reportedUserId, reason, details } = req.body;
    const target = reportedUserId || targetProfileId;
    if (!target || !reason) {
      res.status(400).json({ success: false, message: 'targetProfileId and reason are required' });
      return;
    }

    // Local in-memory mock store — used by the client's own "My Reports" view.
    const report = storeService.reportUser(targetProfileId || target, reason, details);

    // Best-effort: also persist to Firestore so the Admin Panel's Moderation
    // Reports tab has something real to review. This never blocks the
    // response — a signed-out or misconfigured client still gets a 201.
    try {
      let reporterId = 'anonymous';
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (token) {
        const decoded = await getAdminAuth().verifyIdToken(token).catch(() => null);
        if (decoded) reporterId = decoded.uid;
      }

      await getAdminFirestore().collection('safety_reports').add({
        reporterId,
        reportedUserId: target,
        reason,
        details: details || null,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
    } catch (firestoreErr) {
      console.error('reportUser: failed to persist to Firestore (non-fatal):', firestoreErr);
    }

    res.status(201).json({
      success: true,
      data: report,
      message: 'Report submitted. Our moderation team has been notified.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit report', error });
  }
};
