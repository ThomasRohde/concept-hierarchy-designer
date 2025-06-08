import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: Date;
  syncError?: string;
  hasPendingChanges: boolean;
  syncProgress?: number;
}

interface SyncContextType {
  syncState: SyncState;
  triggerSync: () => Promise<void>;
  markChanges: () => void;
  clearError: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

interface SyncProviderProps {
  children: ReactNode;
}

export const SyncProvider: React.FC<SyncProviderProps> = ({ children }) => {
  const { isOnline } = useNetworkStatus();
  const [syncState, setSyncState] = useState<SyncState>({
    isOnline,
    isSyncing: false,
    hasPendingChanges: false,
  });

  useEffect(() => {
    setSyncState(prev => ({ ...prev, isOnline }));
  }, [isOnline]);

  const triggerSync = async (): Promise<void> => {
    if (!isOnline || syncState.isSyncing) {
      return;
    }

    setSyncState(prev => ({ 
      ...prev, 
      isSyncing: true, 
      syncError: undefined,
      syncProgress: 0 
    }));

    try {
      // Simulate sync progress
      for (let i = 0; i <= 100; i += 20) {
        setSyncState(prev => ({ ...prev, syncProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Here we would call the actual sync service
      // await syncManager.sync();

      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        lastSyncTime: new Date(),
        hasPendingChanges: false,
        syncProgress: undefined,
      }));
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Sync failed',
        syncProgress: undefined,
      }));
    }
  };

  const markChanges = () => {
    setSyncState(prev => ({ ...prev, hasPendingChanges: true }));
  };

  const clearError = () => {
    setSyncState(prev => ({ ...prev, syncError: undefined }));
  };

  const contextValue: SyncContextType = {
    syncState,
    triggerSync,
    markChanges,
    clearError,
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