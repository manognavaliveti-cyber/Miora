# MIORA Admin Dashboard — Updated

The admin dashboard now includes:

- Total Profiles / registered Firebase accounts
- Users Who Logged In (accounts with a recorded Firebase last sign-in)
- Active Accounts
- Total Revenue from successful Razorpay transactions
- Today's Revenue (IST)
- VIP Subscriptions
- Pro Subscriptions (the existing Gold tier is shown as Pro in the dashboard)
- Total successful transactions
- 7-day revenue line graph
- Recent registration, login and payment activity
- Pricing Settings for chat, audio calls and video calls

## Pricing controls

Admin → **Pricing Settings** can change:

- Chat ₹ per minute
- Audio call coins per minute
- Video call coins per minute

The values are saved to Firestore at `app_settings/pricing` through the protected admin API. The client loads them from `/api/pricing` at startup.

The audio/video package amounts are recalculated from the configured per-minute rate while preserving each package's existing discount percentage.

## Local test

Backend:

```cmd
cd server
npm install
npm run dev
```

Frontend in a second terminal:

```cmd
cd client
npm install
npm run dev
```

Open `http://localhost:5173`, sign in with the administrator account, and open **Overview**.

## Production deployment order

1. Deploy the Node/Express backend to a public HTTPS host (Cloud Run, Render, Railway, etc.).
2. Set these backend environment variables on the host:
   - `FIREBASE_PROJECT_ID=winged-precinct-484016-f3`
   - `FIREBASE_SERVICE_ACCOUNT_JSON=<service account JSON>`
   - `RAZORPAY_KEY_ID=<test/live key>`
   - `RAZORPAY_KEY_SECRET=<test/live secret>`
   - `PORT` is normally supplied by the host.
3. Set the frontend `VITE_API_URL` to the public backend URL before building the client. Do not leave it as localhost.
4. Build the frontend with `npm run build` inside `client`.
5. Deploy `client/dist` to Firebase Hosting with `firebase deploy --only hosting`.

Never put the Firebase service-account JSON or Razorpay secret in the frontend `.env.local`.
