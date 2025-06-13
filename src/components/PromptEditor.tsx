import React, { useState, useEffect } from 'react';
import { X, Save, Copy, Eye, EyeOff, Tag, Calendar, Cloud } from 'lucide-react';
import { Prompt } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { Modal } from './ui/Modal';

interface PromptEditorProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: Prompt | null;
  onSave: (prompt: Prompt) => void;
  onDelete?: (promptId: string) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General', description: 'Universal prompts for any domain' },
  { value: 'academic', label: 'Academic', description: 'Research and scholarly contexts' },
  { value: 'business', label: 'Business', description: 'Strategic and operational planning' },
  { value: 'creative', label: 'Creative', description: 'Innovation and artistic projects' },
  { value: 'technical', label: 'Technical', description: 'Engineering and systems design' },
] as const;

export const PromptEditor: React.FC<PromptEditorProps> = ({
  isOpen,
  onClose,
  prompt,
  onSave,
  onDelete,
}) => {
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Initialize editing state when prompt changes
  useEffect(() => {
    if (prompt) {
      setEditingPrompt({ ...prompt });
    } else {
      setEditingPrompt(null);
    }
    setShowPreview(false);
  }, [prompt]);

  const handleSave = () => {
    if (!editingPrompt) return;

    const updatedPrompt: Prompt = {
      ...editingPrompt,
      lastModified: new Date(),
    };

    onSave(updatedPrompt);
    onClose();
  };

  const handleCancel = () => {
    setEditingPrompt(null);
    setShowPreview(false);
    onClose();
  };

  const handleDelete = () => {
    if (!editingPrompt || !onDelete) return;
    
    if (confirm(`Are you sure you want to delete "${editingPrompt.name}"? This action cannot be undone.`)) {
      onDelete(editingPrompt.id);
      onClose();
    }
  };

  const handleCopyContent = async () => {
    if (!editingPrompt?.content) return;
    
    try {
      await navigator.clipboard.writeText(editingPrompt.content);
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy prompt content:', error);
    }
  };

  const handleAddTag = () => {
    if (!editingPrompt || !tagInput.trim()) return;
    
    const newTag = tagInput.trim().toLowerCase();
    if (!editingPrompt.tags.includes(newTag)) {
      setEditingPrompt({
        ...editingPrompt,
        tags: [...editingPrompt.tags, newTag],
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!editingPrompt) return;
    
    setEditingPrompt({
      ...editingPrompt,
      tags: editingPrompt.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (!editingPrompt) return null;

  return (    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title={prompt?.isDefault ? `${editingPrompt.name} (Read-only)` : editingPrompt.name}
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prompt-name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="prompt-name"
              type="text"
              value={editingPrompt.name}
              onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
              placeholder="Enter prompt name..."
              disabled={editingPrompt.isDefault}
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="prompt-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="prompt-category"
              value={editingPrompt.category}
              onChange={(e) => setEditingPrompt({ 
                ...editingPrompt, 
                category: e.target.value as Prompt['category']
              })}
              disabled={editingPrompt.isDefault}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            >
              {CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="prompt-description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            id="prompt-description"
            type="text"
            value={editingPrompt.description}
            onChange={(e) => setEditingPrompt({ ...editingPrompt, description: e.target.value })}
            placeholder="Brief description of what this prompt does..."
            disabled={editingPrompt.isDefault}
            className="w-full"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {editingPrompt.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
                {!editingPrompt.isDefault && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          {!editingPrompt.isDefault && (
            <div className="flex gap-2">
              <Input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button
                onClick={handleAddTag}
                variant="outline"
                disabled={!tagInput.trim()}
              >
                Add Tag
              </Button>
            </div>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="prompt-content" className="block text-sm font-medium text-gray-700">
              Prompt Content
            </label>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyContent}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>
          </div>
          
          {showPreview ? (
            <div className="w-full h-64 p-3 border border-gray-300 rounded-md bg-gray-50 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">{editingPrompt.content}</pre>
            </div>
          ) : (
            <Textarea
              id="prompt-content"
              value={editingPrompt.content}
              onChange={(e) => setEditingPrompt({ ...editingPrompt, content: e.target.value })}
              placeholder="Enter your prompt content with markdown formatting..."
              rows={12}
              disabled={editingPrompt.isDefault}
              className="w-full font-mono text-sm"
            />
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-200">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Created: {editingPrompt.createdAt instanceof Date ? editingPrompt.createdAt.toLocaleDateString() : new Date(editingPrompt.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Modified: {editingPrompt.lastModified instanceof Date ? editingPrompt.lastModified.toLocaleDateString() : new Date(editingPrompt.lastModified).toLocaleDateString()}
          </div>
          {editingPrompt.usageCount !== undefined && editingPrompt.usageCount > 0 && (
            <div>Used {editingPrompt.usageCount} times</div>
          )}
          <div className="flex items-center gap-1 text-blue-600">
            <Cloud className="w-3 h-3" />
            Auto-syncs to all devices
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
        <div>
          {!editingPrompt.isDefault && onDelete && (
            <Button
              onClick={handleDelete}
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:border-red-300"
            >
              Delete Prompt
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleCancel}
            variant="outline"
          >
            Cancel
          </Button>
          {!editingPrompt.isDefault && (
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
