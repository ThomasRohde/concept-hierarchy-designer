import React, { useCallback, useEffect, useState } from 'react';

import { Modal } from './ui/Modal';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';

import { DEFAULT_GENERATION_GUIDELINES } from '../hooks/useMagicWand';

interface MagicWandSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGuidelines?: string;
  onSave: (guidelines: string) => void;
  onReset: () => void;
}

export const MagicWandSettingsModal: React.FC<MagicWandSettingsModalProps> = ({
  isOpen,
  onClose,
  currentGuidelines,
  onSave,
  onReset
}) => {
  const [guidelines, setGuidelines] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setGuidelines(currentGuidelines || DEFAULT_GENERATION_GUIDELINES);
    }
  }, [isOpen, currentGuidelines]);

  // Handle RETURN key for submission
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSave();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, guidelines]);

  const handleReset = useCallback(() => {
    setGuidelines(DEFAULT_GENERATION_GUIDELINES);
    onReset();
  }, [onReset]);

  const handleSave = useCallback(() => {
    onSave(guidelines);
    onClose();
  }, [guidelines, onSave, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Prompt"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="guidelines" className="block text-sm font-medium text-gray-700 mb-1">
            Generation Guidelines
          </label>
          <Textarea
            id="guidelines"
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
            placeholder="Enter customized generation guidelines..."
            rows={10}
            className="w-full"
          />
          <p className="mt-2 text-sm text-gray-500">
            These guidelines will be used to instruct the AI on how to generate child concepts. Use Markdown formatting.
          </p>
        </div>
      </div>      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={handleReset} title="Reset to Default">
          Reset to Default
        </Button>
        <Button variant="outline" onClick={onClose} title="Cancel (ESC)">
          Cancel
        </Button>
        <Button onClick={handleSave} title="Save (Ctrl+Enter)">
          Save
        </Button>
      </div>
    </Modal>
  );
};

export default MagicWandSettingsModal;
