import React, { useCallback, useRef, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import axios from 'axios';
import { 
  GridApi, 
  ColumnApi,
  GridReadyEvent,
  ColDef,
  CellClickedEvent,
  RangeSelectionChangedEvent,
} from 'ag-grid-community';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const generateFinancialData = () => {
  const companies = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' },
    { symbol: 'CRM', name: 'Salesforce Inc.' },
    { symbol: 'ORCL', name: 'Oracle Corp.' }
  ];

  return companies.map((company, index) => {
    const basePrice = 100 + Math.random() * 300;
    const volume = Math.floor(1000000 + Math.random() * 5000000);
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;
    
    return {
      id: index + 1,
      symbol: company.symbol,
      companyName: company.name,
      price: parseFloat(basePrice.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: volume,
      marketCap: parseFloat((basePrice * (1000000 + Math.random() * 9000000)).toFixed(0)),
      pe: parseFloat((15 + Math.random() * 35).toFixed(2)),
      dividend: parseFloat((Math.random() * 5).toFixed(2)),
      beta: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
      sector: ['Technology', 'Consumer', 'Communications', 'Automotive', 'Entertainment'][Math.floor(Math.random() * 5)]
    };
  });
};

const AgGridExample: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);
  const [stockData, setStockData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [rangeStats, setRangeStats] = useState<any>(null);
  const [isCompanyColumnVisible, setIsCompanyColumnVisible] = useState<boolean>(true);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('America/New_York');

  // Available timezones for demonstration
  const timezones = [
    { label: 'New York (EST/EDT)', value: 'America/New_York' },
    { label: 'London (GMT/BST)', value: 'Europe/London' },
    { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
    { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
    { label: 'Los Angeles (PST/PDT)', value: 'America/Los_Angeles' },
    { label: 'UTC', value: 'UTC' }
  ];

  // Helper function to convert UTC timestamp to selected timezone
  const convertToSelectedTimezone = useCallback((utcTimestamp: string) => {
    try {
      const utcDate = new Date(utcTimestamp);
      const zonedDate = toZonedTime(utcDate, selectedTimezone);
      return zonedDate.toLocaleString('en-US', {
        timeZone: selectedTimezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Error converting timezone:', error);
      return utcTimestamp;
    }
  }, [selectedTimezone]);

  // Fetch data from Express server
  const fetchStockData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:3001/api/stocks', {
        params: {
          count: 50,
          sortBy: 'symbol',
          order: 'asc',
          timezone: selectedTimezone // Pass selected timezone to server
        }
      });
      
      if (response.data && response.data.data) {
        // Enhance data with timezone conversions
        const enhancedData = response.data.data.map((stock: any) => ({
          ...stock,
          lastUpdatedLocal: convertToSelectedTimezone(stock.lastUpdated),
          marketCloseLocal: convertToSelectedTimezone(stock.marketCloseTime),
          timezoneDemo: `UTC → ${selectedTimezone}`
        }));
        
        setStockData(enhancedData);
        console.log('Stock data loaded from server:', enhancedData.length, 'records');
        console.log('Server response metadata:', {
          total: response.data.total,
          timestamp: response.data.timestamp,
          timezone: response.data.timezone,
          selectedTimezone: selectedTimezone
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Failed to fetch stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      // Fallback to local data if server is not available
      setStockData(generateFinancialData());
    } finally {
      setLoading(false);
    }
  }, [selectedTimezone, convertToSelectedTimezone]);

  // Load data on component mount and when timezone changes
  useEffect(() => {
    fetchStockData();
  }, [fetchStockData]);

  // Timezone conversion demo function
  const demonstrateTimezoneConversion = useCallback(() => {
    const now = new Date();
    const utcTime = now.toISOString();
    const zonedTime = toZonedTime(now, selectedTimezone);
    const backToUtc = fromZonedTime(zonedTime, selectedTimezone);
    
    console.log('🌍 Timezone Conversion Demo:');
    console.log('Original UTC time:', utcTime);
    console.log(`Converted to ${selectedTimezone}:`, zonedTime.toISOString());
    console.log('Converted back to UTC:', backToUtc.toISOString());
    console.log('Times match:', utcTime === backToUtc.toISOString());
    
    alert(`Timezone Conversion Demo:\n\nOriginal UTC: ${utcTime}\nIn ${selectedTimezone}: ${zonedTime.toLocaleString()}\nBack to UTC: ${backToUtc.toISOString()}\n\nCheck console for details!`);
  }, [selectedTimezone]);

  // Column definitions for financial data
  const columnDefs: ColDef[] = [
    { 
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left',
      suppressMenu: true,
      sortable: false,
      filter: false
    },
    { 
      field: 'symbol', 
      headerName: 'Symbol',
      width: 100,
      pinned: 'left',
      cellStyle: { fontWeight: 'bold', color: '#1976d2' }
    },
    { 
      field: 'companyName', 
      headerName: 'Company',
      width: 200,
      tooltipField: 'companyName'
    },
    { 
      field: 'price', 
      headerName: 'Price ($)',
      width: 120,
      type: 'numericColumn',
      valueFormatter: (params) => `$${params.value?.toFixed(2)}`,
      cellStyle: (params) => ({
        color: params.data?.change >= 0 ? '#4caf50' : '#f44336',
        fontWeight: 'bold'
      })
    },
    { 
      field: 'change', 
      headerName: 'Change ($)',
      width: 120,
      type: 'numericColumn',
      valueFormatter: (params) => `${params.value >= 0 ? '+' : ''}${params.value?.toFixed(2)}`,
      cellStyle: (params) => ({
        color: params.value >= 0 ? '#4caf50' : '#f44336'
      })
    },
    { 
      field: 'changePercent', 
      headerName: 'Change (%)',
      width: 120,
      type: 'numericColumn',
      valueFormatter: (params) => `${params.value >= 0 ? '+' : ''}${params.value?.toFixed(2)}%`,
      cellStyle: (params) => ({
        color: params.value >= 0 ? '#4caf50' : '#f44336'
      })
    },
    { 
      field: 'volume', 
      headerName: 'Volume',
      width: 130,
      type: 'numericColumn',
      valueFormatter: (params) => (params.value / 1000000).toFixed(1) + 'M'
    },
    { 
      field: 'lastUpdatedLocal', 
      headerName: 'Last Updated (Local)',
      width: 200,
      cellStyle: { fontSize: '12px', color: '#666' },
      headerTooltip: 'Last updated time converted to selected timezone'
    },
    { 
      field: 'marketCloseLocal', 
      headerName: 'Market Close (Local)',
      width: 200,
      cellStyle: { fontSize: '12px', color: '#666' },
      headerTooltip: 'Market close time converted to selected timezone'
    },
    { 
      field: 'timezoneDemo', 
      headerName: 'Timezone Conversion',
      width: 180,
      cellStyle: { fontSize: '12px', color: '#1976d2', fontWeight: 'bold' },
      headerTooltip: 'Shows the timezone conversion being applied'
    }
  ];

  // Grid event handlers
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  }, []);

  const onRangeSelectionChanged = useCallback((event: RangeSelectionChangedEvent) => {
    const ranges = gridApi?.getCellRanges();
    if (ranges && ranges.length > 0) {
      const range = ranges[0];
      console.log('Range selection changed:', range);
      setSelectedRange(`Active range: ${range.startRow?.rowIndex}-${range.endRow?.rowIndex}`);
    }
  }, [gridApi]);

  const onCellClicked = useCallback((event: CellClickedEvent) => {
    console.log('Cell clicked:', event.data);
  }, []);

  const handleRangeSelection = useCallback((startRow: number, endRow: number, startCol: string, endCol: string) => {
    console.log('🎯 handleRangeSelection called with:', { startRow, endRow, startCol, endCol });
    
    if (!gridApi || !columnApi) {
      console.log('❌ Grid API or Column API not available yet');
      setSelectedRange('Grid API not ready yet');
      return;
    }

    console.log('✅ Grid API available, proceeding with range selection');
    console.log('📊 Current row data length:', stockData.length);

    try {
      gridApi.deselectAll();
      
      const rowsToSelect: any[] = [];
      for (let i = startRow; i <= endRow; i++) {
        const rowNode = gridApi.getDisplayedRowAtIndex(i);
        if (rowNode) {
          rowsToSelect.push(rowNode);
        }
      }
      
      console.log('🎯 Selecting rows:', rowsToSelect.length);
      
      // Select the rows
      rowsToSelect.forEach(rowNode => {
        rowNode.setSelected(true);
      });
      
      // Calculate the selection details for the stats
      const numRows = endRow - startRow + 1;
      const allColumns = columnApi.getAllColumns();
      console.log('🔍 All columns:', allColumns);
      
      if (!allColumns) {
        console.error('❌ Could not get all columns from columnApi');
        setSelectedRange('Error: Could not access all columns');
        return;
      }
      
      const startColIndex = allColumns.findIndex(col => col.getColId() === startCol);
      const endColIndex = allColumns.findIndex(col => col.getColId() === endCol);
      const numCols = endColIndex - startColIndex + 1;
      const totalCells = numRows * numCols;
      
      console.log('✅ Selection simulation successful:', {
        numRows,
        numCols,
        totalCells,
        startColIndex,
        endColIndex
      });
      
      // Focus on the first cell of the selection
      const firstRowNode = gridApi.getDisplayedRowAtIndex(startRow);
      if (firstRowNode) {
        gridApi.setFocusedCell(startRow, startCol);
        console.log('🎯 Focused on first cell:', { row: startRow, col: startCol });
      }
      
      // Update the stats
      const selectedData = rowsToSelect.map(node => node.data);
      const stats = calculateRangeStats(selectedData, startCol, endCol);
      setRangeStats(stats);
      
      // Set the selection message
      setSelectedRange(`Selected ${numRows} rows × ${numCols} columns (${totalCells} cells) - Community Edition using row selection`);
      
      console.log('✅ Range selection simulation completed successfully');
      
    } catch (error) {
      console.error('❌ Error applying range selection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSelectedRange('Error applying range selection: ' + errorMessage);
      setRangeStats(null);
    }
  }, [gridApi, columnApi, stockData]);

  // Calculate statistics for the selected range
  const calculateRangeStats = (selectedData: any[], startCol: string, endCol: string) => {
    if (!selectedData.length) return null;
    
    const columns = ['symbol', 'companyName', 'price', 'change', 'changePercent', 'volume'];
    const startColIndex = columns.indexOf(startCol);
    const endColIndex = columns.indexOf(endCol);
    const selectedColumns = columns.slice(startColIndex, endColIndex + 1);
    
    // Calculate stats for numeric columns
    const numericColumns = ['price', 'change', 'changePercent', 'volume'];
    const stats: any = {};
    
    selectedColumns.forEach(col => {
      if (numericColumns.includes(col)) {
        const values = selectedData.map(row => parseFloat(row[col])).filter(val => !isNaN(val));
        if (values.length > 0) {
          stats[col] = {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            sum: values.reduce((a, b) => a + b, 0)
          };
        }
      }
    });
    
    return {
      rowCount: selectedData.length,
      columnCount: selectedColumns.length,
      totalCells: selectedData.length * selectedColumns.length,
      columns: selectedColumns,
      stats
    };
  };

  // Predefined range selection buttons
  const handlePriceRangeSelection = useCallback(() => {
    // Select first 5 rows, from Symbol to Price columns (3 columns, 5 rows = 15 cells)
    handleRangeSelection(0, 4, 'symbol', 'price');
  }, [handleRangeSelection]);

  const handleFullDataSelection = useCallback(() => {
    // Select first 10 rows, all visible columns (6 columns, 10 rows = 60 cells)
    handleRangeSelection(0, 9, 'symbol', 'changePercent');
  }, [handleRangeSelection]);

  const handleTopPerformersSelection = useCallback(() => {
    // Select first 3 rows, all columns (6 columns, 3 rows = 18 cells)
    handleRangeSelection(0, 2, 'symbol', 'changePercent');
  }, [handleRangeSelection]);

  // Refresh data from server
  const refreshData = useCallback(() => {
    fetchStockData();
  }, [fetchStockData]);

  // Hide/Show Company column using hideColumn API
  const toggleCompanyColumn = useCallback(() => {
    if (!columnApi) {
      console.warn('Column API not available yet');
      return;
    }
    
    if (isCompanyColumnVisible) {
      console.log('Hiding company column using hideColumn API');
      // Use the hideColumn method
      columnApi.hideColumn('companyName', true);
      setIsCompanyColumnVisible(false);
    } else {
      console.log('Showing company column using hideColumn API');
      // Use hideColumn with false to show the column
      columnApi.hideColumn('companyName', false);
      setIsCompanyColumnVisible(true);
    }
  }, [columnApi, isCompanyColumnVisible]);

  return (
    <div style={{ padding: '20px', maxWidth: '1800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#1976d2', marginBottom: '10px' }}>Financial Dashboard - AG Grid with Timezone Conversion Demo</h2>
       
        
        {/* Loading and Error States */}
        {loading && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            marginBottom: '20px',
            color: '#856404'
          }}>
            <div data-testid="loading-indicator">Loading stock data from server...</div>
          </div>
        )}
        
        {error && (
          <div style={{ 
            padding: '15px', 
            backgroundColor: '#f8d7da', 
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '20px',
            color: '#721c24'
          }}>
            <div data-testid="error-message">Error: {error}</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              Using fallback data. Make sure the Express server is running on port 3001.
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button 
          onClick={handlePriceRangeSelection}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          📊 Select 5 Rows × 3 Cols (15 cells)
        </button>
        
        <button 
          onClick={handleTopPerformersSelection}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🎯 Select 3 Rows × 6 Cols (18 cells)
        </button>

        <button 
          onClick={handleFullDataSelection}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🔥 Select 10 Rows × 6 Cols (60 cells)
        </button>
        
        <button 
          onClick={refreshData}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#607d8b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Refresh Data
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '14px', color: '#666' }}>Timezone:</label>
          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={demonstrateTimezoneConversion}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          🌍 Demo Timezone Conversion
        </button>

        <button 
          onClick={toggleCompanyColumn}
          style={{ 
            padding: '8px 16px',
            backgroundColor: isCompanyColumnVisible ? '#e91e63' : '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          data-testid="toggle-company-column"
        >
          {isCompanyColumnVisible ? '🫥 Hide Company' : '👁️ Show Company'}
        </button>
      </div>

      {/* The AG Grid */}
      <div 
        className="ag-theme-alpine" 
        style={{ 
          height: 500, 
          width: '100%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={stockData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            minWidth: 100,
          }}
          onGridReady={onGridReady}
          onRangeSelectionChanged={onRangeSelectionChanged}
          onCellClicked={onCellClicked}
          rowSelection="multiple"
          suppressRowClickSelection={false}
          enableRangeSelection={false}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          domLayout="normal"
        />
      </div>
    </div>
  );
};

export default AgGridExample;