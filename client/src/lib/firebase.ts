import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * MIORA Firebase Web App Configuration
 * Reads from Vite environment variables (VITE_FIREBASE_...)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

/**
 * Helper to check if Firebase configuration environment variables are provided
 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Initialize Firebase App (singleton pattern to prevent duplicate app initialization)
let app: FirebaseApp;
if (!getApps().length) {
  // Use fallback dummy identifiers if env is empty during early development/setup to prevent runtime crash
  const activeConfig = isFirebaseConfigured
    ? firebaseConfig
    : {
        apiKey: 'demo-api-key',
        authDomain: 'miora-demo.firebaseapp.com',
        projectId: 'miora-demo',
        storageBucket: 'miora-demo.appspot.com',
        messagingSenderId: '123456789',
        appId: '1:123456789:web:abcdef123456'
      };

  app = initializeApp(activeConfig);
} else {
  app = getApp();
}

// Initialize modular Firebase Services
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

if (import.meta.env.DEV) {
  if (isFirebaseConfigured) {
    console.log('🔥 [MIORA] Firebase initialized successfully with project:', firebaseConfig.projectId);
  } else {
    console.info('🔥 [MIORA] Firebase initialized in local dev mode. Add your Firebase credentials in .env.local when ready.');
  }
}

export { app, auth, db, storage };
export default app;
