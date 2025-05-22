
import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button'; 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="p-1" aria-label="Close modal">
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        <div className="mt-4">
          {children}
        </div>
        {footer && (
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export { Modal };
