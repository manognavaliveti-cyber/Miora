import { Router, Request, Response } from 'express';
import { getProfiles, getProfileById } from '../controllers/profileController';
import { likeProfile, passProfile, getMatches } from '../controllers/matchController';
import { getMessages, sendMessage } from '../controllers/chatController';
import { getCurrentUser, updateCurrentUser } from '../controllers/userController';
import { blockUser, unblockUser, getBlockedUsers, reportUser } from '../controllers/safetyController';

const router = Router();

// Health Check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'MIORA API',
    tagline: 'Meet. Match. Belong.',
    timestamp: new Date().toISOString()
  });
});

// Profiles
router.get('/profiles', getProfiles);
router.get('/profiles/:id', getProfileById);

// Likes & Passes
router.post('/likes', likeProfile);
router.post('/passes', passProfile);

// Matches
router.get('/matches', getMatches);

// Messages
router.get('/messages/:matchId', getMessages);
router.post('/messages', sendMessage);

// User Profile
router.get('/user/me', getCurrentUser);
router.put('/user/me', updateCurrentUser);

// Safety
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.get('/blocked', getBlockedUsers);
router.post('/report', reportUser);

export default router;
