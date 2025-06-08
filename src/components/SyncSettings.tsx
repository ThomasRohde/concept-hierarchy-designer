import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { useSyncContext } from '../context/SyncContext';
import { SyncManager } from '../utils/syncManager';

interface SyncSettings {
  autoSyncEnabled: boolean;
  autoSyncInterval: number; // in minutes
  retryAttempts: number;
  conflictResolution: 'ASK' | 'LOCAL' | 'REMOTE';
  enableNotifications: boolean;
  enableProgressNotifications: boolean;
  logRetentionDays: number;
  offlineQueueLimit: number;
}

interface SyncSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_SETTINGS: SyncSettings = {
  autoSyncEnabled: true,
  autoSyncInterval: 5,
  retryAttempts: 3,
  conflictResolution: 'ASK',
  enableNotifications: true,
  enableProgressNotifications: false,
  logRetentionDays: 30,
  offlineQueueLimit: 100,
};

export const SyncSettings: React.FC<SyncSettingsProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<SyncSettings>(DEFAULT_SETTINGS);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { syncState, clearActivityLog } = useSyncContext();

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem('syncSettings');
        if (stored) {
          const parsedSettings = JSON.parse(stored);
          setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
        }
      } catch (error) {
        console.warn('Failed to load sync settings:', error);
      }
    };

    if (isOpen) {
      loadSettings();
    }
  }, [isOpen]);

  const updateSetting = <K extends keyof SyncSettings>(
    key: K,
    value: SyncSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('syncSettings', JSON.stringify(settings));
      setHasChanges(false);
      
      // Apply settings that affect the sync manager
      // Note: This would ideally be handled by the SyncManager
      console.log('Settings saved:', settings);
      
      // Simulate some async operation
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Failed to save sync settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
  };

  const clearAllData = async () => {
    if (window.confirm('This will clear all sync history and activity logs. Are you sure?')) {
      clearActivityLog();
      // Clear sync history from localStorage
      localStorage.removeItem('syncHistory');
      localStorage.removeItem('syncConflicts');
    }
  };

  const testConnection = async () => {
    // This would test the GitHub connection
    console.log('Testing connection...');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sync Settings">
      <div className="space-y-6">
        {/* Auto Sync Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Auto Sync</h3>
          
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoSyncEnabled"
              checked={settings.autoSyncEnabled}
              onChange={(e) => updateSetting('autoSyncEnabled', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="autoSyncEnabled" className="text-sm text-gray-700">
              Enable automatic synchronization
            </label>
          </div>
          
          {settings.autoSyncEnabled && (
            <div className="ml-6 space-y-2">
              <label className="block text-sm text-gray-700">
                Sync interval (minutes)
              </label>
              <Input
                type="number"
                min="1"
                max="60"
                value={settings.autoSyncInterval}
                onChange={(e) => updateSetting('autoSyncInterval', parseInt(e.target.value) || 5)}
                className="w-20"
              />
              <p className="text-xs text-gray-500">
                How often to automatically sync changes when online
              </p>
            </div>
          )}
        </div>

        {/* Conflict Resolution */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Conflict Resolution</h3>
          
          <div className="space-y-2">
            {[
              { value: 'ASK', label: 'Always ask me what to do' },
              { value: 'LOCAL', label: 'Always keep local changes' },
              { value: 'REMOTE', label: 'Always keep remote changes' },
            ].map((option) => (
              <div key={option.value} className="flex items-center gap-3">
                <input
                  type="radio"
                  id={`conflict-${option.value}`}
                  name="conflictResolution"
                  value={option.value}
                  checked={settings.conflictResolution === option.value}
                  onChange={(e) => updateSetting('conflictResolution', e.target.value as any)}
                  className="text-blue-600"
                />
                <label htmlFor={`conflict-${option.value}`} className="text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Advanced</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Retry attempts
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={settings.retryAttempts}
                onChange={(e) => updateSetting('retryAttempts', parseInt(e.target.value) || 3)}
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Offline queue limit
              </label>
              <Input
                type="number"
                min="10"
                max="1000"
                value={settings.offlineQueueLimit}
                onChange={(e) => updateSetting('offlineQueueLimit', parseInt(e.target.value) || 100)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Log retention (days)
            </label>
            <Input
              type="number"
              min="1"
              max="365"
              value={settings.logRetentionDays}
              onChange={(e) => updateSetting('logRetentionDays', parseInt(e.target.value) || 30)}
              className="w-24"
            />
            <p className="text-xs text-gray-500 mt-1">
              How long to keep activity logs and sync history
            </p>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableNotifications"
                checked={settings.enableNotifications}
                onChange={(e) => updateSetting('enableNotifications', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="enableNotifications" className="text-sm text-gray-700">
                Show sync status notifications
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="enableProgressNotifications"
                checked={settings.enableProgressNotifications}
                onChange={(e) => updateSetting('enableProgressNotifications', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="enableProgressNotifications" className="text-sm text-gray-700">
                Show detailed progress notifications
              </label>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Status & Maintenance</h3>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Connection:</span>
              <span className={`ml-2 ${syncState.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {syncState.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Pending:</span>
              <span className="ml-2">{syncState.pendingOperations} operations</span>
            </div>
            <div>
              <span className="text-gray-600">Conflicts:</span>
              <span className="ml-2">{syncState.conflicts.length} unresolved</span>
            </div>
            <div>
              <span className="text-gray-600">Activity logs:</span>
              <span className="ml-2">{syncState.activityLog.length} entries</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={testConnection}
              disabled={!syncState.isOnline}
            >
              Test Connection
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAllData}
              className="text-red-600 hover:text-red-700"
            >
              Clear All Data
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={resetToDefaults}
            disabled={isLoading}
          >
            Reset to Defaults
          </Button>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={saveSettings}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};