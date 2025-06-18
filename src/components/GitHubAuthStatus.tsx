import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { GitHubAuthService, GitHubAuthStatus as AuthStatus } from '../services/githubAuthService';
import { GitHubPATModal } from './GitHubPATModal';

interface GitHubAuthStatusProps {
  className?: string;
  showFullStatus?: boolean;
}

export const GitHubAuthStatus: React.FC<GitHubAuthStatusProps> = ({
  className = '',
  showFullStatus = false
}) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({ isAuthenticated: false });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthStatus();
    
    // Listen for auth state changes from other components
    const unsubscribe = GitHubAuthService.addAuthStateListener((status) => {
      setAuthStatus(status);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  const loadAuthStatus = async () => {
    setIsLoading(true);
    try {
      const status = await GitHubAuthService.loadAuthStatus();
      setAuthStatus(status);
    } catch (error) {
      console.error('Failed to load auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (status: AuthStatus) => {
    setAuthStatus(status);
  };

  const handleTestConnection = async () => {
    setIsLoading(true);
    try {
      const status = await GitHubAuthService.testConnection();
      setAuthStatus(status);
    } catch (error) {
      console.error('Failed to test connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (showFullStatus) {
    return (
      <div className={`space-y-3 ${className}`}>
        {/* Status Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg 
              className="w-4 h-4 text-gray-700" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <h3 className="text-sm font-medium text-gray-900">GitHub Sync</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            {authStatus.isAuthenticated ? 'Manage' : 'Setup'}
          </Button>
        </div>

        {/* Status Details */}
        <div className="p-3 rounded-lg border bg-gray-50">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              authStatus.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              authStatus.isAuthenticated ? 'text-green-700' : 'text-red-700'
            }`}>
              {authStatus.isAuthenticated ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          {authStatus.isAuthenticated && authStatus.username && (
            <div className="text-sm text-gray-600 mb-1">
              Authenticated as <strong>{authStatus.username}</strong>
            </div>
          )}

          {authStatus.lastValidated && (
            <div className="text-xs text-gray-500">
              Last validated: {new Date(authStatus.lastValidated).toLocaleString()}
            </div>
          )}

          {authStatus.error && (
            <div className="text-xs text-red-600 mt-1">
              Error: {authStatus.error}
            </div>
          )}

          {authStatus.isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              className="mt-2 text-xs"
            >
              Test Connection
            </Button>
          )}
        </div>

        <GitHubPATModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  // Compact status indicator
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-1 text-sm hover:bg-gray-100 rounded p-1.5 transition-colors relative"
        title={authStatus.isAuthenticated 
          ? `GitHub: Connected as ${authStatus.username}` 
          : 'GitHub: Not connected - Click to setup'
        }
      >
        {/* GitHub Logo SVG */}
        <svg 
          className="w-5 h-5 text-gray-700" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        
        {/* Status indicator dot */}
        <div className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
          authStatus.isAuthenticated ? 'bg-green-500' : 'bg-gray-400'
        }`} />
      </button>

      <GitHubPATModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};