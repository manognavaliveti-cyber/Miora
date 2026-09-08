import {
  Profile,
  CurrentUser,
  Match,
  Message,
  InterestOption,
  CoinTransaction,
  CoupleGame,
  LiveRoom,
  FeedPost,
  StatusStory,
  NotificationItem
} from '../types';
import { MIORA_PRICING } from '../config/pricing';

export const AVAILABLE_INTERESTS: InterestOption[] = [
  { id: 'music', name: 'Music', icon: '🎵', category: 'Creative' },
  { id: 'travel', name: 'Travel', icon: '✈️', category: 'Lifestyle' },
  { id: 'movies', name: 'Movies', icon: '🎬', category: 'Entertainment' },
  { id: 'photography', name: 'Photography', icon: '📸', category: 'Creative' },
  { id: 'food', name: 'Food', icon: '🍜', category: 'Lifestyle' },
  { id: 'fitness', name: 'Fitness', icon: '💪', category: 'Activity' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', category: 'Entertainment' },
  { id: 'reading', name: 'Reading', icon: '📚', category: 'Learning' },
  { id: 'art', name: 'Art', icon: '🎨', category: 'Creative' },
  { id: 'pets', name: 'Pets', icon: '🐾', category: 'Lifestyle' },
  { id: 'coffee', name: 'Coffee', icon: '☕', category: 'Lifestyle' },
  { id: 'yoga', name: 'Yoga', icon: '🧘', category: 'Activity' },
  { id: 'nature', name: 'Nature', icon: '🌿', category: 'Lifestyle' },
  { id: 'concerts', name: 'Concerts', icon: '🎤', category: 'Entertainment' }
];

export const MOCK_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
];

