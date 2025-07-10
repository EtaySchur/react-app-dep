import { test, expect } from '@playwright/test';

test.describe('Zod Formik Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    // Navigate to the Zod Formik component
    await page.click('text=Zod + Formik');
  });

  test('should display error mapping modes and switch between them', async ({ page }) => {
    // Check that all error mapping mode buttons are present
    await expect(page.getByTestId('default-map-btn')).toBeVisible();
    await expect(page.getByTestId('business-map-btn')).toBeVisible();
    await expect(page.getByTestId('strict-map-btn')).toBeVisible();
    await expect(page.getByTestId('override-map-btn')).toBeVisible();

    // Check initial mode is default
    await expect(page.getByTestId('active-mode-title')).toContainText('Active Mode: default');

    // Switch to business mode
    await page.getByTestId('business-map-btn').click();
    await expect(page.getByTestId('active-mode-title')).toContainText('Active Mode: business');

    // Switch to strict mode
    await page.getByTestId('strict-map-btn').click();
    await expect(page.getByTestId('active-mode-title')).toContainText('Active Mode: strict');

    // Switch to override mode
    await page.getByTestId('override-map-btn').click();
    await expect(page.getByTestId('active-mode-title')).toContainText('Active Mode: override');
  });

  test('should validate form fields with default error mapping', async ({ page }) => {
    // Ensure we're in default mode
    await page.getByTestId('default-map-btn').click();

    // Try to submit empty form
    await page.getByTestId('submit-btn').click();

    // Wait a moment for validation to complete
    await page.waitForTimeout(500);

    const pageContent = await page.content();
    
    // Check for validation errors
    await expect(page.getByTestId('name-error')).toContainText('String must contain at least 2 character(s)');
    await expect(page.getByTestId('email-error')).toContainText('Invalid email');
  });

  test('should validate form fields with business error mapping', async ({ page }) => {
    // Switch to business mode
    await page.getByTestId('business-map-btn').click();

    // Fill form with invalid data
    await page.getByTestId('name-input').fill('A'); // Too short
    await page.getByTestId('email-input').fill('invalid-email'); // Invalid email
    await page.getByTestId('age-input').fill('15'); // Too young

    // Try to submit
    await page.getByTestId('submit-btn').click();

    // Check for business-friendly error messages (with emojis)
    await expect(page.getByTestId('name-error')).toContainText('⚠️ Minimum 2 characters required for security');
    await expect(page.getByTestId('email-error')).toContainText('📧 Please enter a valid email address');
    await expect(page.getByTestId('age-error')).toContainText('⚠️ Value must be at least 18');
  });

  test('should validate form fields with strict error mapping', async ({ page }) => {
    // Switch to strict mode
    await page.getByTestId('strict-map-btn').click();

    // Fill form with invalid data
    await page.getByTestId('name-input').fill('A'); // Too short
    await page.getByTestId('email-input').fill('invalid-email'); // Invalid email

    // Try to submit
    await page.getByTestId('submit-btn').click();

    // Check for strict error messages
    await expect(page.getByTestId('name-error')).toContainText('STRICT: Field requires minimum 2 characters. No exceptions.');
    await expect(page.getByTestId('email-error')).toContainText('STRICT: Email format is invalid. Check syntax.');
  });

  test('should manage tags array dynamically', async ({ page }) => {
    // Initially should have one tag input
    await expect(page.getByTestId('tag-input-0')).toBeVisible();

    // Add more tags
    await page.getByTestId('add-tag-btn').click();
    await expect(page.getByTestId('tag-input-1')).toBeVisible();

    await page.getByTestId('add-tag-btn').click();
    await expect(page.getByTestId('tag-input-2')).toBeVisible();

    // Fill tags
    await page.getByTestId('tag-input-0').fill('react');
    await page.getByTestId('tag-input-1').fill('typescript');
    await page.getByTestId('tag-input-2').fill('zod');

    // Remove second tag (index 1)
    await page.getByTestId('remove-tag-1').click();
    
    // After removal, what was index 2 becomes index 1
    await expect(page.getByTestId('tag-input-1')).toHaveValue('zod');
  });

  test('should validate tags array with ZodArrayDef', async ({ page }) => {
    // Fill valid form data
    await page.getByTestId('name-input').fill('John Doe');
    await page.getByTestId('email-input').fill('john@example.com');
    await page.getByTestId('age-input').fill('25');

    // Test with no tags (should fail - minimum 2 required)
    await page.getByTestId('tag-input-0').fill('');
    
    // When form is invalid, Formik shows validation errors instead of calling onSubmit
    await page.getByTestId('submit-btn').click();
    
    // Check that tags validation error appears
    await expect(page.getByTestId('tags-error')).toBeVisible();

    // Test with valid tags - this should trigger the dialog
    await page.getByTestId('tag-input-0').fill('react');
    await page.getByTestId('add-tag-btn').click();
    await page.getByTestId('tag-input-1').fill('typescript');

    // Submit the form
    await page.getByTestId('submit-btn').click();
    
    // Check that success message appears
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('✅ Form submitted successfully');
    await expect(page.getByTestId('success-message')).toContainText('Tags validation: Valid');
    await expect(page.getByTestId('success-message')).toContainText('2 items');
  });

  test('should validate tags array length constraints', async ({ page }) => {
    // Fill valid form data
    await page.getByTestId('name-input').fill('John Doe');
    await page.getByTestId('email-input').fill('john@example.com');

    // Add maximum tags (5) + 1 extra to test max constraint
    const tags = ['react', 'typescript', 'zod', 'playwright', 'testing', 'extra'];
    
    for (let i = 0; i < tags.length; i++) {
      if (i > 0) {
        await page.getByTestId('add-tag-btn').click();
      }
      await page.getByTestId(`tag-input-${i}`).fill(tags[i]);
    }

    // When form is invalid, Formik shows validation errors instead of calling onSubmit
    await page.getByTestId('submit-btn').click();
    
    // Should show validation error due to too many tags (max 5)
    await expect(page.getByTestId('tags-error')).toBeVisible();
  });

  test('should validate with override error mapping', async ({ page }) => {
    // Switch to override mode
    await page.getByTestId('override-map-btn').click();

    // Try to submit empty form (same as the working default test)
    await page.getByTestId('submit-btn').click();

    // Wait a moment for validation to complete
    await page.waitForTimeout(500);

    // Check for override error messages
    await expect(page.getByTestId('name-error')).toContainText('OVERRIDE:');
    await expect(page.getByTestId('email-error')).toContainText('OVERRIDE:');
  });

  test('should handle optional fields correctly', async ({ page }) => {
    // Fill only required fields
    await page.getByTestId('name-input').fill('John Doe');
    await page.getByTestId('email-input').fill('john@example.com');
    await page.getByTestId('tag-input-0').fill('react');
    await page.getByTestId('add-tag-btn').click();
    await page.getByTestId('tag-input-1').fill('typescript');

    // Leave age and phone empty (they're optional)
    
    // Submit the form
    await page.getByTestId('submit-btn').click();
    
    // Should succeed with optional fields empty
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('✅ Form submitted successfully');
    await expect(page.getByTestId('success-message')).toContainText('Tags validation: Valid');

    // Wait for success message to disappear
    await page.waitForTimeout(1000);
    
    // Now test with valid optional fields
    await page.getByTestId('age-input').fill('30');
    await page.getByTestId('phone-input').fill('1234567890');

    // Submit the form again
    await page.getByTestId('submit-btn').click();
    
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('✅ Form submitted successfully');
    await expect(page.getByTestId('success-message')).toContainText('Tags validation: Valid');
  });

  test('should display error map usage information', async ({ page }) => {
    // Check that error map usage information is displayed
    await expect(page.getByTestId('error-map-info')).toContainText('Error Map Usage:');
    await expect(page.getByTestId('error-map-info')).toContainText('Default: Standard Zod error messages');
    await expect(page.getByTestId('error-map-info')).toContainText('Business: User-friendly messages with emojis');
    await expect(page.getByTestId('error-map-info')).toContainText('Strict: Formal, strict validation messages');
  });

  test('should validate form with different error map modes end-to-end', async ({ page }) => {
    const testCases = [
      { 
        btnTestId: 'default-map-btn', 
        mode: 'default', 
        expectedErrorText: 'String must contain at least 2 character(s)' 
      },
      { 
        btnTestId: 'business-map-btn', 
        mode: 'business', 
        expectedErrorText: '⚠️ Minimum 2 characters required for security' 
      },
      { 
        btnTestId: 'strict-map-btn', 
        mode: 'strict', 
        expectedErrorText: 'STRICT: Field requires minimum 2 characters. No exceptions.' 
      },
      { 
        btnTestId: 'override-map-btn', 
        mode: 'override', 
        expectedErrorText: 'OVERRIDE:' 
      }
    ];

    for (const testCase of testCases) {
      // Switch to the error map mode
      await page.getByTestId(testCase.btnTestId).click();
      
      // Verify mode changed
      await expect(page.getByTestId('active-mode-title')).toContainText(`Active Mode: ${testCase.mode}`);
      
      // Clear and fill with invalid data
      await page.getByTestId('name-input').fill('');
      await page.getByTestId('name-input').fill('A'); // Too short
      
      // Trigger validation by trying to submit
      await page.getByTestId('submit-btn').click();
      
      // Check for the expected error pattern
      await expect(page.getByTestId('name-error')).toContainText(testCase.expectedErrorText);
      
      // Clear the field for next iteration
      await page.getByTestId('name-input').fill('');
    }
  });

  test('should validate individual tag elements', async ({ page }) => {
    // Fill valid form data
    await page.getByTestId('name-input').fill('John Doe');
    await page.getByTestId('email-input').fill('john@example.com');

    // Add tags with some empty ones (should be filtered out)
    await page.getByTestId('tag-input-0').fill('react');
    await page.getByTestId('add-tag-btn').click();
    await page.getByTestId('tag-input-1').fill(''); // Empty tag
    await page.getByTestId('add-tag-btn').click();
    await page.getByTestId('tag-input-2').fill('typescript'); // Valid tag

    // Submit the form
    await page.getByTestId('submit-btn').click();
    
    // Should succeed because empty tags are filtered out, leaving 2 valid tags
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('✅ Form submitted successfully');
    await expect(page.getByTestId('success-message')).toContainText('Tags validation: Valid');
    await expect(page.getByTestId('success-message')).toContainText('2 items');
  });

  test('should demonstrate ZodArrayDef breaking change detection', async ({ page }) => {
    // Fill valid form data to trigger onSubmit (which uses ZodArrayDef)
    await page.getByTestId('name-input').fill('John Doe');
    await page.getByTestId('email-input').fill('john@example.com');
    await page.getByTestId('tag-input-0').fill('react');
    await page.getByTestId('add-tag-btn').click();
    await page.getByTestId('tag-input-1').fill('typescript');
    await page.getByTestId('add-tag-btn').click();
    await page.getByTestId('tag-input-2').fill('zod');

    // Submit the form
    await page.getByTestId('submit-btn').click();
    
    // The success message should show ZodArrayDef validation results
    // This demonstrates that our custom ZodArrayDef implementation is working
    await expect(page.getByTestId('success-message')).toBeVisible();
    await expect(page.getByTestId('success-message')).toContainText('✅ Form submitted successfully');
    await expect(page.getByTestId('success-message')).toContainText('Tags validation: Valid');
    await expect(page.getByTestId('success-message')).toContainText('3 items');
  });
}); 