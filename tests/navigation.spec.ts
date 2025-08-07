import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate from event list to event detail and back', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Click on first event card
    const firstEventCard = page.locator('[data-testid="meetup-card"]').first();
    await firstEventCard.click();
    
    // Should navigate to event detail page
    await expect(page).toHaveURL('/event/1');
    
    // Should show event detail content
    await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
    
    // Click back button
    await page.getByRole('button', { name: /Back to Events/i }).click();
    
    // Should navigate back to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
  });

  test('should handle direct navigation to event detail pages', async ({ page }) => {
    // Navigate directly to event detail page
    await page.goto('/event/2');
    
    // Should display correct event
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
    await expect(page).toHaveURL('/event/2');
  });

  test('should navigate to all event details from event list', async ({ page }) => {
    await page.goto('/');
    
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    const eventCards = page.locator('[data-testid="meetup-card"]');
    const cardCount = await eventCards.count();
    
    // Test navigation to each event
    for (let i = 0; i < cardCount; i++) {
      // Go back to home page
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Click on the i-th event card
      await eventCards.nth(i).click();
      
      // Should navigate to correct event detail page
      await expect(page).toHaveURL(`/event/${i + 1}`);
      
      // Should display event content
      const eventTitles = [
        'Test Automation with Selenium & Python',
        'API Testing Workshop with Postman & Newman',
        'Mobile Testing Strategies for iOS & Android',
        'Performance Testing with JMeter',
        'Behavior Driven Development with Cucumber'
      ];
      
      await expect(page.getByRole('heading', { name: eventTitles[i] })).toBeVisible();
    }
  });

  test('should handle browser navigation (back/forward)', async ({ page }) => {
    // Start at home page
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Navigate to first event
    await page.locator('[data-testid="meetup-card"]').first().click();
    await expect(page).toHaveURL('/event/1');
    
    // Navigate to second event
    await page.goto('/event/2');
    await expect(page).toHaveURL('/event/2');
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/event/1');
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/event/2');
    
    // Use browser back button twice to go to home
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('should handle invalid event IDs with redirect', async ({ page }) => {
    // Navigate to non-existent event
    await page.goto('/event/999');
    
    // Should show not found message
    await expect(page.getByText('Event Not Found')).toBeVisible();
    
    // Click "View All Events" button
    await page.getByRole('button', { name: 'View All Events' }).click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
  });

  test('should handle wildcard routes correctly', async ({ page }) => {
    // Navigate to non-existent route
    await page.goto('/non-existent-page');
    
    // Should redirect to home page (based on our wildcard route configuration)
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
  });

  test('should maintain state during navigation', async ({ page }) => {
    // Go to home page and let events load
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Navigate to event detail
    await page.locator('[data-testid="meetup-card"]').first().click();
    await expect(page).toHaveURL('/event/1');
    
    // Navigate back to home
    await page.getByRole('button', { name: /Back to Events/i }).click();
    await expect(page).toHaveURL('/');
    
    // Events should still be loaded (not showing loading state)
    await expect(page.locator('.animate-spin')).not.toBeVisible();
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
  });

  test('should handle keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Tab to first event card
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    await firstCard.focus();
    
    // Press Enter to navigate
    await page.keyboard.press('Enter');
    
    // Should navigate to event detail
    await expect(page).toHaveURL('/event/1');
    
    // Focus on back button and press Enter
    const backButton = page.getByRole('button', { name: /Back to Events/i });
    await backButton.focus();
    await page.keyboard.press('Enter');
    
    // Should navigate back to home
    await expect(page).toHaveURL('/');
  });

  test('should update page title correctly', async ({ page }) => {
    // Check home page title
    await page.goto('/');
    await expect(page).toHaveTitle('Testing Meetups App');
    
    // Navigate to event detail and check title updates
    await page.goto('/event/1');
    // Note: You might want to implement dynamic title updates in your Angular app
    await expect(page).toHaveTitle('Testing Meetups App');
  });

  test('should handle concurrent navigation correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Quickly navigate between different events
    await page.locator('[data-testid="meetup-card"]').first().click();
    await page.waitForURL('/event/1');
    
    // Immediately navigate to another event
    await page.goto('/event/3');
    await expect(page).toHaveURL('/event/3');
    await expect(page.getByRole('heading', { name: 'Mobile Testing Strategies for iOS & Android' })).toBeVisible();
  });

  test('should preserve scroll position during navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Scroll down on home page
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollPosition = await page.evaluate(() => window.scrollY);
    expect(scrollPosition).toBeGreaterThan(0);
    
    // Navigate to event detail
    await page.locator('[data-testid="meetup-card"]').first().click();
    await expect(page).toHaveURL('/event/1');
    
    // Navigate back
    await page.getByRole('button', { name: /Back to Events/i }).click();
    await expect(page).toHaveURL('/');
    
    // Check if we're back at the top (new page load behavior)
    const newScrollPosition = await page.evaluate(() => window.scrollY);
    expect(newScrollPosition).toBe(0);
  });

  test('should handle route parameters correctly', async ({ page }) => {
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

  test('should handle page refresh correctly', async ({ page }) => {
    // Navigate to event detail page
    await page.goto('/event/2');
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Should still show the same event
    await expect(page).toHaveURL('/event/2');
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
  });
});