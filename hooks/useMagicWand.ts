import { useCallback } from 'react';
import { NodeData } from '../types';
import { findNode } from '../utils/treeUtils';

interface UseMagicWandProps {
  tree: NodeData;
}

export const useMagicWand = ({ tree }: UseMagicWandProps) => {
  const generateMagicWandPrompt = useCallback(async (selectedNode: NodeData) => {
    let markdownContext = "# Context for Generating New Concepts\n\n";

    // 1. Current Node Context
    markdownContext += "## Current Node (The node for which to generate children)\n";
    markdownContext += `- **Name:** ${selectedNode.label}\n`;
    markdownContext += `- **Description:** ${selectedNode.description || 'N/A'}\n\n`;

    // 2. Parent Node Context
    const nodeInfo = findNode(tree, selectedNode.id);
    if (nodeInfo && nodeInfo.parent) {
      const parentNode = nodeInfo.parent;
      markdownContext += "## Parent Node\n";
      markdownContext += `- **Name:** ${parentNode.label}\n`;
      markdownContext += `- **Description:** ${parentNode.description || 'N/A'}\n\n`;

      // 3. Sibling Nodes Context
      const siblings = parentNode.children.filter(child => child.id !== selectedNode.id);
      if (siblings.length > 0) {
        markdownContext += "## Sibling Nodes (Other children of the Parent Node)\n";
        siblings.forEach(sibling => {
          markdownContext += `- **Name:** ${sibling.label}\n`;
          markdownContext += `  - **Description:** ${sibling.description || 'N/A'}\n`;
        });
        markdownContext += "\n";
      } else {
        markdownContext += "## Sibling Nodes\n- No other siblings.\n\n";
      }
    } else if (tree.id === selectedNode.id) { // Check if the selected node is the root
      markdownContext += "## Parent Node\n- This is the root node, it has no parent.\n\n";
      markdownContext += "## Sibling Nodes\n- This is the root node, it has no siblings.\n\n";
    }
     // If nodeInfo is null but it's not the root, it's an unexpected state.
     // This path is less likely if tree integrity is maintained.

    // 4. AI Prompt Instructions
    const aiPromptInstructions = `---
# AI Task: Generate Child Concepts

You are an expert in conceptual hierarchy and knowledge organization. Your task is to generate a set of **distinct and relevant child concepts** for the provided **"Current Node"**. These child concepts should represent a logical breakdown, components, or specializations of the "Current Node".

**Context Overview:**
- **Current Node:** The primary concept for which you need to generate children.
- **Parent Node:** The concept directly above the "Current Node" in the hierarchy. This provides broader context.
- **Sibling Nodes:** Other children of the "Parent Node." Avoid generating child concepts that are too similar to these existing siblings.

**Generation Guidelines:**
1.  **Relevance:** Each child concept must be directly and logically related to the "Current Node".
2.  **Specificity:** Child concepts should be more specific or granular than the "Current Node". They should break it down into smaller parts, types, or aspects.
3.  **Distinctness:** Ensure the generated child concepts are clearly different from each other and from any existing "Sibling Nodes" (if provided). Avoid redundancy.
4.  **Coverage:** Aim to provide a comprehensive set of child concepts that cover key aspects of the "Current Node", but avoid overly niche or obscure items unless the context suggests it.
5.  **Number of Concepts:** Generate between 6 and 12 child concepts.
6.  **Conciseness:**
    *   **Label:** Keep the concept label concise and descriptive (typically 1-5 words).
    *   **Description:** Provide a brief, clear explanation of the concept. If a concept is self-explanatory, a very short description or even an empty string is acceptable, but the "description" property must always exist.

**Output Format Instructions:**
Your response **MUST** be a valid JSON array of objects. Each object in the array represents a new child concept and **MUST** strictly conform to the following structure:
\`\`\`json
[
  {
    "label": "string",
    "description": "string"
  }
]
\`\`\`
- The "label" field is the name of the new child concept.
- The "description" field is a brief explanation of the concept.

**Example:**
If the "Current Node" is "Renewable Energy Technologies", a possible response could be:
\`\`\`json
[
  { "label": "Solar Photovoltaics", "description": "Technology that converts sunlight directly into electricity using semiconductor materials." },
  { "label": "Wind Turbines", "description": "Devices that convert the kinetic energy of wind into electrical power." },
  { "label": "Geothermal Power", "description": "Energy derived from the Earth's internal heat, used for electricity generation and direct heating." },
  { "label": "Hydropower", "description": "Electricity generated from the energy of moving water, such as rivers or tides." },
  { "label": "Biomass Energy", "description": "Energy produced from organic materials, such as wood, agricultural crops, or waste." },
  { "label": "Ocean Energy", "description": "Energy harnessed from ocean waves, tides, or thermal gradients." }
]
\`\`\`

**Important Considerations:**
- **Strict JSON:** Do NOT include any introductory text, concluding remarks, apologies, or any markdown formatting (like \`\`\`json ... \`\`\`) outside of the single, raw JSON array in your response.
- **Focus:** Concentrate on the "Current Node" ("${selectedNode.label}") and its provided context to generate meaningful children.

Provide your JSON response below:
`;

    const fullPrompt = markdownContext + aiPromptInstructions;

    try {
      await navigator.clipboard.writeText(fullPrompt);
      alert(`AI prompt for "${selectedNode.label}" copied to clipboard! Paste it into your preferred AI chatbot to generate children concepts.`);
    } catch (err) {
      console.error("Failed to copy AI prompt to clipboard:", err);
      alert("Failed to copy AI prompt. Check permissions (HTTPS/localhost) or see console for details.");
    }
  }, [tree]); // Dependency on tree to get current context

  return { generateMagicWandPrompt };
};
