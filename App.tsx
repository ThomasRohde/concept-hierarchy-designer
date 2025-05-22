import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/Card';
import NodeRow, { NodeRowProps } from './components/NodeRow';
import AddChildModal from './components/AddChildModal';
import NewTreeModal from './components/NewTreeModal';
import NewTreeButton from './components/NewTreeButton';
import SaveTreeButton from './components/SaveTreeButton';
import LoadTreeButton from './components/LoadTreeButton';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import EditNodeModal from './components/EditNodeModal';
import { NodeData } from './types';
import { genId, findNode } from './utils/treeUtils';
import { saveTreeAsJson, validateNodeData } from './utils/exportUtils';
import { useClipboardActions } from './hooks/useClipboardActions';
import { useMagicWand } from './hooks/useMagicWand';


const initialTreeData: NodeData = {
  id: genId(),
  label: "Root Concept",
  description: "The main starting point of the hierarchy.",
  children: [
    { 
      id: genId(), 
      label: "Introduction to Quantum Physics", 
      description: "Fundamental concepts of quantum mechanics.",
      children: [
        { id: genId(), label: "Wave-Particle Duality", description: "Exhibiting both wave and particle properties.", children: [] },
        { id: genId(), label: "Quantum Superposition", description: "Ability to be in multiple states at once.", children: [] },
      ] 
    },
    {
      id: genId(),
      label: "Key Theories",
      description: "Major theories underpinning the field.",
      children: [
        { id: genId(), label: "Quantum Mechanics", description: "Describes physical phenomena at nanoscopic scales.", children: [] },
        { id: genId(), label: "String Theory (Overview)", description: "A theoretical framework where point-like particles are replaced by one-dimensional strings.", children: [] },
        { id: genId(), label: "General Relativity (Brief)", description: "Einstein's theory of gravitation.", children: [] },
      ],
    },
    { id: genId(), label: "Applications", description: "Practical uses of these concepts.", children: [] },
  ],
};

const renderTreeRecursive = (
  rootNode: NodeData,
  depth: number,
  collapsedSet: Set<string>,
  nodeRowProps: Omit<React.ComponentProps<typeof NodeRow>, 'node' | 'depth' | 'isCollapsed'> 
): React.ReactNode[] => {
  const isCollapsed = collapsedSet.has(rootNode.id);
  const elements: React.ReactNode[] = [
    <NodeRow
      key={rootNode.id}
      node={rootNode}
      depth={depth}
      isCollapsed={isCollapsed}
      {...nodeRowProps}
    />,
  ];

  if (!isCollapsed && rootNode.children) {
    rootNode.children.forEach((childNode) => {
      elements.push(
        ...renderTreeRecursive(childNode, depth + 1, collapsedSet, nodeRowProps)
      );
    });
  }
  return elements;
};


