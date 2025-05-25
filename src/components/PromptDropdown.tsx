import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Wand2, Settings, Plus, Search } from 'lucide-react';
import { Prompt } from '../types';
import { Button } from './ui/Button';

interface PromptDropdownProps {
  selectedPrompt: Prompt | null;
  prompts: Prompt[];
  onPromptSelect: (promptId: string) => void;
  onOpenPromptEditor: () => void;
  onCreateNewPrompt: () => void;
  disabled?: boolean;
}

export const PromptDropdown: React.FC<PromptDropdownProps> = ({
  selectedPrompt,
  prompts,
  onPromptSelect,
  onOpenPromptEditor,
  onCreateNewPrompt,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter prompts based on search query
  const filteredPrompts = searchQuery.trim()
    ? prompts.filter(prompt =>
        prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : prompts;

  // Sort prompts: recently used first, then default prompts, then by name
  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    // Recently used first
    if (a.lastUsed && b.lastUsed) {
      return b.lastUsed.getTime() - a.lastUsed.getTime();
    }
    if (a.lastUsed && !b.lastUsed) return -1;
    if (!a.lastUsed && b.lastUsed) return 1;
    
    // Default prompts next
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    
    // Then by name
    return a.name.localeCompare(b.name);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handlePromptSelect = (promptId: string) => {
    onPromptSelect(promptId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleManagePrompts = () => {
    onOpenPromptEditor();
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleCreateNew = () => {
    onCreateNewPrompt();
    setIsOpen(false);
    setSearchQuery('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'creative': return 'bg-purple-100 text-purple-800';
      case 'technical': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        variant="outline"
        className="flex items-center gap-2 min-w-[140px] justify-between"
        title={selectedPrompt ? `Current: ${selectedPrompt.name}` : 'Select Prompt'}
        aria-label="Select AI Prompt"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4" />
          <span className="hidden sm:inline truncate max-w-[100px]">
            {selectedPrompt?.name || 'Select Prompt'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-96 overflow-hidden flex flex-col">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Prompts List */}
          <div className="flex-1 overflow-y-auto">
            {sortedPrompts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No prompts found matching "{searchQuery}"
              </div>
            ) : (
              sortedPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => handlePromptSelect(prompt.id)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                    selectedPrompt?.id === prompt.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm truncate">
                          {prompt.name}
                        </span>
                        {prompt.isDefault && (
                          <span className="px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                        {prompt.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 text-xs rounded ${getCategoryColor(prompt.category)}`}>
                          {prompt.category}
                        </span>
                        {prompt.usageCount && prompt.usageCount > 0 && (
                          <span className="text-xs text-gray-500">
                            Used {prompt.usageCount}x
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedPrompt?.id === prompt.id && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-100 p-2 flex gap-1">
            <button
              onClick={handleCreateNew}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Prompt
            </button>
            <button
              onClick={handleManagePrompts}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <Settings className="w-4 h-4" />
              Manage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
