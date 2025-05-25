import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { NodeData } from '../types';
import { Button } from './ui/Button';
import CapabilityCard from './CapabilityCard';

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
  if (!isOpen) return null;

  const currentNode = nodes.find(n => n.id === currentNodeId);
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
          </div>
          
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

        {/* Card Content */}
        <div className="flex-1 overflow-hidden">
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
