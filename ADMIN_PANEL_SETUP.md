# MIORA Admin Panel Setup

## 1. Admin frontend

Open CMD in `admin-client`:

```cmd
npm install
npm run dev
```

Open the Vite URL shown in CMD.

The admin frontend is configured to use the same Firebase project as the MIORA user app: `winged-precinct-484016-f3`.

## 2. Admin Firebase account

Create the admin account in Firebase Authentication with the email you want to use. The password can be `flipflex@123` if that is the password you choose. Do not hard-code the password in the frontend.

## 3. Give the account the admin claim

The backend requires the Firebase custom claim `admin: true`. Configure the server with a Firebase Admin service account, then from the `server` folder run:

```cmd
npm install
npm run grant-admin -- Radha@gmail.com
```

After granting the claim, sign out of the admin portal and sign in again.

## 4. Start the backend

The admin dashboard calls the Express API at `http://localhost:8080/api` by default. Start it in a second CMD window:

```cmd
cd server
npm install
npm run dev
```

The server needs `FIREBASE_PROJECT_ID=winged-precinct-484016-f3` and a Firebase Admin service account, either as `server/firebase-service-account.json` or `FIREBASE_SERVICE_ACCOUNT_JSON`.

## 5. Important

The Firebase Web API key in `admin-client/.env.local` is the same web-app configuration used by the MIORA client. It is not the Firebase Admin service-account private key. Never put the service-account JSON or Razorpay secret in the frontend.
