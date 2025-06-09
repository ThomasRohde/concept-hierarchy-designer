import { TreeModel, NodeData, PromptCollection } from '../types';
import { GitHubGistService, Gist } from './githubGistService';
import { generateModelId } from '../utils/gistUtils';
import { saveData, loadData } from '../utils/offlineStorage';

export interface SyncedModel extends TreeModel {
  syncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncedAt?: Date;
  syncError?: string;
}

export interface ModelSyncResult {
  success: boolean;
  model?: SyncedModel;
  error?: string;
  conflictData?: {
    local: TreeModel;
    remote: TreeModel;
  };
}

export interface ModelListItem {
  id: string;
  name: string;
  description?: string;
  lastModified: Date;
  nodeCount: number;
  gistId?: string;
  gistUrl?: string;
  syncStatus: 'synced' | 'local_only' | 'remote_only' | 'conflict';
}

const LOCAL_MODELS_KEY = 'local_models';

export class ModelSyncService {
  /**
   * Creates a new TreeModel with sync capabilities
   */
  static createModel(
    name: string, 
    description?: string,
    initialNodes: NodeData[] = [],
    initialPrompts: PromptCollection = { prompts: [], activePromptId: null }
  ): TreeModel {
    const now = new Date();
    
    return {
      id: generateModelId(),
      name,
      description,
      nodes: initialNodes,
      prompts: initialPrompts,
      createdAt: now,
      lastModified: now,
      version: 1
    };
  }

  /**
   * Saves a model locally
   */
  static async saveModelLocally(model: TreeModel): Promise<void> {
    const models = await this.getLocalModels();
    const existingIndex = models.findIndex(m => m.id === model.id);
    
    const updatedModel = {
      ...model,
      lastModified: new Date(),
      version: existingIndex >= 0 ? models[existingIndex].version + 1 : model.version
    };

    if (existingIndex >= 0) {
      models[existingIndex] = updatedModel;
    } else {
      models.push(updatedModel);
    }

    await saveData(LOCAL_MODELS_KEY, models);
  }

  /**
   * Gets all locally stored models
   */
  static async getLocalModels(): Promise<TreeModel[]> {
    try {
      const models = await loadData(LOCAL_MODELS_KEY);
      return models || [];
    } catch (error) {
      console.warn('Failed to load local models:', error);
      return [];
    }
  }

  /**
   * Gets a specific local model by ID
   */
  static async getLocalModel(id: string): Promise<TreeModel | null> {
    const models = await this.getLocalModels();
    return models.find(m => m.id === id) || null;
  }

  /**
   * Deletes a model locally
   */
  static async deleteLocalModel(id: string): Promise<void> {
    const models = await this.getLocalModels();
    const filteredModels = models.filter(m => m.id !== id);
    await saveData(LOCAL_MODELS_KEY, filteredModels);
  }

  /**
   * Syncs a model to GitHub Gist (create or update)
   */
  static async syncModelToGist(model: TreeModel, isPublic: boolean = false): Promise<ModelSyncResult> {
    try {
      let gist: Gist;
      
      if (model.gistId) {
        // Update existing Gist
        const existingGist = await GitHubGistService.getGist(model.gistId);
        gist = await GitHubGistService.updateGist(model.gistId, model, existingGist);
      } else {
        // Create new Gist
        gist = await GitHubGistService.createGist(model, isPublic);
      }

      const syncedModel: SyncedModel = {
        ...model,
        gistId: gist.id,
        gistUrl: gist.html_url,
        syncStatus: 'synced',
        lastSyncedAt: new Date()
      };

      // Save updated model locally
      await this.saveModelLocally(syncedModel);

      return {
        success: true,
        model: syncedModel
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown sync error';
      
      const errorModel: SyncedModel = {
        ...model,
        syncStatus: 'error',
        syncError: errorMessage
      };

      return {
        success: false,
        model: errorModel,
        error: errorMessage
      };
    }
  }

  /**
   * Loads a model from GitHub Gist
   */
  static async loadModelFromGist(gistId: string): Promise<ModelSyncResult> {
    try {
      const gist = await GitHubGistService.getGist(gistId);
      const model = GitHubGistService.parseGistToModel(gist);

      if (!model) {
        return {
          success: false,
          error: 'Failed to parse Gist content as TreeModel'
        };
      }

      // Check for local version conflict
      const localModel = await this.getLocalModel(model.id);
      if (localModel && localModel.lastModified > model.lastModified) {
        return {
          success: false,
          error: 'Conflict detected',
          conflictData: {
            local: localModel,
            remote: model
          }
        };
      }

      const syncedModel: SyncedModel = {
        ...model,
        syncStatus: 'synced',
        lastSyncedAt: new Date()
      };

      // Save loaded model locally
      await this.saveModelLocally(syncedModel);

      return {
        success: true,
        model: syncedModel
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load from Gist'
      };
    }
  }

  /**
   * Deletes a model from both local storage and GitHub Gist
   */
  static async deleteModel(model: TreeModel): Promise<ModelSyncResult> {
    try {
      // Delete from Gist if it exists
      if (model.gistId) {
        await GitHubGistService.deleteGist(model.gistId);
      }

      // Delete locally
      await this.deleteLocalModel(model.id);

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete model'
      };
    }
  }

