import { FilePlus2 } from 'lucide-react'; // Using a different icon for "New File/Tree"
import React from 'react';
import { Button } from './ui/Button';

interface NewTreeButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const NewTreeButton: React.FC<NewTreeButtonProps> = ({ onClick, disabled }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center space-x-2"
      title="Start a new concept hierarchy"
      disabled={disabled}
    >
      <FilePlus2 className="w-4 h-4" />
      <span className="hidden sm:inline">New Tree</span>
    </Button>
  );
};

export default NewTreeButton;