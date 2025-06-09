import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { GitHubAuthService, GitHubAuthStatus } from '../services/githubAuthService';

interface GitHubPATModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (status: GitHubAuthStatus) => void;
}

export const GitHubPATModal: React.FC<GitHubPATModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [pat, setPat] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<GitHubAuthStatus>({ isAuthenticated: false });

  useEffect(() => {
    if (isOpen) {
      loadCurrentAuthStatus();
    }
  }, [isOpen]);

  const loadCurrentAuthStatus = async () => {
    const status = await GitHubAuthService.loadAuthStatus();
    setAuthStatus(status);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pat.trim()) {
      setError('Please enter a GitHub Personal Access Token');
      return;
    }

    setIsValidating(true);
    setError(null);
    setSuccess(null);

    try {
      const status = await GitHubAuthService.authenticateAndSave(pat.trim());
      
      if (status.isAuthenticated) {
        setSuccess(`Successfully authenticated as ${status.username}`);
        setAuthStatus(status);
        setPat('');
        onSuccess?.(status);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(status.error || 'Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save token');
    } finally {
      setIsValidating(false);
    }
  };

  const handleTestConnection = async () => {
    setIsValidating(true);
    setError(null);
    setSuccess(null);

    try {
      const status = await GitHubAuthService.testConnection();
      setAuthStatus(status);
      
      if (status.isAuthenticated) {
        setSuccess(`Connection successful! Authenticated as ${status.username}`);
      } else {
        setError(status.error || 'Connection failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection test failed');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveToken = async () => {
    setIsValidating(true);
    setError(null);
    setSuccess(null);

    try {
      await GitHubAuthService.removePAT();
      setAuthStatus({ isAuthenticated: false });
      setSuccess('GitHub token removed successfully');
      setPat('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove token');
    } finally {
      setIsValidating(false);
    }
  };

  const resetForm = () => {
    setPat('');
    setError(null);
    setSuccess(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title="GitHub Authentication"
    >
      <div className="space-y-4">
        {/* Current Status */}
        <div className="p-3 rounded-lg bg-gray-50 border">
          <div className="text-sm font-medium text-gray-700 mb-1">Current Status:</div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              authStatus.isAuthenticated ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm ${
              authStatus.isAuthenticated ? 'text-green-700' : 'text-red-700'
            }`}>
              {authStatus.isAuthenticated 
                ? `Authenticated as ${authStatus.username}` 
                : 'Not authenticated'
              }
            </span>
          </div>
          {authStatus.lastValidated && (
            <div className="text-xs text-gray-500 mt-1">
              Last validated: {new Date(authStatus.lastValidated).toLocaleString()}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            To sync your concept hierarchies to GitHub Gists, you need a Personal Access Token with <strong>gist</strong> permissions.
          </p>
          <div className="space-y-1">
            <p>1. Go to <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">GitHub Settings → Personal access tokens</a></p>
            <p>2. Click "Generate new token (classic)"</p>
            <p>3. Select the <strong>gist</strong> scope</p>
            <p>4. Copy the token and paste it below</p>
          </div>
        </div>

        {/* PAT Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pat" className="block text-sm font-medium text-gray-700 mb-1">
              Personal Access Token
            </label>
            <Input
              id="pat"
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              disabled={isValidating}
              className="font-mono text-sm"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="text-sm text-green-700">{success}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isValidating || !pat.trim()}
              className="flex-1"
            >
              {isValidating ? 'Validating...' : 'Save Token'}
            </Button>
            
            {authStatus.isAuthenticated && (
              <Button
                type="button"
                variant="outline"
                onClick={handleTestConnection}
                disabled={isValidating}
              >
                Test
              </Button>
            )}
          </div>

          {/* Management Actions */}
          {authStatus.isAuthenticated && (
            <div className="pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveToken}
                disabled={isValidating}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove Token
              </Button>
            </div>
          )}
        </form>

        {/* Security Note */}
        <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
          <strong>Security:</strong> Your token is encrypted and stored locally in your browser. 
          It never leaves your device except for direct communication with GitHub's API.
        </div>
      </div>
    </Modal>
  );
};