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
    <div className="flex items-center space-x-3 mb-2">
      <Button
        onClick={onExpandAll}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 bg-white hover:bg-blue-50 text-blue-600 border border-blue-200 hover:border-blue-300 rounded-md shadow-sm hover:shadow"
        title="Expand All"
        aria-label="Expand All"      >        <ChevronsDown className="w-4 h-4 text-blue-600" />
        <span className="text-xs font-medium hidden sm:inline">Expand</span>
      </Button>
      <Button
        onClick={onCollapseAll}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300 rounded-md shadow-sm hover:shadow"
        title="Collapse All"
        aria-label="Collapse All"      >
        <ChevronsUp className="w-4 h-4 text-gray-600" />
        <span className="text-xs font-medium hidden sm:inline">Collapse</span>
      </Button>
      <Button
        onClick={onOpenMagicWandSettings}
        disabled={disabled}
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 px-3 py-1.5 transition-all duration-200 bg-white hover:bg-purple-50 text-purple-600 border border-purple-200 hover:border-purple-300 rounded-md shadow-sm hover:shadow"
        title="Prompt"
        aria-label="Prompt"      >
        <Wand2 className="w-4 h-4" />
        <span className="hidden sm:inline">Prompt</span>
      </Button>
    </div>
  );
};

export default TreeControls;
