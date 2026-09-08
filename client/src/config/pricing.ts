// MIORA Centralized Pricing Configuration
// All monetary values (in ₹ INR), coin rates, packages, and rewards are defined here.

export interface RechargePackage {
  id: string;
  name?: string;
  icon?: string;
  priceInr: number;
  coins: number;
  bonusCoins: number;
  popular?: boolean;
  bestValue?: boolean;
  tagline?: string;
}

export interface SubscriptionPlanDef {
  id: 'monthly' | 'quarterly' | 'yearly';
  name: string;
  billingPeriod: '1 Month' | '3 Months' | '1 Year';
  priceInr: number;
  pricePerMonthInr: number;
  coinPrice: number;
  discountPercent?: number;
  popular?: boolean;
  bestValue?: boolean;
  badge?: string;
  features: string[];
}

export interface PowerUpPackage {
  id: string;
  name: string;
  type: 'boost' | 'spotlight' | 'superlike';
  count: number;
  priceInr: number;
  coinPrice: number;
  popular?: boolean;
  tagline: string;
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
  // 1. Swiping Limits & Free Tier Limits
  limits: {
    freeDailySwipes: 20, // 20 swipes per 24 hours for free users
    freeSuperLikesPerWeek: 1, // 1 free super like / week for free users
    premiumDailySuperLikes: 5, // 5 free super likes / day for premium
    freeWhoLikedMeBlurredCount: 12 // teaser count
  },

  // 2. Subscriptions (Monthly, Quarterly, Yearly)
  subscriptionPlans: [
    {
      id: 'monthly',
      name: 'MIORA Gold Monthly',
      billingPeriod: '1 Month',
      priceInr: 299,
      pricePerMonthInr: 299,
      coinPrice: 450,
      badge: 'Flexible',
      features: [
        'Unlimited Daily Swipes & Likes',
        'See Who Liked You (Unblurred Full Profiles)',
        '5 Free Super Likes every day',
        '1 Free 30-min Boost per month',
        'All Advanced Lifestyle & Verified Filters',
        'Rewind last swipe anytime'
      ]
    },
    {
      id: 'quarterly',
      name: 'MIORA Gold Quarterly',
      billingPeriod: '3 Months',
      priceInr: 699,
      pricePerMonthInr: 233,
      coinPrice: 1050,
      discountPercent: 22,
      popular: true,
      badge: 'Most Popular (Save 22%)',
      features: [
        'Everything in Monthly',
        'Save 22% on monthly rate',
        '3 Free Boosts included',
        'Priority Match Queue placement',
        'Direct DM without waiting for match (1/week)',
        'VIP Golden Badge on your profile'
      ]
    },
    {
      id: 'yearly',
      name: 'MIORA VIP Platinum Yearly',
      billingPeriod: '1 Year',
      priceInr: 1999,
      pricePerMonthInr: 166,
      coinPrice: 3000,
      discountPercent: 44,
      bestValue: true,
      badge: 'Best Value (Save 44%)',
      features: [
        'Everything in Quarterly',
        'Maximum 44% Savings (Only ₹166/month)',
        '12 Free Profile Boosts + 4 Spotlights',
        'Unlimited Super Likes & Rewinds',
        'Incognito / Invisible Browsing Mode',
        'Crown Platinum VIP Profile Frame',
        'Dedicated 24/7 Priority Support'
      ]
    }
  ] as SubscriptionPlanDef[],

