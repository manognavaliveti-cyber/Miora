import { getAdminFirestore } from '../lib/firebaseAdmin';

export const TEST_DEFAULT_WALLET_INR = Number(process.env.TEST_DEFAULT_WALLET_INR ?? 1000);

export interface WalletState {
  walletBalance: number;
  coinBalance: number;
}

const userRef = (uid: string) => getAdminFirestore().collection('users').doc(uid);

export async function getWallet(uid: string): Promise<WalletState> {
  const ref = userRef(uid);
  return getAdminFirestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    const existing = Number(data.walletBalance ?? data.coinBalance);
    if (Number.isFinite(existing) && existing >= 0) {
      return { walletBalance: existing, coinBalance: existing };
    }

    const initial = Math.max(0, TEST_DEFAULT_WALLET_INR);
    tx.set(ref, { walletBalance: initial, coinBalance: initial, updatedAt: new Date().toISOString() }, { merge: true });
    return { walletBalance: initial, coinBalance: initial };
  });
}

export async function debitWallet(uid: string, amount: number): Promise<WalletState> {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw Object.assign(new Error('Debit amount must be greater than zero.'), { status: 400 });
  }

  const ref = userRef(uid);
  return getAdminFirestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    const current = Number(data.walletBalance ?? data.coinBalance ?? TEST_DEFAULT_WALLET_INR);
    const balance = Number.isFinite(current) && current >= 0 ? current : Math.max(0, TEST_DEFAULT_WALLET_INR);
    if (balance < amount) {
      throw Object.assign(new Error(`Insufficient wallet balance. Available ₹${balance.toFixed(2)}, required ₹${amount.toFixed(2)}.`), { status: 400 });
    }
    const next = Math.round((balance - amount) * 100) / 100;
    tx.set(ref, { walletBalance: next, coinBalance: next, updatedAt: new Date().toISOString() }, { merge: true });
    return { walletBalance: next, coinBalance: next };
  });
}
