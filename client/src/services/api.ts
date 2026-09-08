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
  CoinTransaction
} from '../types';
import {
  INITIAL_CURRENT_USER,
  INITIAL_PROFILES,
  INITIAL_MATCHES,
  INITIAL_MESSAGES,
  INITIAL_FEED_POSTS,
  INITIAL_STATUS_STORIES,
  INITIAL_TRANSACTIONS
} from '../data/mockData';
import { authService } from './authService';

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

      const res = await fetch(`${BASE_URL}/api${endpoint}`, {
        ...options,
        headers
      });

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
  async getCurrentUser(): Promise<CurrentUser> {
    try {
      return await this.fetchApi<CurrentUser>('/user/me');
    } catch {
      return getLocal<CurrentUser>(STORAGE_KEYS.USER, INITIAL_CURRENT_USER);
    }
  }

  async updateCurrentUser(data: Partial<CurrentUser>): Promise<CurrentUser> {
    try {
      return await this.fetchApi<CurrentUser>('/user/me', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    } catch {
      const current = getLocal<CurrentUser>(STORAGE_KEYS.USER, INITIAL_CURRENT_USER);
      const updated = {
        ...current,
        ...data,
        preferences: { ...current.preferences, ...(data.preferences || {}) }
      };
      setLocal(STORAGE_KEYS.USER, updated);
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

      const willMatch = Math.random() < 0.85 || isSuperLike;

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

  async createPaymentOrder(packageId: string): Promise<{
    orderId: string;
    amount: number;
    amountInr: number;
    currency: string;
    keyId: string;
    packageId: string;
    coins: number;
    packageName: string;
  }> {
    return await this.fetchApi('/wallet/payment/create-order', {
      method: 'POST',
      body: JSON.stringify({ packageId })
    });
  }

  async verifyPayment(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    packageId: string;
  }): Promise<{
    success: boolean;
    message: string;
    newBalance: number;
    coinsAdded: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    transaction?: CoinTransaction;
  }> {
    return await this.fetchApi('/wallet/payment/verify', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async rechargeCoins(amount: number, packageId: string, paymentMethod: string): Promise<{ newBalance: number; transaction: CoinTransaction }> {
    try {
      return await this.fetchApi('/wallet/recharge', {
        method: 'POST',
        body: JSON.stringify({ amount, packageId, paymentMethod })
      });
    } catch {
      const tx: CoinTransaction = {
        id: `tx_${Date.now()}`,
        type: 'recharge',
        amount,
        description: `Recharged ${amount} Coins`,
        timestamp: 'Just now',
        icon: '💎'
      };
      return { newBalance: 500 + amount, transaction: tx };
    }
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