  // 3. Power-Ups (Boost, Spotlight, Super Like Packs)
  powerUps: {
    boost: {
      durationMinutes: 30,
      visibilityMultiplier: '10x',
      singleCoins: 50,
      singleInr: 29,
      packages: [
        {
          id: 'boost_1',
          name: '1 Profile Boost',
          type: 'boost',
          count: 1,
          priceInr: 29,
          coinPrice: 50,
          tagline: '30 mins of 10x visibility'
        },
        {
          id: 'boost_5',
          name: '5 Profile Boosts',
          type: 'boost',
          count: 5,
          priceInr: 119,
          coinPrice: 200,
          popular: true,
          tagline: 'Save 20% • Best for weekends'
        },
        {
          id: 'boost_10',
          name: '10 Profile Boosts',
          type: 'boost',
          count: 10,
          priceInr: 199,
          coinPrice: 350,
          tagline: 'Save 30% • Ultimate romance pack'
        }
      ] as PowerUpPackage[]
    },
    spotlight: {
      durationHours: 24,
      singleCoins: 100,
      singleInr: 49,
      packages: [
        {
          id: 'spotlight_1',
          name: '1 Profile Spotlight',
          type: 'spotlight',
          count: 1,
          priceInr: 49,
          coinPrice: 100,
          tagline: '24h featured Discover banner'
        },
        {
          id: 'spotlight_3',
          name: '3 Profile Spotlights',
          type: 'spotlight',
          count: 3,
          priceInr: 119,
          coinPrice: 240,
          popular: true,
          tagline: '3 Days of top banner placement'
        }
      ] as PowerUpPackage[]
    },
    superLikes: {
      packages: [
        {
          id: 'superlike_5',
          name: '5 Super Likes',
          type: 'superlike',
          count: 5,
          priceInr: 29,
          coinPrice: 40,
          tagline: 'Stand out 3x more'
        },
        {
          id: 'superlike_15',
          name: '15 Super Likes',
          type: 'superlike',
          count: 15,
          priceInr: 69,
          coinPrice: 100,
          popular: true,
          tagline: 'Most Popular choice'
        },
        {
          id: 'superlike_30',
          name: '30 Super Likes',
          type: 'superlike',
          count: 30,
          priceInr: 119,
          coinPrice: 180,
          tagline: 'Best value super-like bundle'
        }
      ] as PowerUpPackage[]
    }
  },

  // 4. Talk Time Monetization
  talkTime: {
    inrPer20Minutes: 14,
    coinsPer10Minutes: 50,
    coinsPer20Minutes: 100,
    defaultFreeMinutes: 3,
    warningThresholdSeconds: 120
  },

  // 4b. Profile Verification Check
  verificationCheck: {
    coins: 60
  },

  // 5. Official Recharge Packages (Razorpay)
  rechargePackages: [
    {
      id: 'coins_100',
      name: 'Starter',
      icon: '🌱',
      priceInr: 99,
      coins: 100,
      bonusCoins: 0,
      tagline: '🌱 Starter Pack'
    },
    {
      id: 'coins_350',
      name: 'Popular',
      icon: '💕',
      priceInr: 299,
      coins: 350,
      bonusCoins: 50,
      popular: true,
      tagline: '💕 Popular Pack'
    },
    {
      id: 'coins_750',
      name: 'Value Pack',
      icon: '🔥',
      priceInr: 499,
      coins: 750,
      bonusCoins: 150,
      popular: true,
      tagline: '🔥 Value Pack'
    },
    {
      id: 'coins_1500',
      name: 'Premium',
      icon: '💎',
      priceInr: 899,
      coins: 1500,
      bonusCoins: 400,
      tagline: '💎 Premium Pack'
    },
    {
      id: 'coins_3500',
      name: 'VIP Pack',
      icon: '👑',
      priceInr: 1799,
      coins: 3500,
      bonusCoins: 1000,
      tagline: '👑 VIP Royalty Pack'
    },
    {
      id: 'coins_7500',
      name: 'Ultimate',
      icon: '🏆',
      priceInr: 3499,
      coins: 7500,
      bonusCoins: 2500,
      bestValue: true,
      tagline: '🏆 Ultimate Romance Pack'
    }
  ] as RechargePackage[],

  // 6. Virtual Gifts Catalog
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

  // 7. MIORA Play (Couple Games) Pricing
  games: {
    freeBasicQuestions: true,
    premiumQuestionsCoins: 20,
    premiumGamePackInr: 9,
    gameWinRewardCoins: 15,
    dailyCheckinRewardCoins: 10,
    profileCompletionRewardCoins: 20
  },

  // 8. Earn Coins Tasks
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
