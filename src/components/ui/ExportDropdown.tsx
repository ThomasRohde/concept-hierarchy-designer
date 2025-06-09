import React, { useState, useRef } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { ExportFormat } from '../../utils/exportUtils/exportUtils.js';
import { Button } from './Button';

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
}

const ExportDropdown: React.FC<ExportDropdownProps> = ({
  onExport,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const exportFormats: { id: ExportFormat; label: string }[] = [
    { id: 'svg-enhanced', label: 'SVG Image (.svg)' },
    // { id: 'svg', label: 'SVG Image (.svg) - Legacy' },
    // { id: 'png', label: 'PNG Image (.png)' },
    // { id: 'pdf', label: 'PDF Document (.pdf)' },
    { id: 'html', label: 'HTML File (.html)' },
    { id: 'json', label: 'JSON Data (.json)' }
  ];

  const handleFormatClick = (format: ExportFormat) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center gap-1 text-sm"
        disabled={disabled}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Download className="w-4 h-4 mr-1" />
        Export
        <ChevronDown className="w-3 h-3 ml-1" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-1 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => handleFormatClick(format.id)}
                className="text-left w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {format.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
