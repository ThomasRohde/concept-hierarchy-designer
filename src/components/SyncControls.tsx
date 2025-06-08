import React, { useState } from 'react';
import { SyncButton } from './SyncButton';
import { SyncStatusIndicator } from './SyncStatusIndicator';
import { SyncActivityLog } from './SyncActivityLog';
import { SyncHistoryViewer } from './SyncHistoryViewer';
import { Button } from './ui/Button';
import { useSyncContext } from '../context/SyncContext';

interface SyncControlsProps {
  variant?: 'full' | 'compact' | 'minimal';
  className?: string;
  showHistory?: boolean;
  showActivityLog?: boolean;
}

export const SyncControls: React.FC<SyncControlsProps> = ({
  variant = 'full',
  className = '',
  showHistory = true,
  showActivityLog = true,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const { syncState } = useSyncContext();

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <SyncButton variant="icon-only" />
        <SyncStatusIndicator className="text-xs" />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <SyncButton variant="compact" showProgress />
        <SyncStatusIndicator />
        
        {/* Quick access dropdown */}
        <div className="relative group">
          <Button
            size="sm"
            variant="ghost"
            className="w-6 h-6 p-0"
            title="Sync options"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </Button>
          
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            {showHistory && (
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 border-b"
                onClick={() => setShowHistoryModal(true)}
              >
                View History
              </button>
            )}
            {showActivityLog && (
              <button
                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50"
                onClick={() => setShowActivityModal(true)}
              >
                Activity Log
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main sync controls */}
      <div className="flex items-center gap-3">
        <SyncButton showProgress />
        <SyncStatusIndicator />
      </div>

      {/* Additional controls */}
      <div className="flex items-center gap-2">
        {showHistory && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowHistoryModal(true)}
            className="text-xs"
            title="View sync history and statistics"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </Button>
        )}
        
        {showActivityLog && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowActivityModal(true)}
            className="text-xs"
            title="View detailed activity log"
          >
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Activity
          </Button>
        )}

        {/* Keyboard shortcut hint */}
        <span className="text-xs text-gray-400 ml-auto">
          Ctrl+Shift+S to sync
        </span>
      </div>

      {/* Status summary for full variant */}
      {syncState.lastSyncTime && (
        <div className="text-xs text-gray-500 border-t pt-2">
          Last sync: {syncState.lastSyncTime.toLocaleString()}
          {syncState.pendingOperations > 0 && (
            <span className="ml-2 text-yellow-600">
              • {syncState.pendingOperations} pending
            </span>
          )}
          {syncState.conflicts.length > 0 && (
            <span className="ml-2 text-red-600">
              • {syncState.conflicts.length} conflicts
            </span>
          )}
        </div>
      )}

      {/* Modals */}
      {showHistoryModal && (
        <SyncHistoryViewer
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
      
      {showActivityModal && (
        <SyncActivityLog
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
        />
      )}
    </div>
  );
};