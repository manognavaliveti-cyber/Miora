import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
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
import { registerForPushNotifications, listenForForegroundMessages } from '../services/notificationService';
import { db, auth, isFirebaseConfigured } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import {
  getRealChatId,
  publishRealProfile,
  setRealPresence,
  subscribeToRealProfiles,
  subscribeToInboundMessages,
  subscribeToChatThreads,
  sendRealMessage,
  markRealMessagesAsRead,
  deleteRealMessage,
  fetchRealProfilesOnce
} from '../services/realtimeUsers';
import { getGamePriceCoins, MIORA_PRICING, SubscriptionPlanDef, PowerUpPackage, CHAT_PER_MINUTE_INR } from '../config/pricing';
import { loadRemotePricing } from '../services/pricingService';
import { WebRTCCall, subscribeToIncomingCalls, updateSignalingCallStatus, SignalingCall } from '../services/callService';
import { resolveWallet, saveWallet } from '../services/walletStore';
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
  INITIAL_SPOTLIGHT_PROFILES
} from '../data/mockData';

interface AppContextType {
  // Navigation & Core State
  currentView: AppView;
  activeTab: MainTab;
  currentUser: CurrentUser;
  profiles: Profile[];
  /** Everyone who can be found by name: real logged-in accounts + discover feed + your chats. */
  searchablePeople: Profile[];
  /** Re-reads all registered accounts right now (called when the search box opens). */
  refreshRealProfiles: () => Promise<void>;
  activeProfile: Profile | null;
  activeMatch: Match | null;
  latestMatchedProfile: Profile | null;
  matches: Match[];
  currentChatMessages: Message[];
  localCallStream: MediaStream | null;
  remoteCallStream: MediaStream | null;
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
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string; admin?: boolean }>;
  googleAuth: (mode: 'login' | 'signup') => Promise<boolean>;
  signup: (userData: Partial<CurrentUser>, password?: string, afterSignup?: 'build' | 'skip' | 'choice') => Promise<{ success: boolean; message?: string }>;
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
  deleteChatMessage: (messageId: string) => Promise<void>;
  startDirectMessage: (profile: Profile) => void;

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
  isCallPaymentModalOpen: boolean;
  callPaymentPartner: Profile | null;
  callPaymentType: 'audio' | 'video';
  openCallPaymentModal: (partner: Profile, type: 'audio' | 'video') => void;
  closeCallPaymentModal: () => void;
  handleCallPaymentSuccess: (method: 'wallet' | 'razorpay') => void;

  // Wallet & Coins
  walletBalance: number;
  openWalletPackModal: (reason?: string, requiredAmount?: number) => void;
  closeWalletPackModal: () => void;
  isWalletPackModalOpen: boolean;
  walletPackContext: { reason?: string; requiredAmount?: number };
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
  isDiscountModalOpen: boolean;
  openDiscountModal: () => void;
  closeDiscountModal: () => void;
  isVipDiscountModalOpen: boolean;
  openVipDiscountModal: () => void;
  closeVipDiscountModal: () => void;
  isUpgradeModalOpen: boolean;
  openUpgradeModal: () => void;
  closeUpgradeModal: () => void;
  /** Open the subscription pop-up on a given plan tab, optionally with a reason banner ('likes' | 'boost'). */
  openUpgradeFor: (opts: { tab?: 'pro' | 'vip'; reason?: 'likes' | 'boost' }) => void;
  upgradeContext: { tab: 'pro' | 'vip'; reason?: 'likes' | 'boost' };
  /** Wallet has money (or PRO/VIP): "X liked your profile" shows the name instead of "Someone". */
  canSeeLikerNames: boolean;
  /** Tap on a "liked your profile" notification: subscribers see who, everyone else gets the subscription pop-up. */
  viewLikeNotification: (notif: NotificationItem) => void;
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
  purchaseProduct: (productId: string) => Promise<void>;
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
  'profile-build-choice': '/profile-build-choice',
  'profile-setup': '/profile-setup',
  'add-photos': '/add-photos',
  'dating-preferences': '/dating-preferences',
  home: '/home',
  discover: '/home',
  likes: '/likes',
  matches: '/likes',
  games: '/games',
  play: '/games',
  feed: '/home',
  rooms: '/home',
  'chat-list': '/chat',
  chat: '/chat',
  wallet: '/wallet',
  'my-profile': '/profile',
  'edit-profile': '/edit-profile',
  settings: '/settings',
  'blocked-users': '/blocked-users',
  notifications: '/notifications',
  terms: '/terms',
  privacy: '/privacy',
  admin: '/admin'
};

const pathToViewMap: Record<string, AppView> = {
  '/': 'welcome',
  '/home': 'home',
  '/discover': 'home',
  '/chat': 'chat-list',
  '/messages': 'chat-list',
  '/chat-list': 'chat-list',
  '/games': 'games',
  '/play': 'games',
  '/likes': 'likes',
  '/matches': 'likes',
  '/profile': 'my-profile',
  '/my-profile': 'my-profile',
  '/feed': 'home',
  '/rooms': 'home',
  '/splash': 'splash',
  '/welcome': 'welcome',
  '/login': 'login',
  '/signup': 'signup',
  '/profile-build-choice': 'profile-build-choice',
  '/profile-setup': 'profile-setup',
  '/add-photos': 'add-photos',
  '/dating-preferences': 'dating-preferences',
  '/wallet': 'wallet',
  '/edit-profile': 'edit-profile',
  '/settings': 'settings',
  '/blocked-users': 'blocked-users',
  '/notifications': 'notifications',
  '/terms': 'terms',
  '/privacy': 'privacy',
  '/admin': 'admin'
};

function getInitialViewFromUrl(): AppView {
  if (typeof window === 'undefined') return 'home';
  const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
  return pathToViewMap[rawPath] || 'home';
}

