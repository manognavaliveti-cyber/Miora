import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { CurrentUser, Profile, Message, MessageType } from '../types';

/**
 * Real, cross-device multi-user layer built directly on Firestore.
 *
 * This intentionally does NOT touch the `profiles` or `matches` collections —
 * this project's firestore.rules reserve those for an Admin SDK backend and
 * block client writes to them. Instead it uses two collections the rules
 * already allow the signed-in user to read/write directly:
 *   - `users/{uid}`   → each real account's own discoverable profile doc
 *   - `messages/{id}` → flat message log, already readable by any signed-in
 *                        user and writable as long as `senderId == auth.uid`
 *
 * Two real accounts always land on the same conversation because the chat's
 * id is derived deterministically from both UIDs (sorted + joined) — whoever
 * opens the chat first, both sides compute the same id.
 */

/** Deterministic, shared chat/matchId for any two real user ids. */
export function getRealChatId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('__');
}

/**
 * Publish (create or update) the signed-in user's own discoverable profile
 * document so other real, logged-in people can find them. Safe to call
 * repeatedly — it merges rather than overwrites.
 */
export async function publishRealProfile(user: CurrentUser): Promise<void> {
  if (!isFirebaseConfigured || !user?.id) return;

  // Display fields only. The wallet / premium fields are protected by firestore.rules:
  // they may only be written when the document is CREATED, and must never change
  // afterwards. Sending them on every update (as before) got the whole update rejected
  // as soon as the wallet changed — so profile edits silently never reached other users.
  const display = {
    id: user.id,
    name: user.name || 'MIORA Member',
    age: user.age || 18,
    gender: user.gender || 'prefer-not-to-say',
    location: user.location || '',
    bio: user.bio || '',
    photos: user.photos && user.photos.length > 0 ? user.photos : [],
    interests: user.interests || [],
    occupation: user.occupation || '',
    education: user.education || '',
    relationshipIntent: user.relationshipIntent || null,
    lifestyle: user.lifestyle || null,
    online: true,
    lastActiveAt: serverTimestamp()
  };

  const ref = doc(db, 'users', user.id);
  try {
    await updateDoc(ref, display);
  } catch (err: any) {
    if (err?.code === 'not-found') {
      try {
        // First time this account is seen: create its discoverable profile.
        await setDoc(ref, { ...display, coinBalance: 0, isPremium: false });
      } catch (createErr) {
        console.warn('[MIORA realtime] Failed to create profile:', createErr);
      }
    } else {
      console.warn('[MIORA realtime] Failed to publish profile:', err);
    }
  }
}

/** Mark the current user online/offline (e.g. on tab focus/blur, unmount). */
export async function setRealPresence(uid: string, online: boolean): Promise<void> {
  if (!isFirebaseConfigured || !uid) return;
  try {
    await setDoc(doc(db, 'users', uid), { online, lastActiveAt: serverTimestamp() }, { merge: true });
  } catch {
    // Non-critical — ignore.
  }
}

const docToProfile = (id: string, d: any): Profile | null => {
  if (!d?.name) return null; // skip incomplete/placeholder docs
  return {
    id,
    name: d.name,
    age: d.age || 18,
    location: d.location || '',
    distanceKm: 0,
    bio: d.bio || '',
    photos: Array.isArray(d.photos) && d.photos.length > 0
      ? d.photos
      : ['data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22%3E%3Crect width=%22400%22 height=%22400%22 rx=%22200%22 fill=%22%23f8e9ee%22/%3E%3Ccircle cx=%22200%22 cy=%22155%22 r=%2270%22 fill=%22%23c08497%22/%3E%3Cpath d=%22M80 360c18-92 222-92 240 0%22 fill=%22%23c08497%22/%3E%3C/svg%3E'],
    interests: d.interests || [],
    compatibility: 90,
    // Treat stale presence as offline so a browser crash/closed tab does not
    // leave the user permanently marked Online. Explicit logout still writes false.
    online: (() => {
      if (!d.online) return false;
      const raw = d.lastActiveAt;
      const ms = raw?.toMillis?.() ?? (raw ? new Date(raw).getTime() : NaN);
      return Number.isFinite(ms) ? (Date.now() - ms) < 120000 : true;
    })(),
    gender: d.gender || 'prefer-not-to-say',
    occupation: d.occupation || '',
    education: d.education || '',
    relationshipIntent: d.relationshipIntent || undefined,
    lifestyle: d.lifestyle || undefined,
    verified: false,
    isRealUser: true
  };
};

/** One-time read of every other registered account (used right before a search). */
export async function fetchRealProfilesOnce(myUid: string): Promise<Profile[]> {
  if (!isFirebaseConfigured || !myUid) return [];
  try {
    const snap = await getDocs(collection(db, 'users'));
    const list: Profile[] = [];
    snap.forEach((docSnap) => {
      if (docSnap.id === myUid) return;
      const p = docToProfile(docSnap.id, docSnap.data());
      if (p) list.push(p);
    });
    return list;
  } catch (err) {
    console.warn('[MIORA realtime] Could not load users:', err);
    return [];
  }
}

/**
 * Live-subscribe to every OTHER real, registered user so two independently
 * signed-in people can discover and see each other (no shared/default demo
 * account involved). Calls `callback` with the full current list on every
 * change. If the listener errors (e.g. the login was not restored yet) it is
 * re-created automatically instead of staying dead.
 */
