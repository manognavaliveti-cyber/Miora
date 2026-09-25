import {
  Profile,
  CurrentUser,
  Match,
  Message,
  MessageType,
  BlockItem,
  ReportPayload,
  FeedPost,
  StatusStory,
  CoinTransaction,
  WhoLikedMeProfile
} from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_PROFILES,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  INITIAL_FEED_POSTS,
  INITIAL_STATUS_STORIES,
  INITIAL_TRANSACTIONS,
  INITIAL_WHO_LIKED_ME
} from '../data/mockData';
import { authService } from './authService';
import { resolveWallet } from './walletStore';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Local fallback storage keys
const STORAGE_KEYS = {
  USER: 'miora_user',
  PROFILES: 'miora_profiles',
  LIKES: 'miora_likes',
  PASSES: 'miora_passes',
  MATCHES: 'miora_matches',
  MESSAGES: 'miora_messages',
  BLOCKED: 'miora_blocked',
  REPORTS: 'miora_reports',
  FEED_POSTS: 'miora_feed_posts',
  STATUS_STORIES: 'miora_status_stories',
  TRANSACTIONS: 'miora_transactions'
};

// Helper for local state
const getLocal = <T>(key: string, defaultVal: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const setLocal = <T>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('LocalStorage error', e);
  }
};

class ApiService {
  public isBackendAvailable: boolean | null = null;

