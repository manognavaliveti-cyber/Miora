import { Request, Response } from 'express';
import { storeService } from '../services/storeService';

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

export const reportUser = (req: Request, res: Response): void => {
  try {
    const { targetProfileId, reason, details } = req.body;
    if (!targetProfileId || !reason) {
      res.status(400).json({ success: false, message: 'targetProfileId and reason are required' });
      return;
    }

    const report = storeService.reportUser(targetProfileId, reason, details);
    res.status(201).json({
      success: true,
      data: report,
      message: 'Report submitted. Our moderation team has been notified.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit report', error });
  }
};
