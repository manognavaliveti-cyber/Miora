import { Router, Request, Response } from 'express';
import { getProfiles, getProfileById } from '../controllers/profileController';
import { likeProfile, passProfile, getMatches } from '../controllers/matchController';
import { getMessages, sendMessage, deleteMessage } from '../controllers/chatController';
import { getCurrentUser, updateCurrentUser } from '../controllers/userController';
import { blockUser, unblockUser, getBlockedUsers, reportUser } from '../controllers/safetyController';
import { createPaymentOrder, verifyPayment } from '../controllers/paymentController';
import {
  getDashboard,
  getUsers,
  getUserDetail,
  warnUser,
  suspendUser,
  banUser,
  deleteUser,
  getReports,
  updateReport,
  getPayments,
  getAuditLogs,
  getPricing,
  updatePricing
} from '../controllers/adminController';
import { requireAuth } from '../middleware/auth';
import { getWalletBalance, debitWalletBalance } from '../controllers/walletController';
import { requireAdmin } from '../middleware/adminAuth';

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

// Public runtime pricing used by the client. Admin updates are protected below.
router.get('/pricing', async (req, res) => {
  const { getPricingSettings } = await import('../services/pricingService');
  try {
    res.json(await getPricingSettings());
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to load pricing' });
  }
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
router.delete('/messages/:matchId/:messageId', deleteMessage);

// User Profile
router.get('/user/me', getCurrentUser);
router.get('/wallet', requireAuth, getWalletBalance);
router.post('/wallet/debit', requireAuth, debitWalletBalance);
router.put('/user/me', updateCurrentUser);

// Safety
router.post('/block', blockUser);
router.post('/unblock', unblockUser);
router.get('/blocked', getBlockedUsers);
router.post('/report', reportUser);

// Razorpay — real money in test mode, verified server-side, requires a valid
// signed-in Firebase user (the client already sends the ID token automatically).
router.post('/wallet/payment/create-order', requireAuth, createPaymentOrder);
router.post('/create-order', requireAuth, createPaymentOrder);
router.post('/wallet/payment/verify', requireAuth, verifyPayment);
router.post('/verify-payment', requireAuth, verifyPayment);

// Admin Panel — every route requires a Firebase ID token with the
// `admin: true` custom claim (see middleware/adminAuth.ts and
// server/src/scripts/setAdminClaim.ts). Matches admin-client/src/App.tsx 1:1.
router.get('/admin/dashboard', requireAdmin, getDashboard);
router.get('/admin/users', requireAdmin, getUsers);
router.get('/admin/users/:uid', requireAdmin, getUserDetail);
router.post('/admin/users/:uid/warn', requireAdmin, warnUser);
router.post('/admin/users/:uid/suspend', requireAdmin, suspendUser);
router.post('/admin/users/:uid/ban', requireAdmin, banUser);
router.post('/admin/users/:uid/delete', requireAdmin, deleteUser);
router.get('/admin/reports', requireAdmin, getReports);
router.put('/admin/reports/:id', requireAdmin, updateReport);
router.get('/admin/payments', requireAdmin, getPayments);
router.get('/admin/audit-logs', requireAdmin, getAuditLogs);
router.get('/admin/pricing', requireAdmin, getPricing);
router.put('/admin/pricing', requireAdmin, updatePricing);

export default router;
