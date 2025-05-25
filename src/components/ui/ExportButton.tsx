import React from 'react';
import { Download } from 'lucide-react';
import { Button } from './Button';
import ExportDropdown from './ExportDropdown';

interface ExportButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Simple Export Button component for use in places where we don't need the full dropdown
 */
const ExportButton: React.FC<ExportButtonProps> = ({
  onClick,
  disabled = false,
  className = ''
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className={`flex items-center gap-1 text-sm ${className}`}
    >
      <Download className="w-4 h-4 mr-1" />
      Export
    </Button>
  );
};

export default ExportButton;
