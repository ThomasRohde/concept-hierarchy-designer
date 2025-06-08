import { NodeData, TreeModel } from '../types';
import { SyncConflict } from './syncManager';

export interface ConflictDiff {
  field: string;
  path: string;
  localValue: any;
  remoteValue: any;
  type: 'ADDED' | 'MODIFIED' | 'DELETED';
}

export interface NodeConflict {
  nodeId: string;
  nodeName: string;
  type: 'ADDED' | 'MODIFIED' | 'DELETED';
  localNode?: NodeData;
  remoteNode?: NodeData;
  diffs: ConflictDiff[];
}

export interface ModelConflictAnalysis {
  metadataDiffs: ConflictDiff[];
  nodeConflicts: NodeConflict[];
  promptConflicts: ConflictDiff[];
  summary: {
    totalConflicts: number;
    nodesAdded: number;
    nodesModified: number;
    nodesDeleted: number;
    metadataChanges: number;
    promptChanges: number;
  };
}

export class ConflictResolver {
  static analyzeConflict(conflict: SyncConflict): ModelConflictAnalysis {
    const { localModel, remoteModel } = conflict;
    
    const metadataDiffs = this.compareMetadata(localModel, remoteModel);
    const nodeConflicts = this.compareNodes(localModel.nodes, remoteModel.nodes);
    const promptConflicts = this.comparePrompts(localModel, remoteModel);
    
    const summary = {
      totalConflicts: metadataDiffs.length + nodeConflicts.length + promptConflicts.length,
      nodesAdded: nodeConflicts.filter(nc => nc.type === 'ADDED').length,
      nodesModified: nodeConflicts.filter(nc => nc.type === 'MODIFIED').length,
      nodesDeleted: nodeConflicts.filter(nc => nc.type === 'DELETED').length,
      metadataChanges: metadataDiffs.length,
      promptChanges: promptConflicts.length
    };
    
    return {
      metadataDiffs,
      nodeConflicts,
      promptConflicts,
      summary
    };
  }

  private static compareMetadata(local: TreeModel, remote: TreeModel): ConflictDiff[] {
    const diffs: ConflictDiff[] = [];
    
    const metadataFields = [
      'name', 'description', 'category', 'tags', 'author', 'license', 'isPublic'
    ] as const;
    
    for (const field of metadataFields) {
      const localValue = local[field];
      const remoteValue = remote[field];
      
      if (JSON.stringify(localValue) !== JSON.stringify(remoteValue)) {
        diffs.push({
          field,
          path: `model.${field}`,
          localValue,
          remoteValue,
          type: this.getDiffType(localValue, remoteValue)
        });
      }
    }
    
    return diffs;
  }

  private static compareNodes(localNodes: NodeData[], remoteNodes: NodeData[]): NodeConflict[] {
    const conflicts: NodeConflict[] = [];
    
    const localNodeMap = new Map(localNodes.map(node => [node.id, node]));
    const remoteNodeMap = new Map(remoteNodes.map(node => [node.id, node]));
    
    // Check for added and modified nodes
    for (const [nodeId, remoteNode] of remoteNodeMap) {
      const localNode = localNodeMap.get(nodeId);
      
      if (!localNode) {
        // Node added in remote
        conflicts.push({
          nodeId,
          nodeName: remoteNode.name,
          type: 'ADDED',
          remoteNode,
          diffs: [{
            field: 'entire_node',
            path: `nodes[${nodeId}]`,
            localValue: undefined,
            remoteValue: remoteNode,
            type: 'ADDED'
          }]
        });
      } else {
        // Check for modifications
        const nodeDiffs = this.compareNodeData(localNode, remoteNode);
        if (nodeDiffs.length > 0) {
          conflicts.push({
            nodeId,
            nodeName: localNode.name || remoteNode.name,
            type: 'MODIFIED',
            localNode,
            remoteNode,
            diffs: nodeDiffs
          });
        }
      }
    }
    
    // Check for deleted nodes
    for (const [nodeId, localNode] of localNodeMap) {
      if (!remoteNodeMap.has(nodeId)) {
        conflicts.push({
          nodeId,
          nodeName: localNode.name,
          type: 'DELETED',
          localNode,
          diffs: [{
            field: 'entire_node',
            path: `nodes[${nodeId}]`,
            localValue: localNode,
            remoteValue: undefined,
            type: 'DELETED'
          }]
        });
      }
    }
    
    return conflicts;
  }

