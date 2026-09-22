import crypto from 'crypto';
import Razorpay from 'razorpay';
import { getAdminFirestore } from '../lib/firebaseAdmin';
import { getPricingSettings } from './pricingService';

export interface CoinPackage {
  id: string;
  type: 'WALLET_TOPUP' | 'GOLD_SUBSCRIPTION' | 'VIP_SUBSCRIPTION';
  walletCreditInr: number; // total ₹ credited to the wallet on success
  priceInr: number;        // what the person actually pays
  name: string;
  icon: string;
}

// Mirrors client/src/config/pricing.ts (rechargePackages + subscriptionPlans) and
// server-springboot's RazorpayService.java 1:1 — same ids, same prices, same credit.
const PACKAGES: Record<string, CoinPackage> = {
  gold: { id: 'gold', type: 'GOLD_SUBSCRIPTION', walletCreditInr: 0, priceInr: 379, name: 'MIORA Gold', icon: '⚡' },
  pro: { id: 'gold', type: 'GOLD_SUBSCRIPTION', walletCreditInr: 0, priceInr: 379, name: 'MIORA Gold', icon: '⚡' },
  vip: { id: 'vip', type: 'VIP_SUBSCRIPTION', walletCreditInr: 1500, priceInr: 999, name: 'MIORA VIP Royalty', icon: '👑' },

  pack_150: { id: 'pack_150', type: 'WALLET_TOPUP', walletCreditInr: 150, priceInr: 79, name: '₹150 Wallet Credit', icon: '✨' },
  wallet_150_promo: { id: 'pack_150', type: 'WALLET_TOPUP', walletCreditInr: 150, priceInr: 79, name: '₹150 Wallet Credit', icon: '✨' },
  pack_100: { id: 'pack_100', type: 'WALLET_TOPUP', walletCreditInr: 100, priceInr: 100, name: '₹100 Wallet Credit', icon: '🌱' },
  pack_39: { id: 'pack_39', type: 'WALLET_TOPUP', walletCreditInr: 39, priceInr: 39, name: '₹39 Wallet Credit', icon: '🎮' },
  pack_49: { id: 'pack_49', type: 'WALLET_TOPUP', walletCreditInr: 49, priceInr: 49, name: '₹49 Wallet Credit', icon: '🎮' },
  pack_500: { id: 'pack_500', type: 'WALLET_TOPUP', walletCreditInr: 550, priceInr: 500, name: '₹500 Wallet Credit', icon: '🔥' },
  wallet_1000: { id: 'wallet_1000', type: 'WALLET_TOPUP', walletCreditInr: 1200, priceInr: 1000, name: 'Add ₹1000', icon: '💎' },
  wallet_2500: { id: 'wallet_2500', type: 'WALLET_TOPUP', walletCreditInr: 3200, priceInr: 2500, name: 'VIP Pack ₹2500', icon: '👑' }
};

export function getPackage(id: string | undefined | null): CoinPackage | null {
  if (!id) return null;
  return PACKAGES[id.trim().toLowerCase()] || null;
}

function getRazorpayClient(): Razorpay {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set in server/.env');
  }
  return new Razorpay({ key_id, key_secret });
}

export async function createOrder(userId: string, packageId: string) {
  const pkg = await getDynamicPackage(packageId);
  if (!pkg) throw Object.assign(new Error(`Unknown package id: ${packageId}`), { status: 400 });

  const rzp = getRazorpayClient();
  const amountPaise = Math.round(pkg.priceInr * 100);

  const order = await rzp.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `rcpt_${userId.slice(0, 10)}_${Date.now()}`,
    notes: { userId, packageId: pkg.id }
  });

  return {
    orderId: order.id,
    amount: amountPaise,
    amountInr: pkg.priceInr,
    walletCreditInr: pkg.walletCreditInr,
    currency: 'INR',
    keyId: process.env.RAZORPAY_KEY_ID,
    packageId: pkg.id,
    productId: pkg.id,
    productType: pkg.type,
    coins: pkg.walletCreditInr,
    packageName: pkg.name,
    productName: pkg.name
  };
}

