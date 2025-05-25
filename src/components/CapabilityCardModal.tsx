import React, { useEffect, useRef } from 'react';
import { X, ArrowLeft, ArrowUp } from 'lucide-react';
import { NodeData } from '../types';
import { Button } from './ui/Button';
import CapabilityCard from './CapabilityCard';
import ExportDropdown from './ui/ExportDropdown';
import { exportCapabilityCard, ExportFormat } from '../utils/exportUtils/exportUtils.js';

interface CapabilityCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: NodeData[];
  currentNodeId: string;
  onNavigateToNode?: (nodeId: string) => void;
}

const CapabilityCardModal: React.FC<CapabilityCardModalProps> = ({
  isOpen,
  onClose,
  nodes,
  currentNodeId,
  onNavigateToNode
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const currentNode = nodes.find(n => n.id === currentNodeId);
  const parentNode = currentNode?.parent ? nodes.find(n => n.id === currentNode.parent) : null;

  const handleNavigateToParent = () => {
    if (parentNode && onNavigateToNode) {
      onNavigateToNode(parentNode.id);
    }
  };
  const handleExport = async (format: ExportFormat) => {
    // Get the element to be exported
    const containerElement = cardRef.current;
    
    if (containerElement) {
      try {
        // Generate filename based on the node name
        const filename = currentNode?.name 
          ? `capability-card-${currentNode.name.toLowerCase().replace(/\s+/g, '-')}`
          : 'capability-card';        // Export using the utility function
        await exportCapabilityCard(nodes, currentNodeId, format, { current: containerElement }, filename);
      } catch (error) {
        console.error('Export failed:', error);
        // TODO: Add error notification here
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[98vw] h-[90vh] max-w-none flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Back to tree view"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {/* Always show up button for debugging - TODO: remove this and uncomment the conditional */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavigateToParent}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Navigate to parent capability"
              title={parentNode ? `Go to parent: ${parentNode.name}` : 'No parent (root node)'}
              disabled={!parentNode}
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Capability Card
              </h2>
              {currentNode && (
                <p className="text-sm text-gray-600">
                  {currentNode.name}
                </p>
              )}
            </div>
          </div>          <div className="flex items-center space-x-2">
            <ExportDropdown
              onExport={handleExport}
              disabled={!currentNode}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>        {/* Card Content */}
        <div className="flex-1 overflow-hidden" ref={cardRef}>
          <CapabilityCard
            nodes={nodes}
            currentId={currentNodeId}
            onNodeClick={onNavigateToNode}
            className="h-full"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          Click on child or grandchild capabilities to navigate to their cards
        </div>
      </div>
    </div>
  );
};

export default CapabilityCardModal;
