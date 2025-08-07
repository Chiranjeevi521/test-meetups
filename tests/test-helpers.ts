import { Page, expect } from '@playwright/test';

/**
 * Helper functions for Playwright tests
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for the application to be fully loaded
   */
  async waitForAppLoad() {
    await this.page.waitForSelector('[data-testid="meetup-card"], .animate-spin', { timeout: 10000 });
  }

  /**
   * Navigate to a specific event detail page
   */
  async navigateToEvent(eventId: string) {
    await this.page.goto(`/event/${eventId}`);
  }

  /**
   * Click on an event card by index
   */
  async clickEventCard(index: number) {
    await this.waitForAppLoad();
    const cards = this.page.locator('[data-testid="meetup-card"]');
    await cards.nth(index).click();
  }

  /**
   * Check if loading spinner is visible
   */
  async isLoading() {
    return await this.page.locator('.animate-spin').isVisible();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    await this.page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });
  }

  /**
   * Get the number of event cards displayed
   */
  async getEventCardCount() {
    await this.waitForAppLoad();
    return await this.page.locator('[data-testid="meetup-card"]').count();
  }

  /**
   * Check if an element is properly focused
   */
  async isElementFocused(selector: string) {
    const element = this.page.locator(selector);
    return await element.evaluate((el) => document.activeElement === el);
  }

  /**
   * Simulate slow network conditions
   */
  async simulateSlowNetwork() {
    await this.page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      route.continue();
    });
  }

  /**
   * Mock empty API response
   */
  async mockEmptyResponse() {
    await this.page.route('**/api/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      });
    });
  }

  /**
   * Mock API error
   */
  async mockApiError() {
    await this.page.route('**/api/**', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string, fullPage = false) {
    await this.page.screenshot({
      path: `tests/screenshots/${name}.png`,
      fullPage
    });
  }

  /**
   * Check if all expected events are displayed
   */
  async verifyAllEventsDisplayed() {
    const expectedEventTitles = [
      'Test Automation with Selenium & Python',
      'API Testing Workshop with Postman & Newman',
      'Mobile Testing Strategies for iOS & Android',
      'Performance Testing with JMeter',
      'Behavior Driven Development with Cucumber'
    ];

    await this.waitForAppLoad();
    
    for (const title of expectedEventTitles) {
      await expect(this.page.getByText(title)).toBeVisible();
    }
  }

  /**
   * Navigate through all events and verify they load correctly
   */
  async verifyAllEventDetails() {
    const eventIds = ['1', '2', '3', '4', '5'];
    const expectedTitles = [
      'Test Automation with Selenium & Python',
      'API Testing Workshop with Postman & Newman',
      'Mobile Testing Strategies for iOS & Android',
      'Performance Testing with JMeter',
      'Behavior Driven Development with Cucumber'
    ];

    for (let i = 0; i < eventIds.length; i++) {
      await this.navigateToEvent(eventIds[i]);
      await expect(this.page.getByRole('heading', { name: expectedTitles[i] })).toBeVisible();
      
      // Verify essential sections are present
      await expect(this.page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
      await expect(this.page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
      await expect(this.page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
      await expect(this.page.getByRole('heading', { name: 'Location' })).toBeVisible();
    }
  }

  /**
   * Test keyboard navigation through event cards
   */
  async testKeyboardNavigation() {
    await this.page.goto('/');
    await this.waitForAppLoad();
    
    // Tab to first event card
    await this.page.keyboard.press('Tab');
    const firstCard = this.page.locator('[data-testid="meetup-card"]').first();
    await expect(firstCard).toBeFocused();
    
    // Test Enter key navigation
    await this.page.keyboard.press('Enter');
    await expect(this.page).toHaveURL('/event/1');
    
    // Test back navigation
    await this.page.keyboard.press('Tab');
    const backButton = this.page.getByRole('button', { name: /Back to Events/i });
    await expect(backButton).toBeFocused();
    
    await this.page.keyboard.press('Enter');
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Verify responsive layout at different viewport sizes
   */
  async testResponsiveLayout() {
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1366, height: 768 }
    ];

    for (const viewport of viewports) {
      await this.page.setViewportSize({ width: viewport.width, height: viewport.height });
      await this.page.goto('/');
      await this.waitForAppLoad();
      
      // Verify main content is visible
      await expect(this.page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
      await expect(this.page.locator('[data-testid="meetup-card"]')).toHaveCount(5);
      
      // Take screenshot for visual regression testing
      await this.takeScreenshot(`responsive-${viewport.name.toLowerCase()}`, true);
    }
  }

  /**
   * Check for common accessibility issues
   */
  async checkBasicAccessibility() {
    // Check heading hierarchy
    await expect(this.page.getByRole('heading', { level: 1 })).toHaveCount(1);
    
    // Check that interactive elements are focusable
    const interactiveElements = this.page.locator('button, a[href], [tabindex]:not([tabindex="-1"])');
    const count = await interactiveElements.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that images have alt text or are decorative
    const images = this.page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const image = images.nth(i);
        const hasAlt = await image.getAttribute('alt');
        const hasAriaLabel = await image.getAttribute('aria-label');
        const isDecorative = await image.getAttribute('role');
        
        // Image should have alt text, aria-label, or be marked as decorative
        expect(hasAlt !== null || hasAriaLabel !== null || isDecorative === 'presentation').toBeTruthy();
      }
    }
  }

  /**
   * Verify gradient backgrounds are applied correctly
   */
  async verifyGradientBackgrounds() {
    await this.page.goto('/');
    await this.waitForAppLoad();
    
    // Check that gradient classes exist
    const gradientClasses = [
      '.gradient-bg',
      '.gradient-purple',
      '.gradient-blue',
      '.gradient-green',
      '.gradient-orange',
      '.gradient-card'
    ];
    
    for (const gradientClass of gradientClasses) {
      const elements = await this.page.locator(gradientClass).count();
      expect(elements).toBeGreaterThanOrEqual(0);
    }
    
    // Check glass effects
    const glassElements = await this.page.locator('.glass-effect').count();
    expect(glassElements).toBeGreaterThan(0);
  }

  /**
   * Test error handling scenarios
   */
  async testErrorScenarios() {
    // Test 404 page
    await this.page.goto('/event/999');
    await expect(this.page.getByText('Event Not Found')).toBeVisible();
    
    // Test recovery from error
    await this.page.getByRole('button', { name: 'View All Events' }).click();
    await expect(this.page).toHaveURL('/');
    
    // Test invalid routes
    await this.page.goto('/non-existent-route');
    await expect(this.page).toHaveURL('/'); // Should redirect to home
  }
}

/**
 * Custom expectations and matchers
 */
export const customExpect = {
  /**
   * Check if an element has a gradient class
   */
  toHaveGradientClass: async (element: any) => {
    const classes = await element.getAttribute('class');
    const hasGradient = classes && classes.includes('gradient-');
    expect(hasGradient).toBeTruthy();
  },

  /**
   * Check if element is within viewport
   */
  toBeInViewport: async (element: any, page: Page) => {
    const box = await element.boundingBox();
    const viewport = page.viewportSize();
    
    if (box && viewport) {
      const isInViewport = box.x >= 0 && 
                          box.y >= 0 && 
                          box.x + box.width <= viewport.width && 
                          box.y + box.height <= viewport.height;
      expect(isInViewport).toBeTruthy();
    }
  }
};

/**
 * Test data constants
 */
export const TEST_DATA = {
  EVENTS: [
    {
      id: '1',
      title: 'Test Automation with Selenium & Python',
      organizer: 'Sarah Johnson',
      venue: 'Tech Hub Downtown, Conference Room A'
    },
    {
      id: '2',
      title: 'API Testing Workshop with Postman & Newman',
      organizer: 'Mike Chen',
      venue: 'Innovation Center, Room 305'
    },
    {
      id: '3',
      title: 'Mobile Testing Strategies for iOS & Android',
      organizer: 'Lisa Rodriguez',
      venue: 'Digital Campus, Auditorium B'
    },
    {
      id: '4',
      title: 'Performance Testing with JMeter',
      organizer: 'David Kumar',
      venue: 'Startup Incubator, Meeting Room 1'
    },
    {
      id: '5',
      title: 'Behavior Driven Development with Cucumber',
      organizer: 'Jennifer Thompson',
      venue: 'Community College, Lab 204'
    }
  ],
  
  VIEWPORT_SIZES: {
    MOBILE_PORTRAIT: { width: 375, height: 667 },
    MOBILE_LANDSCAPE: { width: 667, height: 375 },
    TABLET_PORTRAIT: { width: 768, height: 1024 },
    TABLET_LANDSCAPE: { width: 1024, height: 768 },
    DESKTOP_SMALL: { width: 1366, height: 768 },
    DESKTOP_LARGE: { width: 1920, height: 1080 }
  }
};