export function subscribeToRealProfiles(
  myUid: string,
  callback: (profiles: Profile[]) => void
): () => void {
  if (!isFirebaseConfigured || !myUid) return () => {};

  let stopped = false;
  let unsubscribe: (() => void) | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let attempts = 0;

  const start = () => {
    if (stopped) return;
    unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        attempts = 0;
        const list: Profile[] = [];
        snapshot.forEach((docSnap) => {
          if (docSnap.id === myUid) return;
          const p = docToProfile(docSnap.id, docSnap.data());
          if (p) list.push(p);
        });
        callback(list);
      },
      (err) => {
        console.warn('[MIORA realtime] Profile subscription error:', err);
        if (stopped || attempts >= 6) return;
        attempts += 1;
        retryTimer = setTimeout(start, Math.min(1500 * attempts, 8000));
      }
    );
  };
  start();

  return () => {
    stopped = true;
    if (retryTimer) clearTimeout(retryTimer);
    if (unsubscribe) unsubscribe();
  };
}

/** Live-subscribe to every message addressed TO this user, across all chats —
 *  used to detect brand-new incoming conversations the recipient hasn't opened yet. */
export function subscribeToInboundMessages(
  myUid: string,
  callback: (messages: Message[]) => void
): () => void {
  if (!isFirebaseConfigured || !myUid) return () => {};
  const q = query(collection(db, 'messages'), where('recipientId', '==', myUid));
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
      callback(msgs);
    },
    (err) => console.warn('[MIORA realtime] Inbound message subscription error:', err)
  );
  return unsubscribe;
}


/** Mark every incoming message in an open real chat as seen. */
export async function markRealMessagesAsRead(chatId: string, myUid: string): Promise<void> {
  if (!isFirebaseConfigured || !chatId || !myUid) return;
  // Keep this to a single-field query so no composite Firestore index is required.
  const q = query(collection(db, 'messages'), where('recipientId', '==', myUid));
  const snapshot = await getDocs(q);
  await Promise.all(
    snapshot.docs
      .filter((d) => d.data()?.matchId === chatId && d.data()?.read !== true)
      .map((d) => updateDoc(d.ref, { read: true }))
  );
}

/** Delete a message sent by the current user. Firestore rules enforce ownership. */
export async function deleteRealMessage(messageId: string): Promise<void> {
  if (!isFirebaseConfigured || !messageId) return;
  await deleteDoc(doc(db, 'messages', messageId));
}

/** Send a real, persisted message between two real accounts. */
export async function sendRealMessage(
  chatId: string,
  senderId: string,
  recipientId: string,
  text: string,
  type: MessageType = 'text',
  metadata?: Message['metadata']
): Promise<Message | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(collection(db, 'messages'), {
    matchId: chatId,
    senderId,
    recipientId,
    text,
    // `timestamp` stays a friendly display string (matches the rest of the app's
    // chat bubbles, which render it verbatim); `sortKey` is what real-time
    // ordering actually relies on, since display strings aren't reliably sortable.
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sortKey: Date.now(),
    read: false,
    type,
    ...(metadata ? { metadata } : {})
  });
  return {
    id: ref.id, matchId: chatId, senderId, recipientId, text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sortKey: Date.now(), read: false, type, ...(metadata ? { metadata } : {})
  };
}

/**
 * Subscribe to every persisted message that belongs to this user and reduce it
 * to one conversation preview per other user. This makes the chat list behave
 * like Instagram/WhatsApp: newest message moves that conversation to the top.
 */
export function subscribeToChatThreads(
  myUid: string,
  callback: (threads: Array<{ chatId: string; otherUid: string; lastMessage: Message; unreadCount: number }>) => void
): () => void {
  if (!isFirebaseConfigured || !myUid) return () => {};
  const mine = query(collection(db, 'messages'), where('senderId', '==', myUid));
  const inbound = query(collection(db, 'messages'), where('recipientId', '==', myUid));
  let sent: Message[] = [];
  let received: Message[] = [];
  let done = false;
  const emit = () => {
    const byChat = new Map<string, { messages: Message[]; otherUid: string }>();
    [...sent, ...received].forEach((m) => {
      const otherUid = m.senderId === myUid ? (m.recipientId || '') : m.senderId;
      if (!otherUid) return;
      const existing = byChat.get(m.matchId) || { messages: [], otherUid };
      existing.messages.push(m);
      byChat.set(m.matchId, existing);
    });
    const threads = [...byChat.entries()].map(([chatId, value]) => {
      value.messages.sort((a, b) => (b.sortKey || 0) - (a.sortKey || 0));
      const lastMessage = value.messages[0];
      return {
        chatId,
        otherUid: value.otherUid,
        lastMessage,
        unreadCount: value.messages.filter((m) => m.recipientId === myUid && !m.read).length
      };
    }).sort((a, b) => (b.lastMessage.sortKey || 0) - (a.lastMessage.sortKey || 0));
    callback(threads);
  };
  const unsubSent = onSnapshot(mine, (snap) => {
    sent = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
    emit();
  }, (e) => console.warn('[MIORA chat] Sent-message listener error', e));
  const unsubReceived = onSnapshot(inbound, (snap) => {
    received = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
    emit();
  }, (e) => console.warn('[MIORA chat] Received-message listener error', e));
  return () => {
    if (done) return;
    done = true;
    unsubSent();
    unsubReceived();
  };
}
