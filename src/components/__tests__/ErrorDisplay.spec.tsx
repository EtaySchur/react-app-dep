import React from 'react';
import ReactDOM from 'react-dom';
import ErrorDisplay from '../ErrorDisplay';

describe('ErrorDisplay Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  it('should render error message', () => {
    const testMessage = 'This is an error message';
    
    ReactDOM.render(
      <ErrorDisplay message={testMessage} />, 
      container
    );

    const errorDiv = container.querySelector('.error-message');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv?.textContent).toBe(testMessage);
  });

  it('should render with empty message', () => {
    ReactDOM.render(
      <ErrorDisplay message="" />, 
      container
    );

    const errorDiv = container.querySelector('.error-message');
    expect(errorDiv).toBeTruthy();
    expect(errorDiv?.textContent).toBe('');
  });

  it('should have correct CSS class', () => {
    ReactDOM.render(
      <ErrorDisplay message="test" />, 
      container
    );

    const errorDiv = container.querySelector('.error-message');
    expect(errorDiv?.className).toBe('error-message');
  });
}); 