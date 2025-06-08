import React from 'react';
import { useSyncContext } from '../context/SyncContext';

interface SyncLoadingOverlayProps {
  showOverlay?: boolean;
}

export const SyncLoadingOverlay: React.FC<SyncLoadingOverlayProps> = ({ 
  showOverlay = true 
}) => {
  const { syncState } = useSyncContext();

  if (!syncState.isSyncing) {
    return null;
  }

  const getProgressMessage = (progress?: number) => {
    if (!progress) return 'Initializing sync...';
    if (progress < 20) return 'Preparing data...';
    if (progress < 40) return 'Checking for changes...';
    if (progress < 70) return 'Syncing with cloud...';
    if (progress < 90) return 'Finalizing sync...';
    return 'Almost done...';
  };

  const content = (
    <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4 border">
      <div className="flex items-center gap-3">
        <div className="animate-spin w-8 h-8 text-blue-600">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Syncing Data</h3>
          <p className="text-sm text-gray-600">
            {getProgressMessage(syncState.syncProgress)}
          </p>
        </div>
      </div>
      
      {syncState.syncProgress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(syncState.syncProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${syncState.syncProgress}%` }}
            />
          </div>
        </div>
      )}

      {syncState.pendingOperations > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          {syncState.pendingOperations} operation{syncState.pendingOperations !== 1 ? 's' : ''} pending
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        <span>Connected to GitHub</span>
      </div>
    </div>
  );

  if (!showOverlay) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      {content}
    </div>
  );
};