export const INITIAL_CURRENT_USER: CurrentUser = {
  id: 'user_me',
  name: 'Dev',
  email: 'dev@miora.app',
  age: 23,
  dateOfBirth: '2001-05-14',
  gender: 'man',
  location: 'Bangalore, India',
  bio: 'Product designer obsessed with aesthetics, indie vinyls, slow pour-overs, and spontaneous weekend roadtrips. Looking for genuine connection with good energy.',
  photos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
  ],
  interests: ['Music', 'Travel', 'Movies', 'Photography', 'Food'],
  profileCompletion: 85,
  preferences: {
    interestedIn: 'women',
    ageRange: { min: 18, max: 28 },
    maxDistanceKm: 25,
    location: 'Bangalore',
    allowAudioCalls: 'matches',
    allowVideoCalls: 'matches'
  },
  coinBalance: 250,
  talkTimeSecondsRemaining: 1112, // ~18:32 remaining
  receivedGifts: {
    gift_heart: 24,
    gift_rose: 12,
    gift_diamond: 3,
    gift_crown: 1,
    gift_sparkle: 8
  },
  gamesWonCount: 6,
  isPremium: false
};

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'prof_1',
    name: 'Leena Roi',
    age: 22,
    location: 'Mumbai, India',
    distanceKm: 3,
    bio: 'Love music, coffee, travel and discovering cozy aesthetic places. Looking for someone genuine to share sweet moments with! ✨',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Music', 'Travel', 'Movies', 'Coffee', 'Art'],
    compatibility: 96,
    online: true,
    gender: 'woman',
    occupation: 'Creative Director',
    education: 'St. Xavier’s',
    height: "5'6\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: 'Yoga & Pilates',
      zodiac: 'Taurus'
    },
    matchedInterests: ['Music', 'Travel', 'Movies'],
    receivedGifts: {
      gift_rose: 38,
      gift_heart: 42,
      gift_crown: 4,
      gift_diamond: 6
    },
    gamesPlayedCount: 14,
    verified: true
  },
  {
    id: 'prof_2',
    name: 'Ananya',
    age: 21,
    location: 'Hyderabad, India',
    distanceKm: 8,
    bio: 'Architecture student who lives for sunset drives, live acoustic gigs, and secret dessert spots. Let’s talk about our favorite playlists! 🎨🎧',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Art', 'Music', 'Food', 'Travel', 'Photography'],
    compatibility: 92,
    online: true,
    gender: 'woman',
    occupation: 'Architecture Student',
    education: 'JNAFAU Hyderabad',
    height: "5'4\"",
    lifestyle: {
      drinking: 'Never',
      smoking: 'Never',
      workout: 'Often',
      zodiac: 'Libra'
    },
    matchedInterests: ['Art', 'Music', 'Food', 'Travel'],
    receivedGifts: {
      gift_heart: 29,
      gift_rose: 22,
      gift_teddy: 9
    },
    gamesPlayedCount: 9,
    verified: true
  },
  {
    id: 'prof_3',
    name: 'Meera',
    age: 23,
    location: 'Bangalore, India',
    distanceKm: 3,
    bio: 'Building tech startups & bingeing Studio Ghibli. Obsessed with golden retriever energy, rainy rooftop cafes, and spicy street food 🍜🐕',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Gaming', 'Pets', 'Food', 'Travel', 'Movies'],
    compatibility: 95,
    online: false,
    gender: 'woman',
    occupation: 'Software Engineer',
    education: 'PES University',
    height: "5'6\"",
    lifestyle: {
      drinking: 'Occasionally',
      smoking: 'Never',
      workout: 'Gym 4x/week',
      zodiac: 'Cancer'
    },
    matchedInterests: ['Food', 'Travel', 'Movies', 'Pets'],
    receivedGifts: {
      gift_diamond: 5,
      gift_heart: 31,
      gift_fire: 14
    },
    gamesPlayedCount: 18,
    verified: true
  },
  {
    id: 'prof_4',
    name: 'Ishita',
    age: 22,
    location: 'Mumbai, India',
    distanceKm: 12,
    bio: 'Film photographer & writer. If you have recommendations for vintage bookshops or quirky art galleries, I’m all ears 📸🎞️',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Photography', 'Reading', 'Art', 'Movies', 'Music'],
    compatibility: 84,
    online: true,
    gender: 'woman',
    occupation: 'Editorial Photographer',
    education: 'St. Xavier’s Mumbai',
    height: "5'7\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Socially',
      workout: 'Active lifestyle',
      zodiac: 'Pisces'
    },
    matchedInterests: ['Photography', 'Reading', 'Art', 'Movies'],
    receivedGifts: {
      gift_rose: 16,
      gift_sparkle: 11
    },
    gamesPlayedCount: 5
  },
  {
    id: 'prof_5',
    name: 'Rahul',
    age: 24,
    location: 'Chennai, India',
    distanceKm: 6,
    bio: 'Fintech analyst, amateur guitarist and fitness geek. Always down for spontaneous coastal highway roadtrips and midnight ice cream runs 🎸🌊',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Music', 'Fitness', 'Travel', 'Food', 'Gaming'],
    compatibility: 81,
    online: false,
    gender: 'man',
    occupation: 'Fintech Analyst',
    education: 'Loyola College',
    height: "6'0\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: 'Crossfit daily',
      zodiac: 'Leo'
    },
    matchedInterests: ['Music', 'Fitness', 'Travel', 'Food']
  },
  {
    id: 'prof_6',
    name: 'Arjun',
    age: 25,
    location: 'Bangalore, India',
    distanceKm: 5,
    bio: 'Leading product design for creative tools. Passionate about sourdough baking, specialty pourovers, and mountain hiking trails ☕🏔️',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Travel', 'Food', 'Art', 'Music', 'Fitness'],
    compatibility: 89,
    online: true,
    gender: 'man',
    occupation: 'Staff Product Designer',
    education: 'IIT Guwahati',
    height: "5'11\"",
    lifestyle: {
      drinking: 'Socially',
      smoking: 'Never',
      workout: 'Climbing & Running',
      zodiac: 'Sagittarius'
    },
    matchedInterests: ['Travel', 'Food', 'Art']
  },
  {
    id: 'prof_7',
    name: 'Sneha',
    age: 22,
    location: 'Pune, India',
    distanceKm: 14,
    bio: 'Psychology student, pottery enthusiast, and cat mom. Fluent in sarcasm, Taylor Swift lyrics, and comfort food recipes 🌸🐈',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Pets', 'Art', 'Music', 'Reading', 'Food'],
    compatibility: 91,
    online: true,
    gender: 'woman',
    occupation: 'Psychology Masters Student',
    education: 'Fergusson College',
    height: "5'3\"",
    lifestyle: {
      drinking: 'Never',
      smoking: 'Never',
      workout: 'Pilates',
      zodiac: 'Virgo'
    },
    matchedInterests: ['Pets', 'Art', 'Music']
  }
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match_1',
    profileId: 'prof_1',
    profile: INITIAL_PROFILES[0], // Leena Roi
    matchedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    lastMessage: 'Thank You ❤️',
    lastMessageTime: '01:55 PM',
    unreadCount: 0
  },
  {
    id: 'match_2',
    profileId: 'prof_2',
    profile: INITIAL_PROFILES[1], // Ananya
    matchedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    lastMessage: 'I love that aesthetic cafe you mentioned! ☕',
    lastMessageTime: '1d ago',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  match_1: [
    {
      id: 'msg_1',
      matchId: 'match_1',
      senderId: 'prof_1',
      text: 'Hi Leena, Nice to meet you!\nThanks for add me here',
      timestamp: '10:32 PM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg_2',
      matchId: 'match_1',
      senderId: 'me',
      text: 'Hey! Jeen!\nYour Pic is amazing 😍',
      timestamp: '10:40 PM',
      read: true,
      type: 'text'
    },
    {
      id: 'msg_3',
      matchId: 'match_1',
      senderId: 'prof_1',
      text: 'A special surprise for you 🎁',
      timestamp: '11:58 PM',
      read: true,
      type: 'gift',
      metadata: { giftId: 'gift_box', giftEmoji: '🎁', giftName: 'Luxury Gift Box' }
    },
    {
      id: 'msg_4',
      matchId: 'match_1',
      senderId: 'me',
      text: 'Thank You',
      timestamp: '01:55 PM',
      read: true,
      type: 'heart-crowned'
    }
  ],
  match_2: [
    {
      id: 'msg_5',
      matchId: 'match_2',
      senderId: 'me',
      text: 'Hey Ananya, sunset drives in Hyderabad sound amazing!',
      timestamp: 'Yesterday',
      read: true,
      type: 'text'
    },
    {
      id: 'msg_6',
      matchId: 'match_2',
      senderId: 'prof_2',
      text: 'I love that aesthetic cafe you mentioned! ☕',
      timestamp: 'Yesterday',
      read: true,
      type: 'text'
    }
  ]
};

