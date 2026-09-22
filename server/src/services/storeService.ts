import { Profile, CurrentUser, Match, Message, ReportItem, BlockItem } from '../types';
import { initialCurrentUser } from '../data/seedProfiles';

class DataStoreService {
  private currentUser: CurrentUser = { ...initialCurrentUser };
  private profiles: Profile[] = [];
  private likedProfileIds: Set<string> = new Set();
  private passedProfileIds: Set<string> = new Set();
  private matches: Match[] = [];
  private messagesByMatchId: Map<string, Message[]> = new Map();

  private blockedUsers: BlockItem[] = [];
  private reports: ReportItem[] = [];

  // Profiles
  public getDiscoverProfiles(): Profile[] {
    const blockedIds = new Set(this.blockedUsers.map((b) => b.profileId));
    return this.profiles.filter(
      (p) =>
        !this.likedProfileIds.has(p.id) &&
        !this.passedProfileIds.has(p.id) &&
        !blockedIds.has(p.id)
    );
  }

  public getAllProfiles(): Profile[] {
    const blockedIds = new Set(this.blockedUsers.map((b) => b.profileId));
    return this.profiles.filter((p) => !blockedIds.has(p.id));
  }

  public getProfileById(id: string): Profile | undefined {
    return this.profiles.find((p) => p.id === id);
  }

  // Like & Pass
  public likeProfile(profileId: string, isSuperLike = false): { isMatch: boolean; match?: Match } {
    this.likedProfileIds.add(profileId);
    const profile = this.getProfileById(profileId);
    if (!profile) return { isMatch: false };

    // 80% chance of matching to ensure an exciting MVP experience
    const willMatch = Math.random() < 0.85 || isSuperLike;

    if (willMatch) {
      const existingMatch = this.matches.find((m) => m.profileId === profileId);
      if (existingMatch) {
        return { isMatch: true, match: existingMatch };
      }

      const matchId = `match_${Date.now()}`;
      const newMatch: Match = {
        id: matchId,
        profileId: profile.id,
        profile,
        matchedAt: new Date().toISOString(),
        lastMessage: isSuperLike ? 'Super Liked your profile ⭐' : 'Matched just now! 💖',
        lastMessageTime: 'Just now',
        unreadCount: 0
      };

      this.matches.unshift(newMatch);
      this.messagesByMatchId.set(matchId, [
        {
          id: `msg_seed_${Date.now()}`,
          matchId,
          senderId: profile.id,
          text: `Hey ${this.currentUser.name}! It's a match! ✨ So nice to connect with you!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        }
      ]);

      return { isMatch: true, match: newMatch };
    }

    return { isMatch: false };
  }

  public passProfile(profileId: string): boolean {
    this.passedProfileIds.add(profileId);
    return true;
  }

  // Matches
  public getMatches(): Match[] {
    return this.matches;
  }

  // Messages
  public getMessages(matchId: string): Message[] {
    return this.messagesByMatchId.get(matchId) || [];
  }

  public deleteMessage(matchId: string, messageId: string): boolean {
    const list = this.messagesByMatchId.get(matchId) || [];
    const next = list.filter((message) => message.id !== messageId);
    if (next.length === list.length) return false;
    this.messagesByMatchId.set(matchId, next);
    const match = this.matches.find((m) => m.id === matchId);
    if (match) {
      const last = next[next.length - 1];
      match.lastMessage = last?.text || '';
      match.lastMessageTime = last?.timestamp || '';
    }
    return true;
  }

  public sendMessage(matchId: string, text: string): Message {
    const list = this.messagesByMatchId.get(matchId) || [];
    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId,
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: true
    };
    list.push(newMsg);
    this.messagesByMatchId.set(matchId, list);

    // Update last message in match summary
    const match = this.matches.find((m) => m.id === matchId);
    if (match) {
      match.lastMessage = text;
      match.lastMessageTime = 'Just now';
    }

    return newMsg;
  }

  public simulateReply(matchId: string, replyText: string): Message {
    const match = this.matches.find((m) => m.id === matchId);
    const list = this.messagesByMatchId.get(matchId) || [];
    const replyMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      matchId,
      senderId: match ? match.profileId : 'them',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    list.push(replyMsg);
    this.messagesByMatchId.set(matchId, list);

    if (match) {
      match.lastMessage = replyText;
      match.lastMessageTime = 'Just now';
      match.unreadCount += 1;
    }

    return replyMsg;
  }

  // User
  public getCurrentUser(): CurrentUser {
    return this.currentUser;
  }

  public updateCurrentUser(updates: Partial<CurrentUser>): CurrentUser {
    this.currentUser = {
      ...this.currentUser,
      ...updates,
      preferences: {
        ...this.currentUser.preferences,
        ...(updates.preferences || {})
      }
    };
    return this.currentUser;
  }

  // Safety: Block & Report
  public blockUser(profileId: string): boolean {
    const profile = this.getProfileById(profileId);
    if (!profile) return false;

    // Remove from active matches and discover
    this.matches = this.matches.filter((m) => m.profileId !== profileId);
    this.blockedUsers.push({
      id: `block_${Date.now()}`,
      profileId,
      profileName: profile.name,
      profilePhoto: profile.photos[0] || '',
      blockedAt: new Date().toISOString()
    });
    return true;
  }

  public unblockUser(profileId: string): boolean {
    this.blockedUsers = this.blockedUsers.filter((b) => b.profileId !== profileId);
    return true;
  }

  public getBlockedUsers(): BlockItem[] {
    return this.blockedUsers;
  }

  public reportUser(targetProfileId: string, reason: string, details?: string): ReportItem {
    const profile = this.getProfileById(targetProfileId);
    const report: ReportItem = {
      id: `rep_${Date.now()}`,
      targetProfileId,
      targetProfileName: profile ? profile.name : 'Unknown User',
      reason,
      details,
      createdAt: new Date().toISOString()
    };
    this.reports.push(report);
    return report;
  }

  // Reset demo
  public resetState(): void {
    this.currentUser = { ...initialCurrentUser };
    this.profiles = [];
    this.likedProfileIds = new Set();
    this.passedProfileIds = new Set();
    this.blockedUsers = [];
    this.reports = [];
  }
}

export const storeService = new DataStoreService();
