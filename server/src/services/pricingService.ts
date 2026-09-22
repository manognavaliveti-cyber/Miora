import { getAdminFirestore } from '../lib/firebaseAdmin';

export interface MioraPricingSettings {
  chatPerMinuteInr: number;
  audioCallPerMinuteCoins: number;
  videoCallPerMinuteCoins: number;
  proPriceInr: number;
  vipPriceInr: number;
  gameChargeCoins: number;
  normalGameChargeCoins: number;
  interestingGameChargeCoins: number;
  updatedAt?: string;
  updatedBy?: string;
}

export const DEFAULT_PRICING: MioraPricingSettings = {
  chatPerMinuteInr: 3,
  audioCallPerMinuteCoins: 20,
  videoCallPerMinuteCoins: 40,
  proPriceInr: 379,
  vipPriceInr: 789,
  gameChargeCoins: 39,
  normalGameChargeCoins: 39,
  interestingGameChargeCoins: 49
};

const COLLECTION = 'app_settings';
const DOC = 'pricing';

function safeNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function normalize(data: any): MioraPricingSettings {
  const legacyGame = safeNumber(data?.gameChargeCoins, DEFAULT_PRICING.gameChargeCoins);
  return {
    chatPerMinuteInr: safeNumber(data?.chatPerMinuteInr, DEFAULT_PRICING.chatPerMinuteInr),
    audioCallPerMinuteCoins: safeNumber(data?.audioCallPerMinuteCoins, DEFAULT_PRICING.audioCallPerMinuteCoins),
    videoCallPerMinuteCoins: safeNumber(data?.videoCallPerMinuteCoins, DEFAULT_PRICING.videoCallPerMinuteCoins),
    proPriceInr: safeNumber(data?.proPriceInr, DEFAULT_PRICING.proPriceInr),
    vipPriceInr: safeNumber(data?.vipPriceInr, DEFAULT_PRICING.vipPriceInr),
    gameChargeCoins: legacyGame,
    normalGameChargeCoins: safeNumber(data?.normalGameChargeCoins, legacyGame),
    interestingGameChargeCoins: safeNumber(data?.interestingGameChargeCoins, DEFAULT_PRICING.interestingGameChargeCoins),
    updatedAt: data?.updatedAt,
    updatedBy: data?.updatedBy
  };
}

export async function getPricingSettings(): Promise<MioraPricingSettings> {
  const db = getAdminFirestore();
  const snap = await db.collection(COLLECTION).doc(DOC).get();
  return snap.exists ? normalize(snap.data()) : { ...DEFAULT_PRICING };
}

export async function savePricingSettings(
  updates: Partial<Pick<MioraPricingSettings, 'chatPerMinuteInr' | 'audioCallPerMinuteCoins' | 'videoCallPerMinuteCoins' | 'proPriceInr' | 'vipPriceInr' | 'gameChargeCoins' | 'normalGameChargeCoins' | 'interestingGameChargeCoins'>>,
  updatedBy?: string
): Promise<MioraPricingSettings> {
  const current = await getPricingSettings();
  const next = normalize({
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
    updatedBy
  });

  for (const [key, value] of Object.entries(next)) {
    if (['chatPerMinuteInr', 'audioCallPerMinuteCoins', 'videoCallPerMinuteCoins', 'proPriceInr', 'vipPriceInr', 'gameChargeCoins', 'normalGameChargeCoins', 'interestingGameChargeCoins'].includes(key)) {
      if (!Number.isFinite(value as number) || Number(value) < 0) {
        throw new Error(`${key} must be a non-negative number.`);
      }
    }
  }

  await getAdminFirestore().collection(COLLECTION).doc(DOC).set(next, { merge: true });
  return next;
}