export default function App() {
  const [tree, setTree] = useState<NodeData>(initialTreeData);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
  const [addingChildToParentNode, setAddingChildToParentNode] = useState<NodeData | null>(null);

  const [isNewTreeModalOpen, setIsNewTreeModalOpen] = useState(false);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState<{id: string, label: string} | null>(null);

  const [isEditNodeModalOpen, setIsEditNodeModalOpen] = useState(false); // State for Edit Modal
  const [editingNode, setEditingNode] = useState<NodeData | null>(null); // State for node being edited


  const { copyToClipboard, pasteAsChild } = useClipboardActions({ setTree, setCollapsed });
  const { generateMagicWandPrompt } = useMagicWand({ tree });

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const moveNode = useCallback((dragId: string, dropTargetId: string) => {
    setTree((currentTree) => {
      if (dragId === dropTargetId) return currentTree;

      const newTree = JSON.parse(JSON.stringify(currentTree)) as NodeData;
      
      const dragInfo = findNode(newTree, dragId);
      const dropInfo = findNode(newTree, dropTargetId);

      if (!dragInfo || !dropInfo) return currentTree;

      let tempParent = dropInfo.parent;
      while(tempParent) {
        if (tempParent.id === dragInfo.node.id) return currentTree; 
        const found = findNode(newTree, tempParent.id); 
        tempParent = found ? found.parent : null;
      }

      if (dragInfo.parent) {
        dragInfo.parent.children = dragInfo.parent.children.filter(
          (child) => child.id !== dragId
        );
      } else { 
        return currentTree;
      }
      
      dropInfo.node.children = dropInfo.node.children || [];
      dropInfo.node.children.push(dragInfo.node);
      
      setCollapsed(prev => {
          const next = new Set(prev);
          next.delete(dropInfo.node.id); 
          return next;
      });

      return newTree;
    });
  }, []);

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

    setTree((currentTree) => {
      const newTree = JSON.parse(JSON.stringify(currentTree)) as NodeData;
      const targetParentInfo = findNode(newTree, addingChildToParentNode.id);
      if (targetParentInfo && targetParentInfo.node) {
        const targetParent = targetParentInfo.node;
        targetParent.children = targetParent.children || [];
        targetParent.children.push({ 
          id: genId(), 
          label: name, 
          description: description, 
          children: [] 
        });
      }
      return newTree;
    });

    setCollapsed((prev) => {
      const next = new Set(prev);
      if (addingChildToParentNode) {
        next.delete(addingChildToParentNode.id); 
      }
      return next;
    });
    handleCloseAddChildModal(); 
  }, [addingChildToParentNode, handleCloseAddChildModal]);

  const openDeleteConfirmationModal = useCallback((nodeId: string) => {
    if (tree.id === nodeId) {
      toast.error("Cannot delete the root node.");
      return;
    }
    const nodeInfo = findNode(tree, nodeId);
    if (nodeInfo) {
      setNodeToDelete({id: nodeId, label: nodeInfo.node.label});
      setIsConfirmDeleteModalOpen(true);
    }
  }, [tree]);

  const handleCloseConfirmDeleteModal = useCallback(() => {
    setIsConfirmDeleteModalOpen(false);
    setNodeToDelete(null);
  }, []);
  
  const executeDeleteNode = useCallback(() => {
    if (!nodeToDelete) return;
    const nodeIdToDeleteActual = nodeToDelete.id;

    setTree(currentTree => {
        if (currentTree.id === nodeIdToDeleteActual) {
            return currentTree;
        }

        const newTree = JSON.parse(JSON.stringify(currentTree)) as NodeData;
        const foundNodeInfo = findNode(newTree, nodeIdToDeleteActual);

        if (foundNodeInfo && foundNodeInfo.parent) {
            foundNodeInfo.parent.children = foundNodeInfo.parent.children.filter(
                child => child.id !== nodeIdToDeleteActual
            );
            return newTree;
        }
        return currentTree; 
    });
    handleCloseConfirmDeleteModal();
  }, [nodeToDelete, handleCloseConfirmDeleteModal]);

  const handleOpenNewTreeModal = useCallback(() => {
    setIsNewTreeModalOpen(true);
  }, []);

  const handleCloseNewTreeModal = useCallback(() => {
    setIsNewTreeModalOpen(false);
  }, []);

  const handleCreateNewTree = useCallback((name: string, description: string) => {
    const newRoot: NodeData = {
      id: genId(),
      label: name,
      description: description,
      children: []
    };
    setTree(newRoot);
    setCollapsed(new Set()); 
    handleCloseNewTreeModal();
  }, [handleCloseNewTreeModal]);
  
  const handleLoadTree = useCallback((loadedData: any) => {
    if (validateNodeData(loadedData)) {
      setTree(loadedData);
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

  const handleSaveEditedNode = useCallback((nodeId: string, newLabel: string, newDescription: string) => {
    setTree(currentTree => {
      const newTree = JSON.parse(JSON.stringify(currentTree)) as NodeData;
      // We need to walk the tree to find the node and update it,
      // as findNode only returns a reference which might not be ideal for direct mutation
      // if the tree structure is complex or we need to ensure reactivity.
      // A simpler approach for direct update in a cloned tree:
      const nodeInfo = findNode(newTree, nodeId);
      if (nodeInfo) {
        nodeInfo.node.label = newLabel;
        nodeInfo.node.description = newDescription;
      }
      return newTree;
    });
    handleCloseEditNodeModal();
  }, [handleCloseEditNodeModal]);


  const nodeRowProps: Omit<NodeRowProps, 'node' | 'depth' | 'isCollapsed'> = {
    toggleCollapse,
    moveNode,
    onAddNewChild: openAddChildModal, 
    onCopyToClipboard: copyToClipboard, 
    onPasteAsChild: pasteAsChild,     
    onMagicWand: generateMagicWandPrompt,           
    onDeleteNode: openDeleteConfirmationModal,
    onEditNode: handleOpenEditNodeModal, // Added onEditNode handler
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
                    saveTreeAsJson(tree, fileName || 'concept-hierarchy');
                    toast.success("Concept hierarchy saved as JSON");
                  }} 
                />
                <LoadTreeButton onLoad={handleLoadTree} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden">
            <div className="p-2 space-y-0.5"> 
              <AnimatePresence>
                {renderTreeRecursive(tree, 0, collapsed, nodeRowProps)}
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
          parentNodeName={addingChildToParentNode?.label}
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
          nodeName={nodeToDelete?.label}
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