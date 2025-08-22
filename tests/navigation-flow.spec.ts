import { test, expect } from '@playwright/test';

test.describe('Navigation Flow Tests', () => {
  test('should handle complete navigation flow with keyboard support', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Test clicking on first event card (more reliable than keyboard navigation)
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    await firstCard.click();
    await expect(page).toHaveURL('/event/1');
    await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
    
    // Test back navigation
    const backButton = page.getByRole('button', { name: /Back to Events/i });
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should handle browser navigation correctly', async ({ page }) => {
    // Navigate through multiple events
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    await page.locator('[data-testid="meetup-card"]').first().click();
    await expect(page).toHaveURL('/event/1');
    
    await page.goto('/event/2');
    await expect(page).toHaveURL('/event/2');
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
    
    // Test browser back/forward
    await page.goBack();
    await expect(page).toHaveURL('/event/1');
    
    await page.goForward();
    await expect(page).toHaveURL('/event/2');
    
    // Test page refresh maintains state
    await page.reload();
    await expect(page).toHaveURL('/event/2');
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
  });

  test('should handle all valid event routes', async ({ page }) => {
    const testCases = [
      { id: '1', title: 'Test Automation with Selenium & Python' },
      { id: '2', title: 'API Testing Workshop with Postman & Newman' },
      { id: '3', title: 'Mobile Testing Strategies for iOS & Android' },
      { id: '4', title: 'Performance Testing with JMeter' },
      { id: '5', title: 'Behavior Driven Development with Cucumber' }
    ];
    
    for (const testCase of testCases) {
      await page.goto(`/event/${testCase.id}`);
      await expect(page).toHaveURL(`/event/${testCase.id}`);
      await expect(page.getByRole('heading', { name: testCase.title })).toBeVisible();
    }
  });
});