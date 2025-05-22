import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import { NodeData } from '../types';
import NodeRow from './NodeRow';

interface VirtualizedTreeProps {
  nodes: NodeData[];
  collapsed: Set<string>;
  nodeRowProps: any;
  height: number;
  width: number;
}

const VirtualizedTree: React.FC<VirtualizedTreeProps> = ({ 
  nodes, 
  collapsed, 
  nodeRowProps,
  height,
  width
}) => {  // Flatten the tree structure for virtualization
  const flattenedTree = useMemo(() => {
    const flattened: { node: NodeData; depth: number; isCollapsed: boolean; hasChildren: boolean }[] = [];
    
    // Create a node map for faster lookup
    const nodeMap = new Map<string, boolean>();
    nodes.forEach(node => {
      // Pre-calculate which nodes have children
      const hasChildren = nodes.some(n => n.parent === node.id);
      nodeMap.set(node.id, hasChildren);
    });
    
    const processNode = (parentId: string | null, depth: number) => {
      const children = nodes.filter(node => node.parent === parentId);
      
      children.forEach(node => {
        const hasChildren = nodeMap.get(node.id) || false;
        const isCollapsed = collapsed.has(node.id);
        
        flattened.push({ node, depth, isCollapsed, hasChildren });
        
        if (!isCollapsed && hasChildren) {
          processNode(node.id, depth + 1);
        }
      });
    };
    
    processNode(null, 0);
    return flattened;
  }, [nodes, collapsed]);
  
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const { node, depth, isCollapsed, hasChildren } = flattenedTree[index];
    
    return (
      <div style={style}>
        <NodeRow
          key={node.id}
          node={node}
          depth={depth}
          isCollapsed={isCollapsed}
          hasChildren={hasChildren}
          {...nodeRowProps}
        />
      </div>
    );
  };
    return (    <List
      height={height}
      width={width}      itemCount={flattenedTree.length}
      itemSize={44} // 40px (h-10 on small screens) + 4px (mb-1) margin
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
    >
      {Row}
    </List>
  );
};

export default React.memo(VirtualizedTree);
