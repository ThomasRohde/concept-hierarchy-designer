import { NodeData, TreeModel, PromptCollection } from '../types';
import { getRootNode } from './gistUtils';
import { loadData, saveData } from './offlineStorage';
import { syncEventSystem } from './syncEventSystem';

/**
 * Central utility for creating and managing TreeModel instances
 * This ensures consistent metadata handling across the application
 */

export interface CreateTreeModelOptions {
  name?: string;
  description?: string;
  preserveExisting?: boolean;
  gistId?: string;
  gistUrl?: string;
  isPublic?: boolean;
  forceNewId?: boolean;
}

/**
 * Creates or updates a TreeModel with consistent metadata handling
 * This is the single source of truth for TreeModel creation
 */
export const createOrUpdateTreeModel = async (
  nodes: NodeData[],
  prompts: PromptCollection,
  options: CreateTreeModelOptions = {}
): Promise<TreeModel> => {
  console.log('🏗️ createOrUpdateTreeModel: Creating/updating TreeModel...');
  console.log('🏗️ Input:', {
    nodeCount: nodes.length,
    promptCount: prompts.prompts.length,
    options,
    preserveExisting: options.preserveExisting
  });

  // Load existing model if preserving
  let existingModel: TreeModel | null = null;
  if (options.preserveExisting && !options.forceNewId) {
    try {
      existingModel = await loadData('currentTreeModel');
      console.log('🏗️ Found existing model:', {
        id: existingModel?.id,
        gistId: existingModel?.gistId,
        gistUrl: existingModel?.gistUrl,
        version: existingModel?.version
      });
    } catch (error) {
      console.log('🏗️ No existing model found or error loading:', error);
    }
  }

  // Check for persisted gist association if no existing model
  if (!existingModel && !options.forceNewId) {
    try {
      const gistAssociation = await loadData('gistAssociation');
      if (gistAssociation?.gistId) {
        console.log('🏗️ Found persisted gist association:', gistAssociation.gistId);
        
        // Try to reconstruct model metadata from gist
        const { GitHubGistService } = await import('../services/githubGistService');
        try {
          const existingGist = await GitHubGistService.getGist(gistAssociation.gistId);
          const remoteModel = GitHubGistService.parseGistToModel(existingGist);
          
          if (remoteModel) {
            console.log('🏗️ Reconstructed model from gist association');
            existingModel = remoteModel;
          }
        } catch (error) {
          console.warn('🏗️ Gist association invalid, clearing:', error);
          await saveData('gistAssociation', null);
        }
      }
    } catch (error) {
      console.warn('🏗️ Failed to check gist association:', error);
    }
  }

  const now = new Date();
  
  // Generate ID for new models or use existing
  const modelId = existingModel?.id || `tree_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine model name
  const rootNode = getRootNode(nodes);
  const modelName = options.name !== undefined 
    ? options.name 
    : (rootNode ? rootNode.name : (existingModel?.name || 'My Concept Hierarchy'));

  // Create the TreeModel with proper metadata handling
  const treeModel: TreeModel = {
    id: modelId,
    name: modelName,
    description: options.description !== undefined 
      ? options.description 
      : (existingModel?.description || 'A concept hierarchy created with the Themis app'),
    nodes: nodes,
    prompts: prompts,
    createdAt: existingModel?.createdAt || now,
    lastModified: now,
    version: (existingModel?.version || 0) + 1,
    
    // Gist metadata - prioritize options, then existing, then defaults
    gistId: options.gistId !== undefined ? options.gistId : existingModel?.gistId,
    gistUrl: options.gistUrl !== undefined ? options.gistUrl : existingModel?.gistUrl,
    
    // Other metadata
    category: existingModel?.category || 'personal',
    tags: existingModel?.tags || [],
    author: existingModel?.author,
    license: existingModel?.license || 'MIT',
    isPublic: options.isPublic !== undefined ? options.isPublic : (existingModel?.isPublic || false),
  };

  console.log('🏗️ Created TreeModel:', {
    id: treeModel.id,
    name: treeModel.name,
    nodeCount: treeModel.nodes.length,
    version: treeModel.version,
    gistId: treeModel.gistId,
    gistUrl: treeModel.gistUrl,
    isPublic: treeModel.isPublic
  });

  // Save the model
  await saveData('currentTreeModel', treeModel);
  console.log('🏗️ TreeModel saved to storage');

  return treeModel;
};

/**
 * Updates only the gist metadata of the current TreeModel
 * This is used after successful gist creation/update operations
 */
export const updateTreeModelGistMetadata = async (
  gistId: string,
  gistUrl: string,
  incrementVersion: boolean = true
): Promise<boolean> => {
  try {
    console.log('🔗 updateTreeModelGistMetadata:', { gistId, gistUrl, incrementVersion });
    
    const existingModel = await loadData('currentTreeModel');
    if (!existingModel) {
      console.warn('🔗 No existing TreeModel to update');
      return false;
    }

    const updatedModel: TreeModel = {
      ...existingModel,
      gistId,
      gistUrl,
      version: incrementVersion ? existingModel.version + 1 : existingModel.version,
      lastModified: new Date()
    };

    await saveData('currentTreeModel', updatedModel);
    
    // Also save gist association for persistence
    await saveData('gistAssociation', {
      gistId,
      gistUrl,
      timestamp: Date.now()
    });
    
    // Emit metadata updated event
    syncEventSystem.emit('METADATA_UPDATED', {
      modelId: updatedModel.id,
      gistId,
      gistUrl
    });

    console.log('🔗 Gist metadata updated successfully');
    return true;
  } catch (error) {
    console.error('🔗 Failed to update gist metadata:', error);
    return false;
  }
};

/**
 * Clears gist metadata from the current TreeModel
 * Used when a gist is deleted or becomes invalid
 */
export const clearTreeModelGistMetadata = async (): Promise<boolean> => {
  try {
    console.log('🗑️ clearTreeModelGistMetadata: Clearing gist metadata');
    
    const existingModel = await loadData('currentTreeModel');
    if (!existingModel) {
      console.warn('🗑️ No existing TreeModel to clear');
      return false;
    }

    const updatedModel: TreeModel = {
      ...existingModel,
      gistId: undefined,
      gistUrl: undefined,
      lastModified: new Date()
    };

    await saveData('currentTreeModel', updatedModel);
    await saveData('gistAssociation', null);

    console.log('🗑️ Gist metadata cleared successfully');
    return true;
  } catch (error) {
    console.error('🗑️ Failed to clear gist metadata:', error);
    return false;
  }
};

/**
 * Gets the current TreeModel with proper error handling
 */
export const getCurrentTreeModel = async (): Promise<TreeModel | null> => {
  try {
    const treeModel = await loadData('currentTreeModel');
    if (treeModel && typeof treeModel === 'object' && treeModel.id) {
      console.log('📖 getCurrentTreeModel: Retrieved TreeModel:', {
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
    console.error('📖 Error loading current TreeModel:', error);
    return null;
  }
};