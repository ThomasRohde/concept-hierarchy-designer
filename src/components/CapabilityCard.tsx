import React, { useMemo, useRef } from 'react';
import { NodeData } from '../types';
import { buildIndex, getCardSubtree } from '../utils/capabilityCardUtils';
import CapabilityTile from './CapabilityTile';
import { SimpleTooltip } from './ui/SimpleTooltip';
import { CAPABILITY_CARD_LAYOUT, getCardHeight } from '../constants/capabilityCardLayout';

interface CapabilityCardProps {
  nodes: NodeData[];
  currentId: string;
  onNodeClick?: (nodeId: string) => void;
  className?: string;
  exportMode?: boolean; // Whether to use fixed heights for export
}

const CapabilityCard: React.FC<CapabilityCardProps> = ({
  nodes,
  currentId,
  onNodeClick,
  className = '',
  exportMode = false
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
  // Get container styles for export mode
  const getContainerStyles = (): React.CSSProperties => {
    if (!exportMode) return {};
    
    return {
      padding: `${CAPABILITY_CARD_LAYOUT.SPACING.CONTAINER_PADDING}px`,
      overflow: 'visible', // Don't clip content in export mode
      height: 'auto', // Let content determine height
    };
  };

  return (
    <div 
      ref={containerRef} 
      className={`w-full ${exportMode ? '' : 'h-full p-6 overflow-auto'} ${className}`}
      style={getContainerStyles()}
    >      <div 
        className={exportMode ? '' : 'space-y-6'}
        style={exportMode ? { 
          display: 'flex', 
          flexDirection: 'column', 
          gap: `${CAPABILITY_CARD_LAYOUT.SPACING.ROW_GAP}px` 
        } : {}}
      >        {/* Level N - Current node (blue background, spans width of children) */}
        <div>
          <div 
            className={`flex ${exportMode ? '' : 'gap-4 pb-2'} ${kids.length <= 4 ? 'w-full' : ''}`}
            style={exportMode ? {
              gap: `${CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP}px`,
              ...(kids.length <= 4 ? {} : { minWidth: 'fit-content' })
            } : (kids.length <= 4 ? {} : { minWidth: 'fit-content' })}
          >
            <div 
              className={kids.length <= 4 ? "flex-1" : "flex-shrink-0"} 
              style={exportMode ? {
                ...(kids.length <= 4 ? 
                  { minWidth: `${CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.MIN_RESPONSIVE_WIDTH}px` } : 
                  { width: `${kids.length * CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.FIXED_CARD_WIDTH + (kids.length - 1) * CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP}px` }
                )
              } : (kids.length <= 4 ? { minWidth: '200px' } : { 
                width: `${kids.length * 220 + (kids.length - 1) * 16}px` // width of all children + gaps
              })}
            >
              <SimpleTooltip content={current.description || ''}>
                <CapabilityTile 
                  node={current} 
                  variant="current"
                  exportMode={exportMode}
                />
              </SimpleTooltip>
            </div>
          </div>
        </div>{/* Level N+1 and N+2 - Children with their grandchildren below */}
        {kids.length > 0 && (
          <>            {/* Children row with responsive layout */}
            <div>
              <div 
                className={`flex ${exportMode ? '' : 'gap-4 pb-2'} ${kids.length <= 4 ? 'w-full' : ''}`}
                style={exportMode ? {
                  gap: `${CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP}px`,
                  ...(kids.length <= 4 ? {} : { minWidth: 'fit-content' })
                } : (kids.length <= 4 ? {} : { minWidth: 'fit-content' })}
              >                {kids.map((kid) => (
                  <div 
                    key={`child-${kid.id}`} 
                    className={kids.length <= 4 ? "flex-1" : "flex-shrink-0"} 
                    style={exportMode ? {
                      ...(kids.length <= 4 ? 
                        { minWidth: `${CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.MIN_RESPONSIVE_WIDTH}px` } : 
                        { width: `${CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.FIXED_CARD_WIDTH}px` }
                      )
                    } : (kids.length <= 4 ? { minWidth: '200px' } : { width: '220px' })}
                  >
                    <SimpleTooltip content={kid.description || ''}>
                      <CapabilityTile 
                        node={kid} 
                        variant="child"
                        onClick={() => onNodeClick?.(kid.id)}
                        exportMode={exportMode}
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
              for (let rowIndex = 0; rowIndex < maxGrandchildrenPerParent; rowIndex++) {                grandchildrenRows.push(
                  <div 
                    key={`grandchildren-row-${rowIndex}`}
                    className={exportMode ? '' : 'mt-3'}
                    style={exportMode ? { 
                      marginTop: `${CAPABILITY_CARD_LAYOUT.SPACING.GRANDCHILD_ROW_GAP}px` 
                    } : {}}
                  >
                    <div 
                      className={`flex ${exportMode ? '' : 'gap-4 pb-2'} ${kids.length <= 4 ? 'w-full' : ''}`}
                      style={exportMode ? {
                        gap: `${CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP}px`,
                        ...(kids.length <= 4 ? {} : { minWidth: 'fit-content' })
                      } : (kids.length <= 4 ? {} : { minWidth: 'fit-content' })}
                    >
                      {kids.map((kid) => {
                        const kidGrandchildren = index.children.get(kid.id) ?? [];
                        const grandchild = kidGrandchildren[rowIndex];
                        
                        return (
                          <div 
                            key={`grandchild-${kid.id}-${rowIndex}`} 
                            className={kids.length <= 4 ? "flex-1" : "flex-shrink-0"} 
                            style={exportMode ? {
                              ...(kids.length <= 4 ? 
                                { minWidth: `${CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.MIN_RESPONSIVE_WIDTH}px` } : 
                                { width: `${CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.FIXED_CARD_WIDTH}px` }
                              )
                            } : (kids.length <= 4 ? { minWidth: '200px' } : { width: '220px' })}
                          >                            {grandchild ? (
                              <SimpleTooltip content={grandchild.description || ''}>
                                <CapabilityTile 
                                  node={grandchild} 
                                  variant="grandchild"
                                  onClick={() => onNodeClick?.(grandchild.id)}
                                  exportMode={exportMode}
                                />
                              </SimpleTooltip>
                            ) : (
                              <div 
                                className={exportMode ? '' : 'h-full'}
                                style={exportMode ? { 
                                  height: `${getCardHeight('grandchild')}px` 
                                } : {}}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div>
                  {grandchildrenRows}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default CapabilityCard;
