import { NodeData } from '../types';
import { toast } from 'react-hot-toast';
import { getPrefixedKey } from './storagePrefix';
import { saveData, loadData, DB_NAME, DB_VERSION } from './offlineStorage';
import { openDB } from 'idb';

// Base key names
const BASE_STORAGE_KEY = 'concept-hierarchy-data';
const BASE_COLLAPSED_NODES_KEY = 'concept-hierarchy-collapsed-nodes';
const BASE_LAST_SAVED_KEY = 'concept-hierarchy-last-saved';

// Get prefixed keys to avoid conflicts with HMR in development
const STORAGE_KEY = getPrefixedKey(BASE_STORAGE_KEY);
const COLLAPSED_NODES_KEY = getPrefixedKey(BASE_COLLAPSED_NODES_KEY);
const LAST_SAVED_KEY = getPrefixedKey(BASE_LAST_SAVED_KEY);

/**
 * Tests if localStorage is available and working
 * @returns boolean indicating if localStorage is available
 */
const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, 'test');
    const result = localStorage.getItem(testKey) === 'test';
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    return false;
  }
};

/**
 * Debug function to log all localStorage keys and their values
 * Call this from the browser console: import('./utils/storageUtils.js').then(m => m.debugLocalStorage())
 */
export const debugLocalStorage = (): void => {
  console.group('LocalStorage Debug');
  
  try {
    console.log('Storage available:', isLocalStorageAvailable());
    console.log('Using prefixed keys:');
    console.log('- Data key:', STORAGE_KEY);
    console.log('- Collapsed nodes key:', COLLAPSED_NODES_KEY);
    
    console.log('Current localStorage contents:');    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        if (key) {
          const value = localStorage.getItem(key);
          if (value) {
            console.log(`${key}:`, value.length > 100 ? 
              `${value.substring(0, 100)}... (${value.length} chars)` : value);
          } else {
            console.log(`${key}: <null or empty value>`);
          }
        }
      } catch (e) {
        console.error(`Error reading key ${key}:`, e);
      }
    }
    
    // Check specifically for our data
    const modelData = localStorage.getItem(STORAGE_KEY);
    if (modelData) {
      try {
        const parsed = JSON.parse(modelData);
        console.log('Model data parsed successfully:', { 
          length: parsed.length,
          isArray: Array.isArray(parsed),
          firstItem: parsed[0]
        });
      } catch (e) {
        console.error('Error parsing model data:', e);
      }
    } else {
      console.log('No model data found with key:', STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error in debugLocalStorage:', e);
  }
  
  console.groupEnd();
};

/**
 * Saves the concept hierarchy tree to IndexedDB (with localStorage fallback)
 * @param nodes The concept hierarchy nodes to save
 * @returns boolean indicating success
 */
export const saveTreeToLocalStorage = async (nodes: NodeData[]): Promise<boolean> => {
  if (!nodes || nodes.length === 0) {
    console.warn('Attempted to save empty or null nodes array');
    return false;
  }

  try {
    // Save timestamp of last successful save
    const timestamp = new Date().toISOString();
    
    console.log('Saving tree data, nodes count:', nodes.length);
    
    // Try to save to IndexedDB first
    try {
      await saveData(BASE_STORAGE_KEY, nodes);
      await saveData(BASE_LAST_SAVED_KEY, timestamp);
      console.log('Tree data successfully saved to IndexedDB');
      return true;
    } catch (idbError) {
      console.error('Error saving to IndexedDB, falling back to localStorage:', idbError);
      
      // Fallback to localStorage if IndexedDB fails
      if (!isLocalStorageAvailable()) {
        console.error('localStorage not available for saving');
        return false;
      }
      
      // Convert to string first to catch stringification errors
      const nodesJson = JSON.stringify(nodes);
      
      // Store the data
      localStorage.setItem(STORAGE_KEY, nodesJson);
      localStorage.setItem(LAST_SAVED_KEY, timestamp);
      
      // Verify the save worked by reading back a small piece
      const verificationCheck = localStorage.getItem(STORAGE_KEY);
      if (!verificationCheck) {
        console.error('Verification failed: Could not read back saved data');
        return false;
      }
      
      return true;
    }
  } catch (error) {
    // Handle storage errors
    console.error('Error saving tree data:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Storage quota exceeded - could show a notification to the user
      toast.error('Storage limit exceeded. Your concept model is too large for browser storage.');
    }
    
    return false;
  }
};

