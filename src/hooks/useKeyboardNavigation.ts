import { useCallback, useEffect, useRef, useState } from 'react';
import { NodeData } from '../types';

interface UseKeyboardNavigationProps {
  nodes: NodeData[];
  collapsed: Set<string>;
  onToggleCollapse: (nodeId: string) => void;
  onSelectNode?: (nodeId: string) => void;
  onEditNode?: (node: NodeData) => void;
}

interface UseKeyboardNavigationReturn {
  focusedNodeId: string | null;
  setFocusedNodeId: (nodeId: string | null) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
  focusedNodeRef: React.RefObject<HTMLElement | null>;
}

export const useKeyboardNavigation = ({
  nodes,
  collapsed,
  onToggleCollapse,
  onSelectNode,
  onEditNode
}: UseKeyboardNavigationProps): UseKeyboardNavigationReturn => {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const focusedNodeRef = useRef<HTMLElement | null>(null);
  // Get visible nodes in the order they appear in the tree
  const getVisibleNodes = useCallback((): NodeData[] => {
    try {
      const visible: NodeData[] = [];      const processNode = (parentId: string | null, depth: number) => {
        const children = nodes
          .filter(node => node && node.parent === parentId);

        children.forEach(node => {
          if (node && node.id) {
            visible.push(node);
            
            // If not collapsed and has children, add children
            if (!collapsed.has(node.id)) {
              processNode(node.id, depth + 1);
            }
          }
        });
      };

      processNode(null, 0);
      return visible;
    } catch (error) {
      console.error('Error in getVisibleNodes:', error);
      return [];
    }
  }, [nodes, collapsed]);
  // Navigate to the next/previous visible node
  const navigateNode = useCallback((direction: 'up' | 'down') => {
    try {
      const visibleNodes = getVisibleNodes();
      
      if (!visibleNodes || visibleNodes.length === 0) return;

      // If no node is focused, focus the first node
      if (!focusedNodeId) {
        setFocusedNodeId(visibleNodes[0].id);
        onSelectNode?.(visibleNodes[0].id);
        return;
      }

      const currentIndex = visibleNodes.findIndex(node => node.id === focusedNodeId);
      
      if (currentIndex === -1) {
        // Current focused node is not visible, focus the first visible one
        setFocusedNodeId(visibleNodes[0].id);
        onSelectNode?.(visibleNodes[0].id);
        return;
      }

      let newIndex: number;
      if (direction === 'down') {
        newIndex = Math.min(currentIndex + 1, visibleNodes.length - 1);
      } else {
        newIndex = Math.max(currentIndex - 1, 0);
      }      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < visibleNodes.length) {
        const newNodeId = visibleNodes[newIndex]?.id;
        if (newNodeId) {
          setFocusedNodeId(newNodeId);
          onSelectNode?.(newNodeId);
        }
      }
    } catch (error) {
      console.error('Error in navigateNode:', error);
    }
  }, [focusedNodeId, getVisibleNodes, onSelectNode]);
  // Handle keyboard events
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle navigation if no input elements are focused
    const activeElement = document.activeElement;
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true' ||
      activeElement.closest('[role="dialog"]') // Skip if inside modal
    )) {
      return;
    }

    console.log('Key pressed:', event.key, 'focusedNodeId:', focusedNodeId);    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        navigateNode('up');
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        navigateNode('down');
        break;
      
      case 'ArrowLeft':
        if (focusedNodeId) {
          const focusedNode = nodes.find(n => n.id === focusedNodeId);
          if (focusedNode) {
            const hasChildren = nodes.some(n => n.parent === focusedNodeId);
            const isCollapsed = collapsed.has(focusedNodeId);
            
            if (hasChildren && !isCollapsed) {
              // Collapse the node
              event.preventDefault();
              onToggleCollapse(focusedNodeId);
            } else if (focusedNode.parent) {
              // Move to parent node
              event.preventDefault();
              setFocusedNodeId(focusedNode.parent);
              onSelectNode?.(focusedNode.parent);
            }
          }
        }
        break;
      
      case 'ArrowRight':
        if (focusedNodeId) {
          const hasChildren = nodes.some(n => n.parent === focusedNodeId);
          const isCollapsed = collapsed.has(focusedNodeId);
          
          if (hasChildren && isCollapsed) {
            // Expand the node
            event.preventDefault();
            onToggleCollapse(focusedNodeId);
          } else if (hasChildren && !isCollapsed) {
            // Move to first child
            event.preventDefault();
            const firstChild = nodes.find(n => n.parent === focusedNodeId);
            if (firstChild) {
              setFocusedNodeId(firstChild.id);
              onSelectNode?.(firstChild.id);
            }
          }
        }
        break;
      
      case 'Home':
        event.preventDefault();
        const visibleNodes = getVisibleNodes();
        if (visibleNodes.length > 0) {
          setFocusedNodeId(visibleNodes[0].id);
          onSelectNode?.(visibleNodes[0].id);
        }
        break;
        case 'End':
        event.preventDefault();
        const visibleNodesEnd = getVisibleNodes();
        if (visibleNodesEnd.length > 0) {
          const lastNode = visibleNodesEnd[visibleNodesEnd.length - 1];
          setFocusedNodeId(lastNode.id);
          onSelectNode?.(lastNode.id);
        }
        break;
      
      case 'Enter':
        if (focusedNodeId && onEditNode) {
          event.preventDefault();
          const focusedNode = nodes.find(n => n.id === focusedNodeId);
          if (focusedNode) {
            onEditNode(focusedNode);
          }
        }
        break;
    }
  }, [focusedNodeId, nodes, collapsed, navigateNode, onToggleCollapse, onSelectNode, onEditNode, getVisibleNodes]);

  // Set up global keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);  // Initialize focus to the first node if none is set - REMOVED to start with no selection
  // useEffect(() => {
  //   if (!focusedNodeId && nodes.length > 0) {
  //     try {
  //       const visible: NodeData[] = [];
  //         const processNode = (parentId: string | null) => {
  //         const children = nodes
  //           .filter(node => node && node.parent === parentId);

  //         children.forEach(node => {
  //           if (node && node.id) {
  //             visible.push(node);
  //             if (!collapsed.has(node.id)) {
  //               processNode(node.id);
  //             }
  //           }
  //         });
  //       };

  //       processNode(null);
        
  //       if (visible.length > 0) {
  //         setFocusedNodeId(visible[0].id);
  //       }
  //     } catch (error) {
  //       console.error('Error initializing focus:', error);
  //     }
  //   }
  // }, [focusedNodeId, nodes, collapsed]);

  // Attach keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return {
    focusedNodeId,
    setFocusedNodeId,
    handleKeyDown,
    focusedNodeRef
  };
};
