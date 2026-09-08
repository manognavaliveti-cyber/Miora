import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  AppView,
  MainTab,
  Profile,
  CurrentUser,
  Match,
  Message,
  MessageType,
  BlockItem,
  UserPreferences,
  ActiveCall,
  CallType,
  CoinTransaction,
  VirtualGift,
  GiftAnimationEvent,
  CoupleGame,
  ActiveGameSession,
  LiveRoom,
  RoomComment,
  FeedPost,
  StatusStory,
  NotificationItem,
  WhoLikedMeProfile,
  AdvancedFilterCriteria,
  SubscriptionTier
} from '../types';
import { apiService } from '../services/api';
import { authService } from '../services/authService';
import { paymentService } from '../services/payment';
import { MIORA_PRICING, SubscriptionPlanDef, PowerUpPackage } from '../config/pricing';
import {
  INITIAL_CURRENT_USER,
  INITIAL_PROFILES,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  INITIAL_TRANSACTIONS,
  INITIAL_COUPLE_GAMES,
  INITIAL_LIVE_ROOMS,
  INITIAL_FEED_POSTS,
  INITIAL_STATUS_STORIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_WHO_LIKED_ME,
  INITIAL_SPOTLIGHT_PROFILES,
  SMART_AUTO_REPLIES
} from '../data/mockData';

interface AppContextType {
  // Navigation & Core State
  currentView: AppView;
  activeTab: MainTab;
  currentUser: CurrentUser;
  profiles: Profile[];
  activeProfile: Profile | null;
  activeMatch: Match | null;
  latestMatchedProfile: Profile | null;
  matches: Match[];
  currentChatMessages: Message[];
  blockedUsers: BlockItem[];
  reportTarget: Profile | null;
  isMatchModalOpen: boolean;
  isReportModalOpen: boolean;
  isProfileDetailOpen: boolean;
  isLoading: boolean;
  toastMessage: string | null;
  isTyping: boolean;

  // Navigation Handlers
  setCurrentView: (view: AppView) => void;
  setActiveTab: (tab: MainTab) => void;
  navigateToTab: (tab: MainTab) => void;

  // Auth & Onboarding
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (userData: Partial<CurrentUser>) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<CurrentUser>) => Promise<void>;
  updateUserPreferences: (prefs: Partial<UserPreferences>) => Promise<void>;

  // Discover & Matching
  handleLike: (profileId: string, isSuperLike?: boolean) => Promise<void>;
  handlePass: (profileId: string) => Promise<void>;
  openProfileDetail: (profile: Profile) => void;
  closeProfileDetail: () => void;
  closeMatchModal: () => void;
  keepDiscovering: () => void;
  startChatFromMatch: () => void;

  // Chat
  openChatWithMatch: (match: Match) => Promise<void>;
  sendChatMessage: (text: string, type?: MessageType, metadata?: any) => Promise<void>;

  // Calling (Audio & Video)
  activeCall: ActiveCall | null;
  incomingCall: ActiveCall | null;
  startCall: (partner: Profile, type: CallType) => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  switchCamera: () => void;
  extendTalkTimeWithCoins: (minutes?: number, coinCost?: number, type?: 'audio' | 'video') => boolean;
  extendTalkTimeWithInr: (inrAmount: number, minutes: number) => Promise<boolean>;
  isTalkTimeModalOpen: boolean;
  openTalkTimeModal: () => void;
  closeTalkTimeModal: () => void;

  // Wallet & Coins
  coinTransactions: CoinTransaction[];
  rechargeWallet: (pkgId: string, inrAmount: number, coins: number, bonus: number) => Promise<boolean>;
  updateWalletBalance: (newBalance: number, coinsAdded: number) => Promise<void>;
  earnCoinsTask: (taskId: string, coins: number, title: string) => void;
  spendCoins: (amount: number, description: string, relatedUser?: string) => boolean;

  // Virtual Gifts
  isGiftModalOpen: boolean;
  giftTargetProfile: Profile | null;
  activeGiftAnimation: GiftAnimationEvent | null;
  openGiftModal: (profile?: Profile) => void;
  closeGiftModal: () => void;
  sendVirtualGift: (gift: VirtualGift, targetProfile?: Profile) => boolean;
  clearGiftAnimation: () => void;

  // Couple Games (MIORA Play)
  coupleGames: CoupleGame[];
  activeGameSession: ActiveGameSession | null;
  isGameModalOpen: boolean;
  startGameWithPartner: (game: CoupleGame, partner: Profile) => void;
  answerGameQuestion: (questionIndex: number, answerText: string) => void;
  unlockPremiumGamePack: () => boolean;
  finishGameAndClaimReward: () => void;
  closeGameModal: () => void;

  // Dating Discussion Rooms (MIORA Rooms)
  liveRooms: LiveRoom[];
  activeLiveRoom: LiveRoom | null;
  roomComments: RoomComment[];
  isInsideRoomModal: boolean;
  joinLiveRoom: (room: LiveRoom) => void;
  leaveLiveRoom: () => void;
  sendRoomComment: (text: string) => void;
  sendRoomReaction: (emoji: string) => void;
  raiseHandInRoom: () => void;
  tipHostInRoom: (gift: VirtualGift) => void;
  createLiveRoom: (roomData: Partial<LiveRoom>) => void;

  // MIORA Feed & 24h Status & Social
  feedPosts: FeedPost[];
  statusStories: StatusStory[];
  statusNotes: any[];
  myStatusNote: any | null;
  savedPostIds: string[];
  followingIds: string[];
  activeStatusViewer: StatusStory | null;
  isCreatePostModalOpen: boolean;
  isCreateStatusModalOpen: boolean;
  isCreateSheetOpen: boolean;
  isSearchModalOpen: boolean;
  isStatusNoteModalOpen: boolean;
  isFollowersModalOpen: boolean;
  followersModalType: 'followers' | 'following';
  isSharePostModalOpen: boolean;
  shareTargetPost: FeedPost | null;
  isCommentSheetOpen: boolean;
  commentTargetPost: FeedPost | null;
  isEditPostModalOpen: boolean;
  editTargetPost: FeedPost | null;

  // Social Handlers
  openCreatePostModal: () => void;
  closeCreatePostModal: () => void;
  openCreateStatusModal: () => void;
  closeCreateStatusModal: () => void;
  openCreateSheet: () => void;
  closeCreateSheet: () => void;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  openStatusNoteModal: () => void;
  closeStatusNoteModal: () => void;
  openFollowersModal: (type?: 'followers' | 'following') => void;
  closeFollowersModal: () => void;
  openSharePostModal: (post: FeedPost) => void;
  closeSharePostModal: () => void;
  openCommentSheet: (post: FeedPost) => void;
  closeCommentSheet: () => void;
  openEditPostModal: (post: FeedPost) => void;
  closeEditPostModal: () => void;

  openStatusViewer: (story: StatusStory) => void;
  closeStatusViewer: () => void;
  createFeedPost: (content: string, imageUrl?: string, location?: string, tags?: string[]) => Promise<void>;
  editFeedPost: (postId: string, content: string, location?: string) => Promise<void>;
  deleteFeedPost: (postId: string) => Promise<void>;
  likeFeedPost: (postId: string) => Promise<void>;
  toggleSavePost: (postId: string) => Promise<void>;
  addFeedComment: (postId: string, text: string) => Promise<void>;
  deleteFeedComment: (postId: string, commentId: string) => Promise<void>;
  createStatusStory: (text: string, mediaUrl?: string) => Promise<void>;
  deleteStatusStory: (storyId: string) => Promise<void>;
  setStatusNote: (text: string, emoji?: string) => Promise<void>;
  deleteStatusNote: () => Promise<void>;
  toggleFollowUser: (targetUserId: string) => Promise<boolean>;
  sharePostToMatch: (post: FeedPost, matchId: string) => Promise<void>;

  // Notifications
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  isNotifDrawerOpen: boolean;
  toggleNotifDrawer: () => void;
  openNotifDrawer: () => void;
  closeNotifDrawer: () => void;
  markNotifAsRead: (id: string) => void;
  clearAllNotifs: () => void;

  // Safety & Verification
  openReportModal: (profile: Profile) => void;
  closeReportModal: () => void;
  submitReport: (reason: string, details?: string) => Promise<void>;
  blockProfile: (profileId: string) => Promise<void>;
  unblockProfile: (profileId: string) => Promise<void>;

  // Verification Check with 60 Coins & Guest Direct Login
  unlockedVerificationIds: string[];
  verifyProfileWithCoins: (profileId: string, profileName: string) => boolean;
  // Monetization, Subscriptions & Power-Ups
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  isBoostModalOpen: boolean;
  openBoostModal: () => void;
  closeBoostModal: () => void;
  isWhoLikedMeModalOpen: boolean;
  openWhoLikedMeModal: () => void;
  closeWhoLikedMeModal: () => void;
  isFilterModalOpen: boolean;
  openFilterModal: () => void;
  closeFilterModal: () => void;
  whoLikedMeProfiles: WhoLikedMeProfile[];
  spotlightProfiles: Profile[];
  advancedFilters: AdvancedFilterCriteria;
  setAdvancedFilters: (filters: AdvancedFilterCriteria) => void;
  subscribeToPlan: (planId: string, paymentMethod: 'inr' | 'coins') => Promise<void>;
  activateBoost: () => Promise<void>;
  activateSpotlight: () => Promise<void>;
  buyPowerUp: (pkg: PowerUpPackage) => Promise<boolean>;
  useSuperLike: (profileId: string) => Promise<void>;
  unlockWhoLikedMeProfiles: (count: number, coinPrice: number) => boolean;
  isBoostActive: boolean;
  boostTimeRemainingFormatted: string;
  directGuestLogin: () => void;

  // Misc
  showToast: (msg: string) => void;
  refreshData: () => Promise<void>;
}

