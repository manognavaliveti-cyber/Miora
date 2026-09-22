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
  NotificationItem,
  WhoLikedMeProfile
} from '../types';
import { MIORA_PRICING } from '../config/pricing';

export const AVAILABLE_INTERESTS: InterestOption[] = [
  { id: 'music', name: 'Music', icon: '🎵', category: 'Creative' },
  { id: 'travel', name: 'Travel', icon: '✈️', category: 'Lifestyle' },
  { id: 'movies', name: 'Movies', icon: '🎬', category: 'Entertainment' },
  { id: 'photography', name: 'Photography', icon: '📸', category: 'Creative' },
  { id: 'food', name: 'Food', icon: '🍜', category: 'Lifestyle' },
  { id: 'fitness', name: 'Fitness', icon: '🏋️', category: 'Activity' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', category: 'Entertainment' },
  { id: 'reading', name: 'Reading', icon: '📚', category: 'Learning' },
  { id: 'art', name: 'Art', icon: '🎨', category: 'Creative' },
  { id: 'pets', name: 'Pets', icon: '🐾', category: 'Lifestyle' },
  { id: 'coffee', name: 'Cafés', icon: '☕', category: 'Lifestyle' },
  { id: 'yoga', name: 'Yoga', icon: '🧘', category: 'Activity' },
  { id: 'nature', name: 'Nature', icon: '🌿', category: 'Lifestyle' },
  { id: 'concerts', name: 'Singing', icon: '🎤', category: 'Entertainment' }
];

export interface MioraInterestDetail {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
}

export const MIORA_INTERESTS_GRID: MioraInterestDetail[] = [
  { id: 'gaming', name: 'Gaming', subtitle: 'Game nights', icon: '🎮' },
  { id: 'movies', name: 'Movies', subtitle: 'Screen time', icon: '🎬' },
  { id: 'travel', name: 'Travel', subtitle: 'Explore places', icon: '✈️' },
  { id: 'food', name: 'Food', subtitle: 'Food adventures', icon: '🍜' },
  { id: 'music', name: 'Music', subtitle: 'Good vibes', icon: '🎵' },
  { id: 'fitness', name: 'Fitness', subtitle: 'Stay active', icon: '🏋️' },
  { id: 'reading', name: 'Reading', subtitle: 'Book lover', icon: '📚' },
  { id: 'pets', name: 'Pets', subtitle: 'Animal lover', icon: '🐾' },
  { id: 'photography', name: 'Photography', subtitle: 'Capture moments', icon: '📸' },
  { id: 'sports', name: 'Sports', subtitle: 'Game on', icon: '🏏' },
  { id: 'art', name: 'Art', subtitle: 'Creative soul', icon: '🎨' },
  { id: 'technology', name: 'Technology', subtitle: 'Tech lover', icon: '💻' },
  { id: 'cafes', name: 'Cafés', subtitle: 'Coffee dates', icon: '☕' },
  { id: 'nature', name: 'Nature', subtitle: 'Outdoor vibes', icon: '🌿' },
  { id: 'dancing', name: 'Dancing', subtitle: 'Move & groove', icon: '💃' },
  { id: 'singing', name: 'Singing', subtitle: 'Music at heart', icon: '🎤' },
  { id: 'roadtrips', name: 'Road Trips', subtitle: 'Long drives', icon: '🚗' },
  { id: 'cooking', name: 'Cooking', subtitle: 'Kitchen experiments', icon: '🍳' },
  { id: 'events', name: 'Events', subtitle: 'Shows & festivals', icon: '🎭' },
  { id: 'volunteering', name: 'Volunteering', subtitle: 'Give back', icon: '🤝' }
];

export const MIORA_LOOKING_FOR_OPTIONS = [
  { id: 'long_term', label: 'Long-term Relationship', icon: '❤️' },
  { id: 'meaningful', label: 'Meaningful Connection', icon: '✨' },
  { id: 'friendship', label: 'Friendship', icon: '💬' },
  { id: 'casual', label: 'Casual Dating', icon: '🌸' },
  { id: 'new_people', label: 'New People', icon: '🤝' },
  { id: 'marriage', label: 'Marriage', icon: '💍' }
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
  name: 'MIORA User',
  email: '',
  age: 18,
  gender: 'prefer-not-to-say',
  location: '',
  bio: '',
  photos: [],
  interests: [],
  profileCompletion: 0,
  preferences: {
    interestedIn: 'women',
    ageRange: { min: 18, max: 50 },
    maxDistanceKm: 50,
    location: '',
    allowAudioCalls: 'matches',
    allowVideoCalls: 'matches'
  },
  walletBalance: 0,
  coinBalance: 0,
  talkTimeSecondsRemaining: 0,
  receivedGifts: {},
  gamesWonCount: 0,
  isPremium: false,
  subscriptionTier: 'free',
  dailySwipesRemaining: 0,
  dailySwipesMax: 0,
  superLikesRemaining: 0,
  boostsCount: 0,
  spotlightsCount: 0
};

export const INITIAL_PROFILES: Profile[] = [];

export const INITIAL_MATCHES: Match[] = [];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};



