import { NodeData, TreeModel, PromptCollection } from '../types';
import { SyncManager } from './syncManager';
import { loadData } from './offlineStorage';
import { createOrUpdateTreeModel, getCurrentTreeModel } from './treeModelUtils';

// Robust sync lock system to prevent concurrent sync operations that could create duplicate gists
interface SyncLockEntry {
  timestamp: number;
  requestId: string;
  operation: string;
}

// Global sync lock map that persists across component re-executions
const syncLocks = new Map<string, SyncLockEntry>();
const SYNC_LOCK_TIMEOUT = 30000; // 30 seconds timeout for abandoned locks

// Additional global sync throttling to prevent rapid successive sync calls
let lastGlobalSyncAttempt = 0;
const GLOBAL_SYNC_THROTTLE_MS = 1000; // 1 second global throttle

// Generate unique request ID for tracking
const generateRequestId = (): string => {
  return `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Clean up expired sync locks
const cleanupExpiredLocks = (): void => {
  const now = Date.now();
  for (const [key, lock] of syncLocks.entries()) {
    if (now - lock.timestamp > SYNC_LOCK_TIMEOUT) {
      console.log(`🧹 Cleaning up expired sync lock: ${key} (${lock.requestId})`);
      syncLocks.delete(key);
    }
  }
};

// Check if sync operation is already in progress for a specific tree
const isSyncInProgress = (treeId: string): boolean => {
  cleanupExpiredLocks();
  return syncLocks.has(treeId);
};

// Acquire sync lock for a specific tree
const acquireSyncLock = (treeId: string, operation: string): string => {
  cleanupExpiredLocks();
  
  if (syncLocks.has(treeId)) {
    const existingLock = syncLocks.get(treeId)!;
    throw new Error(`Sync already in progress for tree ${treeId} (${existingLock.requestId})`);
  }
  
  const requestId = generateRequestId();
  const lock: SyncLockEntry = {
    timestamp: Date.now(),
    requestId,
    operation
  };
  
  syncLocks.set(treeId, lock);
  console.log(`🔒 Acquired sync lock for tree ${treeId}: ${requestId} (${operation})`);
  return requestId;
};

// Release sync lock for a specific tree
const releaseSyncLock = (treeId: string, requestId: string): void => {
  const lock = syncLocks.get(treeId);
  if (lock && lock.requestId === requestId) {
    syncLocks.delete(treeId);
    console.log(`🔓 Released sync lock for tree ${treeId}: ${requestId}`);
  } else {
    console.warn(`⚠️ Attempted to release non-existent or mismatched sync lock for tree ${treeId}: ${requestId}`);
  }
};

/**
 * Converts the current tree structure to a TreeModel for syncing
 * Now uses centralized TreeModel creation for consistency
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
  
  // Get current prompts collection from multiple sources
  let prompts: PromptCollection = { prompts: [], activePromptId: null };
  try {
    // First try to get from localStorage (current prompt storage)
    const { loadPromptCollection } = await import('./promptUtils');
    prompts = loadPromptCollection();
    console.log('🔄 convertNodesToTreeModel: Loaded prompts from promptUtils:', prompts.prompts.length);
  } catch (error) {
    console.warn('⚠️ convertNodesToTreeModel: Failed to load prompts:', error);
    
    // Fallback to indexed DB storage
    try {
      const storedPrompts = await loadData('promptCollection');
      if (storedPrompts) {
        prompts = storedPrompts;
        console.log('🔄 convertNodesToTreeModel: Loaded prompts from storage:', prompts.prompts.length);
      }
    } catch (storageError) {
      console.warn('⚠️ convertNodesToTreeModel: Failed to load prompts from storage:', storageError);
    }
  }

  // Use centralized TreeModel creation for consistency
  const treeModel = await createOrUpdateTreeModel(nodes, prompts, {
    name,
    description,
    preserveExisting: true
  });

  console.log('🔄 convertNodesToTreeModel: Created tree model using centralized utility:', {
    id: treeModel.id,
    name: treeModel.name,
    nodeCount: treeModel.nodes.length,
    version: treeModel.version,
    gistId: treeModel.gistId,
    isPublic: treeModel.isPublic
  });

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
  const now = Date.now();
  
  // Global throttling to prevent rapid successive sync calls from any source
  if (now - lastGlobalSyncAttempt < GLOBAL_SYNC_THROTTLE_MS) {
    console.log('⚠️ syncIntegration: Throttling sync attempt - too soon after last global sync');
    return {
      success: false,
      error: 'Sync throttled: Please wait before attempting another sync.'
    };
  }
  
  lastGlobalSyncAttempt = now;
  
  console.log('🔗 syncIntegration: Starting sync to GitHub...');
  console.log('🔗 syncIntegration: Nodes count:', nodes.length);
  console.log('🔗 syncIntegration: Options:', options);
  
  // First convert nodes to get the tree model ID for locking
  let treeModel: TreeModel;
  try {
    console.log('🔗 syncIntegration: Converting nodes to tree model for lock acquisition...');
    treeModel = await convertNodesToTreeModel(
      nodes,
      options?.name,
      options?.description
    );
    console.log('🔗 syncIntegration: Tree model created for locking:', treeModel.id);
  } catch (error) {
    console.error('❌ syncIntegration: Failed to create tree model for locking:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to prepare tree model'
    };
  }
  
  // Determine operation type for lock tracking
  const operation = (treeModel.gistId && !options?.forceCreate) ? 'UPDATE' : 'CREATE';
  
  // Prevent concurrent sync operations using robust per-tree locking
  if (isSyncInProgress(treeModel.id)) {
    console.log('⚠️ syncIntegration: Sync already in progress for tree:', treeModel.id);
    return {
      success: false,
      error: 'Sync operation already in progress for this tree. Please wait for it to complete.'
    };
  }
  
  // Acquire sync lock with unique request ID
  let requestId: string;
  try {
    requestId = acquireSyncLock(treeModel.id, operation);
  } catch (error) {
    console.log('⚠️ syncIntegration: Failed to acquire sync lock:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to acquire sync lock'
    };
  }
  
  try {
    console.log(`🔗 syncIntegration: Processing sync with request ID: ${requestId}`);

    if (options?.isPublic !== undefined) {
      treeModel.isPublic = options.isPublic;
      console.log('🔗 syncIntegration: Set public flag to:', options.isPublic);
    }

    const syncManager = SyncManager.getInstance();

    console.log('🔗 syncIntegration: Sync path decision check:', {
      hasGistId: Boolean(treeModel.gistId),
      gistIdValue: treeModel.gistId,
      forceCreate: Boolean(options?.forceCreate),
      willUpdate: Boolean(treeModel.gistId && !options?.forceCreate),
      willCreate: Boolean(!treeModel.gistId || options?.forceCreate)
    });

    if (treeModel.gistId && !options?.forceCreate) {
      console.log('🔗 syncIntegration: ✅ TAKING UPDATE PATH - Updating existing gist:', treeModel.gistId);
      console.log('🔗 syncIntegration: Model details for UPDATE:', {
        id: treeModel.id,
        gistId: treeModel.gistId,
        gistUrl: treeModel.gistUrl,
        version: treeModel.version,
        forceCreate: options?.forceCreate,
        requestId
      });
      await syncManager.enqueueSync('UPDATE', treeModel, treeModel.gistId);
    } else {
      console.log('🔗 syncIntegration: ➕ TAKING CREATE PATH - Creating new gist');
      console.log('🔗 syncIntegration: Reasons for CREATE:', {
        hasGistId: Boolean(treeModel.gistId),
        gistIdValue: treeModel.gistId,
        forceCreate: Boolean(options?.forceCreate),
        modelId: treeModel.id,
        modelVersion: treeModel.version,
        requestId
      });
      await syncManager.enqueueSync('CREATE', treeModel);
    }

    // Trigger immediate sync if online
    const status = syncManager.getStatus();
    console.log('🔗 syncIntegration: Sync manager status:', status);
    if (status.isOnline) {
      console.log(`🔗 syncIntegration: Triggering manual sync for request ${requestId}...`);
      await syncManager.manualSync();
    } else {
      console.log('⚠️ syncIntegration: Offline, sync queued for later');
    }

    const finalResult = { success: true, gistId: treeModel.gistId };
    console.log(`✅ syncIntegration: Sync completed for request ${requestId}, result:`, finalResult);
    return finalResult;
  } catch (error) {
    console.error(`❌ syncIntegration: Failed to sync tree to GitHub (request ${requestId}):`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown sync error'
    };
  } finally {
    // Always release the sync lock with the correct request ID
    releaseSyncLock(treeModel.id, requestId);
  }
};

/**
 * Loads a tree model from a GitHub Gist
 */
export const loadTreeFromGitHub = async (_gistId: string): Promise<{
  success: boolean;
  nodes?: NodeData[];
  model?: TreeModel;
  error?: string;
}> => {
  try {
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
    const existingModel = await getCurrentTreeModel();
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