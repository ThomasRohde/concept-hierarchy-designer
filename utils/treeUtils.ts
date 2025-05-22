import { NodeData } from '../types';

export const genId = (): string => Math.random().toString(36).substring(2, 15);

export const walkTree = (node: NodeData, callback: (node: NodeData) => void): void => {
  callback(node);
  if (node.children) {
    for (const child of node.children) {
      walkTree(child, callback);
    }
  }
};

interface FindNodeResult {
  node: NodeData;
  parent: NodeData | null;
}

export const findNode = (currentTree: NodeData, id: string, parent: NodeData | null = null): FindNodeResult | null => {
  if (currentTree.id === id) {
    return { node: currentTree, parent };
  }
  if (currentTree.children) {
    for (const child of currentTree.children) {
      const found = findNode(child, id, currentTree);
      if (found) {
        return found;
      }
    }
  }
  return null;
};