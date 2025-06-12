import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { FolderOpen } from 'lucide-react';
import LoadModelModal from './LoadModelModal';
import { TreeModel } from '../types';
import { useTreeContext } from '../context/TreeContext';
import { saveModel } from '../utils/offlineStorage';
import { updateTreeModelMetadata } from '../utils/storageUtils';
import { useSyncContext } from '../context/SyncContext';
import { GitHubAuthService } from '../services/githubAuthService';
import { GitHubGistService } from '../services/githubGistService';
import { toast } from 'react-hot-toast';

export const LoadModelButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodes, setCollapsed } = useTreeContext();
  const { syncState, markChanges } = useSyncContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await GitHubAuthService.testConnection();
      setIsAuthenticated(authStatus.isAuthenticated);
    };
    
    checkAuth();
  }, []);

  const handleLoadModel = async (model: TreeModel) => {
    try {
      // Update the current tree with the loaded model's data
      setNodes(model.nodes);
      setCollapsed(new Set()); // Reset collapsed state
      
      // Save the loaded model as the current tree model
      await updateTreeModelMetadata({
        id: model.id,
        name: model.name,
        description: model.description,
        gistId: model.gistId,
        gistUrl: model.gistUrl,
        category: model.category,
        tags: model.tags,
        author: model.author,
        license: model.license,
        isPublic: model.isPublic,
        createdAt: model.createdAt,
        version: model.version
      });

      // Also save it to the models collection for future reference
      await saveModel(model);
      
      // If syncing is enabled and the model doesn't have a gistId, create a gist
      const isAuthenticatedForSync = await GitHubAuthService.getCurrentPAT();
      if (isAuthenticatedForSync && !model.gistId) {
        try {
          console.log('Creating gist for loaded model since sync is enabled...');
          const gist = await GitHubGistService.createGist(model, model.isPublic || false);
          
          // Update the model with gist information
          await updateTreeModelMetadata({
            gistId: gist.id,
            gistUrl: gist.html_url
          });
          
          toast.success(`Loaded "${model.name}" and created GitHub backup`);
        } catch (error) {
          console.warn('Failed to create gist for loaded model:', error);
          toast.success(`Loaded "${model.name}" (GitHub backup failed)`);
        }
      } else {
        toast.success(`Loaded "${model.name}" successfully`);
      }
      
      // Mark changes for sync if sync is enabled
      if (isAuthenticatedForSync) {
        markChanges();
      }
    } catch (error) {
      console.error('Failed to load model:', error);
      toast.error('Failed to load model');
    }
  };

  // Only show the button if we're online with Git authentication
  if (!syncState.isOnline || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsModalOpen(true)}
        title="Load Model"
        className="p-2"
      >
        <FolderOpen className="w-4 h-4" />
      </Button>
      
      <LoadModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoadModel={handleLoadModel}
      />
    </>
  );
};