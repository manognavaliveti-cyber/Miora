export type AppView =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'signup'
  | 'profile-build-choice'
  | 'profile-setup'
  | 'add-photos'
  | 'dating-preferences'
  | 'home'
  | 'discover'
  | 'likes'
  | 'games'
  | 'feed'
  | 'rooms'
  | 'play'
  | 'matches'
  | 'chat-list'
  | 'chat'
  | 'wallet'
  | 'my-profile'
  | 'edit-profile'
  | 'settings'
  | 'blocked-users'
  | 'notifications'
  | 'terms'
  | 'privacy'
  | 'admin';

export type MainTab =
  | 'home'
  | 'chat'
  | 'games'
  | 'likes'
  | 'profile'
  | 'discover'
  | 'feed'
  | 'matches'
  | 'messages'
  | 'rooms'
  | 'play'
  | 'wallet';

export type SubscriptionTier = 'free' | 'pro' | 'vip';

export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  distanceKm?: number;
  bio: string;
  photos: string[];
  interests: string[];
  compatibility: number; // e.g. 87% Vibe Match
  online: boolean;
  gender: 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
  occupation?: string;
  education?: string;
  height?: string;
  relationshipIntent?: 'Long-term' | 'Marriage' | 'Casual dating' | 'New friends' | 'Open to anything';
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    workout?: string;
    zodiac?: string;
  };
  matchedInterests?: string[];
  likedByCurrentUser?: boolean;
  superLikedByCurrentUser?: boolean;
  receivedGifts?: Record<string, number>;
  gamesPlayedCount?: number;
  verified?: boolean;
  isVerified?: boolean;
  isTestProfile?: boolean;
  isSpotlighted?: boolean;
  isBoosted?: boolean;
  boostBadge?: string;
  // Set for profiles loaded live from Firestore (a real registered person),
  // as opposed to the built-in demo/mock profiles.
  isRealUser?: boolean;
}

export interface UserPreferences {
  interestedIn: 'women' | 'men' | 'everyone';
  ageRange: {
    min: number;
    max: number;
  };
  maxDistanceKm: number;
  location: string;
  allowAudioCalls?: 'all' | 'matches' | 'nobody';
  allowVideoCalls?: 'all' | 'matches' | 'nobody';
}

export interface AdvancedFilterCriteria {
  minAge: number;
  maxAge: number;
  maxDistanceKm: number;
  verifiedOnly: boolean;
  minCompatibility: number;
  relationshipIntent?: string;
  drinking?: string;
  smoking?: string;
  workout?: string;
  zodiac?: string;
  education?: string;
}

export interface WhoLikedMeProfile {
  id: string;
  profileId: string;
  profile: Profile;
  likedAt: string;
  isSuperLike: boolean;
  matchScore: number;
  isBlurred?: boolean;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age: number;
  dateOfBirth?: string;
  gender: 'woman' | 'man' | 'non-binary' | 'prefer-not-to-say';
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  profileCompletion: number;
  preferences: UserPreferences;
  occupation?: string;
  education?: string;
  relationshipIntent?: 'Long-term' | 'Marriage' | 'Casual dating' | 'New friends' | 'Open to anything';
  lifestyle?: {
    drinking?: string;
    smoking?: string;
    workout?: string;
    zodiac?: string;
  };
  coinBalance: number;
  walletBalance: number;
  talkTimeSecondsRemaining: number;
  receivedGifts: Record<string, number>;
  gamesWonCount: number;
  verified?: boolean;
  isVerified?: boolean;
  isTestProfile?: boolean;
  
  // Monetization & Tiers
  isPremium?: boolean;
  subscriptionTier: SubscriptionTier;
  subscriptionPlanId?: string;
  subscriptionExpiresAt?: string;

  // Push Notifications: Firebase Cloud Messaging device token
  fcmToken?: string;
  
  // Swipes & Limits
  dailySwipesRemaining: number;
  dailySwipesMax: number;
  dailySwipesResetAt?: string;
  superLikesRemaining: number;
  
