import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import LoadingSpinner from './LoadingSpinner';
import { GitHubGistService } from '../services/githubGistService';
import { GitHubAuthService } from '../services/githubAuthService';
import { TreeModel } from '../types';
import { getModelSummary, getModel, deleteModel } from '../utils/offlineStorage';
import { useSyncContext } from '../context/SyncContext';
import { Calendar, User, FileText, GitBranch, ExternalLink, Trash2 } from 'lucide-react';

interface ModelSummary {
  id: string;
  name: string;
  description?: string;
  nodeCount: number;
  createdAt: Date;
  lastModified: Date;
  gistUrl?: string;
  author?: string;
}

interface LoadModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadModel: (model: TreeModel) => void;
}

const LoadModelModal: React.FC<LoadModelModalProps> = ({ isOpen, onClose, onLoadModel }) => {
  const [localModels, setLocalModels] = useState<ModelSummary[]>([]);
  const [remoteModels, setRemoteModels] = useState<ModelSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'local' | 'remote'>('local');
  const [loadingModelId, setLoadingModelId] = useState<string | null>(null);
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null);
  const { onGistCreated } = useSyncContext();

  useEffect(() => {
    if (isOpen) {
      loadModels();
    }
  }, [isOpen]);

  // Listen for gist creation events to refresh remote models
  useEffect(() => {
    const unsubscribe = onGistCreated(() => {
      console.log('🔄 LoadModelModal: Gist created, refreshing remote models...');
      if (isOpen && isAuthenticated) {
        loadRemoteModels();
      }
    });

    return unsubscribe;
  }, [onGistCreated, isOpen, isAuthenticated]);

  const checkAuthentication = async () => {
    const pat = await GitHubAuthService.getCurrentPAT();
    setIsAuthenticated(!!pat);
  };

  const loadRemoteModels = async () => {
    try {
      const pat = await GitHubAuthService.getCurrentPAT();
      if (!pat) return;

      console.log('🔄 LoadModelModal: Loading remote models...');
      const gists = await GitHubGistService.listConceptHierarchyGists();
      
      const remoteSummaries: ModelSummary[] = [];
      for (const gist of gists) {
        try {
          // Fetch the full gist with content
          const fullGist = await GitHubGistService.getGist(gist.id);
          
          const model = GitHubGistService.parseGistToModel(fullGist);
          if (model) {
            remoteSummaries.push({
              id: model.id,
              name: model.name,
              description: model.description,
              nodeCount: model.nodes.length,
              createdAt: model.createdAt,
              lastModified: model.lastModified,
              gistUrl: gist.html_url,
              author: model.author || gist.owner?.login
            });
          }
        } catch (error) {
          console.warn('Error fetching gist:', gist.id, error);
        }
      }
      
      setRemoteModels(remoteSummaries);
      console.log('✅ LoadModelModal: Loaded', remoteSummaries.length, 'remote models');
    } catch (error) {
      console.error('Failed to load remote models:', error);
      toast.error('Failed to load remote models');
    }
  };

  const loadModels = async () => {
    setLoading(true);
    try {
      // Load local models
      const localSummaries = await getModelSummary();
      setLocalModels(localSummaries);

      // Check GitHub authentication and load remote models
      await checkAuthentication();
      await loadRemoteModels();
    } catch (error) {
      console.error('Failed to load models:', error);
      toast.error('Failed to load models');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLocal = async (modelId: string) => {
    setLoadingModelId(modelId);
    try {
      const model = await getModel(modelId);
      if (model) {
        onLoadModel(model);
        onClose();
        toast.success(`Loaded "${model.name}" successfully`);
      } else {
        toast.error('Model not found');
      }
    } catch (error) {
      console.error('Failed to load local model:', error);
      toast.error('Failed to load model');
    } finally {
      setLoadingModelId(null);
    }
  };

  const handleLoadRemote = async (gistUrl: string, modelName: string) => {
    setLoadingModelId(gistUrl);
    try {
      // Extract gist ID from URL
      const gistId = gistUrl.split('/').pop();
      if (!gistId) {
        throw new Error('Invalid gist URL');
      }

      const gist = await GitHubGistService.getGist(gistId);
      const model = GitHubGistService.parseGistToModel(gist);
      
      if (model) {
        onLoadModel(model);
        onClose();
        toast.success(`Loaded "${modelName}" from GitHub successfully`);
      } else {
        toast.error('Failed to parse model from gist');
      }
    } catch (error) {
      console.error('Failed to load remote model:', error);
      toast.error('Failed to load model from GitHub');
    } finally {
      setLoadingModelId(null);
    }
  };

  const handleDeleteLocal = async (modelId: string, modelName: string) => {
    if (!confirm(`Are you sure you want to delete "${modelName}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingModelId(modelId);
    try {
      await deleteModel(modelId);
      toast.success(`Deleted "${modelName}" successfully`);
      // Reload local models
      const localSummaries = await getModelSummary();
      setLocalModels(localSummaries);
    } catch (error) {
      console.error('Failed to delete local model:', error);
      toast.error('Failed to delete model');
    } finally {
      setDeletingModelId(null);
    }
  };

  const handleDeleteRemote = async (gistUrl: string, modelName: string) => {
    if (!confirm(`Are you sure you want to delete "${modelName}" from GitHub? This action cannot be undone.`)) {
      return;
    }

    setDeletingModelId(gistUrl);
    try {
      // Extract gist ID from URL
      const gistId = gistUrl.split('/').pop();
      if (!gistId) {
        throw new Error('Invalid gist URL');
      }

      await GitHubGistService.deleteGist(gistId);
      toast.success(`Deleted "${modelName}" from GitHub successfully`);
      // Reload remote models
      await loadRemoteModels();
    } catch (error) {
      console.error('Failed to delete remote model:', error);
      toast.error('Failed to delete model from GitHub');
    } finally {
      setDeletingModelId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const ModelCard: React.FC<{ model: ModelSummary; isRemote?: boolean }> = ({ model, isRemote = false }) => {
    const modelId = isRemote ? model.gistUrl : model.id;
    const isLoading = loadingModelId === modelId;
    const isDeleting = deletingModelId === modelId;
    
    return (
      <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{model.name}</h3>
            {model.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{model.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {model.nodeCount} nodes
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(model.lastModified)}
              </span>
              {model.author && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {model.author}
                </span>
              )}
              {isRemote && model.gistUrl && (
                <a 
                  href={model.gistUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3" />
                  View
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-3">
            <Button
              size="sm"
              onClick={() => isRemote ? handleLoadRemote(model.gistUrl!, model.name) : handleLoadLocal(model.id)}
              disabled={isLoading || isDeleting}
            >
              {isLoading ? <LoadingSpinner size={16} /> : 'Load'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => isRemote ? handleDeleteRemote(model.gistUrl!, model.name) : handleDeleteLocal(model.id, model.name)}
              disabled={isLoading || isDeleting}
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              {isDeleting ? <LoadingSpinner size={16} /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const EmptyState: React.FC<{ isRemote?: boolean }> = ({ isRemote = false }) => (
    <div className="text-center py-8 text-gray-500">
      <GitBranch className="w-8 h-8 mx-auto mb-2 opacity-50" />
      <p className="text-sm">
        {isRemote 
          ? isAuthenticated 
            ? 'No models found in your GitHub Gists'
            : 'Connect to GitHub to access remote models'
          : 'No local models found'
        }
      </p>
      {isRemote && !isAuthenticated && (
        <p className="text-xs mt-1">
          Use the GitHub icon in the header to authenticate
        </p>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Load Model"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('local')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'local'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Local Models ({localModels.length})
            </button>
            <button
              onClick={() => setActiveTab('remote')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'remote'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              GitHub Models ({remoteModels.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2 text-gray-600">Loading models...</span>
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto">
            {activeTab === 'local' ? (
              localModels.length > 0 ? (
                <div className="space-y-3">
                  {localModels.map(model => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
              ) : (
                <EmptyState />
              )
            ) : (
              remoteModels.length > 0 ? (
                <div className="space-y-3">
                  {remoteModels.map(model => (
                    <ModelCard key={model.gistUrl} model={model} isRemote />
                  ))}
                </div>
              ) : (
                <EmptyState isRemote />
              )
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div className="text-xs text-gray-500">
          Tip: ESC to cancel
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={loadModels} disabled={loading}>
            Refresh
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LoadModelModal;