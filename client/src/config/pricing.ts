// MIORA Centralized Pricing Configuration
// All monetary values (in ₹ INR), coin rates, packages, and rewards are defined here.

export interface RechargePackage {
  id: string;
  priceInr: number;
  coins: number;
  bonusCoins: number;
  popular?: boolean;
  bestValue?: boolean;
  tagline?: string;
}

export interface VirtualGiftDef {
  id: string;
  name: string;
  emoji: string;
  coinValue: number;
  description: string;
  category: 'romantic' | 'luxury' | 'fun';
  animation: 'hearts-burst' | 'rose-rain' | 'diamond-sparkle' | 'crown-glow' | 'fire-flame';
}

export interface EarnCoinTask {
  id: string;
  title: string;
  rewardCoins: number;
  icon: string;
  description: string;
  completed?: boolean;
  actionText: string;
}

export const MIORA_PRICING = {
  // 1. Talk Time Monetization
  talkTime: {
    inrPer20Minutes: 14, // ₹14 for 20 minutes
    coinsPer10Minutes: 50, // 50 coins for 10 minutes extension
    coinsPer20Minutes: 100, // 100 coins for 20 minutes
    defaultFreeMinutes: 3, // 3 minutes trial per new match
    warningThresholdSeconds: 120 // Warn user when 2 minutes left
  },

  // 1b. Profile Verification Check
  verificationCheck: {
    coins: 60 // 60 coins to unlock & inspect profile verification certificate
  },

  // 2. Official Recharge Packages (Razorpay)
  rechargePackages: [
    {
      id: 'coins_100',
      priceInr: 49,
      coins: 100,
      bonusCoins: 0,
      tagline: 'Starter Pack'
    },
    {
      id: 'coins_250',
      priceInr: 99,
      coins: 250,
      bonusCoins: 25,
      popular: true,
      tagline: 'Most Popular'
    },
    {
      id: 'coins_600',
      priceInr: 199,
      coins: 600,
      bonusCoins: 80,
      tagline: 'Romance Sparks'
    },
    {
      id: 'coins_1500',
      priceInr: 399,
      coins: 1500,
      bonusCoins: 250,
      bestValue: true,
      tagline: 'VIP True Love'
    }
  ] as RechargePackage[],

  // 3. Virtual Gifts Catalog
  gifts: [
    {
      id: 'gift_rose',
      name: 'Rose',
      emoji: '🌹',
      coinValue: 10,
      description: 'A classic romantic red rose',
      category: 'romantic',
      animation: 'rose-rain'
    },
    {
      id: 'gift_sparkle',
      name: 'Sparkle',
      emoji: '✨',
      coinValue: 15,
      description: 'Sprinkle some starlight magic',
      category: 'fun',
      animation: 'hearts-burst'
    },
    {
      id: 'gift_fire',
      name: 'Fire',
      emoji: '🔥',
      coinValue: 15,
      description: 'You are looking undeniably hot',
      category: 'fun',
      animation: 'fire-flame'
    },
    {
      id: 'gift_heart',
      name: 'Heart',
      emoji: '❤️',
      coinValue: 20,
      description: 'Pure romantic affection',
      category: 'romantic',
      animation: 'hearts-burst'
    },
    {
      id: 'gift_kiss',
      name: 'Sweet Kiss',
      emoji: '💋',
      coinValue: 25,
      description: 'A tender kiss across screens',
      category: 'romantic',
      animation: 'hearts-burst'
    },
    {
      id: 'gift_love',
      name: 'Love Heart',
      emoji: '💖',
      coinValue: 30,
      description: 'Glowing with genuine love',
      category: 'romantic',
      animation: 'hearts-burst'
    },
    {
      id: 'gift_teddy',
      name: 'Teddy',
      emoji: '🧸',
      coinValue: 40,
      description: 'Fluffy cute cuddle buddy',
      category: 'fun',
      animation: 'rose-rain'
    },
    {
      id: 'gift_box',
      name: 'Luxury Gift Box',
      emoji: '🎁',
      coinValue: 50,
      description: 'A lavish secret surprise',
      category: 'luxury',
      animation: 'hearts-burst'
    },
    {
      id: 'gift_diamond',
      name: 'Diamond',
      emoji: '💎',
      coinValue: 100,
      description: 'Rare, precious and everlasting',
      category: 'luxury',
      animation: 'diamond-sparkle'
    },
    {
      id: 'gift_crown',
      name: 'Crown',
      emoji: '👑',
      coinValue: 250,
      description: 'For your royalty partner',
      category: 'luxury',
      animation: 'crown-glow'
    }
  ] as VirtualGiftDef[],

  // 4. MIORA Play (Couple Games) Pricing
  games: {
    freeBasicQuestions: true,
    premiumQuestionsCoins: 20, // 20 coins to unlock premium questions
    premiumGamePackInr: 9, // ₹9 premium game pack
    gameWinRewardCoins: 15, // +15 coins upon completing a couple game
    dailyCheckinRewardCoins: 10,
    profileCompletionRewardCoins: 20
  },

  // 5. Earn Coins Tasks
  earnTasks: [
    {
      id: 'task_daily',
      title: 'Daily Check-in',
      rewardCoins: 10,
      icon: '✨',
      description: 'Claim your daily romance bonus coins',
      actionText: 'Claim +10'
    },
    {
      id: 'task_profile',
      title: 'Complete Profile',
      rewardCoins: 20,
      icon: '🌸',
      description: 'Add bio, photos, and 5 interests',
      actionText: 'Completed'
    },
    {
      id: 'task_play_game',
      title: 'Play a Couple Game',
      rewardCoins: 15,
      icon: '🎮',
      description: 'Play Would You Rather or Compatibility Quiz with a match',
      actionText: 'Play & Earn +15'
    },
    {
      id: 'task_join_room',
      title: 'Join a Dating Room',
      rewardCoins: 10,
      icon: '🎙️',
      description: 'Listen and share dating advice in live rooms',
      actionText: 'Join +10'
    },
    {
      id: 'task_post_feed',
      title: 'Post a Dating Thought',
      rewardCoins: 10,
      icon: '📱',
      description: 'Share a romantic thought or 24h status update',
      actionText: 'Post +10'
    }
  ] as EarnCoinTask[]
};