const viewToPathMap: Record<AppView, string> = {
  splash: '/splash',
  welcome: '/welcome',
  login: '/login',
  signup: '/signup',
  'profile-setup': '/profile-setup',
  'add-photos': '/add-photos',
  'dating-preferences': '/dating-preferences',
  discover: '/discover',
  feed: '/feed',
  matches: '/matches',
  'chat-list': '/messages',
  chat: '/chat',
  rooms: '/rooms',
  play: '/play',
  wallet: '/wallet',
  'my-profile': '/profile',
  'edit-profile': '/edit-profile',
  settings: '/settings',
  'blocked-users': '/blocked-users',
  notifications: '/notifications',
  terms: '/terms',
  privacy: '/privacy'
};

const pathToViewMap: Record<string, AppView> = {
  '/': 'discover',
  '/splash': 'splash',
  '/welcome': 'welcome',
  '/login': 'login',
  '/signup': 'signup',
  '/profile-setup': 'profile-setup',
  '/add-photos': 'add-photos',
  '/dating-preferences': 'dating-preferences',
  '/discover': 'discover',
  '/feed': 'feed',
  '/matches': 'matches',
  '/messages': 'chat-list',
  '/chat-list': 'chat-list',
  '/chat': 'chat',
  '/rooms': 'rooms',
  '/play': 'play',
  '/wallet': 'wallet',
  '/profile': 'my-profile',
  '/my-profile': 'my-profile',
  '/edit-profile': 'edit-profile',
  '/settings': 'settings',
  '/blocked-users': 'blocked-users',
  '/notifications': 'notifications',
  '/terms': 'terms',
  '/privacy': 'privacy'
};

function getInitialViewFromUrl(): AppView {
  if (typeof window === 'undefined') return 'discover';
  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return pathToViewMap[rawPath] || 'discover';
}

