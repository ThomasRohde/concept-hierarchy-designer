// filepath: c:\Users\E29667\GitHub\concept-hierarchy-designer\App.tsx
import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Toaster, toast } from 'react-hot-toast';
import AddChildModal from './components/AddChildModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import EditNodeModal from './components/EditNodeModal';
import LoadTreeButton from './components/LoadTreeButton';
import NewTreeButton from './components/NewTreeButton';
import NewTreeModal from './components/NewTreeModal';
import NodeRow, { NodeRowProps } from './components/NodeRow';
import SaveTreeButton from './components/SaveTreeButton';
import TreeControls from './components/TreeControls';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import { useClipboardActions } from './hooks/useClipboardActions';
import { useMagicWand } from './hooks/useMagicWand';
import { NodeData } from './types';
import { saveTreeAsJson, validateNodeData } from './utils/exportUtils';
import { genId } from './utils/treeUtils';

// Create initial data in the flat structure
const createInitialData = (): NodeData[] => {
  const rootId = genId();
  const quantum = genId();
  const theories = genId();
  const applications = genId();
  const wave = genId();
  const superposition = genId();
  const mechanics = genId();
  const string = genId();
  const relativity = genId();

  return [
    {
      id: rootId,
      name: "Root Concept",
      description: "The main starting point of the hierarchy.",
      parent: null
    },
    {
      id: quantum,
      name: "Introduction to Quantum Physics",
      description: "Fundamental concepts of quantum mechanics.",
      parent: rootId
    },
    {
      id: theories,
      name: "Key Theories",
      description: "Major theories underpinning the field.",
      parent: rootId
    },
    {
      id: applications,
      name: "Applications",
      description: "Practical uses of these concepts.",
      parent: rootId
    },
    {
      id: wave,
      name: "Wave-Particle Duality",
      description: "Exhibiting both wave and particle properties.",
      parent: quantum
    },
    {
      id: superposition,
      name: "Quantum Superposition",
      description: "Ability to be in multiple states at once.",
      parent: quantum
    },
    {
      id: mechanics,
      name: "Quantum Mechanics",
      description: "Describes physical phenomena at nanoscopic scales.",
      parent: theories
    },
    {
      id: string,
      name: "String Theory (Overview)",
      description: "A theoretical framework where point-like particles are replaced by one-dimensional strings.",
      parent: theories
    },
    {
      id: relativity,
      name: "General Relativity (Brief)",
      description: "Einstein's theory of gravitation.",
      parent: theories
    }
  ];
};

// Function to render nodes recursively in the flat structure
const renderTreeRecursive = (
  nodes: NodeData[],
  parentId: string | null,
  depth: number,
  collapsedSet: Set<string>,
  nodeRowProps: Omit<React.ComponentProps<typeof NodeRow>, 'node' | 'depth' | 'isCollapsed' | 'hasChildren'> 
): React.ReactNode[] => {
  const elements: React.ReactNode[] = [];
  
  // Get children of the current parent node
  const children = nodes.filter(node => node.parent === parentId);
  
  // Render each child
  children.forEach(node => {
    const isCollapsed = collapsedSet.has(node.id);
    const hasChildren = nodes.some(n => n.parent === node.id);
    
    // Add the node row
    elements.push(
      <NodeRow
        key={node.id}
        node={node}
        depth={depth}
        isCollapsed={isCollapsed}
        hasChildren={hasChildren}
        {...nodeRowProps}
      />
    );
    
    // If not collapsed and has children, recursively render its children
    if (!isCollapsed && hasChildren) {
      elements.push(
        ...renderTreeRecursive(nodes, node.id, depth + 1, collapsedSet, nodeRowProps)
      );
    }
  });
  
  return elements;
};

