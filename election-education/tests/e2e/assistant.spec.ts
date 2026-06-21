// tests/e2e/assistant.spec.ts
import { test, expect } from '@playwright/test';

/** Helper: type into chat input and submit via the send button (cross-browser reliable). */
async function sendChatMessage(page: import('@playwright/test').Page, text: string) {
  const input = page.locator('[data-testid="chat-input"]');
  await input.click();
  await input.fill(text);
  await input.press('Space');
  await input.press('Backspace');
  // Wait for React re-render to enable the send button
  const sendBtn = page.locator('[data-testid="send-button"]');
  await expect(sendBtn).toBeEnabled({ timeout: 15000 });
  await sendBtn.click();
}

test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assistant');
  });

  test('shows suggested questions on empty chat', async ({ page }) => {
    await expect(page.locator('[data-testid="suggested-questions"]')).toBeVisible();
    await expect(page.getByText(/register as a voter/i)).toBeVisible();
  });

  test('sends message and receives response', async ({ page }) => {
    await sendChatMessage(page, 'What is the minimum voting age?');
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="assistant-message"]').last()).toBeVisible({ timeout: 15000 });
  });

  test('typing indicator appears while loading', async ({ page }) => {
    await sendChatMessage(page, 'Test question');
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible({ timeout: 10000 });
  });

  test('chat input clears after sending', async ({ page }) => {
    const input = page.locator('[data-testid="chat-input"]');
    await sendChatMessage(page, 'Hello');
    await expect(input).toHaveValue('', { timeout: 10000 });
  });

  test('suggested question auto-fills input on click', async ({ page }) => {
    const suggestedQ = page.locator('[data-testid="suggested-question"]').first();
    const questionText = await suggestedQ.textContent();
    await suggestedQ.click();
    const input = page.locator('[data-testid="chat-input"]');
    await expect(input).toHaveValue(questionText ?? '');
  });
});
