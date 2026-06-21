// src/lib/google/vertexai.ts
// Vertex AI with Google Search grounding for factual election data
import { VertexAI, HarmCategory, HarmBlockThreshold } from '@google-cloud/vertexai';
import { logger } from '@/lib/utils/logger';
import type { ChatMessage } from '@/types';

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID!;
const LOCATION = 'asia-south1';

let vertexClient: VertexAI | null = null;

function getVertexClient(): VertexAI {
  if (!vertexClient) {
    vertexClient = new VertexAI({ project: PROJECT_ID, location: LOCATION });
  }
  return vertexClient;
}

/**
 * Generate election education response using Vertex AI
 * with Google Search grounding for up-to-date, factual answers
 * @param message - User's question
 * @param history - Conversation history
 * @returns Grounded AI response with citations
 */
export async function generateGroundedResponse(
  message: string,
  history: ChatMessage[]
): Promise<{ content: string; groundingMetadata?: unknown }> {
  const vertex = getVertexClient();
  const model = vertex.preview.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE },
    ],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.3,
      topP: 0.8,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ googleSearchRetrieval: { dynamicRetrievalConfig: { mode: 'MODE_DYNAMIC' as any, dynamicThreshold: 0.7 } } }],
  });

  const chat = model.startChat({
    history: history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    })),
  });

  try {
    const result = await chat.sendMessage(message);
    const response = result.response;
    const content = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return { content, groundingMetadata };
  } catch (error) {
    logger.error('Vertex AI error', { error });
    throw new Error('Failed to generate AI response');
  }
}
