import { db, auth, isFirebaseConfigured } from '../lib/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';

const turnUrls = (import.meta.env.VITE_TURN_URLS || '').split(',').map((v: string) => v.trim()).filter(Boolean);
const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    ...(turnUrls.length && import.meta.env.VITE_TURN_USERNAME && import.meta.env.VITE_TURN_CREDENTIAL
      ? [{ urls: turnUrls, username: import.meta.env.VITE_TURN_USERNAME, credential: import.meta.env.VITE_TURN_CREDENTIAL }]
      : [])
  ]
};

export interface SignalingCall {
  id: string;
  callerId: string;
  calleeId: string;
  type: 'audio' | 'video';
  status: 'ringing' | 'connected' | 'ended' | 'rejected';
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
}

export class WebRTCCall {
  private pc: RTCPeerConnection;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream;
  private unsubCall: (() => void) | null = null;
  private unsubLocalCandidates: (() => void) | null = null;
  private unsubRemoteCandidates: (() => void) | null = null;
  private remoteCandidateIds = new Set<string>();
  private pendingRemoteCandidates: RTCIceCandidateInit[] = [];
  private remoteDescriptionSet = false;

  constructor(
    private callId: string,
    private myUid: string,
    private otherUid: string,
    private caller: boolean,
    private type: 'audio' | 'video',
    private onRemoteStream: (stream: MediaStream) => void,
    private onConnected: () => void,
    private onEnded: () => void
  ) {
    this.pc = new RTCPeerConnection(RTC_CONFIG);
    this.pc.onicecandidateerror = (event) => console.warn('[MIORA call] ICE candidate error', event);
    this.pc.oniceconnectionstatechange = () => console.info('[MIORA call] ICE state:', this.pc.iceConnectionState);
    this.remoteStream = new MediaStream();
    this.pc.ontrack = (event) => {
      const incomingTracks = event.streams[0]?.getTracks() || [event.track];
      incomingTracks.forEach((track) => {
        if (!this.remoteStream.getTracks().some((t) => t.id === track.id)) {
          this.remoteStream.addTrack(track);
        }
      });
      // Important: send a NEW MediaStream reference on every track arrival.
      // Browsers can deliver audio and video tracks separately; mutating the same
      // MediaStream object can leave React unaware that the video track arrived.
      this.onRemoteStream(new MediaStream(this.remoteStream.getTracks()));
    };
    this.pc.onconnectionstatechange = () => {
      if (this.pc.connectionState === 'connected') this.onConnected();
      if (['failed', 'closed'].includes(this.pc.connectionState)) this.onEnded();
      if (this.pc.connectionState === 'disconnected') {
        window.setTimeout(() => {
          if (['disconnected', 'failed'].includes(this.pc.connectionState)) this.pc.restartIce?.();
        }, 1500);
      }
    };
  }