// ==========================================
// 1. Initial Coin Transactions Ledger
// ==========================================
export const INITIAL_TRANSACTIONS: CoinTransaction[] = [];

// ==========================================
// 2. MIORA Play (Couple Games)
// ==========================================
export const INITIAL_COUPLE_GAMES: CoupleGame[] = [
  {
    id: 'game_wyr',
    category: 'would_you_rather',
    title: 'Would You Rather',
    tagline: 'Romantic dilemma & funny spicy choices',
    icon: '❤️',
    image: '/games/would-you-rather.jpg',
    accentColor: '#EE3865',
    questionsCount: 5,
    estimatedTimeMin: 4,
    priceCoins: 39,
    priceTier: 'normal',
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
    category: 'quiz',
    title: 'Compatibility Quiz',
    tagline: 'Test your romantic frequency & love language',
    icon: '🎯',
    image: '/games/compatibility-quiz.jpg',
    accentColor: '#9333EA',
    questionsCount: 5,
    estimatedTimeMin: 5,
    priceCoins: 49,
    priceTier: 'interesting',
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
    category: 'truth',
    title: 'Truth or Dare: Romance Edition',
    tagline: 'Playful secrets and cute romantic dares',
    icon: '💖',
    image: '/games/truth-or-dare.jpg',
    accentColor: '#EC4899',
    questionsCount: 5,
    estimatedTimeMin: 6,
    priceCoins: 49,
    priceTier: 'interesting',
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
    category: 'spicy',
    title: 'This or That: Vibe Match',
    tagline: 'Rapid lifestyle and personality choices',
    icon: '💕',
    image: '/games/this-or-that.jpg',
    accentColor: '#F59E0B',
    questionsCount: 6,
    estimatedTimeMin: 3,
    priceCoins: 39,
    priceTier: 'normal',
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
    category: 'quiz',
    title: 'How Well Do You Know Me?',
    tagline: 'Guess my answers and unlock surprises',
    icon: '🧠',
    image: '/games/how-well-do-you-know-me.jpg',
    accentColor: '#10B981',
    questionsCount: 5,
    estimatedTimeMin: 5,
    priceCoins: 49,
    priceTier: 'interesting',
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
    category: 'first_date',
    title: 'First Date Challenge',
    tagline: 'Break the ice with unforgettable fun',
    icon: '✨',
    image: '/games/first-date.jpg',
    accentColor: '#6366F1',
    questionsCount: 4,
    estimatedTimeMin: 4,
    priceCoins: 39,
    priceTier: 'normal',
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
export const INITIAL_LIVE_ROOMS: LiveRoom[] = [];

// ==========================================
// 4. MIORA Feed & 24h Status Stories
// ==========================================
export const INITIAL_STATUS_STORIES: StatusStory[] = [];

export const INITIAL_FEED_POSTS: FeedPost[] = [];

// ==========================================
// 5. Initial Notifications
// ==========================================
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

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

export const INITIAL_WHO_LIKED_ME: WhoLikedMeProfile[] = [];

export const INITIAL_SPOTLIGHT_PROFILES: Profile[] = [];

