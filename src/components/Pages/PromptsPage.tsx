import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Download, Upload, Wand2, Clock, Hash, Star } from 'lucide-react';
import { Prompt } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PromptEditor } from '../PromptEditor';
import { filterPrompts, sortPrompts, createNewPrompt } from '../../utils/promptUtils';

interface PromptsPageProps {
  prompts: Prompt[];
  onPromptSave: (prompt: Prompt) => void;
  onPromptDelete: (promptId: string) => void;
  onPromptSelect: (promptId: string) => void;
  activePromptId: string | null;
}

type SortOption = 'name' | 'lastUsed' | 'usageCount' | 'category';

export const PromptsPage: React.FC<PromptsPageProps> = ({
  prompts,
  onPromptSave,
  onPromptDelete,
  onPromptSelect,
  activePromptId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Filter and sort prompts
  const filteredAndSortedPrompts = useMemo(() => {
    let filtered = filterPrompts(prompts, searchQuery);
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }
    
    return sortPrompts(filtered, sortBy);
  }, [prompts, searchQuery, selectedCategory, sortBy]);

  // Get categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(prompts.map(p => p.category)));
    return uniqueCategories.sort();
  }, [prompts]);

  const handleCreateNew = () => {
    const newPrompt = createNewPrompt();
    setEditingPrompt(newPrompt);
    setIsEditorOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsEditorOpen(true);
  };

  const handleSavePrompt = (prompt: Prompt) => {
    onPromptSave(prompt);
    setIsEditorOpen(false);
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (promptId: string) => {
    onPromptDelete(promptId);
    setIsEditorOpen(false);
    setEditingPrompt(null);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingPrompt(null);
  };

  const handleExportPrompts = () => {
    const dataStr = JSON.stringify(filteredAndSortedPrompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `prompts-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPrompts = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedPrompts = JSON.parse(e.target?.result as string) as Prompt[];
          importedPrompts.forEach(prompt => {
            // Assign new IDs to avoid conflicts
            const newPrompt = {
              ...prompt,
              id: `imported-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              createdAt: new Date(prompt.createdAt),
              lastModified: new Date(prompt.lastModified),
              lastUsed: prompt.lastUsed ? new Date(prompt.lastUsed) : undefined,
              isDefault: false, // Imported prompts are never default
            };
            onPromptSave(newPrompt);
          });
        } catch (error) {
          console.error('Error importing prompts:', error);
          alert('Error importing prompts. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'business': return 'bg-green-100 text-green-800 border-green-200';
      case 'creative': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'technical': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSortIcon = (option: SortOption) => {
    switch (option) {
      case 'name': return <span className="text-xs">A-Z</span>;
      case 'lastUsed': return <Clock className="w-4 h-4" />;
      case 'usageCount': return <Hash className="w-4 h-4" />;
      case 'category': return <Filter className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Prompts</h1>
        <p className="text-gray-600">
          Manage your collection of AI prompts for concept generation.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search prompts by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Prompt
            </Button>
            <Button onClick={handleExportPrompts} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={handleImportPrompts} variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <div className="flex gap-1">
              {([
                { key: 'name', label: 'Name' },
                { key: 'lastUsed', label: 'Recent' },
                { key: 'usageCount', label: 'Usage' },
                { key: 'category', label: 'Category' },
              ] as const).map(option => (
                <button
                  key={option.key}
                  onClick={() => setSortBy(option.key)}
                  className={`px-3 py-1 rounded text-sm flex items-center gap-1 transition-colors ${
                    sortBy === option.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {getSortIcon(option.key)}
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAndSortedPrompts.length} of {prompts.length} prompts
      </div>

      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className={`bg-white rounded-lg border-2 p-6 transition-all hover:shadow-md ${
              activePromptId === prompt.id
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate mb-1">
                  {prompt.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded border ${getCategoryColor(prompt.category)}`}>
                    {prompt.category}
                  </span>
                  {prompt.isDefault && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 rounded">
                      Default
                    </span>
                  )}
                  {activePromptId === prompt.id && (
                    <Star className="w-4 h-4 text-blue-500" fill="currentColor" />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {prompt.description}
            </p>

            {/* Tags */}
            {prompt.tags.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {prompt.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      +{prompt.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-500 mb-4">
              <div>Modified: {prompt.lastModified.toLocaleDateString()}</div>
              {prompt.usageCount !== undefined && prompt.usageCount > 0 && (
                <div>Used {prompt.usageCount} times</div>
              )}
              {prompt.lastUsed && (
                <div>Last used: {prompt.lastUsed.toLocaleDateString()}</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => onPromptSelect(prompt.id)}
                variant={activePromptId === prompt.id ? "default" : "outline"}
                size="sm"
                className="flex-1"
              >
                <Wand2 className="w-4 h-4 mr-1" />
                {activePromptId === prompt.id ? 'Active' : 'Use'}
              </Button>
              <Button
                onClick={() => handleEditPrompt(prompt)}
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedPrompts.length === 0 && (
        <div className="text-center py-12">
          <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'No prompts found' : 'No prompts yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first custom prompt to get started.'
            }
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <Button onClick={handleCreateNew} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Prompt
            </Button>
          )}
        </div>
      )}

      {/* Prompt Editor Modal */}
      <PromptEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        prompt={editingPrompt}
        onSave={handleSavePrompt}
        onDelete={editingPrompt?.isDefault ? undefined : handleDeletePrompt}
      />
    </div>
  );
};
