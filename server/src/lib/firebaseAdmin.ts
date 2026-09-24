import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let initialized = false;

/**
 * Initializes Firebase Admin exactly once, using (in order of preference):
 *   1. FIREBASE_SERVICE_ACCOUNT_JSON — the whole service account JSON as a string
 *      (handy for hosts like Render that support multi-line secret env vars).
 *   2. FIREBASE_SERVICE_ACCOUNT_PATH — a path to the downloaded service account file.
 *      Defaults to ./firebase-service-account.json in this folder.
 */
export function initFirebaseAdmin(): void {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return;
  }

  const inlineJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.join(__dirname, '../../firebase-service-account.json');

  let credential: admin.credential.Credential;

  if (inlineJson) {
    credential = admin.credential.cert(JSON.parse(inlineJson));
  } else if (fs.existsSync(filePath)) {
    credential = admin.credential.cert(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
  } else {
    throw new Error(
      `Firebase service account not found. Set FIREBASE_SERVICE_ACCOUNT_JSON, or place the ` +
      `downloaded key at "${filePath}" (see server/.env.example).`
    );
  }

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID || 'winged-precinct-484016-f3'
  });

  initialized = true;
}

export function getAdminAuth() {
  initFirebaseAdmin();
  return admin.auth();
}

export function getAdminFirestore() {
  initFirebaseAdmin();
  return admin.firestore();
}
