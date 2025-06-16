import React, { useCallback, useRef, useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { 
  GridApi, 
  ColumnApi,
  GridReadyEvent,
  ColDef,
  AddRangeSelectionParams,  // BREAKING: Removed in v31.3.4
  AgAngleSelect,            // BREAKING: Removed in v31.3.4
  AgAreaSeriesOptions,      // BREAKING: Removed in v31.3.4
  AgAxisLabelOptions,       // BREAKING: Removed in v31.3.4
  AgAxisGridStyle,          // BREAKING: Removed in v31.3.4
  AgAreaSeriesTooltip       // BREAKING: Removed in v31.3.4
} from 'ag-grid-community';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// Sample data for the grid
const rowData = [
  { make: 'Toyota', model: 'Celica', price: 35000, year: 2020 },
  { make: 'Ford', model: 'Mondeo', price: 32000, year: 2019 },
  { make: 'Porsche', model: 'Boxster', price: 72000, year: 2021 },
  { make: 'BMW', model: 'M50', price: 60000, year: 2022 },
  { make: 'Audi', model: 'A4', price: 40000, year: 2020 }
];

const columnDefs: ColDef[] = [
  { field: 'make', sortable: true, filter: true },
  { field: 'model', sortable: true, filter: true },
  { field: 'price', sortable: true, filter: true },
  { field: 'year', sortable: true, filter: true }
];

const AgGridBreakingChangesExample: React.FC = () => {
  const gridRef = useRef<AgGridReact>(null);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [columnApi, setColumnApi] = useState<ColumnApi | null>(null);

  // BREAKING CHANGE USAGE 1: AddRangeSelectionParams interface (removed in v31.3.4)
  const handleAddRangeSelection = useCallback(() => {
    if (gridApi) {
      // This interface will break in v31.3.4
      const rangeParams: AddRangeSelectionParams = {
        rowStart: 0,
        floatingStart: 'top',
        rowEnd: 2,
        floatingEnd: 'top',
        columnStart: 'make',
        columnEnd: 'price'
      };
      
      console.log('Using AddRangeSelectionParams (WILL BREAK in v31.3.4):', rangeParams);
      // Note: The actual method might not exist, but we're testing the interface usage
    }
  }, [gridApi]);

  // BREAKING CHANGE USAGE 2: AgAngleSelect class (removed in v31.3.4)
  useEffect(() => {
    // This class will break in v31.3.4
    try {
      const angleSelect = new AgAngleSelect();
      console.log('Created AgAngleSelect instance (WILL BREAK in v31.3.4):', angleSelect);
      
      // Use some methods that exist on this class
      angleSelect.setRadius(50);
      angleSelect.setValue(45);
      console.log('AngleSelect radius:', angleSelect.getRadius());
      console.log('AngleSelect value:', angleSelect.getValue());
    } catch (error) {
      console.log('AgAngleSelect usage failed:', error);
    }
  }, []);

  // BREAKING CHANGE USAGE 3: Chart-related interfaces (removed in v31.3.4)
  const createChartConfiguration = useCallback(() => {
    // These interfaces will break in v31.3.4
    const areaSeriesOptions: AgAreaSeriesOptions = {
      type: 'area',
      xKey: 'year',
      yKey: 'price',
      fill: '#ff6b6b',
      stroke: '#ee5a52',
      strokeWidth: 2,
      fillOpacity: 0.7,
      normalizedTo: 100,
      stacked: true
    };

    const axisLabelOptions: AgAxisLabelOptions = {
      fontStyle: 'normal',
      fontWeight: 'bold',
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#333333',
      rotation: 45,
      autoRotate: true,
      autoRotateAngle: 335,
      format: '%Y',
      formatter: (params) => {
        return `${params.value} (${params.index})`;
      }
    };

    const axisGridStyle: AgAxisGridStyle = {
      stroke: '#e0e0e0',
      lineDash: [5, 5]
    };

    const areaSeriesTooltip: AgAreaSeriesTooltip = {
      renderer: (params) => {
        return `<b>${params.xValue}</b>: ${params.yValue}`;
      },
      format: 'currency'
    };

    console.log('Chart configuration using BREAKING interfaces (WILL BREAK in v31.3.4):');
    console.log('- AgAreaSeriesOptions:', areaSeriesOptions);
    console.log('- AgAxisLabelOptions:', axisLabelOptions);
    console.log('- AgAxisGridStyle:', axisGridStyle);
    console.log('- AgAreaSeriesTooltip:', areaSeriesTooltip);

    return {
      areaSeriesOptions,
      axisLabelOptions,
      axisGridStyle,
      areaSeriesTooltip
    };
  }, []);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    
    // Create chart configuration using breaking changes
    createChartConfiguration();
    
    // Test range selection with breaking interface
    handleAddRangeSelection();
  }, [createChartConfiguration, handleAddRangeSelection]);

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedRows = gridApi.getSelectedRows();
      console.log('Selected rows:', selectedRows);
    }
  }, [gridApi]);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        <button 
          onClick={handleAddRangeSelection}
          style={{ 
            padding: '8px 16px', 
            marginRight: '10px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test AddRangeSelectionParams (BREAKING)
        </button>
        
        <button 
          onClick={createChartConfiguration}
          style={{ 
            padding: '8px 16px',
            backgroundColor: '#4ecdc4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Chart Interfaces
        </button>
      </div>

      <div 
        className="ag-theme-alpine" 
        style={{ height: 400, width: '100%' }}
      >
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
          }}
          rowSelection="multiple"
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          enableRangeSelection={true}
          enableCharts={true}
          animateRows={true}
        />
      </div>
    </div>
  );
};

export default AgGridBreakingChangesExample; 