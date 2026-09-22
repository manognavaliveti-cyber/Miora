import { withTestWallet } from '../config/testing';

/**
 * Keeps the wallet balance across page refreshes.
 * Spending (chat / calls / gifts) only changes React state, so without this the
 * balance would jump back to whatever was last saved on the server / profile.
 */
const key = (uid: string) => `miora_wallet_${uid}`;

export const readSavedWallet = (uid?: string | null): number | null => {
  if (!uid) return null;
  try {
    const raw = localStorage.getItem(key(uid));
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
};

export const saveWallet = (uid: string | undefined | null, balance: number): void => {
  if (!uid) return;
  try {
    localStorage.setItem(key(uid), String(Math.round(balance * 100) / 100));
  } catch {
    /* storage full / blocked — ignore */
  }
};

/**
 * Decides the wallet a freshly loaded user starts with:
 *  1. the balance saved on this device (so spending survives a refresh), else
 *  2. the free test balance (first time only, see config/testing.ts), else
 *  3. whatever the profile already had.
 */
export const resolveWallet = <T extends { id?: string; walletBalance?: number; coinBalance?: number }>(user: T): T => {
  // A server/Firebase wallet value is authoritative. Local storage is only a
  // fallback for offline/local development when the server has not supplied one.
  if (typeof user.walletBalance === 'number' && user.walletBalance > 0) return { ...user, coinBalance: user.walletBalance };
  const saved = readSavedWallet(user.id);
  if (saved !== null) return { ...user, walletBalance: saved, coinBalance: saved };
  return withTestWallet(user);
};
