import { test, expect } from '@playwright/test';

test.describe('Event List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading and hero section', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
    
    // Check subtitle
    await expect(page.getByText('Join our vibrant community of testing professionals')).toBeVisible();
    
    // Check hero badge
    await expect(page.getByText('🚀 Discover Amazing Events')).toBeVisible();
  });

  test('should display all meetup events', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check that we have the expected number of events (5)
    const eventCards = await page.locator('[data-testid="meetup-card"]').count();
    expect(eventCards).toBe(5);
  });

  test('should display correct event information for first meetup', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    const firstEvent = page.locator('[data-testid="meetup-card"]').first();
    
    // Check event title
    await expect(firstEvent.getByText('Test Automation with Selenium & Python')).toBeVisible();
    
    // Check venue information
    await expect(firstEvent.getByText('Tech Hub Downtown, Conference Room A')).toBeVisible();
    
    // Check short description
    await expect(firstEvent.getByText(/Learn advanced Selenium techniques/)).toBeVisible();
    
    // Check date is displayed (should be formatted)
    const dateElement = firstEvent.locator('.bg-white\\/20').first();
    await expect(dateElement).toBeVisible();
    
    // Check time is displayed
    const timeElement = firstEvent.locator('.bg-white\\/20').nth(1);
    await expect(timeElement).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Intercept API calls to simulate slow loading
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    await page.goto('/');
    
    // Check loading spinner is visible initially
    await expect(page.locator('.animate-spin')).toBeVisible();
  });

  test('should display events in chronological order', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    const eventTitles = await page.locator('[data-testid="meetup-card"] h2').allTextContents();
    
    // Verify the expected order (based on our mock data dates)
    expect(eventTitles).toEqual([
      'Test Automation with Selenium & Python',
      'API Testing Workshop with Postman & Newman', 
      'Mobile Testing Strategies for iOS & Android',
      'Performance Testing with JMeter',
      'Behavior Driven Development with Cucumber'
    ]);
  });

  test('should have gradient backgrounds on cards', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check that cards have different gradient classes
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    const secondCard = page.locator('[data-testid="meetup-card"]').nth(1);
    
    // Verify gradient classes are applied
    await expect(firstCard.locator('.gradient-purple, .gradient-blue, .gradient-green, .gradient-orange, .gradient-card')).toBeVisible();
    await expect(secondCard.locator('.gradient-purple, .gradient-blue, .gradient-green, .gradient-orange, .gradient-card')).toBeVisible();
  });

  test('should show hover effects on cards', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    
    // Hover over the card
    await firstCard.hover();
    
    // Check that hover class is applied or styles change
    await expect(firstCard).toHaveClass(/card-hover/);
  });

  test('should handle empty state correctly', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/');
    
    // Check empty state message
    await expect(page.getByText('No upcoming meetups')).toBeVisible();
    await expect(page.getByText('Check back soon for new exciting events!')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check that hero title is responsive
    const heroTitle = page.getByRole('heading', { name: 'Software Testing Meetups' });
    await expect(heroTitle).toBeVisible();
    
    // Check that cards are stacked vertically (single column layout)
    const cards = page.locator('[data-testid="meetup-card"]');
    const firstCardBox = await cards.first().boundingBox();
    const secondCardBox = await cards.nth(1).boundingBox();
    
    // On mobile, second card should be below first card
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y! + firstCardBox?.height!);
  });

  test('should have accessible elements', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check main heading has correct role
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Check that event cards are clickable
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    await expect(firstCard).toHaveAttribute('tabindex', '0');
    
    // Check for proper heading hierarchy
    await expect(page.getByRole('heading', { level: 2 })).toHaveCount(5); // Each event should have h2
  });

  test('should show venue icons for all events', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check location icons are present
    const locationIcons = page.locator('svg[data-testid="location-icon"], svg:has(path[d*="M17.657"])');
    await expect(locationIcons).toHaveCount(5);
  });

  test('should display time icons for all events', async ({ page }) => {
    // Wait for events to load
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check time icons are present
    const timeIcons = page.locator('svg:has(path[d*="M12 8v4l3 3"])');
    await expect(timeIcons).toHaveCount(5);
  });
});