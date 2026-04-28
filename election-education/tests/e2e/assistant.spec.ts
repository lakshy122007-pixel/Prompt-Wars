// tests/e2e/assistant.spec.ts
import { test, expect } from '@playwright/test';

test.describe('AI Assistant', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/assistant');
  });

  test('shows suggested questions on empty chat', async ({ page }) => {
    await expect(page.locator('[data-testid="suggested-questions"]')).toBeVisible();
    await expect(page.getByText(/register as a voter/i)).toBeVisible();
  });

  test('sends message and receives response', async ({ page }) => {
    const input = page.locator('[data-testid="chat-input"]');
    await input.fill('What is the minimum voting age?');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();
    await expect(page.locator('[data-testid="assistant-message"]').last()).toBeVisible({ timeout: 15000 });
  });

  test('typing indicator appears while loading', async ({ page }) => {
    await page.locator('[data-testid="chat-input"]').fill('Test question');
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible();
  });

  test('chat input clears after sending', async ({ page }) => {
    const input = page.locator('[data-testid="chat-input"]');
    await input.fill('Hello');
    await page.keyboard.press('Enter');
    await expect(input).toHaveValue('');
  });

  test('suggested question auto-fills input on click', async ({ page }) => {
    const suggestedQ = page.locator('[data-testid="suggested-question"]').first();
    const questionText = await suggestedQ.textContent();
    await suggestedQ.click();
    const input = page.locator('[data-testid="chat-input"]');
    await expect(input).toHaveValue(questionText ?? '');
  });
});
