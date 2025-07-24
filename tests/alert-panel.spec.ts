import { test, expect } from '@playwright/test';

test.describe('Alert Panel Example - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load and navigation to be available
    await page.waitForSelector('.nav-links');
    
    // Navigate to the Alert Panel component
    await page.click('text=Alert Panel Demo');
    
    // Wait for the component to load
    await page.waitForSelector('text=Alert Panel Examples');
  });

  test('should render the main page structure', async ({ page }) => {
    // Check main heading
    await expect(page.getByText('Alert Panel Examples')).toBeVisible();
    
    // Check URL selector
    await expect(page.getByLabel('Current URL:')).toBeVisible();
    await expect(page.getByLabel('Current URL:')).toHaveValue('/dashboard');
    
    // Check show/hide button
    await expect(page.getByRole('button', { name: 'Hide Alerts' })).toBeVisible();
    
    // Check features section
    await expect(page.getByText('Features Demonstrated:')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Current URL: /dashboard' })).toBeVisible();
  });

  test('should display all alert types by default', async ({ page }) => {
    // Check that all alert types are visible
    await expect(page.getByText('Your changes have been saved successfully!')).toBeVisible();
    await expect(page.getByText('Error', { exact: true })).toBeVisible();
    await expect(page.getByText('An error occurred while processing your request. Please try again.')).toBeVisible();
    await expect(page.getByText('Information', { exact: true })).toBeVisible();
    await expect(page.getByText('This is an informational message about the current page.')).toBeVisible();
    await expect(page.getByText('Warning', { exact: true })).toBeVisible();
    await expect(page.getByText('Please review your input before proceeding with the action.')).toBeVisible();
    await expect(page.getByText('Important Notice')).toBeVisible();
    await expect(page.getByText('This alert cannot be dismissed and will always be visible.')).toBeVisible();
  });

  test('should have dismissible alerts with working dismiss buttons', async ({ page }) => {
    // Count dismiss buttons (should be 4 dismissible alerts based on actual component)
    const dismissButtons = page.locator('button[aria-label="Dismiss alert"]');
    await expect(dismissButtons).toHaveCount(4);
    
    // Test dismissing the first alert (success alert)
    const firstDismissButton = dismissButtons.first();
    await firstDismissButton.click();
    
    // The success alert should be dismissed
    await expect(page.getByText('Your changes have been saved successfully!')).not.toBeVisible();
    
    // Other alerts should still be visible
    await expect(page.getByText('Error', { exact: true })).toBeVisible();
    await expect(page.getByText('Information', { exact: true })).toBeVisible();
  });

  test('should have non-dismissible alert without dismiss button', async ({ page }) => {
    // The "Important Notice" alert should not have a dismiss button
    const importantNoticeAlert = page.locator('text=Important Notice').locator('..');
    const dismissButtonInImportantAlert = importantNoticeAlert.locator('button[aria-label="Dismiss alert"]');
    
    await expect(dismissButtonInImportantAlert).toHaveCount(0);
  });

  test('should hide all alerts when hide button is clicked', async ({ page }) => {
    // Initially all alerts should be visible
    await expect(page.getByText('Your changes have been saved successfully!')).toBeVisible();
    await expect(page.getByText('Error', { exact: true })).toBeVisible();
    await expect(page.getByText('Information', { exact: true })).toBeVisible();
    
    // Click hide button
    await page.getByRole('button', { name: 'Hide Alerts' }).click();
    
    // All alerts should be hidden
    await expect(page.getByText('Your changes have been saved successfully!')).not.toBeVisible();
    await expect(page.getByText('Error', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Information', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Warning', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Important Notice')).not.toBeVisible();
    
    // Button text should change
    await expect(page.getByRole('button', { name: 'Show Alerts' })).toBeVisible();
  });

  test('should show alerts when show button is clicked', async ({ page }) => {
    // First hide the alerts
    await page.getByRole('button', { name: 'Hide Alerts' }).click();
    
    // Verify alerts are hidden
    await expect(page.getByText('Your changes have been saved successfully!')).not.toBeVisible();
    
    // Click show button
    await page.getByRole('button', { name: 'Show Alerts' }).click();
    
    // Alerts should be visible again
    await expect(page.getByText('Your changes have been saved successfully!')).toBeVisible();
    await expect(page.getByText('Error', { exact: true })).toBeVisible();
    await expect(page.getByText('Information', { exact: true })).toBeVisible();
    
    // Button text should change back
    await expect(page.getByRole('button', { name: 'Hide Alerts' })).toBeVisible();
  });

  test('should update URL selector and display current URL', async ({ page }) => {
    // Check initial URL
    await expect(page.getByLabel('Current URL:')).toHaveValue('/dashboard');
    await expect(page.getByRole('heading', { name: 'Current URL: /dashboard' })).toBeVisible();
    
    // Change URL to user page
    await page.getByLabel('Current URL:').selectOption('/users/123');
    
    // Check URL is updated
    await expect(page.getByLabel('Current URL:')).toHaveValue('/users/123');
    await expect(page.getByRole('heading', { name: 'Current URL: /users/123' })).toBeVisible();
    
    // Change URL to admin page
    await page.getByLabel('Current URL:').selectOption('/admin/settings');
    
    // Check URL is updated
    await expect(page.getByLabel('Current URL:')).toHaveValue('/admin/settings');
    await expect(page.getByRole('heading', { name: 'Current URL: /admin/settings' })).toBeVisible();
  });

  test('should show user profile alert only on user pages', async ({ page }) => {
    // Initially on dashboard, user profile alert should not be visible
    await expect(page.getByText('User Profile', { exact: true })).not.toBeVisible();
    await expect(page.getByText('This alert only appears on user profile pages (URL pattern: /users/:id)')).not.toBeVisible();
    
    // Change to user page
    await page.getByLabel('Current URL:').selectOption('/users/123');
    
    // User profile alert should now be visible
    await expect(page.getByText('User Profile', { exact: true })).toBeVisible();
    await expect(page.getByText('This alert only appears on user profile pages (URL pattern: /users/:id)')).toBeVisible();
    
    // Change back to dashboard
    await page.getByLabel('Current URL:').selectOption('/dashboard');
    
    // User profile alert should be hidden again
    await expect(page.getByText('User Profile', { exact: true })).not.toBeVisible();
    await expect(page.getByText('This alert only appears on user profile pages (URL pattern: /users/:id)')).not.toBeVisible();
  });

  test('should show admin notice alert only on admin pages', async ({ page }) => {
    // Initially on dashboard, admin notice alert should not be visible
    await expect(page.getByText('Admin Notice', { exact: true })).not.toBeVisible();
    await expect(page.getByText('This alert only appears on admin pages (URL pattern: /admin/:section)')).not.toBeVisible();
    
    // Change to admin page
    await page.getByLabel('Current URL:').selectOption('/admin/settings');
    
    // Admin notice alert should now be visible
    await expect(page.getByText('Admin Notice', { exact: true })).toBeVisible();
    await expect(page.getByText('This alert only appears on admin pages (URL pattern: /admin/:section)')).toBeVisible();
    
    // Change to profile page
    await page.getByLabel('Current URL:').selectOption('/profile');
    
    // Admin notice alert should be hidden
    await expect(page.getByText('Admin Notice', { exact: true })).not.toBeVisible();
    await expect(page.getByText('This alert only appears on admin pages (URL pattern: /admin/:section)')).not.toBeVisible();
  });

  test('should have all expected URL options in dropdown', async ({ page }) => {
    const urlSelect = page.getByLabel('Current URL:');
    
    // Check all options are present by checking their values
    await expect(urlSelect.locator('option[value="/dashboard"]')).toHaveCount(1);
    await expect(urlSelect.locator('option[value="/users/123"]')).toHaveCount(1);
    await expect(urlSelect.locator('option[value="/admin/settings"]')).toHaveCount(1);
    await expect(urlSelect.locator('option[value="/profile"]')).toHaveCount(1);
  });

  test('should maintain alert visibility state when changing URLs', async ({ page }) => {
    // Hide alerts first
    await page.getByRole('button', { name: 'Hide Alerts' }).click();
    
    // Change URL to user page
    await page.getByLabel('Current URL:').selectOption('/users/123');
    
    // Alerts should still be hidden
    await expect(page.getByText('User Profile', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Your changes have been saved successfully!')).not.toBeVisible();
    
    // Show alerts again
    await page.getByRole('button', { name: 'Show Alerts' }).click();
    
    // User profile alert should now be visible
    await expect(page.getByText('User Profile', { exact: true })).toBeVisible();
    await expect(page.getByText('Your changes have been saved successfully!')).toBeVisible();
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check dismiss buttons have proper aria-label
    const dismissButtons = page.locator('button[aria-label="Dismiss alert"]');
    await expect(dismissButtons.first()).toHaveAttribute('aria-label', 'Dismiss alert');
    
    // Check URL selector has proper label
    await expect(page.getByLabel('Current URL:')).toBeVisible();
    
    // Check alerts have proper role (5 alerts based on actual component)
    const alerts = page.locator('[role="alert"]');
    await expect(alerts).toHaveCount(5); // 5 alerts (success, danger, info, warning, important notice)
  });

  test('should display features list correctly', async ({ page }) => {
    // Check all feature items are displayed
    await expect(page.getByText('✅ Four alert types: success, danger, info, warning')).toBeVisible();
    await expect(page.getByText('✅ Dismissible alerts with callback support')).toBeVisible();
    await expect(page.getByText('✅ URL pattern matching for conditional display')).toBeVisible();
    await expect(page.getByText('✅ Custom titles and messages')).toBeVisible();
    await expect(page.getByText('✅ Responsive design')).toBeVisible();
    await expect(page.getByText('✅ Accessibility features')).toBeVisible();
  });

  test('should handle multiple dismiss operations', async ({ page }) => {
    const dismissButtons = page.locator('button[aria-label="Dismiss alert"]');
    
    // Dismiss multiple alerts
    await dismissButtons.nth(0).click(); // Success alert
    await dismissButtons.nth(0).click(); // Danger alert (now first after success is gone)
    await dismissButtons.nth(0).click(); // Info alert
    
    // Check that alerts are dismissed
    await expect(page.getByText('Your changes have been saved successfully!')).not.toBeVisible();
    await expect(page.getByText('Error', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Information', { exact: true })).not.toBeVisible();
    
    // Remaining alerts should still be visible
    await expect(page.getByText('Warning', { exact: true })).toBeVisible();
    await expect(page.getByText('Important Notice')).toBeVisible();
  });

  test('should work with different URL patterns', async ({ page }) => {
    // Test user pattern
    await page.getByLabel('Current URL:').selectOption('/users/123');
    await expect(page.getByText('User Profile', { exact: true })).toBeVisible();
    
    // Test admin pattern
    await page.getByLabel('Current URL:').selectOption('/admin/settings');
    await expect(page.getByText('Admin Notice', { exact: true })).toBeVisible();
    
    // Test profile pattern (no conditional alerts)
    await page.getByLabel('Current URL:').selectOption('/profile');
    await expect(page.getByText('User Profile', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Admin Notice', { exact: true })).not.toBeVisible();
    
    // Test dashboard pattern (no conditional alerts)
    await page.getByLabel('Current URL:').selectOption('/dashboard');
    await expect(page.getByText('User Profile', { exact: true })).not.toBeVisible();
    await expect(page.getByText('Admin Notice', { exact: true })).not.toBeVisible();
  });
}); 