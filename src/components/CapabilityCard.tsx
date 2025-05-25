import React, { useMemo, useRef } from 'react';
import { NodeData } from '../types';
import { buildIndex, getCardSubtree } from '../utils/capabilityCardUtils';
import CapabilityTile from './CapabilityTile';
import { SimpleTooltip } from './ui/SimpleTooltip';

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
  // Build index and get subtree data
  const index = useMemo(() => buildIndex(nodes), [nodes]);const { current, kids } = useMemo(
    () => getCardSubtree(index, currentId),
    [index, currentId]
  );

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
          <SimpleTooltip content={current.description || ''}>
            <CapabilityTile 
              node={current} 
              variant="current"
            />
          </SimpleTooltip>
        </div>{/* Level N+1 and N+2 - Children with their grandchildren below */}
        {kids.length > 0 && (
          <>            {/* Children row with responsive layout */}
            <div className="overflow-x-auto">
              <div 
                className={`flex gap-4 pb-2 ${kids.length <= 4 ? 'w-full' : ''}`}
                style={kids.length <= 4 ? {} : { minWidth: 'fit-content' }}
              >                {kids.map((kid) => (
                  <div 
                    key={`child-${kid.id}`} 
                    className={kids.length <= 4 ? "flex-1" : "flex-shrink-0"} 
                    style={kids.length <= 4 ? { minWidth: '200px' } : { width: '220px' }}
                  >
                    <SimpleTooltip content={kid.description || ''}>
                      <CapabilityTile 
                        node={kid} 
                        variant="child"
                        onClick={() => onNodeClick?.(kid.id)}
                      />
                    </SimpleTooltip>
                  </div>
                ))}
              </div>
            </div>{/* Grandchildren rows */}
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

              // Create rows for grandchildren with horizontal scrolling
              const grandchildrenRows = [];
              for (let rowIndex = 0; rowIndex < maxGrandchildrenPerParent; rowIndex++) {
                grandchildrenRows.push(
                  <div 
                    key={`grandchildren-row-${rowIndex}`}
                    className="overflow-x-auto mt-3"
                  >                    <div 
                      className={`flex gap-4 pb-2 ${kids.length <= 4 ? 'w-full' : ''}`}
                      style={kids.length <= 4 ? {} : { minWidth: 'fit-content' }}
                    >
                      {kids.map((kid) => {
                        const kidGrandchildren = index.children.get(kid.id) ?? [];
                        const grandchild = kidGrandchildren[rowIndex];
                        
                        return (
                          <div 
                            key={`grandchild-${kid.id}-${rowIndex}`} 
                            className={kids.length <= 4 ? "flex-1" : "flex-shrink-0"} 
                            style={kids.length <= 4 ? { minWidth: '200px' } : { width: '220px' }}
                          >                            {grandchild ? (
                              <SimpleTooltip content={grandchild.description || ''}>
                                <CapabilityTile 
                                  node={grandchild} 
                                  variant="grandchild"
                                  onClick={() => onNodeClick?.(grandchild.id)}
                                />
                              </SimpleTooltip>
                            ) : (
                              <div className="h-full" /> // Empty space to maintain alignment
                            )}
                          </div>
                        );
                      })}
                    </div>
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
