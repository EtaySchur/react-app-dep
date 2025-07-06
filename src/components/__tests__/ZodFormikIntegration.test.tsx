import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock only the zodUtils functions that are actually needed
jest.mock('../../utils/zodUtils', () => ({
  resetToDefaultErrorMap: jest.fn(),
  setBusinessErrorMap: jest.fn(),
  setStrictErrorMap: jest.fn(),
  setOverrideErrorMap: jest.fn(),
  createZodArrayDefExample: jest.fn().mockReturnValue({
    type: 'array',
    minLength: 2,
    maxLength: 5,
    element: { type: 'string' }
  }),
  validateWithZodArrayDef: jest.fn(),
}));

import ZodFormikIntegration from '../ZodFormikIntegration';
import * as zodUtils from '../../utils/zodUtils';

describe('ZodFormikIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock for validateWithZodArrayDef
    (zodUtils.validateWithZodArrayDef as jest.Mock).mockReturnValue({
      isValid: true,
      details: ['tag1', 'tag2'],
      errors: []
    });
  });

  it('renders the component with default error map mode', () => {
    render(<ZodFormikIntegration />);
    
    expect(screen.getByTestId('zod-formik-container')).toBeInTheDocument();
    expect(screen.getByTestId('active-mode-title')).toHaveTextContent('Active Mode: default');
  });

  it('renders all form fields', () => {
    render(<ZodFormikIntegration />);
    
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-input')).toBeInTheDocument();
    expect(screen.getByTestId('phone-input')).toBeInTheDocument();
    expect(screen.getByTestId('tags-container')).toBeInTheDocument();
    expect(screen.getByTestId('submit-btn')).toBeInTheDocument();
  });

  it('changes error map mode when buttons are clicked', async () => {
    render(<ZodFormikIntegration />);
    
    const businessBtn = screen.getByTestId('business-map-btn');
    await userEvent.click(businessBtn);
    
    expect(zodUtils.setBusinessErrorMap).toHaveBeenCalled();
    expect(screen.getByTestId('active-mode-title')).toHaveTextContent('Active Mode: business');
  });

  it('changes form styling based on error map mode', async () => {
    render(<ZodFormikIntegration />);
    
    const formContainer = screen.getByTestId('form-container');
    
    // Switch to business mode
    await userEvent.click(screen.getByTestId('business-map-btn'));
    expect(formContainer).toHaveStyle('border: 2px solid #28a745');
    
    // Switch to strict mode
    await userEvent.click(screen.getByTestId('strict-map-btn'));
    expect(formContainer).toHaveStyle('border: 2px solid #dc3545');
  });

  it('handles form input changes', async () => {
    render(<ZodFormikIntegration />);
    
    const nameInput = screen.getByTestId('name-input');
    const emailInput = screen.getByTestId('email-input');
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('adds and removes tag fields', async () => {
    render(<ZodFormikIntegration />);
    
    // Add a second tag
    await userEvent.click(screen.getByTestId('add-tag-btn'));
    expect(screen.getByTestId('tag-input-1')).toBeInTheDocument();
    expect(screen.getByTestId('remove-tag-1')).toBeInTheDocument();
    
    // Remove the second tag
    await userEvent.click(screen.getByTestId('remove-tag-1'));
    expect(screen.queryByTestId('tag-input-1')).not.toBeInTheDocument();
  });

  it('shows validation errors for invalid form data', async () => {
    render(<ZodFormikIntegration />);
    
    // Try to submit empty form
    await userEvent.click(screen.getByTestId('submit-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('String must contain at least 2 character(s)');
      expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email');
      expect(screen.getByTestId('tags-error')).toHaveTextContent('Array must contain at least 2 element(s)');
    });
  });

  it('shows validation errors for invalid email format', async () => {
    render(<ZodFormikIntegration />);
    
    await userEvent.type(screen.getByTestId('email-input'), 'invalid-email');
    await userEvent.click(screen.getByTestId('submit-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('email-error')).toHaveTextContent('Invalid email');
    });
  });

  it('shows validation errors for short name', async () => {
    render(<ZodFormikIntegration />);
    
    await userEvent.type(screen.getByTestId('name-input'), 'A');
    await userEvent.click(screen.getByTestId('submit-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent('String must contain at least 2 character(s)');
    });
  });

  it('submits valid form successfully', async () => {
    render(<ZodFormikIntegration />);
    
    // Fill out valid form
    await userEvent.type(screen.getByTestId('name-input'), 'John Doe');
    await userEvent.type(screen.getByTestId('email-input'), 'john@example.com');
    
    // Add two tags
    await userEvent.type(screen.getByTestId('tag-input-0'), 'tag1');
    await userEvent.click(screen.getByTestId('add-tag-btn'));
    await userEvent.type(screen.getByTestId('tag-input-1'), 'tag2');
    
    // Submit form
    await act(async () => {
      await userEvent.click(screen.getByTestId('submit-btn'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('success-message')).toHaveTextContent('✅ Form submitted successfully');
    });
  });

  it('shows error when form submission fails validation', async () => {
    // Mock validation to fail
    (zodUtils.validateWithZodArrayDef as jest.Mock).mockReturnValue({
      isValid: false,
      details: [],
      errors: ['Invalid tags']
    });
    
    render(<ZodFormikIntegration />);
    
    // Fill out form
    await userEvent.type(screen.getByTestId('name-input'), 'John Doe');
    await userEvent.type(screen.getByTestId('email-input'), 'john@example.com');
    await userEvent.type(screen.getByTestId('tag-input-0'), 'tag1');
    await userEvent.click(screen.getByTestId('add-tag-btn'));
    await userEvent.type(screen.getByTestId('tag-input-1'), 'tag2');
    
    await act(async () => {
      await userEvent.click(screen.getByTestId('submit-btn'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('success-message')).toHaveTextContent('❌ Form submitted');
    });
  });

  it('shows success message when form is submitted', async () => {
    render(<ZodFormikIntegration />);
    
    // Fill out and submit valid form
    await userEvent.type(screen.getByTestId('name-input'), 'John Doe');
    await userEvent.type(screen.getByTestId('email-input'), 'john@example.com');
    await userEvent.type(screen.getByTestId('tag-input-0'), 'tag1');
    await userEvent.click(screen.getByTestId('add-tag-btn'));
    await userEvent.type(screen.getByTestId('tag-input-1'), 'tag2');
    
    await act(async () => {
      await userEvent.click(screen.getByTestId('submit-btn'));
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
      expect(screen.getByTestId('success-message')).toHaveTextContent('✅ Form submitted successfully');
    });
  });

  it('first tag cannot be removed but additional tags can', async () => {
    render(<ZodFormikIntegration />);
    
    // First tag should not have a remove button
    expect(screen.queryByTestId('remove-tag-0')).not.toBeInTheDocument();
    
    // Add second tag
    await userEvent.click(screen.getByTestId('add-tag-btn'));
    
    // Second tag should have a remove button
    expect(screen.getByTestId('remove-tag-1')).toBeInTheDocument();
  });

  it('validates age field when provided', async () => {
    render(<ZodFormikIntegration />);
    
    // Enter invalid age (under 18)
    await userEvent.type(screen.getByTestId('age-input'), '15');
    await userEvent.click(screen.getByTestId('submit-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('age-error')).toHaveTextContent('Number must be greater than or equal to 18');
    });
  });

  it('validates phone field when provided', async () => {
    render(<ZodFormikIntegration />);
    
    // Enter invalid phone (too short)
    await userEvent.type(screen.getByTestId('phone-input'), '123');
    await userEvent.click(screen.getByTestId('submit-btn'));
    
    await waitFor(() => {
      expect(screen.getByTestId('phone-error')).toHaveTextContent('String must contain at least 10 character(s)');
    });
  });

  it('renders error map usage information', () => {
    render(<ZodFormikIntegration />);
    
    expect(screen.getByTestId('error-map-info')).toBeInTheDocument();
    expect(screen.getByText('Error Map Usage:')).toBeInTheDocument();
    expect(screen.getByText('Default:')).toBeInTheDocument();
    expect(screen.getByText('Business:')).toBeInTheDocument();
    expect(screen.getByText('Strict:')).toBeInTheDocument();
  });
}); 