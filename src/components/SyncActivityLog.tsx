import React, { useState } from 'react';
import { useSyncContext } from '../context/SyncContext';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface SyncActivityLogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncActivityLog: React.FC<SyncActivityLogProps> = ({ isOpen, onClose }) => {
  const { getActivityLog, clearActivityLog } = useSyncContext();
  const [filter, setFilter] = useState<'ALL' | 'SYNC_SUCCESS' | 'SYNC_ERROR' | 'CONFLICT_DETECTED'>('ALL');
  
  const activityLog = getActivityLog();
  
  const filteredLog = filter === 'ALL' 
    ? activityLog 
    : activityLog.filter(entry => entry.type === filter);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SYNC_SUCCESS':
        return '✅';
      case 'SYNC_ERROR':
        return '❌';
      case 'CONFLICT_DETECTED':
        return '⚠️';
      case 'CONFLICT_RESOLVED':
        return '✨';
      case 'MANUAL_SYNC':
        return '🔄';
      case 'SYNC_START':
        return '🔵';
      default:
        return '📝';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SYNC_SUCCESS':
        return 'text-green-600';
      case 'SYNC_ERROR':
        return 'text-red-600';
      case 'CONFLICT_DETECTED':
        return 'text-yellow-600';
      case 'CONFLICT_RESOLVED':
        return 'text-blue-600';
      case 'MANUAL_SYNC':
        return 'text-purple-600';
      case 'SYNC_START':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync Activity Log">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          {['ALL', 'SYNC_SUCCESS', 'SYNC_ERROR', 'CONFLICT_DETECTED'].map((filterType) => (
            <Button
              key={filterType}
              size="sm"
              variant={filter === filterType ? "default" : "outline"}
              onClick={() => setFilter(filterType as any)}
              className="text-xs"
            >
              {filterType === 'ALL' ? 'All' : filterType.replace('_', ' ')}
            </Button>
          ))}
        </div>

        {/* Activity Log List */}
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          {filteredLog.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No activity logs found{filter !== 'ALL' ? ` for ${filter.replace('_', ' ')}` : ''}.
            </div>
          ) : (
            <div className="divide-y">
              {filteredLog.map((entry) => (
                <div key={entry.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{getTypeIcon(entry.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${getTypeColor(entry.type)}`}>
                          {entry.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mt-1">{entry.message}</p>
                      {entry.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                            View Details
                          </summary>
                          <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded overflow-x-auto">
                            {JSON.stringify(entry.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {filteredLog.length} {filteredLog.length === 1 ? 'entry' : 'entries'}
            {filter !== 'ALL' && ` (${activityLog.length} total)`}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={clearActivityLog}
              disabled={activityLog.length === 0}
            >
              Clear Log
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};