import { test, expect } from '@playwright/test';
import { TestHelpers } from './test-helpers';

test.describe('Core Functionality Tests', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should complete full user journey successfully', async ({ page }) => {
    // Load home page and verify all events display
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    // Verify homepage loads completely
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
    
    // Test navigation to first event
    await helpers.clickEventCard(0);
    await expect(page).toHaveURL('/event/1');
    await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
    
    // Verify all essential sections are present
    await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    
    // Test contact functionality
    const emailLink = page.getByRole('link', { name: /sarah\.johnson@testpro\.com/i });
    await expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@testpro.com');
    
    const phoneLink = page.getByRole('link', { name: /\+1-555-0123/i });
    await expect(phoneLink).toHaveAttribute('href', 'tel:+1-555-0123');
    
    // Test navigation back to home
    await page.getByRole('button', { name: /Back to Events/i }).click();
    await expect(page).toHaveURL('/');
    
    // Verify we're back on homepage with all events still loaded
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Test 404 error handling
    await page.goto('/event/999');
    await expect(page.getByText('Event Not Found')).toBeVisible();
    await expect(page.getByText('The requested meetup could not be found.')).toBeVisible();
    
    // Test recovery from error
    const backButton = page.getByRole('button', { name: 'View All Events' });
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL('/');
    await helpers.waitForAppLoad();
  });

  test('should maintain performance and loading states', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
    
    // Verify content is loaded
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
  });
});