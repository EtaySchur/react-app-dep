import React, { useState } from 'react';
import { AlertPanel } from '@backline.js/alert-panel';

const AlertPanelExample: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('/dashboard');
  const [showAlerts, setShowAlerts] = useState(true);

  const handleDismiss = (alertId: string) => {
    console.log(`Alert ${alertId} dismissed`);
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentUrl(event.target.value);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Alert Panel Examples</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="url-select">Current URL: </label>
        <select 
          id="url-select" 
          value={currentUrl} 
          onChange={handleUrlChange}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          <option value="/dashboard">/dashboard</option>
          <option value="/users/123">/users/123</option>
          <option value="/admin/settings">/admin/settings</option>
          <option value="/profile">/profile</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setShowAlerts(!showAlerts)}
          style={{ padding: '10px 20px', marginRight: '10px' }}
        >
          {showAlerts ? 'Hide' : 'Show'} Alerts
        </button>
      </div>

      {showAlerts && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Basic Success Alert */}
          <AlertPanel
            type="success"
            message="Your changes have been saved successfully!"
            dismissible
            onDismiss={() => handleDismiss('success')}
          />

          {/* Danger Alert with Title */}
          <AlertPanel
            type="danger"
            title="Error"
            message="An error occurred while processing your request. Please try again."
            dismissible
            onDismiss={() => handleDismiss('danger')}
          />

          {/* Info Alert */}
          <AlertPanel
            type="info"
            title="Information"
            message="This is an informational message about the current page."
            dismissible
            onDismiss={() => handleDismiss('info')}
          />

          {/* Warning Alert */}
          <AlertPanel
            type="warning"
            title="Warning"
            message="Please review your input before proceeding with the action."
            dismissible
            onDismiss={() => handleDismiss('warning')}
          />

          {/* URL Pattern Matching - Only shows on user pages */}
          <AlertPanel
            type="info"
            title="User Profile"
            message="This alert only appears on user profile pages (URL pattern: /users/:id)"
            urlPattern="/users/:id"
            currentUrl={currentUrl}
            dismissible
            onDismiss={() => handleDismiss('user-profile')}
          />

          {/* URL Pattern Matching - Only shows on admin pages */}
          <AlertPanel
            type="warning"
            title="Admin Notice"
            message="This alert only appears on admin pages (URL pattern: /admin/:section)"
            urlPattern="/admin/:section"
            currentUrl={currentUrl}
            dismissible
            onDismiss={() => handleDismiss('admin-notice')}
          />

          {/* Non-dismissible Alert */}
          <AlertPanel
            type="info"
            title="Important Notice"
            message="This alert cannot be dismissed and will always be visible."
          />
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
        <h3>Features Demonstrated:</h3>
        <ul>
          <li>✅ Four alert types: success, danger, info, warning</li>
          <li>✅ Dismissible alerts with callback support</li>
          <li>✅ URL pattern matching for conditional display</li>
          <li>✅ Custom titles and messages</li>
          <li>✅ Responsive design</li>
          <li>✅ Accessibility features</li>
        </ul>
        
        <h3>Current URL: {currentUrl}</h3>
        <p>Change the URL above to see how URL pattern matching works!</p>
      </div>
    </div>
  );
};

export default AlertPanelExample; 