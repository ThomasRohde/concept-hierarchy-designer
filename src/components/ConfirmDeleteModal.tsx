import React, { useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nodeName?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, nodeName }) => {
  // Handle RETURN key for confirmation (delete action)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        onConfirm();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onConfirm, onClose]);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Deletion"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-700">
          Are you sure you want to delete the node{nodeName ? ` "${nodeName}"` : ''} and all its children? This action cannot be undone.
        </p>
      </div>      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} title="Cancel (ESC)">
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }} title="Delete (Enter)">
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