// ==========================================
// 1. Initial Coin Transactions Ledger
// ==========================================
export const INITIAL_TRANSACTIONS: CoinTransaction[] = [
  {
    id: 'txn_1',
    type: 'game_reward',
    amount: 50,
    description: 'Won Couple Compatibility Challenge with Leena',
    timestamp: 'Today, 2:30 PM',
    relatedUser: 'Leena Roi',
    icon: '🏆'
  },
  {
    id: 'txn_2',
    type: 'gift_sent',
    amount: -20,
    description: 'Sent Romantic Heart ❤️ to Leena Roi',
    timestamp: 'Today, 1:15 PM',
    relatedUser: 'Leena Roi',
    icon: '❤️'
  },
  {
    id: 'txn_3',
    type: 'talk_time',
    amount: -40,
    description: 'Audio Conversation Talk Time (15 mins)',
    timestamp: 'Yesterday, 8:40 PM',
    relatedUser: 'Ananya',
    icon: '📞'
  },
  {
    id: 'txn_4',
    type: 'recharge',
    amount: 250,
    description: 'Recharged ₹29 Most Popular Pack (+20 Bonus)',
    timestamp: 'Yesterday, 6:00 PM',
    icon: '💳'
  },
  {
    id: 'txn_5',
    type: 'daily_checkin',
    amount: 10,
    description: 'Daily Check-in Romance Streak',
    timestamp: '2 days ago',
    icon: '✨'
  }
];

