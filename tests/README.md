# Playwright Test Suite for Testing Meetups App

This directory contains a comprehensive Playwright test suite for the Testing Meetups Angular application.

## Test Structure

### Optimized Test Files

- **`core-functionality.spec.ts`** - Essential end-to-end tests covering complete user workflows
- **`navigation-flow.spec.ts`** - Critical navigation and routing tests
- **`responsive-accessibility.spec.ts`** - Key responsive design and accessibility tests
- **`test-helpers.ts`** - Streamlined helper functions and utilities

### Test Optimization
This test suite has been optimized to focus on the most valuable and reliable test cases:
- **Reduced from 10+ files to 3 focused test files**
- **Removed redundant and duplicate test scenarios**
- **Kept only the highest-value test cases from each category**
- **Cleaned up helper functions to include only essential methods**
- **Improved test reliability and maintainability**

### Test Coverage

#### Functional Tests
- ✅ Event list display and loading states
- ✅ Event detail page content and layout
- ✅ Navigation between pages
- ✅ Error handling (404, empty states)
- ✅ Data integrity and accuracy

#### UI/UX Tests  
- ✅ Responsive design across 7 different viewport sizes
- ✅ Gradient backgrounds and visual themes
- ✅ Glass morphism effects
- ✅ Hover animations and transitions
- ✅ Loading states and user feedback

#### Accessibility Tests
- ✅ Keyboard navigation
- ✅ Screen reader support  
- ✅ Heading hierarchy
- ✅ Focus management
- ✅ Color contrast and visual design
- ✅ ARIA attributes and semantic HTML

#### Performance Tests
- ✅ Page load times
- ✅ Slow network simulation
- ✅ Concurrent user interactions
- ✅ Browser navigation (back/forward)

## Running the Tests

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

### Test Commands

Run all tests:
```bash
npm run test:e2e
```

Run tests with UI mode (recommended for development):
```bash
npm run test:e2e:ui
```

Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

Run tests in debug mode:
```bash
npm run test:e2e:debug
```

Run specific test file:
```bash
npx playwright test event-list.spec.ts
```

Run tests on specific browser:
```bash
npx playwright test --project=chromium
```

Run tests on mobile:
```bash
npx playwright test --project="Mobile Chrome"
```

### Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Screenshots and videos are automatically captured on test failures.

## Test Configuration

### Browser Coverage
- ✅ Desktop Chrome
- ✅ Desktop Firefox  
- ✅ Desktop Safari (WebKit)
- ✅ Microsoft Edge
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### Viewport Testing
- Mobile Portrait (375×667)
- Mobile Landscape (667×375)
- Tablet Portrait (768×1024)
- Tablet Landscape (1024×768)
- Desktop Small (1366×768)
- Desktop Large (1920×1080)
- Ultra Wide (2560×1440)

## Key Test Scenarios

### 1. Smoke Tests (`comprehensive.spec.ts`)
Complete user journey testing covering:
- Page loading and navigation
- Event browsing and selection
- Contact information access
- Error handling and recovery

### 2. Visual Regression Tests (`responsive.spec.ts`)
Screenshots captured at multiple viewport sizes for:
- Event list page layout
- Event detail page layout
- Mobile/tablet/desktop variations

### 3. Accessibility Compliance (`accessibility.spec.ts`)
- WCAG 2.1 AA compliance checks
- Keyboard-only navigation
- Screen reader compatibility
- Focus management
- Color contrast verification

### 4. Navigation Testing (`navigation.spec.ts`)
- Deep linking to event pages
- Browser back/forward navigation
- URL parameter handling
- Route error handling (404s)

### 5. UI Component Testing (`event-list.spec.ts`, `event-detail.spec.ts`)
- Component rendering
- Loading states
- Error states  
- Interactive elements
- Data display accuracy

## Test Data

Tests use mock data matching the production data structure:

- **5 Test Events** covering different testing topics
- **Realistic event details** including dates, venues, organizers
- **Contact information** with email and phone links
- **Venue information** with map placeholders

## Debugging Tests

### Visual Debugging
```bash
npm run test:e2e:ui
```
Opens Playwright Test Runner with visual test execution.

### Step-by-Step Debugging
```bash
npm run test:e2e:debug
```
Runs tests in debug mode with step-by-step execution.

### Screenshots and Videos
Failed tests automatically capture:
- Screenshots at failure point
- Video recordings of test execution
- Network activity logs
- Console error logs

## Continuous Integration

Tests are configured for CI/CD pipelines with:
- Automatic browser installation
- Retry on failure (2 retries in CI)
- Parallel test execution
- HTML report generation
- Screenshot/video artifacts

### CI Configuration
```yaml
# Example GitHub Actions configuration
- name: Run Playwright tests
  run: npx playwright test
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Test Maintenance

### Adding New Tests
1. Create test file in `/tests` directory
2. Use helper functions from `test-helpers.ts`
3. Follow existing naming conventions
4. Add appropriate test coverage

### Updating Tests for New Features
1. Update test data constants in `test-helpers.ts`
2. Add new test scenarios for new functionality
3. Update visual regression baselines if needed
4. Verify accessibility compliance for new elements

### Best Practices
- Use data-testid attributes for reliable element selection
- Implement wait strategies for dynamic content
- Group related tests in describe blocks
- Use helper functions for common operations
- Maintain clear test names and descriptions

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test configuration
   - Check for slow network conditions
   - Verify application is running correctly

2. **Element not found errors**
   - Verify application is fully loaded
   - Check for dynamic content loading
   - Use appropriate wait strategies

3. **Visual differences in screenshots**
   - Update baseline screenshots if intentional
   - Check for browser/OS differences
   - Verify viewport sizes are consistent

### Getting Help
- Check Playwright documentation: https://playwright.dev/
- Review test helper functions in `test-helpers.ts`
- Examine existing test patterns in other spec files