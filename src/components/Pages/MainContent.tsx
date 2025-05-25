import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import AddChildModal from "../AddChildModal";
import CapabilityCardModal from "../CapabilityCardModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import EditNodeModal from "../EditNodeModal";
import LoadingSpinner from "../LoadingSpinner";
import LoadTreeButton from "../LoadTreeButton";
import MagicWandSettingsModal from "../MagicWandSettingsModal";
import NewTreeButton from "../NewTreeButton";
import NewTreeModal from "../NewTreeModal";
import NodeRow from "../NodeRow";
import SaveTreeButton from "../SaveTreeButton";
import TreeControls from "../TreeControls";
import VirtualizedTree from "../VirtualizedTree";
import { useClipboardActions } from "../../hooks/useClipboardActions";
import { useKeyboardNavigation } from "../../hooks/useKeyboardNavigation";
import { useMagicWand } from "../../hooks/useMagicWand";
import { useTreeContext } from "../../context/TreeContext";
import { CapabilityCardProvider } from "../../context/CapabilityCardContext";
import { NodeData } from "../../types";
import { saveTreeAsJson, validateNodeData } from "../../utils/exportUtils";
import { genId } from "../../utils/treeUtils";

// Function to render nodes recursively in the flat structure

// Function to render nodes recursively in the flat structure
const renderTreeRecursive = (
    nodes: NodeData[],
    parentId: string | null,
    depth: number,
    collapsedSet: Set<string>,
    nodeRowProps: Omit<React.ComponentProps<typeof NodeRow>, "node" | "depth" | "isCollapsed" | "hasChildren" | "isFocused">,
    nodeMap?: Map<string, NodeData>,
    focusedNodeId?: string | null
): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    // Get children of the current parent node
    const children = nodes.filter((node) => node.parent === parentId);

    // Render each child
    children.forEach((node) => {
        const isCollapsed = collapsedSet.has(node.id);
        // Use nodeMap for faster lookup if available
        const hasChildren = nodeMap ? nodes.some((n) => n.parent === node.id) : nodes.some((n) => n.parent === node.id);

        // Add the node row
        elements.push(
            <NodeRow
                key={node.id}
                node={node}
                depth={depth}
                isCollapsed={isCollapsed}
                hasChildren={hasChildren}
                isFocused={focusedNodeId === node.id}
                {...nodeRowProps}
            />
        );

        // If not collapsed and has children, recursively render its children
        if (!isCollapsed && hasChildren) {
            elements.push(...renderTreeRecursive(nodes, node.id, depth + 1, collapsedSet, nodeRowProps, nodeMap, focusedNodeId));
        }
    });

    return elements;
};

