import { Request, Response } from 'express';
import { storeService } from '../services/storeService';

export const likeProfile = (req: Request, res: Response): void => {
  try {
    const { profileId, isSuperLike } = req.body;
    if (!profileId) {
      res.status(400).json({ success: false, message: 'profileId is required' });
      return;
    }

    const result = storeService.likeProfile(profileId, Boolean(isSuperLike));
    res.json({
      success: true,
      data: {
        isMatch: result.isMatch,
        match: result.match || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process like', error });
  }
};

export const passProfile = (req: Request, res: Response): void => {
  try {
    const { profileId } = req.body;
    if (!profileId) {
      res.status(400).json({ success: false, message: 'profileId is required' });
      return;
    }

    storeService.passProfile(profileId);
    res.json({ success: true, message: 'Profile passed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to process pass', error });
  }
};

export const getMatches = (req: Request, res: Response): void => {
  try {
    const matches = storeService.getMatches();
    res.json({
      success: true,
      data: matches,
      count: matches.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch matches', error });
  }
};
