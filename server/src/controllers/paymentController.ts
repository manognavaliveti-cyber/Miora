import { Request, Response } from 'express';
import crypto from 'crypto';
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

export const handleRazorpayWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

    if (!webhookSecret || !signature) {
      res.status(400).json({ success: false, message: 'Missing Razorpay webhook signature or secret credentials' });
      return;
    }

    // Cryptographically verify webhook signature
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const isValid =
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature));

    if (!isValid) {
      res.status(400).json({ success: false, message: 'Invalid Razorpay webhook signature' });
      return;
    }

    const payload = req.body?.payload;
    const event = req.body?.event;

    // Process payment.captured or order.paid events securely
    if ((event === 'payment.captured' || event === 'order.paid') && payload?.payment?.entity) {
      const paymentEntity = payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;
      const userId = paymentEntity.notes?.userId;
      const packageId = paymentEntity.notes?.packageId || 'pack_150';

      if (userId && razorpayOrderId && razorpayPaymentId) {
        await verifyAndCreditPayment(
          userId,
          razorpayOrderId,
          razorpayPaymentId,
          signature,
          packageId
        );
      }
    }

    res.json({ success: true, status: 'processed' });
  } catch (err: any) {
    console.error('Razorpay webhook processing error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error processing webhook' });
  }
};