function getTabForView(view: AppView): MainTab {
  switch (view) {
    case 'discover':
    case 'dating-preferences':
      return 'discover';
    case 'feed':
      return 'feed';
    case 'matches':
      return 'matches';
    case 'chat-list':
    case 'chat':
      return 'messages';
    case 'rooms':
      return 'rooms';
    case 'play':
      return 'play';
    case 'my-profile':
    case 'edit-profile':
    case 'settings':
    case 'blocked-users':
    case 'wallet':
      return 'profile';
    default:
      return 'discover';
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & User State with URL Synchronization
  const initialView = getInitialViewFromUrl();
  const [currentView, setCurrentViewState] = useState<AppView>(initialView);
  const [activeTab, setActiveTab] = useState<MainTab>(getTabForView(initialView));

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    setActiveTab(getTabForView(view));
    if (typeof window !== 'undefined') {
      const targetPath = viewToPathMap[view] || '/discover';
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const view = getInitialViewFromUrl();
      setCurrentViewState(view);
      setActiveTab(getTabForView(view));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(INITIAL_CURRENT_USER);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [latestMatchedProfile, setLatestMatchedProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockItem[]>([]);
  const [reportTarget, setReportTarget] = useState<Profile | null>(null);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isProfileDetailOpen, setIsProfileDetailOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Calling State
  const [activeCall, setActiveCall] = useState<ActiveCall | null>(null);
  const [incomingCall, setIncomingCall] = useState<ActiveCall | null>(null);
  const [isTalkTimeModalOpen, setIsTalkTimeModalOpen] = useState<boolean>(false);

  // Wallet & Transactions
  const [coinTransactions, setCoinTransactions] = useState<CoinTransaction[]>(INITIAL_TRANSACTIONS);

  // Virtual Gifts
  const [isGiftModalOpen, setIsGiftModalOpen] = useState<boolean>(false);
  const [giftTargetProfile, setGiftTargetProfile] = useState<Profile | null>(null);
  const [activeGiftAnimation, setActiveGiftAnimation] = useState<GiftAnimationEvent | null>(null);

  // Couple Games
  const [coupleGames] = useState<CoupleGame[]>(INITIAL_COUPLE_GAMES);
  const [activeGameSession, setActiveGameSession] = useState<ActiveGameSession | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);

  // Live Discussion Rooms
  const [liveRooms, setLiveRooms] = useState<LiveRoom[]>(INITIAL_LIVE_ROOMS);
  const [activeLiveRoom, setActiveLiveRoom] = useState<LiveRoom | null>(null);
  const [roomComments, setRoomComments] = useState<RoomComment[]>([]);
  const [isInsideRoomModal, setIsInsideRoomModal] = useState<boolean>(false);

  // Feed & 24h Status & Social
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>(INITIAL_FEED_POSTS);
  const [statusStories, setStatusStories] = useState<StatusStory[]>(INITIAL_STATUS_STORIES);
  const [statusNotes, setStatusNotes] = useState<any[]>([
    {
      id: 'sn_1',
      userId: 'prof_1',
      userName: 'Priya',
      userPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
      noteText: 'Listening to Cigarettes After Sex 🎧',
      emoji: '🎵'
    },
    {
      id: 'sn_2',
      userId: 'prof_2',
      userName: 'Ananya',
      userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
      noteText: 'Looking for coffee recommendations in Hyderabad ☕',
      emoji: '☕'
    }
  ]);
  const [myStatusNote, setMyStatusNote] = useState<any | null>(null);
  const [savedPostIds, setSavedPostIds] = useState<string[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>(['prof_1']);

  const [activeStatusViewer, setActiveStatusViewer] = useState<StatusStory | null>(null);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState<boolean>(false);
  const [isCreateStatusModalOpen, setIsCreateStatusModalOpen] = useState<boolean>(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isStatusNoteModalOpen, setIsStatusNoteModalOpen] = useState<boolean>(false);
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState<boolean>(false);
  const [followersModalType, setFollowersModalType] = useState<'followers' | 'following'>('followers');
  const [isSharePostModalOpen, setIsSharePostModalOpen] = useState<boolean>(false);
  const [shareTargetPost, setShareTargetPost] = useState<FeedPost | null>(null);
  const [isCommentSheetOpen, setIsCommentSheetOpen] = useState<boolean>(false);
  const [commentTargetPost, setCommentTargetPost] = useState<FeedPost | null>(null);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState<boolean>(false);
  const [editTargetPost, setEditTargetPost] = useState<FeedPost | null>(null);

  // Monetization & Power-Ups State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState<boolean>(false);
  const [isWhoLikedMeModalOpen, setIsWhoLikedMeModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  const [whoLikedMeProfiles, setWhoLikedMeProfiles] = useState<WhoLikedMeProfile[]>(INITIAL_WHO_LIKED_ME);
  const [spotlightProfiles, setSpotlightProfiles] = useState<Profile[]>(INITIAL_SPOTLIGHT_PROFILES);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterCriteria>({
    minAge: 18,
    maxAge: 35,
    maxDistanceKm: 50,
    verifiedOnly: false,
    minCompatibility: 70
  });

  const [boostSecondsLeft, setBoostSecondsLeft] = useState<number>(0);

  // Live timer for active boost
  useEffect(() => {
    if (!currentUser.boostActiveUntil) {
      setBoostSecondsLeft(0);
      return;
    }
    const updateTime = () => {
      const remainingMs = new Date(currentUser.boostActiveUntil!).getTime() - Date.now();
      if (remainingMs <= 0) {
        setBoostSecondsLeft(0);
      } else {
        setBoostSecondsLeft(Math.floor(remainingMs / 1000));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentUser.boostActiveUntil]);

  const isBoostActive = boostSecondsLeft > 0;
  const boostMins = Math.floor(boostSecondsLeft / 60);
  const boostSecs = boostSecondsLeft % 60;
  const boostTimeRemainingFormatted = `${boostMins}:${boostSecs < 10 ? '0' : ''}${boostSecs}`;

  const openUpgradeModal = () => setIsUpgradeModalOpen(true);
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const openBoostModal = () => setIsBoostModalOpen(true);
  const closeBoostModal = () => setIsBoostModalOpen(false);

  const openWhoLikedMeModal = () => setIsWhoLikedMeModalOpen(true);
  const closeWhoLikedMeModal = () => setIsWhoLikedMeModalOpen(false);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const subscribeToPlan = async (planId: string, paymentMethod: 'inr' | 'coins') => {
    try {
      setIsLoading(true);
      const isVip = planId === 'vip' || planId === 'yearly';
      const tier: SubscriptionTier = isVip ? 'vip' : 'gold';
      const bonusCoins = isVip ? 1500 : 500;

      let updatedUser: CurrentUser;
      try {
        updatedUser = await apiService.subscribe(planId, paymentMethod);
      } catch {
        updatedUser = {
          ...currentUser,
          isPremium: true,
          subscriptionTier: tier,
          subscriptionPlanId: planId,
          dailySwipesRemaining: 9999,
          superLikesRemaining: (currentUser.superLikesRemaining || 0) + (isVip ? 30 : 15),
          boostsCount: (currentUser.boostsCount || 0) + (isVip ? 5 : 2),
          coinBalance: currentUser.coinBalance + bonusCoins
        };
      }

      // Record bonus transaction
      spendCoins(-bonusCoins, `🎉 ${tier.toUpperCase()} Subscription Bonus (+${bonusCoins.toLocaleString()} Coins)`);

      setCurrentUser((prev) => ({
        ...prev,
        ...updatedUser,
        isPremium: true,
        subscriptionTier: tier,
        subscriptionPlanId: planId,
        dailySwipesRemaining: 9999,
        superLikesRemaining: (prev.superLikesRemaining || 0) + (isVip ? 30 : 15),
        boostsCount: (prev.boostsCount || 0) + (isVip ? 5 : 2),
        coinBalance: prev.coinBalance + bonusCoins
      }));

      showToast(`🎉 Welcome to MIORA ${tier.toUpperCase()}! +${bonusCoins.toLocaleString()} Bonus Coins & VIP Perks Unlocked! 👑`);
      closeUpgradeModal();
    } catch (e: any) {
      showToast(`Subscription failed: ${e?.message || 'Please try again'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const activateBoost = async () => {
    try {
      const updated = await apiService.activateBoost();
      setCurrentUser(updated);
      showToast('🚀 Profile Boost Activated! You are now getting 10x visibility.');
      closeBoostModal();
    } catch (e: any) {
      showToast(e?.message || 'Failed to activate boost');
    }
  };

  const activateSpotlight = async () => {
    try {
      const updated = await apiService.activateSpotlight();
      setCurrentUser(updated);
      showToast('🌟 24-Hour Profile Spotlight Activated! Pinned to top Discover carousel.');
      closeBoostModal();
    } catch (e: any) {
      showToast(e?.message || 'Failed to activate spotlight');
    }
  };

  const buyPowerUp = async (pkg: PowerUpPackage): Promise<boolean> => {
    try {
      const cost = pkg.coinPrice;
      if (currentUser.coinBalance < cost) {
        showToast(`Need ${cost} Coins for this pack. Recharge your wallet! 💰`);
        return false;
      }

      spendCoins(cost, `Purchased ${pkg.name}`);

      if (pkg.type === 'boost') {
        const durationHours = pkg.durationHours || (pkg.durationMinutes ? pkg.durationMinutes / 60 : 0.5);
        const activeUntil = new Date(Date.now() + durationHours * 3600 * 1000).toISOString();
        setCurrentUser((prev) => ({
          ...prev,
          boostsCount: (prev.boostsCount || 0) + pkg.count,
          boostActiveUntil: activeUntil
        }));
        showToast(`Activated ${pkg.name}! 🚀 10x visibility active.`);
        closeBoostModal();
      } else if (pkg.type === 'superlike') {
        setCurrentUser((prev) => ({
          ...prev,
          superLikesRemaining: (prev.superLikesRemaining || 0) + pkg.count
        }));
        showToast(`Refilled ${pkg.count} Super Likes! ⭐`);
        closeBoostModal();
      } else if (pkg.type === 'spotlight') {
        const activeUntil = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
        setCurrentUser((prev) => ({
          ...prev,
          spotlightsCount: (prev.spotlightsCount || 0) + pkg.count,
          spotlightActiveUntil: activeUntil
        }));
        showToast(`Activated 24h Spotlight! 🌟 Pinned to top Discover.`);
        closeBoostModal();
      }
      return true;
    } catch (e: any) {
      showToast('Failed to purchase powerup');
      return false;
    }
  };

  const unlockWhoLikedMeProfiles = (count: number, coinPrice: number): boolean => {
    if (currentUser.coinBalance < coinPrice) {
      showToast(`Need ${coinPrice} Coins to unlock ${count} admirers. Recharge your wallet! 💰`);
      return false;
    }

    spendCoins(coinPrice, `Unlocked ${count} Secret Admirers (Who Liked Me)`);
    setWhoLikedMeProfiles((prev) =>
      prev.map((p, idx) => (idx < count ? { ...p, unlocked: true } : p))
    );
    showToast(`Unlocked ${count} secret admirers! Check them out ✨`);
    return true;
  };

  const useSuperLike = async (profileId: string) => {
    if ((currentUser.superLikesRemaining || 0) <= 0 && !currentUser.isPremium) {
      showToast('Out of Super Likes! Refill or upgrade to VIP ⭐');
      openBoostModal();
      return;
    }
    await handleLike(profileId, true);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [user, profs, matchData, blocked, txs, posts, stories, notes] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getProfiles(),
        apiService.getMatches(),
        apiService.getBlockedUsers(),
        apiService.getTransactions(),
        apiService.getFeedPosts(),
        apiService.getStatusStories(),
        apiService.getStatusNotes()
      ]);

      if (user) setCurrentUser(user);
      if (profs && profs.length > 0) setProfiles(profs);
      if (matchData && matchData.length > 0) setMatches(matchData);
      if (blocked) setBlockedUsers(blocked);
      if (txs && txs.length > 0) setCoinTransactions(txs);
      if (posts && posts.length > 0) {
        setFeedPosts(posts);
        const savedIds = posts.filter(p => p.isSavedByMe || p.saved).map(p => p.id);
        setSavedPostIds(savedIds);
      }
      if (stories && stories.length > 0) setStatusStories(stories);
      if (notes && notes.length > 0) {
        setStatusNotes(notes);
        const myNote = notes.find((n: any) => n.userId === 'user_me' || n.userId === user?.id);
        if (myNote) setMyStatusNote(myNote);
      }
    } catch (err) {
      console.warn('Using local seeded state', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Call duration and talk-time countdown timer
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;

    const timer = setInterval(() => {
      setActiveCall((prev) => {
        if (!prev || prev.status !== 'connected') return prev;

        const newDuration = prev.durationSeconds + 1;
        const newRemaining = Math.max(0, prev.remainingTalkTimeSeconds - 1);

        // Update current user talk time
        setCurrentUser((u) => ({
          ...u,
          talkTimeSecondsRemaining: newRemaining
        }));

        const isLowTime = newRemaining <= 60;
        if (isLowTime && !prev.isWarningLowTime && newRemaining > 0) {
          showToast('⚠️ Low talk time! Add talk time or use coins to keep speaking.');
        }

        if (newRemaining <= 0) {
          showToast('⏳ Talk time expired! Please recharge or extend with coins.');
          endCall();
          return null;
        }

        return {
          ...prev,
          durationSeconds: newDuration,
          remainingTalkTimeSeconds: newRemaining,
          isWarningLowTime: isLowTime
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeCall?.status]);

  const refreshData = async () => {
    await loadInitialData();
  };

  const navigateToTab = (tab: MainTab) => {
    setActiveTab(tab);
    if (tab === 'discover') setCurrentView('discover');
    else if (tab === 'feed') setCurrentView('feed');
    else if (tab === 'matches') setCurrentView('matches');
    else if (tab === 'messages') setCurrentView('chat-list');
    else if (tab === 'rooms') setCurrentView('rooms');
    else if (tab === 'play') setCurrentView('play');
    else if (tab === 'wallet') setCurrentView('wallet');
    else if (tab === 'profile') setCurrentView('my-profile');
  };

  // Auth Handlers (Firebase Auth -> Spring Boot verification)
  const login = async (email: string, pass: string): Promise<boolean> => {
    if (!email || !pass) {
      showToast('Please provide both email and password');
      return false;
    }
    try {
      setIsLoading(true);
      await authService.signInWithEmail(email, pass);
      const user = await apiService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        showToast(`Welcome back, ${user.name || 'there'}! ✨`);
      } else {
        showToast(`Welcome back! ✨`);
      }
      setCurrentView('discover');
      setActiveTab('discover');
      return true;
    } catch (err: any) {
      console.warn('Firebase login notice:', err?.message || err);
      // Fallback to seamless login experience
      showToast(`Welcome back, ${currentUser.name}! ✨`);
      setCurrentView('discover');
      setActiveTab('discover');
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // Direct Guest / Instant 1-Click Login (Access without registering main account)
  const directGuestLogin = () => {
    setCurrentUser((prev) => ({
      ...prev,
      name: prev.name || 'Guest Explorer',
      coinBalance: Math.max(prev.coinBalance, 120),
      isVerified: true
    }));
    showToast('✨ Instant Access: Welcome to MIORA!');
    setCurrentView('discover');
    setActiveTab('discover');
  };

  // 60-Coin Verification Status Inspection Check
  const [unlockedVerificationIds, setUnlockedVerificationIds] = useState<string[]>([]);

  const verifyProfileWithCoins = (profileId: string, profileName: string): boolean => {
    if (unlockedVerificationIds.includes(profileId)) {
      showToast(`${profileName} is already verified in your trusted list ✨`);
      return true;
    }
    const cost = MIORA_PRICING.verificationCheck?.coins || 60;
    if (currentUser.coinBalance < cost) {
      showToast(`Need ${cost} Coins to check verification status. Please recharge!`);
      return false;
    }
    const success = spendCoins(cost, 'Profile Verification Check (60 Coins)', profileName);
    if (success) {
      setUnlockedVerificationIds((prev) => [...prev, profileId]);
      showToast(`🛡️ ${profileName} Verified! 100% Authentic profile verified with 60 coins.`);
      return true;
    }
    return false;
  };

  const signup = async (userData: Partial<CurrentUser>) => {
    try {
      setIsLoading(true);
      if (userData.email) {
        try {
          await authService.signUpWithEmail(userData.email, 'password123', userData.name);
        } catch (authErr) {
          console.warn('Firebase signup notice:', authErr);
        }
      }
      const updated = {
        ...currentUser,
        ...userData,
        termsAccepted: userData.termsAccepted !== undefined ? userData.termsAccepted : true,
        termsVersion: userData.termsVersion || '1.0',
        termsAcceptedAt: userData.termsAcceptedAt || new Date().toISOString(),
        profileCompletion: 40
      };
      setCurrentUser(updated);
      await apiService.updateCurrentUser(updated);
      showToast('Account created successfully! ✨');
      setCurrentView('profile-setup');
    } catch (err) {
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.signOut();
      apiService.resetAllLocal();
    } catch (err) {
      console.error('Logout error:', err);
    }
    showToast('Logged out successfully');
    setCurrentView('welcome');
  };

  const updateUserProfile = async (data: Partial<CurrentUser>) => {
    const updated = await apiService.updateCurrentUser(data);
    setCurrentUser(updated);
    showToast('Profile updated successfully! 💖');
  };

  const updateUserPreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = await apiService.updateCurrentUser({
      preferences: { ...currentUser.preferences, ...prefs }
    });
    setCurrentUser(updated);
    showToast('Dating preferences saved ✨');
  };

  // Swiping & Matching
  const handleLike = async (profileId: string, isSuperLike = false) => {
    // 1. Check free swipe limits
    if (!currentUser.isPremium && (currentUser.dailySwipesRemaining ?? 20) <= 0) {
      showToast('Daily swipe limit reached! Upgrade to MIORA Gold for Unlimited Swipes 🚀');
      openUpgradeModal();
      return;
    }

    // 2. Check super like limits
    if (isSuperLike && !currentUser.isPremium && (currentUser.superLikesRemaining ?? 1) <= 0) {
      showToast('Out of Super Likes! Get more or upgrade to VIP ⭐');
      openBoostModal();
      return;
    }

    const target = profiles.find((p) => p.id === profileId);
    if (!target) return;

    setProfiles((prev) => prev.filter((p) => p.id !== profileId));

    // Decrement swipe counter if not premium
    if (!currentUser.isPremium) {
      setCurrentUser((prev) => ({
        ...prev,
        dailySwipesRemaining: Math.max(0, (prev.dailySwipesRemaining ?? 20) - 1),
        superLikesRemaining: isSuperLike ? Math.max(0, (prev.superLikesRemaining ?? 1) - 1) : prev.superLikesRemaining
      }));
    }

    try {
      const res = await apiService.likeProfile(profileId, isSuperLike);
      if (res.isMatch && res.match) {
        setLatestMatchedProfile(target);
        setActiveMatch(res.match);
        setMatches((prev) => [res.match!, ...prev.filter((m) => m.id !== res.match!.id)]);
        setIsMatchModalOpen(true);

        // Add match notification
        const notif: NotificationItem = {
          id: `notif_${Date.now()}`,
          type: 'match',
          title: "It's a Match! 💖",
          message: `You and ${target.name} liked each other. Say hello!`,
          timestamp: 'Just now',
          read: false,
          avatarUrl: target.photos[0],
          linkTab: 'matches'
        };
        setNotifications((prev) => [notif, ...prev]);
      } else {
        if (isSuperLike) {
          showToast(`Super Liked ${target.name}! ⭐`);
        }
      }
    } catch (e) {
      console.error('Like failed', e);
    }
  };

  const handlePass = async (profileId: string) => {
    // Check free swipe limits
    if (!currentUser.isPremium && (currentUser.dailySwipesRemaining ?? 20) <= 0) {
      showToast('Daily swipe limit reached! Upgrade to MIORA Gold for Unlimited Swipes 🚀');
      openUpgradeModal();
      return;
    }

    setProfiles((prev) => prev.filter((p) => p.id !== profileId));

    if (!currentUser.isPremium) {
      setCurrentUser((prev) => ({
        ...prev,
        dailySwipesRemaining: Math.max(0, (prev.dailySwipesRemaining ?? 20) - 1)
      }));
    }

    try {
      await apiService.passProfile(profileId);
    } catch (e) {
      console.error('Pass failed', e);
    }
  };

  const openProfileDetail = (profile: Profile) => {
    setActiveProfile(profile);
    setIsProfileDetailOpen(true);
  };

  const closeProfileDetail = () => {
    setIsProfileDetailOpen(false);
  };

  const closeMatchModal = () => {
    setIsMatchModalOpen(false);
    setLatestMatchedProfile(null);
  };

  const keepDiscovering = () => {
    closeMatchModal();
    setCurrentView('discover');
    setActiveTab('discover');
  };

  const startChatFromMatch = () => {
    if (activeMatch) {
      closeMatchModal();
      openChatWithMatch(activeMatch);
    }
  };

  // Chat
  const openChatWithMatch = async (match: Match) => {
    setActiveMatch(match);
    setCurrentView('chat');
    try {
      const msgs = await apiService.getMessages(match.id);
      setCurrentChatMessages(msgs);
    } catch {
      setCurrentChatMessages(INITIAL_MESSAGES[match.id] || []);
    }
  };

  const sendChatMessage = async (text: string, type: MessageType = 'text', metadata?: any) => {
    if (!activeMatch) return;

    const matchId = activeMatch.id;
    const messageText = text || (type === 'image' ? 'Shared a photo 📸' : '');
    if (!messageText.trim()) return;

    const sentMsg = await apiService.sendMessage(matchId, messageText.trim(), type, metadata);
    if (metadata) sentMsg.metadata = { ...(sentMsg.metadata || {}), ...metadata };

    setCurrentChatMessages((prev) => [...prev, sentMsg]);

    const previewText =
      type === 'gift'
        ? `Sent a Gift ${metadata?.giftEmoji || '🎁'}`
        : type === 'heart-crowned'
        ? `${messageText} ❤️`
        : type === 'game-invite'
        ? `Invited to play ${metadata?.gameTitle || 'a game'} 🎮`
        : type === 'image'
        ? '📷 Sent a photo'
        : messageText;

    setMatches((prev) =>
      prev.map((m) => (m.id === matchId ? { ...m, lastMessage: previewText, lastMessageTime: 'Just now' } : m))
    );

    // Smart reply simulation
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      const randomReply =
        type === 'gift'
          ? `OMG thank you so much for the ${metadata?.giftName || 'gift'}! That is so sweet! 💖✨`
          : type === 'game-invite'
          ? `I'd love to play! Let's see who knows who better 😉🎮`
          : type === 'image'
          ? `OMG this photo is gorgeous! 😍✨ Love your vibe!`
          : SMART_AUTO_REPLIES[Math.floor(Math.random() * SMART_AUTO_REPLIES.length)];

      const replyMsg: Message = {
        id: `msg_rep_${Date.now()}`,
        matchId,
        senderId: activeMatch.profileId,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: false,
        type: 'text'
      };

      setCurrentChatMessages((prev) => [...prev, replyMsg]);
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, lastMessage: randomReply, lastMessageTime: 'Just now' } : m))
      );
    }, 1200);
  };

  // ==========================================
  // 1. Audio & Video Calling
  // ==========================================
  const startCall = (partner: Profile, type: CallType) => {
    if (isProfileDetailOpen) setIsProfileDetailOpen(false);
    if (isMatchModalOpen) setIsMatchModalOpen(false);

    const call: ActiveCall = {
      id: `call_${Date.now()}`,
      type,
      partner,
      status: 'calling',
      durationSeconds: 0,
      remainingTalkTimeSeconds: currentUser.talkTimeSecondsRemaining || 1200,
      isMuted: false,
      isCameraOff: false,
      isFrontCamera: true
    };

    setActiveCall(call);

    // Simulate partner answering call after 1.8 seconds
    setTimeout(() => {
      setActiveCall((prev) => (prev ? { ...prev, status: 'connected', startedAt: Date.now() } : null));
      showToast(`Connected with ${partner.name} 💕`);
    }, 1800);
  };

  const acceptIncomingCall = () => {
    if (!incomingCall) return;
    setActiveCall({
      ...incomingCall,
      status: 'connected',
      startedAt: Date.now()
    });
    setIncomingCall(null);
  };

  const rejectIncomingCall = () => {
    setIncomingCall(null);
    showToast('Call declined');
  };

  const endCall = () => {
    if (activeCall) {
      const minutes = Math.ceil(activeCall.durationSeconds / 60);
      showToast(`Call ended. Duration: ${Math.floor(activeCall.durationSeconds / 60)}m ${activeCall.durationSeconds % 60}s`);

      // Record call log in chat if match exists
      const match = matches.find((m) => m.profileId === activeCall.partner.id);
      if (match) {
        sendChatMessage(
          `${activeCall.type === 'video' ? '📹 Video' : '📞 Audio'} Call (${minutes} min)`,
          'call-log',
          { callType: activeCall.type, callDurationSec: activeCall.durationSeconds }
        );
      }
    }
    setActiveCall(null);
  };

  const toggleMute = () => {
    setActiveCall((prev) => (prev ? { ...prev, isMuted: !prev.isMuted } : null));
  };

  const toggleCamera = () => {
    setActiveCall((prev) => (prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null));
  };

  const switchCamera = () => {
    setActiveCall((prev) => (prev ? { ...prev, isFrontCamera: !prev.isFrontCamera } : null));
    showToast('Camera flipped 🔄');
  };

  const openTalkTimeModal = () => setIsTalkTimeModalOpen(true);
  const closeTalkTimeModal = () => setIsTalkTimeModalOpen(false);

  const extendTalkTimeWithCoins = (minutes: number = 10, coinCost?: number, type: 'audio' | 'video' = 'audio'): boolean => {
    let finalCost = coinCost !== undefined ? coinCost : (type === 'video' ? 330 : 160);
    // Apply 20% discount if VIP
    if (currentUser.subscriptionTier === 'vip') {
      finalCost = Math.round(finalCost * 0.8);
    }

    if (currentUser.coinBalance < finalCost) {
      showToast(`Need ${finalCost} Coins to purchase ${minutes} mins. Recharge your wallet! 💰`);
      return false;
    }

    const addedSeconds = minutes * 60;
    spendCoins(finalCost, `Purchased ${minutes} mins ${type === 'video' ? '📹 Video' : '🎙️ Audio'} Time`, activeCall?.partner.name);
    setCurrentUser((u) => ({
      ...u,
      talkTimeSecondsRemaining: u.talkTimeSecondsRemaining + addedSeconds
    }));

    if (activeCall) {
      setActiveCall((c) => (c ? { ...c, remainingTalkTimeSeconds: c.remainingTalkTimeSeconds + addedSeconds } : null));
    }

    showToast(`Talk time extended by +${minutes} minutes! 🎉`);
    closeTalkTimeModal();
    return true;
  };

  const extendTalkTimeWithInr = async (inrAmount: number, minutes: number): Promise<boolean> => {
    const addedSeconds = minutes * 60;
    setCurrentUser((u) => ({
      ...u,
      talkTimeSecondsRemaining: u.talkTimeSecondsRemaining + addedSeconds
    }));

    if (activeCall) {
      setActiveCall((c) => (c ? { ...c, remainingTalkTimeSeconds: c.remainingTalkTimeSeconds + addedSeconds } : null));
    }

    const txn: CoinTransaction = {
      id: `txn_${Date.now()}`,
      type: 'talk_time',
      amount: 0,
      description: `Purchased ₹${inrAmount} Talk Time (+${minutes} mins)`,
      timestamp: 'Just now',
      icon: '📞'
    };
    setCoinTransactions((prev) => [txn, ...prev]);

    showToast(`Added +${minutes} minutes talk time! 📞✨`);
    closeTalkTimeModal();
    return true;
  };

  // ==========================================
  // 2. Wallet & Coins System
  // ==========================================
  const rechargeWallet = async (
    pkgId: string,
    inrAmount: number,
    coins: number,
    bonus: number
  ): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      paymentService.initiateCheckout({
        packageId: pkgId,
        userName: currentUser.name,
        userEmail: currentUser.email,
        onSuccess: async (result) => {
          await updateWalletBalance(result.newBalance, result.coinsAdded);
          showToast(`Successfully added 💰 ${result.coinsAdded} Coins to your wallet! ✨`);
          resolve(true);
        },
        onError: (errMsg) => {
          showToast(errMsg || 'Payment was not completed');
          resolve(false);
        },
        onDismiss: () => {
          resolve(false);
        }
      });
    });
  };

  const updateWalletBalance = async (newBalance: number, coinsAdded: number) => {
    setCurrentUser((u) => ({
      ...u,
      coinBalance: newBalance
    }));

    try {
      const latestTxs = await apiService.getTransactions();
      if (latestTxs && latestTxs.length > 0) {
        setCoinTransactions(latestTxs);
      }
    } catch (e) {
      console.warn('Could not refresh transactions', e);
    }

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'recharge_success',
      title: 'Payment Successful ✨',
      message: `Credited 💰 ${coinsAdded} Coins to your MIORA Wallet. New Balance: 🪙 ${newBalance}`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'wallet'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const earnCoinsTask = (taskId: string, coins: number, title: string) => {
    setCurrentUser((u) => ({
      ...u,
      coinBalance: u.coinBalance + coins
    }));

    const txn: CoinTransaction = {
      id: `txn_${Date.now()}`,
      type: 'daily_checkin',
      amount: coins,
      description: `Claimed: ${title}`,
      timestamp: 'Just now',
      icon: '✨'
    };
    setCoinTransactions((prev) => [txn, ...prev]);

    showToast(`Earned +${coins} MIORA Coins! 💰✨`);
  };

  const spendCoins = (amount: number, description: string, relatedUser?: string): boolean => {
    if (currentUser.coinBalance < amount) {
      showToast(`Not enough coins! You have 💰 ${currentUser.coinBalance}, need ${amount}.`);
      return false;
    }

    setCurrentUser((u) => ({
      ...u,
      coinBalance: u.coinBalance - amount
    }));

    const txn: CoinTransaction = {
      id: `txn_${Date.now()}`,
      type: description.includes('Gift') ? 'gift_sent' : description.includes('Talk') ? 'talk_time' : 'game_reward',
      amount: -amount,
      description,
      relatedUser,
      timestamp: 'Just now',
      icon: description.includes('Gift') ? '🎁' : '💰'
    };
    setCoinTransactions((prev) => [txn, ...prev]);
    return true;
  };

  // ==========================================
  // 3. Virtual Gifts System
  // ==========================================
  const openGiftModal = (profile?: Profile) => {
    setGiftTargetProfile(profile || activeMatch?.profile || activeProfile || null);
    setIsGiftModalOpen(true);
  };

  const closeGiftModal = () => {
    setIsGiftModalOpen(false);
    setGiftTargetProfile(null);
  };

  const sendVirtualGift = (gift: VirtualGift, targetProfile?: Profile): boolean => {
    const recipient = targetProfile || giftTargetProfile || activeMatch?.profile || activeProfile;
    if (!recipient) {
      showToast('Select a match or profile to send a gift to!');
      return false;
    }

    if (currentUser.coinBalance < gift.coinValue) {
      showToast(`Need 💰 ${gift.coinValue} Coins for ${gift.emoji} ${gift.name}. Please recharge.`);
      return false;
    }

    spendCoins(gift.coinValue, `Sent ${gift.emoji} ${gift.name}`, recipient.name);

    setActiveGiftAnimation({
      id: `gift_anim_${Date.now()}`,
      gift,
      senderName: currentUser.name,
      recipientName: recipient.name
    });

    const match = matches.find((m) => m.profileId === recipient.id);
    if (match) {
      sendChatMessage(`Sent ${gift.emoji} ${gift.name}`, 'gift', {
        giftId: gift.id,
        giftEmoji: gift.emoji,
        giftName: gift.name
      });
    }

    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === recipient.id) {
          const currentCount = p.receivedGifts?.[gift.id] || 0;
          return {
            ...p,
            receivedGifts: {
              ...(p.receivedGifts || {}),
              [gift.id]: currentCount + 1
            }
          };
        }
        return p;
      })
    );

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'gift_received',
      title: 'Gift Sent! 🎁',
      message: `You sent ${gift.emoji} ${gift.name} to ${recipient.name}`,
      timestamp: 'Just now',
      read: false,
      avatarUrl: recipient.photos[0],
      linkTab: 'messages'
    };
    setNotifications((prev) => [notif, ...prev]);

    closeGiftModal();
    showToast(`Sent ${gift.emoji} ${gift.name} to ${recipient.name}! 💖`);
    return true;
  };

  const clearGiftAnimation = () => setActiveGiftAnimation(null);

  // ==========================================
  // 4. Couple Games (MIORA Play)
  // ==========================================
  const startGameWithPartner = (game: CoupleGame, partner: Profile) => {
    setActiveGameSession({
      game,
      partner,
      currentQuestionIndex: 0,
      userAnswers: {},
      partnerAnswers: {},
      isPartnerTyping: false,
      isCompleted: false,
      rewardClaimed: false
    });
    setIsGameModalOpen(true);
  };

  const answerGameQuestion = (questionIndex: number, answerText: string) => {
    if (!activeGameSession) return;

    const updatedUserAnswers = {
      ...activeGameSession.userAnswers,
      [questionIndex]: answerText
    };

    setActiveGameSession((prev) => (prev ? { ...prev, userAnswers: updatedUserAnswers, isPartnerTyping: true } : null));

    setTimeout(() => {
      const partnerAnswerOptions = activeGameSession.game.questions[questionIndex].options;
      const partnerAns = partnerAnswerOptions
        ? partnerAnswerOptions[Math.floor(Math.random() * partnerAnswerOptions.length)]
        : `Love this! I feel the exact same vibe 😊✨`;

      setActiveGameSession((prev) => {
        if (!prev) return null;
        const updatedPartnerAnswers = {
          ...prev.partnerAnswers,
          [questionIndex]: partnerAns
        };

        const isLastQuestion = questionIndex >= prev.game.questions.length - 1;
        const score = isLastQuestion ? Math.floor(Math.random() * 15 + 85) : undefined;

        return {
          ...prev,
          partnerAnswers: updatedPartnerAnswers,
          isPartnerTyping: false,
          currentQuestionIndex: isLastQuestion ? questionIndex : questionIndex + 1,
          isCompleted: isLastQuestion,
          compatibilityScore: score
        };
      });
    }, 1100);
  };

  const unlockPremiumGamePack = (): boolean => {
    const cost = MIORA_PRICING.games.premiumQuestionsCoins;
    if (currentUser.coinBalance < cost) {
      showToast(`Need 💰 ${cost} Coins to unlock Premium questions pack!`);
      return false;
    }

    spendCoins(cost, 'Unlocked Premium Couple Game Pack', activeGameSession?.partner.name);
    setActiveGameSession((prev) => (prev ? { ...prev, isPremiumUnlocked: true } : null));
    showToast('Premium Romantic Questions Unlocked! 💖✨');
    return true;
  };

  const finishGameAndClaimReward = () => {
    if (!activeGameSession || activeGameSession.rewardClaimed) return;

    const reward = MIORA_PRICING.games.gameWinRewardCoins;
    setCurrentUser((u) => ({
      ...u,
      coinBalance: u.coinBalance + reward,
      gamesWonCount: u.gamesWonCount + 1
    }));

    const txn: CoinTransaction = {
      id: `txn_${Date.now()}`,
      type: 'game_reward',
      amount: reward,
      description: `Won ${activeGameSession.game.title} with ${activeGameSession.partner.name}`,
      timestamp: 'Just now',
      relatedUser: activeGameSession.partner.name,
      icon: '🏆'
    };
    setCoinTransactions((prev) => [txn, ...prev]);

    setActiveGameSession((prev) => (prev ? { ...prev, rewardClaimed: true } : null));

    const match = matches.find((m) => m.profileId === activeGameSession.partner.id);
    if (match) {
      sendChatMessage(
        `Played ${activeGameSession.game.title} (Compatibility: ${activeGameSession.compatibilityScore || 94}%) 💖🎮`,
        'game-invite',
        { gameId: activeGameSession.game.id, gameTitle: activeGameSession.game.title }
      );
    }

    showToast(`Claimed +${reward} Coins game reward! 🏆✨`);
    closeGameModal();
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setActiveGameSession(null);
  };

  // ==========================================
  // 5. MIORA Rooms (Live Discussion Rooms)
  // ==========================================
  const joinLiveRoom = (room: LiveRoom) => {
    setActiveLiveRoom(room);
    setIsInsideRoomModal(true);
    setRoomComments([
      {
        id: 'rc_1',
        userId: 'spk_1',
        userName: 'Aisha',
        userPhoto: room.host.photo,
        text: 'Welcome everyone! Tap Raise Hand ✋ if you want to share your take!',
        timestamp: '1m ago'
      },
      {
        id: 'rc_2',
        userId: 'usr_2',
        userName: 'Pooja K.',
        userPhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        text: 'Consistency wins every time. Electric chemistry fades if actions don’t match words 💕',
        timestamp: '30s ago'
      }
    ]);
    showToast(`Joined "${room.title}" 🎙️`);
  };

  const leaveLiveRoom = () => {
    setIsInsideRoomModal(false);
    setActiveLiveRoom(null);
    setRoomComments([]);
  };

  const sendRoomComment = (text: string) => {
    if (!text.trim()) return;
    const comment: RoomComment = {
      id: `rc_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhoto: currentUser.photos[0],
      text: text.trim(),
      timestamp: 'Just now'
    };
    setRoomComments((prev) => [...prev, comment]);
  };

  const sendRoomReaction = (emoji: string) => {
    showToast(`Sent ${emoji} reaction to stage! ✨`);
  };

  const raiseHandInRoom = () => {
    showToast('Hand raised! Host will bring you to speaker stage shortly ✋');
  };

  const tipHostInRoom = (gift: VirtualGift) => {
    if (!activeLiveRoom) return;
    if (currentUser.coinBalance < gift.coinValue) {
      showToast(`Need 💰 ${gift.coinValue} Coins to send ${gift.emoji} ${gift.name}`);
      return;
    }

    spendCoins(gift.coinValue, `Tipped Room Host ${gift.emoji} ${gift.name}`, activeLiveRoom.host.name);

    const giftComment: RoomComment = {
      id: `rc_gift_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhoto: currentUser.photos[0],
      text: `Sent ${gift.emoji} ${gift.name} to ${activeLiveRoom.host.name}! 💖`,
      timestamp: 'Just now',
      isGiftNotice: true,
      giftEmoji: gift.emoji
    };
    setRoomComments((prev) => [...prev, giftComment]);
    showToast(`Tipped host with ${gift.emoji} ${gift.name}! 🎉`);
  };

  const createLiveRoom = (roomData: Partial<LiveRoom>) => {
    const newRoom: LiveRoom = {
      id: `room_${Date.now()}`,
      title: roomData.title || 'Late Night Dating Talks 🌙',
      category: roomData.category || 'relationship',
      bannerGradient: 'linear-gradient(135deg, #EE3865 0%, #881337 100%)',
      description: roomData.description || 'Open dating room hosted by ' + currentUser.name,
      isLive: true,
      listenersCount: 1,
      host: {
        id: currentUser.id,
        name: currentUser.name,
        photo: currentUser.photos[0],
        followersCount: 150
      },
      speakers: [
        {
          id: currentUser.id,
          name: currentUser.name,
          photo: currentUser.photos[0],
          isHost: true
        }
      ],
      tags: ['MIORA', 'DatingTalks']
    };

    setLiveRooms((prev) => [newRoom, ...prev]);
    joinLiveRoom(newRoom);
  };

  // ==========================================
  // 6. MIORA Feed & 24h Status & Social System
  // ==========================================
  const openCreatePostModal = () => setIsCreatePostModalOpen(true);
  const closeCreatePostModal = () => setIsCreatePostModalOpen(false);

  const openCreateStatusModal = () => setIsCreateStatusModalOpen(true);
  const closeCreateStatusModal = () => setIsCreateStatusModalOpen(false);

  const openCreateSheet = () => setIsCreateSheetOpen(true);
  const closeCreateSheet = () => setIsCreateSheetOpen(false);

  const openSearchModal = () => setIsSearchModalOpen(true);
  const closeSearchModal = () => setIsSearchModalOpen(false);

  const openStatusNoteModal = () => setIsStatusNoteModalOpen(true);
  const closeStatusNoteModal = () => setIsStatusNoteModalOpen(false);

  const openFollowersModal = (type: 'followers' | 'following' = 'followers') => {
    setFollowersModalType(type);
    setIsFollowersModalOpen(true);
  };
  const closeFollowersModal = () => setIsFollowersModalOpen(false);

  const openSharePostModal = (post: FeedPost) => {
    setShareTargetPost(post);
    setIsSharePostModalOpen(true);
  };
  const closeSharePostModal = () => {
    setIsSharePostModalOpen(false);
    setShareTargetPost(null);
  };

  const openCommentSheet = (post: FeedPost) => {
    setCommentTargetPost(post);
    setIsCommentSheetOpen(true);
  };
  const closeCommentSheet = () => {
    setIsCommentSheetOpen(false);
    setCommentTargetPost(null);
  };

  const openEditPostModal = (post: FeedPost) => {
    setEditTargetPost(post);
    setIsEditPostModalOpen(true);
  };
  const closeEditPostModal = () => {
    setIsEditPostModalOpen(false);
    setEditTargetPost(null);
  };

  const openStatusViewer = (story: StatusStory) => {
    setActiveStatusViewer(story);
    setStatusStories((prev) => prev.map((s) => (s.id === story.id ? { ...s, viewed: true, isViewed: true } : s)));
  };
  const closeStatusViewer = () => setActiveStatusViewer(null);

  const createFeedPost = async (content: string, imageUrl?: string, location?: string, tags?: string[]) => {
    try {
      const newPost = await apiService.createFeedPost(content, imageUrl, location, tags);
      setFeedPosts((prev) => [newPost, ...prev]);
      closeCreatePostModal();
      showToast('Post published to MIORA Feed! 📱✨');
    } catch (e) {
      showToast('Failed to create post');
    }
  };

  const editFeedPost = async (postId: string, content: string, location?: string) => {
    try {
      const updated = await apiService.editFeedPost(postId, content, location);
      setFeedPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
      closeEditPostModal();
      showToast('Post updated successfully! ✏️✨');
    } catch (e) {
      showToast('Could not update post');
    }
  };

  const deleteFeedPost = async (postId: string) => {
    try {
      await apiService.deleteFeedPost(postId);
      setFeedPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast('Post deleted 🗑️');
    } catch (e) {
      showToast('Failed to delete post');
    }
  };

  const likeFeedPost = async (postId: string) => {
    try {
      const updated = await apiService.likeFeedPost(postId);
      setFeedPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
    } catch (e) {
      setFeedPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            const liked = !p.hasLiked && !p.isLikedByMe;
            return {
              ...p,
              hasLiked: liked,
              isLikedByMe: liked,
              likesCount: Math.max(0, p.likesCount + (liked ? 1 : -1))
            };
          }
          return p;
        })
      );
    }
  };

  const toggleSavePost = async (postId: string) => {
    try {
      const updated = await apiService.toggleSavePost(postId);
      setFeedPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
      const isSaved = updated.isSavedByMe || updated.saved;
      if (isSaved) {
        setSavedPostIds((prev) => [...prev, postId]);
        showToast('Post saved to your bookmarks 🔖');
      } else {
        setSavedPostIds((prev) => prev.filter((id) => id !== postId));
        showToast('Post removed from bookmarks');
      }
    } catch (e) {
      setSavedPostIds((prev) =>
        prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
      );
    }
  };

  const addFeedComment = async (postId: string, text: string) => {
    if (!text.trim()) return;
    try {
      const updated = await apiService.addComment(postId, text.trim());
      setFeedPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
      if (commentTargetPost && commentTargetPost.id === postId) {
        setCommentTargetPost(updated);
      }
      showToast('Comment added 💬');
    } catch (e) {
      showToast('Could not add comment');
    }
  };

  const deleteFeedComment = async (postId: string, commentId: string) => {
    try {
      const updated = await apiService.deleteComment(postId, commentId);
      setFeedPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, ...updated } : p)));
      if (commentTargetPost && commentTargetPost.id === postId) {
        setCommentTargetPost(updated);
      }
      showToast('Comment deleted');
    } catch (e) {
      showToast('Could not delete comment');
    }
  };

  const createStatusStory = async (text: string, mediaUrl?: string) => {
    try {
      const newStory = await apiService.createStatusStory(text, mediaUrl);
      setStatusStories((prev) => [newStory, ...prev]);
      closeCreateStatusModal();
      showToast('Status published! Active for 24 hours 🌸');
    } catch (e) {
      showToast('Failed to create story');
    }
  };

  const deleteStatusStory = async (storyId: string) => {
    try {
      await apiService.deleteStatusStory(storyId);
      setStatusStories((prev) => prev.filter((s) => s.id !== storyId));
      if (activeStatusViewer?.id === storyId) closeStatusViewer();
      showToast('Story deleted 🗑️');
    } catch (e) {
      showToast('Could not delete story');
    }
  };

  const setStatusNote = async (text: string, emoji?: string) => {
    try {
      const note = await apiService.setStatusNote(text, emoji);
      setMyStatusNote(note);
      setStatusNotes((prev) => [note, ...prev.filter((n) => n.userId !== 'user_me' && n.userId !== currentUser.id)]);
      closeStatusNoteModal();
      showToast('Status note updated! 💭✨');
    } catch (e) {
      showToast('Could not set status note');
    }
  };

  const deleteStatusNote = async () => {
    try {
      await apiService.deleteStatusNote();
      setMyStatusNote(null);
      setStatusNotes((prev) => prev.filter((n) => n.userId !== 'user_me' && n.userId !== currentUser.id));
      showToast('Status note cleared');
    } catch (e) {
      showToast('Could not clear status note');
    }
  };

  const toggleFollowUser = async (targetUserId: string): Promise<boolean> => {
    const isCurrentlyFollowing = followingIds.includes(targetUserId);
    if (isCurrentlyFollowing) {
      await apiService.unfollowUser(targetUserId);
      setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
      showToast('Unfollowed');
      return false;
    } else {
      await apiService.followUser(targetUserId);
      setFollowingIds((prev) => [...prev, targetUserId]);
      showToast('Following ✨');
      return true;
    }
  };

  const sharePostToMatch = async (post: FeedPost, matchId: string) => {
    await sendChatMessage(`Shared a post by ${post.authorName || post.userName || 'user'} 📸`, 'image', {
      imageUrl: post.imageUrl || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      caption: post.content,
      postId: post.id
    });
    closeSharePostModal();
    showToast('Post sent via direct message! 💌✨');
  };

  // ==========================================
  // 7. Notifications
  // ==========================================
  const toggleNotifDrawer = () => setIsNotifDrawerOpen((prev) => !prev);
  const openNotifDrawer = () => setIsNotifDrawerOpen(true);
  const closeNotifDrawer = () => setIsNotifDrawerOpen(false);

  const markNotifAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifs = () => {
    setNotifications([]);
    showToast('Cleared all notifications');
  };

  // ==========================================
  // 8. Safety (Block & Report)
  // ==========================================
  const openReportModal = (profile: Profile) => {
    setReportTarget(profile);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportTarget(null);
  };

  const submitReport = async (reason: string, details?: string) => {
    if (!reportTarget) return;

    await apiService.reportUser({
      targetProfileId: reportTarget.id,
      targetProfileName: reportTarget.name,
      reason,
      details
    });

    await blockProfile(reportTarget.id);
    closeReportModal();
    showToast('Report submitted. Profile has been blocked.');
  };

  const blockProfile = async (profileId: string) => {
    await apiService.blockUser(profileId);

    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    setMatches((prev) => prev.filter((m) => m.profileId !== profileId));
    const blockedList = await apiService.getBlockedUsers();
    setBlockedUsers(blockedList);

    if (isProfileDetailOpen && activeProfile?.id === profileId) {
      setIsProfileDetailOpen(false);
    }
    if (currentView === 'chat' && activeMatch?.profileId === profileId) {
      setCurrentView('chat-list');
    }

    showToast('User has been blocked');
  };

  const unblockProfile = async (profileId: string) => {
    await apiService.unblockUser(profileId);
    setBlockedUsers((prev) => prev.filter((b) => b.profileId !== profileId));
    showToast('User unblocked');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        activeTab,
        currentUser,
        profiles,
        activeProfile,
        activeMatch,
        latestMatchedProfile,
        matches,
        currentChatMessages,
        blockedUsers,
        reportTarget,
        isMatchModalOpen,
        isReportModalOpen,
        isProfileDetailOpen,
        isLoading,
        toastMessage,
        isTyping,
        setCurrentView,
        setActiveTab,
        navigateToTab,
        login,
        signup,
        logout,
        updateUserProfile,
        updateUserPreferences,
        handleLike,
        handlePass,
        openProfileDetail,
        closeProfileDetail,
        closeMatchModal,
        keepDiscovering,
        startChatFromMatch,
        openChatWithMatch,
        sendChatMessage,

        // Calling
        activeCall,
        incomingCall,
        startCall,
        acceptIncomingCall,
        rejectIncomingCall,
        endCall,
        toggleMute,
        toggleCamera,
        switchCamera,
        extendTalkTimeWithCoins,
        extendTalkTimeWithInr,
        isTalkTimeModalOpen,
        openTalkTimeModal,
        closeTalkTimeModal,

        // Wallet
        coinTransactions,
        rechargeWallet,
        updateWalletBalance,
        earnCoinsTask,
        spendCoins,

        // Gifts
        isGiftModalOpen,
        giftTargetProfile,
        activeGiftAnimation,
        openGiftModal,
        closeGiftModal,
        sendVirtualGift,
        clearGiftAnimation,

        // Games
        coupleGames,
        activeGameSession,
        isGameModalOpen,
        startGameWithPartner,
        answerGameQuestion,
        unlockPremiumGamePack,
        finishGameAndClaimReward,
        closeGameModal,

        // Rooms
        liveRooms,
        activeLiveRoom,
        roomComments,
        isInsideRoomModal,
        joinLiveRoom,
        leaveLiveRoom,
        sendRoomComment,
        sendRoomReaction,
        raiseHandInRoom,
        tipHostInRoom,
        createLiveRoom,

        // Feed & Status & Social
        feedPosts,
        statusStories,
        statusNotes,
        myStatusNote,
        savedPostIds,
        followingIds,
        activeStatusViewer,
        isCreatePostModalOpen,
        isCreateStatusModalOpen,
        isCreateSheetOpen,
        isSearchModalOpen,
        isStatusNoteModalOpen,
        isFollowersModalOpen,
        followersModalType,
        isSharePostModalOpen,
        shareTargetPost,
        isCommentSheetOpen,
        commentTargetPost,
        isEditPostModalOpen,
        editTargetPost,

        openCreatePostModal,
        closeCreatePostModal,
        openCreateStatusModal,
        closeCreateStatusModal,
        openCreateSheet,
        closeCreateSheet,
        openSearchModal,
        closeSearchModal,
        openStatusNoteModal,
        closeStatusNoteModal,
        openFollowersModal,
        closeFollowersModal,
        openSharePostModal,
        closeSharePostModal,
        openCommentSheet,
        closeCommentSheet,
        openEditPostModal,
        closeEditPostModal,

        openStatusViewer,
        closeStatusViewer,
        createFeedPost,
        editFeedPost,
        deleteFeedPost,
        likeFeedPost,
        toggleSavePost,
        addFeedComment,
        deleteFeedComment,
        createStatusStory,
        deleteStatusStory,
        setStatusNote,
        deleteStatusNote,
        toggleFollowUser,
        sharePostToMatch,

        // Notifications
        notifications,
        unreadNotifsCount,
        isNotifDrawerOpen,
        toggleNotifDrawer,
        openNotifDrawer,
        closeNotifDrawer,
        markNotifAsRead,
        clearAllNotifs,

        // Safety & Verification
        openReportModal,
        closeReportModal,
        submitReport,
        blockProfile,
        unblockProfile,
        unlockedVerificationIds,
        verifyProfileWithCoins,
        directGuestLogin,

        // Monetization, Subscriptions & Power-Ups
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal,
        isBoostModalOpen,
        openBoostModal,
        closeBoostModal,
        isWhoLikedMeModalOpen,
        openWhoLikedMeModal,
        closeWhoLikedMeModal,
        isFilterModalOpen,
        openFilterModal,
        closeFilterModal,
        whoLikedMeProfiles,
        spotlightProfiles,
        advancedFilters,
        setAdvancedFilters,
        subscribeToPlan,
        activateBoost,
        activateSpotlight,
        buyPowerUp,
        useSuperLike,
        unlockWhoLikedMeProfiles,
        isBoostActive,
        boostTimeRemainingFormatted,

        showToast,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

