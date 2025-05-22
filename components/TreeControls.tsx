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
    <div className="flex items-center space-x-2 mb-2">
      <Button
        onClick={onExpandAll}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className="p-1.5 text-gray-700"
        title="Expand All"
        aria-label="Expand All"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="lucide lucide-chevrons-down-up"
        >
          <path d="m7 20 5 5 5-5"/>
          <path d="m7 4 5-5 5 5"/>
        </svg>
      </Button>
      <Button
        onClick={onCollapseAll}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className="p-1.5 text-gray-700"
        title="Collapse All"
        aria-label="Collapse All"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="lucide lucide-chevrons-up-down"
        >
          <path d="m7 15 5 5 5-5"/>
          <path d="m7 9 5-5 5 5"/>
        </svg>
      </Button>
    </div>
  );
};

export default TreeControls;
