/**
 * Event system for sync operations to enable reactive UI updates
 * This ensures components refresh their state after sync operations complete
 */

export type SyncEventType = 
  | 'SYNC_STARTED'
  | 'SYNC_COMPLETED'
  | 'SYNC_ERROR'
  | 'GIST_CREATED'
  | 'GIST_UPDATED'
  | 'GIST_DELETED'
  | 'MODEL_LOADED'
  | 'METADATA_UPDATED';

export interface SyncEventData {
  type: SyncEventType;
  modelId?: string;
  gistId?: string;
  gistUrl?: string;
  error?: string;
  timestamp: number;
  requestId?: string;
}

class SyncEventSystem {
  private listeners: Map<SyncEventType, Set<(data: SyncEventData) => void>> = new Map();
  private allListeners: Set<(data: SyncEventData) => void> = new Set();

  /**
   * Subscribe to specific sync event types
   */
  on(eventType: SyncEventType, callback: (data: SyncEventData) => void): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    this.listeners.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(eventType);
        }
      }
    };
  }

  /**
   * Subscribe to all sync events
   */
  onAll(callback: (data: SyncEventData) => void): () => void {
    this.allListeners.add(callback);
    
    return () => {
      this.allListeners.delete(callback);
    };
  }

  /**
   * Emit a sync event
   */
  emit(eventType: SyncEventType, data: Partial<SyncEventData> = {}): void {
    const eventData: SyncEventData = {
      type: eventType,
      timestamp: Date.now(),
      ...data
    };

    console.log(`🔔 SyncEvent: ${eventType}`, eventData);

    // Notify specific listeners
    const typeListeners = this.listeners.get(eventType);
    if (typeListeners) {
      typeListeners.forEach(callback => {
        try {
          callback(eventData);
        } catch (error) {
          console.error(`Error in sync event listener for ${eventType}:`, error);
        }
      });
    }

    // Notify all-event listeners
    this.allListeners.forEach(callback => {
      try {
        callback(eventData);
      } catch (error) {
        console.error(`Error in sync all-event listener:`, error);
      }
    });
  }

  /**
   * Remove all listeners (useful for cleanup)
   */
  removeAllListeners(): void {
    this.listeners.clear();
    this.allListeners.clear();
  }

  /**
   * Get current listener counts for debugging
   */
  getListenerCounts(): Record<string, number> {
    const counts: Record<string, number> = {
      'ALL_EVENTS': this.allListeners.size
    };

    this.listeners.forEach((listeners, eventType) => {
      counts[eventType] = listeners.size;
    });

    return counts;
  }
}

// Export singleton instance
export const syncEventSystem = new SyncEventSystem();

/**
 * Helper hook-like function for React components to use sync events
 */
export const createSyncEventListener = () => {
  return {
    onSyncCompleted: (callback: (data: SyncEventData) => void) => 
      syncEventSystem.on('SYNC_COMPLETED', callback),
    
    onGistCreated: (callback: (data: SyncEventData) => void) => 
      syncEventSystem.on('GIST_CREATED', callback),
    
    onGistUpdated: (callback: (data: SyncEventData) => void) => 
      syncEventSystem.on('GIST_UPDATED', callback),
    
    onModelLoaded: (callback: (data: SyncEventData) => void) => 
      syncEventSystem.on('MODEL_LOADED', callback),
    
    onMetadataUpdated: (callback: (data: SyncEventData) => void) => 
      syncEventSystem.on('METADATA_UPDATED', callback),
    
    onAnySync: (callback: (data: SyncEventData) => void) => 
      syncEventSystem.onAll(callback)
  };
};