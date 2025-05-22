import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { NodeData } from '../types';
import { getChildren, getParent } from '../utils/treeUtils';

interface UseMagicWandProps {
  nodes: NodeData[];
}

export const useMagicWand = ({ nodes }: UseMagicWandProps) => {
  const generateMagicWandPrompt = useCallback(async (selectedNode: NodeData) => {
    let markdownContext = "# Context for Generating New Concepts\n\n";

    // 1. Current Node Context
    markdownContext += "## Current Node (The node for which to generate children)\n";
    markdownContext += `- **Name:** ${selectedNode.name}\n`;
    markdownContext += `- **Description:** ${selectedNode.description || 'N/A'}\n\n`;

    // 2. Parent Node Context
    const parentNode = getParent(nodes, selectedNode.id);
    if (parentNode) {
      markdownContext += "## Parent Node\n";
      markdownContext += `- **Name:** ${parentNode.name}\n`;
      markdownContext += `- **Description:** ${parentNode.description || 'N/A'}\n\n`;

      // 3. Sibling Nodes Context
      const siblings = getChildren(nodes, parentNode.id).filter(child => child.id !== selectedNode.id);
      if (siblings.length > 0) {
        markdownContext += "## Sibling Nodes (Other children of the Parent Node)\n";
        siblings.forEach(sibling => {
          markdownContext += `- **Name:** ${sibling.name}\n`;
          markdownContext += `  - **Description:** ${sibling.description || 'N/A'}\n`;
        });
        markdownContext += "\n";
      } else {
        markdownContext += "## Sibling Nodes\n- No other siblings.\n\n";
      }
    } else {
      markdownContext += "## Parent Node\n- This is the root node, it has no parent.\n\n";
      markdownContext += "## Sibling Nodes\n- This is the root node, it has no siblings.\n\n";
    }

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
    "name": "string",
    "description": "string"
  }
]
\`\`\`
- The "name" field is the name of the new child concept.
- The "description" field is a brief explanation of the concept.

**Example:**
If the "Current Node" is "Renewable Energy Technologies", a possible response could be:
\`\`\`json
[
  { "name": "Solar Photovoltaics", "description": "Technology that converts sunlight directly into electricity using semiconductor materials." },
  { "name": "Wind Turbines", "description": "Devices that convert the kinetic energy of wind into electrical power." },
  { "name": "Geothermal Power", "description": "Energy derived from the Earth's internal heat, used for electricity generation and direct heating." },
  { "name": "Hydropower", "description": "Electricity generated from the energy of moving water, such as rivers or tides." },
  { "name": "Biomass Energy", "description": "Energy produced from organic materials, such as wood, agricultural crops, or waste." },
  { "name": "Ocean Energy", "description": "Energy harnessed from ocean waves, tides, or thermal gradients." }
]
\`\`\`

**Important Considerations:**
- **Strict JSON:** Do NOT include any introductory text, concluding remarks, apologies, or any markdown formatting (like \`\`\`json ... \`\`\`) outside of the single, raw JSON array in your response.
- **Focus:** Concentrate on the "Current Node" ("${selectedNode.name}") and its provided context to generate meaningful children.

Provide your JSON response below in a markdown code block, without any additional text or formatting. Ensure the JSON is valid and well-structured.:
`;

    const fullPrompt = markdownContext + aiPromptInstructions;

    try {
      await navigator.clipboard.writeText(fullPrompt);
      toast.success(`AI prompt for "${selectedNode.name}" copied to clipboard! Paste it into your preferred AI chatbot to generate children concepts.`);
    } catch (err) {
      console.error("Failed to copy AI prompt to clipboard:", err);
      toast.error("Failed to copy AI prompt. Check permissions (HTTPS/localhost) or see console for details.");
    }
  }, [nodes]); // Dependency on nodes to get current context

  return { generateMagicWandPrompt };
};