// ==========================================
// 2. MIORA Play (Couple Games)
// ==========================================
export const INITIAL_COUPLE_GAMES: CoupleGame[] = [
  {
    id: 'game_wyr',
    title: 'Would You Rather',
    tagline: 'Romantic dilemma & funny spicy choices',
    icon: '❤️',
    accentColor: '#EE3865',
    questionsCount: 5,
    estimatedTimeMin: 4,
    description: 'Pick your ultimate preferences and see how delightfully synced your mind is with your partner.',
    questions: [
      {
        id: 'q1',
        text: 'For our ideal first date, would you rather:',
        options: [
          'Cozy candlelit dinner with deep talks 🍷🕯️',
          'Spontaneous midnight drive with ice cream & music 🚗🍦'
        ]
      },
      {
        id: 'q2',
        text: 'On a rainy Sunday morning, would you rather:',
        options: [
          'Stay wrapped in blankets bingeing series ☕🛋️',
          'Cook a gourmet breakfast together with indie tunes 🥞🍳'
        ]
      },
      {
        id: 'q3',
        text: 'When you are stressed, would you rather:',
        options: [
          'Long silent cuddles with warm coffee 🤗☕',
          'Go on an adventurous walk to vent it all out 🌿🚶'
        ]
      },
      {
        id: 'q4',
        text: 'For our dream vacation, would you rather:',
        options: [
          'Overwater villa in Maldives with sunset views 🏝️🌅',
          'Rustic snow cabin in the Alps with fireplace ❄️🪵'
        ]
      },
      {
        id: 'q5',
        text: 'In our relationship dynamic, would you rather:',
        options: [
          'Be the spontaneous surprise planner 🎁✨',
          'Be the one getting spoiled with sweet gestures 💖🌸'
        ],
        isPremium: true
      }
    ]
  },
  {
    id: 'game_compat',
    title: 'Compatibility Quiz',
    tagline: 'Test your romantic frequency & love language',
    icon: '🎯',
    accentColor: '#9333EA',
    questionsCount: 5,
    estimatedTimeMin: 5,
    description: 'Answer deep questions on communication, love languages, lifestyle priorities and uncover your exact match percentage.',
    questions: [
      {
        id: 'cq1',
        text: 'What is your primary love language when feeling vulnerable?',
        options: [
          'Words of Affirmation & sweet reassurance 💌',
          'Physical Touch & warm close hugs 🤗',
          'Quality Time with undivided focus ⏳',
          'Acts of Service & caring little gestures ☕'
        ]
      },
      {
        id: 'cq2',
        text: 'How do you prefer to resolve minor misunderstandings?',
        options: [
          'Talk through it immediately with gentle openness 💬',
          'Take 30 mins to cool down, then talk with a hug 🕊️',
          'Break the tension with sweet humor then talk 😊'
        ]
      },
      {
        id: 'cq3',
        text: 'What makes you instantly feel deeply appreciated?',
        options: [
          'Remembering little details I mentioned casually 🧠',
          'Sending a cute spontaneous check-in text mid-day 📱',
          'Bragging about me to your closest friends 🌟'
        ]
      },
      {
        id: 'cq4',
        text: 'What does genuine romance look like in everyday life?',
        options: [
          'Making each other laugh even on tough days 😂',
          'Unconditional support for personal dreams 🚀',
          'Peaceful comfortable silence together 🌿'
        ]
      },
      {
        id: 'cq5',
        text: 'Secret Desire: What creates the strongest emotional spark for you?',
        options: [
          'Unfiltered intellectual debates late at night 🌙',
          'Playful teasing & magnetic eye contact 👀',
          'Shared vulnerability about childhood dreams 💖'
        ],
        isPremium: true
      }
    ]
  },
  {
    id: 'game_truth_dare',
    title: 'Truth or Dare: Romance Edition',
    tagline: 'Playful secrets and cute romantic dares',
    icon: '💖',
    accentColor: '#EC4899',
    questionsCount: 5,
    estimatedTimeMin: 6,
    description: 'Reveal your secret crushes, first date quirks, and unlock romantic dares you will never forget.',
    questions: [
      {
        id: 'td1',
        text: 'TRUTH: What was the exact detail in my profile that caught your attention first? 🌸'
      },
      {
        id: 'td2',
        text: 'DARE: Send a 5-second voice note singing the chorus of your favorite romantic song! 🎤'
      },
      {
        id: 'td3',
        text: 'TRUTH: What is your most embarrassing first-date experience before MIORA? 🙈'
      },
      {
        id: 'td4',
        text: 'DARE: Drop your sweetest pickup line that actually makes you smile 😊'
      },
      {
        id: 'td5',
        text: 'TRUTH (PREMIUM): What is one romantic fantasy or dream date you have never told anyone? 🌙',
        isPremium: true
      }
    ]
  },
  {
    id: 'game_this_that',
    title: 'This or That: Vibe Match',
    tagline: 'Rapid lifestyle and personality choices',
    icon: '💕',
    accentColor: '#F59E0B',
    questionsCount: 6,
    estimatedTimeMin: 3,
    description: 'Quickfire 1-tap comparisons to discover if you are opposite attractions or soul twins.',
    questions: [
      { id: 'tt1', text: 'Coffee date ☕ OR Sunset cocktails 🍸' },
      { id: 'tt2', text: 'Live music festival 🎸 OR Cozy house party 🏠' },
      { id: 'tt3', text: 'Spontaneous roadtrip 🛣️ OR Planned luxury resort 🏨' },
      { id: 'tt4', text: 'Early sunrise jog 🌅 OR Midnight stargazing 🌌' },
      { id: 'tt5', text: 'Texting all day 📱 OR One long meaningful evening call 📞' },
      { id: 'tt6', text: 'Big romantic grand gesture 🎆 OR Cute daily sticky notes 💌', isPremium: true }
    ]
  },
  {
    id: 'game_how_well',
    title: 'How Well Do You Know Me?',
    tagline: 'Guess my answers and unlock surprises',
    icon: '🧠',
    accentColor: '#10B981',
    questionsCount: 5,
    estimatedTimeMin: 5,
    description: 'Answer questions about yourself and see if your partner can guess what you picked!',
    questions: [
      {
        id: 'hw1',
        text: 'What is my ultimate comfort food when I am tired?',
        options: ['Creamy Pasta 🍝', 'Cheesy Pizza 🍕', 'Spicy Biryani 🍛', 'Warm Chocolate Brownie 🍫']
      },
      {
        id: 'hw2',
        text: 'Which superpower would I secretly pick?',
        options: ['Teleportation ✈️', 'Mind reading 🔮', 'Time travel ⏳', 'Invisibility 👻']
      },
      {
        id: 'hw3',
        text: 'What is my biggest pet peeve in modern conversations?',
        options: ['Checking phone constantly 📵', 'Being late with no update ⏰', 'Dry one-word texts 💬', 'Interrupting stories 🗣️']
      },
      {
        id: 'hw4',
        text: 'What kind of weekend activity makes my heart happiest?',
        options: ['Exploring hidden city gems 🗺️', 'Art gallery & bookstores 📚', 'Beach walk at golden hour 🏖️', 'Gaming & snacking 🎮']
      }
    ]
  },
  {
    id: 'game_first_date',
    title: 'First Date Challenge',
    tagline: 'Break the ice with unforgettable fun',
    icon: '✨',
    accentColor: '#6366F1',
    questionsCount: 4,
    estimatedTimeMin: 4,
    description: 'The ultimate conversation starter pack for your first match call or date.',
    questions: [
      { id: 'fd1', text: 'What is the most adventurous thing on your bucket list this year? 🏔️' },
      { id: 'fd2', text: 'If you had to curate a 3-song playlist describing your current vibe, what is track #1? 🎧' },
      { id: 'fd3', text: 'What is a topic you could give an impromptu 20-minute TED talk about? 🎙️' },
      { id: 'fd4', text: 'What is your favorite green flag in a romantic connection? 🌿', isPremium: true }
    ]
  }
];

