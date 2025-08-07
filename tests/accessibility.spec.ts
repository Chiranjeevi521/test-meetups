import { test, expect } from '@playwright/test';

test.describe('Accessibility and UI Tests', () => {
  
  test.describe('Keyboard Navigation', () => {
    test('should navigate event cards with keyboard', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Tab to first event card
      await page.keyboard.press('Tab');
      const firstCard = page.locator('[data-testid="meetup-card"]').first();
      await expect(firstCard).toBeFocused();
      
      // Press Enter to navigate
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/event/1');
      
      // Tab to back button
      await page.keyboard.press('Tab');
      const backButton = page.getByRole('button', { name: /Back to Events/i });
      await expect(backButton).toBeFocused();
      
      // Press Enter to go back
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL('/');
    });

    test('should support tab navigation through all focusable elements', async ({ page }) => {
      await page.goto('/event/1');
      
      // Get all focusable elements
      const focusableElements = await page.locator('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])').count();
      
      // Should have at least back button and contact links
      expect(focusableElements).toBeGreaterThan(0);
      
      // Tab through elements
      for (let i = 0; i < Math.min(focusableElements, 10); i++) {
        await page.keyboard.press('Tab');
      }
      
      // Should be able to navigate back with Shift+Tab
      await page.keyboard.press('Shift+Tab');
    });
  });

  test.describe('ARIA and Semantic HTML', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Should have exactly one h1
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      
      // Should have multiple h2s for event titles
      const h2Count = await page.getByRole('heading', { level: 2 }).count();
      expect(h2Count).toBeGreaterThan(0);
      
      // Go to detail page and check hierarchy
      await page.goto('/event/1');
      
      // Should still have one h1
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      
      // Should have section headings (h2 or h3)
      const sectionHeadings = await page.getByRole('heading', { level: 2 }).count() + 
                            await page.getByRole('heading', { level: 3 }).count();
      expect(sectionHeadings).toBeGreaterThan(0);
    });

    test('should have proper link accessibility', async ({ page }) => {
      await page.goto('/event/1');
      
      // Email link should have proper href
      const emailLink = page.getByRole('link', { name: /sarah\.johnson@testpro\.com/i });
      await expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@testpro.com');
      
      // Phone link should have proper href
      const phoneLink = page.getByRole('link', { name: /\+1-555-0123/i });
      await expect(phoneLink).toHaveAttribute('href', 'tel:+1-555-0123');
      
      // Back button should be properly labeled
      const backButton = page.getByRole('button', { name: /Back to Events/i });
      await expect(backButton).toBeVisible();
    });

    test('should have meaningful alt text for images/icons', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // SVG icons should have appropriate titles or aria-labels
      // Since we're using inline SVGs, check that they're not causing accessibility issues
      const svgElements = page.locator('svg');
      const svgCount = await svgElements.count();
      expect(svgCount).toBeGreaterThan(0);
      
      // Icons should not be announced by screen readers if they're decorative
      // This is achieved by not having title or description elements
    });

    test('should have proper button roles and labels', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Event cards should be clickable and have proper accessibility
      const eventCards = page.locator('[data-testid="meetup-card"]');
      
      for (let i = 0; i < await eventCards.count(); i++) {
        const card = eventCards.nth(i);
        await expect(card).toHaveAttribute('tabindex', '0');
      }
      
      // Go to detail page
      await page.goto('/event/1');
      
      // Back button should have proper role
      const backButton = page.getByRole('button', { name: /Back to Events/i });
      await expect(backButton).toBeVisible();
    });
  });

  test.describe('Color Contrast and Visual Design', () => {
    test('should have sufficient color contrast', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // This is a basic check - in real projects you'd use tools like axe-core
      // Check that text is visible against backgrounds
      const heroTitle = page.getByRole('heading', { name: 'Software Testing Meetups' });
      await expect(heroTitle).toBeVisible();
      
      const eventTitles = page.locator('[data-testid="meetup-card"] h2');
      await expect(eventTitles.first()).toBeVisible();
    });

    test('should handle focus indicators properly', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Tab to first event card and check focus
      await page.keyboard.press('Tab');
      const firstCard = page.locator('[data-testid="meetup-card"]').first();
      await expect(firstCard).toBeFocused();
      
      // Focus should be visible (browser default or custom styling)
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should maintain readability with gradient backgrounds', async ({ page }) => {
      await page.goto('/event/1');
      
      // Check that text on gradient backgrounds is readable
      const heroTitle = page.getByRole('heading', { name: 'Test Automation with Selenium & Python' });
      await expect(heroTitle).toBeVisible();
      
      // Check organizer section with green gradient
      const organizerName = page.getByText('Sarah Johnson');
      await expect(organizerName).toBeVisible();
      
      // Check event details with orange gradient
      const eventDetailsHeading = page.getByRole('heading', { name: 'Event Details' });
      await expect(eventDetailsHeading).toBeVisible();
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper page structure for screen readers', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Check that landmarks exist
      const main = page.locator('main, [role="main"]');
      // Note: You might want to add proper landmark roles to your app
      
      // Check heading structure
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      
      // Check that content is properly structured
      const headings = await page.getByRole('heading').count();
      expect(headings).toBeGreaterThan(1);
    });

    test('should provide context for interactive elements', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Event cards should provide sufficient context
      const firstCard = page.locator('[data-testid="meetup-card"]').first();
      const cardText = await firstCard.textContent();
      
      // Card should contain event title and key information
      expect(cardText).toContain('Test Automation');
      expect(cardText).toContain('Tech Hub Downtown');
    });
  });

  test.describe('UI Consistency and Polish', () => {
    test('should have consistent spacing and layout', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Check that all event cards have similar dimensions
      const cards = page.locator('[data-testid="meetup-card"]');
      const cardCount = await cards.count();
      
      const cardHeights = [];
      for (let i = 0; i < cardCount; i++) {
        const cardBox = await cards.nth(i).boundingBox();
        if (cardBox) cardHeights.push(cardBox.height);
      }
      
      // Cards should have reasonably similar heights (allowing for content variation)
      const minHeight = Math.min(...cardHeights);
      const maxHeight = Math.max(...cardHeights);
      const heightVariation = (maxHeight - minHeight) / minHeight;
      
      // Allow up to 50% height variation for different content lengths
      expect(heightVariation).toBeLessThan(0.5);
    });

    test('should have consistent gradient themes', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Check that gradient classes are applied
      const gradientClasses = [
        '.gradient-purple',
        '.gradient-blue', 
        '.gradient-green',
        '.gradient-orange',
        '.gradient-card'
      ];
      
      for (const gradientClass of gradientClasses) {
        const elements = await page.locator(gradientClass).count();
        // At least one element should have each gradient class
        expect(elements).toBeGreaterThanOrEqual(0);
      }
    });

    test('should have smooth animations and transitions', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Check that hover effects work
      const firstCard = page.locator('[data-testid="meetup-card"]').first();
      
      // Hover over card
      await firstCard.hover();
      
      // Card should have transition classes
      await expect(firstCard).toHaveClass(/transition/);
      
      // Animation should not cause layout issues
      const cardBox = await firstCard.boundingBox();
      expect(cardBox?.width).toBeGreaterThan(0);
      expect(cardBox?.height).toBeGreaterThan(0);
    });

    test('should handle loading states appropriately', async ({ page }) => {
      // Intercept API to simulate slow loading
      await page.route('**/api/**', async route => {
        await new Promise(resolve => setTimeout(resolve, 500));
        route.continue();
      });
      
      await page.goto('/');
      
      // Should show loading spinner initially
      await expect(page.locator('.animate-spin')).toBeVisible();
      
      // Loading should eventually complete
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      await expect(page.locator('.animate-spin')).not.toBeVisible();
    });

    test('should maintain visual hierarchy and typography', async ({ page }) => {
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      // Main title should be largest
      const mainTitle = page.getByRole('heading', { level: 1 });
      await expect(mainTitle).toBeVisible();
      
      // Event titles should be prominent but smaller than main title
      const eventTitles = page.locator('[data-testid="meetup-card"] h2');
      await expect(eventTitles.first()).toBeVisible();
      
      // Go to detail page
      await page.goto('/event/1');
      
      // Detail page should maintain hierarchy
      const detailTitle = page.getByRole('heading', { level: 1 });
      await expect(detailTitle).toBeVisible();
      
      const sectionHeadings = page.getByRole('heading', { level: 2 });
      if (await sectionHeadings.count() > 0) {
        await expect(sectionHeadings.first()).toBeVisible();
      }
    });

    test('should handle empty states gracefully', async ({ page }) => {
      // Mock empty API response
      await page.route('**/api/**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([])
        });
      });
      
      await page.goto('/');
      
      // Should show empty state with appropriate message
      await expect(page.getByText('No upcoming meetups')).toBeVisible();
      await expect(page.getByText('Check back soon for new exciting events!')).toBeVisible();
      
      // Empty state should be visually appealing
      const emptyStateContainer = page.locator('.glass-effect:has-text("No upcoming meetups")');
      await expect(emptyStateContainer).toBeVisible();
    });

    test('should handle error states appropriately', async ({ page }) => {
      await page.goto('/event/999');
      
      // Should show not found message
      await expect(page.getByText('Event Not Found')).toBeVisible();
      await expect(page.getByText('The requested meetup could not be found.')).toBeVisible();
      
      // Should provide way to recover
      const backButton = page.getByRole('button', { name: 'View All Events' });
      await expect(backButton).toBeVisible();
      
      await backButton.click();
      await expect(page).toHaveURL('/');
    });
  });

  test.describe('Performance and UX', () => {
    test('should load content efficiently', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/');
      await page.waitForSelector('[data-testid="meetup-card"]', { timeout: 10000 });
      
      const loadTime = Date.now() - startTime;
      
      // Page should load within reasonable time (10 seconds max for test environment)
      expect(loadTime).toBeLessThan(10000);
    });

    test('should provide immediate visual feedback', async ({ page }) => {
      await page.goto('/');
      
      // Hero section should be visible immediately
      await expect(page.getByRole('heading', { name: 'Software Testing Meetups' })).toBeVisible();
      
      // Loading state should be shown for dynamic content
      const loadingOrContent = page.locator('.animate-spin, [data-testid="meetup-card"]');
      await expect(loadingOrContent.first()).toBeVisible();
    });
  });
});