const MainContent: React.FC = () => {
    const { nodes, setNodes, collapsed, setCollapsed, isLoading, setIsLoading, isInitializing } = useTreeContext();

    // Create a ref for the tree container to measure its width
    const treeContainerRef = React.useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(1000);
    const [containerHeight, setContainerHeight] = useState(500);

    // Update container dimensions when window resizes
    useEffect(() => {
        const updateDimensions = () => {
            if (treeContainerRef.current) {
                setContainerWidth(treeContainerRef.current.offsetWidth);
                setContainerHeight(treeContainerRef.current.offsetHeight);
            }
        };

        // Initial measurement
        updateDimensions();

        // Add resize listener
        window.addEventListener("resize", updateDimensions);

        // Cleanup
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Re-measure container when content changes
    useEffect(() => {
        if (treeContainerRef.current) {
            setContainerWidth(treeContainerRef.current.offsetWidth);
            setContainerHeight(treeContainerRef.current.offsetHeight);
        }
    }, [nodes.length, collapsed.size]);    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [addingChildToParentNode, setAddingChildToParentNode] = useState<NodeData | null>(null);

    // No need to initialize data here anymore, it's handled by the TreeContext

    const [isNewTreeModalOpen, setIsNewTreeModalOpen] = useState(false);

    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [nodeToDelete, setNodeToDelete] = useState<{ id: string; name: string } | null>(null);

    const [isEditNodeModalOpen, setIsEditNodeModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<NodeData | null>(null);

    // Capability card modal state
    const [isCapabilityCardOpen, setIsCapabilityCardOpen] = useState(false);
    const [capabilityCardNodeId, setCapabilityCardNodeId] = useState<string | null>(null);

    // Magic wand settings modal
    const [isMagicWandSettingsOpen, setIsMagicWandSettingsOpen] = useState(false);
    const handleOpenMagicWandSettings = useCallback(() => {
        setIsMagicWandSettingsOpen(true);
    }, []);

    const handleCloseMagicWandSettings = useCallback(() => {
        setIsMagicWandSettingsOpen(false);
    }, []);

    const { copyToClipboard, pasteAsChild } = useClipboardActions({ setNodes, setCollapsed });
    const { generateMagicWandPrompt, currentGuidelines, updateGuidelines } = useMagicWand({ nodes });

    const handleSaveMagicWandSettings = useCallback(
        (guidelines: string) => {
            updateGuidelines(guidelines);
        },
        [updateGuidelines]
    );

    const handleResetMagicWandSettings = useCallback(() => {
        updateGuidelines("");
    }, [updateGuidelines]);

    // Create a node map for faster lookups
    const nodeMap = useMemo(() => {
        const map = new Map<string, NodeData>();
        nodes.forEach((node) => map.set(node.id, node));
        return map;
    }, [nodes]);

    const toggleCollapse = useCallback(
        (id: string) => {
            setCollapsed((prev) => {
                const next = new Set(prev);

                if (next.has(id)) {
                    // Expanding a node - remove it from collapsed set
                    next.delete(id);

                    // But ensure all its direct children are collapsed (only expand one level)
                    const directChildren = nodes.filter((node) => node.parent === id);
                    directChildren.forEach((child) => {
                        next.add(child.id);
                    });
                } else {
                    // Collapsing a node - add it to collapsed set
                    next.add(id);
                }

                return next;
            });
        },
        [nodes]
    );

    const moveNode = useCallback(
        (dragId: string, dropTargetId: string) => {
            if (dragId === dropTargetId) return;

            // Function to check if a node is a descendant of another node
            const isDescendant = (ancestorId: string, nodeId: string): boolean => {
                const node = nodeMap.get(nodeId);
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
            setNodes((currentNodes) => {
                return currentNodes.map((node) => {
                    if (node.id === dragId) {
                        return { ...node, parent: dropTargetId };
                    }
                    return node;
                });
            });

            // Auto-expand the drop target
            setCollapsed((prev) => {
                const next = new Set(prev);
                next.delete(dropTargetId);
                return next;
            });
        },
        [nodes, nodeMap]
    );

    const openAddChildModal = useCallback((parentNode: NodeData) => {
        setAddingChildToParentNode(parentNode);
        setIsAddChildModalOpen(true);
    }, []);

    const handleCloseAddChildModal = useCallback(() => {
        setIsAddChildModalOpen(false);
        setAddingChildToParentNode(null);
    }, []);

    const handleSaveNewChild = useCallback(
        (name: string, description: string) => {
            if (!addingChildToParentNode) return;

            // Create a new node with the parent reference
            const newNode: NodeData = {
                id: genId(),
                name,
                description,
                parent: addingChildToParentNode.id,
            };

            // Add the new node to the nodes array
            setNodes((currentNodes) => [...currentNodes, newNode]);

            // Ensure parent node is expanded
            setCollapsed((prev) => {
                const next = new Set(prev);
                next.delete(addingChildToParentNode.id);
                return next;
            });

            handleCloseAddChildModal();
        },
        [addingChildToParentNode, handleCloseAddChildModal]
    );

    const openDeleteConfirmationModal = useCallback(
        (nodeId: string) => {
            // Check if it's the root node (has null parent)
            const isRoot = nodes.some((node) => node.id === nodeId && node.parent === null);
            if (isRoot) {
                toast.error("Cannot delete the root node.");
                return;
            }

            const node = nodes.find((n) => n.id === nodeId);
            if (node) {
                setNodeToDelete({ id: nodeId, name: node.name });
                setIsConfirmDeleteModalOpen(true);
            }
        },
        [nodes]
    );

    const handleCloseConfirmDeleteModal = useCallback(() => {
        setIsConfirmDeleteModalOpen(false);
        setNodeToDelete(null);
    }, []);

    const executeDeleteNode = useCallback(() => {
        if (!nodeToDelete) return;

        // Function to get all descendant IDs of a node
        const getAllDescendantIds = (nodeId: string): string[] => {
            const directChildren = nodes.filter((n) => n.parent === nodeId);
            let allDescendants: string[] = [nodeId];

            directChildren.forEach((child) => {
                allDescendants = [...allDescendants, ...getAllDescendantIds(child.id)];
            });

            return allDescendants;
        };

        // Get all nodes to delete (the node and all its descendants)
        const nodeIdsToDelete = getAllDescendantIds(nodeToDelete.id);

        // Remove all these nodes from the nodes array
        setNodes((currentNodes) => currentNodes.filter((node) => !nodeIdsToDelete.includes(node.id)));

        handleCloseConfirmDeleteModal();
    }, [nodeToDelete, handleCloseConfirmDeleteModal, nodes]);

    const handleOpenNewTreeModal = useCallback(() => {
        setIsNewTreeModalOpen(true);
    }, []);

    const handleCloseNewTreeModal = useCallback(() => {
        setIsNewTreeModalOpen(false);
    }, []);

    const handleCreateNewTree = useCallback(
        (name: string, description: string) => {
            // Create a single root node with no parent
            const newRoot: NodeData = {
                id: genId(),
                name,
                description,
                parent: null,
            };

            // Replace all existing nodes with just this root node
            setNodes([newRoot]);
            setCollapsed(new Set());
            handleCloseNewTreeModal();
        },
        [handleCloseNewTreeModal]
    );

    const handleLoadTree = useCallback(async (loadedData: any) => {
        setIsLoading(true);
        try {
            // Add a small delay to show loading state for large trees
            await new Promise((resolve) => setTimeout(resolve, 300));

            if (validateNodeData(loadedData)) {
                setNodes(loadedData);
                setCollapsed(new Set());
                toast.success("Tree loaded successfully");
            } else {
                toast.error("Invalid tree data format");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Edit Node Modal Handlers
    const handleOpenEditNodeModal = useCallback((node: NodeData) => {
        setEditingNode(node);
        setIsEditNodeModalOpen(true);
    }, []);    const handleCloseEditNodeModal = useCallback(() => {
        setIsEditNodeModalOpen(false);
        setEditingNode(null);
    }, []);

    // Keyboard navigation integration
    const { focusedNodeId, setFocusedNodeId } = useKeyboardNavigation({
        nodes,
        collapsed,
        onToggleCollapse: (nodeId: string) => {
            setCollapsed((prev) => {
                const next = new Set(prev);
                if (next.has(nodeId)) {
                    next.delete(nodeId);
                } else {
                    next.add(nodeId);
                }
                return next;
            });
        },
        onSelectNode: (nodeId: string) => {
            setFocusedNodeId(nodeId);
            // Optionally scroll focused node into view
            setTimeout(() => {
                const element = document.querySelector(`[data-node-id="${nodeId}"]`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 50);
        },
        onEditNode: handleOpenEditNodeModal
    });

    const handleSaveEditedNode = useCallback(
        (nodeId: string, newName: string, newDescription: string) => {
            setNodes((currentNodes) => {
                return currentNodes.map((node) => {
                    if (node.id === nodeId) {
                        return { ...node, name: newName, description: newDescription };
                    }
                    return node;
                });
            });
            handleCloseEditNodeModal();
        },
        [handleCloseEditNodeModal]
    );

    // Capability Card Modal Handlers
    const handleOpenCapabilityCard = useCallback((node: NodeData) => {
        setCapabilityCardNodeId(node.id);
        setIsCapabilityCardOpen(true);
    }, []);

    const handleCloseCapabilityCard = useCallback(() => {
        setIsCapabilityCardOpen(false);
        setCapabilityCardNodeId(null);
    }, []);

    const handleNavigateToCapabilityCard = useCallback((nodeId: string) => {
        setCapabilityCardNodeId(nodeId);
        // Keep modal open, just change the node
    }, []);

    // Expand and collapse all handlers
    const handleExpandAll = useCallback(() => {
        // To expand all levels, we simply clear the collapsed set completely
        setCollapsed(new Set());
    }, []);

    const handleCollapseAll = useCallback(() => {
        // Get the IDs of all nodes that have children
        const nodesWithChildren = nodes
            .filter((node) => nodes.some((n) => n.parent === node.id))
            .map((node) => node.id);

        // Add all of these IDs to the collapsed set
        setCollapsed(new Set(nodesWithChildren));
    }, [nodes]);

    // Function to handle clipboard operations
    const handleCopyToClipboard = useCallback(
        (node: NodeData) => {
            copyToClipboard(node, nodes);
        },
        [copyToClipboard, nodes]
    );    const nodeRowProps: Omit<React.ComponentProps<typeof NodeRow>, "node" | "depth" | "isCollapsed" | "hasChildren" | "isFocused"> = {
        toggleCollapse,
        moveNode,
        onAddNewChild: openAddChildModal,
        onCopyToClipboard: handleCopyToClipboard,
        onPasteAsChild: pasteAsChild,
        onMagicWand: generateMagicWandPrompt,
        onDeleteNode: openDeleteConfirmationModal,
        onEditNode: handleOpenEditNodeModal,
        onViewCapabilityCard: handleOpenCapabilityCard,
        onFocus: setFocusedNodeId,
    };return (
        <CapabilityCardProvider onOpenCapabilityCard={handleOpenCapabilityCard}>
            <>                <div className="flex justify-between items-center px-2 sm:px-4 mb-2">
                <div className="flex flex-nowrap items-center gap-2">                    <TreeControls
                        onExpandAll={handleExpandAll}
                        onCollapseAll={handleCollapseAll}
                        onOpenMagicWandSettings={handleOpenMagicWandSettings}
                        disabled={isLoading || isInitializing}
                    />
                </div>
                <div className="flex flex-nowrap items-center gap-2">
                    <NewTreeButton onClick={handleOpenNewTreeModal} disabled={isLoading} />
                    <SaveTreeButton
                        onSave={(fileName) => {
                            saveTreeAsJson(nodes, fileName || "concept-hierarchy");
                            toast.success("Concept hierarchy saved as JSON");
                        }}
                        disabled={isLoading}
                    />
                    <LoadTreeButton onLoad={handleLoadTree} disabled={isLoading} />
                </div>
            </div>
            {isInitializing ? (
                <div className="flex justify-center items-center flex-grow">
                    <LoadingSpinner size={50} text="Initializing..." />
                </div>
            ) : isLoading ? (
                <div className="flex justify-center items-center flex-grow">
                    <LoadingSpinner size={50} text="Loading data..." />
                </div>
            ) : (                <div className="p-2 space-y-0.5 flex flex-col flex-grow overflow-hidden">                    
                    <div className="flex-grow overflow-y-auto overflow-x-hidden w-full min-w-0" ref={treeContainerRef} style={{ scrollbarGutter: 'stable' }}>
                        <AnimatePresence>
                            {nodes.length > 100 ? (                                <VirtualizedTree
                                    nodes={nodes}
                                    collapsed={collapsed}
                                    nodeRowProps={nodeRowProps}
                                    height={containerHeight || 500}
                                    width={containerWidth || 1000}
                                    focusedNodeId={focusedNodeId}
                                />) : (
                                renderTreeRecursive(nodes, null, 0, collapsed, nodeRowProps, nodeMap, focusedNodeId)
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}            {/* Modals */}
            <AddChildModal
                isOpen={isAddChildModalOpen}
                onClose={handleCloseAddChildModal}
                onSave={handleSaveNewChild}
                parentNodeName={addingChildToParentNode?.name}
            />
            <NewTreeModal isOpen={isNewTreeModalOpen} onClose={handleCloseNewTreeModal} onSave={handleCreateNewTree} />
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteModalOpen}
                onClose={handleCloseConfirmDeleteModal}
                onConfirm={executeDeleteNode}
                nodeName={nodeToDelete?.name}
            />{" "}
            <EditNodeModal
                isOpen={isEditNodeModalOpen}
                onClose={handleCloseEditNodeModal}
                onSave={handleSaveEditedNode}
                nodeToEdit={editingNode}
            />{" "}
            <CapabilityCardModal
                isOpen={isCapabilityCardOpen}
                onClose={handleCloseCapabilityCard}
                nodes={nodes}
                currentNodeId={capabilityCardNodeId || ''}
                onNavigateToNode={handleNavigateToCapabilityCard}
            />
            <MagicWandSettingsModal
                isOpen={isMagicWandSettingsOpen}
                onClose={handleCloseMagicWandSettings}
                currentGuidelines={currentGuidelines}
                onSave={handleSaveMagicWandSettings}
                onReset={handleResetMagicWandSettings}            />
            </>
        </CapabilityCardProvider>
    );
};

export default MainContent;
