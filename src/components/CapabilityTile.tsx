import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { NodeData } from '../types';

interface CapabilityTileProps {
  node: NodeData;
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

  // Process description to remove name prefix if present
  let processedDescription = node.description;
  if (node.description && node.name && node.description.startsWith(node.name)) {
    processedDescription = node.description.substring(node.name.length).trimStart();
  }

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
        rounded-lg border transition-all duration-200 flex flex-col h-full w-full
        ${getVariantClasses()}
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        ${span ? 'col-span-full' : ''}
        ${className}
        ${variant === 'current' ? 'p-6' : variant === 'child' ? 'p-4' : 'p-3'}
      `}
      onClick={onClick}
    >
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`font-semibold leading-tight ${
            variant === 'current' ? 'text-xl text-white' : 
            variant === 'child' ? 'text-base text-white' : 
            variant === 'grandchild' ? 'text-sm text-white' : 'text-gray-800'
          }`}>
            {node.name}
          </h3>
        </div>{/* Description */}
      {processedDescription && (
        <div className={`leading-relaxed mb-3 flex-grow overflow-hidden ${
          variant === 'current' ? 'text-base text-blue-100' : 
          variant === 'child' ? 'text-sm text-white/90' : 
          variant === 'grandchild' ? 'text-xs text-white/90' : 'text-gray-600'
        }`}>
          <div className={`${
            variant === 'current' ? 'line-clamp-4' : 
            variant === 'child' ? 'line-clamp-3' : 
            variant === 'grandchild' ? 'line-clamp-2' : ''
          }`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                p: ({ children, ...props }) => (
                  <p className="mb-1 last:mb-0" {...props}>{children}</p>
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
                  <ul className="list-disc list-inside mb-1" {...props}>{children}</ul>
                ),
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal list-inside mb-1" {...props}>{children}</ol>
                ),
                li: ({ children, ...props }) => (
                  <li className="mb-0.5" {...props}>{children}</li>
                )
              }}            >
              {processedDescription}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default CapabilityTile;
