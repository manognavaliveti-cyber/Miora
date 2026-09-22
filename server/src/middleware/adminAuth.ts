import { Response, NextFunction } from 'express';
import { getAdminAuth } from '../lib/firebaseAdmin';
import { AuthedRequest } from './auth';

/**
 * Verifies the Firebase ID token AND requires the `admin: true` custom claim.
 * This is the gate for every /api/admin/* route — it replaces requireAuth
 * (it does everything requireAuth does, plus the privilege check), so admin
 * routes should use ONLY this middleware, not requireAuth + this together.
 *
 * To make an account an admin, run:
 *   npm run grant-admin -- someone@example.com
 * (see server/src/scripts/setAdminClaim.ts). The user must sign out and back
 * in (or call getIdToken(true)) after the claim is granted for it to appear
 * in a fresh ID token.
 */
export const requireAdmin = async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      res.status(401).json({ success: false, message: 'Missing Authorization bearer token.' });
      return;
    }

    const decoded = await getAdminAuth().verifyIdToken(token);

    if (decoded.admin !== true) {
      res.status(403).json({
        success: false,
        message: '403 Forbidden: this account does not have Administrator claims (admin: true).'
      });
      return;
    }

    req.userId = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please sign in again.' });
  }
};
