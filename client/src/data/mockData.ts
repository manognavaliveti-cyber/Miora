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
  age: 0,
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

export const SYNTHETIC_TEST_PROFILES: Profile[] = [
  {
    id: 'prof_test_1',
    name: 'Ananya',
    age: 22,
    gender: 'woman',
    location: 'Mumbai, Maharashtra',
    bio: 'Architectural designer with a passion for cozy coffee nooks, oil painting & sunset road trips 🎨☕',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Architecture', 'Cafés', 'Art', 'Music', 'Travel'],
    compatibility: 96,
    distanceKm: 4,
    occupation: 'Architectural Designer',
    education: 'B.Arch • JJ College of Architecture',
    height: "5'6\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: '3x a week', zodiac: 'Leo' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_2',
    name: 'Rohan',
    age: 25,
    gender: 'man',
    location: 'Bengaluru, Karnataka',
    bio: 'Software engineer building distributed systems. Coffee enthusiast, indie rock listener & weekend trekker ⛰️☕',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Coding', 'Trekking', 'Indie Rock', 'Coffee', 'Gaming'],
    compatibility: 91,
    occupation: 'Senior Backend Engineer',
    education: 'B.Tech CS • IISc Bengaluru',
    height: "5'11\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Active', zodiac: 'Aries' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_3',
    name: 'Kavya',
    age: 23,
    gender: 'woman',
    location: 'New Delhi, Delhi',
    bio: 'Fashion stylist & vintage curator. Always looking for hidden thrift gems and aesthetic matcha spots 🌸✨',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Fashion', 'Photography', 'Matcha', 'Design', 'Music'],
    compatibility: 94,
    occupation: 'Fashion Stylist',
    education: 'NIFT Delhi',
    height: "5'5\"",
    relationshipIntent: 'Casual dating',
    lifestyle: { drinking: 'Occasionally', smoking: 'Never', workout: 'Yoga', zodiac: 'Libra' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: false
  },
  {
    id: 'prof_test_4',
    name: 'Aarav',
    age: 26,
    gender: 'man',
    location: 'Hyderabad, Telangana',
    bio: 'Tech product manager, badminton player & foodie searching for the best biryani in town 🏸🍛',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Badminton', 'Product Strategy', 'Biryani', 'Fitness', 'Movies'],
    compatibility: 89,
    occupation: 'Product Manager',
    education: 'MBA • ISB Hyderabad',
    height: "6'0\"",
    relationshipIntent: 'Marriage',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Daily', zodiac: 'Sagittarius' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_5',
    name: 'Diya',
    age: 21,
    gender: 'woman',
    location: 'Pune, Maharashtra',
    bio: 'Pastry chef & bakery owner. Sourdough whisperer, cat lover & acoustic guitar player 🥐🐱🎸',
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Baking', 'Cats', 'Acoustic Guitar', 'Reading', 'Cafés'],
    compatibility: 88,
    occupation: 'Pastry Chef & Owner',
    education: 'Culinary Arts • IHM Pune',
    height: "5'4\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Never', smoking: 'Never', workout: 'Casual', zodiac: 'Taurus' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_6',
    name: 'Vikram',
    age: 27,
    gender: 'man',
    location: 'Chennai, Tamil Nadu',
    bio: 'Calisthenics coach & marathon runner. Beach lover, filter coffee fanatic & dog dad 🐕☕',
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Fitness', 'Marathon', 'Dogs', 'Surfing', 'Coffee'],
    compatibility: 85,
    occupation: 'Fitness Coach',
    education: 'B.Sc Sports Science',
    height: "5'10\"",
    relationshipIntent: 'Casual dating',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Daily', zodiac: 'Scorpio' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: false
  },
  {
    id: 'prof_test_7',
    name: 'Meera',
    age: 24,
    gender: 'woman',
    location: 'Panaji, Goa',
    bio: 'Freelance travel photographer & scuba diver. Sunset chaser capturing stories across coastal villages 🌊📸',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Photography', 'Scuba Diving', 'Travel', 'Nature', 'Music'],
    compatibility: 93,
    occupation: 'Travel Photographer',
    education: 'BFA Photography • Goa University',
    height: "5'7\"",
    relationshipIntent: 'Open to anything',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Swimming', zodiac: 'Pisces' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_8',
    name: 'Arjun',
    age: 28,
    gender: 'man',
    location: 'Gurgaon, Haryana',
    bio: 'Equity research analyst by day, jazz saxophonist by night. Lover of fine dining & board games 🎷📈',
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Finance', 'Jazz', 'Board Games', 'Fine Dining', 'Wine'],
    compatibility: 92,
    occupation: 'Senior Financial Analyst',
    education: 'CFA • SRCC Delhi',
    height: "6'1\"",
    relationshipIntent: 'Marriage',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Gym', zodiac: 'Capricorn' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_9',
    name: 'Riya',
    age: 22,
    gender: 'woman',
    location: 'Kolkata, West Bengal',
    bio: 'Kathak dancer, Rabindra Sangeet lover & literature enthusiast. Warm tea & long balcony conversations ☕📖',
    photos: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Dance', 'Literature', 'Classical Music', 'Poetry', 'Tea'],
    compatibility: 87,
    occupation: 'Dance Instructor',
    education: 'M.A. Performing Arts • Jadavpur University',
    height: "5'3\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Never', smoking: 'Never', workout: 'Dance', zodiac: 'Cancer' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: false
  },
  {
    id: 'prof_test_10',
    name: 'Siddharth',
    age: 24,
    gender: 'man',
    location: 'Jaipur, Rajasthan',
    bio: 'Heritage architect & interior artisan. Passionate about royal Rajasthani crafts & acoustic indie folk 🏰🎨',
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Heritage', 'Design', 'Folk Music', 'Pottery', 'Travel'],
    compatibility: 86,
    occupation: 'Interior Architect',
    education: 'B.Des • CEPT Ahmedabad',
    height: "5'9\"",
    relationshipIntent: 'New friends',
    lifestyle: { drinking: 'Occasionally', smoking: 'Never', workout: 'Yoga', zodiac: 'Gemini' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_11',
    name: 'Natasha',
    age: 25,
    gender: 'woman',
    location: 'Chandigarh, Punjab',
    bio: 'Digital brand strategist & Formula 1 fan. Sunset drives, synthwave music & espresso shots 🏎️⚡',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Formula 1', 'Branding', 'Synthwave', 'Coffee', 'Drives'],
    compatibility: 90,
    occupation: 'Brand Strategist',
    education: 'MBA Marketing • Panjab University',
    height: "5'8\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Pilates', zodiac: 'Leo' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_12',
    name: 'Kabir',
    age: 26,
    gender: 'man',
    location: 'Ahmedabad, Gujarat',
    bio: 'Independent documentary filmmaker. Telling stories about artisanal weavers, street food & cinema history 🎥📽️',
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Filmmaking', 'Documentaries', 'Street Food', 'Cinema', 'Travel'],
    compatibility: 89,
    occupation: 'Documentary Director',
    education: 'FTII Pune',
    height: "5'10\"",
    relationshipIntent: 'Casual dating',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Walking', zodiac: 'Aquarius' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: false
  },
  {
    id: 'prof_test_13',
    name: 'Priyanka',
    age: 23,
    gender: 'woman',
    location: 'Kochi, Kerala',
    bio: 'Marine biology researcher & ocean conservation activist. Sunset kayaking & tropical smoothie bowls 🌊🛶',
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Marine Life', 'Kayaking', 'Environment', 'Smoothies', 'Reading'],
    compatibility: 95,
    occupation: 'Marine Biologist',
    education: 'M.Sc Marine Biology • CUSAT Kochi',
    height: "5'5\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Never', smoking: 'Never', workout: 'Swimming', zodiac: 'Virgo' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_14',
    name: 'Aditya',
    age: 27,
    gender: 'man',
    location: 'Lucknow, Uttar Pradesh',
    bio: 'UX researcher & accessibility advocate. Lover of Ghazals, vintage fountain pens & quiet library corners ✒️📚',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['UX Research', 'Ghazals', 'Calligraphy', 'Books', 'Tea'],
    compatibility: 91,
    occupation: 'Lead UX Researcher',
    education: 'M.Des • IIT Kanpur',
    height: "5'11\"",
    relationshipIntent: 'Marriage',
    lifestyle: { drinking: 'Never', smoking: 'Never', workout: 'Yoga', zodiac: 'Taurus' },
    verified: true,
    isVerified: true,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_15',
    name: 'Sneha',
    age: 22,
    gender: 'woman',
    location: 'Indore, Madhya Pradesh',
    bio: 'Podcast host exploring modern relationships & mindfulness. Street food reviewer & indie pop enthusiast 🎙️🎧',
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Podcasts', 'Pop Music', 'Food', 'Mindfulness', 'Writing'],
    compatibility: 84,
    occupation: 'Podcast Host & Creator',
    education: 'B.A. Mass Comm • DAVV Indore',
    height: "5'4\"",
    relationshipIntent: 'Casual dating',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Dance', zodiac: 'Scorpio' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_16',
    name: 'Dev',
    age: 25,
    gender: 'man',
    location: 'Mysuru, Karnataka',
    bio: 'Wildlife photographer documenting Western Ghats biodiversity. Birdwatcher, camper & espresso brewer 📷🌲',
    photos: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Wildlife', 'Camping', 'Photography', 'Coffee', 'Hiking'],
    compatibility: 87,
    occupation: 'Wildlife Photographer',
    education: 'B.Sc Forestry',
    height: "5'10\"",
    relationshipIntent: 'New friends',
    lifestyle: { drinking: 'Never', smoking: 'Never', workout: 'Outdoor', zodiac: 'Aries' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: false
  },
  {
    id: 'prof_test_17',
    name: 'Anika',
    age: 24,
    gender: 'woman',
    location: 'Dehradun, Uttarakhand',
    bio: 'Environmental journalist & mountain trekker. Mountain tea, starry nights & Himalayan eco-initiatives 🏔️☕',
    photos: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Mountains', 'Environment', 'Journalism', 'Trekking', 'Tea'],
    compatibility: 92,
    occupation: 'Environmental Journalist',
    education: 'M.A. Journalism • Doon University',
    height: "5'6\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Never', smoking: 'Never', workout: 'Hiking', zodiac: 'Sagittarius' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: true
  },
  {
    id: 'prof_test_18',
    name: 'Ishan',
    age: 26,
    gender: 'man',
    location: 'Shimla, Himachal Pradesh',
    bio: 'Artisanal coffee roaster & mountain café owner. Acoustic guitar sessions & fireside conversations ☕🔥🎸',
    photos: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
    ],
    interests: ['Coffee Roasting', 'Guitar', 'Mountains', 'Cafés', 'Music'],
    compatibility: 93,
    occupation: 'Coffee Roaster & Owner',
    education: 'Barista Academy • HP University',
    height: "6'0\"",
    relationshipIntent: 'Long-term',
    lifestyle: { drinking: 'Socially', smoking: 'Never', workout: 'Casual', zodiac: 'Libra' },
    verified: false,
    isVerified: false,
    isTestProfile: true,
    online: true
  }
];

export const INITIAL_PROFILES: Profile[] = [...SYNTHETIC_TEST_PROFILES];

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