/**
 * Saves the collapsed nodes state to IndexedDB (with localStorage fallback)
 * @param collapsedNodes Set of collapsed node IDs
 * @returns Promise resolving to boolean indicating success
 */
export const saveCollapsedNodesToLocalStorage = async (collapsedNodes: Set<string>): Promise<boolean> => {
  try {
    const collapsedArray = [...collapsedNodes];
    
    // Try to save to IndexedDB first
    try {
      await saveData(BASE_COLLAPSED_NODES_KEY, collapsedArray);
      return true;
    } catch (idbError) {
      console.error('Error saving collapsed nodes to IndexedDB, falling back to localStorage:', idbError);
      
      // Fallback to localStorage
      localStorage.setItem(COLLAPSED_NODES_KEY, JSON.stringify(collapsedArray));
      return true;
    }
  } catch (error) {
    console.error('Error saving collapsed nodes:', error);
    return false;
  }
};

/**
 * Loads the concept hierarchy tree from IndexedDB (with localStorage fallback)
 * @returns The stored concept hierarchy nodes, or null if none exists
 */
export const loadTreeFromLocalStorage = async (): Promise<NodeData[] | null> => {
  try {
    console.log('Loading tree data from storage...');
    
    // Try IndexedDB first
    try {
      console.log('Attempting to load from IndexedDB...');
      const idbData = await loadData(BASE_STORAGE_KEY);
      
      if (idbData) {
        console.log('Data found in IndexedDB:', {
          isArray: Array.isArray(idbData),
          length: Array.isArray(idbData) ? idbData.length : 'not an array',
          firstItem: Array.isArray(idbData) && idbData.length > 0 ? idbData[0] : null
        });
        
        // Validate the data structure
        if (Array.isArray(idbData) && idbData.length > 0) {
          // More detailed validation
          const isValid = idbData.every(node => 
            node &&
            typeof node === 'object' &&
            typeof node.id === 'string' &&
            typeof node.name === 'string' &&
            typeof node.description === 'string' &&
            (node.parent === null || typeof node.parent === 'string')
          );
          
          if (isValid) {
            console.log('Valid data found in IndexedDB, returning', idbData.length, 'nodes');
            return idbData;
          }
        }
        console.warn('Invalid data structure found in IndexedDB');
      }
    } catch (idbError) {
      console.error('Error loading from IndexedDB, falling back to localStorage:', idbError);
    }
    
    // Fallback to localStorage
    console.log('Falling back to localStorage...');
    
    // First check if localStorage is available
    if (!isLocalStorageAvailable()) {
      console.error('localStorage not available for loading');
      return null;
    }
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    // Debug what we actually got from storage
    console.log('Raw localStorage content:', {
      key: STORAGE_KEY,
      hasData: Boolean(storedData),
      dataLength: storedData?.length,
      firstChars: storedData?.substring(0, 50)
    });
    
    if (!storedData) {
      console.log('No stored data found in localStorage');
      return null;
    }
    
    try {
      // Parse the JSON data
      const parsedData = JSON.parse(storedData);
      
      console.log('Parsed localStorage content:', {
        isArray: Array.isArray(parsedData),
        length: parsedData?.length,
        firstItem: parsedData?.[0]
      });
      
      // Validate the data structure
      if (Array.isArray(parsedData) && parsedData.length > 0) {
        // More detailed validation
        const isValid = parsedData.every(node => 
          node &&
          typeof node === 'object' &&
          typeof node.id === 'string' &&
          typeof node.name === 'string' &&
          typeof node.description === 'string' &&
          (node.parent === null || typeof node.parent === 'string')
        );
        
        if (isValid) {
          console.log('Valid data found in localStorage, returning', parsedData.length, 'nodes');
          return parsedData;
        } else {
          console.error('Invalid data structure found in localStorage');
          return null;
        }
      } else {
        console.error('Not an array or empty array found in localStorage');
        return null;
      }
    } catch (parseError) {
      console.error('Error parsing JSON from localStorage:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Error loading tree data:', error);
    return null;
  }
};

/**
 * Loads the collapsed nodes state from IndexedDB (with localStorage fallback)
 * @returns Promise resolving to Set of collapsed node IDs, or empty set if none exists
 */
export const loadCollapsedNodesFromLocalStorage = async (): Promise<Set<string>> => {
  try {
    // Try IndexedDB first
    try {
      const idbData = await loadData(BASE_COLLAPSED_NODES_KEY);
      
      if (idbData && Array.isArray(idbData) && idbData.every(id => typeof id === 'string')) {
        console.log('Loaded collapsed nodes from IndexedDB:', idbData.length);
        return new Set<string>(idbData);
      }
    } catch (idbError) {
      console.error('Error loading collapsed nodes from IndexedDB, falling back to localStorage:', idbError);
    }
    
    // Fallback to localStorage
    const storedData = localStorage.getItem(COLLAPSED_NODES_KEY);
    if (!storedData) return new Set<string>();
    
    const parsedData = JSON.parse(storedData);
    if (Array.isArray(parsedData) && parsedData.every(id => typeof id === 'string')) {
      console.log('Loaded collapsed nodes from localStorage:', parsedData.length);
      return new Set<string>(parsedData);
    }
    return new Set<string>();
  } catch (error) {
    console.error('Error loading collapsed nodes:', error);
    return new Set<string>();
  }
};

/**
 * Get the timestamp of the last successful save
 * @returns Promise resolving to ISO timestamp string or null if no save exists
 */
export const getLastSavedTimestamp = async (): Promise<string | null> => {
  try {
    // Try IndexedDB first
    try {
      const timestamp = await loadData(BASE_LAST_SAVED_KEY);
      if (timestamp && typeof timestamp === 'string') {
        return timestamp;
      }
    } catch (idbError) {
      console.error('Error getting last saved timestamp from IndexedDB, falling back to localStorage:', idbError);
    }
    
    // Fallback to localStorage
    return localStorage.getItem(LAST_SAVED_KEY);
  } catch (error) {
    console.error('Error getting last saved timestamp:', error);
    return null;
  }
};

/**
 * Clear all saved concept hierarchy data from browser storage
 */
export const clearSavedData = async (): Promise<void> => {
  try {
    // Clear from IndexedDB
    try {
      const db = await openDB(DB_NAME, DB_VERSION);
      const tx = db.transaction('data', 'readwrite');
      await tx.store.delete(BASE_STORAGE_KEY);
      await tx.store.delete(BASE_COLLAPSED_NODES_KEY);
      await tx.store.delete(BASE_LAST_SAVED_KEY);
      await tx.done;
    } catch (idbError) {
      console.error('Error clearing data from IndexedDB:', idbError);
    }
    
    // Also clear from localStorage as a backup
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COLLAPSED_NODES_KEY);
      localStorage.removeItem(LAST_SAVED_KEY);
    } catch (lsError) {
      console.error('Error clearing data from localStorage:', lsError);
    }
  } catch (error) {
    console.error('Error clearing saved data:', error);
  }
};

/**
 * Track feature usage for analytics
 */
export const trackFeatureUsage = (feature: string): void => {
  try {
    const analytics = getAppAnalytics();
    if (analytics.featureUsage[feature] !== undefined) {
      analytics.featureUsage[feature]++;
      saveAppAnalytics(analytics);
    }
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
};

/**
 * Get app analytics data
 */
export const getAppAnalytics = (): any => {
  try {
    const stored = localStorage.getItem(getPrefixedKey('app-analytics'));
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading app analytics:', error);
  }

  return {
    firstLaunch: new Date(),
    totalSessions: 1,
    lastSessionStart: new Date(),
    featureUsage: {
      treeCreated: 0,
      treeLoaded: 0,
      treeSaved: 0,
      nodesAdded: 0,
      nodesDeleted: 0,
      capabilityCardsOpened: 0,
      exportUsed: 0,
    },
  };
};

/**
 * Save app analytics data
 */
export const saveAppAnalytics = (analytics: any): void => {
  try {
    localStorage.setItem(getPrefixedKey('app-analytics'), JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving app analytics:', error);
  }
};
