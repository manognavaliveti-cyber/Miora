import { Request, Response } from 'express';
import { storeService } from '../services/storeService';

export const getCurrentUser = (req: Request, res: Response): void => {
  try {
    const user = storeService.getCurrentUser();
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch current user', error });
  }
};

export const updateCurrentUser = (req: Request, res: Response): void => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      res.status(400).json({ success: false, message: 'Invalid payload' });
      return;
    }

    const updatedUser = storeService.updateCurrentUser(updates);
    res.json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user profile', error });
  }
};
