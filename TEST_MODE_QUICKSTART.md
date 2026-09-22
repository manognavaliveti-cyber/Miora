# Get a real Razorpay test payment working — fastest path

This is the quick way: run everything on your own laptop, no deployment needed.
Real Razorpay test-mode checkout, real signature verification, real wallet credit
in Firestore — just not open to the public internet yet.

I built this into `server/` (plain Node/Express — just needs `npm install`, no
Java required). It listens on port 8080, which is exactly the address the client
already tries by default, so there's nothing to configure on the client side.

## 1. Get Razorpay test keys (2 min)
- Sign up free at [razorpay.com](https://razorpay.com)
- Dashboard → Settings → API Keys → **Generate Test Key**
- Copy the **Key ID** and **Key Secret**

## 2. Get your Firebase service account key (2 min)
- [Firebase Console](https://console.firebase.google.com) → your `miora-ea6a7` project
- ⚙️ Project Settings → Service Accounts tab → **Generate new private key**
- This downloads a `.json` file. Rename it to `firebase-service-account.json` and
  put it directly inside the `server/` folder (same level as `package.json`).

## 3. Configure the server
```
cd server
cp .env.example .env
```
Open `.env` and fill in:
```
RAZORPAY_KEY_ID=rzp_test_...        (from step 1)
RAZORPAY_KEY_SECRET=...             (from step 1)
FIREBASE_PROJECT_ID=miora-ea6a7
```
Leave `PORT=8080` as-is.

## 4. Run the backend
```
cd server
npm install
npm run dev
```
You should see `💖 MIORA Dating Server running on http://localhost:8080`.
Leave this terminal running.

## 5. Run the client (in a second terminal)
```
cd client
npm install
npm run dev
```
Open the printed `localhost` URL, sign in with a real account (Firebase Auth —
not a guest/demo session), and go to Wallet.

## 6. Pay
Tap any "Pay ₹__ with Razorpay" button. The real Razorpay checkout popup opens.
Use the official test card:
```
Card number: 4111 1111 1111 1111
Expiry:      any future date (e.g. 12/30)
CVV:         any 3 digits
Name:        anything
```
No real money moves. After "payment," your wallet balance should update
immediately in the app, and the credit is saved to `users/{yourUid}` in Firestore
— you can check it in the Firebase Console under Firestore Database.

## If something fails
- **"Missing Authorization bearer token"** → you're not actually signed in with a
  real Firebase account (check you're not in a guest/offline mode).
- **"RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set"** → `.env` wasn't filled in,
  or the server wasn't restarted after editing it.
- **"Firebase service account not found"** → the JSON file isn't at
  `server/firebase-service-account.json`, or the path in `.env` is wrong.
- **Checkout popup never opens** → open the browser console; usually a wrong Key ID.
- **Payment succeeds but balance doesn't change** → check the server terminal for
  the actual error message; it's printed there.

## Going live to real users later
Once this works locally, going live is: deploy this same `server/` folder (it
already works as-is, no code changes) to any Node host — Render, Railway, Fly.io —
set the same three env vars there, point the deployed client's `VITE_API_URL` at
that host's URL instead of localhost, switch Razorpay to Live keys once your
Razorpay account passes KYC, and redeploy. See `RAZORPAY_BACKEND_SETUP.md` for the
Spring Boot equivalent if you'd rather deploy that version instead — both now
implement the identical contract, use whichever you prefer.
