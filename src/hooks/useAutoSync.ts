import { useEffect, useRef, useState } from 'react';
import { SyncManager } from '../utils/syncManager';
import { GitHubAuthService } from '../services/githubAuthService';
import { TreeModel } from '../types';

interface AutoSyncOptions {
  enablePeriodicSync?: boolean;
  periodicSyncInterval?: number; // in milliseconds
  enableSyncOnSave?: boolean;
  syncOnSaveDelay?: number; // debounce delay in milliseconds
  enableSyncOnFocus?: boolean;
}

interface AutoSyncHook {
  isAutoSyncEnabled: boolean;
  setAutoSyncEnabled: (enabled: boolean) => void;
  triggerSync: (model: TreeModel, action: 'CREATE' | 'UPDATE' | 'DELETE', gistId?: string) => Promise<void>;
  lastSyncTime: number | null;
  syncInProgress: boolean;
}

export const useAutoSync = (options: AutoSyncOptions = {}): AutoSyncHook => {
  const {
    enablePeriodicSync = true,
    periodicSyncInterval = 5 * 60 * 1000, // 5 minutes
    enableSyncOnSave = true,
    syncOnSaveDelay = 2000, // 2 seconds
    enableSyncOnFocus = true
  } = options;

  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<number | null>(null);
  const [syncInProgress, setSyncInProgress] = useState(false);
  
  const syncManager = useRef(SyncManager.getInstance());
  const periodicSyncTimer = useRef<NodeJS.Timeout | null>(null);
  const saveTimers = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const lastFocusTime = useRef<number>(Date.now());

  // Check if auto-sync should be enabled
  const shouldAutoSync = async (): Promise<boolean> => {
    if (!isAutoSyncEnabled) return false;
    
    try {
      const authStatus = await GitHubAuthService.testConnection();
      return authStatus.isAuthenticated && navigator.onLine;
    } catch {
      return false;
    }
  };

  // Trigger sync for a specific model
  const triggerSync = async (
    model: TreeModel, 
    action: 'CREATE' | 'UPDATE' | 'DELETE', 
    gistId?: string
  ): Promise<void> => {
    if (!(await shouldAutoSync())) return;

    try {
      setSyncInProgress(true);
      await syncManager.current.enqueueSync(action, model, gistId);
      setLastSyncTime(Date.now());
    } catch (error) {
      console.warn('Failed to trigger sync:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  // Debounced sync on save
  const debouncedSyncOnSave = (
    model: TreeModel, 
    action: 'CREATE' | 'UPDATE' | 'DELETE', 
    gistId?: string
  ) => {
    if (!enableSyncOnSave || !(isAutoSyncEnabled)) return;

    const key = `${model.id}_${action}`;
    
    // Clear existing timer for this model
    if (saveTimers.current.has(key)) {
      clearTimeout(saveTimers.current.get(key)!);
    }

    // Set new timer
    const timer = setTimeout(async () => {
      try {
        await triggerSync(model, action, gistId);
      } catch (error) {
        console.warn('Auto-sync on save failed:', error);
      } finally {
        saveTimers.current.delete(key);
      }
    }, syncOnSaveDelay);

    saveTimers.current.set(key, timer);
  };

  // Periodic sync
  const startPeriodicSync = () => {
    if (!enablePeriodicSync || periodicSyncTimer.current) return;

    periodicSyncTimer.current = setInterval(async () => {
      if (await shouldAutoSync()) {
        try {
          await syncManager.current.processPendingQueue();
          setLastSyncTime(Date.now());
        } catch (error) {
          console.warn('Periodic sync failed:', error);
        }
      }
    }, periodicSyncInterval);
  };

  const stopPeriodicSync = () => {
    if (periodicSyncTimer.current) {
      clearInterval(periodicSyncTimer.current);
      periodicSyncTimer.current = null;
    }
  };

  // Sync on window focus (if user was away for a while)
  const handleWindowFocus = async () => {
    if (!enableSyncOnFocus || !isAutoSyncEnabled) return;

    const now = Date.now();
    const timeSinceLastFocus = now - lastFocusTime.current;
    
    // If user was away for more than 5 minutes, trigger sync
    if (timeSinceLastFocus > 5 * 60 * 1000) {
      if (await shouldAutoSync()) {
        try {
          await syncManager.current.processPendingQueue();
          setLastSyncTime(Date.now());
        } catch (error) {
          console.warn('Focus sync failed:', error);
        }
      }
    }
    
    lastFocusTime.current = now;
  };

  const handleWindowBlur = () => {
    lastFocusTime.current = Date.now();
  };

  // Setup event listeners and timers
  useEffect(() => {
    if (isAutoSyncEnabled) {
      startPeriodicSync();
      
      if (enableSyncOnFocus) {
        window.addEventListener('focus', handleWindowFocus);
        window.addEventListener('blur', handleWindowBlur);
      }
    } else {
      stopPeriodicSync();
    }

    return () => {
      stopPeriodicSync();
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      
      // Clear all pending save timers
      saveTimers.current.forEach(timer => clearTimeout(timer));
      saveTimers.current.clear();
    };
  }, [isAutoSyncEnabled, enablePeriodicSync, enableSyncOnFocus]);

  // Listen to sync manager status changes
  useEffect(() => {
    const unsubscribe = syncManager.current.addListener((status) => {
      setSyncInProgress(status.isSyncing);
      if (status.lastSyncTime) {
        setLastSyncTime(status.lastSyncTime);
      }
    });

    return unsubscribe;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPeriodicSync();
      saveTimers.current.forEach(timer => clearTimeout(timer));
      saveTimers.current.clear();
    };
  }, []);

  return {
    isAutoSyncEnabled,
    setAutoSyncEnabled,
    triggerSync: enableSyncOnSave ? debouncedSyncOnSave : triggerSync,
    lastSyncTime,
    syncInProgress
  };
};