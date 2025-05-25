import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';

interface NewTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
}

const NewTreeModal: React.FC<NewTreeModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('New Root Concept');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Reset to defaults when modal opens, or keep last values if preferred
      setName('New Root Concept');
      setDescription('');
    }
  }, [isOpen]);

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
  }, [isOpen, name, description]);

  const handleSave = () => {
    if (name.trim() === '') {
      toast.error('Root node name cannot be empty.');
      return;
    }
    onSave(name, description);
    onClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Start a New Concept Hierarchy"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="root-node-name" className="block text-sm font-medium text-gray-700 mb-1">
            Root Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="root-node-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter root concept name"
            required
          />
        </div>
        <div>
          <label htmlFor="root-node-description" className="block text-sm font-medium text-gray-700 mb-1">
            Root Description (Optional)
          </label>
          <Textarea
            id="root-node-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter root concept description"
            rows={3}          />
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        Tip: Press Ctrl+Enter to create, or ESC to cancel
      </div>      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} title="Cancel (ESC)">
          Cancel
        </Button>
        <Button onClick={handleSave} title="Create New Tree (Ctrl+Enter)">
          Create New Tree
        </Button>
      </div>
    </Modal>
  );
};

export default NewTreeModal;