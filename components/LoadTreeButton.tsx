import React, { useRef } from 'react';
import { Button } from './ui/Button';
import { Upload } from 'lucide-react';

interface LoadTreeButtonProps {
  onLoad: (treeData: any) => void;
}

export default function LoadTreeButton({ onLoad }: LoadTreeButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
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
    <>
      <Button
        onClick={handleClick}
        title="Load Tree from JSON"
        variant="secondary"
        size="sm"
      >
        <Upload size={16} />
        <span className="ml-1">Load</span>
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
    </>
  );
}
