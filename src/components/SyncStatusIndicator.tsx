import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { SyncManager, SyncStatus, SyncConflict } from '../utils/syncManager';
import { ConflictResolutionModal } from './ConflictResolutionModal';

interface SyncStatusIndicatorProps {
  className?: string;
}

export const SyncStatusIndicator: React.FC<SyncStatusIndicatorProps> = ({ className = '' }) => {
  const [syncManager] = useState(() => SyncManager.getInstance());
  const [status, setStatus] = useState<SyncStatus>(syncManager.getStatus());
  const [selectedConflict, setSelectedConflict] = useState<SyncConflict | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.addListener(setStatus);
    return unsubscribe;
  }, [syncManager]);

  const handleManualSync = () => {
    console.log('🔄 SyncStatusIndicator: Manual sync button clicked');
    console.log('🔄 SyncStatusIndicator: Current status:', status);
    syncManager.manualSync();
  };

  const handleResolveConflict = async (
    resolution: 'USE_LOCAL' | 'USE_REMOTE' | 'MERGE',
    customResolutions?: Record<string, 'LOCAL' | 'REMOTE'>
  ) => {
    if (selectedConflict) {
      await syncManager.resolveConflict(selectedConflict.id, resolution);
      setShowConflictModal(false);
      setSelectedConflict(null);
    }
  };

  const formatLastSync = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = () => {
    if (!status.isOnline) return 'text-gray-500';
    if (status.conflicts.length > 0) return 'text-red-500';
    if (status.isSyncing) return 'text-blue-500';
    if (status.pendingOperations > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (!status.isOnline) return '⚪';
    if (status.conflicts.length > 0) return '⚠️';
    if (status.isSyncing) return '🔄';
    if (status.pendingOperations > 0) return '⏳';
    return '✅';
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline';
    if (status.conflicts.length > 0) return `${status.conflicts.length} conflict${status.conflicts.length !== 1 ? 's' : ''}`;
    if (status.isSyncing) return 'Syncing...';
    if (status.pendingOperations > 0) return `${status.pendingOperations} pending`;
    return 'Synced';
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Status Indicator */}
        <div className={`flex items-center gap-1 text-sm ${getStatusColor()}`}>
          <span className="animate-pulse">{getStatusIcon()}</span>
          <span>{getStatusText()}</span>
        </div>

        {/* Last Sync Time */}
        <span className="text-xs text-gray-500">
          {formatLastSync(status.lastSyncTime)}
        </span>

        {/* Manual Sync Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handleManualSync}
          disabled={status.isSyncing || !status.isOnline}
          className="h-6 px-2 text-xs"
        >
          {status.isSyncing ? '...' : '↻'}
        </Button>

        {/* Conflicts Indicator */}
        {status.conflicts.length > 0 && (
          <div className="relative">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs bg-red-50 text-red-600 hover:bg-red-100"
              onClick={() => {
                if (status.conflicts.length === 1) {
                  setSelectedConflict(status.conflicts[0]);
                  setShowConflictModal(true);
                }
              }}
            >
              {status.conflicts.length === 1 ? 'Resolve' : `${status.conflicts.length} conflicts`}
            </Button>
            
            {status.conflicts.length > 1 && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48">
                <div className="p-2 border-b text-xs font-medium text-gray-700">
                  Choose conflict to resolve:
                </div>
                {status.conflicts.map((conflict) => (
                  <button
                    key={conflict.id}
                    className="w-full text-left px-2 py-1 text-xs hover:bg-gray-50 border-b last:border-b-0"
                    onClick={() => {
                      setSelectedConflict(conflict);
                      setShowConflictModal(true);
                    }}
                  >
                    <div className="font-medium truncate">{conflict.localModel.name}</div>
                    <div className="text-gray-500">
                      v{conflict.localVersion} vs v{conflict.remoteVersion}
                    </div>
                  </button>
                ))}
                <div className="p-2 border-t">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => syncManager.clearAllConflicts()}
                    className="w-full text-xs text-red-600 hover:bg-red-50"
                  >
                    Clear All Conflicts
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Indicator */}
        {status.lastError && (
          <div className="text-xs text-red-500 max-w-32 truncate" title={status.lastError}>
            Error: {status.lastError}
          </div>
        )}
      </div>

      {/* Conflict Resolution Modal */}
      {selectedConflict && (
        <ConflictResolutionModal
          conflict={selectedConflict}
          isOpen={showConflictModal}
          onClose={() => {
            setShowConflictModal(false);
            setSelectedConflict(null);
          }}
          onResolve={handleResolveConflict}
        />
      )}
    </>
  );
};