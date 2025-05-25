import React, { useMemo, useRef } from 'react';
import { NodeData } from '../types';
import { buildIndex, getCardSubtree, calculateColumns } from '../utils/capabilityCardUtils';
import { useResizeObserver } from '../hooks/useResizeObserver';
import CapabilityTile from './CapabilityTile';

interface CapabilityCardProps {
  nodes: NodeData[];
  currentId: string;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
}

const CapabilityCard: React.FC<CapabilityCardProps> = ({
  nodes,
  currentId,
  onNodeClick,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useResizeObserver(containerRef);
  // Build index and get subtree data
  const index = useMemo(() => buildIndex(nodes), [nodes]);  const { current, kids } = useMemo(
    () => getCardSubtree(index, currentId),
    [index, currentId]
  );

  // Calculate responsive columns
  const cols = calculateColumns(width, 220);

  if (!current) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-500 ${className}`}>
        <p>Node not found</p>
      </div>
    );
  }
  return (
    <div 
      ref={containerRef} 
      className={`h-full w-full p-6 overflow-auto ${className}`}
    >
      <div className="space-y-6">        {/* Level N - Current node (blue background, full width) */}
        <div className="w-full">
          <CapabilityTile 
            node={current} 
            variant="current"
          />
        </div>        {/* Level N+1 and N+2 - Children with their grandchildren below */}
        {kids.length > 0 && (
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(kids.length, cols)}, 1fr)`, gridTemplateRows: 'auto 1fr' }}>
            {kids.map((kid) => {
              const kidGrandchildren = index.children.get(kid.id) ?? [];
              return (
                <div key={kid.id} className="flex flex-col gap-3 h-full">
                  {/* Child node - fixed height */}
                  <div className="flex-shrink-0">
                    <CapabilityTile 
                      node={kid} 
                      variant="child"
                      onClick={() => onNodeClick?.(kid.id)}
                    />
                  </div>
                  
                  {/* Grandchildren of this child - takes remaining space */}
                  <div className="flex-grow">
                    {kidGrandchildren.length > 0 && (
                      <div className="flex flex-col gap-2">
                        {kidGrandchildren.map((grandkid) => (
                          <CapabilityTile 
                            key={grandkid.id} 
                            node={grandkid} 
                            variant="grandchild"
                            onClick={() => onNodeClick?.(grandkid.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapabilityCard;
