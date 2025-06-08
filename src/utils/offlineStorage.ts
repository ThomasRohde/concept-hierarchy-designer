import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface OfflineQueueItem {
  type: string;
  payload: any;
  timestamp: number;
}

interface OfflineDB extends DBSchema {
  data: {
    key: string;
    value: any;
  };
  queue: {
    key: number;
    value: OfflineQueueItem;
  };
}

export const DB_NAME = 'my-database';
export const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export const isIndexedDBSupported = (): boolean => {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
};

export const resetDatabase = async (): Promise<void> => {
  if (!isIndexedDBSupported()) {
    console.log('IndexedDB not supported, skipping database reset');
    return;
  }
  
  try {
    console.log('Resetting IndexedDB database...');
    
    // Close any existing connection
    if (dbPromise) {
      try {
        const db = await dbPromise;
        db.close();
      } catch (err) {
        console.warn('Error closing existing database connection:', err);
      }
      dbPromise = null;
    }
    
    // Delete the database
    await new Promise<void>((resolve, reject) => {
      const deleteReq = indexedDB.deleteDatabase(DB_NAME);
      deleteReq.onsuccess = () => {
        console.log('Database deleted successfully');
        resolve();
      };
      deleteReq.onerror = () => {
        console.error('Error deleting database:', deleteReq.error);
        reject(deleteReq.error);
      };
      deleteReq.onblocked = () => {
        console.warn('Database deletion blocked - close all connections');
      };
    });
    
    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
};

const getDB = async (): Promise<IDBPDatabase<OfflineDB>> => {
  if (!dbPromise) {
    console.log(`Opening IndexedDB database: ${DB_NAME} (version ${DB_VERSION})`);
    
    try {
      dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
        upgrade(db, oldVersion, newVersion) {
          console.log(`Upgrading database from v${oldVersion} to v${newVersion}`);
          
          // Log existing object stores before creating new ones
          console.log('Existing object stores before upgrade:', Array.from(db.objectStoreNames));
          
          // Always ensure data store exists
          if (!db.objectStoreNames.contains('data')) {
            console.log('Creating "data" object store');
            db.createObjectStore('data');
          } else {
            console.log('"data" object store already exists');
          }
          
          // Always ensure queue store exists
          if (!db.objectStoreNames.contains('queue')) {
            console.log('Creating "queue" object store');
            db.createObjectStore('queue', { 
              keyPath: 'id',
              autoIncrement: true 
            });
            console.log('Created queue store with autoIncrement');
          } else {
            console.log('"queue" object store already exists');
          }
          
          // Log final object stores after creation
          console.log('Object stores after upgrade:', Array.from(db.objectStoreNames));
        },
        blocked() {
          console.warn('Database opening blocked - another connection is still open');
        },
        blocking() {
          console.warn('This connection is blocking a newer version');
        },
        terminated() {
          console.error('Database connection terminated unexpectedly');
          dbPromise = null;
        }
      });
      
      // Log when database is successfully opened
      const db = await dbPromise;
      console.log('IndexedDB opened successfully:', {
        name: db.name,
        version: db.version,
        objectStores: Array.from(db.objectStoreNames)
      });
      
      // Verify the required object stores exist
      if (!db.objectStoreNames.contains('data') || !db.objectStoreNames.contains('queue')) {
        console.error('Required object stores are missing after database open!');
        console.log('Available stores:', Array.from(db.objectStoreNames));
        db.close();
        dbPromise = null;
        throw new Error('Database is missing required object stores');
      }
      
      return db;
    } catch (err) {
      console.error('Failed to open IndexedDB', err);
      dbPromise = null;
      throw err;
    }
  }
  return dbPromise;
};

