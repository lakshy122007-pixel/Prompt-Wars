// functions/src/index.ts
import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BigQuery } from '@google-cloud/bigquery';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { TranslationServiceClient } from '@google-cloud/translate';

admin.initializeApp();

const bigquery = new BigQuery();
const ttsClient = new TextToSpeechClient();
const translateClient = new TranslationServiceClient();
const DATASET = 'election_education';

// ─────────────────────────────────────────────
// 1. GEMINI AI — Callable Cloud Function
// ─────────────────────────────────────────────
export const askElectionAssistant = functions.https.onCall(
  { region: 'asia-south1', memory: '512MiB', timeoutSeconds: 60 },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const { message, conversationHistory = [], language = 'en' } = request.data as {
      message: string;
      conversationHistory: Array<{ role: string; content: string }>;
      language: string;
    };

    if (!message || message.trim().length === 0) {
      throw new functions.https.HttpsError('invalid-argument', 'Message cannot be empty.');
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: `You are ElectionBot, an expert AI assistant for Indian election education.
        Respond in language code: ${language}. Be factual, neutral, and encouraging of democratic participation.
        Cite specific laws and articles when relevant.`,
    });

    const chat = model.startChat({
      history: conversationHistory.map(msg => ({
        role: msg.role as 'user' | 'model',
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Log to BigQuery for analytics
    await logEventToBigQuery('chat_message', {
      userId: request.auth.uid,
      messageLength: message.length,
      responseLength: responseText.length,
      language,
      timestamp: new Date().toISOString(),
    });

    return { content: responseText, timestamp: new Date().toISOString() };
  }
);

// ─────────────────────────────────────────────
// 2. BIGQUERY — Analytics Logger
// ─────────────────────────────────────────────
async function logEventToBigQuery(
  eventType: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const table = bigquery.dataset(DATASET).table(eventType);
    await table.insert([{ ...data, event_type: eventType }]);
  } catch (error) {
    console.error(`BigQuery insert failed for ${eventType}:`, error);
    // Non-fatal: analytics failure shouldn't break the user experience
  }
}

export const logQuizCompletion = functions.https.onCall(
  { region: 'asia-south1' },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const { quizId, score, percentage, timeTaken, category } = request.data as {
      quizId: string;
      score: number;
      percentage: number;
      timeTaken: number;
      category: string;
    };

    await logEventToBigQuery('quiz_completion', {
      userId: request.auth.uid,
      quizId,
      score,
      percentage,
      timeTaken,
      category,
      timestamp: new Date().toISOString(),
    });

    // Update Firestore leaderboard
    const db = admin.firestore();
    const leaderboardRef = db.collection('leaderboard').doc(request.auth.uid);
    await leaderboardRef.set(
      {
        uid: request.auth.uid,
        totalScore: admin.firestore.FieldValue.increment(score),
        quizzesCompleted: admin.firestore.FieldValue.increment(1),
        lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  }
);

// ─────────────────────────────────────────────
// 3. GOOGLE CLOUD TEXT-TO-SPEECH — Cloud Function
// ─────────────────────────────────────────────
export const synthesizeSpeech = functions.https.onCall(
  { region: 'asia-south1', memory: '256MiB' },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const { text, languageCode = 'en-IN', voiceName = 'en-IN-Neural2-A' } = request.data as {
      text: string;
      languageCode: string;
      voiceName: string;
    };

    if (!text || text.length > 5000) {
      throw new functions.https.HttpsError('invalid-argument', 'Text must be 1-5000 characters.');
    }

    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9, pitch: 0 },
    });

    const audioContent = response.audioContent as Buffer;
    const base64Audio = audioContent.toString('base64');

    return { audioBase64: base64Audio, contentType: 'audio/mpeg' };
  }
);

// ─────────────────────────────────────────────
// 4. GOOGLE CLOUD TRANSLATE — Cloud Function
// ─────────────────────────────────────────────
export const translateContent = functions.https.onCall(
  { region: 'asia-south1' },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const { text, targetLanguageCode, sourceLanguageCode = 'en' } = request.data as {
      text: string;
      targetLanguageCode: string;
      sourceLanguageCode: string;
    };

    if (targetLanguageCode === sourceLanguageCode) {
      return { translatedText: text, sourceLanguage: sourceLanguageCode };
    }

    const projectId = process.env.GCLOUD_PROJECT;
    const location = 'global';
    const parent = `projects/${projectId}/locations/${location}`;

    const [response] = await translateClient.translateText({
      parent,
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode,
      targetLanguageCode,
    });

    const translatedText = response.translations?.[0]?.translatedText ?? text;
    return { translatedText, sourceLanguage: sourceLanguageCode, targetLanguage: targetLanguageCode };
  }
);

// ─────────────────────────────────────────────
// 5. BIGQUERY — Analytics Dashboard Data
// ─────────────────────────────────────────────
export const getAnalyticsSummary = functions.https.onCall(
  { region: 'asia-south1' },
  async (request) => {
    if (!request.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Must be authenticated.');
    }

    const query = `
      SELECT
        DATE(timestamp) as date,
        COUNT(*) as total_quizzes,
        AVG(percentage) as avg_score,
        COUNTIF(percentage >= 80) as high_scorers
      FROM \`${process.env.GCLOUD_PROJECT}.${DATASET}.quiz_completion\`
      WHERE DATE(timestamp) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
      GROUP BY date
      ORDER BY date DESC
      LIMIT 30
    `;

    const [rows] = await bigquery.query({ query });
    return { data: rows };
  }
);

// ─────────────────────────────────────────────
// 6. FIRESTORE TRIGGER — New User Welcome
// ─────────────────────────────────────────────
export const onNewUserCreated = functions.firestore.onDocumentCreated(
  { document: 'users/{userId}', region: 'asia-south1' },
  async (event) => {
    const userId = event.params.userId;
    const userData = event.data?.data();

    if (!userData) return;

    // Log new user to BigQuery
    await logEventToBigQuery('user_signup', {
      userId,
      preferredLanguage: userData.preferredLanguage ?? 'en',
      isAnonymous: userData.isAnonymous ?? false,
      timestamp: new Date().toISOString(),
    });

    // Initialize learning progress
    const db = admin.firestore();
    await db.collection('learningProgress').doc(userId).set({
      userId,
      modulesCompleted: [],
      lessonsCompleted: [],
      totalTimeSpent: 0,
      streak: 0,
      lastActivityAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Initialized profile for new user: ${userId}`);
  }
);

// ─────────────────────────────────────────────
// 7. SCHEDULED FUNCTION — Weekly Leaderboard Reset
// ─────────────────────────────────────────────
export const weeklyLeaderboardReset = functions.scheduler.onSchedule(
  { schedule: 'every monday 00:00', region: 'asia-south1', timeZone: 'Asia/Kolkata' },
  async () => {
    const db = admin.firestore();
    const leaderboard = await db.collection('leaderboard').get();

    const batch = db.batch();
    leaderboard.docs.forEach(doc => {
      batch.update(doc.ref, {
        weeklyScore: 0,
        weeklyQuizzes: 0,
        weeklyReset: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    console.log(`Weekly leaderboard reset for ${leaderboard.size} users`);
  }
);
