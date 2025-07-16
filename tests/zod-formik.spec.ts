import { test, expect } from '@playwright/test';

test.describe('Zod Formik Integration - Simple Form', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load and navigation to be available
    await page.waitForSelector('.nav-links');
    
    // Navigate to the Zod Formik component
    await page.click('text=Zod + Formik');
    
    // Wait for the form to load
    await page.waitForSelector('text=Simple Formik + Zod Example');
  });

  test('should render the simple form', async ({ page }) => {
    // Check that the form title is visible
    await expect(page.getByText('Simple Formik + Zod Example')).toBeVisible();
    
    // Check that form fields are present
    await expect(page.getByLabel('Name')).toBeVisible();
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Check for validation errors
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should validate name minimum length', async ({ page }) => {
    // Fill name with just one character
    await page.getByLabel('Name').fill('J');
    
    // Try to submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Check for name validation error
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill email with invalid format
    await page.getByLabel('Email').fill('invalid-email');
    
    // Try to submit
    await page.getByRole('button', { name: 'Submit' }).click();

    // Check for email validation error
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('should submit valid form successfully', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');
    
    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();

    // Check that form fields are cleared after submission (indicating success)
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
  });

  test('should handle form input changes', async ({ page }) => {
    const nameInput = page.getByLabel('Name');
    const emailInput = page.getByLabel('Email');

    // Type in the fields
    await nameInput.fill('John');
    await emailInput.fill('john@example.com');

    // Verify the values
    await expect(nameInput).toHaveValue('John');
    await expect(emailInput).toHaveValue('john@example.com');
  });

  test('should clear validation errors when valid data is entered', async ({ page }) => {
    // First, trigger validation errors
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify errors are shown
    await expect(page.getByText('Name must be at least 2 characters')).toBeVisible();
    await expect(page.getByText('Invalid email address')).toBeVisible();

    // Now fill with valid data
    await page.getByLabel('Name').fill('John Doe');
    await page.getByLabel('Email').fill('john@example.com');

    // Submit again
    await page.getByRole('button', { name: 'Submit' }).click();

    // Verify form is cleared (indicating successful submission)
    await expect(page.getByLabel('Name')).toHaveValue('');
    await expect(page.getByLabel('Email')).toHaveValue('');
  });
}); 