  // Daily Feature Limits
  dailyAudioCallsRemaining?: number;
  dailyVideoCallsRemaining?: number;
  dailyLikesRemaining?: number;
  dailyMessagesRemaining?: number;
  
  // Power-Ups Inventory & Active Timers
  boostsCount: number;
  spotlightsCount: number;
  boostActiveUntil?: string; // ISO string
  spotlightActiveUntil?: string; // ISO string

  termsAccepted?: boolean;
  termsVersion?: string;
  termsAcceptedAt?: string;
}

export interface Match {
  id: string;
  profileId: string;
  profile: Profile;
  matchedAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isSuperMatch?: boolean;
}

export type MessageType = 'text' | 'gift' | 'heart-crowned' | 'call-log' | 'game-invite' | 'image' | 'super-like' | 'voice' | 'priority' | 'special-feature';

export interface Message {
  id: string;
  matchId: string;
  senderId: string; // 'me' or profileId
  recipientId?: string; // only set for real (Firestore-backed) conversations
  sortKey?: number; // epoch ms — used for reliable chronological ordering of real messages
  text: string;
  timestamp: string;
  read: boolean;
  deletedAt?: string;
  type?: MessageType;
  metadata?: {
    giftId?: string;
    giftEmoji?: string;
    giftName?: string;
    callType?: 'audio' | 'video';
    callDurationSec?: number;
    gameId?: string;
    gameTitle?: string;
    imageUrl?: string;
    caption?: string;
    isPriority?: boolean;
    audioUrl?: string;
    audioDurationSec?: number;
    featureName?: string;
    featureEmoji?: string;
  };
}

export interface BlockItem {
  id: string;
  profileId: string;
  profileName: string;
  profilePhoto: string;
  blockedAt: string;
}

export interface ReportPayload {
  targetProfileId?: string;
  targetProfileName?: string;
  targetPostId?: string;
  targetRoomId?: string;
  reason: string;
  details?: string;
}

export interface InterestOption {
  id: string;
  name: string;
  icon: string;
  category: string;
}

// ==========================================
// 1. Calling Types
// ==========================================
export type CallType = 'audio' | 'video';
export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';

export interface ActiveCall {
  id: string;
  type: CallType;
  partner: Profile;
  status: CallStatus;
  startedAt?: number;
  durationSeconds: number;
  remainingTalkTimeSeconds: number;
  isMuted: boolean;
  isCameraOff: boolean;
  isFrontCamera: boolean;
  isWarningLowTime?: boolean;
}

// ==========================================
// 2. Wallet & ₹ Balance Types
// ==========================================
export type TransactionType =
  | 'WALLET_TOPUP'
  | 'PRO_SUBSCRIPTION'
  | 'VIP_SUBSCRIPTION'
  | 'PLAN_CREDIT'
  | 'PLAN_BONUS'
  | 'WALLET_PAYMENT'
  | 'AUDIO_CALL'
  | 'VIDEO_CALL'
  | 'PAID_CHAT'
  | 'GAME_SPEND'
  | 'REFUND'
  | 'ADJUSTMENT'
  | 'PREMIUM_PURCHASE'
  | 'recharge'
  | 'talk_time'
  | 'daily_checkin'
  | 'game_reward'
  | 'gift_sent';

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  amount: number; // ₹ amount credited or debited
  walletAmount?: number;
  paymentAmountInr?: number;
  balanceBefore?: number;
  balanceAfter?: number;
  description: string;
  timestamp: string;
  relatedUser?: string;
  icon?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status?: string;
}

export type CoinTransaction = WalletTransaction;

// ==========================================
// 3. Virtual Gifts Types
// ==========================================
export interface VirtualGift {
  id: string;
  name: string;
  emoji: string;
  coinValue: number;
  description: string;
  category: 'romantic' | 'luxury' | 'fun';
  animation: 'hearts-burst' | 'rose-rain' | 'diamond-sparkle' | 'crown-glow' | 'fire-flame';
}

export interface GiftAnimationEvent {
  id: string;
  gift: VirtualGift;
  senderName: string;
  recipientName: string;
}

