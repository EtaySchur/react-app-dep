import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertPanelExample from '../AlertPanelExample';

// Mock the AlertPanel component
jest.mock('@backline.js/alert-panel', () => ({
  AlertPanel: ({ 
    type, 
    title, 
    message, 
    dismissible, 
    onDismiss, 
    urlPattern, 
    currentUrl 
  }: any) => {
    // URL pattern matching logic
    const shouldShow = !urlPattern || shouldShowAlert(urlPattern, currentUrl);
    
    if (!shouldShow) return null;
    
    return (
      <div 
        data-testid={`alert-${type}`}
        className={`alert alert-${type}`}
        role="alert"
      >
        {title && <h4 data-testid="alert-title">{title}</h4>}
        <p data-testid="alert-message">{message}</p>
        {dismissible && (
          <button 
            data-testid="dismiss-button"
            onClick={onDismiss}
            aria-label="Dismiss alert"
          >
            ×
          </button>
        )}
      </div>
    );
  }
}));

// Helper function to match URL patterns
function shouldShowAlert(pattern: string, currentUrl: string): boolean {
  if (pattern === '/users/:id') {
    return currentUrl.startsWith('/users/') && currentUrl !== '/users/';
  }
  if (pattern === '/admin/:section') {
    return currentUrl.startsWith('/admin/') && currentUrl !== '/admin/';
  }
  return currentUrl === pattern;
}