  /**
   * Main API fetch method:
   * Injects the Firebase ID Token in Authorization: Bearer <token>
   * Calls Spring Boot endpoints and unpacks ApiResponse<T>
   */
  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      // Retrieve fresh Firebase ID token
      const idToken = await authService.getIdToken();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string> || {})
      };

      if (idToken) {
        headers['Authorization'] = `Bearer ${idToken}`;
      }

      // Abort after 10 seconds so a cold Cloud Run start or unreachable backend
      // never leaves the UI stuck in a loading state forever.
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      let res: Response;
      try {
        res = await fetch(`${BASE_URL}/api${endpoint}`, {
          ...options,
          headers,
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const json = await res.json();
      this.isBackendAvailable = true;

      // Handle ApiResponse envelope: { success: true, data: ... }
      if (json && json.data !== undefined) {
        return json.data as T;
      }
      return json as T;
    } catch (err) {
      // Backend is unavailable or request failed - use local storage fallback
      this.isBackendAvailable = false;
      throw err;
    }
  }

  // 1. Current User
  private getUserStorageKey(uid?: string | null): string {
    return uid ? `${STORAGE_KEYS.USER}_${uid}` : STORAGE_KEYS.USER;
  }

  private buildFirebaseFallbackUser(): CurrentUser {
    const firebaseUser = authService.getCurrentUser();
    const uid = firebaseUser?.uid || 'user_me';
    const stored = getLocal<Partial<CurrentUser> | null>(this.getUserStorageKey(uid), null);
    const displayName = firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'MIORA User';
    const email = firebaseUser?.email || '';

    return ({
      ...INITIAL_CURRENT_USER,
      ...stored,
      id: uid,
      name: stored?.name || displayName,
      email: stored?.email || email,
      profileCompletion: stored?.profileCompletion ?? 40,
      termsAccepted: stored?.termsAccepted ?? true,
      termsVersion: stored?.termsVersion || '1.0',
      termsAcceptedAt: stored?.termsAcceptedAt || new Date().toISOString()
    });
  }

  async getCurrentUser(): Promise<CurrentUser> {
    const firebaseUser = authService.getCurrentUser();
    try {
      const remoteUser = await this.fetchApi<CurrentUser>('/user/me');
      const baseUser = firebaseUser && remoteUser && remoteUser.id && remoteUser.id !== firebaseUser.uid
        ? this.buildFirebaseFallbackUser()
        : remoteUser;
      if (firebaseUser?.uid) {
        try {
          const wallet = await this.fetchApi<{ walletBalance: number; coinBalance: number }>('/wallet');
          return { ...baseUser, ...wallet };
        } catch {
          // Offline/local fallback keeps the last device balance.
        }
      }
      return resolveWallet(baseUser);
    } catch {
      return resolveWallet(this.buildFirebaseFallbackUser());
    }
  }

  async getWalletBalance(): Promise<{ walletBalance: number; coinBalance: number }> {
    return this.fetchApi<{ walletBalance: number; coinBalance: number }>('/wallet');
  }

  async debitWallet(amount: number): Promise<{ walletBalance: number; coinBalance: number }> {
    return this.fetchApi<{ walletBalance: number; coinBalance: number }>('/wallet/debit', {
      method: 'POST',
      body: JSON.stringify({ amount })
    });
  }

  async updateCurrentUser(data: Partial<CurrentUser>): Promise<CurrentUser> {
    try {
      return await this.fetchApi<CurrentUser>('/user/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      const firebaseUser = authService.getCurrentUser();
      const current = this.buildFirebaseFallbackUser();
      const updated = {
        ...current,
        ...data,
        id: firebaseUser?.uid || current.id,
        email: data.email || firebaseUser?.email || current.email,
        preferences: { ...current.preferences, ...(data.preferences || {}) }
      };
      setLocal(this.getUserStorageKey(updated.id), updated);
      return updated;
    }
  }

  // 2. Discover Profiles
  async getProfiles(): Promise<Profile[]> {
    try {
      return await this.fetchApi<Profile[]>('/profiles');
    } catch {
      const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      const likes = new Set(getLocal<string[]>(STORAGE_KEYS.LIKES, ['prof_1']));
      const passes = new Set(getLocal<string[]>(STORAGE_KEYS.PASSES, []));
      const blocked = new Set(getLocal<BlockItem[]>(STORAGE_KEYS.BLOCKED, []).map((b) => b.profileId));

      return profiles.filter((p) => !likes.has(p.id) && !passes.has(p.id) && !blocked.has(p.id));
    }
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    try {
      return await this.fetchApi<Profile>(`/profiles/${id}`);
    } catch {
      const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      return profiles.find((p) => p.id === id);
    }
  }

  // 3. Like & Pass
  async likeProfile(profileId: string, isSuperLike = false): Promise<{ isMatch: boolean; match?: Match }> {
    try {
      return await this.fetchApi<{ isMatch: boolean; match?: Match }>('/likes', {
        method: 'POST',
        body: JSON.stringify({ profileId, isSuperLike })
      });
    } catch {
      // Local fallback logic
      const likes = getLocal<string[]>(STORAGE_KEYS.LIKES, ['prof_1']);
      if (!likes.includes(profileId)) {
        likes.push(profileId);
        setLocal(STORAGE_KEYS.LIKES, likes);
      }

      const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      const targetProfile = profiles.find((p) => p.id === profileId);

      const willMatch = Boolean(targetProfile?.isTestProfile) || Math.random() < 0.85 || isSuperLike;

      if (targetProfile && willMatch) {
        const matches = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
        const existing = matches.find((m) => m.profileId === profileId);
        if (existing) return { isMatch: true, match: existing };

        const newMatch: Match = {
          id: `match_${Date.now()}`,
          profileId: targetProfile.id,
          profile: targetProfile,
          matchedAt: new Date().toISOString(),
          lastMessage: isSuperLike ? 'Super Liked your profile ⭐' : 'Matched just now! 💖',
          lastMessageTime: 'Just now',
          unreadCount: 0
        };

        matches.unshift(newMatch);
        setLocal(STORAGE_KEYS.MATCHES, matches);

        // Add intro message
        const messagesMap = getLocal<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
        messagesMap[newMatch.id] = [
          {
            id: `msg_seed_${Date.now()}`,
            matchId: newMatch.id,
            senderId: targetProfile.id,
            text: `Hey! It's a match! ✨ Love your profile vibe!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          }
        ];
        setLocal(STORAGE_KEYS.MESSAGES, messagesMap);

        return { isMatch: true, match: newMatch };
      }

      return { isMatch: false };
    }
  }

  async passProfile(profileId: string): Promise<boolean> {
    try {
      await this.fetchApi('/passes', {
        method: 'POST',
        body: JSON.stringify({ profileId })
      });
      return true;
    } catch {
      const passes = getLocal<string[]>(STORAGE_KEYS.PASSES, []);
      if (!passes.includes(profileId)) {
        passes.push(profileId);
        setLocal(STORAGE_KEYS.PASSES, passes);
      }
      return true;
    }
  }

  // 4. Matches
  async getMatches(): Promise<Match[]> {
    try {
      return await this.fetchApi<Match[]>('/matches');
    } catch {
      return getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    }
  }

  // 5. Chat Messages
  async getMessages(matchId: string): Promise<Message[]> {
    try {
      return await this.fetchApi<Message[]>(`/messages/${matchId}`);
    } catch {
      const messagesMap = getLocal<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      return messagesMap[matchId] || [];
    }
  }
  // Mark messages as read for a match
  async markMessagesAsRead(matchId: string): Promise<void> {
    try {
      await this.fetchApi<void>(`/messages/${matchId}/read`, { method: 'POST' });
    } catch {
      const messagesMap = getLocal<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const list = messagesMap[matchId] || [];
      messagesMap[matchId] = list.map((message) => ({ ...message, read: true }));
      setLocal(STORAGE_KEYS.MESSAGES, messagesMap);
    }
  }

  async deleteMessage(matchId: string, messageId: string): Promise<void> {
    try {
      await this.fetchApi<void>(`/messages/${matchId}/${messageId}`, { method: 'DELETE' });
      return;
    } catch {
      const messagesMap = getLocal<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const list = messagesMap[matchId] || [];
      messagesMap[matchId] = list.filter((m) => m.id !== messageId);
      setLocal(STORAGE_KEYS.MESSAGES, messagesMap);
    }
  }

  async sendMessage(matchId: string, text: string, type: MessageType = 'text', metadata?: Record<string, any>): Promise<Message> {
    try {
      return await this.fetchApi<Message>('/messages', {
        method: 'POST',
        body: JSON.stringify({ matchId, text, type, metadata })
      });
    } catch {
      const messagesMap = getLocal<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
      const list = messagesMap[matchId] || [];
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        matchId,
        senderId: 'me',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        read: true,
        type,
        metadata
      };
      list.push(newMsg);
      messagesMap[matchId] = list;
      setLocal(STORAGE_KEYS.MESSAGES, messagesMap);

      // Update match preview
      const matches = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
      const match = matches.find((m) => m.id === matchId);
      if (match) {
        match.lastMessage = type === 'gift' ? 'Sent a Gift 🎁' : type === 'heart-crowned' ? `${text} ❤️` : text;
        match.lastMessageTime = 'Just now';
        setLocal(STORAGE_KEYS.MATCHES, matches);
      }

      return newMsg;
    }
  }

  // 6. Safety: Block & Report
  async blockUser(profileId: string, profileName?: string, profilePhoto?: string): Promise<boolean> {
    try {
      await this.fetchApi('/block', {
        method: 'POST',
        body: JSON.stringify({ profileId, profileName, profilePhoto })
      });
      return true;
    } catch {
      const profiles = getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
      const target = profiles.find((p) => p.id === profileId);
      const blocked = getLocal<BlockItem[]>(STORAGE_KEYS.BLOCKED, []);

      if (target && !blocked.some((b) => b.profileId === profileId)) {
        blocked.push({
          id: `block_${Date.now()}`,
          profileId: target.id,
          profileName: target.name,
          profilePhoto: target.photos[0] || '',
          blockedAt: new Date().toISOString()
        });
        setLocal(STORAGE_KEYS.BLOCKED, blocked);

        // Remove from matches
        const matches = getLocal<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES).filter(
          (m) => m.profileId !== profileId
        );
        setLocal(STORAGE_KEYS.MATCHES, matches);
      }
      return true;
    }
  }

  async unblockUser(profileId: string): Promise<boolean> {
    try {
      await this.fetchApi('/unblock', {
        method: 'POST',
        body: JSON.stringify({ profileId })
      });
      return true;
    } catch {
      const blocked = getLocal<BlockItem[]>(STORAGE_KEYS.BLOCKED, []).filter(
        (b) => b.profileId !== profileId
      );
      setLocal(STORAGE_KEYS.BLOCKED, blocked);
      return true;
    }
  }

  async getBlockedUsers(): Promise<BlockItem[]> {
    try {
      return await this.fetchApi<BlockItem[]>('/blocked');
    } catch {
      return getLocal<BlockItem[]>(STORAGE_KEYS.BLOCKED, []);
    }
  }

  async reportUser(payload: ReportPayload): Promise<boolean> {
    try {
      await this.fetchApi('/report', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      return true;
    } catch {
      const reports = getLocal<any[]>(STORAGE_KEYS.REPORTS, []);
      reports.push({
        id: `rep_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString()
      });
      setLocal(STORAGE_KEYS.REPORTS, reports);
      return true;
    }
  }

  // 7. Wallet & Razorpay Payment Integration
  async getTransactions(): Promise<CoinTransaction[]> {
    try {
      return await this.fetchApi<CoinTransaction[]>('/wallet/transactions');
    } catch {
      return getLocal<CoinTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    }
  }

  async createPaymentOrder(productId: string): Promise<{
    orderId: string;
    amount: number;
    amountInr: number;
    walletCreditInr?: number;
    currency: string;
    keyId: string;
    packageId?: string;
    productId?: string;
    productType?: string;
    coins?: number;
    packageName?: string;
    productName?: string;
  }> {
    return await this.fetchApi('/wallet/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ productId, packageId: productId })
    });
  }

  async verifyPayment(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    productId?: string;
    packageId?: string;
  }): Promise<{
    success: boolean;
    message: string;
    newWalletBalance?: number;
    creditAddedInr?: number;
    isPremium?: boolean;
    subscriptionTier?: string;
    newBalance?: number;
    coinsAdded?: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    transaction?: CoinTransaction;
  }> {
    return await this.fetchApi('/wallet/payment/verify', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  // 8. Feed & Status Stories & Notes & Follows
  async getFeedPosts(): Promise<FeedPost[]> {
    try {
      return await this.fetchApi<FeedPost[]>('/feed/posts');
    } catch {
      return getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
    }
  }

  async createFeedPost(content: string, imageUrl?: string, location?: string, tags?: string[]): Promise<FeedPost> {
    try {
      return await this.fetchApi<FeedPost>('/feed/posts', {
        method: 'POST',
        body: JSON.stringify({ content, imageUrl, location, tags })
      });
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
      const post: FeedPost = {
        id: `post_${Date.now()}`,
        userId: 'user_me',
        userName: 'Alex Rivera',
        userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        location: location || 'Bangalore, India',
        content,
        imageUrl: imageUrl || '',
        tags: tags || [],
        timestamp: 'Just now',
        likesCount: 0,
        hasLiked: false,
        isLikedByMe: false,
        saved: false,
        isSavedByMe: false,
        comments: [],
        sharesCount: 0
      };
      posts.unshift(post);
      setLocal(STORAGE_KEYS.FEED_POSTS, posts);
      return post;
    }
  }

  async editFeedPost(postId: string, content: string, location?: string): Promise<FeedPost> {
    try {
      return await this.fetchApi<FeedPost>(`/feed/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ content, location })
      });
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.content = content;
        if (location) post.location = location;
        setLocal(STORAGE_KEYS.FEED_POSTS, posts);
        return post;
      }
      throw new Error('Post not found');
    }
  }

  async deleteFeedPost(postId: string): Promise<boolean> {
    try {
      await this.fetchApi(`/feed/posts/${postId}`, { method: 'DELETE' });
      return true;
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS).filter(p => p.id !== postId);
      setLocal(STORAGE_KEYS.FEED_POSTS, posts);
      return true;
    }
  }

  async likeFeedPost(postId: string): Promise<FeedPost> {
    try {
      return await this.fetchApi<FeedPost>(`/feed/posts/${postId}/like`, { method: 'POST' });
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
      const post = posts.find(p => p.id === postId);
      if (post) {
        const liked = !post.isLikedByMe && !post.hasLiked;
        post.isLikedByMe = liked;
        post.hasLiked = liked;
        post.likesCount = Math.max(0, post.likesCount + (liked ? 1 : -1));
        setLocal(STORAGE_KEYS.FEED_POSTS, posts);
        return post;
      }
      throw new Error('Post not found');
    }
  }

  async toggleSavePost(postId: string): Promise<FeedPost> {
    try {
      return await this.fetchApi<FeedPost>(`/feed/posts/${postId}/save`, { method: 'POST' });
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
      const post = posts.find(p => p.id === postId);
      if (post) {
        const saved = !post.isSavedByMe && !post.saved;
        post.isSavedByMe = saved;
        post.saved = saved;
        setLocal(STORAGE_KEYS.FEED_POSTS, posts);
        return post;
      }
      throw new Error('Post not found');
    }
  }

  async addComment(postId: string, text: string): Promise<FeedPost> {
    try {
      return await this.fetchApi<FeedPost>(`/feed/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ text })
      });
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
      const post = posts.find(p => p.id === postId);
      if (post) {
        post.comments = post.comments || [];
        post.comments.push({
          id: `c_${Date.now()}`,
          userId: 'user_me',
          userName: 'Alex Rivera',
          userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
          text,
          timestamp: 'Just now'
        });
        setLocal(STORAGE_KEYS.FEED_POSTS, posts);
        return post;
      }
      throw new Error('Post not found');
    }
  }

  async deleteComment(postId: string, commentId: string): Promise<FeedPost> {
    try {
      return await this.fetchApi<FeedPost>(`/feed/posts/${postId}/comments/${commentId}`, { method: 'DELETE' });
    } catch {
      const posts = getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS);
      const post = posts.find(p => p.id === postId);
      if (post && post.comments) {
        post.comments = post.comments.filter(c => c.id !== commentId);
        setLocal(STORAGE_KEYS.FEED_POSTS, posts);
        return post;
      }
      throw new Error('Post not found');
    }
  }

  async getStatusStories(): Promise<StatusStory[]> {
    try {
      return await this.fetchApi<StatusStory[]>('/feed/stories');
    } catch {
      return getLocal<StatusStory[]>(STORAGE_KEYS.STATUS_STORIES, INITIAL_STATUS_STORIES);
    }
  }

  async createStatusStory(text: string, mediaUrl?: string): Promise<StatusStory> {
    try {
      return await this.fetchApi<StatusStory>('/feed/stories', {
        method: 'POST',
        body: JSON.stringify({ text, mediaUrl })
      });
    } catch {
      const stories = getLocal<StatusStory[]>(STORAGE_KEYS.STATUS_STORIES, INITIAL_STATUS_STORIES);
      const newStory: StatusStory = {
        id: `story_${Date.now()}`,
        userId: 'user_me',
        userName: 'You',
        userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        text,
        mediaUrl,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        reactionsCount: 0,
        viewed: false,
        isViewed: false,
        isMine: true
      };
      stories.unshift(newStory);
      setLocal(STORAGE_KEYS.STATUS_STORIES, stories);
      return newStory;
    }
  }

  async deleteStatusStory(storyId: string): Promise<boolean> {
    try {
      await this.fetchApi(`/feed/stories/${storyId}`, { method: 'DELETE' });
      return true;
    } catch {
      const stories = getLocal<StatusStory[]>(STORAGE_KEYS.STATUS_STORIES, INITIAL_STATUS_STORIES).filter(s => s.id !== storyId);
      setLocal(STORAGE_KEYS.STATUS_STORIES, stories);
      return true;
    }
  }

  // 9. Status Notes (24h Ephemeral Thoughts)
  async getStatusNotes(): Promise<any[]> {
    try {
      return await this.fetchApi<any[]>('/user/status-notes');
    } catch {
      return [
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
      ];
    }
  }

  async setStatusNote(text: string, emoji?: string): Promise<any> {
    try {
      return await this.fetchApi<any>('/user/status-note', {
        method: 'POST',
        body: JSON.stringify({ text, emoji })
      });
    } catch {
      return {
        id: `sn_${Date.now()}`,
        userId: 'user_me',
        userName: 'You',
        userPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        noteText: text,
        emoji: emoji || '✨',
        createdAt: new Date().toISOString()
      };
    }
  }

  async deleteStatusNote(): Promise<boolean> {
    try {
      await this.fetchApi('/user/status-note', { method: 'DELETE' });
      return true;
    } catch {
      return true;
    }
  }

  // 10. Follow / Following System
  async followUser(targetUserId: string): Promise<boolean> {
    try {
      await this.fetchApi(`/user/follow/${targetUserId}`, { method: 'POST' });
      return true;
    } catch {
      return true;
    }
  }

  async unfollowUser(targetUserId: string): Promise<boolean> {
    try {
      await this.fetchApi(`/user/unfollow/${targetUserId}`, { method: 'POST' });
      return true;
    } catch {
      return true;
    }
  }

  async isFollowing(userId: string): Promise<boolean> {
    try {
      return await this.fetchApi<boolean>(`/user/${userId}/is-following`);
    } catch {
      return false;
    }
  }

  async getFollowers(userId: string): Promise<any[]> {
    try {
      return await this.fetchApi<any[]>(`/user/${userId}/followers`);
    } catch {
      return [];
    }
  }

  async getFollowing(userId: string): Promise<any[]> {
    try {
      return await this.fetchApi<any[]>(`/user/${userId}/following`);
    } catch {
      return [];
    }
  }

  // 11. Search (Profiles & Posts)
  async search(query: string): Promise<{ profiles: Profile[]; posts: FeedPost[] }> {
    try {
      return await this.fetchApi<{ profiles: Profile[]; posts: FeedPost[] }>(`/user/search?q=${encodeURIComponent(query)}`);
    } catch {
      const q = query.toLowerCase();
      const profiles = (getLocal<Profile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES)).filter(
        p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q)
      );
      const posts = (getLocal<FeedPost[]>(STORAGE_KEYS.FEED_POSTS, INITIAL_FEED_POSTS)).filter(
        p => p.content.toLowerCase().includes(q) || (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
      return { profiles, posts };
    }
  }

  // 12. Subscriptions & Power-Ups
  async getWhoLikedMe(): Promise<WhoLikedMeProfile[]> {
    try {
      return await this.fetchApi<WhoLikedMeProfile[]>('/likes/who-liked-me');
    } catch {
      return getLocal<WhoLikedMeProfile[]>('miora_who_liked_me', INITIAL_WHO_LIKED_ME);
    }
  }

  async getSubscriptionOfferStatus(): Promise<any> {
    try {
      return await this.fetchApi<any>('/subscription/offer-status');
    } catch {
      const day = new Date().getDay();
      const isWeekend = (day === 0 || day === 6);
      return {
        success: true,
        data: {
          isWeekend,
          proPriceInr: 345,
          proRegularPriceInr: 499,
          proWalletCreditInr: 524,
          proBonusInr: 25,
          vipPriceInr: 789,
          vipRegularPriceInr: 999,
          vipWalletCreditInr: 1049,
          vipBonusInr: 50
        }
      };
    }
  }

  async subscribe(planId: string, paymentMethod: 'inr' | 'coins'): Promise<CurrentUser> {
    try {
      return await this.fetchApi<CurrentUser>('/subscription/subscribe', {
        method: 'POST',
        body: JSON.stringify({ planId, paymentMethod })
      });
    } catch {
      const user = getLocal<CurrentUser>(STORAGE_KEYS.USER, INITIAL_CURRENT_USER);
      const isVip = planId === 'vip';
      const updated: CurrentUser = {
        ...user,
        isPremium: true,
        subscriptionTier: isVip ? 'vip' : 'pro',
        subscriptionPlanId: planId,
        subscriptionExpiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        dailySwipesRemaining: isVip ? 9999 : 30,
        superLikesRemaining: (user.superLikesRemaining || 0) + 15,
        boostsCount: (user.boostsCount || 0) + 5,
        spotlightsCount: (user.spotlightsCount || 0) + 2
      };
      setLocal(STORAGE_KEYS.USER, updated);
      return updated;
    }
  }

  async activateBoost(): Promise<CurrentUser> {
    try {
      return await this.fetchApi<CurrentUser>('/powerups/boost', { method: 'POST' });
    } catch {
      const user = getLocal<CurrentUser>(STORAGE_KEYS.USER, INITIAL_CURRENT_USER);
      const updated: CurrentUser = {
        ...user,
        boostsCount: Math.max(0, (user.boostsCount || 1) - 1),
        boostActiveUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
      setLocal(STORAGE_KEYS.USER, updated);
      return updated;
    }
  }

  async activateSpotlight(): Promise<CurrentUser> {
    try {
      return await this.fetchApi<CurrentUser>('/powerups/spotlight', { method: 'POST' });
    } catch {
      const user = getLocal<CurrentUser>(STORAGE_KEYS.USER, INITIAL_CURRENT_USER);
      const updated: CurrentUser = {
        ...user,
        spotlightsCount: Math.max(0, (user.spotlightsCount || 1) - 1),
        spotlightActiveUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      setLocal(STORAGE_KEYS.USER, updated);
      return updated;
    }
  }

  // Reset local state
  resetAllLocal(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILES);
    localStorage.removeItem(STORAGE_KEYS.LIKES);
    localStorage.removeItem(STORAGE_KEYS.PASSES);
    localStorage.removeItem(STORAGE_KEYS.MATCHES);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.FEED_POSTS);
    localStorage.removeItem(STORAGE_KEYS.STATUS_STORIES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  }
}

export const apiService = new ApiService();
