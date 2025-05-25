
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Textarea } from './ui/Textarea';

interface AddChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, description: string) => void;
  parentNodeName?: string;
}

const AddChildModal: React.FC<AddChildModalProps> = ({ isOpen, onClose, onSave, parentNodeName }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
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
      toast.error('Node name cannot be empty.');
      return;
    }
    onSave(name, description);
    onClose(); 
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={parentNodeName ? `Add Child to "${parentNodeName}"` : "Add New Concept"}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="node-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="node-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter concept name"
            required
          />
        </div>
        <div>
          <label htmlFor="node-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <Textarea
            id="node-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter concept description"
            rows={3}          />
        </div>
      </div>
      <div className="mt-4 text-xs text-gray-500 text-center">
        Tip: Press Ctrl+Enter to save, or ESC to cancel
      </div>      <div className="mt-6 flex justify-end space-x-2">
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

export default AddChildModal;