  /**
   * Lists all available models (local + remote)
   */
  static async listAllModels(): Promise<ModelListItem[]> {
    const results: ModelListItem[] = [];
    const processedIds = new Set<string>();

    try {
      // Get local models
      const localModels = await this.getLocalModels();
      for (const model of localModels) {
        results.push({
          id: model.id,
          name: model.name,
          description: model.description,
          lastModified: model.lastModified,
          nodeCount: model.nodes.length,
          gistId: model.gistId,
          gistUrl: model.gistUrl,
          syncStatus: model.gistId ? 'synced' : 'local_only'
        });
        processedIds.add(model.id);
      }

      // Get remote models (Gists)
      const remoteGists = await GitHubGistService.listConceptHierarchyGists();
      for (const gist of remoteGists) {
        const model = GitHubGistService.parseGistToModel(gist);
        if (model && !processedIds.has(model.id)) {
          results.push({
            id: model.id,
            name: model.name,
            description: model.description,
            lastModified: model.lastModified,
            nodeCount: model.nodes.length,
            gistId: gist.id,
            gistUrl: gist.html_url,
            syncStatus: 'remote_only'
          });
          processedIds.add(model.id);
        }
      }
    } catch (error) {
      console.warn('Failed to list remote models:', error);
      // Continue with local models only
    }

    // Sort by last modified date (newest first)
    return results.sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }

  /**
   * Searches models by name or description
   */
  static async searchModels(query: string): Promise<ModelListItem[]> {
    const allModels = await this.listAllModels();
    const lowercaseQuery = query.toLowerCase();

    return allModels.filter(model => 
      model.name.toLowerCase().includes(lowercaseQuery) ||
      (model.description && model.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  /**
   * Resolves a conflict by choosing local or remote version
   */
  static async resolveConflict(
    modelId: string, 
    resolution: 'local' | 'remote'
  ): Promise<ModelSyncResult> {
    try {
      const localModel = await this.getLocalModel(modelId);
      if (!localModel) {
        return {
          success: false,
          error: 'Local model not found'
        };
      }

      if (resolution === 'local') {
        // Push local version to remote
        return this.syncModelToGist(localModel);
      } else {
        // Pull remote version to local
        if (!localModel.gistId) {
          return {
            success: false,
            error: 'No remote Gist ID available'
          };
        }
        return this.loadModelFromGist(localModel.gistId);
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to resolve conflict'
      };
    }
  }

  /**
   * Checks sync status for all local models
   */
  static async checkSyncStatus(): Promise<Record<string, 'synced' | 'pending' | 'conflict' | 'error'>> {
    const status: Record<string, 'synced' | 'pending' | 'conflict' | 'error'> = {};
    const localModels = await this.getLocalModels();

    for (const model of localModels) {
      if (!model.gistId) {
        status[model.id] = 'pending';
        continue;
      }

      try {
        const gist = await GitHubGistService.getGist(model.gistId);
        const remoteModel = GitHubGistService.parseGistToModel(gist);

        if (!remoteModel) {
          status[model.id] = 'error';
          continue;
        }

        if (model.lastModified > remoteModel.lastModified) {
          status[model.id] = 'pending';
        } else if (model.lastModified < remoteModel.lastModified) {
          status[model.id] = 'conflict';
        } else {
          status[model.id] = 'synced';
        }
      } catch (error) {
        status[model.id] = 'error';
      }
    }

    return status;
  }
}