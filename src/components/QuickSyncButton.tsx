import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { useTreeContext } from '../context/TreeContext';
import { useSyncContext } from '../context/SyncContext';
import { syncCurrentTreeToGitHub, getTreeSyncStatus } from '../utils/syncIntegration';
import { GitHubAuthService } from '../services/githubAuthService';

interface QuickSyncButtonProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export const QuickSyncButton: React.FC<QuickSyncButtonProps> = ({
  variant = 'default',
  className = ''
}) => {
  const { nodes } = useTreeContext();
  const {} = useSyncContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    hasGistId: boolean;
    gistUrl?: string;
  }>({ hasGistId: false });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await GitHubAuthService.loadAuthStatus();
      setIsAuthenticated(authStatus.isAuthenticated);
    };
    checkAuth();
  }, []);

  // Load sync status
  useEffect(() => {
    const loadSyncStatus = async () => {
      const status = await getTreeSyncStatus();
      setSyncStatus(status);
    };
    loadSyncStatus();
  }, [nodes]);

  const handleSync = async () => {
    console.log('🔄 QuickSyncButton: Starting sync process...');
    console.log('🔄 QuickSyncButton: Authenticated?', isAuthenticated);
    console.log('🔄 QuickSyncButton: Nodes count:', nodes.length);
    
    if (!isAuthenticated) {
      console.log('❌ QuickSyncButton: Not authenticated');
      alert('Please configure GitHub authentication in the Admin page first.');
      return;
    }

    setIsSyncing(true);
    try {
      console.log('🔄 QuickSyncButton: Calling syncCurrentTreeToGitHub...');
      const result = await syncCurrentTreeToGitHub(nodes);
      console.log('🔄 QuickSyncButton: Sync result:', result);
      
      if (result.success) {
        console.log('✅ QuickSyncButton: Sync successful, refreshing status...');
        // Refresh sync status
        const status = await getTreeSyncStatus();
        console.log('🔄 QuickSyncButton: Updated status:', status);
        setSyncStatus(status);
        
        if (status.gistUrl) {
          console.log('🔗 QuickSyncButton: Gist URL available:', status.gistUrl);
          const openGist = window.confirm(
            'Sync successful! Would you like to view the Gist on GitHub?'
          );
          if (openGist) {
            window.open(status.gistUrl, '_blank');
          }
        } else {
          console.log('⚠️ QuickSyncButton: No gist URL in status after sync');
        }
      } else {
        console.log('❌ QuickSyncButton: Sync failed:', result.error);
        alert(`Sync failed: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ QuickSyncButton: Sync error:', error);
      alert('Sync failed. Please check the console for details.');
    } finally {
      setIsSyncing(false);
      console.log('🔄 QuickSyncButton: Sync process completed');
    }
  };

  const getButtonText = () => {
    if (isSyncing) return 'Syncing...';
    if (!isAuthenticated) return 'Setup Required';
    if (syncStatus.hasGistId) return 'Update GitHub Gist';
    return 'Create GitHub Gist';
  };

  const getButtonTitle = () => {
    if (!isAuthenticated) {
      return 'GitHub authentication required. Go to Admin page to set up.';
    }
    if (syncStatus.hasGistId) {
      return `Update existing Gist with current changes. Current Gist: ${syncStatus.gistUrl || 'Unknown'}`;
    }
    return 'Create a new GitHub Gist with your concept hierarchy';
  };

  if (variant === 'icon-only') {
    return (
      <Button
        onClick={handleSync}
        disabled={isSyncing || !nodes.length}
        variant={!isAuthenticated ? "destructive" : "outline"}
        size="sm"
        className={`w-9 h-9 p-0 ${className}`}
        title={getButtonTitle()}
      >
        {isSyncing ? (
          <div className="animate-spin w-4 h-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        onClick={handleSync}
        disabled={isSyncing || !nodes.length}
        variant={!isAuthenticated ? "destructive" : "outline"}
        size="sm"
        className={`flex items-center gap-2 ${className}`}
        title={getButtonTitle()}
      >
        {isSyncing ? (
          <div className="animate-spin w-4 h-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
        <span>{getButtonText()}</span>
      </Button>
    );
  }

  // Default variant
  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        onClick={handleSync}
        disabled={isSyncing || !nodes.length}
        variant={!isAuthenticated ? "destructive" : "default"}
        size="sm"
        className="flex items-center gap-2 w-full"
        title={getButtonTitle()}
      >
        {isSyncing ? (
          <div className="animate-spin w-4 h-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
        <span>{getButtonText()}</span>
      </Button>

      {syncStatus.hasGistId && syncStatus.gistUrl && (
        <p className="text-xs text-gray-500">
          <a 
            href={syncStatus.gistUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View current Gist →
          </a>
        </p>
      )}

      {!isAuthenticated && (
        <p className="text-xs text-red-600">
          Authentication required. Go to Admin page to set up GitHub access.
        </p>
      )}
    </div>
  );
};