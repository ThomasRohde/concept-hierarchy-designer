import { Upload } from 'lucide-react';
import React, { useRef } from 'react';
import { Button } from './ui/Button';

interface LoadTreeButtonProps {
  onLoad: (treeData: any) => void;
  disabled?: boolean;
}

export default function LoadTreeButton({ onLoad, disabled }: LoadTreeButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onLoad(json);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
        // You could integrate with toast here if needed
      }
    };
    reader.readAsText(file);

    // Reset the file input so the same file can be loaded again if needed
    e.target.value = '';
  };

  return (
    <>      <Button
        variant="outline" 
        onClick={handleClick}
        className="flex items-center gap-2"
        title="Load concept hierarchy from JSON file"
        disabled={disabled}
      >
        <Upload className="w-4 h-4" />
        <span className="hidden sm:inline">Load JSON</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
        aria-label="Upload JSON file"
      />
    </>
  );
}
