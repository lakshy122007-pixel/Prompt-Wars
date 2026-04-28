// tests/e2e/quiz.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/quiz');
  });

  test('shows quiz categories on landing', async ({ page }) => {
    await expect(page.locator('[data-testid="quiz-category-card"]').first()).toBeVisible();
    await expect(page.getByText('Voter Eligibility')).toBeVisible();
  });

  test('completes a full quiz flow', async ({ page }) => {
    await page.click('[data-testid="start-quiz-voter-eligibility"]');
    await expect(page.locator('[data-testid="quiz-question"]')).toBeVisible();
    await expect(page.locator('[data-testid="countdown-timer"]')).toBeVisible();
    await page.click('[data-testid="quiz-option-0"]');
    await expect(page.locator('[data-testid="answer-explanation"]')).toBeVisible();
  });

  test('shows results with score at the end', async ({ page }) => {
    await page.click('[data-testid="start-quiz-voter-eligibility"]');
    const questionCount = await page.locator('[data-testid="question-count"]').textContent();
    const total = parseInt(questionCount?.split('/')[1] ?? '5');
    for (let i = 0; i < total; i++) {
      await page.click('[data-testid="quiz-option-0"]');
      await page.click('[data-testid="next-question"]');
    }
    await expect(page.locator('[data-testid="quiz-results"]')).toBeVisible();
    await expect(page.locator('[data-testid="quiz-score"]')).toBeVisible();
  });

  test('allows quiz restart', async ({ page }) => {
    await page.click('[data-testid="start-quiz-voter-eligibility"]');
    await page.click('[data-testid="quiz-option-0"]');
    await page.click('[data-testid="next-question"]');
    await page.click('[data-testid="restart-quiz"]');
    await expect(page.locator('[data-testid="quiz-question"]')).toBeVisible();
  });
});