export default function App() {
  const [nodes, setNodes] = useState<NodeData[]>(createInitialData());
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [addingChildToParentNode, setAddingChildToParentNode] = useState<NodeData | null>(null);

  const [isNewTreeModalOpen, setIsNewTreeModalOpen] = useState(false);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<{id: string, name: string} | null>(null);

  const [isEditNodeModalOpen, setIsEditNodeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<NodeData | null>(null);

  const { copyToClipboard, pasteAsChild } = useClipboardActions({ setNodes, setCollapsed });
  const { generateMagicWandPrompt } = useMagicWand({ nodes });
  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      
      if (next.has(id)) {
        // Expanding a node - remove it from collapsed set
        next.delete(id);
        
        // But ensure all its direct children are collapsed (only expand one level)
        const directChildren = nodes.filter(node => node.parent === id);
        directChildren.forEach(child => {
          next.add(child.id);
        });
      } else {
        // Collapsing a node - add it to collapsed set
        next.add(id);
      }
      
      return next;
    });
  }, [nodes]);

  const moveNode = useCallback((dragId: string, dropTargetId: string) => {
    if (dragId === dropTargetId) return;
    
    // Function to check if a node is a descendant of another node
    const isDescendant = (ancestorId: string, nodeId: string): boolean => {
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return false;
      if (node.parent === ancestorId) return true;
      if (node.parent === null) return false;
      return isDescendant(ancestorId, node.parent);
    };
    
    // Check if drop target is a descendant of the drag node
    if (isDescendant(dragId, dropTargetId)) {
      toast.error("Cannot move a node to its own descendant");
      return;
    }
    
    // Update the parent of the dragged node
    setNodes(currentNodes => {
      return currentNodes.map(node => {
        if (node.id === dragId) {
          return { ...node, parent: dropTargetId };
        }
        return node;
      });
    });
    
    // Auto-expand the drop target
    setCollapsed(prev => {
      const next = new Set(prev);
      next.delete(dropTargetId);
      return next;
    });
  }, [nodes]);

  const openAddChildModal = useCallback((parentNode: NodeData) => {
    setAddingChildToParentNode(parentNode);
    setIsAddChildModalOpen(true);
  }, []);

  const handleCloseAddChildModal = useCallback(() => {
    setIsAddChildModalOpen(false);
    setAddingChildToParentNode(null);
  }, []);

  const handleSaveNewChild = useCallback((name: string, description: string) => {
    if (!addingChildToParentNode) return;

    // Create a new node with the parent reference
    const newNode: NodeData = {
      id: genId(),
      name,
      description,
      parent: addingChildToParentNode.id
    };
    
    // Add the new node to the nodes array
    setNodes(currentNodes => [...currentNodes, newNode]);

    // Ensure parent node is expanded
    setCollapsed(prev => {
      const next = new Set(prev);
      next.delete(addingChildToParentNode.id);
      return next;
    });
    
    handleCloseAddChildModal();
  }, [addingChildToParentNode, handleCloseAddChildModal]);

  const openDeleteConfirmationModal = useCallback((nodeId: string) => {
    // Check if it's the root node (has null parent)
    const isRoot = nodes.some(node => node.id === nodeId && node.parent === null);
    if (isRoot) {
      toast.error("Cannot delete the root node.");
      return;
    }
    
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setNodeToDelete({id: nodeId, name: node.name});
      setIsConfirmDeleteModalOpen(true);
    }
  }, [nodes]);

  const handleCloseConfirmDeleteModal = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    setNodeToDelete(null);
  }, []);
  
  const executeDeleteNode = useCallback(() => {
    if (!nodeToDelete) return;
    
    // Function to get all descendant IDs of a node
    const getAllDescendantIds = (nodeId: string): string[] => {
      const directChildren = nodes.filter(n => n.parent === nodeId);
      let allDescendants: string[] = [nodeId];
      
      directChildren.forEach(child => {
        allDescendants = [...allDescendants, ...getAllDescendantIds(child.id)];
      });
      
      return allDescendants;
    };
    
    // Get all nodes to delete (the node and all its descendants)
    const nodeIdsToDelete = getAllDescendantIds(nodeToDelete.id);
    
    // Remove all these nodes from the nodes array
    setNodes(currentNodes => 
      currentNodes.filter(node => !nodeIdsToDelete.includes(node.id))
    );
    
    handleCloseConfirmDeleteModal();
  }, [nodeToDelete, handleCloseConfirmDeleteModal, nodes]);

  const handleOpenNewTreeModal = useCallback(() => {
    setIsNewTreeModalOpen(true);
  }, []);

  const handleCloseNewTreeModal = useCallback(() => {
    setIsNewTreeModalOpen(false);
  }, []);

  const handleCreateNewTree = useCallback((name: string, description: string) => {
    // Create a single root node with no parent
    const newRoot: NodeData = {
      id: genId(),
      name,
      description,
      parent: null
    };
    
    // Replace all existing nodes with just this root node
    setNodes([newRoot]);
    setCollapsed(new Set());
    handleCloseNewTreeModal();
  }, [handleCloseNewTreeModal]);
  
  const handleLoadTree = useCallback((loadedData: any) => {
    if (validateNodeData(loadedData)) {
      setNodes(loadedData);
      setCollapsed(new Set());
      toast.success("Tree loaded successfully");
    } else {
      toast.error("Invalid tree data format");
    }
  }, []);

  // Edit Node Modal Handlers
  const handleOpenEditNodeModal = useCallback((node: NodeData) => {
    setEditingNode(node);
    setIsEditNodeModalOpen(true);
  }, []);

  const handleCloseEditNodeModal = useCallback(() => {
    setIsEditNodeModalOpen(false);
    setEditingNode(null);
  }, []);

  const handleSaveEditedNode = useCallback((nodeId: string, newName: string, newDescription: string) => {
    setNodes(currentNodes => {
      return currentNodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, name: newName, description: newDescription };
        }
        return node;
      });
    });
    handleCloseEditNodeModal();
  }, [handleCloseEditNodeModal]);

  // Expand and collapse all handlers
  const handleExpandAll = useCallback(() => {
    // Create a new set where only nodes that have grandchildren are collapsed
    const nodesWithGrandchildren = new Set<string>();
    
    // First, identify all nodes with children
    const nodesWithChildren = nodes
      .filter(node => nodes.some(n => n.parent === node.id))
      .map(node => node.id);
      
    // For each node with children, check if any of its children also have children
    nodesWithChildren.forEach(nodeId => {
      const childrenIds = nodes
        .filter(node => node.parent === nodeId)
        .map(child => child.id);
        
      // If any child has children, add those children to the collapsed set
      childrenIds.forEach(childId => {
        if (nodes.some(n => n.parent === childId)) {
          nodesWithGrandchildren.add(childId);
        }
      });
    });
    
    setCollapsed(nodesWithGrandchildren);
  }, [nodes]);

  const handleCollapseAll = useCallback(() => {
    // Get the IDs of all nodes that have children
    const nodesWithChildren = nodes
      .filter(node => nodes.some(n => n.parent === node.id))
      .map(node => node.id);
    
    // Add all of these IDs to the collapsed set
    setCollapsed(new Set(nodesWithChildren));
  }, [nodes]);

  // Function to handle clipboard operations
  const handleCopyToClipboard = useCallback((node: NodeData) => {
    copyToClipboard(node, nodes);
  }, [copyToClipboard, nodes]);

  const nodeRowProps: Omit<NodeRowProps, 'node' | 'depth' | 'isCollapsed' | 'hasChildren'> = {
    toggleCollapse,
    moveNode,
    onAddNewChild: openAddChildModal, 
    onCopyToClipboard: handleCopyToClipboard, 
    onPasteAsChild: pasteAsChild,     
    onMagicWand: generateMagicWandPrompt,           
    onDeleteNode: openDeleteConfirmationModal,
    onEditNode: handleOpenEditNodeModal,
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen py-8 px-4 flex flex-col items-center bg-gray-100 text-gray-900">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Card className="w-full max-w-3xl shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">Concept Hierarchy Designer</CardTitle>
              <div className="flex items-center space-x-2">
                <NewTreeButton onClick={handleOpenNewTreeModal} />
                <SaveTreeButton 
                  onSave={(fileName) => {
                    saveTreeAsJson(nodes, fileName || 'concept-hierarchy');
                    toast.success("Concept hierarchy saved as JSON");
                  }} 
                />
                <LoadTreeButton onLoad={handleLoadTree} />
              </div>
            </div>          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <div className="p-2 space-y-0.5">
              <div className="mb-2">
                <TreeControls 
                  onExpandAll={handleExpandAll} 
                  onCollapseAll={handleCollapseAll}
                />
              </div>
              <AnimatePresence>
                {renderTreeRecursive(nodes, null, 0, collapsed, nodeRowProps)}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Drag & drop to re-organize. Hover over nodes for actions.</p>
          <p>Powered by React, Tailwind CSS, Framer Motion. Clipboard actions use system clipboard.</p>
        </footer>

        <AddChildModal
          isOpen={isAddChildModalOpen}
          onClose={handleCloseAddChildModal}
          onSave={handleSaveNewChild}
          parentNodeName={addingChildToParentNode?.name}
        />
        <NewTreeModal
          isOpen={isNewTreeModalOpen}
          onClose={handleCloseNewTreeModal}
          onSave={handleCreateNewTree}
        />
        <ConfirmDeleteModal
          isOpen={isConfirmDeleteModalOpen}
          onClose={handleCloseConfirmDeleteModal}
          onConfirm={executeDeleteNode}
          nodeName={nodeToDelete?.name}
        />
        <EditNodeModal 
          isOpen={isEditNodeModalOpen}
          onClose={handleCloseEditNodeModal}
          onSave={handleSaveEditedNode}
          nodeToEdit={editingNode}
        />
      </div>
    </DndProvider>
  );
}
