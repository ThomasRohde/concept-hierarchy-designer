import { Save } from 'lucide-react';
import React from 'react';
import { Button } from './ui/Button';

interface SaveTreeButtonProps {
  onSave: (fileName?: string) => void;
  disabled?: boolean;
}

const SaveTreeButton: React.FC<SaveTreeButtonProps> = ({ onSave, disabled }) => {
  return (    <Button
      variant="outline"
      onClick={() => onSave('concept-hierarchy')}
      className="flex items-center gap-2"
      title="Save concept hierarchy as JSON"
      disabled={disabled}
    >
      <Save className="w-4 h-4" />
      <span className="hidden sm:inline">Save as JSON</span>
    </Button>
  );
};

export default SaveTreeButton;
