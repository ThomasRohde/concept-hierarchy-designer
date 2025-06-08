import { openDB } from 'idb';
import { DB_NAME, DB_VERSION } from './offlineStorage';

export const checkDatabase = async (dbName: string = DB_NAME) => {
  try {
    console.group(`Detailed Database Check: ${dbName}`);
    console.log(`Attempting to open database: ${dbName}`);
    
    // Get all databases in the browser if supported
    try {
      // @ts-ignore - indexedDB.databases() is not in the TypeScript types but works in modern browsers
      if (indexedDB.databases) {
        const allDbs = await indexedDB.databases();
        console.log('All databases in browser:', allDbs);
        
        // Find the current version of our database
        const ourDb = allDbs.find(db => db.name === dbName);
        if (ourDb) {
          console.log(`Found existing database "${dbName}" with version:`, ourDb.version);
        }
      }
    } catch (err) {
      console.log('Could not list all databases:', err);
    }
    
    // Try to open the database with the correct version
    const db = await openDB(dbName, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        // Log existing object stores
        console.log(`Database upgrade handler called: v${oldVersion} → v${newVersion}`);
        console.log('Existing object stores before upgrade:', Array.from(db.objectStoreNames));
        
        // This is just for diagnostic purposes, don't create stores here
        // unless they don't exist in your actual implementation
      },
      terminated() {
        console.warn('Database connection was terminated abnormally');
      }
    });
    
    // Check database metadata
    console.log('Database info:', {
      name: db.name,
      version: db.version,
    });
    
    // List all object stores
    const storeNames = Array.from(db.objectStoreNames);
    console.log('Object stores:', storeNames);
    
    // Check data in each store
    for (const storeName of storeNames) {
      console.group(`Store: ${storeName}`);
      
      try {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        
        // Log store metadata
        console.log('Store info:', {
          name: store.name,
          keyPath: store.keyPath,
          autoIncrement: store.autoIncrement,
          indexNames: Array.from(store.indexNames)
        });
        
        // Count records
        const count = await store.count();
        console.log(`Record count: ${count}`);
        
        // Get all keys
        const allKeys = await store.getAllKeys();
        console.log(`All keys (${allKeys.length}):`, allKeys);
        
        if (count > 0) {
          // Get a sample of data (first 3 items)
          const items = await store.getAll(undefined, 3);
          console.log(`Sample data (first ${Math.min(3, items.length)} of ${count}):`);
          items.forEach((item, i) => {
            console.log(`- Item ${i} (key: ${allKeys[i]}):`, item);
          });
          
          // For specific keys of interest
          const keyNames = ['concept-hierarchy-data', 'concept-hierarchy-collapsed-nodes'];
          for (const key of keyNames) {
            try {
              const value = await store.get(key);
              if (value) {
                console.log(`Key "${key}":`, {
                  found: true,
                  type: Array.isArray(value) ? 'Array' : typeof value,
                  size: Array.isArray(value) ? value.length : 
                    (typeof value === 'object' ? Object.keys(value).length : 'N/A'),
                  sample: Array.isArray(value) && value.length > 0 ? value[0] : value
                });
              }
            } catch (err) {
              // Ignore errors for specific key lookups
            }
          }
        }
        
        await tx.done;
      } catch (err) {
        console.error(`Error examining store "${storeName}":`, err);
      }
      
      console.groupEnd();
    }

    // If we have no data store, warn about it
    if (!storeNames.includes('data')) {
      console.warn('No "data" object store found in the database!');
    }
    
    db.close();
    console.groupEnd();
    
    return { success: true, message: 'Database check complete' };
  } catch (error) {
    console.error('Database diagnostic error:', error);
    console.groupEnd();
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

export const logStorageState = () => {
  console.log('=== STORAGE DIAGNOSTIC ===');
  console.log('localStorage keys:', Object.keys(localStorage));
  
  // List contents of important keys
  const importantKeys = [
    'concept-hierarchy-data',
    'concept-hierarchy-collapsed-nodes',
    'offline-queue'
  ];
  
  importantKeys.forEach(key => {
    const prefixedKeys = Object.keys(localStorage)
      .filter(k => k.includes(key))
      .map(k => ({
        key: k,
        exists: !!localStorage.getItem(k),
        length: localStorage.getItem(k)?.length || 0
      }));
    
    if (prefixedKeys.length > 0) {
      console.log(`Keys related to ${key}:`, prefixedKeys);
    }
  });
  
  console.log('=== END STORAGE DIAGNOSTIC ===');
};