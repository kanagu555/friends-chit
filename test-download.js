// Simple test to verify XLSX library works
const testExcel = async () => {
  try {
    const XLSX = await import('xlsx');
    console.log('XLSX loaded successfully:', !!XLSX);
    
    // Create simple test data
    const testData = [
      { Name: 'Test 1', Value: 100 },
      { Name: 'Test 2', Value: 200 }
    ];
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(testData);
    XLSX.utils.book_append_sheet(wb, ws, 'Test');
    
    // Try to download
    XLSX.writeFile(wb, 'test.xlsx');
    console.log('Test Excel file should download');
    
  } catch (error) {
    console.error('Excel test failed:', error);
  }
};

// Run test
testExcel();