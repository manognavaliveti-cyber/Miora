import { Request, Response } from 'express';
import { storeService } from '../services/storeService';

export const getProfiles = (req: Request, res: Response): void => {
  try {
    const profiles = storeService.getDiscoverProfiles();
    res.json({
      success: true,
      data: profiles,
      count: profiles.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profiles', error });
  }
};

export const getProfileById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const profile = storeService.getProfileById(id);
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error });
  }
};
