import { Profile, CurrentUser, Match, Message, ReportItem, BlockItem } from '../types';
import { initialCurrentUser, seedProfiles } from '../data/seedProfiles';

class DataStoreService {
  private currentUser: CurrentUser = { ...initialCurrentUser };
  private profiles: Profile[] = [...seedProfiles];
  private likedProfileIds: Set<string> = new Set(['prof_1']); // Priya is an existing like
  private passedProfileIds: Set<string> = new Set();
  private matches: Match[] = [
    {
      id: 'match_1',
      profileId: 'prof_1',
      profile: seedProfiles[0], // Priya
      matchedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      lastMessage: 'Hey! How are you doing today? 😊',
      lastMessageTime: '2h ago',
      unreadCount: 1
    },
    {
      id: 'match_2',
      profileId: 'prof_2',
      profile: seedProfiles[1], // Ananya
      matchedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      lastMessage: 'I love that aesthetic cafe you mentioned! ☕',
      lastMessageTime: '1d ago',
      unreadCount: 0
    }
  ];

  private messagesByMatchId: Map<string, Message[]> = new Map([
    [
      'match_1',
      [
        {
          id: 'msg_1',
          matchId: 'match_1',
          senderId: 'prof_1',
          text: 'Hey! 👋 Love your music and design vibe!',
          timestamp: '2:15 PM',
          read: true
        },
        {
          id: 'msg_2',
          matchId: 'match_1',
          senderId: 'me',
          text: 'Hey Priya! Thanks so much! I saw you love indie vinyls too 🎵',
          timestamp: '2:18 PM',
          read: true
        },
        {
          id: 'msg_3',
          matchId: 'match_1',
          senderId: 'prof_1',
          text: 'Hey! How are you doing today? 😊',
          timestamp: '2:20 PM',
          read: false
        }
      ]
    ],
    [
      'match_2',
      [
        {
          id: 'msg_4',
          matchId: 'match_2',
          senderId: 'me',
          text: 'Hey Ananya, sunset drives in Hyderabad sound amazing!',
          timestamp: 'Yesterday',
          read: true
        },
        {
          id: 'msg_5',
          matchId: 'match_2',
          senderId: 'prof_2',
          text: 'I love that aesthetic cafe you mentioned! ☕',
          timestamp: 'Yesterday',
          read: true
        }
      ]
    ]
  ]);

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
    this.profiles = [...seedProfiles];
    this.likedProfileIds = new Set(['prof_1']);
    this.passedProfileIds = new Set();
    this.blockedUsers = [];
    this.reports = [];
  }
}

export const storeService = new DataStoreService();