async function getDynamicPackage(id: string | undefined | null): Promise<CoinPackage | null> {
  const base = getPackage(id);
  if (!base) return null;
  const pricing = await getPricingSettings();
  if (base.id === 'gold' || base.id === 'pro') return { ...base, id: 'pro', priceInr: pricing.proPriceInr, name: 'MIORA PRO' };
  if (base.id === 'vip') return { ...base, priceInr: pricing.vipPriceInr };
  return base;
}

export async function verifyAndCreditPayment(
  userId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  packageId: string
) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw Object.assign(new Error('RAZORPAY_KEY_SECRET not set'), { status: 500 });

  // 1. Cryptographic signature check — this is what actually proves the payment is real.
  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  const signatureValid =
    expected.length === razorpaySignature?.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpaySignature));

  if (!signatureValid) {
    throw Object.assign(new Error('Payment signature verification failed.'), { status: 403 });
  }

  const pkg = await getDynamicPackage(packageId);
  if (!pkg) throw Object.assign(new Error(`Unknown package id: ${packageId}`), { status: 400 });

  const db = getAdminFirestore();
  const userRef = db.collection('users').doc(userId);
  const txRef = db.collection('paymentTransactions').doc(razorpayPaymentId);

  // 2. Idempotency — never credit the same payment twice.
  const existingTx = await txRef.get();
  if (existingTx.exists) {
    const data = existingTx.data() as any;
    return {
      success: true,
      message: 'Payment already verified.',
      newWalletBalance: data.balanceAfter,
      creditAddedInr: 0,
      isPremium: data.isPremium ?? false,
      subscriptionTier: data.subscriptionTier ?? 'free',
      newBalance: data.balanceAfter,
      coinsAdded: 0,
      razorpayOrderId,
      razorpayPaymentId
    };
  }

  const userSnap = await userRef.get();
  const currentBalance = Number(userSnap.data()?.walletBalance ?? userSnap.data()?.coinBalance ?? 0);
  const newBalance = currentBalance + pkg.walletCreditInr;

  const updates: Record<string, any> = {
    walletBalance: newBalance,
    coinBalance: newBalance
  };

  let isPremium = Boolean(userSnap.data()?.isPremium);
  let tier = userSnap.data()?.subscriptionTier ?? 'free';

  if (pkg.type === 'GOLD_SUBSCRIPTION' || pkg.type === 'VIP_SUBSCRIPTION') {
    isPremium = true;
    tier = pkg.type === 'VIP_SUBSCRIPTION' ? 'vip' : 'gold';
    updates.isPremium = true;
    updates.subscriptionTier = tier;
    updates.subscriptionPlanId = pkg.id;
    updates.subscriptionExpiresAt = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString();
  }

  // 3. Apply the credit / subscription and record the transaction, together.
  await userRef.set(updates, { merge: true });
  await txRef.set({
    userId,
    packageId: pkg.id,
    type: pkg.type,
    priceInr: pkg.priceInr,
    creditAddedInr: pkg.walletCreditInr,
    balanceBefore: currentBalance,
    balanceAfter: newBalance,
    isPremium,
    subscriptionTier: tier,
    razorpayOrderId,
    razorpayPaymentId,
    status: 'SUCCESS',
    createdAt: new Date().toISOString()
  });

  return {
    success: true,
    message:
      pkg.type === 'WALLET_TOPUP'
        ? `Payment verified! ₹${pkg.walletCreditInr} has been added to your MIORA Wallet.`
        : `Welcome to MIORA ${tier === 'vip' ? 'VIP Royalty' : 'Gold'}! 28 days active.`,
    newWalletBalance: newBalance,
    creditAddedInr: pkg.walletCreditInr,
    isPremium,
    subscriptionTier: tier,
    newBalance,
    coinsAdded: pkg.walletCreditInr,
    razorpayOrderId,
    razorpayPaymentId
  };
}
