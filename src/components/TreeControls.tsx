import React from 'react';
import { Button } from './ui/Button';
import { ChevronsDown, ChevronsUp, Wand2 } from 'lucide-react';

interface TreeControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onOpenMagicWandSettings: () => void;
  disabled?: boolean;
}

const TreeControls: React.FC<TreeControlsProps> = ({  onExpandAll,
  onCollapseAll,
  onOpenMagicWandSettings,
  disabled = false
}) => {
  return (
    <div className="flex items-center space-x-3 mb-2">      <Button
        onClick={onExpandAll}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
        title="Expand All"
        aria-label="Expand All"
      >
        <ChevronsDown className="w-4 h-4" />
        <span className="text-xs font-medium hidden sm:inline">Expand</span>
      </Button>      <Button
        onClick={onCollapseAll}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
        title="Collapse All"
        aria-label="Collapse All"
      >
        <ChevronsUp className="w-4 h-4" />
        <span className="text-xs font-medium hidden sm:inline">Collapse</span>
      </Button>      <Button
        onClick={onOpenMagicWandSettings}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5"
        title="Prompt"
        aria-label="Prompt"
      >
        <Wand2 className="w-4 h-4" />
        <span className="hidden sm:inline">Prompt</span>
      </Button>
    </div>
  );
};

export default TreeControls;
