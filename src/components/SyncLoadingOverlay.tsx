import React from 'react';
import { useSyncContext } from '../context/SyncContext';

export const SyncLoadingOverlay: React.FC = () => {
  // Hide sync loading overlay until actual cloud sync is implemented (task 3.0)
  // TODO: Remove this early return when cloud sync service is implemented
  return null;

  const { syncState } = useSyncContext();

  if (!syncState.isSyncing) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center gap-3">
          <div className="animate-spin w-8 h-8 text-blue-600">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Syncing Data</h3>
            <p className="text-sm text-gray-600">Saving your changes to the cloud...</p>
          </div>
        </div>
        
        {syncState.syncProgress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{syncState.syncProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${syncState.syncProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};