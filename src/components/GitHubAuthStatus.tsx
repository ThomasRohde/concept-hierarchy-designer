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
          <h3 className="text-sm font-medium text-gray-900">GitHub Sync</h3>
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
        className="flex items-center space-x-2 text-sm hover:bg-gray-100 rounded px-2 py-1 transition-colors"
        title={authStatus.isAuthenticated 
          ? `GitHub: Connected as ${authStatus.username}` 
          : 'GitHub: Not connected - Click to setup'
        }
      >
        <div className={`w-2 h-2 rounded-full ${
          authStatus.isAuthenticated ? 'bg-green-500' : 'bg-gray-400'
        }`} />
        <span className="text-gray-700">
          {authStatus.isAuthenticated ? 'GitHub' : 'GitHub'}
        </span>
      </button>

      <GitHubPATModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};