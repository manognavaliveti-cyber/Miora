import { storage, isFirebaseConfigured } from '../lib/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  StorageReference
} from 'firebase/storage';

/**
 * MIORA Firebase Storage Service
 * Foundation layer for profile photos and media uploads.
 */
export const storageService = {
  storageInstance: storage,
  isConfigured: isFirebaseConfigured,

  /**
   * Helper to create a Storage Reference path
   */
  getStorageRef(path: string): StorageReference {
    return ref(storage, path);
  },

  /**
   * Helper to get download URL for a storage path
   */
  async getFileURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  }
};

export { storage };
export default storageService;
