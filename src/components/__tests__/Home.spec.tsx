import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

describe('Home Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
  });

  it('should render home container', () => {
    const mockProps = {
      history: {
        push: jasmine.createSpy('push'),
        replace: jasmine.createSpy('replace'),
        go: jasmine.createSpy('go'),
        goBack: jasmine.createSpy('goBack'),
        goForward: jasmine.createSpy('goForward'),
        length: 1,
        location: {
          pathname: '/',
          search: '',
          hash: '',
          state: undefined
        },
        listen: jasmine.createSpy('listen'),
        block: jasmine.createSpy('block'),
        createHref: jasmine.createSpy('createHref')
      },
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: undefined
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: {}
      }
    };

    ReactDOM.render(
      <MemoryRouter>
        <Home {...mockProps} />
      </MemoryRouter>, 
      container
    );

    const homeContainer = container.querySelector('.home-container');
    expect(homeContainer).toBeTruthy();
  });

  it('should display main heading', () => {
    const mockProps = {
      history: {
        push: jasmine.createSpy('push'),
        replace: jasmine.createSpy('replace'),
        go: jasmine.createSpy('go'),
        goBack: jasmine.createSpy('goBack'),
        goForward: jasmine.createSpy('goForward'),
        length: 1,
        location: {
          pathname: '/',
          search: '',
          hash: '',
          state: undefined
        },
        listen: jasmine.createSpy('listen'),
        block: jasmine.createSpy('block'),
        createHref: jasmine.createSpy('createHref')
      },
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: undefined
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: {}
      }
    };

    ReactDOM.render(
      <MemoryRouter>
        <Home {...mockProps} />
      </MemoryRouter>, 
      container
    );

    const heading = container.querySelector('h1');
    expect(heading?.textContent).toBe('React Router DOM v4.3.1 Example');
  });

  it('should display current location pathname', () => {
    const mockProps = {
      history: {
        push: jasmine.createSpy('push'),
        replace: jasmine.createSpy('replace'),
        go: jasmine.createSpy('go'),
        goBack: jasmine.createSpy('goBack'),
        goForward: jasmine.createSpy('goForward'),
        length: 1,
        location: {
          pathname: '/test-path',
          search: '?param=value',
          hash: '',
          state: undefined
        },
        listen: jasmine.createSpy('listen'),
        block: jasmine.createSpy('block'),
        createHref: jasmine.createSpy('createHref')
      },
      location: {
        pathname: '/test-path',
        search: '?param=value',
        hash: '',
        state: undefined
      },
      match: {
        path: '/test-path',
        url: '/test-path',
        isExact: true,
        params: {}
      }
    };

    ReactDOM.render(
      <MemoryRouter>
        <Home {...mockProps} />
      </MemoryRouter>, 
      container
    );

    const pathnameParagraph = container.querySelector('.info-box p');
    expect(pathnameParagraph?.textContent).toContain('/test-path');
  });

  it('should handle navigation button click', () => {
    const mockPush = jasmine.createSpy('push');
    const mockProps = {
      history: {
        push: mockPush,
        replace: jasmine.createSpy('replace'),
        go: jasmine.createSpy('go'),
        goBack: jasmine.createSpy('goBack'),
        goForward: jasmine.createSpy('goForward'),
        length: 1,
        location: {
          pathname: '/',
          search: '',
          hash: '',
          state: undefined
        },
        listen: jasmine.createSpy('listen'),
        block: jasmine.createSpy('block'),
        createHref: jasmine.createSpy('createHref')
      },
      location: {
        pathname: '/',
        search: '',
        hash: '',
        state: undefined
      },
      match: {
        path: '/',
        url: '/',
        isExact: true,
        params: {}
      }
    };

    ReactDOM.render(
      <MemoryRouter>
        <Home {...mockProps} />
      </MemoryRouter>, 
      container
    );

    const navigationButton = container.querySelector('.btn');
    expect(navigationButton).toBeTruthy();
    
    // Simulate button click
    (navigationButton as HTMLButtonElement).click();
    expect(mockPush).toHaveBeenCalledWith('/formik');
  });
}); 