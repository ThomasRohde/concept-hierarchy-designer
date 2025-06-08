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

const getDB = async (retryCount = 0): Promise<IDBPDatabase<OfflineDB>> => {
  const MAX_RETRIES = 3;
  
  if (!dbPromise) {
    console.log(`Opening IndexedDB database: ${DB_NAME} (version ${DB_VERSION}) - attempt ${retryCount + 1}`);
    
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
        
        // Retry with database reset if this is not the last attempt
        if (retryCount < MAX_RETRIES) {
          console.log(`Attempting database reset and retry (${retryCount + 1}/${MAX_RETRIES})`);
          await resetDatabase();
          await new Promise(resolve => setTimeout(resolve, 100)); // Brief delay
          return getDB(retryCount + 1);
        }
        
        throw new Error('Database is missing required object stores');
      }
      
      return db;
    } catch (err) {
      console.error('Failed to open IndexedDB', err);
      dbPromise = null;
      
      // Retry if it's a database structure issue and we haven't exceeded max retries
      if (retryCount < MAX_RETRIES && (err as Error).message.includes('missing required object stores')) {
        console.log(`Retrying database initialization (${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 200 * (retryCount + 1))); // Exponential backoff
        return getDB(retryCount + 1);
      }
      
      throw err;
    }
  }
  return dbPromise;
};

export const saveData = async (key: string, value: any): Promise<void> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB is not supported in this environment');
  }
  
  const db = await getDB();
  await db.put('data', value, key);
};

export const loadData = async (key: string): Promise<any | null> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB is not supported in this environment');
  }
  
  const db = await getDB();
  const value = await db.get('data', key);
  
  return value !== undefined ? value : null;
};

export const addToQueue = async (item: OfflineQueueItem): Promise<void> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB is not supported in this environment');
  }
  const db = await getDB();
  await db.add('queue', item);
};

export const getQueue = async (): Promise<OfflineQueueItem[]> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB is not supported in this environment');
  }
  const db = await getDB();
  return db.getAll('queue');
};

export const clearQueue = async (): Promise<void> => {
  if (!isIndexedDBSupported()) {
    throw new Error('IndexedDB is not supported in this environment');
  }
  const db = await getDB();
  const tx = db.transaction('queue', 'readwrite');
  await tx.store.clear();
  await tx.done;
};

