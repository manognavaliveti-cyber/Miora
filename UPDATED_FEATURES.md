# MIORA updated chat/calls build

This update addresses the requested chat, call, filter, persistence, and responsive-layout behavior.

## Changes

- Chat messages are persisted and reloaded instead of being cleared on navigation/refresh.
- Real-user Firestore conversations are reconstructed from persisted messages.
- Chat list is ordered by most recent message, with unread counts.
- Last opened conversation is restored after a browser refresh while on `/chat`.
- Demo/mock conversations also reload their persisted local/API messages.
- Chat headers show the partner avatar/name and audio/video call controls.
- Desktop chat bubbles now include sender avatars.
- Audio/video calls now use Firestore signaling + WebRTC instead of a simulated 1.8-second answer.
- Incoming calls display an accept/decline modal.
- Audio uses the remote WebRTC audio stream; video uses remote video plus local picture-in-picture.
- Mute/camera controls operate on the real media tracks.
- Discovery filters (including lifestyle/intent controls) are functional without a premium-only click blocker.
- Responsive chat/call UI remains mobile and desktop friendly.

## Deploy

From the project root:

```cmd
cd client
npm install
npm run build
cd ..
firebase deploy --only hosting,firestore
```

The Firestore rules must be deployed because the WebRTC call signaling uses the new `calls` collection and its candidate subcollections.

## Browser permissions

For audio/video calls, allow microphone and camera access for the MIORA Hosting domain when the browser asks.

## Production WebRTC note

The included signaling uses public Google STUN servers. This is enough for many peer-to-peer connections, but a production service should add a TURN server for networks where direct peer-to-peer connectivity is blocked.


## v2 call and chat reliability fixes
- WebRTC signaling now always uses the authenticated Firebase UID, avoiding Firestore `permission-denied` errors caused by stale/backend profile IDs.
- Remote ICE candidates are queued until the remote SDP is installed, fixing a common connection race.
- Audio capture uses echo cancellation, noise suppression, and automatic gain control.
- Video calls mute the remote video element and play remote audio through a single audio element to avoid duplicate/echoed audio.
- Transient WebRTC `disconnected` states no longer immediately end calls; ICE restart is attempted.
- Incoming-call listener uses the Firebase UID and can show a browser notification when the tab is hidden and notification permission was already granted.
- Chat auto-scroll only follows the newest message while the user is near the bottom; manually scrolling upward is preserved.
- Desktop chat panes now use viewport-aware sizing and `min-height: 0` so the message area remains independently scrollable.
- Firestore call rules were tightened for the two authenticated participants.
- Optional TURN environment variables are supported for production networks where STUN-only WebRTC cannot establish a direct path.


### v3 mobile chat + video fix (Sep 20, 2026)
- Reworked the mobile Messages screen into a compact Instagram/WhatsApp-style inbox: avatar, online dot, name, latest message preview, time, unread dot, and latest-conversation-first ordering.
- Mobile inbox now shows conversation threads instead of the full match/profile card layout.
- Fixed a WebRTC React state race where audio and video tracks could arrive separately while the same MediaStream object was reused; remote video now receives a fresh MediaStream reference when tracks arrive.
- Kept the existing full-screen video call with local picture-in-picture and remote video as the main stage.
