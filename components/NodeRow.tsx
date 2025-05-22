import React from 'react';
import { useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronDown, Wand2, Copy, ClipboardPaste, PlusSquare, Trash2, FileEdit } from 'lucide-react'; // Added FileEdit
import { NodeData } from '../types';
import { DND_ITEM_TYPE } from '../constants';
import { Button } from './ui/Button';

export interface NodeRowProps {
  node: NodeData;
  depth: number;
  isCollapsed: boolean;
  toggleCollapse: (id: string) => void;
  moveNode: (dragId: string, dropId: string) => void;
  onAddNewChild: (parentNode: NodeData) => void;
  onCopyToClipboard: (nodeToCopy: NodeData) => void;
  onPasteAsChild: (targetParentNode: NodeData) => void;
  onMagicWand: (node: NodeData) => void;
  onDeleteNode: (nodeId: string) => void;
  onEditNode: (node: NodeData) => void; // Added onEditNode prop
}

const NodeRow: React.FC<NodeRowProps> = ({
  node,
  depth,
  isCollapsed,
  toggleCollapse,
  moveNode,
  onAddNewChild,
  onCopyToClipboard,
  onPasteAsChild,
  onMagicWand,
  onDeleteNode,
  onEditNode, // Added onEditNode
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

  const handleEdit = (e: React.MouseEvent) => { // Added handleEdit
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
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className={`group flex items-center justify-between h-12 rounded-lg hover:bg-gray-200/80 transition-colors duration-150 ${
        isDragging ? "opacity-50 shadow-lg" : "shadow-sm"
      } bg-white mb-1 mx-2`}
      style={{ paddingRight: '1rem' }} 
    >
      {/* Left side – expand/collapse + label */}
      <div
        className="flex items-center space-x-2 flex-grow overflow-hidden"
        style={{ paddingLeft: `${depth * 1.5 + 0.5}rem` }} 
      >
        {node.children?.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            className="p-1 text-gray-500 hover:text-gray-700"
            onClick={(e) => {
              e.stopPropagation();
              toggleCollapse(node.id);
            }}
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <span className="w-4 h-4 inline-block ml-1" /> 
        )}
        <span className="font-medium text-gray-800 select-none truncate" title={node.label}>
          {node.label}
        </span>
      </div>

      {/* Right side – action icons */}
      <div className="flex items-center space-x-0.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-gray-500 hover:text-purple-500" // Changed hover color for edit
          onClick={handleEdit} // Added onClick for edit
          aria-label="Edit Node"
          title="Edit Node"
        >
          <FileEdit className="w-4 h-4" /> {/* Added Edit Icon */}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-gray-500 hover:text-blue-500"
          onClick={(e) => { e.stopPropagation(); onMagicWand(node); }}
          aria-label="Magic Wand"
          title="Magic Wand (AI)"
        >
          <Wand2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-gray-500 hover:text-green-500"
          onClick={(e) => { e.stopPropagation(); onCopyToClipboard(node); }}
          aria-label="Copy to Clipboard"
          title="Copy to Clipboard"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-gray-500 hover:text-yellow-500"
          onClick={(e) => { e.stopPropagation(); onPasteAsChild(node); }}
          aria-label="Paste as Child"
          title="Paste as Child"
        >
          <ClipboardPaste className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-gray-500 hover:text-indigo-500"
          onClick={(e) => { e.stopPropagation(); onAddNewChild(node); }}
          aria-label="Add New Child"
          title="Add New Child"
        >
          <PlusSquare className="w-4 h-4" />
        </Button>
         <Button
          variant="ghost"
          size="icon"
          className="p-1.5 text-gray-500 hover:text-red-500"
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

export default NodeRow;