  private async getLocalMedia() {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('This browser does not support camera/microphone access.');
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      video: this.type === 'video' ? { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } : false
    });
    this.localStream.getTracks().forEach((track) => this.pc.addTrack(track, this.localStream!));
    return this.localStream;
  }

  private candidateCollection(side: 'caller' | 'callee') {
    return collection(db, 'calls', this.callId, `${side}Candidates`);
  }

  private watchCandidates(side: 'caller' | 'callee') {
    this.unsubRemoteCandidates?.();
    const q = query(this.candidateCollection(side), orderBy('createdAt', 'asc'));
    this.unsubRemoteCandidates = onSnapshot(q, async (snap) => {
      for (const d of snap.docs) {
        if (this.remoteCandidateIds.has(d.id)) continue;
        this.remoteCandidateIds.add(d.id);
        const c = d.data();
        try {
          const candidate = c.candidate as RTCIceCandidateInit;
          if (!this.remoteDescriptionSet) {
            this.pendingRemoteCandidates.push(candidate);
          } else {
            await this.pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
        } catch (e) {
          console.warn('[MIORA call] ICE candidate skipped', e);
        }
      }
    });
  }

  private startLocalCandidateWriter(side: 'caller' | 'callee') {
    this.pc.onicecandidate = async (event) => {
      if (!event.candidate) return;
      try {
        await addDoc(this.candidateCollection(side), {
          candidate: event.candidate.toJSON(),
          createdAt: Date.now(),
          ownerId: this.myUid
        });
      } catch (e) {
        console.warn('[MIORA call] ICE candidate write failed', e);
      }
    };
  }

  async start() {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
    const firebaseUid = auth.currentUser?.uid;
    if (!firebaseUid) throw new Error('Your Firebase login session is not ready. Please sign in again.');
    if (firebaseUid !== this.myUid) {
      console.warn('[MIORA call] Using Firebase UID for signaling instead of stale profile id.');
      this.myUid = firebaseUid;
    }
    await this.getLocalMedia();
    this.startLocalCandidateWriter('caller');
    this.watchCandidates('callee');
    const offer = await this.pc.createOffer();
    await this.pc.setLocalDescription(offer);
    await setDoc(doc(db, 'calls', this.callId), {
      callerId: this.myUid,
      calleeId: this.otherUid,
      type: this.type,
      status: 'ringing',
      offer: { type: offer.type, sdp: offer.sdp },
      createdAt: Date.now()
    }, { merge: true });
    this.watchCallDocument();
  }

  async answer() {
    if (!isFirebaseConfigured) throw new Error('Firebase is not configured.');
    const firebaseUid = auth.currentUser?.uid;
    if (!firebaseUid) throw new Error('Your Firebase login session is not ready. Please sign in again.');
    if (firebaseUid !== this.myUid) this.myUid = firebaseUid;
    const snap = await getDoc(doc(db, 'calls', this.callId));
    if (!snap.exists()) throw new Error('Call no longer exists.');
    const data = snap.data() as SignalingCall;
    await this.getLocalMedia();
    this.startLocalCandidateWriter('callee');
    this.watchCandidates('caller');
    await this.pc.setRemoteDescription(new RTCSessionDescription(data.offer!));
    this.remoteDescriptionSet = true;
    for (const candidate of this.pendingRemoteCandidates.splice(0)) {
      try { await this.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.warn('[MIORA call] queued ICE candidate skipped', e); }
    }
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);
    await updateDoc(doc(db, 'calls', this.callId), {
      answer: { type: answer.type, sdp: answer.sdp },
      status: 'connected'
    });
    this.watchCallDocument();
  }

  private watchCallDocument() {
    this.unsubCall?.();
    this.unsubCall = onSnapshot(doc(db, 'calls', this.callId), async (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as SignalingCall;
      if (this.caller && data.answer && !this.pc.currentRemoteDescription) {
        try {
          await this.pc.setRemoteDescription(new RTCSessionDescription(data.answer));
          this.remoteDescriptionSet = true;
          for (const candidate of this.pendingRemoteCandidates.splice(0)) {
            try { await this.pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.warn('[MIORA call] queued ICE candidate skipped', e); }
          }
        } catch (e) {
          console.warn('[MIORA call] Could not set answer', e);
        }
      }
      if (data.status === 'ended' || data.status === 'rejected') this.onEnded();
    });
  }

  getLocalStream() { return this.localStream; }
  getRemoteStream() { return this.remoteStream; }

  async end(status: 'ended' | 'rejected' = 'ended') {
    try { await updateDoc(doc(db, 'calls', this.callId), { status }); } catch { /* peer may already be gone */ }
    this.cleanup();
  }

  cleanup() {
    this.unsubCall?.();
    this.unsubLocalCandidates?.();
    this.unsubRemoteCandidates?.();
    this.pc.onicecandidate = null;
    this.pc.close();
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.localStream = null;
  }
}

export async function updateSignalingCallStatus(callId: string, status: 'ended' | 'rejected') {
  try { await updateDoc(doc(db, 'calls', callId), { status }); } catch (e) { console.warn('[MIORA call] status update failed', e); }
}

export function subscribeToIncomingCalls(
  myUid: string,
  callback: (calls: SignalingCall[]) => void
) {
  if (!isFirebaseConfigured || !myUid) return () => {};
  const q = query(collection(db, 'calls'), where('calleeId', '==', myUid));
  return onSnapshot(q, (snap) => {
    const now = Date.now();
    const calls = snap.docs
      .map((d) => ({ id: d.id, ...d.data() } as SignalingCall))
      .filter((c) => c.calleeId === myUid && c.status === 'ringing' && now - Number((c as any).createdAt || now) < 120000);
    callback(calls);
  }, (err) => console.warn('[MIORA call] incoming call listener error', err));
}
