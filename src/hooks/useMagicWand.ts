import { useCallback, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { NodeData, Prompt, PromptCollection } from '../types';
import { getChildren, getParent } from '../utils/treeUtils';
import { updateMagicWandStats } from '../utils/adminUtils';
import { 
  loadPromptCollection, 
  savePromptCollection, 
  getActivePrompt, 
  setActivePromptId,
  updatePromptUsage,
  createNewPrompt
} from '../utils/promptUtils';

// Legacy storage key for backward compatibility
export const LEGACY_STORAGE_KEY = 'magic-wand-guidelines';

// Re-export for backward compatibility
export { DEFAULT_GENERATION_GUIDELINES } from '../utils/promptUtils';

interface UseMagicWandProps {
  nodes: NodeData[];
}

interface UseMagicWandResult {
  generateMagicWandPrompt: (selectedNode: NodeData, promptId?: string) => Promise<void>;
  promptCollection: PromptCollection;
  activePrompt: Prompt;
  updatePromptCollection: (collection: PromptCollection) => void;
  setActivePrompt: (promptId: string) => void;
  createPrompt: () => Prompt;
}

export const useMagicWand = ({ nodes }: UseMagicWandProps): UseMagicWandResult => {
  const [promptCollection, setPromptCollection] = useState<PromptCollection>(() => loadPromptCollection());
  const [activePromptId, setActivePromptIdState] = useState<string>(() => {
    const active = getActivePrompt();
    return active.id;
  });

  // Get the active prompt
  const activePrompt = promptCollection.prompts.find(p => p.id === activePromptId) || promptCollection.prompts[0];

  // Effect to sync with localStorage changes from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCollection = loadPromptCollection();
      const updatedActivePrompt = getActivePrompt();
      
      setPromptCollection(updatedCollection);
      setActivePromptIdState(updatedActivePrompt.id);
    };    // Listen for localStorage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom prompt change events (for same-tab updates)
    const handlePromptChange = () => {
      handleStorageChange();
    };
    
    window.addEventListener('promptCollectionChanged', handlePromptChange);    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('promptCollectionChanged', handlePromptChange);
    };
  }, []);

  // Legacy migration effect
  useEffect(() => {
    const legacyGuidelines = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyGuidelines) {
      // Create a custom prompt from legacy guidelines  
      const customPrompt: Prompt = {
        id: 'legacy-custom',
        name: 'Custom (Migrated)',
        description: 'Your previous custom guidelines, automatically migrated',
        content: legacyGuidelines,
        category: 'general',
        tags: ['migrated', 'custom'],
        isDefault: false,
        createdAt: new Date(),
        lastModified: new Date(),
        usageCount: 0
      };

      // Add to collection if not already present
      const existingCustom = promptCollection.prompts.find(p => p.id === 'legacy-custom');
      if (!existingCustom) {
        const updatedCollection = {
          ...promptCollection,
          prompts: [...promptCollection.prompts, customPrompt]
        };        setPromptCollection(updatedCollection);
        savePromptCollection(updatedCollection);
        
        // Set as active prompt
        setActivePromptId(customPrompt.id);
        setActivePromptIdState(customPrompt.id);
        
        // Emit custom event to notify other hook instances
        window.dispatchEvent(new CustomEvent('promptCollectionChanged'));
        
        toast.success('Your custom guidelines have been migrated to the new prompt system!');
      }

      // Remove legacy storage
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, [promptCollection]);  const updatePromptCollection = useCallback((collection: PromptCollection) => {
    setPromptCollection(collection);
    savePromptCollection(collection);
    
    // If the collection has a different active prompt ID, update local state
    if (collection.activePromptId && collection.activePromptId !== activePromptId) {
      setActivePromptIdState(collection.activePromptId);
      setActivePromptId(collection.activePromptId);
    }
    
    // Emit custom event to notify other hook instances
    window.dispatchEvent(new CustomEvent('promptCollectionChanged'));
  }, [activePromptId]);  const setActivePrompt = useCallback((promptId: string) => {
    setActivePromptIdState(promptId);
    setActivePromptId(promptId);
    
    // Also update the collection's activePromptId to keep everything in sync
    setPromptCollection(currentCollection => {
      const updatedCollection = { ...currentCollection, activePromptId: promptId };
      savePromptCollection(updatedCollection);
      return updatedCollection;
    });
    
    // Emit custom event to notify other hook instances
    window.dispatchEvent(new CustomEvent('promptCollectionChanged'));
  }, []);

  const createPrompt = useCallback(() => {
    return createNewPrompt();
  }, []);  const generateMagicWandPrompt = useCallback(async (selectedNode: NodeData, promptId?: string) => {
    // Get the most current active prompt ID from localStorage to avoid stale state
    const currentActivePromptId = getActivePrompt().id;
    const currentActivePrompt = promptCollection.prompts.find(p => p.id === currentActivePromptId) || promptCollection.prompts[0];
    
    const selectedPrompt = promptId 
      ? promptCollection.prompts.find(p => p.id === promptId) || currentActivePrompt
      : currentActivePrompt;

    // Update usage count
    updatePromptUsage(selectedPrompt.id);
    
    // Update local state to reflect usage
    const updatedCollection = {
      ...promptCollection,
      prompts: promptCollection.prompts.map(p => 
        p.id === selectedPrompt.id 
          ? { ...p, usageCount: (p.usageCount || 0) + 1 }
          : p
      )
    };
    setPromptCollection(updatedCollection);
    savePromptCollection(updatedCollection);

    // Build the context
    let markdownContext = "# Context for Generating New Concepts\n\n";
    markdownContext += "## 🎯 Current Node (Generate children for this concept)\n";
    markdownContext += `**Name:** ${selectedNode.name}\n`;
    markdownContext += `**Description:** ${selectedNode.description || 'No description provided'}\n\n`;

    const parentNode = getParent(nodes, selectedNode.id);
    if (parentNode) {
      markdownContext += "## 📊 Parent Node (Broader context)\n";
      markdownContext += `**Name:** ${parentNode.name}\n`;
      markdownContext += `**Description:** ${parentNode.description || 'No description provided'}\n\n`;

      const siblings = getChildren(nodes, parentNode.id).filter(child => child.id !== selectedNode.id);
      if (siblings.length > 0) {
        markdownContext += "## 🔄 Sibling Nodes (Maintain consistency with these)\n";
        siblings.forEach(sibling => {
          markdownContext += `- **${sibling.name}**: ${sibling.description || 'No description'}\n`;
        });
        markdownContext += "\n";
      }
    }

    // Build the prompt
    const promptHeader = `---
# 🤖 AI Task: Generate Child Concepts

You are an expert in **conceptual hierarchy design** and **knowledge organization**. Your task is to generate a well-structured set of child concepts for the provided "Current Node" using the following guidelines.

## Context Analysis:
- **Current Node:** "${selectedNode.name}" - This is your focus for decomposition
- **Hierarchy Level:** ${parentNode ? 'Sub-concept' : 'Root level'} 
- **Domain:** Analyze the context to infer the domain and adjust your language accordingly
- **Selected Prompt:** ${selectedPrompt.name}

## Generation Guidelines:
${selectedPrompt.content}

`;

    const outputInstructions = `
## 📋 Output Requirements:

Your response **MUST** be a valid JSON array. Each object represents a child concept with this exact structure:

\`\`\`json
[
  {
    "name": "string",
    "description": "string with markdown formatting supported"
  }
]
\`\`\`

Generate your response below:`;

    const fullPrompt = markdownContext + promptHeader + outputInstructions;

    try {
      await navigator.clipboard.writeText(fullPrompt);
      toast.success(`AI prompt for "${selectedNode.name}" copied using "${selectedPrompt.name}" guidelines!`);
      updateMagicWandStats(true, 0);
    } catch (err) {
      console.error("Failed to copy AI prompt to clipboard:", err);
      toast.error("Failed to copy AI prompt. Check permissions (HTTPS/localhost) or see console for details.");      updateMagicWandStats(false, 0);
    }
  }, [nodes, promptCollection, activePromptId]);

  return {
    generateMagicWandPrompt,
    promptCollection,
    activePrompt,
    updatePromptCollection,
    setActivePrompt,
    createPrompt
  };
};