function getTabForView(view: AppView): MainTab {
  switch (view) {
    case 'home':
    case 'discover':
    case 'dating-preferences':
      return 'home';
    case 'chat':
    case 'chat-list':
      return 'chat';
    case 'games':
    case 'play':
      return 'games';
    case 'likes':
    case 'matches':
      return 'likes';
    case 'my-profile':
    case 'edit-profile':
    case 'settings':
    case 'blocked-users':
    case 'wallet':
      return 'profile';
    default:
      return 'home';
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
      if (view === 'chat-list') localStorage.removeItem('miora_active_chat_id');
      const targetPath = viewToPathMap[view] || '/discover';
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    void loadRemotePricing();
  }, []);

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

  // Foreground push notifications: browsers don't show a native banner for
  // messages that arrive while the tab is open, so surface them as a toast instead.
  useEffect(() => {
    listenForForegroundMessages((title, body) => {
      showToast(`🔔 ${title}${body ? ` — ${body}` : ''}`);
    });
  }, []);

  const [currentUser, setCurrentUser] = useState<CurrentUser>(INITIAL_CURRENT_USER);
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const walletHydratedRef = useRef<boolean>(false);
  const [latestMatchedProfile, setLatestMatchedProfile] = useState<Profile | null>(null);
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [currentChatMessages, setCurrentChatMessages] = useState<Message[]>([]);
  const [localCallStream, setLocalCallStream] = useState<MediaStream | null>(null);
  const [remoteCallStream, setRemoteCallStream] = useState<MediaStream | null>(null);
  const callControllerRef = useRef<WebRTCCall | null>(null);
  const [activeSignalCallId, setActiveSignalCallId] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<BlockItem[]>([]);

  // Realtime listener for the active conversation. Messages live in Firestore;
  // changing tabs or refreshing the page must never erase them.
  useEffect(() => {
    if (!activeMatch?.id) return;
    if (!activeMatch.profile.isRealUser) {
      let cancelled = false;
      apiService.getMessages(activeMatch.id).then((msgs) => {
        if (!cancelled) setCurrentChatMessages(msgs || []);
      }).catch(() => {});
      return () => { cancelled = true; };
    }
    const msgsQuery = query(collection(db, 'messages'), where('matchId', '==', activeMatch.id));
    const unsubscribe = onSnapshot(msgsQuery, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
      msgs.sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
      setCurrentChatMessages(msgs);
    }, (error) => console.warn('[MIORA chat] Active message listener error', error));
    return () => unsubscribe();
  }, [activeMatch?.id, activeMatch?.profile.isRealUser]);

  // Restore the last open conversation after a browser refresh.
  useEffect(() => {
    const savedChatId = localStorage.getItem('miora_active_chat_id');
    if (!savedChatId || currentView !== 'chat-list') return;
    const candidate = matches.find((m) => m.id === savedChatId);
    if (candidate) {
      setActiveMatch(candidate);
      setCurrentViewState('chat');
    }
  }, [matches, currentView]);
  // ==========================================================
  // REAL MULTI-USER LAYER (Firestore-direct)
  // Lets two genuinely registered/logged-in people discover each
  // other and chat live — no shared default/demo account involved.
  // ==========================================================
  const [realProfiles, setRealProfiles] = useState<Profile[]>([]);
  const realProfilesRef = useRef<Profile[]>([]);
  realProfilesRef.current = realProfiles;

  // Pull the latest list of registered accounts on demand (search box opening, pull-to-refresh, etc.)
  const refreshRealProfiles = async () => {
    if (!isFirebaseConfigured || !currentUser?.id || currentUser.id === 'user_me') return; // 'user_me' = not signed in yet
    const list = await fetchRealProfilesOnce(currentUser.id);
    if (list.length > 0) setRealProfiles(list);
  };

  // Publish my own discoverable profile whenever my identity-relevant fields change.
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser?.id || currentUser.id === 'user_me') return; // 'user_me' = not signed in yet
    publishRealProfile(currentUser);
  }, [
    currentUser.id,
    currentUser.name,
    currentUser.age,
    currentUser.bio,
    currentUser.location,
    currentUser.gender,
    JSON.stringify(currentUser.photos),
    JSON.stringify(currentUser.interests)
  ]);

  // Mark myself online while the app is open, offline when it closes.
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser?.id || currentUser.id === 'user_me') return; // 'user_me' = not signed in yet
    setRealPresence(currentUser.id, true);
    const handleUnload = () => setRealPresence(currentUser.id, false);
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      setRealPresence(currentUser.id, false);
    };
  }, [currentUser.id]);

  // Live-discover every other real, registered account.
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser?.id || currentUser.id === 'user_me') return; // 'user_me' = not signed in yet
    const unsubscribe = subscribeToRealProfiles(currentUser.id, (list) => setRealProfiles(list));
    return () => unsubscribe();
  }, [currentUser.id]);

  // Merge newly-discovered real people into the swipeable/discoverable profiles list
  // without clobbering ones the user has already swiped away this session.
  useEffect(() => {
    if (realProfiles.length === 0) return;
    setProfiles((prev) => {
      const prevIds = new Set(prev.map((p) => p.id));
      const fresh = realProfiles.filter((p) => !prevIds.has(p.id));
      if (fresh.length === 0) return prev;
      return [...fresh, ...prev];
    });
  }, [realProfiles]);

  // Everyone findable by name. Real accounts come first; people you already liked / passed on
  // (removed from the swipe feed) and people you chat with are still searchable.
  const searchablePeople: Profile[] = (() => {
    const seen = new Set<string>();
    const out: Profile[] = [];
    const add = (p?: Profile) => {
      if (!p || !p.id || seen.has(p.id) || p.id === currentUser.id) return;
      seen.add(p.id);
      out.push(p);
    };
    realProfiles.forEach(add);
    profiles.forEach(add);
    matches.forEach((m) => add(m.profile));
    return out;
  })();

  // Detect brand-new incoming real conversations (someone else messaged me first)
  // and surface them in the Chat list automatically, in real time.
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser?.id || currentUser.id === 'user_me') return; // 'user_me' = not signed in yet
    const unsubscribe = subscribeToInboundMessages(currentUser.id, (inboundMsgs) => {
      if (inboundMsgs.length === 0) return;
      setMatches((prevMatches) => {
        const existingIds = new Set(prevMatches.map((m) => m.id));
        const byChatId = new Map<string, Message>();
        // Keep only the most recent inbound message per chat thread
        inboundMsgs.forEach((m) => {
          const prevMsg = byChatId.get(m.matchId);
          if (!prevMsg || (m as any).sortKey > (prevMsg as any).sortKey) byChatId.set(m.matchId, m);
        });

        const additions: Match[] = [];
        byChatId.forEach((lastMsg, chatId) => {
          if (existingIds.has(chatId)) return;
          const senderProfile = realProfiles.find((p) => p.id === lastMsg.senderId);
          if (!senderProfile) return; // wait for their profile to load; will retry on next tick
          additions.push({
            id: chatId,
            profileId: senderProfile.id,
            profile: senderProfile,
            matchedAt: new Date().toISOString(),
            lastMessage: lastMsg.text,
            lastMessageTime: 'Just now',
            unreadCount: activeMatch?.id === chatId ? 0 : 1
          });
        });

        if (additions.length === 0) return prevMatches;
        return [...additions, ...prevMatches];
      });
    });
    return () => unsubscribe();
  }, [currentUser.id, realProfiles, activeMatch]);

  // Build the conversation list from persisted Firestore messages. This keeps
  // chat order and unread state across refreshes and navigation.
  useEffect(() => {
    if (!isFirebaseConfigured || !currentUser?.id || currentUser.id === 'user_me') return;
    return subscribeToChatThreads(currentUser.id, (threads) => {
      setMatches((prev) => {
        const profileMap = new Map<string, Profile>();
        [...profiles, ...prev.map((m) => m.profile), ...realProfiles].forEach((p) => profileMap.set(p.id, p));
        const realThreads: Match[] = threads.map((t) => {
          const profile = profileMap.get(t.otherUid);
          return profile ? {
            id: t.chatId,
            profileId: t.otherUid,
            profile,
            matchedAt: new Date(t.lastMessage.sortKey || Date.now()).toISOString(),
            lastMessage: t.lastMessage.text,
            lastMessageTime: t.lastMessage.timestamp,
            unreadCount: t.unreadCount
          } : null;
        }).filter(Boolean) as Match[];
        const ids = new Set(realThreads.map((m) => m.id));
        const preserved = prev.filter((m) => !ids.has(m.id) && !m.profile.isRealUser);
        return [...realThreads, ...preserved];
      });
    });
  }, [currentUser.id, realProfiles.length, profiles.length]);

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
  // Global 'Add money' popup (chat, games, etc.). Works on every screen, not only during a call.
  const [isWalletPackModalOpen, setIsWalletPackModalOpen] = useState<boolean>(false);
  const [walletPackContext, setWalletPackContext] = useState<{ reason?: string; requiredAmount?: number }>({});
  const [isCallPaymentModalOpen, setIsCallPaymentModalOpen] = useState<boolean>(false);

  // Real-time incoming-call notification/signaling.
  useEffect(() => {
    const firebaseUid = auth.currentUser?.uid;
    if (!isFirebaseConfigured || !firebaseUid) return;
    return subscribeToIncomingCalls(firebaseUid, (calls: SignalingCall[]) => {
      if (activeCall || incomingCall || calls.length === 0) return;
      const incoming = calls[calls.length - 1];
      const partner = findPartnerProfile(incoming.callerId);
      if (!partner) return;
      setActiveSignalCallId(incoming.id);
      setIncomingCall({
        id: incoming.id, type: incoming.type, partner, status: 'ringing', durationSeconds: 0,
        remainingTalkTimeSeconds: currentUser.talkTimeSecondsRemaining || 1200, isMuted: false, isCameraOff: false, isFrontCamera: true
      });
      if (typeof window !== 'undefined' && 'Notification' in window && document.visibilityState !== 'visible') {
        if (Notification.permission === 'granted') {
          new Notification(`Incoming ${incoming.type === 'video' ? 'video' : 'audio'} call`, { body: `${partner.name} is calling you on MIORA`, icon: partner.photos[0] || undefined });
        }
      }
    });
  }, [auth.currentUser?.uid, realProfiles.length, matches.length, profiles.length, !!activeCall, !!incomingCall]);
  const [callPaymentPartner, setCallPaymentPartner] = useState<Profile | null>(null);
  const [callPaymentType, setCallPaymentType] = useState<'audio' | 'video'>('audio');

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
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState<boolean>(false);
  const [isVipDiscountModalOpen, setIsVipDiscountModalOpen] = useState<boolean>(false);
  const homeVipShownRef = useRef(false);

  // The two offer pop-ups (VIP ₹999, then Premium ₹379) are shown only ONCE per login.
  // The flag lives in sessionStorage so it also survives page reloads / restored browser tabs,
  // and it is cleared on logout so the next login shows them again (once).
  const OFFERS_SEEN_KEY = 'miora_login_offers_seen';
  const offersSeen = (): boolean => {
    try { return sessionStorage.getItem(OFFERS_SEEN_KEY) === '1'; } catch { return false; }
  };
  const setOffersSeen = (seen: boolean) => {
    try {
      if (seen) sessionStorage.setItem(OFFERS_SEEN_KEY, '1');
      else sessionStorage.removeItem(OFFERS_SEEN_KEY);
    } catch { /* storage unavailable - ignore */ }
  };

  // Called right after a fresh login / signup: always shows the sequence once for this login.
  const openDiscountModal = () => {
    setOffersSeen(true);
    setIsDiscountModalOpen(false);
    setIsVipDiscountModalOpen(true);
  };

  // Called from the home screen: only shows if this login has not seen the offers yet.
  const closeDiscountModal = () => setIsDiscountModalOpen(false);
  const openVipDiscountModal = () => {
    if (offersSeen()) return;
    setOffersSeen(true);
    setIsVipDiscountModalOpen(true);
  };
  const closeVipDiscountModal = () => {
    setIsVipDiscountModalOpen(false);
    window.setTimeout(() => setIsDiscountModalOpen(true), 120);
  };

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

  const [upgradeContext, setUpgradeContext] = useState<{ tab: 'pro' | 'vip'; reason?: 'likes' | 'boost' }>({ tab: 'pro' });
  const openUpgradeModal = () => {
    setUpgradeContext({ tab: 'pro' });
    setIsUpgradeModalOpen(true);
  };
  const openUpgradeFor = (opts: { tab?: 'pro' | 'vip'; reason?: 'likes' | 'boost' }) => {
    setUpgradeContext({ tab: opts.tab || 'pro', reason: opts.reason });
    setIsUpgradeModalOpen(true);
  };
  const closeUpgradeModal = () => setIsUpgradeModalOpen(false);

  const isSubscriber =
    currentUser.subscriptionTier === 'pro' || currentUser.subscriptionTier === 'vip' || !!currentUser.isPremium;
  const canSeeLikerNames = (currentUser.walletBalance || 0) > 0 || isSubscriber;

  // Tapping "X liked your profile": with money in the wallet (or a PRO/VIP plan) the
  // person's profile opens straight away. Only an empty wallet with no plan is asked to recharge.
  const viewLikeNotification = (notif: NotificationItem) => {
    markNotifAsRead(notif.id);
    setIsNotifDrawerOpen(false);

    if (!canSeeLikerNames) {
      setIsWalletPackModalOpen(true);
      setWalletPackContext({ reason: 'Recharge your wallet to see who liked you.' });
      return;
    }

    const likerId: string | undefined = notif.metadata?.likerId;
    const liker =
      profiles.find((p) => p.id === likerId) ||
      whoLikedMeProfiles.find((w) => w.profileId === likerId)?.profile;

    if (liker) {
      openProfileDetail(liker);
    } else {
      navigateToTab('matches');
      window.setTimeout(() => setIsWhoLikedMeModalOpen(true), 150);
    }
  };

  const openBoostModal = () => setIsBoostModalOpen(true);
  const closeBoostModal = () => setIsBoostModalOpen(false);

  const openWhoLikedMeModal = () => setIsWhoLikedMeModalOpen(true);
  const closeWhoLikedMeModal = () => setIsWhoLikedMeModalOpen(false);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const purchaseProduct = async (productId: string) => {
    try {
      setIsLoading(true);
      await paymentService.initiateCheckout({
        productId,
        packageId: productId,
        userName: currentUser.name,
        userEmail: currentUser.email,
        onSuccess: (result) => {
          const tier: SubscriptionTier = (result.subscriptionTier as SubscriptionTier) || (productId === 'vip' ? 'vip' : productId === 'gold' ? 'gold' : 'gold');
          const newBal = result.newWalletBalance ?? result.newBalance ?? currentUser.walletBalance;
          const addedCredit = result.creditAddedInr ?? result.coinsAdded ?? 0;

          if (result.isPremium || productId === 'gold' || productId === 'vip' || productId === 'pro') {
            setCurrentUser((prev) => ({
              ...prev,
              isPremium: true,
              subscriptionTier: tier,
              walletBalance: newBal,
              dailySwipesRemaining: tier === 'vip' ? 9999 : 30,
              dailySwipesMax: tier === 'vip' ? 9999 : 30
            }));
            showToast(`🎉 MIORA ${tier.toUpperCase()} Activated Successfully! ✨`);
            closeUpgradeModal();
            setIsDiscountModalOpen(false);
          } else {
            setCurrentUser((prev) => ({
              ...prev,
              walletBalance: newBal
            }));
            showToast(`₹${addedCredit || 150} added to your MIORA Wallet! 💳`);
          }

          // Trigger transaction refresh
          apiService.getTransactions().then((txs) => {
            if (txs && txs.length > 0) setCoinTransactions(txs);
          }).catch(() => {});
        },
        onError: (err) => {
          showToast(err || 'Payment could not be completed.');
        }
      });
    } catch (e: any) {
      showToast(e?.message || 'Failed to initiate Razorpay checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPlan = async (planId: string, paymentMethod: 'inr' | 'coins') => {
    // SECURITY HARDENING: Route all Premium purchases through verified Razorpay payment
    const targetProduct = planId === 'vip' ? 'vip' : 'pro';
    await purchaseProduct(targetProduct);
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

  const clearLegacyDemoData = () => {
    // Remove only the old bundled demo records. Real Firebase conversations and
    // user-created data are left untouched.
    try {
      const demoProfileIds = new Set(Array.from({ length: 30 }, (_, i) => `prof_${i + 1}`));
      const rawProfiles = localStorage.getItem('miora_profiles');
      if (rawProfiles) {
        const profiles = JSON.parse(rawProfiles);
        if (Array.isArray(profiles)) {
          localStorage.setItem('miora_profiles', JSON.stringify(profiles.filter((p: any) => !demoProfileIds.has(p?.id))));
        }
      }

      const rawMatches = localStorage.getItem('miora_matches');
      if (rawMatches) {
        const matches = JSON.parse(rawMatches);
        if (Array.isArray(matches)) {
          localStorage.setItem('miora_matches', JSON.stringify(matches.filter((m: any) => !['match_1', 'match_2'].includes(m?.id))));
        }
      }

      const rawMessages = localStorage.getItem('miora_messages');
      if (rawMessages) {
        const messages = JSON.parse(rawMessages);
        if (messages && typeof messages === 'object') {
          delete messages.match_1;
          delete messages.match_2;
          localStorage.setItem('miora_messages', JSON.stringify(messages));
        }
      }
      localStorage.setItem('miora_demo_cleanup_v1', '1');
    } catch {
      // Ignore malformed legacy local data.
    }
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      clearLegacyDemoData();

      // Check if the user is returning from a Firebase Google Redirect flow
      let redirectHandled = false;
      try {
        const redirectResult = await authService.getGoogleRedirectResult();
        if (redirectResult?.user) {
          redirectHandled = true;
          const firebaseUser = redirectResult.user;
          const existingUser = await apiService.getCurrentUser();
          const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'MIORA User';
          const email = firebaseUser.email || '';
          const hasRealProfile = Boolean(existingUser && existingUser.id === firebaseUser.uid);

          const updated = {
            ...currentUser,
            ...(hasRealProfile ? existingUser : {}),
            id: firebaseUser.uid,
            name: (hasRealProfile ? existingUser?.name : '') || displayName,
            email: (hasRealProfile ? existingUser?.email : '') || email,
            profileCompletion: hasRealProfile ? (existingUser?.profileCompletion || 40) : 40,
            termsAccepted: redirectResult.mode === 'signup' ? true : (existingUser?.termsAccepted ?? true),
            termsVersion: existingUser?.termsVersion || '1.0',
            termsAcceptedAt: existingUser?.termsAcceptedAt || new Date().toISOString()
          };

          setCurrentUser(resolveWallet(updated));
          try {
            await apiService.updateCurrentUser(updated);
          } catch (apiErr) {
            console.warn('Google auth profile sync notice:', apiErr);
          }

          if (redirectResult.mode === 'signup' && redirectResult.isNewUser) {
            showToast('Google account connected successfully! ✨');
            setCurrentView('profile-build-choice');
          } else {
            showToast(`Welcome${displayName ? `, ${displayName}` : ''}! ✨`);
            setCurrentView('home');
            setActiveTab('home');
            openDiscountModal();
            registerForPushNotifications().catch(() => {});
          }
        }
      } catch (redirectErr) {
        console.warn('Error checking Google redirect result:', redirectErr);
      }

      if (!redirectHandled) {
        // After a refresh Firebase restores the saved login a moment later — wait for it,
        // otherwise a blank guest profile (wrong name / wallet) gets loaded instead of yours.
        await authService.waitForAuthReady();
      }

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

      if (user && !redirectHandled) setCurrentUser(user);
      walletHydratedRef.current = true;
      if (profs && profs.length > 0) {
        // Keep the real, logged-in people that were already discovered — replacing the list
        // with the server/demo profiles used to wipe them out.
        const existingIds = new Set(profs.map((p) => p.id));
        const keepReal = realProfilesRef.current.filter((p) => !existingIds.has(p.id));
        setProfiles([...keepReal, ...profs]);
      }
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

  useEffect(() => {
    if (currentView === 'home' && !homeVipShownRef.current) {
      homeVipShownRef.current = true;
      if (!offersSeen()) window.setTimeout(() => openVipDiscountModal(), 450);
    }
  }, [currentView]);

  const activeCallRef = useRef(activeCall);
  const walletBalanceRef = useRef(currentUser.walletBalance || 0);
  useEffect(() => { activeCallRef.current = activeCall; }, [activeCall]);
  useEffect(() => { walletBalanceRef.current = currentUser.walletBalance || 0; }, [currentUser.walletBalance]);
  useEffect(() => {
    if (!currentUser?.id || currentUser.id === 'user_me') return;
    let syncTimer: ReturnType<typeof setTimeout> | null = null;
    const syncWallet = () => {
      if (document.hidden) return;
      // Debounce: collapse rapid focus/visibility events into a single request
      if (syncTimer) clearTimeout(syncTimer);
      syncTimer = setTimeout(() => {
        syncTimer = null;
        apiService.getWalletBalance().then((wallet) => {
          walletBalanceRef.current = wallet.walletBalance;
          setCurrentUser((u) => ({ ...u, walletBalance: wallet.walletBalance, coinBalance: wallet.coinBalance }));
        }).catch(() => {});
      }, 500);
    };
    window.addEventListener('focus', syncWallet);
    document.addEventListener('visibilitychange', syncWallet);
    return () => {
      window.removeEventListener('focus', syncWallet);
      document.removeEventListener('visibilitychange', syncWallet);
      if (syncTimer) clearTimeout(syncTimer);
    };
  }, [currentUser.id]);

  // Chat billing: while a conversation is open on screen, every COMPLETED minute costs ₹3
  // from the wallet. Paused during calls (calls have their own meter) and while the tab is hidden.
  const chatSecondsRef = useRef<number>(0);
  useEffect(() => {
    if (currentView !== 'chat' || !activeMatch || activeCall) return;
    const partnerName = activeMatch.profile.name;
    const usageId = `txn_chat_${activeMatch.id}_${Date.now()}`;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      // Wallet already too low → sending is locked, nothing more to charge.
      if (walletBalanceRef.current < CHAT_PER_MINUTE_INR) return;

      chatSecondsRef.current += 1;
      if (chatSecondsRef.current < 60) return;
      chatSecondsRef.current = 0;

      const nextBalance = Math.round((walletBalanceRef.current - CHAT_PER_MINUTE_INR) * 100) / 100;
      walletBalanceRef.current = nextBalance;
      apiService.debitWallet(CHAT_PER_MINUTE_INR).then((wallet) => {
        walletBalanceRef.current = wallet.walletBalance;
        setCurrentUser((u) => ({ ...u, walletBalance: wallet.walletBalance, coinBalance: wallet.coinBalance }));
      }).catch(() => {
        // Debit failed (backend unreachable). Optimistic local deduction already applied above.
        // Do NOT re-fetch wallet here — that would fire another /api/wallet call immediately
        // and create a request cascade when the backend is flaky (→ 429).
      });
      setCurrentUser((u) => {
        const nb = Math.max(0, Math.round(((u.walletBalance || 0) - CHAT_PER_MINUTE_INR) * 100) / 100);
        return { ...u, walletBalance: nb, coinBalance: nb };
      });

      // One wallet-history line per chat session, updated every minute.
      setCoinTransactions((prev) => {
        const idx = prev.findIndex((t) => t.id === usageId);
        if (idx === -1) {
          return [
            {
              id: usageId,
              type: 'PAID_CHAT',
              amount: -CHAT_PER_MINUTE_INR,
              description: `Chat with ${partnerName} · 1 min`,
              relatedUser: partnerName,
              timestamp: 'Just now',
              icon: '💬'
            } as CoinTransaction,
            ...prev
          ];
        }
        const total = Math.abs(prev[idx].amount) + CHAT_PER_MINUTE_INR;
        const merged = {
          ...prev[idx],
          amount: -total,
          description: `Chat with ${partnerName} · ${Math.round(total / CHAT_PER_MINUTE_INR)} min`
        };
        return [merged, ...prev.filter((_, i) => i !== idx)];
      });

      if (nextBalance < CHAT_PER_MINUTE_INR) {
        setWalletPackContext({
          reason: 'Your wallet is empty — add money to keep chatting.',
          requiredAmount: CHAT_PER_MINUTE_INR
        });
        setIsWalletPackModalOpen(true);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [currentView, activeMatch?.id, !!activeCall]);

  // Remember the wallet on this device so a page refresh keeps the balance you actually have.
  // (Only starts once the profile has been loaded, so the blank start-up profile can't overwrite it.)
  useEffect(() => {
    if (!walletHydratedRef.current) return;
    saveWallet(currentUser.id, currentUser.walletBalance || 0);
  }, [currentUser.id, currentUser.walletBalance]);

  // ---- "Someone liked your profile" notifications (LinkedIn style) ----
  // The liker's name is kept in metadata only. The notification drawer shows the name when the wallet has money
  // (or the user has PRO/VIP), otherwise just "Someone liked your profile". Seeing who needs a subscription.
  const profilesRef = useRef<Profile[]>(profiles);
  const whoLikedMeRef = useRef<WhoLikedMeProfile[]>(whoLikedMeProfiles);
  const subscriberRef = useRef<boolean>(false);
  const likeEmitCountRef = useRef<number>(0);
  useEffect(() => { profilesRef.current = profiles; }, [profiles]);
  useEffect(() => { whoLikedMeRef.current = whoLikedMeProfiles; }, [whoLikedMeProfiles]);
  useEffect(() => {
    subscriberRef.current =
      currentUser.subscriptionTier === 'pro' || currentUser.subscriptionTier === 'vip' || !!currentUser.isPremium;
  }, [currentUser.subscriptionTier, currentUser.isPremium]);

  const isInApp = ![
    'splash', 'welcome', 'login', 'signup', 'profile-setup', 'add-photos', 'dating-preferences', 'terms', 'privacy'
  ].includes(currentView);

  useEffect(() => {
    if (!isInApp) return;

    const emitLike = () => {
      if (likeEmitCountRef.current >= 8) return;
      const pool = profilesRef.current.filter(
        (p) => !p.likedByCurrentUser && !whoLikedMeRef.current.some((w) => w.profileId === p.id)
      );
      if (pool.length === 0) return;
      const liker = pool[Math.floor(Math.random() * pool.length)];
      likeEmitCountRef.current += 1;

      const entry: WhoLikedMeProfile = {
        id: `wlm_${Date.now()}`,
        profileId: liker.id,
        profile: liker,
        likedAt: 'Just now',
        isSuperLike: false,
        matchScore: liker.compatibility,
        isBlurred: true
      };
      setWhoLikedMeProfiles((prev) => [entry, ...prev]);

      const notif: NotificationItem = {
        id: `notif_like_${Date.now()}`,
        type: 'profile_like',
        // Anonymous by default; the drawer swaps in the name when allowed.
        title: 'Someone liked your profile 💗',
        message: 'Tap to find out who is interested in you.',
        timestamp: 'Just now',
        read: false,
        linkTab: 'matches',
        metadata: { likerId: liker.id, likerName: liker.name, likerPhoto: liker.photos[0] }
      };
      setNotifications((prev) => [notif, ...prev]);

      const canSee = walletBalanceRef.current > 0 || subscriberRef.current;
      showToast(canSee ? `💗 ${liker.name} liked your profile` : '💗 Someone liked your profile');
    };

    const first = window.setTimeout(emitLike, 20000);
    const every = window.setInterval(emitLike, 90000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [isInApp]);

  // Per-minute wallet billing for audio/video calls.
  useEffect(() => {
    if (!activeCall || activeCall.status !== 'connected') return;

    const timer = window.setInterval(() => {
      const call = activeCallRef.current;
      if (!call || call.status !== 'connected') return;

      const rate = call.type === 'video' ? 12 : 8;
      const nextDuration = call.durationSeconds + 1;
      const crossedMinute = Math.floor(nextDuration / 60) > Math.floor(call.durationSeconds / 60);
      let insufficient = false;
      let charged = false;

      if (crossedMinute) {
        const balance = walletBalanceRef.current;
        if (balance < rate) {
          insufficient = true;
        } else {
          charged = true;
          const nextBalance = Math.max(0, balance - rate);
          walletBalanceRef.current = nextBalance;
          apiService.debitWallet(rate).then((wallet) => {
            walletBalanceRef.current = wallet.walletBalance;
            setCurrentUser((u) => ({ ...u, walletBalance: wallet.walletBalance, coinBalance: wallet.coinBalance }));
          }).catch(() => {});
          setCurrentUser((u) => ({ ...u, walletBalance: nextBalance, coinBalance: nextBalance }));
          if (nextBalance < rate) insufficient = true;
        }
      }

      setActiveCall((prev) => {
        if (!prev || prev.status !== 'connected') return prev;
        if (insufficient) return null;
        const newDuration = prev.durationSeconds + 1;
        const newRemaining = Math.max(0, prev.remainingTalkTimeSeconds - 1);
        if (newRemaining <= 0) return null;
        return { ...prev, durationSeconds: newDuration, remainingTalkTimeSeconds: newRemaining, isWarningLowTime: newRemaining <= 60 };
      });

      if (charged) {
        setCoinTransactions((prev) => [{
          id: `txn_${Date.now()}`,
          type: call.type === 'video' ? 'VIDEO_CALL' : 'AUDIO_CALL',
          amount: -rate,
          description: `${call.type === 'video' ? 'Video' : 'Audio'} Call · 1 minute with ${call.partner.name}`,
          relatedUser: call.partner.name,
          timestamp: 'Just now',
          icon: call.type === 'video' ? '📹' : '📞'
        }, ...prev]);
        showToast(`₹${rate} charged for 1 minute of ${call.type === 'video' ? 'video' : 'audio'} call.`);
      }

      if (insufficient) {
        showToast(`Wallet balance is insufficient for the next minute (₹${rate}). Call ended.`);
        setIsCallPaymentModalOpen(true);
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeCall?.status]);

  const refreshData = async () => {
    await loadInitialData();
  };

  const navigateToTab = (tab: MainTab) => {
    if (tab === 'home' || tab === 'discover' || tab === 'feed' || tab === 'rooms') {
      setActiveTab('home');
      setCurrentView('home');
    } else if (tab === 'chat' || tab === 'messages') {
      setActiveTab('chat');
      setCurrentView('chat-list');
    } else if (tab === 'games' || tab === 'play') {
      setActiveTab('games');
      setCurrentView('games');
    } else if (tab === 'likes' || tab === 'matches') {
      setActiveTab('likes');
      setCurrentView('likes');
    } else if (tab === 'profile') {
      setActiveTab('profile');
      setCurrentView('my-profile');
    } else if (tab === 'wallet') {
      setActiveTab('profile');
      setCurrentView('wallet');
    } else {
      setActiveTab('home');
      setCurrentView('home');
    }
  };

  // Auth Handlers (Firebase Auth -> Spring Boot verification)
  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string; admin?: boolean }> => {
    if (!email || !pass) {
      showToast('Please provide both email and password');
      return { success: false, message: 'Please provide both email and password.' };
    }
    try {
      setIsLoading(true);
      const firebaseUser = await authService.signInWithEmail(email.trim(), pass);
      if (!firebaseUser) {
        throw new Error('Firebase is not configured on this deployment yet — check your .env.local / build environment variables.');
      }

      const configuredAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || 'flipflexteam@gmail.com').trim().toLowerCase();
      const isAdmin = (firebaseUser.email || '').trim().toLowerCase() === configuredAdminEmail;
      console.info('[MIORA] Firebase sign-in OK:', firebaseUser.email, { isAdmin });
      let user: any = {};
      try {
        user = (await apiService.getCurrentUser()) || {};
      } catch (profileErr) {
        console.warn('Profile load deferred after login:', profileErr);
      }
      const signedInUser = {
        ...user,
        id: firebaseUser.uid,
        name: user.name || firebaseUser.displayName || email.split('@')[0],
        email: firebaseUser.email || email
      };
      try {
        const savedUser = await apiService.updateCurrentUser(signedInUser);
        const safeSavedUser = savedUser?.id === firebaseUser.uid ? savedUser : signedInUser;
        setCurrentUser(resolveWallet({ ...signedInUser, ...safeSavedUser, id: firebaseUser.uid, email: firebaseUser.email || email }));
      } catch {
        setCurrentUser(signedInUser);
      }
      showToast(`Welcome back, ${signedInUser.name}! ✨`);
      setCurrentView(isAdmin ? 'admin' : 'home');
      setActiveTab('home');
      try { openDiscountModal(); } catch { /* cosmetic only */ }
      registerForPushNotifications().catch(() => {});
      return { success: true, admin: isAdmin };
    } catch (err: any) {
      console.error('Firebase login failed:', err);
      let message: string;
      switch (err?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message = 'Incorrect email or password. If you signed up with Google, use "Continue with Google". Otherwise check your details or tap "Forgot Password?".';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please wait a moment and try again.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/user-disabled':
          message = 'This account has been disabled. Please contact support.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection and try again.';
          break;
        case 'auth/unauthorized-domain':
          message = 'This website address is not authorised in Firebase (Authentication → Settings → Authorized domains).';
          break;
        case 'auth/operation-not-allowed':
          message = 'Email/Password sign-in is not enabled for this project yet. (Firebase Console → Authentication → Sign-in method → enable Email/Password.)';
          break;
        default:
          message = `${err?.message || 'Login failed. Please try again.'}${err?.code ? ` (${err.code})` : ''}`;
      }
      showToast(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const googleAuth = async (mode: 'login' | 'signup'): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await authService.signInWithGoogle(mode);
      if (!result?.user) return false;

      const firebaseUser = result.user;
      let existingUser: any = null;
      try {
        existingUser = await apiService.getCurrentUser();
      } catch (e) {
        console.warn('API get user notice:', e);
      }

      const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'MIORA User';
      const email = firebaseUser.email || '';
      const hasRealProfile = Boolean(existingUser && existingUser.id === firebaseUser.uid);

      const updated = {
        ...currentUser,
        ...(hasRealProfile ? existingUser : {}),
        id: firebaseUser.uid,
        name: (hasRealProfile ? existingUser?.name : '') || displayName,
        email: (hasRealProfile ? existingUser?.email : '') || email,
        profileCompletion: hasRealProfile ? (existingUser?.profileCompletion || 40) : 40,
        termsAccepted: mode === 'signup' ? true : (existingUser?.termsAccepted ?? true),
        termsVersion: existingUser?.termsVersion || '1.0',
        termsAcceptedAt: existingUser?.termsAcceptedAt || new Date().toISOString()
      };

      setCurrentUser(resolveWallet(updated));
      try {
        await apiService.updateCurrentUser(updated);
      } catch (apiErr) {
        console.warn('Google auth profile sync notice:', apiErr);
      }

      if (mode === 'signup' && result.isNewUser) {
        showToast('Google account connected successfully! ✨');
        setCurrentView('profile-build-choice');
      } else {
        showToast(`Welcome${displayName ? `, ${displayName}` : ''}! ✨`);
        setCurrentView('home');
        setActiveTab('home');
        openDiscountModal();
        registerForPushNotifications().catch(() => {});
      }

      return true;
    } catch (err: any) {
      console.error('Google authentication error:', err);
      showToast('Google sign-in failed. Please try again.');
      return false;
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
    setCurrentView('home');
    setActiveTab('home');
    openDiscountModal();
    registerForPushNotifications().catch(() => {});
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

  const signup = async (userData: Partial<CurrentUser>, password = 'password123', afterSignup: 'build' | 'skip' | 'choice' = 'choice'): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      if (!userData.email) throw new Error('Email is required.');

      // Create the Firebase account first. Navigation must not depend on the API/backend being available.
      const firebaseUser = await authService.signUpWithEmail(userData.email.trim(), password, userData.name);
      if (!firebaseUser) throw new Error('Authentication is not configured. Please check your Firebase configuration (.env.local) and restart the dev server.');
      console.info('[MIORA] Firebase account created:', firebaseUser.email, firebaseUser.uid);

      const updated = {
        ...currentUser,
        ...userData,
        id: firebaseUser.uid,
        email: firebaseUser.email || userData.email,
        name: userData.name || firebaseUser.displayName || '',
        termsAccepted: userData.termsAccepted !== undefined ? userData.termsAccepted : true,
        termsVersion: userData.termsVersion || '1.0',
        termsAcceptedAt: userData.termsAcceptedAt || new Date().toISOString(),
        profileCompletion: 40
      };

      // Update local state immediately so the new Firebase user is available on the next screen.
      setCurrentUser(resolveWallet(updated));
      try {
        await apiService.updateCurrentUser(updated);
      } catch (apiError) {
        // Backend persistence must never block the signup navigation.
        console.warn('Profile sync deferred:', apiError);
      }

      showToast('Account created successfully! ✨');

      if (afterSignup === 'choice') {
        // Next page: "Build Your Profile" or "Skip for now".
        setCurrentView('profile-build-choice');
      } else if (afterSignup === 'skip') {
        setActiveTab('home');
        setCurrentView('home');
        // Show the VIP offer first; the offer component can then continue to the ₹379 offer.
        openDiscountModal();
      } else {
        // Build Your Profile opens the first of the four profile-building screens.
        setCurrentView('profile-setup');
      }

      registerForPushNotifications().catch(() => {});
      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      const code = err?.code || '';
      let message: string;
      switch (code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Tap "Log In" below to sign in. If you forgot the password, use "Forgot Password?" on the Log In page.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password must be at least 6 characters.';
          break;
        case 'auth/password-does-not-meet-requirements':
          message = 'Password is too weak. Use a longer password with upper & lower case letters, a number and a symbol.';
          break;
        case 'auth/operation-not-allowed':
          message = 'Email/Password sign-up is not enabled. Firebase Console → Authentication → Sign-in method → enable Email/Password.';
          break;
        case 'auth/admin-restricted-operation':
          message = 'New sign-ups are disabled for this Firebase project. Firebase Console → Authentication → Settings → User actions → enable "Enable create (sign-up)".';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection and try again.';
          break;
        case 'auth/unauthorized-domain':
          message = 'This website address is not authorised in Firebase (Authentication → Settings → Authorized domains).';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please wait a moment and try again.';
          break;
        default:
          message = `${err?.message || 'Unable to create your account. Please try again.'}${code ? ` (${code})` : ''}`;
      }
      showToast(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseConfigured && currentUser?.id && currentUser.id !== 'user_me') {
        await setRealPresence(currentUser.id, false);
      }
      await authService.signOut();
      apiService.resetAllLocal();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setOffersSeen(false);
    setIsVipDiscountModalOpen(false);
    setIsDiscountModalOpen(false);
    homeVipShownRef.current = false;
    showToast('Logged out successfully');
    setCurrentView('welcome');
  };

  const updateUserProfile = async (data: Partial<CurrentUser>) => {
    const updated = await apiService.updateCurrentUser(data);
    // Editing the profile must never change the wallet — keep the live balance.
    setCurrentUser((prev) => ({ ...updated, walletBalance: prev.walletBalance, coinBalance: prev.coinBalance }));
    showToast('Profile updated successfully! 💖');
  };

  const updateUserPreferences = async (prefs: Partial<UserPreferences>) => {
    const updated = await apiService.updateCurrentUser({
      preferences: { ...currentUser.preferences, ...prefs }
    });
    setCurrentUser((prev) => ({ ...updated, walletBalance: prev.walletBalance, coinBalance: prev.coinBalance }));
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
    setCurrentView('home');
    setActiveTab('home');
  };

  // Open chat with a given match, set active match and navigate to chat view
  const openChatWithMatch = async (match: Match) => {
    // Chat is pay-per-minute (₹3/min): the wallet must cover at least one minute.
    if (walletBalanceRef.current < CHAT_PER_MINUTE_INR) {
      setWalletPackContext({
        reason: `Chat costs ₹${CHAT_PER_MINUTE_INR}/min — add money to start chatting with ${match.profile.name}.`,
        requiredAmount: CHAT_PER_MINUTE_INR
      });
      setIsWalletPackModalOpen(true);
      return;
    }
    setActiveMatch(match);
    localStorage.setItem('miora_active_chat_id', match.id);
    setCurrentView('chat');
    setActiveTab('chat');
  };

  const startChatFromMatch = () => {
    if (activeMatch) {
      closeMatchModal();
      openChatWithMatch(activeMatch);
    }
  };


  const startDirectMessage = (profile: Profile) => {
    // 1. Check if user is already a match
    const existingMatch = matches.find((m) => m.profileId === profile.id || m.id === profile.id);
    if (existingMatch) {
      openChatWithMatch(existingMatch);
      return;
    }

    // Real, genuinely registered people: message them directly, free of the
    // demo "non-match" coin fee — this is a real friend, not a mock profile.
    if (profile.isRealUser) {
      const chatId = getRealChatId(currentUser.id, profile.id);
      const newMatch: Match = {
        id: chatId,
        profileId: profile.id,
        profile,
        matchedAt: new Date().toISOString(),
        lastMessage: 'Say hello 👋',
        lastMessageTime: 'Just now',
        unreadCount: 0
      };
      setMatches((prev) => [newMatch, ...prev.filter((m) => m.id !== chatId)]);
      openChatWithMatch(newMatch);
      return;
    }

    // 2. Direct message to a non-match requires 10 coins
    const cost = MIORA_PRICING.chat.directMessageNonMatchCoins;
    if (currentUser.coinBalance < cost) {
      showToast(`Direct message to a non-match requires ${cost} coins 💬`);
      navigateToTab('wallet');
      return;
    }

    const ok = spendCoins(cost, `Direct Message to ${profile.name} 💬`, profile.name);
    if (!ok) {
      navigateToTab('wallet');
      return;
    }

    // Create a new match conversation
    const newMatch: Match = {
      id: `match_${profile.id}_${Date.now()}`,
      profileId: profile.id,
      profile,
      matchedAt: new Date().toISOString(),
      lastMessage: 'Started direct conversation 💬',
      lastMessageTime: 'Just now',
      unreadCount: 0
    };

    setMatches((prev) => [newMatch, ...prev]);
    openChatWithMatch(newMatch);
    showToast(`Direct message thread opened with ${profile.name}! -${cost} Coins 💬`);
  };

  const sendChatMessage = async (text: string, type: MessageType = 'text', metadata?: any) => {
    if (!activeMatch) return;

    const matchId = activeMatch.id;
    const messageText = text || (type === 'image' ? 'Shared a photo 📸' : '');
    if (!messageText.trim()) return;

    // Real conversation with a genuinely registered person: write straight to
    // Firestore. The realtime listener above (scoped to activeMatch.id) picks
    // it up for both people, so there's no local append here and no fake
    // auto-reply — an actual human replies on their own device.
    if (activeMatch.profile.isRealUser) {
      const sentRealMessage = await sendRealMessage(
        matchId,
        currentUser.id,
        activeMatch.profile.id,
        messageText.trim(),
        type,
        metadata
      );
      if (sentRealMessage) {
        setCurrentChatMessages((prev) => prev.some((m) => m.id === sentRealMessage.id) ? prev : [...prev, sentRealMessage]);
      }

      const previewText =
        type === 'gift'
          ? `Sent a Gift ${metadata?.giftEmoji || '🎁'}`
          : type === 'image'
          ? '📷 Sent a photo'
          : messageText;

      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, lastMessage: previewText, lastMessageTime: 'Just now' } : m))
      );
      return;
    }

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

    // No automatic/demo replies. Replies come only from another registered user.
  };

  const deleteChatMessage = async (messageId: string) => {
    if (!activeMatch) return;
    const target = currentChatMessages.find((message) => message.id === messageId);
    if (!target) return;

    const isMine = target.senderId === currentUser.id || target.senderId === 'me' || target.senderId === 'user_me';
    if (!isMine) {
      showToast('You can only delete messages you sent.');
      return;
    }

    try {
      if (activeMatch.profile.isRealUser) {
        await deleteRealMessage(messageId);
      } else {
        await apiService.deleteMessage(activeMatch.id, messageId);
      }
      setCurrentChatMessages((prev) => prev.filter((message) => message.id !== messageId));
      setMatches((prev) => prev.map((match) => {
        if (match.id !== activeMatch.id) return match;
        const remaining = currentChatMessages.filter((message) => message.id !== messageId);
        const last = remaining[remaining.length - 1];
        return {
          ...match,
          lastMessage: last?.text || '',
          lastMessageTime: last?.timestamp || ''
        };
      }));
    } catch (error) {
      console.error('Delete message failed', error);
      showToast('Could not delete that message.');
    }
  };

  // ==========================================
  // 1. Audio & Video Calling
  // ==========================================
  const openCallPaymentModal = (partner: Profile, type: 'audio' | 'video') => {
    setCallPaymentPartner(partner);
    setCallPaymentType(type);
    setIsCallPaymentModalOpen(true);
  };

  const closeCallPaymentModal = () => {
    setIsCallPaymentModalOpen(false);
    setCallPaymentPartner(null);
  };

  const findPartnerProfile = (uid: string): Profile | null => {
    return realProfiles.find((p) => p.id === uid) || matches.find((m) => m.profileId === uid)?.profile || profiles.find((p) => p.id === uid) || null;
  };

  const stopCallController = async (status: 'ended' | 'rejected' = 'ended') => {
    const controller = callControllerRef.current;
    callControllerRef.current = null;
    if (controller) await controller.end(status);
    setLocalCallStream(null);
    setRemoteCallStream(null);
    setActiveSignalCallId(null);
  };

  const initiateActiveCall = async (partner: Profile, type: CallType) => {
    if (isProfileDetailOpen) setIsProfileDetailOpen(false);
    if (isMatchModalOpen) setIsMatchModalOpen(false);
    const firebaseUid = auth.currentUser?.uid;
    if (!firebaseUid) {
      showToast('Your login session expired. Please sign in again before calling.');
      return;
    }
    if (!partner?.id || partner.id === 'user_me' || !partner.isRealUser) {
      showToast('Calls are available for registered MIORA users only.');
      return;
    }
    const callId = `${firebaseUid}__${partner.id}__${Date.now()}`;
    const call: ActiveCall = {
      id: `call_${Date.now()}`, type, partner, status: 'calling', durationSeconds: 0,
      remainingTalkTimeSeconds: currentUser.talkTimeSecondsRemaining || 1200,
      isMuted: false, isCameraOff: false, isFrontCamera: true
    };
    setActiveSignalCallId(callId);
    setActiveCall(call);
    try {
      const controller = new WebRTCCall(
        callId, firebaseUid, partner.id, true, type,
        (stream) => setRemoteCallStream(stream),
        () => setActiveCall((prev) => prev ? ({ ...prev, status: 'connected', startedAt: prev.startedAt || Date.now() }) : null),
        () => setActiveCall((prev) => prev ? ({ ...prev, status: 'ended' }) : null)
      );
      callControllerRef.current = controller;
      await controller.start();
      setLocalCallStream(controller.getLocalStream());
      showToast(`Calling ${partner.name}…`);
    } catch (error: any) {
      console.error('[MIORA call] start failed', error);
      const code = error?.code || '';
      const message = code === 'permission-denied'
        ? 'Firebase blocked call signaling. Deploy the updated firestore.rules, then try again.'
        : (error?.message || 'Could not start the call. Allow microphone/camera access and try again.');
      showToast(message);
      await stopCallController('rejected');
      setActiveCall(null);
    }
  };

  const handleCallPaymentSuccess = (method: 'wallet' | 'razorpay') => {
    const partner = callPaymentPartner;
    const type = callPaymentType;
    const requiredAmount = type === 'video' ? 12 : 8;
    if (!partner) { closeCallPaymentModal(); return; }
    if (method === 'wallet') {
      const currentBal = currentUser.walletBalance || 0;
      if (currentBal < requiredAmount) { showToast(`You need at least ₹${requiredAmount} in your wallet to start this call.`); return; }
      closeCallPaymentModal();
      initiateActiveCall(partner, type);
      return;
    }
    closeCallPaymentModal();
    initiateActiveCall(partner, type);
  };

  const startCall = (partner: Profile, type: CallType) => {
    const requiredAmount = type === 'video' ? 12 : 8;
    const currentBal = currentUser.walletBalance || 0;
    if (currentBal < requiredAmount) {
      openCallPaymentModal(partner, type);
      showToast(`You need ₹${requiredAmount} in your wallet to start this ${type === 'video' ? 'video' : 'audio'} call.`);
      return;
    }
    initiateActiveCall(partner, type);
  };

  const acceptIncomingCall = async () => {
    const firebaseUid = auth.currentUser?.uid;
    if (!firebaseUid) { showToast('Your login session expired. Please sign in again.'); return; }
    if (!incomingCall || !activeSignalCallId) return;
    const partner = incomingCall.partner;
    try {
      const controller = new WebRTCCall(
        activeSignalCallId, firebaseUid, partner.id, false, incomingCall.type,
        (stream) => setRemoteCallStream(stream),
        () => setActiveCall((prev) => prev ? ({ ...prev, status: 'connected', startedAt: prev.startedAt || Date.now() }) : null),
        () => setActiveCall(null)
      );
      callControllerRef.current = controller;
      setIncomingCall(null);
      setActiveCall({ ...incomingCall, status: 'calling' });
      await controller.answer();
      setLocalCallStream(controller.getLocalStream());
    } catch (error: any) {
      const code = error?.code || '';
      const message = code === 'permission-denied'
        ? 'Firebase blocked the incoming call. Deploy the updated firestore.rules, then try again.'
        : (error?.message || 'Could not answer the call. Check microphone/camera permissions.');
      showToast(message);
      await stopCallController('rejected');
      setIncomingCall(null);
      setActiveCall(null);
    }
  };

  const rejectIncomingCall = async () => {
    if (activeSignalCallId) await updateSignalingCallStatus(activeSignalCallId, 'rejected');
    await stopCallController('rejected');
    setIncomingCall(null);
    showToast('Call declined');
  };

  const endCall = async () => {
    const call = activeCall;
    if (call) {
      const minutes = Math.max(1, Math.ceil(call.durationSeconds / 60));
      showToast(`Call ended. Duration: ${Math.floor(call.durationSeconds / 60)}m ${call.durationSeconds % 60}s`);
      const match = matches.find((m) => m.profileId === call.partner.id);
      if (match && activeMatch?.id === match.id) {
        await sendChatMessage(`${call.type === 'video' ? '📹 Video' : '📞 Audio'} Call (${minutes} min)`, 'call-log', { callType: call.type, callDurationSec: call.durationSeconds });
      }
    }
    await stopCallController('ended');
    setActiveCall(null);
  };

  const toggleMute = () => {
    const enabled = !activeCall?.isMuted;
    callControllerRef.current?.getLocalStream()?.getAudioTracks().forEach((track) => { track.enabled = enabled; });
    setActiveCall((prev) => prev ? { ...prev, isMuted: !prev.isMuted } : null);
  };

  const toggleCamera = () => {
    const enabled = !!activeCall?.isCameraOff;
    callControllerRef.current?.getLocalStream()?.getVideoTracks().forEach((track) => { track.enabled = enabled; });
    setActiveCall((prev) => prev ? { ...prev, isCameraOff: !prev.isCameraOff } : null);
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
  // 2. Wallet & ₹ Balance System
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
          const added = result.creditAddedInr ?? result.coinsAdded ?? 0;
          const newBal = result.newWalletBalance ?? result.newBalance ?? (currentUser.walletBalance + added);
          await updateWalletBalance(newBal, added);
          showToast(`Successfully added ₹${added} to your MIORA Wallet! ✨`);
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

  const updateWalletBalance = async (newBalance: number, creditAdded: number) => {
    setCurrentUser((u) => ({
      ...u,
      walletBalance: newBalance,
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
      message: `Credited ₹${creditAdded} to your MIORA Wallet. New Balance: ₹${newBalance.toFixed(2)}`,
      timestamp: 'Just now',
      read: false,
      linkTab: 'wallet'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const earnCoinsTask = (taskId: string, coins: number, title: string) => {
    const updatedWallet = (currentUser.walletBalance || 0) + coins;
    setCurrentUser((u) => ({
      ...u,
      walletBalance: updatedWallet,
      coinBalance: updatedWallet
    }));

    const txn: CoinTransaction = {
      id: `txn_${Date.now()}`,
      type: 'WALLET_TOPUP',
      amount: coins,
      description: `Claimed Bonus: ${title}`,
      timestamp: 'Just now',
      icon: '✨'
    };
    setCoinTransactions((prev) => [txn, ...prev]);

    showToast(`Earned +₹${coins} MIORA Wallet Credit! ✨`);
  };

  const spendCoins = (amount: number, description: string, relatedUser?: string): boolean => {
    const currentBal = currentUser.walletBalance || 0;
    if (currentBal < amount) {
      showToast(`Not enough wallet credit! You have ₹${currentBal.toFixed(2)}, required ₹${amount}.`);
      return false;
    }

    const newBal = currentBal - amount;
    apiService.debitWallet(amount).then((wallet) => {
      walletBalanceRef.current = wallet.walletBalance;
      setCurrentUser((u) => ({ ...u, walletBalance: wallet.walletBalance, coinBalance: wallet.coinBalance }));
    }).catch((err) => {
      console.warn('Wallet debit could not be persisted:', err);
      // Optimistic local deduction already applied — do NOT re-fetch wallet here.
      // Re-fetching on every debit failure would cascade requests when the backend
      // is flaky and quickly hit the rate limiter (→ 429).
    });
    setCurrentUser((u) => ({
      ...u,
      walletBalance: newBal,
      coinBalance: newBal
    }));

    const txn: CoinTransaction = {
      id: `txn_${Date.now()}`,
      type: description.includes('Gift') ? 'gift_sent' : description.includes('Audio') ? 'AUDIO_CALL' : description.includes('Video') ? 'VIDEO_CALL' : 'WALLET_PAYMENT',
      amount: -amount,
      description,
      relatedUser,
      timestamp: 'Just now',
      icon: description.includes('Gift') ? '🎁' : '💳'
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
    const cost = getGamePriceCoins(game);
    const currentBal = currentUser.walletBalance || 0;

    if (currentBal < cost) {
      setWalletPackContext({ reason: `You need ₹${cost} in your wallet to play ${game.title}.`, requiredAmount: cost });
      setIsWalletPackModalOpen(true);
      return;
    }

    spendCoins(cost, `Played ${game.title} with ${partner.name} 🎮`, partner.name);

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
        searchablePeople,
        refreshRealProfiles,
        activeProfile,
        activeMatch,
        latestMatchedProfile,
        matches,
        currentChatMessages,
        localCallStream,
        remoteCallStream,
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
        googleAuth,
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
        deleteChatMessage,
        startDirectMessage,

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
        walletBalance: currentUser?.walletBalance ?? 0.0,
        openWalletPackModal: (reason?: string, requiredAmount?: number) => {
          setWalletPackContext({ reason, requiredAmount });
          setIsWalletPackModalOpen(true);
        },
        closeWalletPackModal: () => {
          setIsWalletPackModalOpen(false);
          setWalletPackContext({});
        },
        isWalletPackModalOpen,
        walletPackContext,
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

        // Calling
        isCallPaymentModalOpen,
        callPaymentPartner,
        callPaymentType,
        openCallPaymentModal,
        closeCallPaymentModal,
        handleCallPaymentSuccess,

        // Monetization, Subscriptions & Power-Ups
        isDiscountModalOpen,
        openDiscountModal,
        closeDiscountModal,
        isVipDiscountModalOpen,
        openVipDiscountModal,
        closeVipDiscountModal,
        isUpgradeModalOpen,
        openUpgradeModal,
        closeUpgradeModal,
        openUpgradeFor,
        upgradeContext,
        canSeeLikerNames,
        viewLikeNotification,
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
        purchaseProduct,
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

