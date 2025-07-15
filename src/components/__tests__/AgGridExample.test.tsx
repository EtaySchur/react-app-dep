import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock AG Grid properly 
const mockGridApi = {
  deselectAll: jest.fn(),
  getDisplayedRowAtIndex: jest.fn(),
  setFocusedCell: jest.fn(),
  getCellRanges: jest.fn(),
  sizeColumnsToFit: jest.fn(),
  getSelectedRows: jest.fn(),
  selectAll: jest.fn(),
};

const mockColumnApi = {
  getColumns: jest.fn().mockReturnValue([
    { getColId: () => 'symbol' },
    { getColId: () => 'companyName' },
    { getColId: () => 'price' },
    { getColId: () => 'change' },
    { getColId: () => 'changePercent' },
    { getColId: () => 'volume' },
  ]),
  setColumnVisible: jest.fn(),
};

jest.mock('ag-grid-react', () => ({
  AgGridReact: React.forwardRef(({ onGridReady, rowData, columnDefs, className, style, ...props }: any, ref: any) => {
    React.useEffect(() => {
      if (onGridReady) {
        onGridReady({
          api: mockGridApi,
          columnApi: mockColumnApi,
        });
      }
    }, [onGridReady]);
    
    return React.createElement('div', { 
      'data-testid': 'ag-grid-mock', 
      className, 
      style,
      ref,
      children: [
        React.createElement('div', { key: 'rows' }, `AG Grid Mock - ${rowData?.length || 0} rows`),
        React.createElement('div', { key: 'cols' }, `Column count: ${columnDefs?.length || 0}`)
      ]
    });
  }),
}));

// Mock AG Grid styles
jest.mock('ag-grid-community/styles/ag-grid.css', () => ({}));
jest.mock('ag-grid-community/styles/ag-theme-alpine.css', () => ({}));

// Mock date-fns-tz functions specifically for this test
jest.mock('date-fns-tz', () => ({
  utcToZonedTime: jest.fn((date) => new Date(date)),
  zonedTimeToUtc: jest.fn((date) => new Date(date)),
}));

import AgGridExample from '../AgGridExample';

// Test utilities
const mockStockData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    symbol: `SYM${i + 1}`,
    companyName: `Company ${i + 1}`,
    price: 100 + Math.random() * 100,
    change: -5 + Math.random() * 10,
    changePercent: -2 + Math.random() * 4,
    volume: Math.floor(Math.random() * 1000000),
    sector: ['Technology', 'Financial', 'Healthcare'][i % 3],
  }));
};

const setupAxiosMocks = {
  success: (data?: any) => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: data?.stocks || mockStockData(10),
        total: data?.stocks?.length || 10,
        timestamp: new Date().toISOString(),
        timezone: 'UTC',
        selectedTimezone: 'America/New_York',
        ...data,
      },
    });
  },
  error: (message: string) => {
    mockedAxios.get.mockRejectedValue(new Error(message));
  },
  withDelay: (delay: number) => {
    mockedAxios.get.mockImplementation(() => 
      new Promise((resolve) => 
        setTimeout(() => resolve({
          data: {
            data: mockStockData(10),
            total: 10,
            timestamp: new Date().toISOString(),
          }
        }), delay)
      )
    );
  },
  reset: () => {
    mockedAxios.get.mockReset();
    mockedAxios.post.mockReset();
  },
};

const waitForAsyncOperations = () => new Promise<void>(resolve => setTimeout(resolve, 0));