// ==========================================
// 3. MIORA Rooms (Dating Discussion Rooms)
// ==========================================
export const INITIAL_LIVE_ROOMS: LiveRoom[] = [
  {
    id: 'room_1',
    title: 'Modern Dating: Chemistry vs Consistency? 💕',
    category: 'relationship',
    bannerGradient: 'linear-gradient(135deg, #EE3865 0%, #881337 100%)',
    description: 'Debating what matters more in 2026: instant electric spark or reliable emotional consistency over time.',
    isLive: true,
    listenersCount: 342,
    host: {
      id: 'host_aisha',
      name: 'Aisha Kapoor',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bio: 'Dating coach & author of "Heartfelt Connections" 📚',
      followersCount: 12400
    },
    speakers: [
      {
        id: 'spk_1',
        name: 'Aisha',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        isHost: true
      },
      {
        id: 'spk_2',
        name: 'Rohan M.',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        isSpeaker: true
      },
      {
        id: 'spk_3',
        name: 'Tara V.',
        photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        isSpeaker: true
      }
    ],
    tags: ['DatingAdvice', 'Chemistry', 'Relationships']
  },
  {
    id: 'room_2',
    title: 'First Date Green Flags You Should Look For 🌿',
    category: 'advice',
    bannerGradient: 'linear-gradient(135deg, #9333EA 0%, #4C0519 100%)',
    description: 'Subtle signs that someone is emotionally mature, kind to waitstaff, and genuinely interested in you.',
    isLive: true,
    listenersCount: 218,
    host: {
      id: 'host_kabir',
      name: 'Kabir Verma',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      bio: 'Relationship therapist & podcast host 🎙️',
      followersCount: 8900
    },
    speakers: [
      {
        id: 'spk_kabir',
        name: 'Kabir',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        isHost: true
      },
      {
        id: 'spk_meera',
        name: 'Meera',
        photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        isSpeaker: true
      }
    ],
    tags: ['GreenFlags', 'FirstDates', 'Love']
  },
  {
    id: 'room_3',
    title: 'How to Approach Your Crush Without Being Awkward 💘',
    category: 'crush',
    bannerGradient: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)',
    description: 'Practical tips on starting smooth natural conversations online and in real life.',
    isLive: true,
    listenersCount: 415,
    host: {
      id: 'host_leena',
      name: 'Leena Roi',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      bio: 'Creative director & aesthetic lifestyle curator ✨',
      followersCount: 15600
    },
    speakers: [
      {
        id: 'spk_leena',
        name: 'Leena',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        isHost: true
      }
    ],
    tags: ['CrushAdvice', 'Confidence', 'Social']
  },
  {
    id: 'room_4',
    title: 'Breakup Support & Healing Heart to Heart 💔🕊️',
    category: 'breakup',
    bannerGradient: 'linear-gradient(135deg, #475569 0%, #1E293B 100%)',
    description: 'A safe, kind, and supportive space to share your healing journey, self-worth, and bounce back stronger.',
    isLive: true,
    listenersCount: 189,
    host: {
      id: 'host_simran',
      name: 'Dr. Simran Rao',
      photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      bio: 'Clinical psychologist specializing in emotional well-being 🌸',
      followersCount: 22000
    },
    speakers: [
      {
        id: 'spk_simran',
        name: 'Dr. Simran',
        photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
        isHost: true
      }
    ],
    tags: ['Healing', 'SelfLove', 'Support']
  },
  {
    id: 'room_5',
    title: 'Funny Dating Stories: Wildest First Dates Ever 😂🍷',
    category: 'stories',
    bannerGradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    description: 'Open mic night for laughing at our funniest and most bizarre date stories.',
    isLive: true,
    listenersCount: 520,
    host: {
      id: 'host_sam',
      name: 'Sameer J.',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      bio: 'Stand-up comic & chronic romantic 🎤',
      followersCount: 31000
    },
    speakers: [
      {
        id: 'spk_sam',
        name: 'Sameer',
        photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        isHost: true
      }
    ],
    tags: ['Humor', 'DatingStories', 'Fun']
  }
];

