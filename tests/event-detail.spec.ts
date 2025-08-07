import { test, expect } from '@playwright/test';

test.describe('Event Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the first event detail page
    await page.goto('/event/1');
  });

  test('should display the back button and navigate to event list', async ({ page }) => {
    // Check back button is visible
    const backButton = page.getByRole('button', { name: /Back to Events/i });
    await expect(backButton).toBeVisible();
    
    // Click back button and verify navigation
    await backButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should display event hero section with title and details', async ({ page }) => {
    // Check event title
    await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
    
    // Check date is displayed
    await expect(page.getByText(/Sunday, September 15, 2024/)).toBeVisible();
    
    // Check time is displayed
    await expect(page.getByText('18:00')).toBeVisible();
    
    // Check venue is displayed
    await expect(page.getByText('Tech Hub Downtown, Conference Room A')).toBeVisible();
  });

  test('should display event description section', async ({ page }) => {
    // Check "About This Event" heading
    await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
    
    // Check description content
    await expect(page.getByText(/Join us for an in-depth workshop/)).toBeVisible();
    await expect(page.getByText(/advanced techniques including page object model/)).toBeVisible();
  });

  test('should display organizer information correctly', async ({ page }) => {
    // Check organizer section heading
    await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
    
    // Check organizer name
    await expect(page.getByText('Sarah Johnson')).toBeVisible();
    
    // Check organizer email
    const emailLink = page.getByRole('link', { name: 'sarah.johnson@testpro.com' });
    await expect(emailLink).toBeVisible();
    await expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@testpro.com');
    
    // Check organizer phone
    const phoneLink = page.getByRole('link', { name: '+1-555-0123' });
    await expect(phoneLink).toBeVisible();
    await expect(phoneLink).toHaveAttribute('href', 'tel:+1-555-0123');
  });

  test('should display event details section', async ({ page }) => {
    // Check event details heading
    await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
    
    // Check date field
    await expect(page.getByText('Date:')).toBeVisible();
    
    // Check time field
    await expect(page.getByText('Time:')).toBeVisible();
    
    // Check venue field
    await expect(page.getByText('Venue:')).toBeVisible();
  });

  test('should display map placeholder section', async ({ page }) => {
    // Check location section heading
    await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    
    // Check map placeholder text
    await expect(page.getByText('Interactive Map')).toBeVisible();
    await expect(page.getByText('Map showing Tech Hub Downtown location at 123 Main St')).toBeVisible();
  });

  test('should handle different event IDs correctly', async ({ page }) => {
    // Test second event
    await page.goto('/event/2');
    
    await expect(page.getByRole('heading', { name: 'API Testing Workshop with Postman & Newman' })).toBeVisible();
    await expect(page.getByText('Mike Chen')).toBeVisible();
    await expect(page.getByText('Innovation Center, Room 305')).toBeVisible();
  });

  test('should show loading state initially', async ({ page }) => {
    // Intercept and delay API calls
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      route.continue();
    });
    
    await page.goto('/event/1');
    
    // Check loading spinner is visible initially
    await expect(page.locator('.animate-spin')).toBeVisible();
  });

  test('should handle not found event correctly', async ({ page }) => {
    await page.goto('/event/999');
    
    // Check not found message
    await expect(page.getByText('Event Not Found')).toBeVisible();
    await expect(page.getByText('The requested meetup could not be found.')).toBeVisible();
    
    // Check "View All Events" button
    const viewAllButton = page.getByRole('button', { name: 'View All Events' });
    await expect(viewAllButton).toBeVisible();
    
    // Click button and verify navigation
    await viewAllButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should have proper gradient backgrounds', async ({ page }) => {
    // Check hero section has gradient
    const heroSection = page.locator('.gradient-card').first();
    await expect(heroSection).toBeVisible();
    
    // Check organizer section has green gradient
    const organizerHeader = page.locator('.gradient-green').first();
    await expect(organizerHeader).toBeVisible();
    
    // Check event details section has orange gradient
    const detailsHeader = page.locator('.gradient-orange').first();
    await expect(detailsHeader).toBeVisible();
    
    // Check location section has purple gradient
    const locationHeader = page.locator('.gradient-purple').first();
    await expect(locationHeader).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that content is still visible and readable
    await expect(page.getByRole('heading', { name: 'Test Automation with Selenium & Python' })).toBeVisible();
    
    // Check that sidebar content stacks properly on mobile
    const organizerSection = page.getByRole('heading', { name: 'Event Organizer' });
    const detailsSection = page.getByRole('heading', { name: 'Event Details' });
    
    await expect(organizerSection).toBeVisible();
    await expect(detailsSection).toBeVisible();
  });

  test('should have glass morphism effects', async ({ page }) => {
    // Check for glass effect classes
    const glassElements = page.locator('.glass-effect');
    await expect(glassElements.first()).toBeVisible();
  });

  test('should display all required icons', async ({ page }) => {
    // Check date icon
    const dateIcon = page.locator('svg:has(path[d*="M8 7V3a2 2"])');
    await expect(dateIcon.first()).toBeVisible();
    
    // Check time icon
    const timeIcon = page.locator('svg:has(path[d*="M12 8v4l3 3"])');
    await expect(timeIcon.first()).toBeVisible();
    
    // Check location icons
    const locationIcon = page.locator('svg:has(path[d*="M17.657 16.657"])');
    await expect(locationIcon.first()).toBeVisible();
    
    // Check organizer person icon
    const personIcon = page.locator('svg:has(path[d*="M16 7a4 4"])');
    await expect(personIcon.first()).toBeVisible();
    
    // Check email icon
    const emailIcon = page.locator('svg:has(path[d*="M3 8l7.89 4.26"])');
    await expect(emailIcon.first()).toBeVisible();
    
    // Check phone icon (if present)
    const phoneIcon = page.locator('svg:has(path[d*="M3 5a2 2"])');
    await expect(phoneIcon.first()).toBeVisible();
  });

  test('should handle navigation via URL parameters', async ({ page }) => {
    // Test different event IDs through URL navigation
    const eventIds = ['1', '2', '3', '4', '5'];
    const expectedTitles = [
      'Test Automation with Selenium & Python',
      'API Testing Workshop with Postman & Newman',
      'Mobile Testing Strategies for iOS & Android',
      'Performance Testing with JMeter',
      'Behavior Driven Development with Cucumber'
    ];
    
    for (let i = 0; i < eventIds.length; i++) {
      await page.goto(`/event/${eventIds[i]}`);
      await expect(page.getByRole('heading', { name: expectedTitles[i] })).toBeVisible();
    }
  });

  test('should have accessible heading hierarchy', async ({ page }) => {
    // Main event title should be h1
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    
    // Section headings should be h2 or h3
    const sectionHeadings = page.getByRole('heading', { level: 2 });
    const subsectionHeadings = page.getByRole('heading', { level: 3 });
    
    // Should have at least one main section heading
    await expect(sectionHeadings.or(subsectionHeadings).first()).toBeVisible();
  });

  test('should have working contact links', async ({ page }) => {
    // Test email link
    const emailLink = page.getByRole('link', { name: 'sarah.johnson@testpro.com' });
    await expect(emailLink).toHaveAttribute('href', 'mailto:sarah.johnson@testpro.com');
    
    // Test phone link
    const phoneLink = page.getByRole('link', { name: '+1-555-0123' });
    await expect(emailLink).toHaveAttribute('href', 'tel:+1-555-0123');
  });

  test('should maintain visual consistency across events', async ({ page }) => {
    // Check that all events have similar layout structure
    const eventIds = ['1', '2', '3'];
    
    for (const id of eventIds) {
      await page.goto(`/event/${id}`);
      
      // Check that key sections exist
      await expect(page.getByRole('heading', { name: 'About This Event' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Organizer' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Event Details' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Location' })).toBeVisible();
    }
  });
});