export const saveData = async (key: string, value: any): Promise<void> => {
  if (!isIndexedDBSupported()) {
    console.log(`IndexedDB not supported, saving to localStorage: ${key}`);
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  
  try {
    console.log(`Saving to IndexedDB, key: "${key}", value type: ${Array.isArray(value) ? 'Array' : typeof value}`);
    if (Array.isArray(value)) {
      console.log(`Array length: ${value.length}`);
    } else if (typeof value === 'object' && value !== null) {
      console.log(`Object keys: ${Object.keys(value).join(', ')}`);
    }
    
    const db = await getDB();
    await db.put('data', value, key);
    console.log(`Successfully saved data to IndexedDB with key "${key}"`);
    
    // Verify the data was saved
    const savedData = await db.get('data', key);
    if (savedData) {
      console.log(`Verified data was saved with key "${key}"`);
    } else {
      console.warn(`Data verification failed for key "${key}" - could not read back data`);
    }
  } catch (error) {
    console.error(`Error saving data to IndexedDB with key "${key}":`, error);
    
    // Fallback to localStorage
    console.log(`Falling back to localStorage for key "${key}"`);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (lsError) {
      console.error(`Error saving to localStorage fallback:`, lsError);
      throw lsError; // Re-throw so caller knows operation failed completely
    }
  }
};

export const loadData = async (key: string): Promise<any | null> => {
  if (!isIndexedDBSupported()) {
    console.log(`IndexedDB not supported, loading from localStorage: ${key}`);
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
  
  try {
    console.log(`Loading from IndexedDB, key: "${key}"`);
    const db = await getDB();
    const value = await db.get('data', key);
    
    if (value !== undefined) {
      console.log(`Found data in IndexedDB for key "${key}", type: ${Array.isArray(value) ? 'Array' : typeof value}`);
      if (Array.isArray(value)) {
        console.log(`Array length: ${value.length}`);
      } else if (typeof value === 'object' && value !== null) {
        console.log(`Object keys: ${Object.keys(value).join(', ')}`);
      }
      return value;
    } else {
      console.log(`No data found in IndexedDB for key "${key}", checking localStorage...`);
      
      // Try localStorage as fallback for migration scenarios
      const lsVal = localStorage.getItem(key);
      if (lsVal) {
        try {
          console.log(`Found data in localStorage for key "${key}", attempting to parse...`);
          const parsedVal = JSON.parse(lsVal);
          
          // Auto-migrate this key to IndexedDB
          try {
            console.log(`Auto-migrating key "${key}" from localStorage to IndexedDB...`);
            await saveData(key, parsedVal);
            console.log(`Successfully migrated key "${key}" to IndexedDB`);
          } catch (migrationErr) {
            console.error(`Failed to auto-migrate key "${key}" to IndexedDB:`, migrationErr);
          }
          
          return parsedVal;
        } catch (parseErr) {
          console.error(`Error parsing localStorage data for key "${key}":`, parseErr);
        }
      }
      
      console.log(`No data found for key "${key}" in either storage`);
      return null;
    }
  } catch (error) {
    console.error(`Error loading data from IndexedDB with key "${key}":`, error);
    
    // Fallback to localStorage
    try {
      const lsVal = localStorage.getItem(key);
      return lsVal ? JSON.parse(lsVal) : null;
    } catch (lsError) {
      console.error(`Error loading from localStorage fallback:`, lsError);
      return null;
    }
  }
};

export const addToQueue = async (item: OfflineQueueItem): Promise<void> => {
  if (!isIndexedDBSupported()) {
    const queueStr = localStorage.getItem('offline-queue');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    queue.push(item);
    localStorage.setItem('offline-queue', JSON.stringify(queue));
    return;
  }
  const db = await getDB();
  await db.add('queue', item);
};

export const getQueue = async (): Promise<OfflineQueueItem[]> => {
  if (!isIndexedDBSupported()) {
    const queueStr = localStorage.getItem('offline-queue');
    return queueStr ? JSON.parse(queueStr) : [];
  }
  const db = await getDB();
  return db.getAll('queue');
};

export const clearQueue = async (): Promise<void> => {
  if (!isIndexedDBSupported()) {
    localStorage.removeItem('offline-queue');
    return;
  }
  const db = await getDB();
  const tx = db.transaction('queue', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

export const migrateLocalStorageToIndexedDB = async (): Promise<void> => {
  console.group('Migrating localStorage to IndexedDB');
  
  try {
    if (!isIndexedDBSupported()) {
      console.warn('IndexedDB is not supported, skipping migration');
      console.groupEnd();
      return;
    }
    
    console.log('IndexedDB is supported, proceeding with migration');
    
    // Ensure database is initialized first
    try {
      const db = await getDB();
      console.log('Database connection established for migration:', db.name);
    } catch (dbErr) {
      console.error('Failed to initialize database for migration:', dbErr);
      
      // Try to reset the database and try again
      console.log('Attempting to reset database and try again...');
      try {
        await resetDatabase();
        const db = await getDB();
        console.log('Database successfully reset and reconnected:', db.name);
      } catch (resetErr) {
        console.error('Failed to reset and reconnect database:', resetErr);
        console.groupEnd();
        return;
      }
    }
    
    // First check for prefixed keys
    const allKeys = Object.keys(localStorage);
    console.log('All localStorage keys:', allKeys);
    
    const relevantKeys = allKeys.filter(key => 
      key.includes('concept-hierarchy-data') || 
      key.includes('concept-hierarchy-collapsed-nodes')
    );
    
    console.log('Found relevant localStorage keys:', relevantKeys);
    
    // Check IndexedDB for existing data first
    console.log('Checking if data already exists in IndexedDB...');
    const existingTreeData = await loadData('concept-hierarchy-data');
    if (existingTreeData) {
      console.log('Tree data already exists in IndexedDB, size:', 
        Array.isArray(existingTreeData) ? existingTreeData.length : 'not an array');
    } else {
      console.log('No existing tree data found in IndexedDB, will migrate from localStorage');
    }
    
    // Handle tree data - try both prefixed and non-prefixed versions
    if (!existingTreeData) {
      // Try to find a key with concept-hierarchy-data (including prefixed ones)
      const treeKeys = relevantKeys.filter(key => key.includes('concept-hierarchy-data'));
      console.log('Found tree keys:', treeKeys);
      
      let migrated = false;
      
      // Try each key in order
      for (const key of treeKeys) {
        if (migrated) break;
        
        try {
          const data = localStorage.getItem(key);
          if (!data) {
            console.log(`No data found for key "${key}"`);
            continue;
          }
          
          console.log(`Attempting to migrate tree data from key "${key}", data length: ${data.length}`);
          
          // Parse data
          const parsedData = JSON.parse(data);
          if (!Array.isArray(parsedData) || parsedData.length === 0) {
            console.warn(`Invalid data format for key "${key}", skipping`);
            continue;
          }
          
          // Validate basic structure before saving
          const isValid = parsedData.every(item => 
            item && typeof item === 'object' && typeof item.id === 'string'
          );
          
          if (!isValid) {
            console.warn(`Invalid tree data structure for key "${key}", skipping`);
            continue;
          }
          
          // Save to IndexedDB
          await saveData('concept-hierarchy-data', parsedData);
          console.log(`Successfully migrated tree data to IndexedDB, ${parsedData.length} items`);
          migrated = true;
        } catch (e) {
          console.error(`Failed to migrate tree data from key "${key}":`, e);
        }
      }
      
      // Fallback to exact key if no migration happened
      if (!migrated) {
        try {
          const data = localStorage.getItem('concept-hierarchy-data');
          if (data) {
            console.log(`Fallback: trying exact key "concept-hierarchy-data", data length: ${data.length}`);
            const parsedData = JSON.parse(data);
            await saveData('concept-hierarchy-data', parsedData);
            console.log(`Successfully migrated tree data using fallback key`);
          } else {
            console.log('No tree data found in localStorage using fallback key');
          }
        } catch (e) {
          console.error('Failed to migrate tree data using fallback key:', e);
        }
      }
    }
    
    // Check IndexedDB for existing collapsed nodes data
    const existingCollapsedData = await loadData('concept-hierarchy-collapsed-nodes');
    if (existingCollapsedData) {
      console.log('Collapsed nodes data already exists in IndexedDB');
    } else {
      console.log('No existing collapsed nodes data found in IndexedDB, will migrate from localStorage');
      
      // Handle collapsed nodes
      const collapsedKeys = relevantKeys.filter(key => key.includes('concept-hierarchy-collapsed-nodes'));
      console.log('Found collapsed node keys:', collapsedKeys);
      
      let migrated = false;
      
      // Try each key in order
      for (const key of collapsedKeys) {
        if (migrated) break;
        
        try {
          const data = localStorage.getItem(key);
          if (!data) continue;
          
          console.log(`Attempting to migrate collapsed nodes from key "${key}", data length: ${data.length}`);
          
          // Parse data
          const parsedData = JSON.parse(data);
          
          // Save to IndexedDB (even if it's empty)
          await saveData('concept-hierarchy-collapsed-nodes', parsedData);
          console.log(`Successfully migrated collapsed nodes data to IndexedDB`);
          migrated = true;
        } catch (e) {
          console.error(`Failed to migrate collapsed nodes from key "${key}":`, e);
        }
      }
      
      // Fallback to exact key if no migration happened
      if (!migrated) {
        try {
          const data = localStorage.getItem('concept-hierarchy-collapsed-nodes');
          if (data) {
            console.log(`Fallback: trying exact key "concept-hierarchy-collapsed-nodes"`);
            const parsedData = JSON.parse(data);
            await saveData('concept-hierarchy-collapsed-nodes', parsedData);
            console.log(`Successfully migrated collapsed nodes using fallback key`);
          }
        } catch (e) {
          console.error('Failed to migrate collapsed nodes using fallback key:', e);
        }
      }
    }
    
    // Final verification
    console.log('Verifying migration by checking IndexedDB data...');
    
    const finalTreeData = await loadData('concept-hierarchy-data');
    const finalCollapsedData = await loadData('concept-hierarchy-collapsed-nodes');
    
    console.log('Final verification results:', {
      treeData: finalTreeData ? 
        `Found (${Array.isArray(finalTreeData) ? finalTreeData.length + ' items' : 'not an array'})` : 
        'Not found',
      collapsedData: finalCollapsedData ? 'Found' : 'Not found'
    });
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error during migration process:', error);
  } finally {
    console.groupEnd();
  }
};
