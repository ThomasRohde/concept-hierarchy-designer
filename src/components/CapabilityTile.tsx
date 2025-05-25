import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CapabilityCardData, NodeData } from '../types';
import { getMaturityColor, getAverageMaturity } from '../utils/capabilityCardUtils';

interface CapabilityTileProps {
  node: NodeData | CapabilityCardData;
  span?: boolean; // Whether this tile should span full width
  onClick?: () => void; // Handler for when tile is clicked
  variant?: 'current' | 'child' | 'grandchild';
  className?: string; // Additional CSS classes
}

const CapabilityTile: React.FC<CapabilityTileProps> = ({ 
  node, 
  span = false, 
  onClick,
  variant = 'child',
  className = ''
}) => {
  if (!node) {
    return null;
  }

  // Check if this is extended capability data
  const isCapabilityData = (data: NodeData | CapabilityCardData): data is CapabilityCardData => {
    return 'maturity' in data || 'outcomes' in data || 'keyMetrics' in data;
  };

  const capabilityData = isCapabilityData(node) ? node : null;
  const averageMaturity = capabilityData?.maturity ? getAverageMaturity(capabilityData.maturity) : 0;
  const getVariantClasses = () => {
    switch (variant) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-600 shadow-lg'; // Blue background like in the image
      case 'child':
        return 'bg-pink-400 text-white border-pink-500 shadow-md'; // Pink/salmon background like in the image
      case 'grandchild':
        return 'bg-green-400 text-white border-green-500 shadow-sm'; // Green background like in the image
      default:
        return 'bg-white border-gray-200 shadow-sm';
    }
  };  return (
    <div
      className={`
        rounded-lg border transition-all duration-200 flex flex-col
        ${variant === 'child' ? 'h-auto' : 'h-full'}
        ${getVariantClasses()}
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''}
        ${span ? 'col-span-full' : ''}
        ${className}
        ${variant === 'current' ? 'p-6' : variant === 'child' ? 'p-4' : 'p-3'}
      `}
      onClick={onClick}
    >{/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-semibold leading-tight ${
          variant === 'current' ? 'text-xl text-white' : 
          variant === 'child' ? 'text-base text-white' : 
          variant === 'grandchild' ? 'text-sm text-white' : 'text-gray-800'
        }`}>
          {node.name}
        </h3>
        
        {/* Maturity indicator */}
        {averageMaturity > 0 && (
          <div className="ml-2 flex-shrink-0">
            <div 
              className={`w-3 h-3 rounded-full ${getMaturityColor(averageMaturity)} ${
                variant === 'current' || variant === 'child' || variant === 'grandchild' ? 
                'ring-2 ring-white' : ''
              }`}
              title={`Maturity Level: ${averageMaturity.toFixed(1)}/5`}
            />
          </div>
        )}
      </div>      {/* Description */}
      {node.description && (
        <div className={`leading-relaxed mb-3 flex-grow ${
          variant === 'current' ? 'text-base line-clamp-4 text-blue-100' : 
          variant === 'child' ? 'text-sm text-white/90 line-clamp-3' : 
          variant === 'grandchild' ? 'text-xs text-white/90 line-clamp-2' : 'text-gray-600'
        }`}>          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              p: ({ children, ...props }) => (
                <p className="mb-2 last:mb-0" {...props}>{children}</p>
              ),
              strong: ({ children, ...props }) => (
                <strong className="font-semibold" {...props}>{children}</strong>
              ),
              em: ({ children, ...props }) => (
                <em className="italic" {...props}>{children}</em>
              ),
              code: ({ children, ...props }) => (
                <code className="bg-white/20 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                  {children}
                </code>
              ),
              ul: ({ children, ...props }) => (
                <ul className="list-disc list-inside mb-2" {...props}>{children}</ul>
              ),
              ol: ({ children, ...props }) => (
                <ol className="list-decimal list-inside mb-2" {...props}>{children}</ol>
              ),
              li: ({ children, ...props }) => (
                <li className="mb-1" {...props}>{children}</li>
              )
            }}
          >
            {node.description}
          </ReactMarkdown>
        </div>
      )}

      {/* Extended fields for capability data */}
      {capabilityData && variant === 'current' && (
        <div className="space-y-2 mt-auto">          {/* Outcomes */}
          {capabilityData.outcomes && capabilityData.outcomes.length > 0 && (
            <div className="text-xs">
              <span className="font-medium text-blue-100">Outcomes:</span>              <div className="flex flex-wrap gap-1 mt-1">
                {capabilityData.outcomes.slice(0, 3).map((outcome: string, index: number) => (
                  <span
                    key={index}
                    className="inline-block bg-white/20 text-white px-2 py-1 rounded text-xs"
                  >
                    {outcome}
                  </span>
                ))}
                {capabilityData.outcomes.length > 3 && (
                  <span className="text-blue-200 text-xs">
                    +{capabilityData.outcomes.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}          {/* Key Metrics */}
          {capabilityData.keyMetrics && (
            <div className="text-xs">
              <span className="font-medium text-blue-100">Key Metrics:</span>              <div className="grid grid-cols-2 gap-1 mt-1">
                {capabilityData.keyMetrics.customer && capabilityData.keyMetrics.customer.length > 0 && (
                  <div className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                    Customer: {capabilityData.keyMetrics.customer.length}
                  </div>
                )}
                {capabilityData.keyMetrics.process && capabilityData.keyMetrics.process.length > 0 && (
                  <div className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                    Process: {capabilityData.keyMetrics.process.length}
                  </div>
                )}
                {capabilityData.keyMetrics.learning && capabilityData.keyMetrics.learning.length > 0 && (
                  <div className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                    Learning: {capabilityData.keyMetrics.learning.length}
                  </div>
                )}
                {capabilityData.keyMetrics.finance && capabilityData.keyMetrics.finance.length > 0 && (
                  <div className="bg-white/20 text-white px-2 py-1 rounded text-xs">
                    Finance: {capabilityData.keyMetrics.finance.length}
                  </div>
                )}
              </div>
            </div>
          )}          {/* Maturity breakdown for current node */}
          {capabilityData.maturity && (
            <div className="text-xs">
              <span className="font-medium text-blue-100">Maturity:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                <span className={`px-2 py-1 rounded text-xs ${getMaturityColor(capabilityData.maturity.people)} text-white`}>
                  People: {capabilityData.maturity.people}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getMaturityColor(capabilityData.maturity.process)} text-white`}>
                  Process: {capabilityData.maturity.process}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getMaturityColor(capabilityData.maturity.data)} text-white`}>
                  Data: {capabilityData.maturity.data}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getMaturityColor(capabilityData.maturity.tech)} text-white`}>
                  Tech: {capabilityData.maturity.tech}
                </span>
              </div>
            </div>
          )}
        </div>
      )}      {/* Footer indicators for child/grandchild nodes */}
      {variant !== 'current' && averageMaturity > 0 && (
        <div className="mt-auto pt-2 border-t border-white/30">
          <div className="flex items-center justify-between text-xs text-white/80">
            <span>Maturity</span>
            <span className="font-medium">{averageMaturity.toFixed(1)}/5</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapabilityTile;
