import { NodeData, TreeModel, PromptCollection } from '../types';
import { SyncManager } from './syncManager';
import { loadData, saveData } from './offlineStorage';

/**
 * Converts the current tree structure to a TreeModel for syncing
 */
export const convertNodesToTreeModel = async (
  nodes: NodeData[],
  name?: string,
  description?: string
): Promise<TreeModel> => {
  console.log('🔄 convertNodesToTreeModel: Starting conversion...');
  console.log('🔄 convertNodesToTreeModel: Input nodes count:', nodes.length);
  console.log('🔄 convertNodesToTreeModel: Name override:', name);
  console.log('🔄 convertNodesToTreeModel: Description override:', description);
  
  // Try to load existing model metadata or create new
  let existingModel: TreeModel | null = null;
  try {
    existingModel = await loadData('currentTreeModel');
    console.log('🔄 convertNodesToTreeModel: Loaded existing model:', existingModel?.id, existingModel?.gistId);
  } catch (error) {
    console.warn('⚠️ convertNodesToTreeModel: Failed to load existing tree model:', error);
  }

  // Get current prompts collection
  let prompts: PromptCollection = { prompts: [], activePromptId: null };
  try {
    const storedPrompts = await loadData('promptCollection');
    if (storedPrompts) {
      prompts = storedPrompts;
      console.log('🔄 convertNodesToTreeModel: Loaded prompts:', prompts.prompts.length);
    }
  } catch (error) {
    console.warn('⚠️ convertNodesToTreeModel: Failed to load prompts:', error);
  }

  const now = new Date();
  const modelId = existingModel?.id || `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log('🔄 convertNodesToTreeModel: Using model ID:', modelId);

  // Create or update the tree model
  const treeModel: TreeModel = {
    id: modelId,
    name: name || existingModel?.name || 'My Concept Hierarchy',
    description: description || existingModel?.description || 'A concept hierarchy created with the Concept Hierarchy Designer',
    nodes: nodes,
    prompts: prompts,
    createdAt: existingModel?.createdAt || now,
    lastModified: now,
    version: (existingModel?.version || 0) + 1,
    gistId: existingModel?.gistId,
    gistUrl: existingModel?.gistUrl,
    category: existingModel?.category || 'personal',
    tags: existingModel?.tags || [],
    author: existingModel?.author,
    license: existingModel?.license || 'MIT',
    isPublic: existingModel?.isPublic || false,
  };

  console.log('🔄 convertNodesToTreeModel: Created tree model:', {
    id: treeModel.id,
    name: treeModel.name,
    nodeCount: treeModel.nodes.length,
    version: treeModel.version,
    gistId: treeModel.gistId,
    isPublic: treeModel.isPublic
  });

  // Save the updated model
  try {
    await saveData('currentTreeModel', treeModel);
    console.log('✅ convertNodesToTreeModel: Model saved to storage');
  } catch (error) {
    console.error('❌ convertNodesToTreeModel: Failed to save model:', error);
    throw error;
  }

  return treeModel;
};

/**
 * Syncs the current tree to GitHub Gists
 */
export const syncCurrentTreeToGitHub = async (
  nodes: NodeData[],
  options?: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    forceCreate?: boolean;
  }
): Promise<{ success: boolean; gistId?: string; error?: string }> => {
  console.log('🔗 syncIntegration: Starting sync to GitHub...');
  console.log('🔗 syncIntegration: Nodes count:', nodes.length);
  console.log('🔗 syncIntegration: Options:', options);
  
  try {
    console.log('🔗 syncIntegration: Converting nodes to tree model...');
    const treeModel = await convertNodesToTreeModel(
      nodes,
      options?.name,
      options?.description
    );
    console.log('🔗 syncIntegration: Tree model created:', treeModel.id, 'gistId:', treeModel.gistId);

    if (options?.isPublic !== undefined) {
      treeModel.isPublic = options.isPublic;
      console.log('🔗 syncIntegration: Set public flag to:', options.isPublic);
    }

    const syncManager = SyncManager.getInstance();

    if (treeModel.gistId && !options?.forceCreate) {
      console.log('🔗 syncIntegration: Updating existing gist:', treeModel.gistId);
      await syncManager.enqueueSync('UPDATE', treeModel, treeModel.gistId);
    } else {
      console.log('🔗 syncIntegration: Creating new gist');
      await syncManager.enqueueSync('CREATE', treeModel);
    }

    // Trigger immediate sync if online
    const status = syncManager.getStatus();
    console.log('🔗 syncIntegration: Sync manager status:', status);
    if (status.isOnline) {
      console.log('🔗 syncIntegration: Triggering manual sync...');
      await syncManager.manualSync();
    } else {
      console.log('⚠️ syncIntegration: Offline, sync queued for later');
    }

    const finalResult = { success: true, gistId: treeModel.gistId };
    console.log('✅ syncIntegration: Sync completed, result:', finalResult);
    return finalResult;
  } catch (error) {
    console.error('❌ syncIntegration: Failed to sync tree to GitHub:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown sync error'
    };
  }
};

/**
 * Loads a tree model from a GitHub Gist
 */
export const loadTreeFromGitHub = async (gistId: string): Promise<{
  success: boolean;
  nodes?: NodeData[];
  model?: TreeModel;
  error?: string;
}> => {
  try {
    const syncManager = SyncManager.getInstance();
    
    // This would typically be handled by a separate import service
    // For now, we'll indicate this feature needs implementation
    return {
      success: false,
      error: 'Loading from GitHub Gists not yet implemented in this sync integration'
    };
  } catch (error) {
    console.error('Failed to load tree from GitHub:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown load error'
    };
  }
};

/**
 * Gets the current tree model sync status
 */
export const getTreeSyncStatus = async (): Promise<{
  hasGistId: boolean;
  gistId?: string;
  gistUrl?: string;
  lastSynced?: Date;
  pendingChanges: boolean;
}> => {
  try {
    const existingModel = await loadData('currentTreeModel');
    const syncManager = SyncManager.getInstance();
    const status = syncManager.getStatus();

    return {
      hasGistId: Boolean(existingModel?.gistId),
      gistId: existingModel?.gistId,
      gistUrl: existingModel?.gistUrl,
      lastSynced: existingModel?.lastModified,
      pendingChanges: status.pendingOperations > 0
    };
  } catch (error) {
    console.error('Failed to get sync status:', error);
    return {
      hasGistId: false,
      pendingChanges: false
    };
  }
};

/**
 * Creates a manual sync button that works with the current tree context
 */
export const createTreeSyncButton = (nodes: NodeData[]) => {
  return {
    syncToGitHub: () => syncCurrentTreeToGitHub(nodes),
    syncAsPublic: () => syncCurrentTreeToGitHub(nodes, { isPublic: true }),
    syncAsPrivate: () => syncCurrentTreeToGitHub(nodes, { isPublic: false }),
    forceNewGist: () => syncCurrentTreeToGitHub(nodes, { forceCreate: true })
  };
};