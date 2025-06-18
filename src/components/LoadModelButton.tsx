import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { FolderOpen } from 'lucide-react';
import LoadModelModal from './LoadModelModal';
import { TreeModel } from '../types';
import { useTreeContext } from '../context/TreeContext';
import { saveModel } from '../utils/offlineStorage';
import { updateTreeModelGistMetadata } from '../utils/treeModelUtils';
import { useSyncContext } from '../context/SyncContext';
import { GitHubAuthService } from '../services/githubAuthService';
import { GitHubGistService } from '../services/githubGistService';
import { getRootNode } from '../utils/gistUtils';
import { createSyncEventListener, syncEventSystem } from '../utils/syncEventSystem';
import { toast } from 'react-hot-toast';

export const LoadModelButton: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setNodes, setCollapsed, setPrompts } = useTreeContext();
  const { syncState, markChanges } = useSyncContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Check authentication status and listen for changes
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await GitHubAuthService.testConnection();
      setIsAuthenticated(authStatus.isAuthenticated);
    };
    
    checkAuth();
    
    // Listen for auth state changes from other components
    const unsubscribe = GitHubAuthService.addAuthStateListener((status) => {
      setIsAuthenticated(status.isAuthenticated);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Listen for sync events to refresh the modal content
  useEffect(() => {
    const eventListener = createSyncEventListener();
    
    const unsubscribeGistCreated = eventListener.onGistCreated(() => {
      console.log('🔄 LoadModelButton: Gist created, refreshing modal content');
      setRefreshKey(prev => prev + 1);
    });
    
    const unsubscribeGistUpdated = eventListener.onGistUpdated(() => {
      console.log('🔄 LoadModelButton: Gist updated, refreshing modal content');
      setRefreshKey(prev => prev + 1);
    });
    
    const unsubscribeSyncCompleted = eventListener.onSyncCompleted(() => {
      console.log('🔄 LoadModelButton: Sync completed, refreshing modal content');
      setRefreshKey(prev => prev + 1);
    });
    
    return () => {
      unsubscribeGistCreated();
      unsubscribeGistUpdated();
      unsubscribeSyncCompleted();
    };
  }, []);  const handleLoadModel = async (model: TreeModel) => {
    try {
      // Update the current tree with the loaded model's data
      setNodes(model.nodes);
      setCollapsed(new Set()); // Reset collapsed state
      
      // Load prompts from the model if they exist
      if (model.prompts && model.prompts.prompts && model.prompts.prompts.length > 0) {
        console.log('✅ Loading prompts from model:', {
          count: model.prompts.prompts.length, 
          activePromptId: model.prompts.activePromptId,
          names: model.prompts.prompts.map(p => p.name)
        });
        setPrompts(model.prompts);
      } else {
        console.warn('⚠️ No prompts found in loaded model or prompts array is empty');
      }
      
      // Load prompts from the model if they exist
      if (model.prompts && model.prompts.prompts && model.prompts.prompts.length > 0) {
        console.log('✅ Loading prompts from model:', model.prompts.prompts.length, 'prompts found');
        setPrompts(model.prompts);
      }
      
      // Use root node name as model name
      const rootNode = getRootNode(model.nodes);
      const modelName = rootNode ? rootNode.name : model.name;
      
      // Save the loaded model as the current tree model using centralized utility
      // This will save the model and emit the appropriate events
      await saveModel(model);

      // If syncing is enabled and the model doesn't have a gistId, create a gist
      const isAuthenticatedForSync = await GitHubAuthService.getCurrentPAT();
      if (isAuthenticatedForSync && !model.gistId) {
        try {
          console.log('Creating gist for loaded model since sync is enabled...');
          const gist = await GitHubGistService.createGist(model, model.isPublic || false);
          
          // Update the model with gist information using centralized utility
          await updateTreeModelGistMetadata(gist.id, gist.html_url, true);
          
          toast.success(`Loaded "${modelName}" and created GitHub backup`);
        } catch (error) {
          console.warn('Failed to create gist for loaded model:', error);
          toast.success(`Loaded "${modelName}" (GitHub backup failed)`);
        }
      } else {
        toast.success(`Loaded "${modelName}" successfully`);
      }
      
      // Emit model loaded event
      syncEventSystem.emit('MODEL_LOADED', {
        modelId: model.id,
        gistId: model.gistId,
        gistUrl: model.gistUrl
      });
      
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
        key={refreshKey} // Force refresh when sync events occur
      />
    </>
  );
};