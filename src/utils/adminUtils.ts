import { NodeData } from '../types';
import { toast } from 'react-hot-toast';

// Storage keys for tracking admin-related data
const MAGIC_WAND_STATS_KEY = 'magic-wand-stats';
const APP_ANALYTICS_KEY = 'app-analytics';

// Interfaces for admin statistics
export interface TreeStatistics {
  totalNodes: number;
  averageDepth: number;
  maxDepth: number;
  mostUsedLabels: Array<{ label: string; count: number }>;
  creationDates: Date[];
  storageUsage: number; // bytes
  lastModified: Date;
  magicWandUsage: {
    totalCalls: number;
    successRate: number;
    averageChildrenGenerated: number;
    lastUsed?: Date;
  };
}

export interface MagicWandStats {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalChildrenGenerated: number;
  lastUsed?: Date;
  averageChildrenPerCall: number;
}

export interface AppAnalytics {
  firstLaunch: Date;
  totalSessions: number;
  lastSessionStart: Date;
  featureUsage: {
    treeCreated: number;
    treeLoaded: number;
    treeSaved: number;
    nodesAdded: number;
    nodesDeleted: number;
    capabilityCardsOpened: number;
    exportUsed: number;
  };
}

/**
 * Calculate comprehensive tree statistics
 */
export const calculateTreeStatistics = (nodes: NodeData[]): TreeStatistics => {
  if (!nodes || nodes.length === 0) {
    return {
      totalNodes: 0,
      averageDepth: 0,
      maxDepth: 0,
      mostUsedLabels: [],
      creationDates: [],
      storageUsage: getStorageUsage(),
      lastModified: new Date(),
      magicWandUsage: {
        totalCalls: 0,
        successRate: 0,
        averageChildrenGenerated: 0,
      },
    };
  }

  // Calculate node depths
  const nodeDepths = nodes.map(node => calculateNodeDepth(node, nodes));
  const maxDepth = Math.max(...nodeDepths);
  const averageDepth = nodeDepths.reduce((sum, depth) => sum + depth, 0) / nodeDepths.length;

  // Find most used labels (node names)
  const labelCounts: { [key: string]: number } = {};
  nodes.forEach(node => {
    const words = node.name.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        labelCounts[word] = (labelCounts[word] || 0) + 1;
      }
    });
  });

  const mostUsedLabels = Object.entries(labelCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 9)
    .map(([label, count]) => ({ label, count }));

  // Get magic wand statistics
  const magicWandStats = getMagicWandStats();
  return {
    totalNodes: nodes.length,
    averageDepth: Math.round(averageDepth * 100) / 100,
    maxDepth,
    mostUsedLabels,
    creationDates: [new Date()], // Would need to track creation dates in the future
    storageUsage: getStorageUsage(),
    lastModified: new Date(),
    magicWandUsage: {
      totalCalls: magicWandStats.totalCalls,
      successRate: magicWandStats.totalCalls > 0 
        ? Math.round((magicWandStats.successfulCalls / magicWandStats.totalCalls) * 100) 
        : 0,
      averageChildrenGenerated: magicWandStats.averageChildrenPerCall,
      lastUsed: magicWandStats.lastUsed,
    },
  };
};

/**
 * Calculate the depth of a specific node in the tree
 */
const calculateNodeDepth = (node: NodeData, allNodes: NodeData[]): number => {
  let depth = 0;
  let currentNode = node;

  while (currentNode.parent !== null) {
    const parentNode = allNodes.find(n => n.id === currentNode.parent);
    if (!parentNode) break;
    currentNode = parentNode;
    depth++;
  }

  return depth;
};

/**
 * Get current localStorage usage in bytes
 */
const getStorageUsage = (): number => {
  let totalBytes = 0;
  
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key);
        if (value) {
          totalBytes += key.length + value.length;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating storage usage:', error);
  }

  return totalBytes;
};

/**
 * Get magic wand usage statistics
 */
