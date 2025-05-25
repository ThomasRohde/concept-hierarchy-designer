import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { NodeData } from '../types';
import { getChildren, getParent } from '../utils/treeUtils';
import { updateMagicWandStats } from '../utils/adminUtils';

// LocalStorage key for guidelines
export const STORAGE_KEY = 'magic-wand-guidelines';

// Enhanced generation guidelines incorporating MECE principles and best practices
export const DEFAULT_GENERATION_GUIDELINES = `## Core Principles

### 1. **MECE Framework (Mutually Exclusive, Collectively Exhaustive)**
   - **Mutually Exclusive:** Each child concept must be distinct with no overlaps. A specific instance should clearly belong to only one category.
   - **Collectively Exhaustive:** Together, all child concepts must cover the entire scope of the parent node. No significant aspect should be left out.
   - **Test:** Ask "Is every possible instance of the parent covered by exactly one child?"

### 2. **Conceptual Decomposition Patterns**
Choose the most appropriate breakdown pattern based on the node's nature:
   - **Type/Category:** Different kinds or varieties
   - **Component/Part:** Physical or logical components
   - **Process/Stage:** Sequential steps or phases
   - **Function/Purpose:** Different uses or objectives
   - **Attribute/Property:** Key characteristics or dimensions
   - **Stakeholder/Actor:** Different participants or users

### 3. **Hierarchical Consistency**
   - All children should be at the same level of abstraction
   - Avoid mixing high-level concepts with overly specific details
   - Consider the node's position in the hierarchy

### 4. **Output Specifications**
   - **Number:** Generate 6-12 concepts (adjust based on complexity)
   - **Naming:** 1-5 words, consistent grammatical structure
   - **Descriptions:** 
     - Clear definition in first sentence
     - Use **markdown** for emphasis
     - Include \`code formatting\` for technical terms
     - 10-50 words typically

### 5. **Quality Checks**
   - No overlapping categories
   - Complete coverage of the parent concept
   - Consistent decomposition pattern
   - Clear and actionable concepts`;

interface UseMagicWandProps {
  nodes: NodeData[];
}

interface UseMagicWandResult {
  generateMagicWandPrompt: (selectedNode: NodeData) => Promise<void>;
  currentGuidelines: string;
  updateGuidelines: (newGuidelines: string) => void;
}

