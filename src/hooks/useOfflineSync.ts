import { useSyncContext } from '../context/SyncContext';

export const useOfflineSync = () => {
  const { syncState, triggerSync } = useSyncContext();

  // Disable sync functionality until actual cloud sync is implemented (task 3.0)
  // TODO: Enable these effects when cloud sync service is implemented
  
  // Mark changes whenever tree data or collapsed state changes
  // useEffect(() => {
  //   if (!syncState.isOnline) {
  //     markChanges();
  //   }
  // }, [nodes, collapsed, syncState.isOnline, markChanges]);

  // Auto-sync when coming back online if there are pending changes
  // useEffect(() => {
  //   if (syncState.isOnline && syncState.hasPendingChanges && !syncState.isSyncing) {
  //     const autoSyncTimeout = setTimeout(() => {
  //       triggerSync();
  //     }, 2000); // Wait 2 seconds after coming online before auto-syncing

  //     return () => clearTimeout(autoSyncTimeout);
  //   }
  // }, [syncState.isOnline, syncState.hasPendingChanges, syncState.isSyncing, triggerSync]);

  return {
    syncState,
    triggerSync,
  };
};