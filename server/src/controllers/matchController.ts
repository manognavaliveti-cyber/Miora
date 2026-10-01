import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { firestoreMatchService } from '../services/firestoreMatchService';
import { storeService } from '../services/storeService';

export const likeProfile = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || 'user_me';
    const { profileId, isSuperLike } = req.body;
    if (!profileId) {
      res.status(400).json({ success: false, message: 'profileId is required' });
      return;
    }

    let result = await firestoreMatchService.likeProfile(userId, profileId, Boolean(isSuperLike));
    if (!result.isMatch && userId === 'user_me') {
      const fallbackResult = storeService.likeProfile(profileId, Boolean(isSuperLike));
      if (fallbackResult.isMatch) {
        result = fallbackResult;
      }
    }

    res.json({
      success: true,
      data: {
        isMatch: result.isMatch,
        match: result.match || null
      }
    });
  } catch (error: any) {
    console.error('likeProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to process like', error: error?.message });
  }
};

export const passProfile = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || 'user_me';
    const { profileId } = req.body;
    if (!profileId) {
      res.status(400).json({ success: false, message: 'profileId is required' });
      return;
    }

    await firestoreMatchService.passProfile(userId, profileId);
    storeService.passProfile(profileId);
    res.json({ success: true, message: 'Profile passed successfully' });
  } catch (error: any) {
    console.error('passProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to process pass', error: error?.message });
  }
};

export const getMatches = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId || 'user_me';
    let matches = await firestoreMatchService.getMatches(userId);

    // If Firestore matches are empty for local demo user, fallback to storeService
    if (matches.length === 0 && userId === 'user_me') {
      matches = storeService.getMatches();
    }

    res.json({
      success: true,
      data: matches,
      count: matches.length
    });
  } catch (error: any) {
    console.error('getMatches error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch matches', error: error?.message });
  }
};
