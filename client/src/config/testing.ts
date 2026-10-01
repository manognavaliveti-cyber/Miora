// ─────────────────────────────────────────────────────────────────────────────
// TEST MODE — free starting wallet.
// Every fresh load / login starts with at least this many ₹ in the wallet so you
// can try chat, calls, gifts and games without paying.
// Set to 0 before going live to turn this off completely.
// ─────────────────────────────────────────────────────────────────────────────
export const TEST_DEFAULT_WALLET_INR = 0;

/** No free test balance — new users start with ₹0. */
export const withTestWallet = <T extends { walletBalance?: number; coinBalance?: number }>(user: T): T => {
  return {
    ...user,
    walletBalance: user.walletBalance ?? 0,
    coinBalance: user.coinBalance ?? 0
  };
};