export const useMagicWand = ({ nodes }: UseMagicWandProps): UseMagicWandResult => {
  // Initialize with saved guidelines or default
  const [guidelines, setGuidelines] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      console.log('Loading guidelines from localStorage:', saved);
      if (!saved) {
        console.log('No saved guidelines found, using default');
        return DEFAULT_GENERATION_GUIDELINES;
      }
      return saved;
    } catch (error) {
      console.error("Error loading guidelines from localStorage:", error);
      return DEFAULT_GENERATION_GUIDELINES;
    }
  });

  const updateGuidelines = useCallback((newGuidelines: string) => {
    try {
      if (!newGuidelines) {
        localStorage.removeItem(STORAGE_KEY);
        setGuidelines(DEFAULT_GENERATION_GUIDELINES);
      } else {
        localStorage.setItem(STORAGE_KEY, newGuidelines);
        setGuidelines(newGuidelines);
      }
    } catch (error) {
      console.error("Error saving guidelines to localStorage:", error);
    }
  }, []);

  // Function to generate the prompt with customizable generation guidelines
  const generateMagicWandPrompt = useCallback(async (selectedNode: NodeData) => {
    // Load the current guidelines directly from localStorage to ensure we have the latest
    const currentGuidelines = localStorage.getItem(STORAGE_KEY) || guidelines;

    // Part 1: Context section with enhanced formatting
    let markdownContext = "# Context for Generating New Concepts\n\n";

    // 1. Current Node Context
    markdownContext += "## 🎯 Current Node (Generate children for this concept)\n";
    markdownContext += `**Name:** ${selectedNode.name}\n`;
    markdownContext += `**Description:** ${selectedNode.description || 'No description provided'}\n\n`;

    // 2. Parent Node Context
    const parentNode = getParent(nodes, selectedNode.id);
    if (parentNode) {
      markdownContext += "## 📊 Parent Node (Broader context)\n";
      markdownContext += `**Name:** ${parentNode.name}\n`;
      markdownContext += `**Description:** ${parentNode.description || 'No description provided'}\n\n`;

      // 3. Sibling Nodes Context
      const siblings = getChildren(nodes, parentNode.id).filter(child => child.id !== selectedNode.id);
      if (siblings.length > 0) {
        markdownContext += "## 🔄 Sibling Nodes (Maintain consistency with these)\n";
        siblings.forEach(sibling => {
          markdownContext += `- **${sibling.name}**: ${sibling.description || 'No description'}\n`;
        });
        markdownContext += "\n";
      } else {
        markdownContext += "## 🔄 Sibling Nodes\n*No siblings - this is the first child of its parent.*\n\n";
      }
    } else {
      markdownContext += "## 📊 Parent Node\n*This is the root node (no parent).*\n\n";
      markdownContext += "## 🔄 Sibling Nodes\n*Root node has no siblings.*\n\n";
    }

    // Part 2: AI Task Header with enhanced instructions
    const promptHeader = `---
# 🤖 AI Task: Generate Child Concepts Using MECE Principles

You are an expert in **conceptual hierarchy design** and **knowledge organization**. Your task is to generate a **MECE-compliant** (Mutually Exclusive, Collectively Exhaustive) set of child concepts for the provided "Current Node".

## Your Expertise Includes:
- Information architecture and taxonomy design
- MECE framework application
- Domain-specific concept modeling
- Hierarchical knowledge representation

## Context Analysis:
- **Current Node:** "${selectedNode.name}" - This is your focus for decomposition
- **Hierarchy Level:** ${parentNode ? 'Sub-concept' : 'Root level'} 
- **Domain:** Analyze the context to infer the domain and adjust your language accordingly

## Generation Guidelines:
${currentGuidelines}

`;

    // Part 3: Enhanced output format instructions
    const outputFormatInstructions = `
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

### Formatting Rules:
- **name**: Concise label (1-5 words)
- **description**: 
  - Can include **bold**, *italics*, \`code\`, and bullet points
  - First sentence should define what the concept IS
  - Optional second sentence for key differentiators
  - Keep under 50 words for readability

## 💡 Example Output:

If the Current Node is "Machine Learning Algorithms", a MECE breakdown might be:

\`\`\`json
[
  {
    "name": "Supervised Learning",
    "description": "Algorithms that learn from **labeled training data** to make predictions. Includes classification and regression tasks where the desired output is known during training."
  },
  {
    "name": "Unsupervised Learning",
    "description": "Algorithms that discover **hidden patterns** in unlabeled data. Used for clustering, dimensionality reduction, and anomaly detection without predefined outputs."
  },
  {
    "name": "Reinforcement Learning",
    "description": "Algorithms that learn through **interaction with an environment** using rewards and penalties. Optimizes decision-making through trial and error."
  },
  {
    "name": "Semi-Supervised Learning",
    "description": "Hybrid approach using both labeled and unlabeled data. Leverages small amounts of **expensive labeled data** with large amounts of unlabeled data."
  },
  {
    "name": "Self-Supervised Learning",
    "description": "Algorithms that generate their own labels from the input data. Uses **pretext tasks** to learn representations without manual annotation."
  },
  {
    "name": "Transfer Learning",
    "description": "Technique that applies knowledge from one domain to another. Reuses **pre-trained models** to solve related problems with less data."
  }
]
\`\`\`

## ⚠️ Critical Requirements:
1. **Valid JSON only** - No text outside the JSON array
2. **MECE compliance** - Verify mutual exclusivity and collective exhaustiveness
3. **Consistent pattern** - All children follow the same decomposition approach
4. **Markdown support** - Enhance readability with formatting
5. **Domain appropriate** - Use terminology suitable for the inferred domain

Generate your response below:`;

    // Combine all parts to create the full prompt
    const fullPrompt = markdownContext + promptHeader + outputFormatInstructions;    try {
      await navigator.clipboard.writeText(fullPrompt);
      toast.success(`Enhanced AI prompt for "${selectedNode.name}" copied! This prompt uses MECE principles for optimal concept generation.`);
      
      // Track magic wand usage - successful call (clipboard copy succeeded)
      updateMagicWandStats(true, 0);
    } catch (err) {
      console.error("Failed to copy AI prompt to clipboard:", err);
      toast.error("Failed to copy AI prompt. Check permissions (HTTPS/localhost) or see console for details.");
      
      // Track failed magic wand usage
      updateMagicWandStats(false, 0);
    }
  }, [nodes, guidelines]);

  return {
    generateMagicWandPrompt,
    currentGuidelines: guidelines,
    updateGuidelines
  };
};