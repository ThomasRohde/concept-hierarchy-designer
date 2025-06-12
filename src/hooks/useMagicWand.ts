import { useCallback, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { NodeData, Prompt, PromptCollection } from '../types';
import { getChildren, getParent } from '../utils/treeUtils';
import { updateMagicWandStats } from '../utils/adminUtils';
import { createNewPrompt } from '../utils/promptUtils';
import { useTreeContext } from '../context/TreeContext';

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
  const { prompts: promptCollection, setPrompts: setPromptCollection } = useTreeContext();
  const [activePromptId, setActivePromptIdState] = useState<string>(() => {
    return promptCollection.activePromptId || promptCollection.prompts[0]?.id || '';
  });
  // Get the active prompt - use activePromptId first, fallback to collection's activePromptId
  const effectiveActivePromptId = activePromptId || promptCollection.activePromptId;
  const activePrompt = promptCollection.prompts.find(p => p.id === effectiveActivePromptId) || promptCollection.prompts[0];
  // Effect to sync activePromptId with collection changes
  useEffect(() => {
    // Update local state when collection changes
    if (promptCollection.activePromptId && promptCollection.activePromptId !== activePromptId) {
      setActivePromptIdState(promptCollection.activePromptId);
    }
  }, [promptCollection.activePromptId, activePromptId]);
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
        // Use setTimeout to defer state updates until after render
        setTimeout(() => {
          const updatedCollection = {
            ...promptCollection,
            prompts: [...promptCollection.prompts, customPrompt],
            activePromptId: customPrompt.id
          };
          
          setPromptCollection(updatedCollection);
          setActivePromptIdState(customPrompt.id);
          
          toast.success('Your custom guidelines have been migrated to the new prompt system!');
        }, 0);
      }

      // Remove legacy storage
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, [promptCollection, setPromptCollection]);

  const updatePromptCollection = useCallback((collection: PromptCollection) => {
    setPromptCollection(collection);
    
    // If the collection has a different active prompt ID, update local state
    if (collection.activePromptId) {
      setActivePromptIdState(collection.activePromptId);
    }
  }, [setPromptCollection]);

  const setActivePrompt = useCallback((promptId: string) => {
    // Update local state first
    setActivePromptIdState(promptId);
    
    // Update the collection to reflect the new active prompt
    setPromptCollection(prev => ({
      ...prev,
      activePromptId: promptId
    }));
  }, [setPromptCollection]);

  const createPrompt = useCallback(() => {
    return createNewPrompt();
  }, []);

  const generateMagicWandPrompt = useCallback(async (selectedNode: NodeData, promptId?: string) => {
    // Get the current active prompt
    const currentActivePrompt = promptCollection.prompts.find(p => p.id === effectiveActivePromptId) || promptCollection.prompts[0];
    
    const selectedPrompt = promptId 
      ? promptCollection.prompts.find(p => p.id === promptId) || currentActivePrompt
      : currentActivePrompt;

    // Update usage count through TreeContext
    setTimeout(() => {
      setPromptCollection(prevCollection => ({
        ...prevCollection,
        prompts: prevCollection.prompts.map(p => 
          p.id === selectedPrompt.id 
            ? { 
                ...p, 
                usageCount: (p.usageCount || 0) + 1,
                lastUsed: new Date()
              }
            : p
        )
      }));
    }, 0);

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
      toast.error("Failed to copy AI prompt. Check permissions (HTTPS/localhost) or see console for details.");
      updateMagicWandStats(false, 0);
    }
  }, [nodes, promptCollection, effectiveActivePromptId, setPromptCollection]);

  return {
    generateMagicWandPrompt,
    promptCollection,
    activePrompt,
    updatePromptCollection,
    setActivePrompt,
    createPrompt
  };
};