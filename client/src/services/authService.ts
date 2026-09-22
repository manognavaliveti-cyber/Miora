import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  getAdditionalUserInfo,
  signOut as firebaseSignOut,
  sendPasswordResetEmail
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
   * Firebase restores the saved login asynchronously after a page refresh, so
   * auth.currentUser is null for a moment. Wait for it before loading the profile,
   * otherwise the app loads a blank "guest" profile (wrong name, wallet, etc.).
   */
  waitForAuthReady(timeoutMs = 4000): Promise<User | null> {
    if (!isFirebaseConfigured || !auth) return Promise.resolve(null);
    if (auth.currentUser) return Promise.resolve(auth.currentUser);
    return new Promise((resolve) => {
      let done = false;
      let unsubscribe: (() => void) | undefined;
      const finish = (u: User | null) => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        if (unsubscribe) unsubscribe();
        resolve(u);
      };
      const timer = setTimeout(() => finish(auth.currentUser), timeoutMs);
      unsubscribe = onAuthStateChanged(auth, (u) => finish(u));
    });
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
   * Sign in or sign up with Google using Firebase OAuth popup.
   */
  async signInWithGoogle(): Promise<{ user: User; isNewUser: boolean } | null> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase Authentication is not configured.');
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem('miora_auth_token', token);

      const additionalUserInfo = getAdditionalUserInfo(userCredential);

      return {
        user: userCredential.user,
        isNewUser: Boolean(additionalUserInfo?.isNewUser)
      };
    } catch (err: any) {
      console.error('Firebase Google sign-in error:', err);
      throw err;
    }
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
  },

  /**
   * Send a real Firebase password-reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase Authentication is not configured.');
    }
    await sendPasswordResetEmail(auth, email);
  }
};

export { auth };
export default authService;