  private static compareNodeData(local: NodeData, remote: NodeData): ConflictDiff[] {
    const diffs: ConflictDiff[] = [];
    
    const nodeFields = ['name', 'description', 'parent'] as const;
    
    for (const field of nodeFields) {
      const localValue = local[field];
      const remoteValue = remote[field];
      
      if (localValue !== remoteValue) {
        diffs.push({
          field,
          path: `nodes[${local.id}].${field}`,
          localValue,
          remoteValue,
          type: this.getDiffType(localValue, remoteValue)
        });
      }
    }
    
    return diffs;
  }

  private static comparePrompts(local: TreeModel, remote: TreeModel): ConflictDiff[] {
    const diffs: ConflictDiff[] = [];
    
    // Compare active prompt ID
    if (local.prompts.activePromptId !== remote.prompts.activePromptId) {
      diffs.push({
        field: 'activePromptId',
        path: 'prompts.activePromptId',
        localValue: local.prompts.activePromptId,
        remoteValue: remote.prompts.activePromptId,
        type: this.getDiffType(local.prompts.activePromptId, remote.prompts.activePromptId)
      });
    }
    
    // Compare prompt collections
    const localPromptMap = new Map(local.prompts.prompts.map(p => [p.id, p]));
    const remotePromptMap = new Map(remote.prompts.prompts.map(p => [p.id, p]));
    
    // Check for prompt differences
    for (const [promptId, remotePrompt] of remotePromptMap) {
      const localPrompt = localPromptMap.get(promptId);
      
      if (!localPrompt) {
        diffs.push({
          field: 'prompt',
          path: `prompts.prompts[${promptId}]`,
          localValue: undefined,
          remoteValue: remotePrompt,
          type: 'ADDED'
        });
      } else if (JSON.stringify(localPrompt) !== JSON.stringify(remotePrompt)) {
        diffs.push({
          field: 'prompt',
          path: `prompts.prompts[${promptId}]`,
          localValue: localPrompt,
          remoteValue: remotePrompt,
          type: 'MODIFIED'
        });
      }
    }
    
    // Check for deleted prompts
    for (const [promptId, localPrompt] of localPromptMap) {
      if (!remotePromptMap.has(promptId)) {
        diffs.push({
          field: 'prompt',
          path: `prompts.prompts[${promptId}]`,
          localValue: localPrompt,
          remoteValue: undefined,
          type: 'DELETED'
        });
      }
    }
    
    return diffs;
  }

  private static getDiffType(localValue: any, remoteValue: any): 'ADDED' | 'MODIFIED' | 'DELETED' {
    if (localValue === undefined || localValue === null) {
      return 'ADDED';
    }
    if (remoteValue === undefined || remoteValue === null) {
      return 'DELETED';
    }
    return 'MODIFIED';
  }

