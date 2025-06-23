import React, { useCallback, useRef, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  GridApi, 
  ColumnApi,
  GridReadyEvent,
  ColDef,
  AddRangeSelectionParams,
  AgAngleSelect,
  AgAreaSeriesOptions,
  AgAxisLabelOptions,
  AgAxisGridStyle,
  AgAreaSeriesTooltip,
  CellClickedEvent,
  RangeSelectionChangedEvent
} from 'ag-grid-community';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// Realistic financial data for a trading dashboard
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
  const [rowData, setRowData] = useState(generateFinancialData());
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [rangeStats, setRangeStats] = useState<any>(null);
  const [angleSelectValue, setAngleSelectValue] = useState<number>(0);
  const [chartConfig, setChartConfig] = useState<any>(null);

  // Column definitions for financial data
  const columnDefs: ColDef[] = [
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
      field: 'marketCap', 
      headerName: 'Market Cap',
      width: 140,
      type: 'numericColumn',
      valueFormatter: (params) => '$' + (params.value / 1000000000).toFixed(2) + 'B'
    },
    { 
      field: 'pe', 
      headerName: 'P/E Ratio',
      width: 100,
      type: 'numericColumn'
    },
    { 
      field: 'dividend', 
      headerName: 'Dividend',
      width: 100,
      type: 'numericColumn',
      valueFormatter: (params) => `${params.value?.toFixed(2)}%`
    },
    { 
      field: 'beta', 
      headerName: 'Beta',
      width: 80,
      type: 'numericColumn'
    },
    { 
      field: 'sector', 
      headerName: 'Sector',
      width: 130,
      filter: true
    }
  ];

  useEffect(() => {
    try {
      // Set the initial angle value
      const initialAngle = 45;
      setAngleSelectValue(initialAngle);
      
      // Update chart configuration with initial angle
      updateChartConfiguration(initialAngle);
      
      console.log('Angle selection initialized successfully');
      console.log('Initial value:', initialAngle);
      
    } catch (error) {
      console.error('Angle selection initialization failed:', error);
    }
  }, []);

  // Create realistic chart configuration using deprecated APIs
  const updateChartConfiguration = useCallback((rotationAngle: number = 0) => {
    const areaSeriesOptions = {
      type: 'area',
      xKey: 'symbol',
      yKey: 'price',
      fill: '#2196f3',
      stroke: '#1976d2',
      strokeWidth: 2,
      fillOpacity: 0.6,
      normalizedTo: 100,
      stacked: false,
      marker: {
        enabled: true,
        size: 6,
        fill: '#1976d2',
        stroke: '#ffffff',
        strokeWidth: 2
      }
    };

    const axisLabelConfig = {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 11,
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
      rotation: rotationAngle, // Use the angle selector value
      autoRotate: rotationAngle === 0,
      autoRotateAngle: 45,
      formatter: (params: any) => {
        return `${params.value}${params.index !== undefined ? ` (${params.index})` : ''}`;
      }
    };

    const customGridStyle = {
      stroke: '#e1e8ed',
      lineDash: [3, 3]
    };

    const seriesTooltip = {
      // Custom tooltip implementation
    };

    const config = {
      areaSeriesOptions,
      axisLabelConfig,
      customGridStyle,
      seriesTooltip,
      rotationAngle
    };

    setChartConfig(config);

    console.log('Chart configuration updated:');
    console.log('- Rotation angle:', rotationAngle);
    console.log('- Area Series Options:', areaSeriesOptions);
    console.log('- Axis Label Config:', axisLabelConfig);
    console.log('- Custom Grid Style:', customGridStyle);
    console.log('- Series Tooltip configured');

    return config;
  }, [rowData]);

  // Handle range selection with real functionality
  const handleRangeSelection = useCallback((startRow: number, endRow: number, startCol: string, endCol: string) => {
    if (!gridApi) return;

    try {
      // Apply the range selection using the new API
      gridApi.addCellRange({
        rowStartIndex: startRow,
        rowEndIndex: endRow,
        columnStart: startCol,
        columnEnd: endCol
      });
      
      // Calculate statistics for the selected range
      const selectedRows = rowData.slice(startRow, endRow + 1);
      const numericColumns = ['price', 'change', 'changePercent', 'volume', 'marketCap', 'pe', 'dividend', 'beta'];
      
      const stats: any = {};
      numericColumns.forEach(col => {
        const values = selectedRows.map(row => row[col as keyof typeof row] as number).filter(val => !isNaN(val));
        if (values.length > 0) {
          stats[col] = {
            sum: values.reduce((a, b) => a + b, 0),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length
          };
        }
      });

      setRangeStats(stats);
      setSelectedRange(`Rows ${startRow}-${endRow}, Cols ${startCol}-${endCol}`);
      
      console.log('Range selection applied:', { startRow, endRow, startCol, endCol });
      console.log('Range statistics calculated:', stats);
      
    } catch (error) {
      console.error('Range selection failed:', error);
    }
  }, [gridApi, rowData]);

  // Predefined range selection buttons
  const handlePriceRangeSelection = useCallback(() => {
    handleRangeSelection(0, 4, 'symbol', 'changePercent');
  }, [handleRangeSelection]);

  const handleFullDataSelection = useCallback(() => {
    handleRangeSelection(0, rowData.length - 1, 'symbol', 'sector');
  }, [handleRangeSelection, rowData.length]);

  const handleTopPerformersSelection = useCallback(() => {
    // Sort by change percent and select top 3
    const sortedData = [...rowData].sort((a, b) => b.changePercent - a.changePercent);
    const topPerformers = sortedData.slice(0, 3);
    const indices = topPerformers.map(performer => rowData.findIndex(row => row.id === performer.id));
    
    if (indices.length > 0) {
      handleRangeSelection(Math.min(...indices), Math.max(...indices), 'symbol', 'changePercent');
    }
  }, [handleRangeSelection, rowData]);

  // Grid event handlers
  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    
    // Initialize chart configuration
    updateChartConfiguration(angleSelectValue);
    
    // Set up initial range selection
    setTimeout(() => {
      handlePriceRangeSelection();
    }, 500);
    
  }, [updateChartConfiguration, angleSelectValue, handlePriceRangeSelection]);

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
    
    // Update chart data based on clicked row
    if (chartConfig) {
      const newAngle = (angleSelectValue + 15) % 360;
      setAngleSelectValue(newAngle);
      updateChartConfiguration(newAngle);
    }
  }, [chartConfig, angleSelectValue, updateChartConfiguration]);

  // Refresh data with new random values
  const refreshData = useCallback(() => {
    setRowData(generateFinancialData());
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#1976d2', marginBottom: '10px' }}>Financial Dashboard - AG Grid Legacy APIs Demo</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This dashboard demonstrates real usage of deprecated AG Grid APIs that will be removed in v31.3.4.
          All functionality uses the legacy APIs and would break without proper migration.
        </p>
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
          Select Price Range (Uses AddRangeSelectionParams)
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
          Select Top Performers
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
          Select All Data
        </button>
        
        <button 
          onClick={() => updateChartConfiguration((angleSelectValue + 45) % 360)}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Rotate Chart Labels (Angle: {angleSelectValue}°)
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
      </div>

      {/* Stats Panel */}
      {selectedRange && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#e3f2fd', 
          borderRadius: '8px',
          border: '1px solid #1976d2'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Range Selection Stats: {selectedRange}</h4>
          {rangeStats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {Object.entries(rangeStats).map(([key, stats]: [string, any]) => (
                <div key={key} style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', textTransform: 'capitalize' }}>{key}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <div>Avg: {stats.avg.toFixed(2)}</div>
                    <div>Min: {stats.min.toFixed(2)}</div>
                    <div>Max: {stats.max.toFixed(2)}</div>
                    <div>Sum: {stats.sum.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chart Configuration Display */}
      {chartConfig && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f3e5f5', 
          borderRadius: '8px',
          border: '1px solid #9c27b0'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#9c27b0' }}>Active Chart Configuration</h4>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <div><strong>Area Series:</strong> {chartConfig.areaSeriesOptions.type} chart with {chartConfig.areaSeriesOptions.fillOpacity * 100}% opacity</div>
            <div><strong>Axis Labels:</strong> {chartConfig.axisLabelConfig.fontSize}px, rotated {chartConfig.rotationAngle}°</div>
            <div><strong>Grid Style:</strong> Dashed lines with {chartConfig.customGridStyle.lineDash.join(', ')} pattern</div>
            <div><strong>Tooltip:</strong> Custom renderer with company details</div>
          </div>
        </div>
      )}

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
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 80,
            resizable: true,
            sortable: true,
            filter: true,
          }}
          rowSelection="multiple"
          onGridReady={onGridReady}
          onRangeSelectionChanged={onRangeSelectionChanged}
          onCellClicked={onCellClicked}
          enableRangeSelection={true}
          enableCharts={true}
          animateRows={true}
          suppressRowClickSelection={true}
          rowMultiSelectWithClick={true}
          groupSelectsChildren={true}
          paginationAutoPageSize={true}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default AgGridExample;