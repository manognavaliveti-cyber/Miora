// MIORA — Push Notification Registration (Firebase Cloud Messaging)
//
// Call `registerForPushNotifications()` once after a successful login/signup.
// It is entirely best-effort: on unsupported browsers, denied permission, or
// missing VAPID key, it silently no-ops rather than throwing — a rejected
// notification permission should never break the app.
//
// Setup required before this does anything real:
//   1. In the Firebase Console: Project Settings → Cloud Messaging → generate
//      a "Web Push certificate" (this is your VAPID key).
//   2. Add it to client/.env.local as VITE_FIREBASE_VAPID_KEY=...
//   3. Make sure your other VITE_FIREBASE_* vars are also set (see .env.example).

import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { app, isFirebaseConfigured } from '../lib/firebase';
import { apiService } from './api';

let messagingInstance: Messaging | null = null;

function buildServiceWorkerUrl(): string {
  const params = new URLSearchParams({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
  });
  return `/firebase-messaging-sw.js?${params.toString()}`;
}

/**
 * Requests notification permission, registers the FCM service worker, retrieves
 * the device token, and saves it to the user's profile on the backend.
 * Returns the token on success, or null if anything along the way isn't available.
 */
export async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (!isFirebaseConfigured) {
      console.info('[MIORA] Skipping push notification setup — Firebase env vars not configured.');
      return null;
    }
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.info('[MIORA] Skipping push notification setup — VITE_FIREBASE_VAPID_KEY is not set.');
      return null;
    }
    if (!('serviceWorker' in navigator) || !(await isSupported())) {
      console.info('[MIORA] Push notifications are not supported in this browser.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.info('[MIORA] Notification permission not granted:', permission);
      return null;
    }

    const registration = await navigator.serviceWorker.register(buildServiceWorkerUrl());

    if (!messagingInstance) {
      messagingInstance = getMessaging(app);
    }

    const token = await getToken(messagingInstance, {
      vapidKey,
      serviceWorkerRegistration: registration
    });

    if (!token) {
      console.info('[MIORA] Could not retrieve FCM token.');
      return null;
    }

    // Save the token to the backend so it can target this device later.
    await apiService.updateCurrentUser({ fcmToken: token });

    return token;
  } catch (err) {
    // Never let push notification setup break the app.
    console.warn('[MIORA] Push notification registration failed (non-fatal):', err);
    return null;
  }
}

/**
 * Listens for messages that arrive while the app is open/foregrounded.
 * Pass in a callback (e.g. your app's toast function) to surface them in-app,
 * since the browser won't show a native notification for foreground messages.
 */
export function listenForForegroundMessages(onMessageReceived: (title: string, body: string) => void): void {
  if (!isFirebaseConfigured || !import.meta.env.VITE_FIREBASE_VAPID_KEY) return;

  isSupported()
    .then((supported) => {
      if (!supported) return;
      if (!messagingInstance) {
        messagingInstance = getMessaging(app);
      }
      onMessage(messagingInstance, (payload) => {
        const title = payload.notification?.title || 'MIORA';
        const body = payload.notification?.body || '';
        onMessageReceived(title, body);
      });
    })
    .catch(() => {
      /* non-fatal */
    });
}
