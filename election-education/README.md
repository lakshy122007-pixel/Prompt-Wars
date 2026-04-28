# Election Education App

## 🧪 Testing

| Type | Command | Coverage |
|------|---------|----------|
| Unit Tests | `npm run test:unit` | ≥85% |
| Integration Tests | `npm run test:integration` | ≥80% |
| E2E Tests (Playwright) | `npm run test:e2e` | 5 browsers |
| Full Suite + Coverage | `npm run test:all` | ≥80% |

CI automatically runs all test suites on every push via GitHub Actions.

## ☁️ Google Cloud Services

| Service | Usage | Where |
|---------|-------|-------|
| Gemini 2.0 Flash | AI election assistant | Cloud Function + Vertex AI |
| Google Maps API | Polling station locator | Frontend + Server |
| Google Cloud Translate | 22 Indian languages | Cloud Function |
| Google Cloud TTS | Text-to-speech | Cloud Function |
| Firebase Auth | Secure authentication | Full stack |
| Firebase Firestore | Real-time database | Full stack |
| Firebase Analytics | User behavior | Frontend |
| Firebase Cloud Functions | Serverless backend | Backend |
| BigQuery | Analytics & insights | Cloud Function + Script |
| Vertex AI | Grounded responses | Server |
