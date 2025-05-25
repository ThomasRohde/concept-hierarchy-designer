import React, { ReactNode, useState, useEffect, lazy, Suspense } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from 'react-tooltip';
import remarkGfm from 'remark-gfm';
import './MarkdownTooltip.css';

// Lazy load the ReactMarkdown component for better performance
const LazyReactMarkdown = lazy(() => Promise.resolve({ default: ReactMarkdown }));

interface MarkdownTooltipProps {
  content: string;
  children: ReactNode;
  id?: string;
  className?: string;
  allowHtml?: boolean;
  isPinnable?: boolean; // Allow tooltip to be pinned
  maxHeight?: string; // Control max height with scrolling
}

// Safe URL transformation following GitHub's approach
const defaultUrlTransform = (url: string): string => {
  const protocols = ['http', 'https', 'mailto', 'tel'];
  try {
    const urlObj = new URL(url);
    if (protocols.includes(urlObj.protocol.replace(':', ''))) {
      return url;
    }
    return '';
  } catch (e) {
    // If it's a relative URL or invalid, return as is
    if (url.startsWith('/') || url.startsWith('#')) {
      return url;
    }
    return '';
  }
};

export const MarkdownTooltip: React.FC<MarkdownTooltipProps> = ({
  content,
  children,
  id,
  className,
  allowHtml = false,
  isPinnable = false,
  maxHeight = '300px',
}) => {
  // Generate a random ID if none is provided
  const tooltipId = id || `tooltip-${Math.random().toString(36).substring(2, 9)}`;
  const [isPinned, setIsPinned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinned(!isPinned);
  };

  // Handle escape key to unpin
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPinned) {
        setIsPinned(false);
      }
    };
    
    if (isPinned) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isPinned]);  return (
    <>
      <div 
        data-tooltip-id={tooltipId} 
        className="inline-block"
        aria-describedby={tooltipId}
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        onMouseEnter={() => setIsVisible(true)}
        onFocus={() => setIsVisible(true)}
      >
        {children}
      </div>
      <Tooltip 
        id={tooltipId}
        className={`markdown-tooltip-container ${className || ''}`}
        style={{
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          maxWidth: 'min(90vw, 500px)',
          width: 'max-content'
        }}
        opacity={1}        place="top"
        delayShow={150}
        delayHide={100}
        offset={8}
        noArrow={false}
        positionStrategy="fixed"
        border="1px solid #e2e8f0"
        float={true}
        clickable={true}
        role="tooltip"
        isOpen={isPinned ? true : undefined}
        afterShow={() => setIsVisible(true)} 
        afterHide={() => setIsVisible(false)}
      >        <div className="markdown-content text-sm leading-relaxed" 
             style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
          {isPinnable && (
            <div className="flex justify-end mb-2">              <button 
                className={`p-1 rounded-full text-xs ${isPinned ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                onClick={handlePinClick}
                aria-label={isPinned ? 'Unpin tooltip' : 'Pin tooltip'}
                title={isPinned ? 'Unpin tooltip' : 'Pin tooltip'}
              >
                {isPinned ? '📌' : '📍'}
              </button>
            </div>
          )}
          {isVisible ? (
            <Suspense fallback={
              <div className="markdown-content-loading flex items-center justify-center min-h-[80px]">
                <div className="animate-pulse flex space-x-2">
                  <div className="rounded-full bg-slate-200 h-2 w-2"></div>
                  <div className="rounded-full bg-slate-200 h-2 w-2"></div>
                  <div className="rounded-full bg-slate-200 h-2 w-2"></div>
                </div>
              </div>
            }>
              <LazyReactMarkdown
                remarkPlugins={[remarkGfm]}
                urlTransform={defaultUrlTransform}
                skipHtml={!allowHtml}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  code: ({ node, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <pre className={`bg-gray-50 p-2 rounded`}>
                        <code className={className} {...props}>
                          {children}
                        </code>
                      </pre>
                    ) : (
                      <code className="bg-gray-50 px-1 py-0.5 rounded" {...props}>
                        {children}
                      </code>
                    );
                  },
                  img: ({ src, alt, ...props }) => {
                    const [isLoaded, setIsLoaded] = useState(false);
                    const [hasError, setHasError] = useState(false);
                    
                    return (
                      <div className="my-2 max-w-full">
                        {!isLoaded && !hasError && (
                          <div className="h-24 bg-gray-100 animate-pulse rounded flex items-center justify-center">
                            <span className="text-xs text-gray-400">Loading image...</span>
                          </div>
                        )}
                        {hasError && (
                          <div className="h-12 bg-red-50 rounded flex items-center justify-center">
                            <span className="text-xs text-red-400">Failed to load image</span>
                          </div>
                        )}
                        <img
                          src={src}
                          alt={alt || ""}
                          className={`max-w-full h-auto rounded ${isLoaded ? 'block' : 'hidden'}`}
                          onLoad={() => setIsLoaded(true)}
                          onError={() => setHasError(true)}
                          loading="lazy"
                          {...props}
                        />
                      </div>
                    );
                  },
                  table: ({ children, ...props }) => (
                    <div className="overflow-x-auto my-2 rounded border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200" {...props}>
                        {children}
                      </table>
                    </div>
                  )
                }}
              >
                {content || ''}
              </LazyReactMarkdown>
            </Suspense>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </Tooltip>
    </>
  );
};
