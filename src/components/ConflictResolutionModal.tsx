import React, { useState, useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { SyncConflict } from '../utils/syncManager';
import { ConflictResolver, ModelConflictAnalysis, NodeConflict, ConflictDiff } from '../utils/conflictResolver';

interface ConflictResolutionModalProps {
  conflict: SyncConflict;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolution: 'USE_LOCAL' | 'USE_REMOTE' | 'MERGE', customResolutions?: Record<string, 'LOCAL' | 'REMOTE'>) => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionModalProps> = ({
  conflict,
  isOpen,
  onClose,
  onResolve
}) => {
  const [resolutionMode, setResolutionMode] = useState<'simple' | 'detailed'>('simple');
  const [customResolutions, setCustomResolutions] = useState<Record<string, 'LOCAL' | 'REMOTE'>>({});

  const analysis = useMemo(() => {
    return ConflictResolver.analyzeConflict(conflict);
  }, [conflict]);

  const autoResolutions = useMemo(() => {
    return ConflictResolver.createAutoResolution(analysis);
  }, [analysis]);

  const handleQuickResolve = (type: 'USE_LOCAL' | 'USE_REMOTE') => {
    onResolve(type);
  };

  const handleCustomResolve = () => {
    const finalResolutions = { ...autoResolutions, ...customResolutions };
    onResolve('MERGE', finalResolutions);
  };

  const handleResolutionChange = (path: string, resolution: 'LOCAL' | 'REMOTE') => {
    setCustomResolutions(prev => ({
      ...prev,
      [path]: resolution
    }));
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '(empty)';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const renderMetadataDiffs = (diffs: ConflictDiff[]) => {
    if (diffs.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Model Information</h4>
        {diffs.map((diff, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium capitalize">{diff.field}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={customResolutions[diff.path] === 'LOCAL' ? 'default' : 'ghost'}
                  onClick={() => handleResolutionChange(diff.path, 'LOCAL')}
                >
                  Keep Local
                </Button>
                <Button
                  size="sm"
                  variant={customResolutions[diff.path] === 'REMOTE' ? 'default' : 'ghost'}
                  onClick={() => handleResolutionChange(diff.path, 'REMOTE')}
                >
                  Use Remote
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-600 mb-1">Local Value</div>
                <div className="bg-blue-50 p-2 rounded text-xs font-mono">
                  {formatValue(diff.localValue)}
                </div>
              </div>
              <div>
                <div className="font-medium text-green-600 mb-1">Remote Value</div>
                <div className="bg-green-50 p-2 rounded text-xs font-mono">
                  {formatValue(diff.remoteValue)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderNodeConflicts = (nodeConflicts: NodeConflict[]) => {
    if (nodeConflicts.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Node Changes</h4>
        {nodeConflicts.map((nodeConflict) => (
          <Card key={nodeConflict.nodeId} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-medium">{nodeConflict.nodeName}</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  nodeConflict.type === 'ADDED' ? 'bg-green-100 text-green-800' :
                  nodeConflict.type === 'DELETED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {nodeConflict.type}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={customResolutions[`node_${nodeConflict.nodeId}`] === 'LOCAL' ? 'default' : 'ghost'}
                  onClick={() => handleResolutionChange(`node_${nodeConflict.nodeId}`, 'LOCAL')}
                >
                  Keep Local
                </Button>
                <Button
                  size="sm"
                  variant={customResolutions[`node_${nodeConflict.nodeId}`] === 'REMOTE' ? 'default' : 'ghost'}
                  onClick={() => handleResolutionChange(`node_${nodeConflict.nodeId}`, 'REMOTE')}
                >
                  Use Remote
                </Button>
              </div>
            </div>
            
            {nodeConflict.type === 'MODIFIED' && nodeConflict.diffs.length > 0 && (
              <div className="mt-3 space-y-2">
                {nodeConflict.diffs.map((diff, diffIndex) => (
                  <div key={diffIndex} className="grid grid-cols-2 gap-4 text-sm border-t pt-2">
                    <div>
                      <div className="font-medium text-blue-600 mb-1">{diff.field} (Local)</div>
                      <div className="bg-blue-50 p-2 rounded text-xs">
                        {formatValue(diff.localValue)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-green-600 mb-1">{diff.field} (Remote)</div>
                      <div className="bg-green-50 p-2 rounded text-xs">
                        {formatValue(diff.remoteValue)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  const renderPromptConflicts = (promptConflicts: ConflictDiff[]) => {
    if (promptConflicts.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Prompt Changes</h4>
        {promptConflicts.map((diff, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{diff.field}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={customResolutions[diff.path] === 'LOCAL' ? 'default' : 'ghost'}
                  onClick={() => handleResolutionChange(diff.path, 'LOCAL')}
                >
                  Keep Local
                </Button>
                <Button
                  size="sm"
                  variant={customResolutions[diff.path] === 'REMOTE' ? 'default' : 'ghost'}
                  onClick={() => handleResolutionChange(diff.path, 'REMOTE')}
                >
                  Use Remote
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-blue-600 mb-1">Local</div>
                <div className="bg-blue-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                  {formatValue(diff.localValue)}
                </div>
              </div>
              <div>
                <div className="font-medium text-green-600 mb-1">Remote</div>
                <div className="bg-green-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                  {formatValue(diff.remoteValue)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync Conflict Resolution">
      <div className="space-y-6">
        {/* Conflict Summary */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-800 mb-2">Sync Conflict Detected</h3>
              <p className="text-sm text-yellow-700 mb-3">{conflict.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Local Version:</span> v{conflict.localVersion}
                  <br />
                  <span className="text-gray-600">{formatTimestamp(conflict.localTimestamp)}</span>
                </div>
                <div>
                  <span className="font-medium">Remote Version:</span> v{conflict.remoteVersion}
                  <br />
                  <span className="text-gray-600">{formatTimestamp(conflict.remoteTimestamp)}</span>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-700">
                <strong>Changes found:</strong> {analysis.summary.metadataChanges} metadata, {' '}
                {analysis.summary.nodesAdded} nodes added, {analysis.summary.nodesModified} modified, {' '}
                {analysis.summary.nodesDeleted} deleted, {analysis.summary.promptChanges} prompt changes
              </div>
            </div>
          </div>
        </Card>

        {/* Resolution Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={resolutionMode === 'simple' ? 'default' : 'ghost'}
            onClick={() => setResolutionMode('simple')}
          >
            Simple Resolution
          </Button>
          <Button
            variant={resolutionMode === 'detailed' ? 'default' : 'ghost'}
            onClick={() => setResolutionMode('detailed')}
          >
            Detailed Resolution
          </Button>
        </div>

        {resolutionMode === 'simple' ? (
          /* Simple Resolution */
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Choose how to resolve this conflict:
            </p>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="ghost"
                className="p-4 h-auto text-left border-2 border-gray-200 hover:border-blue-300"
                onClick={() => handleQuickResolve('USE_LOCAL')}
              >
                <div>
                  <div className="font-medium text-blue-600">Keep Local Changes</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Overwrite remote version with your local changes
                  </div>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="p-4 h-auto text-left border-2 border-gray-200 hover:border-green-300"
                onClick={() => handleQuickResolve('USE_REMOTE')}
              >
                <div>
                  <div className="font-medium text-green-600">Accept Remote Changes</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Replace your local version with the remote version
                  </div>
                </div>
              </Button>
              <Button
                variant="ghost"
                className="p-4 h-auto text-left border-2 border-gray-200 hover:border-purple-300"
                onClick={() => setResolutionMode('detailed')}
              >
                <div>
                  <div className="font-medium text-purple-600">Custom Merge</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Choose specific changes to keep from each version
                  </div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          /* Detailed Resolution */
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {renderMetadataDiffs(analysis.metadataDiffs)}
            {renderNodeConflicts(analysis.nodeConflicts)}
            {renderPromptConflicts(analysis.promptConflicts)}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {resolutionMode === 'detailed' && (
            <Button onClick={handleCustomResolve}>
              Apply Custom Resolution
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};