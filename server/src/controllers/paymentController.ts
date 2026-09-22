import { Response } from 'express';
import { AuthedRequest } from '../middleware/auth';
import { createOrder, verifyAndCreditPayment } from '../services/razorpayService';

export const createPaymentOrder = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const productId = req.body?.productId || req.body?.packageId;
    if (!productId) {
      res.status(400).json({ success: false, message: 'Product/Package ID is required' });
      return;
    }
    const order = await createOrder(userId, productId);
    res.json({ success: true, message: 'Razorpay order created successfully', data: order });
  } catch (err: any) {
    console.error('createPaymentOrder error:', err.message);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Payment order creation failed' });
  }
};

export const verifyPayment = async (req: AuthedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, productId, packageId } = req.body || {};

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      res.status(400).json({ success: false, message: 'Missing required Razorpay payment verification parameters' });
      return;
    }

    const result = await verifyAndCreditPayment(
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      (productId || packageId || 'pack_150').toString()
    );

    res.json({ success: true, message: 'Payment verified successfully', data: result });
  } catch (err: any) {
    console.error('verifyPayment error:', err.message);
    res.status(err.status || 500).json({ success: false, message: err.message || 'Payment verification error' });
  }
};
