// ─────────────────────────────────────────────────────────────────────────────
// TEST MODE — free starting wallet.
// Every fresh load / login starts with at least this many ₹ in the wallet so you
// can try chat, calls, gifts and games without paying.
// Set to 0 before going live to turn this off completely.
// ─────────────────────────────────────────────────────────────────────────────
export const TEST_DEFAULT_WALLET_INR = 0;

/** Raises the wallet to the test amount if it is lower (no-op when test mode is off). */
export const withTestWallet = <T extends { walletBalance?: number; coinBalance?: number }>(user: T): T => {
  if (TEST_DEFAULT_WALLET_INR <= 0) return user;
  if ((user.walletBalance || 0) >= TEST_DEFAULT_WALLET_INR) return user;
  return { ...user, walletBalance: TEST_DEFAULT_WALLET_INR, coinBalance: TEST_DEFAULT_WALLET_INR };
};
