import { db, isFirebaseConfigured } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  DocumentData,
  CollectionReference,
  DocumentReference
} from 'firebase/firestore';

/**
 * MIORA Firestore Collections Enum/Constants
 */
export const COLLECTIONS = {
  USERS: 'users',
  MATCHES: 'matches',
  MESSAGES: 'messages',
  ROOMS: 'rooms',
  POSTS: 'posts',
  TRANSACTIONS: 'transactions'
} as const;

/**
 * MIORA Cloud Firestore Service
 * Foundation layer for Firestore database operations.
 */
export const firestoreService = {
  dbInstance: db,
  isConfigured: isFirebaseConfigured,

  /**
   * Helper to get typed Collection Reference
   */
  getCollection<T = DocumentData>(collectionName: string): CollectionReference<T> {
    return collection(db, collectionName) as CollectionReference<T>;
  },

  /**
   * Helper to get typed Document Reference
   */
  getDocument<T = DocumentData>(collectionName: string, documentId: string): DocumentReference<T> {
    return doc(db, collectionName, documentId) as DocumentReference<T>;
  }
};

export { db };
export default firestoreService;
