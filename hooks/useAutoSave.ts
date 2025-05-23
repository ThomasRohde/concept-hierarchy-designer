import { useCallback } from 'react';
import { NodeData } from '../types';
import { 
  saveTreeToLocalStorage, 
  loadTreeFromLocalStorage
} from '../utils/storageUtils';

/**
 * Custom hook for managing the auto-save feature for the concept hierarchy
 */
export const useAutoSave = () => {
  /**
   * Force save the current state to localStorage
   * @param nodes Current tree nodes
   * @returns boolean indicating success
   */
  const forceSave = useCallback((nodes: NodeData[]): boolean => {
    try {
      saveTreeToLocalStorage(nodes);
      return true;
    } catch (error) {
      console.error('Error during manual save:', error);
      return false;
    }
  }, []);

  /**
   * Check if the browser has data in localStorage
   * @returns boolean indicating if stored data exists
   */
  const hasStoredData = useCallback((): boolean => {
    try {
      const data = loadTreeFromLocalStorage();
      return data !== null && data.length > 0;
    } catch (error) {
      console.error('Error checking for stored data:', error);
      return false;
    }
  }, []);

  /**
   * Clear all stored data from localStorage
   * @returns boolean indicating success
   */
  const clearStoredData = useCallback((): boolean => {
    try {
      localStorage.removeItem('concept-hierarchy-data');
      localStorage.removeItem('concept-hierarchy-collapsed-nodes');
      return true;
    } catch (error) {
      console.error('Error clearing stored data:', error);
      return false;
    }
  }, []);

  return {
    forceSave,
    hasStoredData,
    clearStoredData
  };
};
