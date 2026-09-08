// MIORA Razorpay Payment Service
// Integrates Razorpay Standard Checkout with Spring Boot backend order creation & cryptographic verification.

import { apiService } from './api';

export interface RazorpayCheckoutOptions {
  packageId: string;
  userName?: string;
  userEmail?: string;
  onSuccess: (result: {
    newBalance: number;
    coinsAdded: number;
    razorpayPaymentId: string;
    razorpayOrderId: string;
  }) => void;
  onError: (errorMessage: string) => void;
  onDismiss?: () => void;
}

export class RazorpayPaymentService {
  /**
   * Initiates Razorpay Standard Checkout:
   * 1. Requests authentic order from Spring Boot backend (POST /api/wallet/payment/create-order)
   * 2. Opens Razorpay standard checkout popup with MIORA theme & test payment methods
   * 3. On payment capture, sends details to Spring Boot (POST /api/wallet/payment/verify)
   * 4. Updates wallet balance ONLY after server verification succeeds
   */
  async initiateCheckout(options: RazorpayCheckoutOptions): Promise<void> {
    try {
      // 1. Request authentic order from Spring Boot backend
      const orderData = await apiService.createPaymentOrder(options.packageId);

      if (!orderData || !orderData.orderId || !orderData.keyId) {
        throw new Error('Failed to create Razorpay payment order on backend.');
      }

      // Check if Razorpay SDK script is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error('Razorpay SDK is loading. Please check your internet connection and try again.');
      }

      // 2. Configure Razorpay Standard Checkout options with UPI enabled
      const rzpOptions = {
        key: orderData.keyId,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'MIORA',
        description: `${orderData.packageName || orderData.coins + ' MIORA Coins'} (TEST)`,
        order_id: orderData.orderId,
        prefill: {
          name: options.userName || 'MIORA Member',
          email: options.userEmail || 'dev@miora.app',
          contact: '9876543210'
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true
        },
        theme: {
          color: '#E11D48', // MIORA berry brand color
          backdrop_color: 'rgba(31, 22, 26, 0.75)'
        },
        modal: {
          confirm_close: true,
          ondismiss: () => {
            if (options.onDismiss) {
              options.onDismiss();
            }
          }
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 3. Cryptographic server-side signature verification
            const verifyRes = await apiService.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              packageId: orderData.packageId
            });

            if (verifyRes && verifyRes.success) {
              options.onSuccess({
                newBalance: verifyRes.newBalance,
                coinsAdded: verifyRes.coinsAdded,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              });
            } else {
              options.onError(verifyRes?.message || 'Payment signature verification failed.');
            }
          } catch (err: any) {
            options.onError(err?.message || 'Server error during payment verification.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(rzpOptions);

      rzp.on('payment.failed', (resp: any) => {
        const errorDesc = resp?.error?.description || resp?.error?.reason || 'Payment could not be completed.';
        options.onError(errorDesc);
      });

      rzp.open();
    } catch (err: any) {
      options.onError(err?.message || 'Failed to initiate Razorpay checkout.');
    }
  }
}

export const paymentService = new RazorpayPaymentService();
