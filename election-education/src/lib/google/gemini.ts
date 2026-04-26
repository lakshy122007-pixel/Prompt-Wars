/**
 * @module Gemini AI Client
 * @description Server-side client for Google Gemini 2.0 Flash AI assistant.
 * Provides streaming chat responses about Indian election processes.
 */

import { GoogleGenerativeAI, type GenerativeModel, type ChatSession } from '@google/generative-ai';

const ELECTION_SYSTEM_PROMPT = `You are ElectionBot, an expert AI assistant dedicated to educating Indian citizens about the democratic election process. You have comprehensive knowledge of:

- Constitution of India Articles 324-329 (Election Commission provisions)
- Representation of the People Act, 1950 and 1951
- Model Code of Conduct
- Voter registration process (Form 6, 6A, 6B, 7, 8, 8A)
- Electronic Voting Machines (EVM) and VVPAT systems
- Election Commission of India (ECI) structure and powers
- Types of elections: Lok Sabha, Rajya Sabha, Vidhan Sabha, local body
- Delimitation process
- Election schedule and phases
- Candidate nomination and scrutiny process
- Campaign rules and expenditure limits
- Polling day procedures
- Counting and result declaration
- Election disputes and tribunals
- Rights and duties of voters
- Special provisions for differently-abled voters
- NOTA (None Of The Above) option
- Postal ballots and overseas voters

Always be:
- Factual and cite specific laws/articles when relevant
- Non-partisan and neutral
- Encouraging of democratic participation
- Helpful for all literacy levels
- Supportive of voters' rights

If asked about anything not related to elections or civic education, politely redirect to election topics. Never provide advice that could be construed as political bias toward any party or candidate.

Respond in the same language the user writes in. Support all 22 scheduled languages of India plus English.`;

let genAI: GoogleGenerativeAI | null = null;

/**
 * Get the Gemini AI client instance
 * @returns GoogleGenerativeAI instance
 */
const getGeminiClient = (): GoogleGenerativeAI => {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

/**
 * Get the Gemini generative model configured for election assistance
 * @returns Configured GenerativeModel instance
 */
export const getElectionModel = (): GenerativeModel => {
  const client = getGeminiClient();
  return client.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: ELECTION_SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 2048,
    },
  });
};

/**
 * Create a new chat session with conversation history
 * @param history - Previous chat messages for context
 * @returns ChatSession instance
 */
export const createChatSession = (
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
): ChatSession => {
  const model = getElectionModel();
  return model.startChat({
    history,
  });
};

/**
 * Generate a streaming response for a user message
 * @param message - The user's message
 * @param history - Previous conversation history
 * @returns AsyncGenerator yielding response text chunks
 */
export async function* streamChatResponse(
  message: string,
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
): AsyncGenerator<string, void, unknown> {
  const chat = createChatSession(history);
  const result = await chat.sendMessageStream(message);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      yield text;
    }
  }
}

/**
 * Generate a single (non-streaming) response
 * @param message - The user's message
 * @param history - Previous conversation history
 * @returns The complete response text
 */
export const generateChatResponse = async (
  message: string,
  history: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
): Promise<string> => {
  const chat = createChatSession(history);
  const result = await chat.sendMessage(message);
  return result.response.text();
};
