# Quality Assurance & Testing Plan (TESTING.md)

This document contains instructions for executing all testing levels, the manual keyboard navigation checklist, and evidence of accessibility compliance.

---

## 1. Automated Test Suites

### 1.1 Unit Tests (Vitest)
Unit tests cover calculation precision, validator constraints, and tips ranking:
```bash
npm run test
```
*   `emissionCalculations.test.ts`: Asserts factor multiplication, negative bounds validation, and error throws on unknown subtypes.
*   `validationSchemas.test.ts`: Exercises Zod password strength checks, common password blockings, and category-level ceilings.
*   `tipsEngine.test.ts`: Verifies correct top category extraction and estimated savings sorting.
*   `dateUtils.test.ts`: Validates ISO week rollups and timezone limits.

### 1.2 Integration Tests (Firebase Rules & Functions Emulator)
Integration tests verify access control and server aggregations:
```bash
npm run test:integration
```
*   `firestore.rules.test.ts`: Asserts User A cannot read or write User B's documents, and only specific fields are writable on the community leaderboard.
*   `functions.test.ts`: Validates the server-side log, aggregation idempotency, and GDPR account deletion cascade.

### 1.3 End-to-End Tests (Playwright)
E2E tests simulate full user journeys:
```bash
npm run test:e2e
```
*   Verifies sign-up, activity logging, dashboard charts updates, goal progress bar rendering, community opt-in, data exports, and final deletion.

---

## 2. Accessibility & Keyboard Navigation (WCAG 2.1 AA)

### 2.1 Automated scans (`axe-core`)
Every route was scanned using `@axe-core/playwright` and Chrome DevTools Lighthouse to ensure **zero accessibility violations**:
*   All images and interactive SVGs contain appropriate `alt` tags or `aria-hidden` attributes.
*   Form elements have associated, visible `<label>` components.
*   Color contrast meets or exceeds the **4.5:1** ratio for normal text.

### 2.2 Manual Keyboard Navigation Pass Checklist
Test the full E2E flow with the mouse unplugged using the following keys:
*   `Tab` / `Shift+Tab`: Moves focus through interactive items in a logical order (left-to-right, top-to-bottom).
*   `Enter` / `Space`: Activates buttons, selects pickers, and submits forms.
*   `Arrow Keys`: Navigates select fields and chart range radio groups.

| Screen/Flow | Navigation Steps Verified | Result |
|---|---|---|
| `/` Landing Page | Focus skip-to-content -> CTA link. | Pass |
| `/login` | Email input -> password input -> submit button -> sign up link. | Pass |
| `/dashboard` | Navigate cards -> chart table alternative toggle -> floating log button. | Pass |
| `/log/transport` | Fields selection -> live preview updates -> submit activity. | Pass |
| `/map` | Tab focus on search bar -> list items direction links (No keyboard focus trap). | Pass |
| `/goals` | Navigate active list -> progressbar ARIA value indicators readable. | Pass |
| `/settings` | Opt-in toggles -> Export buttons -> Deletion confirm typed. | Pass |
