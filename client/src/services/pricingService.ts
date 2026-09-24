import { MIORA_PRICING, setChatPerMinuteInr } from '../config/pricing';

export interface RemotePricingSettings {
  chatPerMinuteInr: number;
  audioCallPerMinuteCoins: number;
  videoCallPerMinuteCoins: number;
  proPriceInr: number;
  vipPriceInr: number;
  gameChargeCoins?: number;
  normalGameChargeCoins?: number;
  interestingGameChargeCoins?: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function applyCallRate(packages: Array<{ minutes: number; coins: number; savingsPercent?: number }>, baseRate: number) {
  packages.forEach((pkg) => {
    const gross = baseRate * pkg.minutes;
    const discount = pkg.savingsPercent ? (100 - pkg.savingsPercent) / 100 : 1;
    pkg.coins = Math.max(1, Math.round(gross * discount));
  });
}

export function applyRemotePricing(settings: RemotePricingSettings) {
  if (!settings) return;

  // CHAT_PER_MINUTE_INR is a live binding exported from pricing.ts.
  // eslint/TS allow this module to update it through the pricing module helper below.
  setChatPerMinuteInr(settings.chatPerMinuteInr);
  applyCallRate(MIORA_PRICING.calls.audio, Math.max(0, Number(settings.audioCallPerMinuteCoins)));
  applyCallRate(MIORA_PRICING.calls.video, Math.max(0, Number(settings.videoCallPerMinuteCoins)));

  // Keep the existing first-minute UX and every caller package in sync.
  MIORA_PRICING.chat.audioCallCoins = Math.max(0, Number(settings.audioCallPerMinuteCoins));
  MIORA_PRICING.chat.videoCallCoins = Math.max(0, Number(settings.videoCallPerMinuteCoins));
  const pro = MIORA_PRICING.subscriptionPlans.find((p) => p.id === 'gold');
  const vip = MIORA_PRICING.subscriptionPlans.find((p) => p.id === 'vip');
  if (pro) { pro.priceInr = Number(settings.proPriceInr); pro.pricePerMonthInr = Number(settings.proPriceInr); pro.coinPrice = Number(settings.proPriceInr); }
  if (vip) { vip.priceInr = Number(settings.vipPriceInr); vip.pricePerMonthInr = Number(settings.vipPriceInr); vip.coinPrice = Number(settings.vipPriceInr); }
  const normal = Number(settings.normalGameChargeCoins ?? settings.gameChargeCoins ?? 39);
  const interesting = Number(settings.interestingGameChargeCoins ?? 49);
  MIORA_PRICING.games.normalGameChargeCoins = Number.isFinite(normal) && normal >= 0 ? normal : 39;
  MIORA_PRICING.games.interestingGameChargeCoins = Number.isFinite(interesting) && interesting >= 0 ? interesting : 49;
  MIORA_PRICING.games.gameChargeCoins = MIORA_PRICING.games.normalGameChargeCoins;
}

export async function loadRemotePricing(): Promise<RemotePricingSettings | null> {
  try {
    const response = await fetch(`${API_BASE}/api/pricing`);
    if (!response.ok) return null;
    const settings = await response.json() as RemotePricingSettings;
    applyRemotePricing(settings);
    return settings;
  } catch (error) {
    console.warn('Using local MIORA pricing defaults:', error);
    return null;
  }
}
