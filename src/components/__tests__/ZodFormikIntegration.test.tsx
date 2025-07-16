import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ZodFormikIntegration from '../ZodFormikIntegration';

describe('ZodFormikIntegration - Simple Form', () => {
  it('renders the simple form', () => {
    render(<ZodFormikIntegration />);
    
    expect(screen.getByText('Simple Formik + Zod Example')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('shows validation errors for empty form submission', async () => {
    render(<ZodFormikIntegration />);
    
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('validates name minimum length', async () => {
    render(<ZodFormikIntegration />);
    
    const nameInput = screen.getByLabelText('Name');
    await userEvent.type(nameInput, 'J');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    render(<ZodFormikIntegration />);
    
    const emailInput = screen.getByLabelText('Email');
    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('submits valid form successfully', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ZodFormikIntegration />);
    
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining('"name": "John Doe"')
      );
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining('"email": "john@example.com"')
      );
    });
    
    alertMock.mockRestore();
  });

  it('clears form after successful submission', async () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    render(<ZodFormikIntegration />);
    
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
    });
    
    alertMock.mockRestore();
  });

  it('handles form input changes', async () => {
    render(<ZodFormikIntegration />);
    
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    
    await userEvent.type(nameInput, 'John');
    await userEvent.type(emailInput, 'john@example.com');
    
    expect(nameInput).toHaveValue('John');
    expect(emailInput).toHaveValue('john@example.com');
  });
}); 