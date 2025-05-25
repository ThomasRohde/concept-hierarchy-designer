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
          <>
            {/* Children row */}
            <div 
              className="grid gap-4" 
              style={{ 
                gridTemplateColumns: `repeat(${Math.min(kids.length, cols)}, 1fr)`
              }}
            >
              {kids.map((kid) => (
                <div key={`child-${kid.id}`} className="min-h-0">
                  <CapabilityTile 
                    node={kid} 
                    variant="child"
                    onClick={() => onNodeClick?.(kid.id)}
                  />
                </div>
              ))}
            </div>

            {/* Grandchildren rows */}
            {(() => {
              // Collect all grandchildren with their parent info
              const allGrandchildren = kids.flatMap((kid) => {
                const kidGrandchildren = index.children.get(kid.id) ?? [];
                return kidGrandchildren.map((grandkid) => ({
                  ...grandkid,
                  parentIndex: kids.findIndex(k => k.id === kid.id)
                }));
              });

              if (allGrandchildren.length === 0) return null;

              // Find the maximum number of grandchildren for any child
              const maxGrandchildrenPerParent = Math.max(
                ...kids.map(kid => (index.children.get(kid.id) ?? []).length)
              );

              // Create rows for grandchildren
              const grandchildrenRows = [];
              for (let rowIndex = 0; rowIndex < maxGrandchildrenPerParent; rowIndex++) {
                grandchildrenRows.push(
                  <div 
                    key={`grandchildren-row-${rowIndex}`}
                    className="grid gap-4 mt-3"
                    style={{ 
                      gridTemplateColumns: `repeat(${Math.min(kids.length, cols)}, 1fr)`
                    }}
                  >
                    {kids.map((kid, kidIndex) => {
                      const kidGrandchildren = index.children.get(kid.id) ?? [];
                      const grandchild = kidGrandchildren[rowIndex];
                      
                      return (
                        <div key={`grandchild-${kid.id}-${rowIndex}`} className="min-h-0">
                          {grandchild ? (
                            <CapabilityTile 
                              node={grandchild} 
                              variant="grandchild"
                              onClick={() => onNodeClick?.(grandchild.id)}
                            />
                          ) : (
                            <div className="h-full" /> // Empty space to maintain grid
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              }

              return grandchildrenRows;
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default CapabilityCard;
