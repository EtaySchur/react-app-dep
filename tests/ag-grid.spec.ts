import { test, expect } from '@playwright/test';

test.describe('AG Grid Tests', () => {
  test('should load AG Grid with data', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for AG Grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    
    // Wait for data rows to appear (should be 20 with pagination)
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Check first row data
    const firstRow = page.locator('.ag-row').first();
    await expect(firstRow).toBeVisible();
    
    // Check that we have the expected column headers (more specific selector)
    await expect(page.locator('.ag-header-cell[col-id="symbol"]')).toBeVisible();
    await expect(page.locator('.ag-header-cell[col-id="companyName"]')).toBeVisible();
    await expect(page.locator('.ag-header-cell[col-id="price"]')).toBeVisible();
  });

  test('should display stock symbols correctly', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Check first few stock symbols using cell selectors
    const firstSymbol = page.locator('.ag-cell[col-id="symbol"]').first();
    await expect(firstSymbol).toContainText('AAPL');
    
    const secondSymbol = page.locator('.ag-cell[col-id="symbol"]').nth(1);  
    await expect(secondSymbol).toContainText('AAPL2');
  });

  test('should have working checkboxes', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Click first row checkbox
    const firstCheckbox = page.locator('.ag-row').first().locator('.ag-selection-checkbox');
    await firstCheckbox.click();
    
    // Verify row is selected (only count visible selected rows)
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(1);
  });

  test('should have working range selection buttons', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Check that range selection buttons exist with correct text
    await expect(page.getByText('📊 Select 5 Rows × 3 Cols (15 cells)')).toBeVisible();
    await expect(page.getByText('🎯 Select 3 Rows × 6 Cols (18 cells)')).toBeVisible();
    await expect(page.getByText('🔥 Select 10 Rows × 6 Cols (60 cells)')).toBeVisible();
    
    // Test clicking one of the buttons
    await page.getByText('📊 Select 5 Rows × 3 Cols (15 cells)').click();
    
    // Verify that rows are selected (only count visible selected rows)
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(5);
  });

  test('should select correct rows with "📊 Select 5 Rows × 3 Cols" button', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Click the 5 rows × 3 cols button
    await page.getByText('📊 Select 5 Rows × 3 Cols (15 cells)').click();
    
    // Verify exactly 5 rows are selected
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(5);
    await expect(page.locator('.ag-pinned-left-cols-container .ag-row-selected')).toHaveCount(5);
    
    // Verify the first 5 rows (indexes 0-4) are selected
    for (let i = 0; i < 5; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      const leftRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      
      await expect(centerRow).toHaveClass(/ag-row-selected/);
      await expect(leftRow).toHaveClass(/ag-row-selected/);
    }
    
    // Verify rows 5+ are NOT selected
    for (let i = 5; i < 10; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      const leftRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      
      await expect(centerRow).not.toHaveClass(/ag-row-selected/);
      await expect(leftRow).not.toHaveClass(/ag-row-selected/);
    }
    
    console.log('✅ 5 rows × 3 cols selection verified!');
  });

  test('should select correct rows with "🎯 Select 3 Rows × 6 Cols" button', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Click the 3 rows × 6 cols button
    await page.getByText('🎯 Select 3 Rows × 6 Cols (18 cells)').click();
    
    // Verify exactly 3 rows are selected
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(3);
    await expect(page.locator('.ag-pinned-left-cols-container .ag-row-selected')).toHaveCount(3);
    
    // Verify the first 3 rows (indexes 0-2) are selected
    for (let i = 0; i < 3; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      const leftRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      
      await expect(centerRow).toHaveClass(/ag-row-selected/);
      await expect(leftRow).toHaveClass(/ag-row-selected/);
      
      // Verify the expected symbols for selected rows
      const symbolCell = leftRow.locator('[col-id="symbol"]');
      const expectedSymbols = ['AAPL', 'AAPL2', 'AAPL3'];
      await expect(symbolCell).toHaveText(expectedSymbols[i]);
    }
    
    // Verify rows 3+ are NOT selected
    for (let i = 3; i < 10; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      const leftRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      
      await expect(centerRow).not.toHaveClass(/ag-row-selected/);
      await expect(leftRow).not.toHaveClass(/ag-row-selected/);
    }
    
    console.log('✅ 3 rows × 6 cols selection verified!');
  });

  test('should select correct rows with "🔥 Select 10 Rows × 6 Cols" button', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Click the 10 rows × 6 cols button
    await page.getByText('🔥 Select 10 Rows × 6 Cols (60 cells)').click();
    
    // Verify exactly 10 rows are selected
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(10);
    await expect(page.locator('.ag-pinned-left-cols-container .ag-row-selected')).toHaveCount(10);
    
    // Verify the first 10 rows (indexes 0-9) are selected
    const expectedSymbols = ['AAPL', 'AAPL2', 'AAPL3', 'AAPL4', 'AMZN', 'AMZN2', 'AMZN3', 'AMZN4', 'BAC', 'BAC2'];
    
    for (let i = 0; i < 10; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      const leftRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      
      await expect(centerRow).toHaveClass(/ag-row-selected/);
      await expect(leftRow).toHaveClass(/ag-row-selected/);
      
      // Verify the expected symbols for selected rows
      const symbolCell = leftRow.locator('[col-id="symbol"]');
      await expect(symbolCell).toHaveText(expectedSymbols[i]);
    }
    
    // Verify rows 10+ are NOT selected (check a few)
    for (let i = 10; i < 15; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      const leftRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      
      await expect(centerRow).not.toHaveClass(/ag-row-selected/);
      await expect(leftRow).not.toHaveClass(/ag-row-selected/);
    }
    
    console.log('✅ 10 rows × 6 cols selection verified!');
  });

  test('should clear previous selection when clicking different range buttons', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // First, select 5 rows
    await page.getByText('📊 Select 5 Rows × 3 Cols (15 cells)').click();
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(5);
    
    // Then, select 3 rows - should clear previous selection
    await page.getByText('🎯 Select 3 Rows × 6 Cols (18 cells)').click();
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(3);
    
    // Verify only first 3 rows are selected, not the previous 5
    for (let i = 0; i < 3; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      await expect(centerRow).toHaveClass(/ag-row-selected/);
    }
    
    // Verify rows 3-4 are NOT selected (they were selected before)
    for (let i = 3; i < 5; i++) {
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      await expect(centerRow).not.toHaveClass(/ag-row-selected/);
    }
    
    // Finally, select 10 rows - should clear previous selection
    await page.getByText('🔥 Select 10 Rows × 6 Cols (60 cells)').click();
    await expect(page.locator('.ag-center-cols-container .ag-row-selected')).toHaveCount(10);
    
    console.log('✅ Selection clearing between buttons verified!');
  });

  test('should validate first 10 rows with exact expected data', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load properly
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Expected static data for first 10 rows (alphabetical order: AAPL, AAPL2, AAPL3, AAPL4, AMZN, AMZN2, AMZN3, AMZN4, BAC, BAC2)
    const expectedData = [
      { symbol: 'AAPL', companyName: 'Apple Inc.' },
      { symbol: 'AAPL2', companyName: 'Apple Inc.' },
      { symbol: 'AAPL3', companyName: 'Apple Inc.' },
      { symbol: 'AAPL4', companyName: 'Apple Inc.' },
      { symbol: 'AMZN', companyName: 'Amazon.com Inc.' },
      { symbol: 'AMZN2', companyName: 'Amazon.com Inc.' },
      { symbol: 'AMZN3', companyName: 'Amazon.com Inc.' },
      { symbol: 'AMZN4', companyName: 'Amazon.com Inc.' },
      { symbol: 'BAC', companyName: 'Bank of America Corp.' },
      { symbol: 'BAC2', companyName: 'Bank of America Corp.' }
    ];
    
    // Validate each row
    for (let i = 0; i < 10; i++) {
      const expected = expectedData[i];
      
      // Validate symbol (pinned left column)
      const symbolRow = page.locator(`.ag-pinned-left-cols-container [row-index="${i}"]`);
      const symbolCell = symbolRow.locator('[col-id="symbol"]');
      await expect(symbolCell).toHaveText(expected.symbol);
      
      // Validate other columns (center container)
      const centerRow = page.locator(`.ag-center-cols-container [row-index="${i}"]`);
      
      // Validate company name
      const companyCell = centerRow.locator('[col-id="companyName"]');
      await expect(companyCell).toHaveText(expected.companyName);
      
      // Validate price format (should be $XXX.XX)
      const priceCell = centerRow.locator('[col-id="price"]');
      const priceText = await priceCell.textContent();
      expect(priceText).toMatch(/^\$\d+\.\d{2}$/);
      
      // Validate change format (should be +/-XX.XX)
      const changeCell = centerRow.locator('[col-id="change"]');
      const changeText = await changeCell.textContent();
      expect(changeText).toMatch(/^[+-]\d+\.\d{2}$/);
      
      // Validate change percent format (should be +/-XX.XX%)
      const changePercentCell = centerRow.locator('[col-id="changePercent"]');
      const changePercentText = await changePercentCell.textContent();
      expect(changePercentText).toMatch(/^[+-]\d+\.\d{2}%$/);
      
      // Validate volume format (should be XX.XM)
      const volumeCell = centerRow.locator('[col-id="volume"]');
      const volumeText = await volumeCell.textContent();
      expect(volumeText).toMatch(/^\d+\.\d+M$/);
      
      // Validate checkbox exists in the row (checkbox is also in pinned left)
      const checkbox = symbolRow.locator('.ag-selection-checkbox');
      await expect(checkbox).toBeVisible();
    }
    
    console.log('✅ All 10 rows validated with proper AG Grid selectors!');
  });

  test('should hide and show company column using hideColumn API', async ({ page }) => {
    await page.goto('/ag-grid');
    
    // Wait for grid to load
    await expect(page.locator('.ag-root-wrapper')).toBeVisible();
    await expect(page.locator('.ag-center-cols-container .ag-row')).toHaveCount(20, { timeout: 10000 });
    
    // Verify company column is initially visible
    await expect(page.locator('.ag-header-cell[col-id="companyName"]')).toBeVisible();
    await expect(page.locator('.ag-cell[col-id="companyName"]').first()).toBeVisible();
    
    // Check the hide/show button is present
    const toggleButton = page.getByTestId('toggle-company-column');
    await expect(toggleButton).toBeVisible();
    await expect(toggleButton).toContainText('🫥 Hide Company');
    
    // Click to hide the company column using hideColumn API
    await toggleButton.click();
    
    // Verify column is hidden
    await expect(page.locator('.ag-header-cell[col-id="companyName"]')).not.toBeVisible();
    await expect(page.locator('.ag-cell[col-id="companyName"]')).not.toBeVisible();
    
    // Verify button text changed
    await expect(toggleButton).toContainText('👁️ Show Company');
    
    // Click to show the company column again using hideColumn API
    await toggleButton.click();
    
    // Verify column is visible again
    await expect(page.locator('.ag-header-cell[col-id="companyName"]')).toBeVisible();
    await expect(page.locator('.ag-cell[col-id="companyName"]').first()).toBeVisible();
    
    // Verify button text changed back
    await expect(toggleButton).toContainText('🫥 Hide Company');
    
    console.log('✅ Column hide/show functionality using hideColumn API verified!');
  });
}); 