import { 
  addToQueue, 
  getQueue, 
  clearQueue, 
  OfflineQueueItem, 
  saveData, 
  loadData 
} from './offlineStorage';
import { GitHubGistService, Gist } from '../services/githubGistService';
import { GitHubAuthService } from '../services/githubAuthService';
import { TreeModel } from '../types';

export interface SyncConflict {
  id: string;
  type: 'UPDATE_CONFLICT' | 'DELETE_CONFLICT' | 'CREATE_CONFLICT';
  localModel: TreeModel;
  remoteModel: TreeModel;
  localTimestamp: number;
  remoteTimestamp: number;
  localVersion: number;
  remoteVersion: number;
  description: string;
}

export interface SyncResult {
  success: boolean;
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'NO_CHANGE' | 'CONFLICT';
  gistId?: string;
  conflict?: SyncConflict;
  error?: string;
  attempts?: number;
}

export interface SyncQueueItem extends OfflineQueueItem {
  modelId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  model?: TreeModel;
  gistId?: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: number;
  pendingOperations: number;
  conflicts: SyncConflict[];
  lastError?: string;
}

export class SyncManager {
  private static instance: SyncManager;
  private syncInProgress = false;
  private status: SyncStatus = {
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingOperations: 0,
    conflicts: []
  };
  private listeners = new Set<(status: SyncStatus) => void>();
  private retryTimeouts = new Map<string, NodeJS.Timeout>();

