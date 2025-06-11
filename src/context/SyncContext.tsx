import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { SyncManager, SyncStatus, SyncConflict } from '../utils/syncManager';

interface SyncActivityLog {
  id: string;
  timestamp: number;
  type: 'SYNC_START' | 'SYNC_SUCCESS' | 'SYNC_ERROR' | 'CONFLICT_DETECTED' | 'CONFLICT_RESOLVED' | 'MANUAL_SYNC';
  message: string;
  details?: any;
}

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: Date;
  syncError?: string;
  hasPendingChanges: boolean;
  syncProgress?: number;
  pendingOperations: number;
  conflicts: SyncConflict[];
  activityLog: SyncActivityLog[];
  syncHistory: Array<{
    timestamp: number;
    success: boolean;
    operationsCount: number;
    error?: string;
  }>;
}

interface SyncContextType {
  syncState: SyncState;
  triggerSync: () => Promise<void>;
  markChanges: () => void;
  clearError: () => void;
  clearActivityLog: () => void;
  getActivityLog: () => SyncActivityLog[];
  getSyncHistory: () => SyncState['syncHistory'];
  notifyGistCreated: () => void;
  onGistCreated: (callback: () => void) => () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [syncManager] = useState(() => SyncManager.getInstance());
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline,
    isSyncing: false,
    hasPendingChanges: false,
    pendingOperations: 0,
    conflicts: [],
    activityLog: [],
    syncHistory: [],
  });

  // Gist creation notification system
  const [gistCreatedCallbacks] = useState<Set<() => void>>(new Set());

  // Listen to SyncManager status updates
  useEffect(() => {
    const unsubscribe = syncManager.addListener((status: SyncStatus) => {
      setSyncState(prev => ({
        ...prev,
        isOnline: status.isOnline,
        isSyncing: status.isSyncing,
        lastSyncTime: status.lastSyncTime ? new Date(status.lastSyncTime) : undefined,
        syncError: status.lastError,
        pendingOperations: status.pendingOperations,
        conflicts: status.conflicts,
      }));

      // Add activity log entries for status changes
      addActivityLogEntry('SYNC_SUCCESS', 
        `Sync ${status.isSyncing ? 'started' : 'completed'}. ${status.pendingOperations} operations pending.`
      );
    });

    return unsubscribe;
  }, [syncManager]);

  // Update online status from network hook
  useEffect(() => {
    setSyncState(prev => ({ ...prev, isOnline }));
  }, [isOnline]);

  const addActivityLogEntry = (type: SyncActivityLog['type'], message: string, details?: any) => {
    const entry: SyncActivityLog = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      message,
      details,
    };

    setSyncState(prev => ({
      ...prev,
      activityLog: [entry, ...prev.activityLog.slice(0, 99)], // Keep last 100 entries
    }));
  };

  const addSyncHistoryEntry = (success: boolean, operationsCount: number, error?: string) => {
    const historyEntry = {
      timestamp: Date.now(),
      success,
      operationsCount,
      error,
    };

    setSyncState(prev => ({
      ...prev,
      syncHistory: [historyEntry, ...prev.syncHistory.slice(0, 49)], // Keep last 50 entries
    }));
  };

  const triggerSync = async (): Promise<void> => {
    console.log('🔄 SyncContext: triggerSync called');
    console.log('🔄 SyncContext: isOnline:', isOnline, 'isSyncing:', syncState.isSyncing);
    
    if (!isOnline || syncState.isSyncing) {
      console.log('🔄 SyncContext: Skipping sync - offline or already syncing');
      return;
    }

    addActivityLogEntry('MANUAL_SYNC', 'Manual sync triggered by user');

    setSyncState(prev => ({ 
      ...prev, 
      isSyncing: true, 
      syncError: undefined,
      syncProgress: 0 
    }));

    const startTime = Date.now();
    let operationsCount = 0;

    try {
      // Track progress during sync
      setSyncState(prev => ({ ...prev, syncProgress: 10 }));
      
      // Get pending operations count before sync
      const pendingOps = await syncManager.getPendingOperations();
      operationsCount = pendingOps.length;
      
      setSyncState(prev => ({ ...prev, syncProgress: 30 }));
      
      // Trigger actual sync
      await syncManager.manualSync();
      
      setSyncState(prev => ({ ...prev, syncProgress: 90 }));
      
      // Complete sync
      const endTime = Date.now();
      const duration = endTime - startTime;

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        hasPendingChanges: false,
        syncProgress: undefined,
      }));

      addActivityLogEntry('SYNC_SUCCESS', 
        `Sync completed successfully in ${duration}ms. ${operationsCount} operations processed.`,
        { duration, operationsCount }
      );

      addSyncHistoryEntry(true, operationsCount);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: errorMessage,
        syncProgress: undefined,
      }));

      addActivityLogEntry('SYNC_ERROR', `Sync failed: ${errorMessage}`, { error });
      addSyncHistoryEntry(false, operationsCount, errorMessage);
    }
  };

  const markChanges = () => {
    setSyncState(prev => ({ ...prev, hasPendingChanges: true }));
    addActivityLogEntry('SYNC_START', 'Changes detected, marking for sync');
  };

  const clearError = () => {
    setSyncState(prev => ({ ...prev, syncError: undefined }));
  };

  const clearActivityLog = () => {
    setSyncState(prev => ({ ...prev, activityLog: [] }));
  };

  const getActivityLog = () => syncState.activityLog;
  const getSyncHistory = () => syncState.syncHistory;

  const notifyGistCreated = () => {
    console.log('🔔 SyncContext: Notifying gist creation to', gistCreatedCallbacks.size, 'listeners');
    gistCreatedCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('Error in gist creation callback:', error);
      }
    });
  };

  const onGistCreated = (callback: () => void) => {
    gistCreatedCallbacks.add(callback);
    return () => {
      gistCreatedCallbacks.delete(callback);
    };
  };

  const contextValue: SyncContextType = {
    syncState,
    triggerSync,
    markChanges,
    clearError,
    clearActivityLog,
    getActivityLog,
    getSyncHistory,
    notifyGistCreated,
    onGistCreated,
  };

  return (
    <SyncContext.Provider value={contextValue}>
      {children}
    </SyncContext.Provider>
  );
};

export const useSyncContext = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};