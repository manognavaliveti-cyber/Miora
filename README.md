# MIORA — Meet. Match. Belong. 💖

> A modern, romantic dating application MVP built with **React**, **TypeScript**, **Vite**, **Modern CSS**, and **Node.js + Express**.

---

## 🚀 Quick Start Guide

### 1. Install All Dependencies
Open your terminal in the project root folder (`e:\MIORA`) and run:

```bash
npm run install:all
```
*(Or install each folder individually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

### 2. Start the Application
Run both the backend API and frontend client concurrently:

```bash
npm run dev
```

### 3. Open in Your Browser
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📁 Project Structure

```
MIORA/
├── client/                     # Frontend Application (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/         # Reusable UI widgets
│   │   │   ├── common/         # Buttons, inputs, modals, toasts
│   │   │   ├── discover/       # SwipeCard (gesture physics), ActionButtons
│   │   │   ├── matches/        # MutualMatch celebration modal, Match stories
│   │   │   ├── chat/           # Chat bubbles, message input with quick reactions
│   │   │   ├── profile/        # 6-slot photo uploader, interest picker pills
│   │   │   ├── safety/         # Report modal & block management
│   │   │   └── layout/         # BottomNav, TopHeader, AppShell
│   │   ├── context/            # AppContext.tsx (Global state management)
│   │   ├── data/               # Seed profiles, preset images, interests, auto-replies
│   │   ├── pages/              # All 18 application screens
│   │   ├── services/           # api.ts (Centralized API client + local fallback)
│   │   ├── styles/             # Design tokens (blush pink, magenta gradients, variables)
│   │   ├── types/              # TypeScript interfaces
│   │   ├── App.tsx             # Root page router
│   │   └── main.tsx            # Entry point
│   ├── index.html              # Outfit & Plus Jakarta Sans typography
│   └── package.json
│
├── server/                     # Backend API (Node.js + Express + TypeScript)
│   ├── src/
│   │   ├── controllers/        # Profile, Match, Chat, User, Safety controllers
│   │   ├── routes/             # REST endpoints (/api/profiles, /api/matches, etc.)
│   │   ├── services/           # storeService.ts (In-memory repository layer)
│   │   ├── data/               # Seed profiles & mock chats
│   │   ├── middleware/         # CORS, logging, error handling
│   │   ├── types/              # Backend TypeScript types
│   │   └── server.ts           # Express server setup (Port 5000)
│   └── package.json
│
├── README.md                   # Beginner's documentation
└── package.json                # Root concurrently runner
```

---

## 🔍 Features & Data Architecture

### What Currently Uses In-Memory / Local Data (MVP):
1. **User Authentication & Session**: Simulated locally in `AppContext.tsx` and in-memory store.
2. **Discover Stack & Swiping**: Swiping right on profiles triggers likes with an 85% match chance simulation.
3. **Chat & Auto-Replies**: Messages sent appear immediately; simulated replies from matched profiles trigger after 1.3 seconds.
4. **Photos & Interests**: Photo selection uses high-resolution curated aesthetic presets and local preview state.
5. **Safety Actions**: Block and report actions update local lists immediately and filter out reported profiles.

---

## 🔮 Future Database Integration (PostgreSQL / Firebase)

When upgrading beyond the MVP:
| Feature | Future Service | Purpose |
|---|---|---|
| **User Accounts & Auth** | Firebase Auth / Supabase / JWT | Phone SMS OTP, Google OAuth, password hashing (bcrypt) |
| **User Profiles & Photos** | PostgreSQL + AWS S3 / Cloudinary | Storing full profile metadata and high-res user photo uploads |
| **Matches & Swipes** | PostgreSQL (`likes`, `passes`, `matches` tables) | Relational queries for mutual likes and geographical filtering (PostGIS) |
| **Real-time Chat** | WebSockets / Socket.io / Firebase Firestore | Live bi-directional chat delivery, push notifications, and read receipts |

---

## 🛠️ Files to Modify When Connecting Real Database

1. **`server/src/services/storeService.ts`**:
   - Replace in-memory arrays and Maps with Prisma or PostgreSQL queries (`prisma.user.findMany`, `prisma.match.create`).
2. **`server/src/routes/` & `server/src/controllers/`**:
   - Add auth middleware (`verifyJWT`) to authenticate incoming requests via bearer token.
3. **`client/src/services/api.ts`**:
   - Attach the auth token header (`Authorization: Bearer <token>`) to `fetchApi`.
4. **`.env`**:
   - Add database connection string (`DATABASE_URL=postgresql://...`) and JWT secret (`JWT_SECRET=...`).

---

## 🎨 Brand & Design Aesthetic

- **Primary Gradient**: Soft Blush to Deep Magenta (`#FF6584` ➔ `#E11D48` ➔ `#9D174D`)
- **Typography**: Display *Outfit* & Body *Plus Jakarta Sans*
- **Card Surfaces**: Crisp white cards with diffused rose shadows (`rgba(225, 29, 72, 0.08)`) and frosted glassmorphic navigation
