import { NodeData } from '../types';

export interface TreeIndex {
  byId: Map<string, NodeData>;
  children: Map<string, NodeData[]>;
}

export interface CardSubtree {
  current: NodeData | undefined;
  kids: NodeData[];
  grandkids: NodeData[];
}

/**
 * Build an index of nodes for efficient lookups
 * O(N) complexity - runs once to avoid repeated tree walks
 */
export function buildIndex(nodes: NodeData[]): TreeIndex {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const children = new Map<string, NodeData[]>();
  
  for (const node of nodes) {
    if (node.parent) {
      const existing = children.get(node.parent) ?? [];
      children.set(node.parent, [...existing, node]);
    }
  }
  
  return { byId, children };
}

/**
 * Get the three-generation subtree for capability card display
 * Returns current node (Level N), its children (Level N+1), and grandchildren (Level N+2)
 */
export function getCardSubtree(index: TreeIndex, currentId: string): CardSubtree {
  const current = index.byId.get(currentId);
  const kids = index.children.get(currentId) ?? [];
  const grandkids = kids.flatMap(kid => index.children.get(kid.id) ?? []);
  
  return { current, kids, grandkids };
}

/**
 * Calculate responsive column count based on available width
 */
export function calculateColumns(width: number, minCardWidth: number = 200): number {
  return Math.max(1, Math.floor(width / minCardWidth));
}

/**
 * Calculate columns specifically for grandchildren (Level N+2) cards
 */
export function calculateGrandchildColumns(width: number, minCardWidth: number = 160): number {
  return Math.max(2, Math.floor(width / minCardWidth));
}
