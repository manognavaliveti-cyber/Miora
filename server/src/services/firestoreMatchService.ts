import { getAdminFirestore } from '../lib/firebaseAdmin';
import { Profile, Match, Message } from '../types';
import { seedProfiles } from '../data/seedProfiles';

export class FirestoreMatchService {
  /**
   * Fetch all real profiles from Firestore or fallback seed profiles
   */
  async getProfiles(): Promise<Profile[]> {
    try {
      const db = getAdminFirestore();
      const snapshot = await db.collection('profiles').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Profile));
      }
    } catch (err) {
      console.warn('Failed to fetch profiles from Firestore, using default seed profiles:', err);
    }
    return seedProfiles;
  }

  /**
   * Fetch a single profile by ID from Firestore or fallback seed profiles
   */
  async getProfileById(profileId: string): Promise<Profile | undefined> {
    try {
      const db = getAdminFirestore();
      const doc = await db.collection('profiles').doc(profileId).get();
      if (doc.exists) {
        return { id: doc.id, ...doc.data() } as Profile;
      }
      const userDoc = await db.collection('users').doc(profileId).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        return {
          id: userDoc.id,
          name: data?.name || 'MIORA Member',
          age: data?.age || 24,
          location: data?.location || 'India',
          distanceKm: 5,
          bio: data?.bio || 'Living life with purpose ✨',
          photos: data?.photos || ['https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'],
          interests: data?.interests || ['Travel', 'Coffee'],
          compatibility: 88,
          online: true,
          gender: data?.gender || 'woman'
        } as Profile;
      }
    } catch (err) {
      console.warn(`Failed to fetch profile ${profileId} from Firestore:`, err);
    }
    return seedProfiles.find((p: Profile) => p.id === profileId);
  }

  /**
   * Process a Like action:
   * 1. Save like document to Firestore `likes` collection
   * 2. Check if a reciprocal like exists
   * 3. If reciprocal like exists (or isSuperLike), create a persistent Firestore match document
   */
  async likeProfile(userId: string, targetUserId: string, isSuperLike = false): Promise<{ isMatch: boolean; match?: Match }> {
    const db = getAdminFirestore();
    const now = new Date().toISOString();
    const likeDocId = `${userId}_${targetUserId}`;

    // 1. Save like record to Firestore
    await db.collection('likes').doc(likeDocId).set({
      id: likeDocId,
      userId,
      targetUserId,
      isSuperLike,
      createdAt: now
    }, { merge: true });

    // 2. Check for reciprocal like
    const reciprocalDocId = `${targetUserId}_${userId}`;
    const reciprocalSnap = await db.collection('likes').doc(reciprocalDocId).get();
    const isMutualMatch = reciprocalSnap.exists || isSuperLike;

    if (isMutualMatch) {
      const matchId = `match_${[userId, targetUserId].sort().join('_')}`;
      const matchRef = db.collection('matches').doc(matchId);

      const [userProfile, targetProfile] = await Promise.all([
        this.getProfileById(userId),
        this.getProfileById(targetUserId)
      ]);

      const fallbackTargetProfile: Profile = targetProfile || {
        id: targetUserId,
        name: 'MIORA Match',
        age: 24,
        location: 'Nearby',
        distanceKm: 4,
        bio: 'Excited to connect on MIORA ✨',
        photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80'],
        interests: ['Music', 'Art'],
        compatibility: 92,
        online: true,
        gender: 'woman'
      };

      const matchData = {
        id: matchId,
        users: [userId, targetUserId],
        userIds: {
          [userId]: true,
          [targetUserId]: true
        },
        matchedAt: now,
        lastMessage: isSuperLike ? 'Super Liked your profile ⭐' : '',
        lastMessageTime: 'Just now',
        profiles: {
          [userId]: userProfile || { id: userId, name: 'You' },
          [targetUserId]: fallbackTargetProfile
        }
      };

      await matchRef.set(matchData, { merge: true });

      const matchObj: Match = {
        id: matchId,
        profileId: targetUserId,
        profile: fallbackTargetProfile,
        matchedAt: now,
        lastMessage: isSuperLike ? 'Super Liked your profile ⭐' : '',
        lastMessageTime: 'Just now',
        unreadCount: 0
      };

      return { isMatch: true, match: matchObj };
    }

    return { isMatch: false };
  }

  /**
   * Save a Pass action in Firestore
   */
  async passProfile(userId: string, targetUserId: string): Promise<boolean> {
    const db = getAdminFirestore();
    const passDocId = `${userId}_${targetUserId}`;
    await db.collection('passes').doc(passDocId).set({
      id: passDocId,
      userId,
      targetUserId,
      createdAt: new Date().toISOString()
    }, { merge: true });
    return true;
  }

  /**
   * Fetch all persistent matches for a specific authenticated user from Firestore
   */
  async getMatches(userId: string): Promise<Match[]> {
    const db = getAdminFirestore();
    try {
      // Query matches where users array contains userId
      const snapshot = await db.collection('matches').where('users', 'array-contains', userId).get();
      const matches: Match[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const users: string[] = data.users || [];
        const partnerId = users.find((u) => u !== userId) || (data.userIds ? Object.keys(data.userIds).find((u) => u !== userId) : null);

        if (!partnerId) continue;

        let partnerProfile: Profile | undefined = data.profiles?.[partnerId];
        if (!partnerProfile || !partnerProfile.name) {
          partnerProfile = await this.getProfileById(partnerId);
        }

        const fallbackProfile: Profile = partnerProfile || {
          id: partnerId,
          name: 'MIORA Connection',
          age: 25,
          location: 'Nearby',
          distanceKm: 3,
          bio: 'Connected on MIORA ✨',
          photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80'],
          interests: ['Coffee', 'Travel'],
          compatibility: 89,
          online: true,
          gender: 'woman'
        };

        matches.push({
          id: doc.id,
          profileId: partnerId,
          profile: fallbackProfile,
          matchedAt: data.matchedAt || new Date().toISOString(),
          lastMessage: data.lastMessage || '',
          lastMessageTime: data.lastMessageTime || '',
          unreadCount: data.unreadCount || 0
        });
      }

      // Sort by matchedAt / lastMessageTime descending
      return matches.sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
    } catch (err) {
      console.error(`Error fetching matches for user ${userId}:`, err);
      return [];
    }
  }

  /**
   * Fetch all stored messages for a specific match from Firestore
   */
  async getMessages(userId: string, matchId: string): Promise<Message[]> {
    const db = getAdminFirestore();
    try {
      // Verify match participation
      const matchDoc = await db.collection('matches').doc(matchId).get();
      if (!matchDoc.exists) {
        return [];
      }
      const matchData = matchDoc.data();
      const users: string[] = matchData?.users || [];
      if (!users.includes(userId)) {
        console.warn(`User ${userId} unauthorized to view messages for match ${matchId}`);
        return [];
      }

      const snapshot = await db
        .collection('messages')
        .where('matchId', '==', matchId)
        .get();

      const messages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          matchId: data.matchId,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp || new Date(data.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: data.read ?? true
        };
      });

      return messages.sort((a, b) => (a.id > b.id ? 1 : -1));
    } catch (err) {
      console.error(`Error fetching messages for match ${matchId}:`, err);
      return [];
    }
  }

  /**
   * Save a new chat message in Firestore and update the parent match preview
   */
  async sendMessage(userId: string, matchId: string, text: string): Promise<Message> {
    const db = getAdminFirestore();
    const matchRef = db.collection('matches').doc(matchId);
    const matchDoc = await matchRef.get();

    if (!matchDoc.exists) {
      throw new Error(`Match ${matchId} does not exist`);
    }

    const matchData = matchDoc.data();
    const users: string[] = matchData?.users || [];
    if (!users.includes(userId)) {
      throw new Error(`User ${userId} is not a member of match ${matchId}`);
    }

    const partnerId = users.find((u) => u !== userId) || 'them';
    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const messageData = {
      id: msgId,
      matchId,
      senderId: userId,
      recipientId: partnerId,
      text: text.trim(),
      timestamp: timestampStr,
      createdAt: now.toISOString(),
      read: false
    };

    // Save message doc to Firestore
    await db.collection('messages').doc(msgId).set(messageData);

    // Update parent match doc in Firestore
    await matchRef.update({
      lastMessage: text.trim(),
      lastMessageTime: 'Just now',
      updatedAt: now.toISOString()
    });

    return {
      id: msgId,
      matchId,
      senderId: userId,
      text: text.trim(),
      timestamp: timestampStr,
      read: true
    };
  }

  /**
   * Delete a chat message from Firestore
   */
  async deleteMessage(userId: string, matchId: string, messageId: string): Promise<boolean> {
    const db = getAdminFirestore();
    const msgRef = db.collection('messages').doc(messageId);
    const msgDoc = await msgRef.get();

    if (!msgDoc.exists) {
      return false;
    }

    if (msgDoc.data()?.senderId !== userId) {
      throw new Error('Unauthorized to delete this message');
    }

    await msgRef.delete();
    return true;
  }
}

export const firestoreMatchService = new FirestoreMatchService();
