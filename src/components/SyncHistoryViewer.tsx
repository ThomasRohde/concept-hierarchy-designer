import React, { useState } from 'react';
import { useSyncContext } from '../context/SyncContext';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface SyncHistoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncHistoryViewer: React.FC<SyncHistoryViewerProps> = ({ isOpen, onClose }) => {
  const { getSyncHistory } = useSyncContext();
  const [showSuccessOnly, setShowSuccessOnly] = useState(false);
  
  const syncHistory = getSyncHistory();
  
  const filteredHistory = showSuccessOnly 
    ? syncHistory.filter(entry => entry.success)
    : syncHistory;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getSuccessRate = () => {
    if (syncHistory.length === 0) return 0;
    const successCount = syncHistory.filter(entry => entry.success).length;
    return Math.round((successCount / syncHistory.length) * 100);
  };

  const getAverageOperations = () => {
    if (syncHistory.length === 0) return 0;
    const totalOps = syncHistory.reduce((sum, entry) => sum + entry.operationsCount, 0);
    return Math.round(totalOps / syncHistory.length);
  };

  const getRecentErrors = () => {
    return syncHistory
      .filter(entry => !entry.success && entry.error)
      .slice(0, 5)
      .map(entry => entry.error);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync History">
      <div className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{syncHistory.length}</div>
            <div className="text-sm text-gray-600">Total Syncs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{getSuccessRate()}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{getAverageOperations()}</div>
            <div className="text-sm text-gray-600">Avg Operations</div>
          </div>
        </div>

        {/* Recent Errors */}
        {getRecentErrors().length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-medium text-red-800 mb-2">Recent Errors:</h4>
            <ul className="text-xs text-red-700 space-y-1">
              {getRecentErrors().map((error, index) => (
                <li key={index} className="truncate">• {error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={showSuccessOnly ? "default" : "outline"}
            onClick={() => setShowSuccessOnly(!showSuccessOnly)}
            className="text-xs"
          >
            {showSuccessOnly ? 'Show All' : 'Success Only'}
          </Button>
          <span className="text-sm text-gray-500">
            Showing {filteredHistory.length} of {syncHistory.length} entries
          </span>
        </div>

        {/* History List */}
        <div className="max-h-96 overflow-y-auto border rounded-lg">
          {filteredHistory.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No sync history found.
            </div>
          ) : (
            <div className="divide-y">
              {filteredHistory.map((entry, index) => (
                <div key={`${entry.timestamp}-${index}`} className="p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${
                        entry.success ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="text-sm font-medium">
                          {entry.success ? 'Sync Successful' : 'Sync Failed'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {entry.operationsCount} operation{entry.operationsCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </div>
                  </div>
                  {entry.error && (
                    <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                      {entry.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end pt-4 border-t">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};