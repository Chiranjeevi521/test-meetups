import { Page, expect } from '@playwright/test';

/**
 * Essential helper functions for Playwright tests
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
   * Click on an event card by index
   */
  async clickEventCard(index: number) {
    await this.waitForAppLoad();
    const cards = this.page.locator('[data-testid="meetup-card"]');
    await cards.nth(index).click();
  }

  /**
   * Wait for loading to complete
   */
  async waitForLoadingComplete() {
    await this.page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });
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
}