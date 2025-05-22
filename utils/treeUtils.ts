import { NodeData } from '../types';

export const genId = (): string => Math.random().toString(36).substring(2, 15);

// Get all nodes in the flat structure
export const getAllNodes = (nodes: NodeData[]): NodeData[] => {
  return nodes;
};

// Get all children of a specific node in the flat structure
export const getChildren = (nodes: NodeData[], parentId: string | null): NodeData[] => {
  return nodes.filter(node => node.parent === parentId);
};

// Get the parent of a specific node
export const getParent = (nodes: NodeData[], childId: string): NodeData | null => {
  const child = nodes.find(node => node.id === childId);
  if (!child || child.parent === null) return null;
  return nodes.find(node => node.id === child.parent) || null;
};

interface FindNodeResult {
  node: NodeData;
  parent: NodeData | null;
}

// Find a node and its parent
export const findNode = (nodes: NodeData[], id: string): FindNodeResult | null => {
  const node = nodes.find(node => node.id === id);
  if (!node) return null;
  
  const parent = node.parent ? nodes.find(n => n.id === node.parent) || null : null;
  return { node, parent };
};