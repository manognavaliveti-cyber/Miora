# Getting Razorpay "Pay" buttons actually working

## Why the Pay buttons don't work right now

Every "Pay" button in MIORA (wallet top-ups, MIORA Gold, MIORA VIP) already calls a
real, complete Razorpay integration — `client/src/services/payment.ts` — but that
code needs a **live backend** to:
1. Create a signed Razorpay order (needs your secret key — must never sit in the
   browser), and
2. Verify the payment signature and credit the wallet server-side (also needs the
   secret key, plus admin access to Firestore so a user can't just edit their own
   balance).

That backend already exists in this project at `server-springboot/` (Java/Spring
Boot) — it just isn't deployed anywhere, so every Pay button currently fails
silently trying to reach `http://localhost:8080` from your live site.

## What I fixed in this pass

- **Package ID mismatches**: several buttons (₹100 Wallet Credit, MIORA Gold,
  Add ₹1000, VIP Pack ₹2500) were sending an ID the backend didn't recognize, or
  worse, one that silently matched the *wrong* package/price. Every package ID in
  `server-springboot/.../RazorpayService.java` now matches
  `client/src/config/pricing.ts` exactly — 1:1, same price, same credit.
- **Wrong default Firebase project ID** in `application.properties` (was pointing
  at an unrelated project; now defaults to `miora-ea6a7`).
- **CORS defaults** now include your live domain, not just localhost.

## What you still need to do (I can't do this part from here)

I have no way to deploy a server or hold your business's real payment credentials —
this part is genuinely on you, once, and then it's done:

### 1. Get Razorpay keys
Sign up at [razorpay.com](https://razorpay.com), grab your **Key ID** and **Key
Secret** (Settings → API Keys). Start in Test Mode — the checkout already requests
UPI/card/netbanking/wallet test flows.

### 2. Get a Firebase service account key
Firebase Console → Project Settings → Service Accounts → **Generate new private
key**. This downloads a JSON file the backend uses to read/write Firestore as an
admin (bypassing the security rules that block direct client writes to wallet
balances — that's intentional and important).

### 3. Deploy the Spring Boot backend
It already has a `Dockerfile`, so any container host works. Render.com's free tier
is the simplest:
- New → Web Service → point at this repo's `server-springboot/` folder
- Environment variables to set:
  ```
  RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
  RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
  FIREBASE_PROJECT_ID=miora-ea6a7
  CORS_ALLOWED_ORIGINS=https://miora-ea6a7.web.app,https://miora-ea6a7.firebaseapp.com
  ```
- Upload the service account JSON as a secret file, and set
  `FIREBASE_SERVICE_ACCOUNT_PATH` to wherever the host mounts it (Render calls
  this a "Secret File").

### 4. Point the client at it
In `client/.env.local`, add:
```
VITE_API_URL=https://your-backend-name.onrender.com
```
Then rebuild and redeploy the client:
```
cd client
npm install
npm run build
cd ..
firebase deploy --only hosting
```

That's it — once `VITE_API_URL` resolves to a real, running backend with valid
Razorpay + Firebase credentials, every Pay button (wallet top-ups, Gold, VIP) will
create a real order, open the Razorpay checkout, and credit the wallet only after
the payment signature is cryptographically verified server-side.

## Testing before going live
Razorpay Test Mode accepts fake card `4111 1111 1111 1111`, any future expiry, any
CVV — no real money moves. Switch `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` to your
Live keys only once you've tested a full top-up and a subscription purchase.
