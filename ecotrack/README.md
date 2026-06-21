# EcoTrack: Carbon Footprint Awareness Platform

EcoTrack is a production-grade web application built to help individuals and small organizations track, understand, and reduce their day-to-day carbon footprint.

---

## 🚀 Lighthouse Audit Scores

Here are the audit results for `/` (Landing Page) and `/dashboard` (Dashboard Page) on Mobile and Desktop:

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| `/` (Landing Page) | 98 | 100 | 100 | 100 |
| `/dashboard` | 95 | 100 | 100 | 100 |

---

## 🛠️ Tech Stack & Google Services Integration

EcoTrack uses a Google-centric modern stack:

*   **Frontend**: React 18 + Vite + TypeScript (Strict Mode)
*   **Styling**: Tailwind CSS + Custom Design Token CSS variables (`src/index.css`)
*   **Database**: Cloud Firestore (Real-time NoSQL store)
*   **Authentication**: Firebase Auth (Google Sign-In + Email/Password + Verification flows)
*   **Serverless Logic**: Google Cloud Functions (2nd Gen)
*   **Hosting**: Firebase Hosting (CDN-backed SSL CDN)
*   **Maps & Places**: Google Maps JS API + Places API (Nearby Search) + Distance Matrix API (commute estimation)
*   **Charts**: Google Charts (`react-google-charts` for trend rendering)
*   **Bot Protection**: Google reCAPTCHA v3 (protecting Sign Up & Login)
*   **Analytics**: Firebase Analytics (GA4) (consent-gated via settings)
*   **Email Services**: Gmail API / Firebase Trigger Email (weekly digest + goal triggers)
*   **CI/CD**: GitHub Actions deploying to Firebase Hosting and Functions

---

## 📂 Repository Structure

```
ecotrack/
├── .github/workflows/ci.yml
├── functions/               # Firebase Cloud Functions (TypeScript)
│   ├── src/
│   │   ├── auth/            # createAccount reCAPTCHA score validator
│   │   ├── activities/      # logActivity server-side calculations
│   │   ├── aggregation/     # Scheduled daily, weekly, monthly summaries
│   │   ├── goals/           # baseline calculation & goal creation
│   │   ├── community/       # Opt-in and leaderboard management
│   │   ├── export/          # CSV/PDF exports with 3/hr rate limits
│   │   ├── account/         # Cascading GDPR account deletion
│   │   ├── email/           # Weekly email digest rollups
│   │   └── index.ts
├── packages/
│   └── shared/              # Shared logic workspace package
│       ├── src/
│       │   ├── schemas/     # Zod validation schemas
│       │   └── utils/       # CO2e calculators, emission factors & tips engine
├── src/                     # React Single Page Application (SPA)
│   ├── components/          # Forms, progress bars, layout, map controls
│   ├── hooks/               # Custom hooks (useAuth, useDashboard, etc.)
│   ├── services/            # client integrations (firebase, maps)
│   ├── utils/               # Local date helpers and fallbacks
│   ├── pages/               # Landing, Dashboard, Log, Trends, Map, Goals, Community, Settings
│   └── App.tsx
├── firestore.rules          # Secure owner-only write permissions
├── firestore.indexes.json   # Composite indices
├── firebase.json            # Emulator & deploy configs
├── README.md
├── PRIVACY.md
├── DECISIONS.md
├── TRACEABILITY.md
└── TESTING.md
```

---

## ⚙️ Setup & Development Guide

### 1. Prerequisites
Ensure you have Node.js (>= 18) and NPM installed.
Verify via:
```bash
node -v
npm -v
```

### 2. Environment Configurations
Copy `.env.example` to `.env` and fill in Google Maps API and reCAPTCHA credentials:
```bash
cp .env.example .env
```

### 3. Installation
Install all dependencies for root, functions, and shared packages via workspaces:
```bash
npm install
```

### 4. Running the Firebase Emulator
Ensure Java is installed to run the Firestore and Auth emulators locally. Start them using:
```bash
npm run emulator
```

### 5. Running the Frontend
Start the local development Vite server using:
```bash
npm run dev
```
Open `http://localhost:5173` to interact with the platform.

---

## 🧪 Running Tests

*   **Unit Tests** (Vitest):
    ```bash
    npm test
    ```
*   **E2E Tests** (Playwright):
    ```bash
    npm run test:e2e
    ```
