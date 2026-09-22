import { Request, Response, NextFunction } from 'express';
import { getAdminAuth } from '../lib/firebaseAdmin';

export interface AuthedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Verifies the Firebase ID token sent as `Authorization: Bearer <token>`
 * (the client's services/api.ts already attaches this on every request).
 * Payment routes must never trust a client-supplied user id — only the
 * verified token's uid is used.
 */
export const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      res.status(401).json({ success: false, message: 'Missing Authorization bearer token.' });
      return;
    }

    const decoded = await getAdminAuth().verifyIdToken(token);
    req.userId = decoded.uid;
    req.userEmail = decoded.email;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please sign in again.' });
  }
};
