/**
 * Grants (or revokes) the `admin: true` custom claim that server/src/middleware/adminAuth.ts
 * requires for every /api/admin/* route.
 *
 * Usage (from the server/ folder, with your .env / firebase-service-account.json in place):
 *   npm run grant-admin -- someone@example.com
 *   npm run grant-admin -- someone@example.com --revoke
 *
 * After running this, the person must sign out and back in to the admin-client
 * (or call `user.getIdToken(true)`) — the claim only appears in a freshly
 * minted ID token.
 */
import dotenv from 'dotenv';
dotenv.config();

import { getAdminAuth } from '../lib/firebaseAdmin';

async function main() {
  const args = process.argv.slice(2);
  const email = args.find((a) => !a.startsWith('--'));
  const revoke = args.includes('--revoke');

  if (!email) {
    console.error('Usage: npm run grant-admin -- someone@example.com [--revoke]');
    process.exit(1);
  }

  const auth = getAdminAuth();
  const user = await auth.getUserByEmail(email);
  const existingClaims = user.customClaims || {};

  await auth.setCustomUserClaims(user.uid, { ...existingClaims, admin: revoke ? false : true });

  console.log(
    revoke
      ? `✅ Revoked admin access for ${email} (uid: ${user.uid})`
      : `✅ Granted admin access to ${email} (uid: ${user.uid})`
  );
  console.log('They must sign out and back in to the admin panel for this to take effect.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Failed to update admin claim:', err.message || err);
  process.exit(1);
});
