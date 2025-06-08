import { checkDatabase, logStorageState } from './dbDiagnostic';
import { saveData, loadData } from './offlineStorage';

/**
 * Run this function to diagnose and fix IndexedDB issues
 */
export const runDatabaseDiagnostic = async () => {
  console.log('=== RUNNING DATABASE DIAGNOSTIC ===');
  
  // 1. Check localStorage state
  console.log('--- CHECKING LOCALSTORAGE ---');
  logStorageState();
  
  // 2. Check IndexedDB current state
  console.log('--- CHECKING INDEXEDDB CURRENT STATE ---');
  await checkDatabase();
  
  // 3. Test saving and loading data
  console.log('--- TESTING SAVE/LOAD OPERATIONS ---');
  const testData = { test: true, timestamp: Date.now() };
  
  try {
    await saveData('diagnostic-test-key', testData);
    console.log('Test data saved successfully');
    
    const loadedData = await loadData('diagnostic-test-key');
    console.log('Loaded test data:', loadedData);
    
    if (loadedData && loadedData.test === true) {
      console.log('✅ Data save/load test PASSED');
    } else {
      console.log('❌ Data save/load test FAILED');
    }
  } catch (err) {
    console.error('Error during save/load test:', err);
  }
  
  console.log('=== DATABASE DIAGNOSTIC COMPLETE ===');
  return 'Database diagnostic complete';
};

export default runDatabaseDiagnostic;
