const { execSync } = require('child_process');
const path = require('path');

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, '../../firebase-service-account.json');

try {
  console.log("Starting Firebase Hosting deployment...");
  const out = execSync('npx firebase-tools deploy --only hosting --project winged-precinct-484016-f3 --non-interactive', {
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf-8'
  });
  console.log(out);
} catch (err) {
  console.error("Deploy output:", err.stdout || err.stderr || err.message);
}
