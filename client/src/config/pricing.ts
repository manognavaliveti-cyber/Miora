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

export interface CallMinutePackage {
  id: string;
  type: 'audio' | 'video';
  minutes: number;
  coins: number;
  savingsPercent?: number;
  popular?: boolean;
  bestValue?: boolean;
  tagline?: string;
}

export interface WhoLikedMeUnlockPackage {
  id: string;
  profilesCount: number;
  coinPrice: number;
  popular?: boolean;
  tagline: string;
}

export interface SubscriptionPlanDef {
  id: 'gold' | 'vip' | 'monthly' | 'quarterly' | 'yearly';
  tier: 'free' | 'gold' | 'vip';
  name: string;
  billingPeriod: '1 Month' | '3 Months' | '1 Year';
  priceInr: number;
  pricePerMonthInr: number;
  coinPrice: number;
  bonusCoins: number;
  discountPercent?: number;
  callDiscountPercent?: number;
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
  durationMinutes?: number;
  durationHours?: number;
  priceInr?: number;
  coinPrice: number;
  popular?: boolean;
  bestValue?: boolean;
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

export interface ChatPricingDef {
  directMessageNonMatchCoins: number;
  priorityMessageCoins: number;
  sendPhotoCoins: number;
  sendVoiceMessageCoins: number;
  unlockSpecialFeatureCoins: number;
  matchedTextChatFree: boolean;
}

export const MIORA_PRICING = {
  // 1. Swiping Limits & Free Tier Limits
  limits: {
    freeDailySwipes: 20, // 20 swipes per 24 hours for free users
    freeSuperLikesPerWeek: 1, // 1 free super like / week for free users
    premiumDailySuperLikes: 5, // 5 free super likes / day for premium
    freeWhoLikedMeBlurredCount: 12 // teaser count
  },

  // 1b. Chat Coins & Premium Messaging Actions
  chat: {
    directMessageNonMatchCoins: 10,
    priorityMessageCoins: 25,
    sendPhotoCoins: 15,
    sendVoiceMessageCoins: 20,
    unlockSpecialFeatureCoins: 30,
    matchedTextChatFree: true
  } as ChatPricingDef,

  // 2. Subscriptions (FREE, GOLD ₹499/mo + 500 Coins, VIP ₹999/mo + 1500 Coins)
  subscriptionPlans: [
    {
      id: 'gold',
      tier: 'gold',
      name: 'MIORA Gold',
      billingPeriod: '1 Month',
      priceInr: 499,
      pricePerMonthInr: 499,
      coinPrice: 650,
      bonusCoins: 500,
      popular: true,
      badge: 'Most Popular • +500 Coins 🪙',
      features: [
        'Unlimited Daily Likes & Swipes',
        'See Who Liked You (Full Unblurred Profiles)',
        '5 Free Super Likes every day',
        'Advanced Lifestyle & Verified Filters',
        '+500 Bonus MIORA Coins included',
        'Rewind accidental left-swipes anytime'
      ]
    },
    {
      id: 'vip',
      tier: 'vip',
      name: 'MIORA VIP Royalty',
      billingPeriod: '1 Month',
      priceInr: 999,
      pricePerMonthInr: 999,
      coinPrice: 1350,
      bonusCoins: 1500,
      callDiscountPercent: 20,
      bestValue: true,
      badge: 'Best Value • +1,500 Coins 👑',
      features: [
        'Everything included in Gold',
        'Free Profile Boosts included',
        'Priority Matching in Discover Queue',
        '20% Video & Audio Call Coin Discounts',
        '+1,500 Bonus MIORA Coins included',
        'VIP Golden Crown Frame & Profile Aura',
        '24/7 Dedicated Concierge Support'
      ]
    }
  ] as SubscriptionPlanDef[],

  // 3. Audio & Video Call Minutes Pricing
  calls: {
    audio: [
      { id: 'call_audio_1', type: 'audio', minutes: 1, coins: 20, tagline: '1 min quick vibe check' },
      { id: 'call_audio_5', type: 'audio', minutes: 5, coins: 90, savingsPercent: 10, tagline: '5 mins • Save 10%' },
      { id: 'call_audio_10', type: 'audio', minutes: 10, coins: 160, savingsPercent: 20, popular: true, tagline: '10 mins • Most Popular' },
      { id: 'call_audio_30', type: 'audio', minutes: 30, coins: 450, savingsPercent: 25, tagline: '30 mins • Save 25%' },
      { id: 'call_audio_60', type: 'audio', minutes: 60, coins: 800, savingsPercent: 33, bestValue: true, tagline: '60 mins • Best Value' }
    ] as CallMinutePackage[],
    video: [
      { id: 'call_video_1', type: 'video', minutes: 1, coins: 40, tagline: '1 min video preview' },
      { id: 'call_video_5', type: 'video', minutes: 5, coins: 180, savingsPercent: 10, tagline: '5 mins • Save 10%' },
      { id: 'call_video_10', type: 'video', minutes: 10, coins: 330, savingsPercent: 17, popular: true, tagline: '10 mins • Most Popular' },
      { id: 'call_video_30', type: 'video', minutes: 30, coins: 900, savingsPercent: 25, tagline: '30 mins • Save 25%' },
      { id: 'call_video_60', type: 'video', minutes: 60, coins: 1600, savingsPercent: 33, bestValue: true, tagline: '60 mins • Best Value' }
    ] as CallMinutePackage[]
  },

  // 4. Extra Revenue Features: Super Likes, Boosts & Who Liked Me
  powerUps: {
    superLikes: {
      packages: [
        {
          id: 'superlike_1',
          name: '1 Super Like',
          type: 'superlike',
          count: 1,
          coinPrice: 30,
          tagline: 'Stand out with 3x more visibility'
        },
        {
          id: 'superlike_5',
          name: '5 Super Likes',
          type: 'superlike',
          count: 5,
          coinPrice: 120,
          popular: true,
          tagline: 'Save 20% • Most Popular'
        },
        {
          id: 'superlike_15',
          name: '15 Super Likes',
          type: 'superlike',
          count: 15,
          coinPrice: 300,
          bestValue: true,
          tagline: 'Save 33% • Best Value Bundle'
        }
      ] as PowerUpPackage[]
    },
    boost: {
      packages: [
        {
          id: 'boost_30m',
          name: '30 Minutes Boost',
          type: 'boost',
          count: 1,
          durationMinutes: 30,
          coinPrice: 100,
          tagline: '10x visibility for 30 minutes'
        },
        {
          id: 'boost_2h',
          name: '2 Hours Boost',
          type: 'boost',
          count: 1,
          durationHours: 2,
          coinPrice: 250,
          popular: true,
          tagline: 'Peak evening visibility • Most Popular'
        },
        {
          id: 'boost_24h',
          name: '24 Hours Boost',
          type: 'boost',
          count: 1,
          durationHours: 24,
          coinPrice: 600,
          bestValue: true,
          tagline: 'All-day 10x visibility • Best Value'
        }
      ] as PowerUpPackage[]
    },
    whoLikedMe: {
      packages: [
        {
          id: 'wlm_10',
          profilesCount: 10,
          coinPrice: 100,
          popular: true,
          tagline: 'Unlock 10 Secret Admirers'
        },
        {
          id: 'wlm_50',
          profilesCount: 50,
          coinPrice: 350,
          tagline: 'Unlock 50 Secret Admirers (Save 30%)'
        }
      ] as WhoLikedMeUnlockPackage[]
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
    }
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
    gameWinRewardCoins: 40,
    dailyCheckinRewardCoins: 25,
    profileCompletionRewardCoins: 20
  },

  // 8. Earn Coins Tasks
  earnTasks: [
    {
      id: 'task_daily',
      title: 'Daily Check-in',
      rewardCoins: 25,
      icon: '✨',
      description: 'Claim your daily romance bonus coins',
      actionText: 'Claim +25'
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
      rewardCoins: 40,
      icon: '🎮',
      description: 'Play Would You Rather or Compatibility Quiz with a match',
      actionText: 'Play & Earn +40'
    },
    {
      id: 'task_join_room',
      title: 'Join a Dating Room',
      rewardCoins: 30,
      icon: '🎙️',
      description: 'Listen and share dating advice in live rooms',
      actionText: 'Join +30'
    },
    {
      id: 'task_post_feed',
      title: 'Post a Dating Thought',
      rewardCoins: 25,
      icon: '📱',
      description: 'Share a romantic thought or 24h status update',
      actionText: 'Post +25'
    }
  ] as EarnCoinTask[]
};
