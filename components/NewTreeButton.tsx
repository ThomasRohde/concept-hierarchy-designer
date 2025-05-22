import React from 'react';
import { Button } from './ui/Button';
import { FilePlus2 } from 'lucide-react'; // Using a different icon for "New File/Tree"

interface NewTreeButtonProps {
  onClick: () => void;
}

const NewTreeButton: React.FC<NewTreeButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="flex items-center space-x-2"
      title="Start a new concept hierarchy"
    >
      <FilePlus2 className="w-4 h-4" />
      <span>New Tree</span>
    </Button>
  );
};

export default NewTreeButton;