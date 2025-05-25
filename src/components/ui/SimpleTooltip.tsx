import React, { ReactNode, useState, lazy, Suspense, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from 'react-tooltip';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import './SimpleTooltip.css';

// Lazy load the ReactMarkdown component for better performance
const LazyReactMarkdown = lazy(() => Promise.resolve({ default: ReactMarkdown }));

interface SimpleTooltipProps {
  content: string;
  children: ReactNode;
  id?: string;
  className?: string;
  allowHtml?: boolean;
  maxHeight?: string;
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

export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  id,
  className,
  allowHtml = false,
  maxHeight = '300px',
}) => {
  // Generate a random ID if none is provided
  const tooltipId = id || `simple-tooltip-${Math.random().toString(36).substring(2, 9)}`;
  const [isVisible, setIsVisible] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll events to prevent page scrolling when scrolling within tooltip
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrollable = scrollHeight > clientHeight;
      
      if (isScrollable) {
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        
        // Prevent page scroll when scrolling within bounds
        if ((!isAtTop && e.deltaY < 0) || (!isAtBottom && e.deltaY > 0)) {
          e.stopPropagation();
        } else {
          // At boundaries, still prevent page scroll briefly to avoid jarring
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };

    const container = scrollContainerRef.current;
    if (container && isVisible) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isVisible]);

  // Don't render tooltip if no content
  if (!content || content.trim() === '') {
    return <>{children}</>;
  }
  return (
    <>      <div 
        data-tooltip-id={tooltipId} 
        className="h-full w-full"
        aria-describedby={tooltipId}
        onMouseEnter={() => setIsVisible(true)}
        onFocus={() => setIsVisible(true)}
      >
        {children}
      </div>
      <Tooltip 
        id={tooltipId}
        className={`simple-tooltip-container ${className || ''}`}
        style={{
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 9999,
          maxWidth: 'min(90vw, 400px)',
          width: 'max-content'
        }}
        opacity={1}
        place="top"
        delayShow={150}
        delayHide={100}
        offset={8}
        noArrow={false}
        positionStrategy="fixed"
        border="1px solid #e2e8f0"
        float={true}
        clickable={true}
        role="tooltip"
        afterShow={() => setIsVisible(true)} 
        afterHide={() => setIsVisible(false)}
      >        <div 
          ref={scrollContainerRef}
          className="simple-tooltip-content text-sm leading-relaxed" 
          style={{ maxHeight: maxHeight, overflowY: 'auto' }}
          onMouseEnter={(e) => {
            // Ensure tooltip stays open when hovering over scrollable content
            e.stopPropagation();
          }}
        >
          {isVisible ? (
            <Suspense fallback={
              <div className="simple-tooltip-content-loading flex items-center justify-center min-h-[60px]">
                <div className="animate-pulse flex space-x-2">
                  <div className="rounded-full bg-slate-200 h-2 w-2"></div>
                  <div className="rounded-full bg-slate-200 h-2 w-2"></div>
                  <div className="rounded-full bg-slate-200 h-2 w-2"></div>
                </div>
              </div>
            }>
              <LazyReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                urlTransform={defaultUrlTransform}
                skipHtml={!allowHtml}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} target="_blank" rel="noopener noreferrer" />
                  ),
                  p: ({ children, ...props }) => (
                    <p className="mb-2 last:mb-0" {...props}>{children}</p>
                  ),
                  strong: ({ children, ...props }) => (
                    <strong className="font-semibold" {...props}>{children}</strong>
                  ),
                  em: ({ children, ...props }) => (
                    <em className="italic" {...props}>{children}</em>
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
                  ul: ({ children, ...props }) => (
                    <ul className="list-disc list-inside mb-2" {...props}>{children}</ul>
                  ),
                  ol: ({ children, ...props }) => (
                    <ol className="list-decimal list-inside mb-2" {...props}>{children}</ol>
                  ),
                  li: ({ children, ...props }) => (
                    <li className="mb-1" {...props}>{children}</li>
                  ),
                  h1: ({ children, ...props }) => (
                    <h1 className="text-lg font-bold mb-2 border-b border-gray-200 pb-1" {...props}>{children}</h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 className="text-base font-bold mb-2" {...props}>{children}</h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 className="text-sm font-bold mb-1" {...props}>{children}</h3>
                  ),
                  blockquote: ({ children, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-3 italic text-gray-600 my-2" {...props}>
                      {children}
                    </blockquote>
                  ),
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

export default SimpleTooltip;
