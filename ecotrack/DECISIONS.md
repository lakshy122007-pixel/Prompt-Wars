# Architectural Design Decisions (DECISIONS.md)

This document outlines key technical decisions, stubbing strategies, and patterns used throughout the EcoTrack development process.

---

## 1. Monorepo Configuration (NPM Workspaces)
*   **Decision**: We structure the project as an NPM Workspaces monorepo.
*   **Reasoning**: This allows us to maintain a shared package (`@ecotrack/shared`) containing validation schemas (Zod) and calculations logic (emissions calculator and tips engine). This guarantees that client-side instant carbon previews match server-side Cloud Function computations 100% of the time, avoiding logic drift.

---

## 2. API Integrations & Emulator Stubbing Strategy

For local running and sandbox testing, we stub out external APIs behind clean service interfaces:

### 2.1 Firebase Authentication & Firestore
*   **Decision**: Fully live-wired to local Firebase Emulator Suite (ports 9099 and 8080).
*   **Reasoning**: This allows full integration testing of Auth states, Firestore security rules, and functions triggers without hitting production billing quotas or requiring real auth credentials.

### 2.2 Google Maps, Places, & Distance Matrix API
*   **Decision**: Stubbed with a clean local interface fallback in `src/services/mapsService.ts`.
*   **Reasoning**: If a user does not supply `VITE_GOOGLE_MAPS_API_KEY`, the Maps page falls back to mock location data (recycling centers, EV chargers, transit stops, and farmers markets near Seattle, WA / San Francisco, CA) and mock distance matrix computations. If the key is provided, it dynamically registers the Google Maps script tag. This ensures the app is fully executable in any sandbox out-of-the-box.

### 2.3 Google reCAPTCHA v3
*   **Decision**: Bypass checks in local emulation mode, verify score in production.
*   **Reasoning**: The frontend requests a mock token under local configurations, and the `createAccount` Cloud Function skips the `fetch` verification if `FUNCTIONS_EMULATOR` is true or if `RECAPTCHA_SECRET` is omitted.

### 2.4 email/Weekly Digest (Gmail API & Trigger Email)
*   **Decision**: Log email body outputs to functions standard console logs, and write to a Firestore `mail` collection.
*   **Reasoning**: Writing to `mail` collection makes it drop-in compatible with the Firebase "Trigger Email" extension, while logging the generated text satisfies sandbox verification.

---

## 3. Data Aggregations Strategy
*   **Decision**: Rollups are stored in `dailySummaries`, `weeklySummaries`, and `monthlySummaries` collections.
*   **Reasoning**: Calculating sums of hundreds of raw activity documents on-the-fly when loading the trends page leads to high Firestore read costs and slow load times. Instead, writes trigger an immediate incremental update to the day's summary. Nightly Scheduled Cloud Functions serve as a backup to synchronize summaries and roll them up into weekly/monthly buckets, making trend views instantaneous.
