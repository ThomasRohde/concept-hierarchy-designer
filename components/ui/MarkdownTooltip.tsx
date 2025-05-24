import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from 'react-tooltip';
import remarkGfm from 'remark-gfm';
import './MarkdownTooltip.css';

interface MarkdownTooltipProps {
  content: string;
  children: ReactNode;
  id?: string;
  className?: string;
  allowHtml?: boolean;
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
}) => {
  // Generate a random ID if none is provided
  const tooltipId = id || `tooltip-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <>      <div data-tooltip-id={tooltipId} className="inline-block">
        {children}
      </div>      <Tooltip 
        id={tooltipId}
        className={`max-w-2xl markdown-tooltip-container ${className || ''}`}
        style={{
          backgroundColor: 'white',
          color: '#333',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 9999
        }}
        opacity={1}
        place="top"
        delayShow={300}
        offset={8}
        noArrow={true}
        positionStrategy="fixed"
      >
        <div className="markdown-content text-sm leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            urlTransform={defaultUrlTransform}
            skipHtml={!allowHtml}
            components={{              a: ({ node, ...props }) => (
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
              }
            }}          >
            {content || ''}
          </ReactMarkdown>
        </div>
      </Tooltip>
    </>
  );
};