describe('AlertPanelExample', () => {
  beforeEach(() => {
    // Clear console.log calls between tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders the main heading', () => {
      render(<AlertPanelExample />);
      expect(screen.getByText('Alert Panel Examples')).toBeInTheDocument();
    });

    it('renders URL selector with default value', () => {
      render(<AlertPanelExample />);
      const urlSelect = screen.getByLabelText('Current URL:');
      expect(urlSelect).toBeInTheDocument();
      expect(urlSelect).toHaveValue('/dashboard');
    });

    it('renders show/hide alerts button', () => {
      render(<AlertPanelExample />);
      expect(screen.getByRole('button', { name: 'Hide Alerts' })).toBeInTheDocument();
    });

    it('shows all alerts by default', () => {
      render(<AlertPanelExample />);
      expect(screen.getByTestId('alert-success')).toBeInTheDocument();
      expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
      expect(screen.getAllByTestId('alert-info')).toHaveLength(2); // 2 info alerts
      expect(screen.getByTestId('alert-warning')).toBeInTheDocument();
    });

    it('renders features list', () => {
      render(<AlertPanelExample />);
      expect(screen.getByText('Features Demonstrated:')).toBeInTheDocument();
      expect(screen.getByText('✅ Four alert types: success, danger, info, warning')).toBeInTheDocument();
      expect(screen.getByText('✅ Dismissible alerts with callback support')).toBeInTheDocument();
      expect(screen.getByText('✅ URL pattern matching for conditional display')).toBeInTheDocument();
    });
  });

  describe('Alert Types', () => {
    it('renders success alert with correct content', () => {
      render(<AlertPanelExample />);
      const successAlert = screen.getByTestId('alert-success');
      expect(successAlert).toBeInTheDocument();
      expect(screen.getByText('Your changes have been saved successfully!')).toBeInTheDocument();
    });

    it('renders danger alert with title and message', () => {
      render(<AlertPanelExample />);
      const dangerAlert = screen.getByTestId('alert-danger');
      expect(dangerAlert).toBeInTheDocument();
      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('An error occurred while processing your request. Please try again.')).toBeInTheDocument();
    });

    it('renders info alert with title and message', () => {
      render(<AlertPanelExample />);
      const infoAlerts = screen.getAllByTestId('alert-info');
      expect(infoAlerts).toHaveLength(2); // 2 info alerts
      expect(screen.getByText('Information')).toBeInTheDocument();
      expect(screen.getByText('This is an informational message about the current page.')).toBeInTheDocument();
    });

    it('renders warning alert with title and message', () => {
      render(<AlertPanelExample />);
      const warningAlert = screen.getByTestId('alert-warning');
      expect(warningAlert).toBeInTheDocument();
      expect(screen.getByText('Warning')).toBeInTheDocument();
      expect(screen.getByText('Please review your input before proceeding with the action.')).toBeInTheDocument();
    });
  });

  describe('Dismissible Functionality', () => {
    it('renders dismiss buttons for dismissible alerts', () => {
      render(<AlertPanelExample />);
      const dismissButtons = screen.getAllByTestId('dismiss-button');
      expect(dismissButtons).toHaveLength(4); // 4 dismissible alerts (success, danger, info, warning)
    });

    it('calls onDismiss callback when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<AlertPanelExample />);
      
      const dismissButtons = screen.getAllByTestId('dismiss-button');
      await user.click(dismissButtons[0]); // Click first dismiss button
      
      expect(console.log).toHaveBeenCalledWith('Alert success dismissed');
    });

    it('renders non-dismissible alert without dismiss button', () => {
      render(<AlertPanelExample />);
      const dismissButtons = screen.getAllByTestId('dismiss-button');
      expect(dismissButtons).toHaveLength(4); // 4 dismissible alerts, 1 non-dismissible
      expect(screen.getByText('Important Notice')).toBeInTheDocument();
      expect(screen.getByText('This alert cannot be dismissed and will always be visible.')).toBeInTheDocument();
    });
  });

  describe('URL Pattern Matching', () => {
    it('shows user profile alert only on user pages', async () => {
      render(<AlertPanelExample />);
      
      // Initially on /dashboard, user profile alert should not show
      expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
      
      // Change to user page
      const urlSelect = screen.getByLabelText('Current URL:');
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/users/123');
      });
      
      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });
      expect(screen.getByText('This alert only appears on user profile pages (URL pattern: /users/:id)')).toBeInTheDocument();
    });

    it('shows admin notice alert only on admin pages', async () => {
      render(<AlertPanelExample />);
      
      // Initially on /dashboard, admin notice alert should not show
      expect(screen.queryByText('Admin Notice')).not.toBeInTheDocument();
      
      // Change to admin page
      const urlSelect = screen.getByLabelText('Current URL:');
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/admin/settings');
      });
      
      await waitFor(() => {
        expect(screen.getByText('Admin Notice')).toBeInTheDocument();
      });
      expect(screen.getByText('This alert only appears on admin pages (URL pattern: /admin/:section)')).toBeInTheDocument();
    });

    it('hides user profile alert when leaving user pages', async () => {
      render(<AlertPanelExample />);
      
      // Start on user page
      const urlSelect = screen.getByLabelText('Current URL:');
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/users/123');
      });
      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });
      
      // Change to different page
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/dashboard');
      });
      await waitFor(() => {
        expect(screen.queryByText('User Profile')).not.toBeInTheDocument();
      });
    });

    it('hides admin notice alert when leaving admin pages', async () => {
      render(<AlertPanelExample />);
      
      // Start on admin page
      const urlSelect = screen.getByLabelText('Current URL:');
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/admin/settings');
      });
      await waitFor(() => {
        expect(screen.getByText('Admin Notice')).toBeInTheDocument();
      });
      
      // Change to different page
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/profile');
      });
      await waitFor(() => {
        expect(screen.queryByText('Admin Notice')).not.toBeInTheDocument();
      });
    });
  });

  describe('Show/Hide Alerts Toggle', () => {
    it('hides all alerts when hide button is clicked', async () => {
      const user = userEvent.setup();
      render(<AlertPanelExample />);
      
      // Initially alerts are visible
      expect(screen.getByTestId('alert-success')).toBeInTheDocument();
      expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
      
      // Click hide button
      const toggleButton = screen.getByRole('button', { name: 'Hide Alerts' });
      await user.click(toggleButton);
      
      // Alerts should be hidden
      expect(screen.queryByTestId('alert-success')).not.toBeInTheDocument();
      expect(screen.queryByTestId('alert-danger')).not.toBeInTheDocument();
    });

    it('shows alerts when show button is clicked', async () => {
      const user = userEvent.setup();
      render(<AlertPanelExample />);
      
      // Hide alerts first
      const toggleButton = screen.getByRole('button', { name: 'Hide Alerts' });
      await user.click(toggleButton);
      
      // Button text should change
      expect(screen.getByRole('button', { name: 'Show Alerts' })).toBeInTheDocument();
      
      // Show alerts again
      await user.click(screen.getByRole('button', { name: 'Show Alerts' }));
      
      // Alerts should be visible again
      expect(screen.getByTestId('alert-success')).toBeInTheDocument();
      expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
    });

    it('updates button text when toggling', async () => {
      const user = userEvent.setup();
      render(<AlertPanelExample />);
      
      // Initially shows "Hide Alerts"
      expect(screen.getByRole('button', { name: 'Hide Alerts' })).toBeInTheDocument();
      
      // Click to hide
      await user.click(screen.getByRole('button', { name: 'Hide Alerts' }));
      expect(screen.getByRole('button', { name: 'Show Alerts' })).toBeInTheDocument();
      
      // Click to show again
      await user.click(screen.getByRole('button', { name: 'Show Alerts' }));
      expect(screen.getByRole('button', { name: 'Hide Alerts' })).toBeInTheDocument();
    });
  });

  describe('URL Selection', () => {
    it('updates current URL when selection changes', async () => {
      render(<AlertPanelExample />);
      
      const urlSelect = screen.getByLabelText('Current URL:');
      expect(urlSelect).toHaveValue('/dashboard');
      
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/users/123');
      });
      await waitFor(() => {
        expect(urlSelect).toHaveValue('/users/123');
      });
    });

    it('displays current URL in the features section', async () => {
      render(<AlertPanelExample />);
      
      expect(screen.getByText('Current URL: /dashboard')).toBeInTheDocument();
      
      const urlSelect = screen.getByLabelText('Current URL:');
      await act(async () => {
        userEvent.selectOptions(urlSelect, '/admin/settings');
      });
      
      await waitFor(() => {
        expect(screen.getByText('Current URL: /admin/settings')).toBeInTheDocument();
      });
    });

    it('has all expected URL options', () => {
      render(<AlertPanelExample />);
      
      const urlSelect = screen.getByLabelText('Current URL:');
      const options = Array.from(urlSelect.children).map(option => (option as HTMLOptionElement).value);
      
      expect(options).toEqual([
        '/dashboard',
        '/users/123',
        '/admin/settings',
        '/profile'
      ]);
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for dismiss buttons', () => {
      render(<AlertPanelExample />);
      
      const dismissButtons = screen.getAllByTestId('dismiss-button');
      dismissButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label', 'Dismiss alert');
      });
    });

    it('has proper role attributes for alerts', () => {
      render(<AlertPanelExample />);
      
      const alerts = screen.getAllByRole('alert');
      expect(alerts.length).toBeGreaterThan(0);
    });

    it('has proper label association for URL selector', () => {
      render(<AlertPanelExample />);
      
      const urlSelect = screen.getByLabelText('Current URL:');
      expect(urlSelect).toBeInTheDocument();
    });
  });

  describe('Console Logging', () => {
    it('logs dismiss events to console', async () => {
      const user = userEvent.setup();
      render(<AlertPanelExample />);
      
      const dismissButtons = screen.getAllByTestId('dismiss-button');
      
      // Test different alert dismissals
      await user.click(dismissButtons[0]); // success
      expect(console.log).toHaveBeenCalledWith('Alert success dismissed');
      
      await user.click(dismissButtons[1]); // danger
      expect(console.log).toHaveBeenCalledWith('Alert danger dismissed');
      
      await user.click(dismissButtons[2]); // info
      expect(console.log).toHaveBeenCalledWith('Alert info dismissed');
    });
  });
}); 