  static mergeModels(
    conflict: SyncConflict,
    resolutions: Record<string, 'LOCAL' | 'REMOTE' | 'CUSTOM'>
  ): TreeModel {
    const { localModel, remoteModel } = conflict;
    const analysis = this.analyzeConflict(conflict);
    
    // Start with local model as base
    const mergedModel: TreeModel = {
      ...localModel,
      version: Math.max(localModel.version, remoteModel.version) + 1,
      lastModified: new Date()
    };
    
    // Apply metadata resolutions
    for (const diff of analysis.metadataDiffs) {
      const resolution = resolutions[diff.path];
      if (resolution === 'REMOTE') {
        (mergedModel as any)[diff.field] = diff.remoteValue;
      }
      // LOCAL is default (already in mergedModel)
      // CUSTOM would require additional logic
    }
    
    // Apply node resolutions
    const mergedNodes = new Map(localModel.nodes.map(node => [node.id, { ...node }]));
    
    for (const nodeConflict of analysis.nodeConflicts) {
      const resolution = resolutions[`node_${nodeConflict.nodeId}`];
      
      switch (nodeConflict.type) {
        case 'ADDED':
          if (resolution === 'REMOTE' && nodeConflict.remoteNode) {
            mergedNodes.set(nodeConflict.nodeId, { ...nodeConflict.remoteNode });
          }
          break;
        case 'DELETED':
          if (resolution === 'REMOTE') {
            mergedNodes.delete(nodeConflict.nodeId);
          }
          break;
        case 'MODIFIED':
          if (resolution === 'REMOTE' && nodeConflict.remoteNode) {
            mergedNodes.set(nodeConflict.nodeId, { ...nodeConflict.remoteNode });
          } else if (resolution === 'LOCAL' && nodeConflict.localNode) {
            // Already in mergedNodes
          }
          // Field-level merging could be implemented here for CUSTOM resolution
          break;
      }
    }
    
    mergedModel.nodes = Array.from(mergedNodes.values());
    
    // Apply prompt resolutions
    const mergedPrompts = { ...localModel.prompts };
    const localPromptMap = new Map(localModel.prompts.prompts.map(p => [p.id, { ...p }]));
    
    for (const diff of analysis.promptConflicts) {
      const resolution = resolutions[diff.path];
      
      if (diff.field === 'activePromptId' && resolution === 'REMOTE') {
        mergedPrompts.activePromptId = diff.remoteValue;
      } else if (diff.field === 'prompt') {
        const promptId = diff.path.match(/prompts\.prompts\[([^\]]+)\]/)?.[1];
        if (promptId) {
          if (resolution === 'REMOTE') {
            if (diff.type === 'DELETED') {
              localPromptMap.delete(promptId);
            } else {
              localPromptMap.set(promptId, { ...diff.remoteValue });
            }
          }
          // LOCAL is default (already in localPromptMap)
        }
      }
    }
    
    mergedPrompts.prompts = Array.from(localPromptMap.values());
    mergedModel.prompts = mergedPrompts;
    
    return mergedModel;
  }

  static createAutoResolution(analysis: ModelConflictAnalysis): Record<string, 'LOCAL' | 'REMOTE'> {
    const resolutions: Record<string, 'LOCAL' | 'REMOTE'> = {};
    
    // Auto-resolve metadata conflicts (prefer remote for public info)
    for (const diff of analysis.metadataDiffs) {
      if (['name', 'description', 'category', 'tags'].includes(diff.field)) {
        resolutions[diff.path] = 'REMOTE';
      } else {
        resolutions[diff.path] = 'LOCAL';
      }
    }
    
    // Auto-resolve node conflicts (prefer additions, careful with deletions)
    for (const nodeConflict of analysis.nodeConflicts) {
      switch (nodeConflict.type) {
        case 'ADDED':
          resolutions[`node_${nodeConflict.nodeId}`] = 'REMOTE';
          break;
        case 'DELETED':
          resolutions[`node_${nodeConflict.nodeId}`] = 'LOCAL'; // Prefer keeping nodes
          break;
        case 'MODIFIED':
          resolutions[`node_${nodeConflict.nodeId}`] = 'REMOTE'; // Prefer remote changes
          break;
      }
    }
    
    // Auto-resolve prompt conflicts (prefer local prompt setup)
    for (const diff of analysis.promptConflicts) {
      resolutions[diff.path] = 'LOCAL';
    }
    
    return resolutions;
  }
}