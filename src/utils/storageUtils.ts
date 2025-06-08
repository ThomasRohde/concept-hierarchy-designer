import { NodeData, TreeModel, PromptCollection } from '../types';
import { toast } from 'react-hot-toast';
import { saveData, loadData, DB_NAME, DB_VERSION } from './offlineStorage';
import { openDB } from 'idb';

// Storage key names
const STORAGE_KEY = 'concept-hierarchy-data';
const COLLAPSED_NODES_KEY = 'concept-hierarchy-collapsed-nodes';
const LAST_SAVED_KEY = 'concept-hierarchy-last-saved';



/**
 * Saves nodes while preserving existing TreeModel metadata (including gist ID)
 * @param nodes The concept hierarchy nodes to save
 * @returns boolean indicating success
 */
export const saveTreeToLocalStorage = async (nodes: NodeData[]): Promise<boolean> => {
  if (!nodes || nodes.length === 0) {
    console.warn('Attempted to save empty or null nodes array');
    return false;
  }

  try {
    const timestamp = new Date().toISOString();
    
    // Load existing TreeModel to preserve gist metadata
    let existingModel: TreeModel | null = null;
    try {
      existingModel = await loadData('currentTreeModel');
      console.log('🔄 saveTreeToLocalStorage: Preserving gist metadata from existing model:', {
        gistId: existingModel?.gistId,
        gistUrl: existingModel?.gistUrl,
        version: existingModel?.version
      });
    } catch (error) {
      console.log('🔄 saveTreeToLocalStorage: No existing TreeModel found, creating new one');
    }

    // Get current prompts
    let prompts: PromptCollection = { prompts: [], activePromptId: null };
    try {
      const storedPrompts = await loadData('promptCollection');
      if (storedPrompts) {
        prompts = storedPrompts;
      }
    } catch (error) {
      console.warn('Could not load prompts, using default:', error);
    }

    // Create/update TreeModel with preserved gist metadata
    const now = new Date();
    const modelId = existingModel?.id || `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const treeModel: TreeModel = {
      id: modelId,
      name: existingModel?.name || 'My Concept Hierarchy',
      description: existingModel?.description || 'A concept hierarchy created with the Concept Hierarchy Designer',
      nodes: nodes,
      prompts: prompts,
      createdAt: existingModel?.createdAt || now,
      lastModified: now,
      version: (existingModel?.version || 0) + 1,
      // CRITICAL: Preserve gist metadata
      gistId: existingModel?.gistId,
      gistUrl: existingModel?.gistUrl,
      category: existingModel?.category || 'personal',
      tags: existingModel?.tags || [],
      author: existingModel?.author,
      license: existingModel?.license || 'MIT',
      isPublic: existingModel?.isPublic || false,
    };

    console.log('🔄 saveTreeToLocalStorage: Saving TreeModel with preserved gist metadata:', {
      id: treeModel.id,
      gistId: treeModel.gistId,
      gistUrl: treeModel.gistUrl,
      nodeCount: treeModel.nodes.length,
      version: treeModel.version
    });

    // Save both legacy format and TreeModel format
    await saveData(STORAGE_KEY, nodes); // Legacy compatibility
    await saveData('currentTreeModel', treeModel); // Primary TreeModel storage
    await saveData(LAST_SAVED_KEY, timestamp);
    
    return true;
  } catch (error) {
    console.error('Error saving tree data:', error);
    
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      toast.error('Storage limit exceeded. Your concept model is too large for browser storage.');
    }
    
    return false;
  }
};

/**
 * Saves the collapsed nodes state to IndexedDB
 * @param collapsedNodes Set of collapsed node IDs
 * @returns Promise resolving to boolean indicating success
 */
export const saveCollapsedNodesToLocalStorage = async (collapsedNodes: Set<string>): Promise<boolean> => {
  try {
    const collapsedArray = [...collapsedNodes];
    await saveData(COLLAPSED_NODES_KEY, collapsedArray);
    return true;
  } catch (error) {
    console.error('Error saving collapsed nodes:', error);
    return false;
  }
};

/**
 * Loads the concept hierarchy tree from IndexedDB, preferring TreeModel data
 * @returns The stored concept hierarchy nodes, or null if none exists
 */
export const loadTreeFromLocalStorage = async (): Promise<NodeData[] | null> => {
  try {
    // First try to load from TreeModel (primary source with gist metadata)
    try {
      const treeModel = await loadData('currentTreeModel');
      if (treeModel && treeModel.nodes && Array.isArray(treeModel.nodes) && treeModel.nodes.length > 0) {
        console.log('🔄 loadTreeFromLocalStorage: Loaded nodes from TreeModel with gist metadata:', {
          gistId: treeModel.gistId,
          gistUrl: treeModel.gistUrl,
          nodeCount: treeModel.nodes.length,
          version: treeModel.version
        });
        
        const isValid = treeModel.nodes.every((node: any) => 
          node &&
          typeof node === 'object' &&
          typeof node.id === 'string' &&
          typeof node.name === 'string' &&
          typeof node.description === 'string' &&
          (node.parent === null || typeof node.parent === 'string')
        );
        
        if (isValid) {
          return treeModel.nodes;
        }
      }
    } catch (error) {
      console.log('🔄 loadTreeFromLocalStorage: No TreeModel found, falling back to legacy storage');
    }

    // Fallback to legacy storage format
    const data = await loadData(STORAGE_KEY);
    
    if (data && Array.isArray(data) && data.length > 0) {
      console.log('🔄 loadTreeFromLocalStorage: Loaded nodes from legacy storage');
      
      // Validate the data structure
      const isValid = data.every(node => 
        node &&
        typeof node === 'object' &&
        typeof node.id === 'string' &&
        typeof node.name === 'string' &&
        typeof node.description === 'string' &&
        (node.parent === null || typeof node.parent === 'string')
      );
      
      if (isValid) {
        return data;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error loading tree data:', error);
    return null;
  }
};

/**
 * Loads the collapsed nodes state from IndexedDB
 * @returns Promise resolving to Set of collapsed node IDs, or empty set if none exists
 */
export const loadCollapsedNodesFromLocalStorage = async (): Promise<Set<string>> => {
  try {
    const data = await loadData(COLLAPSED_NODES_KEY);
    
    if (data && Array.isArray(data) && data.every(id => typeof id === 'string')) {
      return new Set<string>(data);
    }
    return new Set<string>();
  } catch (error) {
    console.error('Error loading collapsed nodes:', error);
    return new Set<string>();
  }
};

/**
 * Get the timestamp of the last successful save
 * @returns Promise resolving to ISO timestamp string or null if no save exists
 */
export const getLastSavedTimestamp = async (): Promise<string | null> => {
  try {
    const timestamp = await loadData(LAST_SAVED_KEY);
    if (timestamp && typeof timestamp === 'string') {
      return timestamp;
    }
    return null;
  } catch (error) {
    console.error('Error getting last saved timestamp:', error);
    return null;
  }
};

/**
 * Clear all saved concept hierarchy data from IndexedDB
 */
export const clearSavedData = async (): Promise<void> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction('data', 'readwrite');
    await tx.store.delete(STORAGE_KEY);
    await tx.store.delete(COLLAPSED_NODES_KEY);
    await tx.store.delete(LAST_SAVED_KEY);
    await tx.store.delete('currentTreeModel'); // Also clear TreeModel data
    await tx.done;
  } catch (error) {
    console.error('Error clearing saved data:', error);
  }
};

/**
 * Get the current TreeModel with all metadata (including gist ID)
 * @returns Promise resolving to TreeModel or null if none exists
 */
export const getCurrentTreeModel = async (): Promise<TreeModel | null> => {
  try {
    const treeModel = await loadData('currentTreeModel');
    if (treeModel && typeof treeModel === 'object' && treeModel.id) {
      console.log('🔄 getCurrentTreeModel: Retrieved TreeModel with gist metadata:', {
        id: treeModel.id,
        gistId: treeModel.gistId,
        gistUrl: treeModel.gistUrl,
        version: treeModel.version,
        nodeCount: treeModel.nodes?.length
      });
      return treeModel;
    }
    return null;
  } catch (error) {
    console.error('Error loading current TreeModel:', error);
    return null;
  }
};

/**
 * Update TreeModel metadata without changing nodes
 * @param updates Partial TreeModel data to update
 * @returns Promise resolving to boolean indicating success
 */
export const updateTreeModelMetadata = async (updates: Partial<TreeModel>): Promise<boolean> => {
  try {
    const existingModel = await getCurrentTreeModel();
    if (!existingModel) {
      console.warn('Cannot update TreeModel metadata: no existing model found');
      return false;
    }

    const updatedModel: TreeModel = {
      ...existingModel,
      ...updates,
      lastModified: new Date(), // Always update timestamp
    };

    console.log('🔄 updateTreeModelMetadata: Updating metadata:', {
      id: updatedModel.id,
      gistId: updatedModel.gistId,
      gistUrl: updatedModel.gistUrl,
      version: updatedModel.version
    });

    await saveData('currentTreeModel', updatedModel);
    return true;
  } catch (error) {
    console.error('Error updating TreeModel metadata:', error);
    return false;
  }
};

/**
 * Track feature usage for analytics
 */
export const trackFeatureUsage = (feature: string): void => {
  try {
    const analytics = getAppAnalytics();
    if (analytics.featureUsage[feature] !== undefined) {
      analytics.featureUsage[feature]++;
      saveAppAnalytics(analytics);
    }
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
};

/**
 * Get app analytics data
 */
export const getAppAnalytics = (): any => {
  try {
    const stored = localStorage.getItem('app-analytics');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading app analytics:', error);
  }

  return {
    firstLaunch: new Date(),
    totalSessions: 1,
    lastSessionStart: new Date(),
    featureUsage: {
      treeCreated: 0,
      treeLoaded: 0,
      treeSaved: 0,
      nodesAdded: 0,
      nodesDeleted: 0,
      capabilityCardsOpened: 0,
      exportUsed: 0,
    },
  };
};

/**
 * Save app analytics data
 */
export const saveAppAnalytics = (analytics: any): void => {
  try {
    localStorage.setItem('app-analytics', JSON.stringify(analytics));
  } catch (error) {
    console.error('Error saving app analytics:', error);
  }
};
