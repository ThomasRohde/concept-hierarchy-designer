import { NodeData } from '../types';
import { toast } from 'react-hot-toast';
import { getPrefixedKey } from './storagePrefix';

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
 * Saves the concept hierarchy tree to local storage
 * @param nodes The concept hierarchy nodes to save
 * @returns boolean indicating success
 */
export const saveTreeToLocalStorage = (nodes: NodeData[]): boolean => {
  if (!nodes || nodes.length === 0) {
    console.warn('Attempted to save empty or null nodes array to localStorage');
    return false;
  }

  try {
    // First test if localStorage is actually available
    if (!isLocalStorageAvailable()) {
      console.error('localStorage not available for saving');
      return false;
    }
    
    // Save timestamp of last successful save
    const timestamp = new Date().toISOString();
    
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
  } catch (error) {
    // Handle storage errors
    console.error('Error saving tree to local storage:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      // Storage quota exceeded - could show a notification to the user
      toast.error('Storage limit exceeded. Your concept model is too large for browser storage.');
    }
    
    return false;
  }
};

/**
 * Saves the collapsed nodes state to local storage
 * @param collapsedNodes Set of collapsed node IDs
 */
export const saveCollapsedNodesToLocalStorage = (collapsedNodes: Set<string>): void => {
  try {
    localStorage.setItem(COLLAPSED_NODES_KEY, JSON.stringify([...collapsedNodes]));
  } catch (error) {
    console.error('Error saving collapsed nodes to local storage:', error);
  }
};

/**
 * Loads the concept hierarchy tree from local storage
 * @returns The stored concept hierarchy nodes, or null if none exists
 */
export const loadTreeFromLocalStorage = (): NodeData[] | null => {
  try {
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
    console.error('Error loading tree from local storage:', error);
    return null;
  }
};

/**
 * Loads the collapsed nodes state from local storage
 * @returns Set of collapsed node IDs, or empty set if none exists
 */
export const loadCollapsedNodesFromLocalStorage = (): Set<string> => {
  try {
    const storedData = localStorage.getItem(COLLAPSED_NODES_KEY);
    if (!storedData) return new Set<string>();
    
    const parsedData = JSON.parse(storedData);
    if (Array.isArray(parsedData) && parsedData.every(id => typeof id === 'string')) {
      return new Set<string>(parsedData);
    }
    return new Set<string>();
  } catch (error) {
    console.error('Error loading collapsed nodes from local storage:', error);
    return new Set<string>();
  }
};

/**
 * Get the timestamp of the last successful save
 * @returns ISO timestamp string or null if no save exists
 */
export const getLastSavedTimestamp = (): string | null => {
  return localStorage.getItem(LAST_SAVED_KEY);
};

/**
 * Clear all saved concept hierarchy data from browser storage
 */
export const clearSavedData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(COLLAPSED_NODES_KEY);
    localStorage.removeItem(LAST_SAVED_KEY);
  } catch (error) {
    console.error('Error clearing saved data:', error);
  }
};
