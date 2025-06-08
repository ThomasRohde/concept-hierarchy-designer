import React from 'react';
import { Button } from './ui/Button';
import { useSyncContext } from '../context/SyncContext';

export const SyncButton: React.FC = () => {
  // Hide sync button until actual cloud sync is implemented (task 3.0)
  // TODO: Remove this early return when cloud sync service is implemented
  return null;

  const { syncState, triggerSync, clearError } = useSyncContext();

  const handleSyncClick = async () => {
    if (syncState.syncError) {
      clearError();
    }
    await triggerSync();
  };

  const isDisabled = !syncState.isOnline || syncState.isSyncing;

  return (
    <Button
      onClick={handleSyncClick}
      disabled={isDisabled}
      variant={syncState.syncError ? "destructive" : "outline"}
      size="sm"
      className="flex items-center gap-2 min-w-[100px]"
      title={
        !syncState.isOnline 
          ? "Cannot sync while offline" 
          : syncState.isSyncing 
            ? "Sync in progress..." 
            : syncState.syncError
              ? "Click to retry sync"
              : "Sync with cloud"
      }
    >
      {syncState.isSyncing ? (
        <>
          <div className="animate-spin w-4 h-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span>Syncing</span>
        </>
      ) : syncState.syncError ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Retry</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Sync</span>
        </>
      )}
    </Button>
  );
};