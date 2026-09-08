import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut
} from 'firebase/auth';

/**
 * MIORA Firebase Authentication Service
 * Implements real Firebase Email + Password authentication,
 * session management, and Firebase ID Token retrieval for Spring Boot API calls.
 */
export const authService = {
  authInstance: auth,
  isConfigured: isFirebaseConfigured,

  /**
   * Get the current authenticated Firebase user
   */
  getCurrentUser(): User | null {
    return auth.currentUser;
  },

  /**
   * Retrieve the current user's Firebase ID Token (JWT)
   * This token is passed in the Authorization: Bearer header to Spring Boot
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = auth.currentUser;
    if (user) {
      try {
        return await user.getIdToken(forceRefresh);
      } catch (err) {
        console.warn('Failed to retrieve Firebase ID token:', err);
      }
    }

    // Fallback token for offline / local mock development if Firebase is not yet configured
    const localUserRaw = localStorage.getItem('miora_auth_token');
    return localUserRaw || 'dev_mock_firebase_id_token';
  },

  /**
   * Sign in with Email and Password
   */
  async signInWithEmail(email: string, pass: string): Promise<User | null> {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('miora_auth_token', token);
        return userCredential.user;
      } catch (err: any) {
        console.error('Firebase signInWithEmailAndPassword error:', err);
        throw err;
      }
    }

    // Local dev mock mode
    const mockToken = `mock_token_${btoa(email)}`;
    localStorage.setItem('miora_auth_token', mockToken);
    return null;
  },

  /**
   * Sign up with Email and Password
   */
  async signUpWithEmail(email: string, pass: string, displayName?: string): Promise<User | null> {
    if (isFirebaseConfigured && auth) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        if (displayName && userCredential.user) {
          await updateProfile(userCredential.user, { displayName });
        }
        const token = await userCredential.user.getIdToken();
        localStorage.setItem('miora_auth_token', token);
        return userCredential.user;
      } catch (err: any) {
        console.error('Firebase createUserWithEmailAndPassword error:', err);
        throw err;
      }
    }

    // Local dev mock mode
    const mockToken = `mock_token_${btoa(email)}`;
    localStorage.setItem('miora_auth_token', mockToken);
    return null;
  },

  /**
   * Subscribe to Firebase authentication state changes
   */
  subscribeToAuthChanges(callback: (user: User | null) => void) {
    if (isFirebaseConfigured && auth) {
      return onAuthStateChanged(auth, callback);
    }
    return () => {};
  },

  /**
   * Sign out current Firebase user
   */
  async signOut(): Promise<void> {
    localStorage.removeItem('miora_auth_token');
    if (isFirebaseConfigured && auth) {
      await firebaseSignOut(auth);
    }
  }
};

export { auth };
export default authService;
