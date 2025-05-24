import React from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nodeName?: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, nodeName }) => {
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
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }}>
          Delete
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
