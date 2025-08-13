import React from 'react';

interface AlertPanelProps {
  type: 'success' | 'danger' | 'info' | 'warning';
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  urlPattern?: string;
  currentUrl?: string;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
  urlPattern,
  currentUrl,
}) => {
  // Check if the alert should be displayed based on URL pattern
  if (urlPattern && currentUrl) {
    const patternParts = urlPattern.split('/');
    const urlParts = currentUrl.split('/');
    
    if (patternParts.length !== urlParts.length) {
      return null;
    }
    
    for (let i = 0; i < patternParts.length; i++) {
      if (!patternParts[i].startsWith(':') && patternParts[i] !== urlParts[i]) {
        return null;
      }
    }
  }

  // Color mapping
  const colorMap = {
    success: '#dff0d8',
    danger: '#f8d7da',
    info: '#d1ecf1',
    warning: '#fff3cd'
  };

  const textColorMap = {
    success: '#3c763d',
    danger: '#721c24',
    info: '#0c5460',
    warning: '#856404'
  };

  return (
    <div 
      style={{
        backgroundColor: colorMap[type],
        color: textColorMap[type],
        padding: '15px',
        borderRadius: '4px',
        position: 'relative'
      }}
      role="alert"
    >
      {title && <h4 style={{ margin: '0 0 10px 0' }}>{title}</h4>}
      <p style={{ margin: 0 }}>{message}</p>
      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: textColorMap[type]
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
};