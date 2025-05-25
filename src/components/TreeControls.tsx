import React, { useState } from 'react';
import { Button } from './ui/Button';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { PromptDropdown } from './PromptDropdown';
import { PromptEditor } from './PromptEditor';
import { useMagicWand } from '../hooks/useMagicWand';
import { useTreeContext } from '../context/TreeContext';

interface TreeControlsProps {
  onExpandAll: () => void;
  onCollapseAll: () => void;
  disabled?: boolean;
}

const TreeControls: React.FC<TreeControlsProps> = ({
  onExpandAll,
  onCollapseAll,
  disabled = false
}) => {
  const { nodes } = useTreeContext();
  const { 
    promptCollection, 
    activePrompt, 
    updatePromptCollection, 
    setActivePrompt,
    createPrompt
  } = useMagicWand({ nodes });

  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);

  const handlePromptSelect = (promptId: string) => {
    setActivePrompt(promptId);
  };

  const handleOpenPromptEditor = () => {
    setIsPromptEditorOpen(true);
  };

  const handleCreateNewPrompt = () => {
    const newPrompt = createPrompt();
    setActivePrompt(newPrompt.id);
    setIsPromptEditorOpen(true);
  };

  const handlePromptSave = (prompt: any) => {
    const updatedPrompts = promptCollection.prompts.map(p => 
      p.id === prompt.id ? prompt : p
    );
    if (!promptCollection.prompts.find(p => p.id === prompt.id)) {
      updatedPrompts.push(prompt);
    }
    updatePromptCollection({ ...promptCollection, prompts: updatedPrompts });
    setIsPromptEditorOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Button
          onClick={onExpandAll}
          disabled={disabled}
          variant="outline"
          className="flex items-center gap-2"
          title="Expand All"
          aria-label="Expand All"
        >
          <ChevronsDown className="w-4 h-4" />
          <span className="hidden sm:inline">Expand</span>
        </Button>
        
        <Button
          onClick={onCollapseAll}
          disabled={disabled}
          variant="outline"
          className="flex items-center gap-2"
          title="Collapse All"
          aria-label="Collapse All"
        >
          <ChevronsUp className="w-4 h-4" />
          <span className="hidden sm:inline">Collapse</span>
        </Button>
        
        <PromptDropdown 
          selectedPrompt={activePrompt}
          prompts={promptCollection.prompts}
          onPromptSelect={handlePromptSelect}
          onOpenPromptEditor={handleOpenPromptEditor}
          onCreateNewPrompt={handleCreateNewPrompt}
          disabled={disabled}
        />
      </div>      <PromptEditor
        isOpen={isPromptEditorOpen}
        onClose={() => setIsPromptEditorOpen(false)}
        onSave={handlePromptSave}
        prompt={activePrompt}
      />
    </>
  );
};

export default TreeControls;
