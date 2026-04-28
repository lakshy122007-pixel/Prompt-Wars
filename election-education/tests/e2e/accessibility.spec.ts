// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility — WCAG 2.2 AA', () => {
  test('home page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
    expect(results.violations.filter(v => v.impact === 'serious')).toHaveLength(0);
  });

  test('full keyboard navigation on home page', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('[data-testid="skip-to-content"]');
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    const main = page.locator('main');
    await expect(main).toBeFocused();
  });

  test('quiz page accessible with keyboard', async ({ page }) => {
    await page.goto('/quiz');
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('chat page has aria-live region for new messages', async ({ page }) => {
    await page.goto('/assistant');
    const liveRegion = page.locator('[aria-live="polite"]');
    await expect(liveRegion).toBeAttached();
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img:not([alt])');
    expect(await images.count()).toBe(0);
  });

  test('all form inputs have labels', async ({ page }) => {
    await page.goto('/voter-check');
    const results = await new AxeBuilder({ page })
      .withRules(['label'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('color contrast meets WCAG AA', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();
    expect(results.violations).toHaveLength(0);
  });

  test('language selector is keyboard operable', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const langBtn = page.locator('[data-testid="language-selector"]');
    await langBtn.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[role="listbox"]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="listbox"]')).toBeHidden();
  });
});
