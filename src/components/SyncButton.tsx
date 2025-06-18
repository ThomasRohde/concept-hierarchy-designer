import React, { useEffect, useState } from 'react';
import { Button } from './ui/Button';
import { useSyncContext } from '../context/SyncContext';
import { useTreeContext } from '../context/TreeContext';
import { syncCurrentTreeToGitHub, getTreeSyncStatus } from '../utils/syncIntegration';
import { GitHubAuthService } from '../services/githubAuthService';
import { createSyncEventListener } from '../utils/syncEventSystem';

interface SyncButtonProps {
  variant?: 'default' | 'compact' | 'icon-only';
  showProgress?: boolean;
  className?: string;
}

export const SyncButton: React.FC<SyncButtonProps> = ({ 
  variant = 'default',
  showProgress = false,
  className = ''
}) => {
  const { syncState, notifyGistCreated } = useSyncContext();
  const { nodes } = useTreeContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    hasGistId: boolean;
    gistUrl?: string;
  }>({ hasGistId: false });
  const [isGistSyncing, setIsGistSyncing] = useState(false);

  // Check authentication status and listen for changes
  useEffect(() => {
    const checkAuth = async () => {
      // Use testConnection instead of loadAuthStatus to verify the token is actually valid
      const authStatus = await GitHubAuthService.testConnection();
      console.log('🔐 SyncButton: Authentication status check (live test):', authStatus);
      setIsAuthenticated(authStatus.isAuthenticated);
    };
    
    checkAuth();
    
    // Listen for auth state changes from other components
    const unsubscribe = GitHubAuthService.addAuthStateListener((status) => {
      console.log('🔐 SyncButton: Auth state changed via listener:', status);
      setIsAuthenticated(status.isAuthenticated);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Load sync status
  useEffect(() => {
    const loadSyncStatus = async () => {
      const status = await getTreeSyncStatus();
      setSyncStatus(status);
    };
    loadSyncStatus();
  }, [nodes]);

  // Listen for sync events to update status automatically
  useEffect(() => {
    const eventListener = createSyncEventListener();
    
    const unsubscribeGistCreated = eventListener.onGistCreated(async () => {
      console.log('🔄 SyncButton: Gist created, refreshing sync status');
      const status = await getTreeSyncStatus();
      setSyncStatus(status);
    });
    
    const unsubscribeGistUpdated = eventListener.onGistUpdated(async () => {
      console.log('🔄 SyncButton: Gist updated, refreshing sync status');
      const status = await getTreeSyncStatus();
      setSyncStatus(status);
    });
    
    const unsubscribeMetadataUpdated = eventListener.onMetadataUpdated(async () => {
      console.log('🔄 SyncButton: Metadata updated, refreshing sync status');
      const status = await getTreeSyncStatus();
      setSyncStatus(status);
    });
    
    return () => {
      unsubscribeGistCreated();
      unsubscribeGistUpdated();
      unsubscribeMetadataUpdated();
    };
  }, []);

  // Keyboard shortcut for manual sync (Ctrl+S or Cmd+S)
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && e.shiftKey) {
        e.preventDefault();
        handleSyncClick();
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [syncState.isOnline, syncState.isSyncing]);

  const handleSyncClick = async () => {
    console.log('🔄 SyncButton: GitHub sync clicked');
    console.log('🔐 SyncButton: isAuthenticated state:', isAuthenticated);
    
    if (!isAuthenticated) {
      console.log('❌ SyncButton: Not authenticated, testing connection again...');
      const authStatus = await GitHubAuthService.testConnection();
      console.log('🔐 SyncButton: Fresh auth test:', authStatus);
      
      if (!authStatus.isAuthenticated) {
        alert('Please configure GitHub authentication in the Admin page first.');
        return;
      } else {
        console.log('🔐 SyncButton: Auth status was stale, updating...');
        setIsAuthenticated(true);
      }
    }

    setIsGistSyncing(true);
    try {
      console.log('🔄 SyncButton: Starting GitHub gist sync...');
      const result = await syncCurrentTreeToGitHub(nodes);
      console.log('🔄 SyncButton: Sync result:', result);
      
      if (result.success) {
        console.log('✅ SyncButton: Sync successful, refreshing status...');
        // Refresh sync status
        const status = await getTreeSyncStatus();
        console.log('🔄 SyncButton: Updated status:', status);
        setSyncStatus(status);
        
        // Notify other components that a gist was created/updated
        notifyGistCreated();
        
        if (status.gistUrl) {
          console.log('🔗 SyncButton: Gist URL available:', status.gistUrl);
          // Optional: show success message or open gist
        } else {
          console.log('⚠️ SyncButton: No gist URL in status after sync');
        }
      } else {
        console.log('❌ SyncButton: Sync failed:', result.error);
        
        // Check if the error indicates a deleted gist (404 error)
        if (result.error?.includes('404') || result.error?.includes('Not Found')) {
          console.log('🗑️ SyncButton: Gist appears to have been deleted, clearing local reference');
          // Clear the gist ID so we create a new one next time
          setSyncStatus({ hasGistId: false });
          alert('The linked GitHub Gist was deleted. A new Gist will be created on next sync.');
        } else {
          alert(`Sync failed: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('❌ SyncButton: Sync error:', error);
      alert('Sync failed. Please check the console for details.');
    } finally {
      setIsGistSyncing(false);
      console.log('🔄 SyncButton: Sync process completed');
    }
  };

  // If we're not online or not authenticated, don't render the button at all
  if (!syncState.isOnline || !isAuthenticated) {
    return null;
  }

  const isDisabled = !syncState.isOnline || syncState.isSyncing || isGistSyncing;

  const getButtonText = () => {
    if (isGistSyncing) return 'Syncing...';
    if (!isAuthenticated) return 'Setup Required';
    if (syncStatus.hasGistId) return 'Update';
    return 'Create';
  };

  const getButtonContent = () => {
    const isLoading = syncState.isSyncing || isGistSyncing;
    
    if (variant === 'icon-only') {
      return isLoading ? (
        <div className="animate-spin w-4 h-4">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      ) : syncState.syncError ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }

    if (isLoading) {
      return (
        <>
          <div className="animate-spin w-4 h-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          {variant !== 'compact' && <span>{getButtonText()}</span>}
          {showProgress && syncState.syncProgress && (
            <span className="text-xs opacity-75">
              {Math.round(syncState.syncProgress)}%
            </span>
          )}
        </>
      );
    }

    if (syncState.syncError) {
      return (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {variant !== 'compact' && <span>Retry</span>}
        </>
      );
    }

    return (
      <>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {variant !== 'compact' && <span>{getButtonText()}</span>}
        {syncState.pendingOperations > 0 && variant === 'default' && (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full">
            {syncState.pendingOperations}
          </span>
        )}
      </>
    );
  };

  const getButtonTitle = () => {
    if (!isAuthenticated) {
      return 'GitHub authentication required. Go to Admin page to set up. (Ctrl+Shift+S)';
    }
    if (isGistSyncing) {
      return 'GitHub Gist sync in progress... (Ctrl+Shift+S)';
    }
    if (!syncState.isOnline) {
      return 'Cannot sync while offline (Ctrl+Shift+S)';
    }
    if (syncStatus.hasGistId) {
      return `Update existing GitHub Gist with current changes. Current Gist: ${syncStatus.gistUrl || 'Unknown'} (Ctrl+Shift+S)`;
    }
    return 'Create a new GitHub Gist with your concept hierarchy (Ctrl+Shift+S)';
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={handleSyncClick}
        disabled={isDisabled}
        variant={syncState.syncError ? "destructive" : "ghost"}
        size="sm"
        className={`flex items-center gap-2 hover:bg-gray-100 ${
          variant === 'icon-only' ? 'w-9 h-9 p-0' : 
          variant === 'compact' ? 'min-w-[60px]' : 'min-w-[100px]'
        }`}
        title={getButtonTitle()}
      >
        {getButtonContent()}
      </Button>
      
      {/* Progress indicator for compact/icon variants */}
      {(variant === 'compact' || variant === 'icon-only') && 
       syncState.isSyncing && syncState.syncProgress !== undefined && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${syncState.syncProgress}%` }}
          />
        </div>
      )}
    </div>
  );
};