// ==========================================
// 4. MIORA Feed & 24h Status Stories
// ==========================================
export const INITIAL_STATUS_STORIES: StatusStory[] = [
  {
    id: 'st_1',
    userId: 'prof_1',
    userName: 'Leena',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    text: 'Coffee + good acoustic playlist ☕❤️',
    mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 21).toISOString(),
    viewed: false,
    reactionsCount: 34
  },
  {
    id: 'st_2',
    userId: 'prof_2',
    userName: 'Ananya',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    text: 'Looking for someone who loves golden hour drives ✈️🌅',
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 18).toISOString(),
    viewed: false,
    reactionsCount: 48
  },
  {
    id: 'st_3',
    userId: 'prof_3',
    userName: 'Meera',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    text: 'Finally weekend! Baking sourdough & bingeing Ghibli 😍🍞',
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date(Date.now() - 3600000 * 10).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 14).toISOString(),
    viewed: false,
    reactionsCount: 62
  },
  {
    id: 'st_4',
    userId: 'prof_7',
    userName: 'Sneha',
    userPhoto: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    text: 'My cat just approved my new pottery vase 🐈🌸',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 10).toISOString(),
    viewed: false,
    reactionsCount: 19
  }
];

export const INITIAL_FEED_POSTS: FeedPost[] = [
  {
    id: 'post_1',
    userId: 'prof_1',
    userName: 'Leena Roi',
    userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    location: 'Bandra, Mumbai',
    timestamp: '2 hours ago',
    content: "What's your definition of a perfect first date? Is it an aesthetic candlelit dinner or a spontaneous drive with midnight street food? Let me know below! ❤️✨",
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    likesCount: 142,
    hasLiked: true,
    sharesCount: 18,
    tags: ['FirstDate', 'RomanticMoments', 'Vibe'],
    comments: [
      {
        id: 'c1',
        userId: 'prof_6',
        userName: 'Arjun',
        userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        text: 'Definitely finding a cozy rooftop cafe with acoustic jazz playing! ☕🎷',
        timestamp: '1h ago'
      },
      {
        id: 'c2',
        userId: 'prof_2',
        userName: 'Ananya',
        userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Midnight ice cream runs on coastal roads win every single time 🍦🌊',
        timestamp: '45m ago'
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'prof_2',
    userName: 'Ananya',
    userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    location: 'Hyderabad',
    timestamp: '5 hours ago',
    content: 'Sunset sketching sessions at old heritage monuments. The golden hour lighting in Hyderabad hits different today 🎨✨ Looking for a gallery buddy this Sunday!',
    imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
    likesCount: 89,
    hasLiked: false,
    sharesCount: 7,
    tags: ['ArtVibes', 'GoldenHour', 'Hyderabad'],
    comments: [
      {
        id: 'c3',
        userId: 'prof_5',
        userName: 'Rahul',
        userPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
        text: 'Love the lighting! Which gallery are you planning to visit? 📸',
        timestamp: '3h ago'
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'prof_3',
    userName: 'Meera',
    userPhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
    location: 'Indiranagar, Bangalore',
    timestamp: '8 hours ago',
    content: 'Unpopular opinion: Compatibility in taste of music and mutual comfort in silence is 10x more important than having the same hobbies. Agree or disagree? 🎧🌿',
    likesCount: 231,
    hasLiked: true,
    sharesCount: 42,
    tags: ['DatingThoughts', 'RealTalk', 'Compatibility'],
    comments: [
      {
        id: 'c4',
        userId: 'user_me',
        userName: 'Dev',
        userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        text: '100% agreed. If you can enjoy 2 hours in a car listening to music without forcing talk, that’s genuine chemistry! 🎵✨',
        timestamp: '6h ago'
      }
    ]
  }
];

// ==========================================
// 5. Initial Notifications
// ==========================================
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'gift_received',
    title: 'Gift Received! 🌹',
    message: 'Leena sent you a Romantic Red Rose (+10 Coins value)',
    timestamp: '10 minutes ago',
    read: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    linkTab: 'messages'
  },
  {
    id: 'notif_2',
    type: 'match',
    title: "It's a Match! 💖",
    message: 'You and Leena Roi liked each other. Start the spark!',
    timestamp: '2 hours ago',
    read: false,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    linkTab: 'matches'
  },
  {
    id: 'notif_3',
    type: 'game_reward',
    title: 'Game Reward Claimed! 🏆',
    message: 'You earned +15 Coins for completing Would You Rather with Ananya',
    timestamp: 'Yesterday',
    read: true,
    linkTab: 'wallet'
  },
  {
    id: 'notif_4',
    type: 'post_like',
    title: 'New Like on your post ❤️',
    message: 'Ananya liked your dating thought "Music compatibility in long drives"',
    timestamp: 'Yesterday',
    read: true,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
    linkTab: 'feed'
  },
  {
    id: 'notif_5',
    type: 'recharge_success',
    title: 'Wallet Recharged ✨',
    message: 'Successfully credited 250 Coins + 20 Bonus to your MIORA Wallet',
    timestamp: '2 days ago',
    read: true,
    linkTab: 'wallet'
  }
];

export const SAFETY_REPORT_REASONS = [
  'Harassment or Bullying',
  'Fake Profile or Impersonation',
  'Spam or Commercial Solicitation',
  'Inappropriate or Explicit Content',
  'Scam or Fraudulent Behavior',
  'Unsafe Call or Discussion Behavior',
  'Other'
];

export const SMART_AUTO_REPLIES: string[] = [
  "That's so true! What are your plans for the weekend? 😊",
  "Haha love that! Have you been to that cozy rooftop cafe downtown? ☕✨",
  "Totally agree with you! What kind of music have you been playing lately? 🎵",
  "That sounds super fun! We should definitely check that out sometime! ✨",
  "Oh wow, I've always wanted to try that! Tell me more 😊"
];
