const admin = require('./server/node_modules/firebase-admin');
const fs = require('fs');
const path = require('path');

const saPath = path.join(__dirname, 'server-springboot/src/main/resources/firebase-service-account.json');

async function auditProject(projectId, serviceAccountPath) {
  console.log(`\n========================================`);
  console.log(`AUDITING FIREBASE PROJECT: ${projectId}`);
  console.log(`========================================`);

  try {
    let app;
    if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
      const sa = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      app = admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: projectId
      }, projectId + '-' + Date.now());
    } else {
      app = admin.initializeApp({ projectId: projectId }, projectId + '-' + Date.now());
    }

    const db = admin.firestore(app);
    const auth = admin.auth(app);

    // Audit Auth users
    try {
      const userList = await auth.listUsers(100);
      console.log(`[AUTH] Total Registered Users: ${userList.users.length}`);
      userList.users.forEach((u, i) => {
        if (i < 10) console.log(` - User ${i+1}: ${u.email || u.uid} (Provider: ${u.providerData.map(p=>p.providerId).join(',')}, Created: ${u.metadata.creationTime})`);
      });
    } catch (e) {
      console.log(`[AUTH] Error fetching auth users: ${e.message}`);
    }

    // Audit Firestore Collections
    try {
      const collections = await db.listCollections();
      console.log(`[FIRESTORE] Collections (${collections.length}):`);
      for (const col of collections) {
        const snapshot = await col.get();
        console.log(` - Collection '${col.id}': ${snapshot.size} documents total`);
      }
    } catch (e) {
      console.log(`[FIRESTORE] Error fetching collections: ${e.message}`);
    }

  } catch (err) {
    console.error(`Audit failed for ${projectId}:`, err.message);
  }
}

async function main() {
  await auditProject('winged-precinct-484016-f3', saPath);
  process.exit(0);
}

main();
