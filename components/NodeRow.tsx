import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, ClipboardPaste, Copy, FileEdit, PlusSquare, Trash2, Wand2 } from 'lucide-react';
import React from 'react';
import { DragSourceMonitor, useDrag, useDrop } from 'react-dnd';
import { DND_ITEM_TYPE } from '../constants';
import { NodeData } from '../types';
import { Button } from './ui/Button';

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
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: DND_ITEM_TYPE,
    item: { id: node.id },
    collect: (monitor: DragSourceMonitor<{ id: string }, unknown>) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: DND_ITEM_TYPE,
    drop: (item: { id: string }) => {
      if (item.id !== node.id) { 
        moveNode(item.id, node.id);
      }
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteNode(node.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditNode(node);
  };


  return (
    <motion.div
      ref={(el) => { 
        drag(el);
        drop(el);
      }}
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}      exit={{ opacity: 0, y: 4 }}
      className={`group flex items-center justify-between h-12 rounded-lg hover:bg-gray-200/80 transition-colors duration-150 ${
        isDragging ? "opacity-50 shadow-lg" : "shadow-sm"
      } bg-white mb-1 mx-2`}
      style={{ paddingRight: '1.5rem' }}
    >
      {/* Left side – expand/collapse + label */}
      <div
        className="flex items-center space-x-3 flex-grow overflow-hidden"
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }} 
      >
        {hasChildren ? (          <Button
            variant="ghost"
            size="icon"
            className="p-1 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse(node.id);
            }}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >            {isCollapsed ? (          <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>        ) : (
          <span className="w-4 h-4 inline-block ml-1" /> 
        )}<span className="font-medium text-gray-800 text-sm select-none truncate" title={node.description}>
          {node.name}
        </span>
      </div>      {/* Right side – action icons */}
      <div className="flex items-center space-x-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">        <Button
          variant="ghost"
          size="icon"
          className="p-1 text-gray-500 hover:text-purple-500"
          onClick={handleEdit}
          aria-label="Edit Node"
          title="Edit Node"
        >
          <FileEdit className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-1 text-gray-500 hover:text-blue-500"
          onClick={(e) => { e.stopPropagation(); onMagicWand(node); }}
          aria-label="Magic Wand"
          title="Magic Wand (AI)"
        >
          <Wand2 className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-1 text-gray-500 hover:text-green-500"
          onClick={(e) => { e.stopPropagation(); onCopyToClipboard(node); }}
          aria-label="Copy to Clipboard"
          title="Copy to Clipboard"
        >
          <Copy className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-1 text-gray-500 hover:text-yellow-500"
          onClick={(e) => { e.stopPropagation(); onPasteAsChild(node); }}
          aria-label="Paste as Child"
          title="Paste as Child"
        >
          <ClipboardPaste className="w-4 h-4" />
        </Button>        <Button
          variant="ghost"
          size="icon"
          className="p-1 text-gray-500 hover:text-indigo-500"
          onClick={(e) => { e.stopPropagation(); onAddNewChild(node); }}
          aria-label="Add New Child"
          title="Add New Child"
        >
          <PlusSquare className="w-4 h-4" />
        </Button>         <Button
          variant="ghost"
          size="icon"
          className="p-1 text-gray-500 hover:text-red-500"
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