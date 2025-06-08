/**
 * Database Debugger Utility
 * 
 * This module exports utility functions for debugging IndexedDB in the browser.
 * For use directly in the browser console:
 * 
 * 1. Import it in your application
 * 2. Call window.dbDebugger.inspectDatabase() from the browser console
 */

import { DB_NAME } from './offlineStorage';
import { checkDatabase, logStorageState } from './dbDiagnostic';
import { runDatabaseDiagnostic } from './dbFixer';
import { openDB } from 'idb';

// Database inspector class
class DatabaseInspector {
  async inspectDatabase(dbName = DB_NAME) {
    console.group('Database Inspector');
    try {
      await checkDatabase(dbName);
    } catch (err) {
      console.error('Error during database inspection:', err);
    }
    console.groupEnd();
    return 'Inspection complete. Check console for details.';
  }
  
  async listAllDatabases() {
    console.group('All IndexedDB Databases');
    try {
      // @ts-ignore - This is a modern API not yet in TypeScript
      const databases = await indexedDB.databases();
      console.table(databases);
      return databases;
    } catch (err) {
      console.error('Could not list databases:', err);
      return [];
    } finally {
      console.groupEnd();
    }
  }
  
  async repairDatabase() {
    console.group('Database Repair');
    try {
      await runDatabaseDiagnostic();
      return 'Repair attempt complete. Check console for details.';
    } catch (err) {
      console.error('Error during repair:', err);
      return `Error: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      console.groupEnd();
    }
  }
  
  async dumpData(dbName = DB_NAME, storeName = 'data') {
    console.group(`Database Data Dump: ${dbName}.${storeName}`);
    try {
      const db = await openDB(dbName);
      if (!db.objectStoreNames.contains(storeName)) {
        console.error(`Store '${storeName}' does not exist`);
        console.groupEnd();
        return null;
      }
      
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const allData = await store.getAll();
      const allKeys = await store.getAllKeys();
      
      const result = allKeys.map((key, i) => ({
        key: String(key),
        value: allData[i]
      }));
      
      console.table(result.map(item => ({ 
        key: item.key, 
        type: Array.isArray(item.value) ? 'Array' : typeof item.value,
        size: Array.isArray(item.value) ? item.value.length : 
          (typeof item.value === 'object' && item.value !== null ? 
            Object.keys(item.value).length : 'N/A')
      })));
      
      console.log('Full data:', result);
      
      await tx.done;
      db.close();
      
      console.groupEnd();
      return result;
    } catch (err) {
      console.error('Error dumping data:', err);
      console.groupEnd();
      return null;
    }
  }
  
  async clearDatabase(dbName = DB_NAME) {
    if (!confirm(`⚠️ Are you sure you want to clear all data from database "${dbName}"?`)) {
      return 'Operation cancelled';
    }
    
    console.group('Clear Database');
    try {
      const db = await openDB(dbName);
      const storeNames = Array.from(db.objectStoreNames);
      
      for (const storeName of storeNames) {
        const tx = db.transaction(storeName, 'readwrite');
        await tx.store.clear();
        await tx.done;
        console.log(`Cleared store: ${storeName}`);
      }
      
      db.close();
      console.log(`Database "${dbName}" cleared successfully`);
      console.groupEnd();
      return `Database "${dbName}" cleared successfully`;
    } catch (err) {
      console.error('Error clearing database:', err);
      console.groupEnd();
      return `Error: ${err instanceof Error ? err.message : String(err)}`;
    }
  }
  
  showStorage() {
    logStorageState();
    return 'Local storage state logged to console';
  }
  
  help() {
    console.group('Database Debugger Help');
    console.log('Available methods:');
    console.log('- inspectDatabase(dbName?): Inspect the database structure and contents');
    console.log('- listAllDatabases(): List all IndexedDB databases in the browser');
    console.log('- repairDatabase(): Run diagnostic and repair operations');
    console.log('- dumpData(dbName?, storeName?): Dump all data from a store');
    console.log('- clearDatabase(dbName?): Clear all data from the database');
    console.log('- showStorage(): Log localStorage state');
    console.log('- help(): Show this help message');
    console.groupEnd();
    return 'Help shown in console';
  }
}

// Create the debugger instance
const dbDebugger = new DatabaseInspector();

// Make it available globally for browser console access
declare global {
  interface Window {
    dbDebugger: DatabaseInspector;
  }
}

// Expose to window object for browser console access
if (typeof window !== 'undefined') {
  window.dbDebugger = dbDebugger;
}

export default dbDebugger;