export const getMagicWandStats = (): MagicWandStats => {
  try {
    const stored = localStorage.getItem(MAGIC_WAND_STATS_KEY);
    if (stored) {
      const stats = JSON.parse(stored);
      return {
        ...stats,
        lastUsed: stats.lastUsed ? new Date(stats.lastUsed) : undefined,
        averageChildrenPerCall: stats.totalCalls > 0 
          ? Math.round((stats.totalChildrenGenerated / stats.totalCalls) * 100) / 100
          : 0,
      };
    }
  } catch (error) {
    console.error('Error loading magic wand stats:', error);
  }

  return {
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    totalChildrenGenerated: 0,
    averageChildrenPerCall: 0,
  };
};

/**
 * Update magic wand statistics
 */
export const updateMagicWandStats = (success: boolean, childrenGenerated: number = 0): void => {
  try {
    const currentStats = getMagicWandStats();
    const updatedStats = {
      totalCalls: currentStats.totalCalls + 1,
      successfulCalls: success ? currentStats.successfulCalls + 1 : currentStats.successfulCalls,
      failedCalls: success ? currentStats.failedCalls : currentStats.failedCalls + 1,
      totalChildrenGenerated: currentStats.totalChildrenGenerated + childrenGenerated,
      lastUsed: new Date().toISOString(),
    };

    localStorage.setItem(MAGIC_WAND_STATS_KEY, JSON.stringify(updatedStats));
  } catch (error) {
    console.error('Error updating magic wand stats:', error);
  }
};

/**
 * Get app analytics data
 */
export const getAppAnalytics = (): AppAnalytics => {
  try {
    const stored = localStorage.getItem(APP_ANALYTICS_KEY);
    if (stored) {
      const analytics = JSON.parse(stored);
      return {
        ...analytics,
        firstLaunch: new Date(analytics.firstLaunch),
        lastSessionStart: new Date(analytics.lastSessionStart),
      };
    }
  } catch (error) {
    console.error('Error loading app analytics:', error);
  }

  // Initialize with default values
  const defaultAnalytics: AppAnalytics = {
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

  // Save the default analytics
  try {
    localStorage.setItem(APP_ANALYTICS_KEY, JSON.stringify({
      ...defaultAnalytics,
      firstLaunch: defaultAnalytics.firstLaunch.toISOString(),
      lastSessionStart: defaultAnalytics.lastSessionStart.toISOString(),
    }));
  } catch (error) {
    console.error('Error saving default analytics:', error);
  }

  return defaultAnalytics;
};

/**
 * Update app analytics for feature usage
 */
export const trackFeatureUsage = (feature: keyof AppAnalytics['featureUsage']): void => {
  try {
    const analytics = getAppAnalytics();
    analytics.featureUsage[feature]++;
    
    localStorage.setItem(APP_ANALYTICS_KEY, JSON.stringify({
      ...analytics,
      firstLaunch: analytics.firstLaunch.toISOString(),
      lastSessionStart: analytics.lastSessionStart.toISOString(),
    }));
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
};

/**
 * Perform a hard reset of all application data
 */
export const performHardReset = async (options: {
  preserveSettings?: boolean;
  createBackup?: boolean;
}): Promise<boolean> => {
  try {
    const { preserveSettings = false, createBackup = true } = options;

    // Create backup if requested
    if (createBackup) {
      await createDataBackup();
    }

    // Get all localStorage keys
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        // Remove concept hierarchy related keys
        if (key.includes('concept-hierarchy') || key.includes('magic-wand')) {
          if (!preserveSettings || !key.includes('settings')) {
            keysToRemove.push(key);
          }
        }
      }
    }

    // Remove the keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });

    toast.success('Hard reset completed successfully');
    return true;
  } catch (error) {
    console.error('Error performing hard reset:', error);
    toast.error('Failed to perform hard reset');
    return false;
  }
};

/**
 * Create a backup of all application data
 */
export const createDataBackup = async (): Promise<void> => {
  try {
    const backupData: { [key: string]: string } = {};
    
    // Collect all concept hierarchy related data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('concept-hierarchy') || key.includes('magic-wand'))) {
        const value = localStorage.getItem(key);
        if (value) {
          backupData[key] = value;
        }
      }
    }

    // Add metadata
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      data: backupData,
    };

    // Download as JSON file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `concept-hierarchy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Backup created successfully');
  } catch (error) {
    console.error('Error creating backup:', error);
    toast.error('Failed to create backup');
  }
};

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format number with commas
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};
