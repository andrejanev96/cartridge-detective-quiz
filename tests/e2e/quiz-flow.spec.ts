import { test, expect } from '@playwright/test';

test.describe('Quiz Complete Flow', () => {
  test('should complete full quiz flow from landing to results', async ({ page }) => {
    await page.goto('/');

    // Landing page
    await expect(page.getByText('Cartridge Detective Challenge')).toBeVisible();
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Quiz flow - complete all questions
    let currentQuestion = 1;
    const totalQuestions = 15;

    while (currentQuestion <= totalQuestions) {
      // Verify question counter
      await expect(page.locator('.question-counter')).toContainText(`Question ${currentQuestion}`);

      // Progress bar should be visible and updating
      await expect(page.locator('.progress-bar')).toBeVisible();

      // Answer the question based on type
      const questionType = await page.locator('[data-testid="question-container"]').getAttribute('data-question-type');

      switch (questionType) {
        case 'multiple-choice':
        case 'image-multiple-choice':
          await page.locator('label').first().click();
          break;
        case 'slider':
          await page.locator('input[type="range"]').fill('50');
          break;
        case 'text-input':
          await page.locator('input[type="text"]').fill('Test Answer');
          break;
        case 'true-false':
          await page.locator('label').first().click();
          break;
      }

      // Click next/complete button
      const buttonText = currentQuestion === totalQuestions ? 'Complete Challenge' : 'Next Challenge';
      await page.getByRole('button', { name: buttonText }).click();

      // Wait for bullet animation if not last question
      if (currentQuestion < totalQuestions) {
        await page.waitForTimeout(700); // bullet animation duration
      }

      currentQuestion++;
    }

    // Results page
    await expect(page.getByText('Challenge Complete!')).toBeVisible();
    await expect(page.locator('.score-display')).toBeVisible();
  });

  test('should handle keyboard navigation for multiple choice questions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Use keyboard navigation
    await page.keyboard.press('1'); // Select first option
    await page.keyboard.press('Enter'); // Submit answer

    // Should advance to next question
    await page.waitForTimeout(700);
    await expect(page.locator('.question-counter')).toContainText('Question 2');
  });

  test('should handle slider keyboard controls', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Navigate to a slider question (assuming one exists early)
    // This test will need to be adjusted based on actual question order
    let attempts = 0;
    while (attempts < 5) {
      const questionType = await page.locator('[data-testid="question-container"]').getAttribute('data-question-type');

      if (questionType === 'slider') {
        // Test arrow key controls
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Enter');
        break;
      } else {
        // Answer current question and move to next
        await page.locator('label').first().click();
        await page.getByRole('button', { name: /Next Challenge/i }).click();
        await page.waitForTimeout(700);
        attempts++;
      }
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.goto('/');

    // Check mobile-specific elements
    await expect(page.locator('.question-counter-mobile')).toBeVisible();

    // Start quiz
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Verify touch targets are appropriately sized (minimum 44px)
    const buttons = await page.locator('button, label').all();
    for (const button of buttons) {
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should handle email submission and unlock results', async ({ page }) => {
    // Mock the mailchimp submission
    await page.route('**/mailchimp**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ result: 'success' })
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Quickly complete quiz (simplified for testing)
    for (let i = 0; i < 15; i++) {
      await page.locator('label').first().click();
      const isLast = i === 14;
      const buttonText = isLast ? 'Complete Challenge' : 'Next Challenge';
      await page.getByRole('button', { name: buttonText }).click();
      if (!isLast) await page.waitForTimeout(700);
    }

    // Should be on results page with email gate
    await expect(page.getByText('Enter your email')).toBeVisible();

    // Submit email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.getByRole('button', { name: /Get My Results/i }).click();

    // Should show detailed results
    await expect(page.locator('.detailed-results')).toBeVisible();
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure
    await page.route('**/mailchimp**', route => {
      route.abort();
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Complete quiz
    for (let i = 0; i < 15; i++) {
      await page.locator('label').first().click();
      const isLast = i === 14;
      const buttonText = isLast ? 'Complete Challenge' : 'Next Challenge';
      await page.getByRole('button', { name: buttonText }).click();
      if (!isLast) await page.waitForTimeout(700);
    }

    // Try to submit email
    await page.fill('input[type="email"]', 'test@example.com');
    await page.getByRole('button', { name: /Get My Results/i }).click();

    // Should show error message or retry option
    await expect(page.getByText(/error|failed|try again/i)).toBeVisible();
  });
});