// ==========================================
// 4. MIORA Play (Couple Games) Types
// ==========================================
export interface GameQuestion {
  id: string;
  text: string;
  options?: string[];
  isPremium?: boolean;
  category?: string;
}

export interface CoupleGame {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  image?: string;
  category?: string;
  accentColor: string;
  questionsCount: number;
  estimatedTimeMin: number;
  isPremium?: boolean;
  premiumCoins?: number;
  priceCoins?: number;
  /** Pricing tier controlled by Admin Pricing Settings. */
  priceTier?: 'normal' | 'interesting';
  description: string;
  questions: GameQuestion[];
}

export interface ActiveGameSession {
  game: CoupleGame;
  partner: Profile;
  currentQuestionIndex: number;
  userAnswers: Record<number, string>;
  partnerAnswers: Record<number, string>;
  isPartnerTyping: boolean;
  compatibilityScore?: number;
  isCompleted: boolean;
  rewardClaimed: boolean;
  isPremiumUnlocked?: boolean;
}

// ==========================================
// 5. MIORA Rooms (Dating Discussion Rooms)
// ==========================================
export interface RoomParticipant {
  id: string;
  name: string;
  photo: string;
  isHost?: boolean;
  isSpeaker?: boolean;
  isMuted?: boolean;
  hasRaisedHand?: boolean;
}

export interface RoomComment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  timestamp: string;
  isGiftNotice?: boolean;
  giftEmoji?: string;
}

export interface LiveRoom {
  id: string;
  title: string;
  category: 'advice' | 'relationship' | 'crush' | 'breakup' | 'humor' | 'stories';
  host: {
    id: string;
    name: string;
    photo: string;
    bio?: string;
    followersCount: number;
  };
  speakers: RoomParticipant[];
  listenersCount: number;
  isLive: boolean;
  tags: string[];
  bannerGradient: string;
  description: string;
}

// ==========================================
// 6. MIORA Feed & 24h Status Types
// ==========================================
export interface UserStatus {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  noteText: string;
  emoji?: string;
  createdAt: string;
  expiresAt: string;
}

export interface FollowItem {
  id: string;
  followerId: string;
  followerName: string;
  followerPhoto: string;
  followingId: string;
  followingName: string;
  followingPhoto: string;
  createdAt: string;
}

export interface StatusStory {
  id: string;
  userId?: string;
  authorId?: string;
  userName?: string;
  authorName?: string;
  userPhoto?: string;
  authorPhoto?: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
  expiresAt?: string;
  viewed?: boolean;
  isViewed?: boolean;
  isMine?: boolean;
  reactionsCount: number;
}

export interface FeedComment {
  id: string;
  userId?: string;
  userName?: string;
  authorName?: string;
  userPhoto?: string;
  text: string;
  timestamp: string;
}

export interface FeedPost {
  id: string;
  userId?: string;
  authorId?: string;
  userName?: string;
  authorName?: string;
  userPhoto?: string;
  authorPhoto?: string;
  authorAge?: string;
  authorGender?: string;
  location?: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  hasLiked?: boolean;
  isLikedByMe?: boolean;
  commentsCount?: number;
  comments: FeedComment[];
  sharesCount: number;
  saved?: boolean;
  isSavedByMe?: boolean;
  tags?: string[];
}

export interface SearchResults {
  profiles: Profile[];
  posts: FeedPost[];
}

// ==========================================
// 7. Notification System
// ==========================================
export type NotificationType =
  | 'match'
  | 'message'
  | 'super_like'
  | 'boost_activated'
  | 'subscription_active'
  | 'call_missed'
  | 'call_incoming'
  | 'gift_received'
  | 'game_invite'
  | 'game_reward'
  | 'room_invite'
  | 'post_like'
  | 'profile_like'
  | 'post_comment'
  | 'status_reaction'
  | 'coin_reward'
  | 'recharge_success'
  | 'talk_time_warning';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
  linkTab?: MainTab;
  metadata?: any;
}
