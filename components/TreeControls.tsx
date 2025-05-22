import React from 'react';
import { Button } from './ui/Button';

interface TreeControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  disabled?: boolean;
}

const TreeControls: React.FC<TreeControlsProps> = ({
  onExpandAll,
  onCollapseAll,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-3 mb-2">
      <Button
        onClick={onExpandAll}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 rounded-md shadow-sm hover:shadow"
        title="Expand All"
        aria-label="Expand All"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-blue-600"
        >
          <path d="M21 6H3"/>
          <path d="M10 12H3"/>
          <path d="M17 18H3"/>
          <path d="m18 9-3-3 3-3"/>
          <path d="m17 15 3 3-3 3"/>
        </svg>
        <span className="text-xs font-medium hidden sm:inline">Expand</span>
      </Button>
      <Button
        onClick={onCollapseAll}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 hover:border-purple-300 rounded-md shadow-sm hover:shadow"
        title="Collapse All"
        aria-label="Collapse All"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-purple-600"
        >
          <path d="M21 18H3"/>
          <path d="M21 12H3"/>
          <path d="M21 6H3"/>
          <path d="m7 9-3 3 3 3"/>
          <path d="m17 9 3 3-3 3"/>
        </svg>
        <span className="text-xs font-medium hidden sm:inline">Collapse</span>
      </Button>
    </div>
  );
};

export default TreeControls;
