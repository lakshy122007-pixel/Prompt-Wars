# EcoTrack Privacy Policy & Compliance

At EcoTrack, we take user privacy and data security seriously. This document outlines our data privacy practices and compliance with the General Data Protection Regulation (GDPR) and other global privacy laws.

---

## 1. Core Privacy Controls (GDPR Alignment)

EcoTrack is built from the ground up to respect user autonomy and privacy. We implement three core pillars:

### 1.1 Analytics Consent Gating
*   **Default State**: Telemetry and usage analytics (GA4) are disabled by default.
*   **Consent Check**: When a user registers or navigates to Settings, they can explicitly opt in to analytics.
*   **Enforcement**: The Firebase Analytics library is only initialized *after* explicit client-side consent is saved. If revoked, analytics scripts are fully disabled.

### 1.2 Right to Portability (Data Export)
*   Users can request an export of all their personal data, logged activities, and active goals at any time.
*   Exports are generated in machine-readable **CSV** and **Plain Text/PDF** formats.
*   To prevent denial-of-service or API scraping, exports are rate-limited to **3 per hour per user**, managed server-side.

### 1.3 Right to Erasure (Cascading Deletion)
*   Users have a self-service way to permanently delete their account.
*   **Verification**: Deletion requires typing the confirmation phrase `"DELETE MY ACCOUNT"` to prevent accidental clicks.
*   **Cascade Effect**: Deletion triggers a transactional Firebase Function that cascades through all user sub-collections (`activities`, `goals`, `dailySummaries`, `weeklySummaries`, `monthlySummaries`), deletes any files uploaded to Firebase Storage under the user's directory (`users/{uid}/`), and removes the Firebase Authentication credentials.
*   **Auditing**: We record a SHA-256 hash of the deleted `uid` for security auditing. No PII (names, emails, active data) is preserved.

---

## 2. Anonymized Community Leaderboard

To reduce shame and competition pressure, the community leaderboard operates under strict privacy protections:
*   **Opt-in Only**: Users are hidden from the leaderboard by default. They must explicitly toggle opt-in and choose a distinct community display handle.
*   **Zero Leakage**: No real name, email address, or exact carbon emissions totals are published to the leaderboard document. Only the user's selected handle, updated timestamp, and relative percentile rank are exposed.
*   **Opt-out Removal**: If a user opts out, their leaderboard member document is immediately and permanently deleted.
