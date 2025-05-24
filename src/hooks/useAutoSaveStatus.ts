import { useState, useCallback } from 'react';

/**
 * Store for tracking auto-save status across components
 */
type AutoSaveStore = {
  isSaving: boolean;
  setSaving: (status: boolean) => void;
};

// Singleton pattern for the store
let store: AutoSaveStore | null = null;

/**
 * Custom hook for tracking auto-save status across components
 */
export const useAutoSaveStatus = (): AutoSaveStore => {
  // Initialize store if it doesn't exist
  if (!store) {
    const [isSaving, setIsSaving] = useState(false);
    
    store = {
      isSaving,
      setSaving: useCallback((status: boolean) => {
        setIsSaving(status);
      }, []),
    };
  }
  
  return store;
};

/**
 * Function to update the saving status from outside React components
 * @param status Whether the app is currently saving data
 */
export const updateSavingStatus = (status: boolean): void => {
  if (store) {
    store.setSaving(status);
  }
};
