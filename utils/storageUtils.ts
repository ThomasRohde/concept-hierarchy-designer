import { NodeData } from '../types';
import { toast } from 'react-hot-toast';

const STORAGE_KEY = 'concept-hierarchy-data';
const COLLAPSED_NODES_KEY = 'concept-hierarchy-collapsed-nodes';
const LAST_SAVED_KEY = 'concept-hierarchy-last-saved';

/**
 * Saves the concept hierarchy tree to local storage
 * @param nodes The concept hierarchy nodes to save
 * @returns boolean indicating success
 */
export const saveTreeToLocalStorage = (nodes: NodeData[]): boolean => {
  try {
    // Save timestamp of last successful save
    const timestamp = new Date().toISOString();
    
    // Store the data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nodes));
    localStorage.setItem(LAST_SAVED_KEY, timestamp);
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
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;
    
    const parsedData = JSON.parse(storedData);
    // Validate the data structure
    if (Array.isArray(parsedData) && 
        parsedData.every(node => 
          node &&
          typeof node === 'object' &&
          typeof node.id === 'string' &&
          typeof node.name === 'string' &&
          typeof node.description === 'string' &&
          (node.parent === null || typeof node.parent === 'string')
        )) {
      return parsedData;
    }
    return null;
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
