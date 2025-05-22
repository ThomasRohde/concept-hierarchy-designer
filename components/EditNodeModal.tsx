import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { NodeData } from '../types';

interface EditNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, newName: string, newDescription: string) => void;
  nodeToEdit: NodeData | null;
}

const EditNodeModal: React.FC<EditNodeModalProps> = ({ isOpen, onClose, onSave, nodeToEdit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen && nodeToEdit) {
      setName(nodeToEdit.label);
      setDescription(nodeToEdit.description || '');
    } else if (!isOpen) {
      // Reset when modal is closed or no node is being edited
      setName('');
      setDescription('');
    }
  }, [isOpen, nodeToEdit]);

  const handleSave = () => {
    if (!nodeToEdit) return;
    if (name.trim() === '') {
      alert('Node name cannot be empty.');
      return;
    }
    onSave(nodeToEdit.id, name, description);
    onClose();
  };

  if (!nodeToEdit) return null; // Or some loading/error state if preferred while nodeToEdit is null but isOpen is true

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Node: "${nodeToEdit.label}"`}
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="edit-node-name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="edit-node-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter concept name"
            required
          />
        </div>
        <div>
          <label htmlFor="edit-node-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <Textarea
            id="edit-node-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter concept description"
            rows={3}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Modal>
  );
};

export default EditNodeModal;