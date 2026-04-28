/**
 * @module Assistant API Route
 * @description POST endpoint for AI assistant powered by Gemini 2.0 Flash.
 * Provides election education responses with demo fallback when API key is missing.
 *
 * @route POST /api/assistant
 * @requestBody {{ message: string; history?: ChatHistory[] }} — User question and conversation context
 * @returns 200 — AI-generated election education response
 * @returns 400 — Invalid or missing message field
 * @returns 500 — Internal server error from Gemini API
 */

import { NextRequest, NextResponse } from 'next/server';

import { HTTP_STATUS } from '@/lib/constants/app';
import { logger } from '@/lib/utils/logger';
import { getErrorMessage } from '@/lib/utils/errors';

/**
 * Validates the request body for required fields
 * @param body - Parsed JSON body
 * @returns Whether the body contains a valid string message
 */
function isValidRequestBody(
  body: unknown,
): body is { message: string; history?: Array<{ role: string; parts: Array<{ text: string }> }> } {
  return (
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof (body as Record<string, unknown>).message === 'string' &&
    ((body as Record<string, unknown>).message as string).trim().length > 0
  );
}

/**
 * Handles POST requests to the AI assistant endpoint.
 * Falls back to curated demo responses when GEMINI_API_KEY is not configured.
 *
 * @param request - Incoming Next.js request
 * @returns JSON response with assistant content or error
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();

    if (!isValidRequestBody(body)) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: HTTP_STATUS.BAD_REQUEST },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        data: getDemoResponse(body.message),
      });
    }

    const { generateChatResponse } = await import('@/lib/google/gemini');
    const response = await generateChatResponse(body.message, body.history ?? []);

    return NextResponse.json({ success: true, data: response });
  } catch (error: unknown) {
    logger.error('Assistant API error', { error: getErrorMessage(error) });
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
  }
}

/**
 * Provides curated demo responses when Gemini API key is not configured.
 * Covers registration, NOTA, EVM/VVPAT, and generic election topics.
 *
 * @param message - User's question text
 * @returns Markdown-formatted demo response
 */
function getDemoResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('register') || lower.includes('registration')) {
    return getRegistrationResponse();
  }

  if (lower.includes('nota')) {
    return getNotaResponse();
  }

  if (lower.includes('evm') || lower.includes('vvpat')) {
    return getEvmResponse();
  }

  return getGenericResponse();
}

/** Returns curated voter registration information */
function getRegistrationResponse(): string {
  return `## Voter Registration in India 🗳️

To register as a voter in India, you need to:

1. **Check eligibility**: You must be an Indian citizen aged 18+ years as of January 1st of the year.

2. **Fill Form 6**: This is the application for inclusion of name in the electoral roll. You can fill it:
   - **Online** at [voters.eci.gov.in](https://voters.eci.gov.in)
   - **Offline** at your nearest Electoral Registration Officer (ERO) office

3. **Required Documents**:
   - Proof of age (birth certificate, school certificate, etc.)
   - Proof of address (Aadhaar, utility bill, etc.)
   - Passport-size photograph

4. **Verification**: A Booth Level Officer (BLO) may visit your address for verification.

5. **Receive EPIC**: Once approved, you'll receive your Electoral Photo Identity Card (Voter ID).

📌 *Reference: Section 19 of the Representation of the People Act, 1950*`;
}

/** Returns curated NOTA information */
function getNotaResponse(): string {
  return `## NOTA (None Of The Above) 🏛️

**NOTA** is an option available on the Electronic Voting Machine (EVM) that allows voters to express their dissatisfaction with all contesting candidates.

### Key Points:
- Introduced by the **Supreme Court of India** in **September 2013** (PUCL vs Union of India case)
- It is the **last option** on the EVM ballot
- If NOTA receives the **highest votes**, the candidate with the next highest votes still wins (as per current rules)
- It allows voters to formally express dissent while maintaining **ballot secrecy**

### Why use NOTA?
- To exercise your right to reject all candidates
- To register a formal protest without boycotting elections
- Your vote is still **counted** and reflected in results

📌 *Reference: Supreme Court Judgment in People's Union for Civil Liberties vs Union of India, 2013*`;
}

/** Returns curated EVM/VVPAT information */
function getEvmResponse(): string {
  return `## EVM & VVPAT System 🖥️

### Electronic Voting Machine (EVM)
- Used in Indian elections since **2004** (full implementation)
- Consists of **Control Unit** (with polling officer) and **Ballot Unit** (in voting compartment)
- Can record up to **3,840 votes** per machine
- Operates on a **7.5V battery** — no internet connection required
- **One-time programmable chip** prevents tampering

### VVPAT (Voter Verifiable Paper Audit Trail)
- Introduced to add transparency to EVM voting
- Prints a **paper slip** showing the candidate's name and symbol
- The slip is visible for **7 seconds** before dropping into a sealed box
- Mandatory in **all constituencies** since 2019

### Verification Process
- **5 random VVPAT machines** per constituency are matched against EVM results
- Any discrepancy triggers a full audit

📌 *Reference: Conduct of Elections Rules, 1961 (as amended)*`;
}

/** Returns generic welcome response listing bot capabilities */
function getGenericResponse(): string {
  return `## Thank you for your question! 📚

I'm **ElectionBot**, your AI assistant for understanding Indian democracy and elections.

I can help you with:
- 🗳️ **Voter Registration** — How to register, forms, and documents needed
- 🏛️ **Election Process** — Polling day procedures, EVM, VVPAT
- 📜 **Constitutional Provisions** — Articles 324-329 and electoral laws
- 🗺️ **Finding Polling Stations** — Locate your nearest booth
- ❌ **NOTA** — How "None of the Above" works
- 📋 **Election Commission** — Structure and powers of ECI
- 🎯 **Model Code of Conduct** — Rules for parties and candidates

**Try asking me something specific!** For example:
- "How do I register to vote?"
- "What is NOTA and how does it work?"
- "Explain the EVM and VVPAT process"

*Note: To enable AI-powered responses, configure the GEMINI_API_KEY in your environment variables.*`;
}
