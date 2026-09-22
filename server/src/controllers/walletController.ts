import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { debitWallet, getWallet } from '../services/walletService';

export const getWalletBalance = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const wallet = await getWallet(req.userId!);
    res.json({ success: true, data: wallet });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to load wallet' });
  }
};

export const debitWalletBalance = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const amount = Number(req.body?.amount);
    const wallet = await debitWallet(req.userId!, amount);
    res.json({ success: true, data: wallet });
  } catch (err: any) {
    res.status(err.status || 500).json({ success: false, message: err.message || 'Wallet debit failed' });
  }
};
