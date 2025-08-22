import { test, expect } from '@playwright/test';

test.describe('Responsive Design and Accessibility Tests', () => {
  test('should display correctly across key viewport sizes', async ({ page }) => {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1366, height: 768 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Test home page responsive layout
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
      await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
      
      // Test event detail page responsive layout
      await page.goto('/event/1');
      await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
    }
  });

  test('should meet basic accessibility requirements', async ({ page }) => {
    // Test home page accessibility
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Should have proper heading hierarchy
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    const h2Count = await page.getByRole('heading', { level: 2 }).count();
    expect(h2Count).toBeGreaterThan(0);
    
    // Event cards should be keyboard accessible
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    await expect(firstCard).toHaveAttribute('tabindex', '0');
    
    // Test event detail page accessibility
    await page.goto('/event/1');
    
    // Contact links should be properly accessible
    const emailLink = page.getByRole('link', { name: /sarah\.johnson@testpro\.com/i });
    await expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@testpro.com');
    
    const phoneLink = page.getByRole('link', { name: /\+1-555-0123/i });
    await expect(phoneLink).toHaveAttribute('href', 'tel:+1-555-0123');
    
    // Back button should be properly labeled
    const backButton = page.getByRole('button', { name: /Back to Events/i });
    await expect(backButton).toBeVisible();
  });

  test('should handle mobile layout correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
    
    // Cards should stack vertically on mobile
    const cards = page.locator('[data-testid="meetup-card"]');
    const firstCardBox = await cards.first().boundingBox();
    const secondCardBox = await cards.nth(1).boundingBox();
    
    // Second card should be below first card
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y! + firstCardBox?.height!);
    
    // Touch targets should be appropriately sized
    expect(firstCardBox?.height).toBeGreaterThan(100);
  });
});