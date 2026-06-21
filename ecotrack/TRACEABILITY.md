# Traceability Matrix (TRACEABILITY.md)

This matrix maps each of the nine user requirements to its exact implementation in the codebase (routes, components, utilities, and backend functions).

| Req # | Requirement Description | Routes / Pages | Code Components & Utilities | Backend Services / Functions |
|---|---|---|---|---|
| **1** | Secure Sign Up / Login & Google OAuth | `/login`, `/signup`, `/forgot-password` | `EmailPasswordForm.tsx`, `GoogleSignInButton.tsx`, `authService.ts` | `createAccount` Cloud Function, Firebase Auth SDK |
| **2** | Log activities across 5 categories | `/log`, `/log/:category` | `ActivityLogForm.tsx`, `validationSchemas.ts` | `logActivity` Cloud Function, Firestore `activities` subcollection |
| **3** | CO2e estimation & summaries | `/dashboard`, `/log/:category` | `emissionCalculations.ts`, `emissionFactors.ts` | `calculateActivityCo2e` utility, `dailySummaries` collection |
| **4** | Visualize trends over time | `/trends` | `TrendsChart.tsx` (Google Charts) | `aggregateDailyTotals`, `aggregateWeeklyMonthly` |
| **5** | Personalized actionable tips | `/tips` | `tipsEngine.ts`, `tips.json` | `getTopCategory` & `selectTips` calculations |
| **6** | Nearby eco-locations map | `/map` | `GoogleMap.tsx`, `PlacesListView.tsx` | Google Places API, Geolocation API, `mapsService.ts` |
| **7** | Set goals & track progress | `/goals` | `GoalProgressBar.tsx`, `GoalForm.tsx` | `createGoal` Cloud Function, Firestore `goals` collection |
| **8** | Community leaderboard / opt-in | `/community` | `LeaderboardTable.tsx`, `OptInToggle.tsx` | `updateCommunityOptIn` Cloud Function, `community/leaderboard` |
| **9** | Export data & account deletion | `/settings`, `/settings/privacy` | `ExportButton.tsx`, `DeleteAccountModal.tsx` | `exportUserData`, `deleteUserAccount` Cloud Functions |
