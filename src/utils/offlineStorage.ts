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

const DB_NAME = 'offline-store';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export const isIndexedDBSupported = (): boolean => {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
};

const getDB = async (): Promise<IDBPDatabase<OfflineDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('data')) {
          db.createObjectStore('data');
        }
        if (!db.objectStoreNames.contains('queue')) {
          db.createObjectStore('queue', { keyPath: 'id', autoIncrement: true });
        }
      }
    }).catch(err => {
      console.error('Failed to open IndexedDB', err);
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

export const saveData = async (key: string, value: any): Promise<void> => {
  if (!isIndexedDBSupported()) {
    localStorage.setItem(key, JSON.stringify(value));
    return;
  }
  const db = await getDB();
  await db.put('data', value, key);
};

export const loadData = async (key: string): Promise<any | null> => {
  if (!isIndexedDBSupported()) {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
  const db = await getDB();
  return db.get('data', key);
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
  if (!isIndexedDBSupported()) return;
  const tree = localStorage.getItem('concept-hierarchy-data');
  const collapsed = localStorage.getItem('concept-hierarchy-collapsed-nodes');
  if (tree) {
    try {
      await saveData('concept-hierarchy-data', JSON.parse(tree));
    } catch (e) {
      console.error('Failed to migrate tree data', e);
    }
  }
  if (collapsed) {
    try {
      await saveData('concept-hierarchy-collapsed-nodes', JSON.parse(collapsed));
    } catch (e) {
      console.error('Failed to migrate collapsed nodes', e);
    }
  }
};
