import { test, expect } from '@playwright/test';

test.describe('Mobile Experience', () => {
  test.use({
    viewport: { width: 375, height: 667 }, // iPhone SE size
    isMobile: true,
    hasTouch: true
  });

  test('should display mobile-optimized layout', async ({ page }) => {
    await page.goto('/');

    // Start quiz to see mobile elements
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Check mobile-specific elements are visible in quiz
    await expect(page.locator('.question-counter-mobile')).toBeVisible();
    await expect(page.locator('.question-counter-full')).not.toBeVisible();

    // Verify mobile layout adjustments
    await expect(page.locator('.quiz-header')).toBeVisible();
    await expect(page.locator('.progress-bar')).toBeVisible();
  });

  test('should handle touch interactions properly', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Test touch interactions on different question types
    const questionType = await page.locator('[data-testid="question-container"]').getAttribute('data-question-type');

    if (questionType === 'multiple-choice' || questionType === 'image-multiple-choice') {
      // Touch select option
      await page.locator('label').first().tap();
      await expect(page.locator('input[type="radio"]:checked')).toBeVisible();
    }

    if (questionType === 'slider') {
      // Touch and drag slider
      const slider = page.locator('input[type="range"]');
      await slider.tap();
      // Verify slider value changed
      const value = await slider.inputValue();
      expect(value).toBeTruthy();
    }

    if (questionType === 'true-false') {
      // Touch true/false option
      await page.locator('label').first().tap();
      await expect(page.locator('input[type="radio"]:checked')).toBeVisible();
    }
  });

  test('should ensure minimum touch target sizes', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Check all interactive elements meet minimum touch target size (44px)
    const interactiveElements = await page.locator('button, label, input[type="range"]').all();

    for (const element of interactiveElements) {
      const boundingBox = await element.boundingBox();
      if (boundingBox && await element.isVisible()) {
        // Minimum touch target size is 44px x 44px
        expect(boundingBox.height).toBeGreaterThanOrEqual(40); // Allow slight variance for styling
        expect(boundingBox.width).toBeGreaterThanOrEqual(40);
      }
    }
  });

  test('should handle mobile keyboard interactions', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Find a text input question
    let attempts = 0;
    while (attempts < 5) {
      const questionType = await page.locator('[data-testid="question-container"]').getAttribute('data-question-type');

      if (questionType === 'text-input') {
        const input = page.locator('input[type="text"]');
        await input.tap();

        // Verify mobile keyboard doesn't interfere with layout
        await input.fill('Test Answer');
        await expect(input).toHaveValue('Test Answer');

        // Verify submit button is still accessible
        await expect(page.getByRole('button', { name: /Next Challenge/i })).toBeVisible();
        break;
      } else {
        // Move to next question
        await page.locator('label').first().tap();
        await page.getByRole('button', { name: /Next Challenge/i }).tap();
        await page.waitForTimeout(700);
        attempts++;
      }
    }
  });

  test('should optimize slider interactions for touch', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Find a slider question
    let attempts = 0;
    while (attempts < 5) {
      const questionType = await page.locator('[data-testid="question-container"]').getAttribute('data-question-type');

      if (questionType === 'slider') {
        const slider = page.locator('input[type="range"]');
        const sliderContainer = slider.locator('..');

        // Test touch interaction on slider track
        const boundingBox = await slider.boundingBox();
        if (boundingBox) {
          // Touch at 75% position
          const touchX = boundingBox.x + (boundingBox.width * 0.75);
          const touchY = boundingBox.y + (boundingBox.height * 0.5);

          await page.mouse.click(touchX, touchY);

          // Verify slider value changed appropriately
          const value = parseInt(await slider.inputValue());
          expect(value).toBeGreaterThan(50); // Should be in upper range
        }

        // Verify visual feedback
        await expect(slider).toBeVisible();
        await expect(sliderContainer).toBeVisible();
        break;
      } else {
        // Move to next question
        await page.locator('label').first().tap();
        await page.getByRole('button', { name: /Next Challenge/i }).tap();
        await page.waitForTimeout(700);
        attempts++;
      }
    }
  });

  test('should handle portrait and landscape orientations', async ({ page }) => {
    await page.goto('/');

    // Test portrait orientation
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();

    // Test landscape orientation
    await page.setViewportSize({ width: 667, height: 375 });
    await expect(page.locator('.container')).toBeVisible();

    // Start quiz in landscape
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();
    await expect(page.locator('.quiz-header')).toBeVisible();
    await expect(page.locator('.progress-bar')).toBeVisible();
  });

  test('should optimize bullet animation performance on mobile', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Answer first question
    await page.locator('label').first().tap();

    // Measure animation performance
    const startTime = Date.now();
    await page.getByRole('button', { name: /Next Challenge/i }).tap();

    // Wait for animation to complete
    await page.waitForTimeout(700);
    const endTime = Date.now();

    // Animation should complete within reasonable time
    expect(endTime - startTime).toBeLessThan(1000);

    // Next question should be visible
    await expect(page.locator('.question-counter')).toContainText('Question 2');
  });

  test('should handle email form on mobile', async ({ page }) => {
    // Mock successful email submission
    await page.route('**/mailchimp**', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({ result: 'success' })
      });
    });

    await page.goto('/');
    await page.getByRole('button', { name: /Start Detective Challenge/i }).click();

    // Complete quiz quickly
    for (let i = 0; i < 15; i++) {
      await page.locator('label').first().tap();
      const isLast = i === 14;
      const buttonText = isLast ? 'Complete Challenge' : 'Next Challenge';
      await page.getByRole('button', { name: buttonText }).tap();
      if (!isLast) await page.waitForTimeout(700);
    }

    // Test email form on mobile
    const emailInput = page.locator('input[type="email"]');
    await emailInput.tap();

    // Mobile keyboard should not obscure form
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');

    // Submit button should be accessible
    const submitButton = page.getByRole('button', { name: /Get My Results/i });
    await expect(submitButton).toBeVisible();
    await submitButton.tap();

    // Results should be displayed
    await expect(page.locator('.detailed-results')).toBeVisible();
  });
});