describe('AgGridExample', () => {
  beforeEach(() => {
    setupAxiosMocks.reset();
    jest.clearAllMocks();
    setupAxiosMocks.success();
    
    // Reset AG Grid mocks
    mockGridApi.deselectAll.mockClear();
    mockGridApi.getDisplayedRowAtIndex.mockClear();
    mockGridApi.setFocusedCell.mockClear();
    mockGridApi.getCellRanges.mockClear();
    mockGridApi.sizeColumnsToFit.mockClear();
    mockGridApi.getSelectedRows.mockClear();
    mockGridApi.selectAll.mockClear();
    mockColumnApi.setColumnVisible.mockClear();
  });

  it('renders financial dashboard title', async () => {
    render(<AgGridExample />);
    
    // Wait for async operations to complete
    await waitFor(() => {
      expect(screen.getByText(/Financial Dashboard - AG Grid with Timezone Conversion Demo/i)).toBeInTheDocument();
    });
  });

  it('renders control panel with all buttons', async () => {
    render(<AgGridExample />);
    
    // Wait for component to fully render and settle
    await waitFor(() => {
      expect(screen.getByText('📊 Select 5 Rows × 3 Cols (15 cells)')).toBeInTheDocument();
    });
    
    expect(screen.getByText('🎯 Select 3 Rows × 6 Cols (18 cells)')).toBeInTheDocument();
    expect(screen.getByText('🔥 Select 10 Rows × 6 Cols (60 cells)')).toBeInTheDocument();
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
    expect(screen.getByText('🌍 Demo Timezone Conversion')).toBeInTheDocument();
  });

  it('renders timezone selector with default value', async () => {
    render(<AgGridExample />);
    
    // Wait for component to fully render
    await waitFor(() => {
      const timezoneSelect = screen.getByDisplayValue('New York (EST/EDT)');
      expect(timezoneSelect).toBeInTheDocument();
    });
  });

  it('renders AG Grid mock component', async () => {
    render(<AgGridExample />);
    
    // Wait for component to fully render
    await waitFor(() => {
      expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
    });
  });

  it('fetches stock data on component mount', async () => {
    const mockData = mockStockData(5);
    setupAxiosMocks.success({ stocks: mockData });
    
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/stocks',
        expect.objectContaining({
          params: expect.objectContaining({
            count: 50,
            sortBy: 'symbol',
            order: 'asc',
            timezone: 'America/New_York',
          }),
        })
      );
    });
  });

  it('handles API errors gracefully', async () => {
    setupAxiosMocks.error('Server not available');
    
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Error: Server not available/i)).toBeInTheDocument();
  });

  it('displays loading state initially', async () => {
    // Mock slow response to catch loading state
    setupAxiosMocks.withDelay(100);
    
    render(<AgGridExample />);
    
    // Initially should show loading
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    expect(screen.getByText(/Loading stock data from server/i)).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    });
  });

  it('handles timezone selection change', async () => {
    render(<AgGridExample />);
    
    const timezoneSelect = screen.getByDisplayValue('New York (EST/EDT)');
    
    await userEvent.selectOptions(timezoneSelect, 'Europe/London');
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/stocks',
        expect.objectContaining({
          params: expect.objectContaining({
            timezone: 'Europe/London',
          }),
        })
      );
    });
  });

  it('handles refresh data button click', async () => {
    render(<AgGridExample />);
    
    const refreshButton = screen.getByText('Refresh Data');
    await userEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(2); // Initial load + refresh
    });
  });

  it('handles timezone conversion demo button', async () => {
    // Mock alert to avoid actual alert dialog
    const mockAlert = jest.fn();
    global.alert = mockAlert;
    
    render(<AgGridExample />);
    
    const demoButton = screen.getByText('🌍 Demo Timezone Conversion');
    await userEvent.click(demoButton);
    
    expect(mockAlert).toHaveBeenCalledWith(
      expect.stringContaining('Timezone Conversion Demo:')
    );
  });




  it('handles range selection buttons', async () => {
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(screen.getByText('📊 Select 5 Rows × 3 Cols (15 cells)')).toBeInTheDocument();
    });
    
    const rangeButton = screen.getByText('📊 Select 5 Rows × 3 Cols (15 cells)');
    await userEvent.click(rangeButton);
    
    // Test passes if no error is thrown
    expect(rangeButton).toBeInTheDocument();
  });

  it('handles company column toggle', async () => {
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(screen.getByTestId('toggle-company-column')).toBeInTheDocument();
    });
    
    const toggleButton = screen.getByTestId('toggle-company-column');
    expect(toggleButton).toHaveTextContent('🫥 Hide Company');
    
    await userEvent.click(toggleButton);
    
    expect(mockColumnApi.setColumnVisible).toHaveBeenCalled();
  });

  it('handles different timezone options', async () => {
    render(<AgGridExample />);
    
    const timezoneSelect = screen.getByDisplayValue('New York (EST/EDT)');
    
    // Test multiple timezone changes
    await userEvent.selectOptions(timezoneSelect, 'Asia/Tokyo');
    await userEvent.selectOptions(timezoneSelect, 'UTC');
    await userEvent.selectOptions(timezoneSelect, 'Australia/Sydney');
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'http://localhost:3001/api/stocks',
        expect.objectContaining({
          params: expect.objectContaining({
            timezone: 'Australia/Sydney',
          }),
        })
      );
    });
  });

  it('handles API response with enhanced data', async () => {
    const mockData = mockStockData(3);
    setupAxiosMocks.success({ stocks: mockData });
    
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
    
    // The component should process the data and add timezone conversions
    // We can't directly test this with the mock, but we ensure no errors occur
    expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
  });

  it('handles network delays gracefully', async () => {
    setupAxiosMocks.withDelay(100);
    
    render(<AgGridExample />);
    
    // Should show loading initially
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles invalid API response format', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: { invalidFormat: true },
    });
    
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Invalid response format from server/i)).toBeInTheDocument();
  });

  it('renders fallback message when server is unavailable', async () => {
    setupAxiosMocks.error('Network Error');
    
    render(<AgGridExample />);
    
    await waitFor(() => {
      expect(screen.getByText(/Make sure the Express server is running on port 3001/i)).toBeInTheDocument();
    });
  });

  it('clears error state on successful data fetch', async () => {
    // First render with error
    setupAxiosMocks.error('Initial error');
    const { rerender } = render(<AgGridExample />);
    
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
    
    // Then fix the API and refresh
    setupAxiosMocks.success();
    const refreshButton = screen.getByText('Refresh Data');
    await userEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });



  it('handles range selection with grid API not ready', async () => {
    render(<AgGridExample />);
    
    // Try to click range selection before grid is ready
    const rangeButton = screen.getByText('📊 Select 5 Rows × 3 Cols (15 cells)');
    await userEvent.click(rangeButton);
    
    // Should handle gracefully without errors
    expect(rangeButton).toBeInTheDocument();
  });

  it('renders all expected UI elements', () => {
    render(<AgGridExample />);
    
    // Check for main sections
    expect(screen.getByText(/Financial Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Timezone:/i)).toBeInTheDocument();
    expect(screen.getByTestId('ag-grid-mock')).toBeInTheDocument();
    
    // Check for control buttons
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-company-column')).toBeInTheDocument();
  });
}); 