  private constructor() {
    this.setupNetworkListeners();
    this.loadStoredConflicts();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.status.isOnline = true;
      this.notifyListeners();
      this.processPendingQueue();
    });

    window.addEventListener('offline', () => {
      this.status.isOnline = false;
      this.notifyListeners();
    });
  }

  private async loadStoredConflicts(): Promise<void> {
    try {
      const storedConflicts = await loadData('sync_conflicts');
      if (storedConflicts && Array.isArray(storedConflicts)) {
        this.status.conflicts = storedConflicts;
        this.notifyListeners();
      }
    } catch (error) {
      console.warn('Failed to load stored conflicts:', error);
    }
  }

  private async saveConflicts(): Promise<void> {
    try {
      await saveData('sync_conflicts', this.status.conflicts);
    } catch (error) {
      console.warn('Failed to save conflicts:', error);
    }
  }

  addListener(callback: (status: SyncStatus) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback({ ...this.status }));
  }

  getStatus(): SyncStatus {
    return { ...this.status };
  }

  async enqueueSync(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    model: TreeModel,
    gistId?: string
  ): Promise<void> {
    const item: SyncQueueItem = {
      type: 'SYNC',
      payload: { action, model, gistId },
      timestamp: Date.now(),
      modelId: model.id,
      action,
      model,
      gistId,
      retryCount: 0,
      maxRetries: 3
    };

    await addToQueue(item);
    this.updatePendingCount();
    
    if (this.status.isOnline && !this.syncInProgress) {
      this.processPendingQueue();
    }
  }

  private async updatePendingCount(): Promise<void> {
    try {
      const queue = await getQueue();
      this.status.pendingOperations = queue.length;
      this.notifyListeners();
    } catch (error) {
      console.warn('Failed to update pending count:', error);
    }
  }

  async processPendingQueue(): Promise<void> {
    if (this.syncInProgress || !this.status.isOnline) {
      return;
    }

    const authStatus = await GitHubAuthService.testConnection();
    if (!authStatus.isAuthenticated) {
      console.warn('Cannot sync: GitHub authentication required');
      return;
    }

    this.syncInProgress = true;
    this.status.isSyncing = true;
    this.status.lastError = undefined;
    this.notifyListeners();

    try {
      const queue = await getQueue();
      const syncItems = queue.filter(item => item.type === 'SYNC') as SyncQueueItem[];

      for (const item of syncItems) {
        try {
          const result = await this.processSyncItem(item);
          
          if (result.success) {
            await this.removeFromQueue(item);
          } else if (result.conflict) {
            await this.handleConflict(result.conflict);
            await this.removeFromQueue(item);
          } else if (item.retryCount < item.maxRetries) {
            await this.scheduleRetry(item);
          } else {
            console.error(`Max retries exceeded for sync item:`, item);
            await this.removeFromQueue(item);
          }
        } catch (error) {
          console.error('Error processing sync item:', error);
          if (item.retryCount < item.maxRetries) {
            await this.scheduleRetry(item);
          } else {
            await this.removeFromQueue(item);
          }
        }
      }

      this.status.lastSyncTime = Date.now();
    } catch (error) {
      console.error('Error processing sync queue:', error);
      this.status.lastError = error instanceof Error ? error.message : 'Unknown sync error';
    } finally {
      this.syncInProgress = false;
      this.status.isSyncing = false;
      await this.updatePendingCount();
      this.notifyListeners();
    }
  }

  private async processSyncItem(item: SyncQueueItem): Promise<SyncResult> {
    if (!item.model) {
      return { success: false, action: 'NO_CHANGE', error: 'No model data' };
    }

    try {
      switch (item.action) {
        case 'CREATE':
          return await this.createGist(item.model);
        case 'UPDATE':
          return await this.updateGist(item.model, item.gistId);
        case 'DELETE':
          return await this.deleteGist(item.gistId!);
        default:
          return { success: false, action: 'NO_CHANGE', error: 'Unknown action' };
      }
    } catch (error) {
      return { 
        success: false, 
        action: 'NO_CHANGE', 
        error: error instanceof Error ? error.message : 'Unknown error',
        attempts: item.retryCount + 1
      };
    }
  }

  private async createGist(model: TreeModel): Promise<SyncResult> {
    try {
      const gist = await GitHubGistService.createGist(model, model.isPublic);
      return {
        success: true,
        action: 'CREATED',
        gistId: gist.id
      };
    } catch (error) {
      return {
        success: false,
        action: 'NO_CHANGE',
        error: error instanceof Error ? error.message : 'Failed to create gist'
      };
    }
  }

  private async updateGist(model: TreeModel, gistId?: string): Promise<SyncResult> {
    if (!gistId) {
      return { success: false, action: 'NO_CHANGE', error: 'No gist ID provided' };
    }

    try {
      const existingGist = await GitHubGistService.getGist(gistId);
      const remoteModel = GitHubGistService.parseGistToModel(existingGist);

      if (remoteModel) {
        const conflict = this.detectConflict(model, remoteModel);
        if (conflict) {
          return {
            success: false,
            action: 'CONFLICT',
            conflict
          };
        }
      }

      const updatedGist = await GitHubGistService.updateGist(gistId, model, existingGist);
      return {
        success: true,
        action: 'UPDATED',
        gistId: updatedGist.id
      };
    } catch (error) {
      return {
        success: false,
        action: 'NO_CHANGE',
        error: error instanceof Error ? error.message : 'Failed to update gist'
      };
    }
  }

  private async deleteGist(gistId: string): Promise<SyncResult> {
    try {
      await GitHubGistService.deleteGist(gistId);
      return {
        success: true,
        action: 'DELETED'
      };
    } catch (error) {
      return {
        success: false,
        action: 'NO_CHANGE',
        error: error instanceof Error ? error.message : 'Failed to delete gist'
      };
    }
  }

  private detectConflict(localModel: TreeModel, remoteModel: TreeModel): SyncConflict | null {
    const localTime = localModel.lastModified.getTime();
    const remoteTime = remoteModel.lastModified.getTime();
    
    // If local is newer, no conflict
    if (localTime > remoteTime) {
      return null;
    }
    
    // If remote is newer and versions differ, we have a conflict
    if (remoteTime > localTime && localModel.version !== remoteModel.version) {
      return {
        id: `conflict_${localModel.id}_${Date.now()}`,
        type: 'UPDATE_CONFLICT',
        localModel,
        remoteModel,
        localTimestamp: localTime,
        remoteTimestamp: remoteTime,
        localVersion: localModel.version,
        remoteVersion: remoteModel.version,
        description: `Local model (v${localModel.version}) conflicts with remote model (v${remoteModel.version})`
      };
    }
    
    return null;
  }

  private async handleConflict(conflict: SyncConflict): Promise<void> {
    this.status.conflicts.push(conflict);
    await this.saveConflicts();
    this.notifyListeners();
  }

  async resolveConflict(
    conflictId: string, 
    resolution: 'USE_LOCAL' | 'USE_REMOTE' | 'MERGE'
  ): Promise<boolean> {
    const conflictIndex = this.status.conflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex === -1) {
      return false;
    }

    const conflict = this.status.conflicts[conflictIndex];
    
    try {
      switch (resolution) {
        case 'USE_LOCAL':
          await this.forceUpdateGist(conflict.localModel);
          break;
        case 'USE_REMOTE':
          // This would typically update the local model with remote data
          // Implementation depends on how local models are managed
          break;
        case 'MERGE':
          // Complex merge logic would go here
          // For now, default to local
          await this.forceUpdateGist(conflict.localModel);
          break;
      }

      this.status.conflicts.splice(conflictIndex, 1);
      await this.saveConflicts();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Failed to resolve conflict:', error);
      return false;
    }
  }

  private async forceUpdateGist(model: TreeModel): Promise<void> {
    if (!model.gistId) {
      throw new Error('Model has no gist ID');
    }

    const existingGist = await GitHubGistService.getGist(model.gistId);
    await GitHubGistService.updateGist(model.gistId, model, existingGist);
  }

  private async scheduleRetry(item: SyncQueueItem): Promise<void> {
    item.retryCount++;
    const delay = Math.min(1000 * Math.pow(2, item.retryCount), 30000); // Exponential backoff, max 30s
    
    // Cancel any existing retry for this item
    const timeoutKey = `${item.modelId}_${item.action}`;
    if (this.retryTimeouts.has(timeoutKey)) {
      clearTimeout(this.retryTimeouts.get(timeoutKey)!);
    }

    const timeout = setTimeout(() => {
      this.retryTimeouts.delete(timeoutKey);
      this.processPendingQueue();
    }, delay);

    this.retryTimeouts.set(timeoutKey, timeout);
  }

  private async removeFromQueue(item: SyncQueueItem): Promise<void> {
    try {
      const queue = await getQueue();
      const filteredQueue = queue.filter(queueItem => 
        !(queueItem.timestamp === item.timestamp && 
          queueItem.type === item.type &&
          JSON.stringify(queueItem.payload) === JSON.stringify(item.payload))
      );
      
      await clearQueue();
      for (const queueItem of filteredQueue) {
        await addToQueue(queueItem);
      }
    } catch (error) {
      console.error('Failed to remove item from queue:', error);
    }
  }

  async manualSync(): Promise<void> {
    if (this.status.isSyncing) {
      console.warn('Sync already in progress');
      return;
    }

    await this.processPendingQueue();
  }

  async clearAllConflicts(): Promise<void> {
    this.status.conflicts = [];
    await this.saveConflicts();
    this.notifyListeners();
  }

  getConflicts(): SyncConflict[] {
    return [...this.status.conflicts];
  }

  async getPendingOperations(): Promise<SyncQueueItem[]> {
    const queue = await getQueue();
    return queue.filter(item => item.type === 'SYNC') as SyncQueueItem[];
  }
}

// Legacy functions for backwards compatibility
export const enqueueChange = async (type: string, payload: any): Promise<void> => {
  const item: OfflineQueueItem = {
    type,
    payload,
    timestamp: Date.now()
  };
  await addToQueue(item);
};

export const drainQueue = async (): Promise<OfflineQueueItem[]> => {
  const items = await getQueue();
  await clearQueue();
  return items;
};
