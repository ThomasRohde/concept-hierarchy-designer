import React from 'react';
import { Button } from './ui/Button';
import { Save } from 'lucide-react';

interface SaveTreeButtonProps {
  onSave: (fileName?: string) => void;
}

const SaveTreeButton: React.FC<SaveTreeButtonProps> = ({ onSave }) => {
  return (
    <Button
      variant="outline"
      onClick={() => onSave('concept-hierarchy')}
      className="flex items-center space-x-2 ml-2"
      title="Save concept hierarchy as JSON"
    >
      <Save className="w-4 h-4" />
      <span>Save as JSON</span>
    </Button>
  );
};

export default SaveTreeButton;
