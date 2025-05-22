import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, ClipboardPaste, Copy, FileEdit, PlusSquare, Trash2, Wand2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { DND_ITEM_TYPE } from '../constants';
import { NodeData } from '../types';
import { Button } from './ui/Button';
import { MarkdownTooltip } from './ui/MarkdownTooltip';
import './ui/DragStyles.css';

export interface NodeRowProps {
  node: NodeData;
  depth: number;
  isCollapsed: boolean;
  hasChildren: boolean;
  toggleCollapse: (id: string) => void;
  moveNode: (dragId: string, dropId: string) => void;
  onAddNewChild: (parentNode: NodeData) => void;
  onCopyToClipboard: (nodeToCopy: NodeData) => void;
  onPasteAsChild: (targetParentNode: NodeData) => void;
  onMagicWand: (node: NodeData) => void;
  onDeleteNode: (nodeId: string) => void;
  onEditNode: (node: NodeData) => void;
}

const NodeRow: React.FC<NodeRowProps> = ({
  node,
  depth,
  isCollapsed,
  hasChildren,
  toggleCollapse,
  moveNode,
  onAddNewChild,
  onCopyToClipboard,
  onPasteAsChild,
  onMagicWand,
  onDeleteNode,
  onEditNode,
}) => {  const [{ isDragging }, drag, preview] = useDrag({
    type: DND_ITEM_TYPE,
    item: { id: node.id },
    collect: (monitor: DragSourceMonitor<{ id: string }, unknown>) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Use empty image as preview
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item: { id: string }) => {
      if (item.id !== node.id) { 
        moveNode(item.id, node.id);
      }
    },
    canDrop: (item: { id: string }) => item.id !== node.id,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isDropTarget = isOver && canDrop;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNode(node.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditNode(node);
  };

  return (    <motion.div
      ref={(el) => { 
        drag(el);
        drop(el);
      }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}      exit={{ opacity: 0, y: 4 }}
      className={`group flex items-center justify-between h-10 sm:h-8 rounded-lg hover:bg-gray-200/80 transition-colors duration-150 ${
        isDragging ? "shadow-lg dragging" : "shadow-sm"
      } ${
        isDropTarget ? "drop-target-active" : "bg-white"
      } mb-1 mx-1 sm:mx-2`}
      style={{ 
        paddingRight: '0.5rem',
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >{/* Left side – expand/collapse + label */}      <div
        className="flex items-center space-x-2 sm:space-x-3 flex-grow overflow-hidden node-content min-w-0"
        style={{ paddingLeft: `${depth * 1.2 + 0.5}rem` }} 
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className={`p-0.5 sm:p-1 text-gray-500 hover:text-gray-700 ${isDragging ? 'opacity-0' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse(node.id);
            }}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
            tabIndex={isDragging ? -1 : 0}
          >            
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <span className="inline-block w-8 sm:w-6 h-5 sm:h-4" /> // Placeholder to match button's outer size
        )}
        
        {/* Only render tooltip when not dragging */}
        <MarkdownTooltip content={node.description || ''}>          <span className={`font-medium text-gray-800 text-sm select-none truncate max-w-[60vw] sm:max-w-[30rem] block ${isDragging ? 'opacity-0' : ''}`}>
            {node.name}
          </span>
        </MarkdownTooltip>      </div>      {/* Right side – action icons */}
      <div className={`flex items-center space-x-1 sm:space-x-2 ml-auto flex-shrink-0 ${isDragging ? 'opacity-0' : 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100'} transition-opacity duration-200 node-content`}>        <Button
          variant="ghost"
          size="icon"
          className="p-0.5 sm:p-1 text-gray-500 hover:text-purple-500"
          onClick={handleEdit}
          aria-label="Edit Node"
          title="Edit Node"
        >
          <FileEdit className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-0.5 sm:p-1 text-gray-500 hover:text-blue-500"
          onClick={(e) => { e.stopPropagation(); onMagicWand(node); }}
          aria-label="Magic Wand"
          title="Magic Wand (AI)"
        >
          <Wand2 className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-0.5 sm:p-1 text-gray-500 hover:text-green-500"
          onClick={(e) => { e.stopPropagation(); onCopyToClipboard(node); }}
          aria-label="Copy to Clipboard"
          title="Copy to Clipboard"
        >
          <Copy className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-0.5 sm:p-1 text-gray-500 hover:text-yellow-500"
          onClick={(e) => { e.stopPropagation(); onPasteAsChild(node); }}
          aria-label="Paste as Child"
          title="Paste as Child"
        >
          <ClipboardPaste className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-0.5 sm:p-1 text-gray-500 hover:text-indigo-500"
          onClick={(e) => { e.stopPropagation(); onAddNewChild(node); }}
          aria-label="Add New Child"
          title="Add New Child"
        >
          <PlusSquare className="w-4 h-4" />
        </Button>         <Button
          variant="ghost"
          size="icon"
          className="p-0.5 sm:p-1 text-gray-500 hover:text-red-500"
          onClick={handleDelete}
          aria-label="Delete Node"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

// at the end of the file
export default React.memo(NodeRow, (prevProps, nextProps) => {
  // Custom comparison for the React.memo
  // Return true if props are equal (component should not update)
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.name === nextProps.node.name &&
    prevProps.node.description === nextProps.node.description &&
    prevProps.depth === nextProps.depth &&
    prevProps.isCollapsed === nextProps.isCollapsed &&
    prevProps.hasChildren === nextProps.hasChildren
  );
});