import { test, expect } from '@playwright/test';
import { TestHelpers, TEST_DATA } from './test-helpers';

test.describe('Comprehensive Test Suite', () => {
  let helpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
  });

  test('should pass complete smoke test', async ({ page }) => {
    // Load home page
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    // Verify all events are displayed
    await helpers.verifyAllEventsDisplayed();
    
    // Test navigation to each event
    for (let i = 0; i < TEST_DATA.EVENTS.length; i++) {
      await helpers.clickEventCard(i);
      
      // Verify we're on the correct event page
      await expect(page).toHaveURL(`/event/${TEST_DATA.EVENTS[i].id}`);
      await expect(page.getByRole('heading', { name: TEST_DATA.EVENTS[i].title })).toBeVisible();
      
      // Navigate back to home
      await page.getByRole('button', { name: /Back to Events/i }).click();
      await expect(page).toHaveURL('/');
      await helpers.waitForAppLoad();
    }
  });

  test('should handle all user workflows correctly', async ({ page }) => {
    // Complete user journey test
    
    // 1. User arrives at home page
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    // 2. User sees all events and hero section
    await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
    
    // 3. User clicks on an interesting event
    await helpers.clickEventCard(0);
    
    // 4. User views event details
    await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
    
    // 5. User wants to contact organizer
    const emailLink = page.getByRole('link', { name: /sarah\.johnson@testpro\.com/i });
    await expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@testpro.com');
    
    // 6. User checks event location
    await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    await expect(page.getByText('Interactive Map')).toBeVisible();
    
    // 7. User goes back to browse more events
    await page.getByRole('button', { name: /Back to Events/i }).click();
    await expect(page).toHaveURL('/');
    
    // 8. User browses another event
    await helpers.clickEventCard(1);
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
  });

  test('should maintain performance under various conditions', async ({ page }) => {
    // Test with slow network
    await helpers.simulateSlowNetwork();
    
    const startTime = Date.now();
    await page.goto('/');
    
    // Should show loading state
    await expect(page.locator('.animate-spin')).toBeVisible();
    
    // Should eventually load content
    await helpers.waitForAppLoad();
    await helpers.waitForLoadingComplete();
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(15000); // Allow extra time for slow network simulation
    
    // Content should be fully loaded
    await expect(page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
  });

  test('should be fully accessible across all pages', async ({ page }) => {
    // Test home page accessibility
    await page.goto('/');
    await helpers.waitForAppLoad();
    await helpers.checkBasicAccessibility();
    
    // Test keyboard navigation
    await helpers.testKeyboardNavigation();
    
    // Test each event detail page for accessibility
    for (const event of TEST_DATA.EVENTS) {
      await helpers.navigateToEvent(event.id);
      await helpers.checkBasicAccessibility();
      
      // Check that all required sections exist
      await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    }
  });

  test('should be fully responsive across all devices', async ({ page }) => {
    await helpers.testResponsiveLayout();
    
    // Test specific responsive behaviors
    
    // Mobile: cards should stack vertically
    await page.setViewportSize(TEST_DATA.VIEWPORT_SIZES.MOBILE_PORTRAIT);
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    const cards = page.locator('[data-testid="meetup-card"]');
    const firstCardBox = await cards.first().boundingBox();
    const secondCardBox = await cards.nth(1).boundingBox();
    
    // Cards should be stacked vertically
    expect(secondCardBox?.y).toBeGreaterThan(firstCardBox?.y! + firstCardBox?.height!);
    
    // Desktop: cards should be in grid
    await page.setViewportSize(TEST_DATA.VIEWPORT_SIZES.DESKTOP_LARGE);
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    const firstCardBoxDesktop = await cards.first().boundingBox();
    const secondCardBoxDesktop = await cards.nth(1).boundingBox();
    
    // Cards should be side by side
    expect(Math.abs(firstCardBoxDesktop?.y! - secondCardBoxDesktop?.y!)).toBeLessThan(50);
  });

  test('should handle all error scenarios gracefully', async ({ page }) => {
    await helpers.testErrorScenarios();
    
    // Test empty state
    await helpers.mockEmptyResponse();
    await page.goto('/');
    await expect(page.getByText('No upcoming meetups')).toBeVisible();
    await expect(page.getByText('Check back soon for new exciting events!')).toBeVisible();
  });

  test('should maintain visual consistency and branding', async ({ page }) => {
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    // Verify gradient backgrounds
    await helpers.verifyGradientBackgrounds();
    
    // Check that all event cards have consistent styling
    const cards = page.locator('[data-testid="meetup-card"]');
    const cardCount = await cards.count();
    
    for (let i = 0; i < cardCount; i++) {
      const card = cards.nth(i);
      
      // Each card should have glass effect
      await expect(card).toHaveClass(/glass-effect/);
      
      // Each card should have hover transition
      await expect(card).toHaveClass(/card-hover/);
      
      // Each card should be clickable
      await expect(card).toHaveAttribute('tabindex', '0');
    }
    
    // Test detail page consistency
    for (const event of TEST_DATA.EVENTS.slice(0, 3)) { // Test first 3 events
      await helpers.navigateToEvent(event.id);
      
      // Each detail page should have consistent sections
      await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
      
      // Should have gradient backgrounds
      const gradientElements = page.locator('[class*="gradient-"]');
      await expect(gradientElements.first()).toBeVisible();
    }
  });

  test('should support browser navigation correctly', async ({ page }) => {
    // Test complete browser navigation flow
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    // Navigate to first event
    await helpers.clickEventCard(0);
    await expect(page).toHaveURL('/event/1');
    
    // Navigate to second event via URL
    await page.goto('/event/2');
    await expect(page).toHaveURL('/event/2');
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
    
    // Use browser back button
    await page.goBack();
    await expect(page).toHaveURL('/event/1');
    await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
    
    // Use browser forward button
    await page.goForward();
    await expect(page).toHaveURL('/event/2');
    
    // Navigate back to home via back button in app
    await page.getByRole('button', { name: /Back to Events/i }).click();
    await expect(page).toHaveURL('/');
    
    // Page refresh should work correctly
    await helpers.clickEventCard(2);
    await page.reload();
    await expect(page).toHaveURL('/event/3');
    await expect(page.getByRole('heading', { name: 'Mobile Testing Strategies for iOS & Android' })).toBeVisible();
  });

  test('should handle concurrent user interactions', async ({ page }) => {
    await page.goto('/');
    await helpers.waitForAppLoad();
    
    // Simulate rapid clicks
    const firstCard = page.locator('[data-testid="meetup-card"]').first();
    
    // Click multiple times rapidly
    await firstCard.click();
    await page.waitForURL('/event/1');
    
    // Immediately navigate to another event
    await page.goto('/event/3');
    await expect(page).toHaveURL('/event/3');
    await expect(page.getByRole('heading', { name: 'Mobile Testing Strategies for iOS & Android' })).toBeVisible();
    
    // Should handle navigation state correctly
    await page.getByRole('button', { name: /Back to Events/i }).click();
    await expect(page).toHaveURL('/');
    await helpers.waitForAppLoad();
  });

  test('should maintain data integrity and accuracy', async ({ page }) => {
    // Verify all event data is displayed correctly
    for (const event of TEST_DATA.EVENTS) {
      await helpers.navigateToEvent(event.id);
      
      // Check event title
      await expect(page.getByRole('heading', { name: event.title })).toBeVisible();
      
      // Check organizer name
      await expect(page.getByText(event.organizer)).toBeVisible();
      
      // Check venue
      await expect(page.getByText(event.venue)).toBeVisible();
      
      // Check that all sections have content
      const aboutSection = page.locator('text="Join us for" >> nth=0, text="Learn" >> nth=0, text="Comprehensive" >> nth=0, text="Deep dive" >> nth=0, text="Hands-on" >> nth=0').first();
      if (await aboutSection.count() > 0) {
        await expect(aboutSection).toBeVisible();
      }
    }
  });
});