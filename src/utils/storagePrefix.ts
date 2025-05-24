/**
 * This utility helps ensure localStorage keys don't conflict between development
 * and production builds, since Vite's hot module reload can cause issues with
 * localStorage persistence.
 */

// Helper to detect if we're in development mode by checking for HMR
const isDevelopmentMode = (): boolean => {
  try {
    // Check if window location contains development server port or localhost
    return window.location.host.includes('localhost:') || 
           window.location.host.includes('127.0.0.1:');
  } catch (e) {
    return false;
  }
};

// In development mode, add a random but persisted prefix to avoid HMR conflicts
let storagePrefix = '';

// Initialize the prefix (wrapped in a function to handle localStorage timing)
const initPrefix = (): string => {
  if (isDevelopmentMode()) {
    try {
      // Try to get an existing dev prefix or create a new one
      let devPrefix = localStorage.getItem('__dev_storage_prefix__') || '';
      if (!devPrefix) {
        // Create a new prefix for this session
        devPrefix = `dev_${Math.random().toString(36).substring(2, 8)}_`;
        localStorage.setItem('__dev_storage_prefix__', devPrefix);
      }
      return devPrefix;
    } catch (e) {
      console.error('Error setting up storage prefix:', e);
      return '';
    }
  }
  return '';
};

// Prefixes a storage key to avoid conflicts in different environments
export const getPrefixedKey = (key: string): string => {
  // Initialize prefix if needed (lazy initialization)
  if (storagePrefix === '') {
    storagePrefix = initPrefix();
  }
  return `${storagePrefix}${key}`;
};
