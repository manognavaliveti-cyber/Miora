import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

/**
 * MIORA Firebase Web App Configuration
 * Reads from Vite environment variables (VITE_FIREBASE_...)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBSgK-LoHzUqNA7oXJS9wPTFVF9nnRcZf8',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'winged-precinct-484016-f3.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'winged-precinct-484016-f3',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'winged-precinct-484016-f3.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '62279605444',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:62279605444:web:9993b4ff4e5ac32abdfd91'
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
  app = initializeApp(firebaseConfig);
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
