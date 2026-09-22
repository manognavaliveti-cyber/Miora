// MIORA — Firebase Cloud Messaging Service Worker
// Handles push notifications received while the app is in the background or closed.
//
// Service workers can't read Vite's `import.meta.env`, so the Firebase config is
// passed in as URL query params at registration time (see notificationService.ts,
// which builds this URL from your existing VITE_FIREBASE_* env vars). You should
// NOT need to edit this file directly.

importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

const params = new URLSearchParams(self.location.search);

firebase.initializeApp({
  apiKey: params.get('apiKey') || '',
  authDomain: params.get('authDomain') || '',
  projectId: params.get('projectId') || '',
  storageBucket: params.get('storageBucket') || '',
  messagingSenderId: params.get('messagingSenderId') || '',
  appId: params.get('appId') || ''
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'MIORA';
  const body = payload?.notification?.body || 'You have a new notification.';

  self.registration.showNotification(title, {
    body,
    icon: '/images/icon-192.png',
    badge: '/images/icon-192.png',
    data: payload?.data || {}
  });
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
