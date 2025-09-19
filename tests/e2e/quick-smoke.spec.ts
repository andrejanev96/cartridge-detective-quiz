import { test, expect } from '@playwright/test';

test.describe('Quick Smoke Test', () => {
  test('should load landing page and start quiz', async ({ page }) => {
    await page.goto('/');

    // Should see landing page
    await expect(page.getByText('Cartridge Detective Challenge')).toBeVisible();

    // Should have start button
    const startButton = page.getByRole('button', { name: /Start Detective Challenge/i });
    await expect(startButton).toBeVisible();

    // Should start quiz when clicked
    await startButton.click();

    // Should be on quiz page with question 1
    await expect(page.locator('.question-counter')).toContainText('Question 1');
    await expect(page.locator('.progress-bar')).toBeVisible();

    // Should have question content
    await expect(page.locator('[data-testid="question-container"]')).toBeVisible();

    // Test data attributes are working
    const questionContainer = page.locator('[data-testid="question-container"]');
    const questionType = await questionContainer.getAttribute('data-question-type');
    expect(questionType).toBeTruthy();
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Start quiz
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Should show mobile-specific elements in quiz
    await expect(page.locator('.question-counter-mobile')).toBeVisible();

    // Should have responsive layout
    await expect(page.locator('.quiz-header')).toBeVisible();
    await expect(page.locator('.progress-bar')).toBeVisible();
  });
});