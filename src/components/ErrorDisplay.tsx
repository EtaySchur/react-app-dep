import React from 'react';

// Simple Error Display Component
const ErrorDisplay: React.FC<{message: string}> = ({message}) => (
  <div className="error-message">{message}</div>
);

export default ErrorDisplay; 