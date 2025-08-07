import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile Portrait', width: 375, height: 667 },
    { name: 'Mobile Landscape', width: 667, height: 375 },
    { name: 'Tablet Portrait', width: 768, height: 1024 },
    { name: 'Tablet Landscape', width: 1024, height: 768 },
    { name: 'Desktop Small', width: 1366, height: 768 },
    { name: 'Desktop Large', width: 1920, height: 1080 },
    { name: 'Ultra Wide', width: 2560, height: 1440 }
  ];

  viewports.forEach(viewport => {
    test(`should display correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      
      // Wait for events to load
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Check that main title is visible
      await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
      
      // Check that event cards are visible
      await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
      
      // Take screenshot for visual regression testing
      await page.screenshot({ 
        path: `tests/screenshots/event-list-${viewport.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: true 
      });
    });
  });

  test('should stack event cards vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    const cards = page.locator('[data-testid="meetup-card"]');
    const firstCard = cards.first();
    const secondCard = cards.nth(1);
    
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();
    
    // On mobile, cards should be stacked vertically (second card below first)
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y! + firstCardBox?.height!);
  });

  test('should display event cards in grid on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    const cards = page.locator('[data-testid="meetup-card"]');
    const firstCard = cards.first();
    const secondCard = cards.nth(1);
    
    const firstCardBox = await firstCard.boundingBox();
    const secondCardBox = await secondCard.boundingBox();
    
    // On desktop, first two cards should be side by side
    expect(Math.abs(firstCardBox?.y! - secondCardBox?.y!)).toBeLessThan(50);
    expect(secondCardBox?.x).toBeGreaterThan(firstCardBox?.x! + firstCardBox?.width!);
  });

  test('should adapt hero section text size on different screens', async ({ page }) => {
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const heroTitle = page.getByRole('heading', { name: 'Software Testing Meetups' });
    await expect(heroTitle).toBeVisible();
    
    // Test desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(heroTitle).toBeVisible();
  });

  test('should handle event detail page responsively', async ({ page }) => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1366, height: 768 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/event/1');
      
      // Check all main sections are visible
      await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
      
      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/event-detail-${viewport.name.toLowerCase()}.png`,
        fullPage: true
      });
    }
  });

  test('should handle sidebar stacking on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/event/1');
    
    // On mobile, sidebar content should stack below main content
    const aboutSection = page.getByRole('heading', { name: 'About This Event' });
    const organizerSection = page.getByRole('heading', { name: 'Event Organizer' });
    
    await expect(aboutSection).toBeVisible();
    await expect(organizerSection).toBeVisible();
    
    const aboutBox = await aboutSection.boundingBox();
    const organizerBox = await organizerSection.boundingBox();
    
    // Organizer section should be below about section on mobile
    expect(organizerBox?.y).toBeGreaterThan(aboutBox?.y!);
  });

  test('should handle navigation elements responsively', async ({ page }) => {
    // Test back button on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/event/1');
    
    const backButton = page.getByRole('button', { name: /Back to Events/i });
    await expect(backButton).toBeVisible();
    
    // Test back button on desktop
    await page.setViewportSize({ width: 1366, height: 768 });
    await expect(backButton).toBeVisible();
    
    // Back button should work on both
    await backButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should handle text overflow correctly', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 }); // Very small screen
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check that text doesn't overflow containers
    const cardTitles = page.locator('[data-testid="meetup-card"] h2');
    
    for (let i = 0; i < await cardTitles.count(); i++) {
      const title = cardTitles.nth(i);
      await expect(title).toBeVisible();
      
      // Title should not be cut off (basic check)
      const titleBox = await title.boundingBox();
      expect(titleBox?.width).toBeGreaterThan(0);
    }
  });

  test('should maintain touch targets on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check that touch targets are appropriately sized (at least 44px)
    const cards = page.locator('[data-testid="meetup-card"]');
    
    for (let i = 0; i < await cards.count(); i++) {
      const card = cards.nth(i);
      const cardBox = await card.boundingBox();
      
      // Cards should be tall enough for comfortable touch interaction
      expect(cardBox?.height).toBeGreaterThan(100);
    }
  });

  test('should handle horizontal scrolling on very small screens', async ({ page }) => {
    await page.setViewportSize({ width: 280, height: 568 }); // Very narrow screen
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Page should not have horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10); // Allow small tolerance
  });

  test('should adapt glass effects and gradients on all screen sizes', async ({ page }) => {
    const testViewports = [
      { width: 375, height: 667 },
      { width: 768, height: 1024 },
      { width: 1366, height: 768 }
    ];

    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Check that glass effects are still present
      const glassElements = page.locator('.glass-effect');
      await expect(glassElements.first()).toBeVisible();
      
      // Check that gradient backgrounds are visible
      const gradientElements = page.locator('[class*="gradient-"]');
      await expect(gradientElements.first()).toBeVisible();
    }
  });

  test('should handle content density appropriately', async ({ page }) => {
    // Test content density on different screen sizes
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await page.goto('/event/1');
    
    // On mobile, content should have appropriate spacing
    const sections = page.locator('h2, h3').count();
    expect(await sections).toBeGreaterThan(0);
    
    // Switch to desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Content should still be readable and well-spaced
    await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
  });

  test('should handle orientation changes', async ({ page, context }) => {
    // Start in portrait mode
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Check layout in portrait
    const cardsPortrait = await page.locator('[data-testid="meetup-card"]').count();
    expect(cardsPortrait).toBe(5);
    
    // Switch to landscape mode
    await page.setViewportSize({ width: 667, height: 375 });
    
    // Check layout still works in landscape
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
  });

  test('should maintain visual hierarchy on all screen sizes', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },
      { width: 1366, height: 768 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Main heading should be most prominent
      const mainHeading = page.getByRole('heading', { level: 1 });
      await expect(mainHeading).toBeVisible();
      
      // Event titles should be visible
      const eventTitles = page.locator('[data-testid="meetup-card"] h2');
      await expect(eventTitles.first()).toBeVisible();
    }
  });
});