import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { NodeData } from '../types';
import { genId } from '../utils/treeUtils';

interface UseClipboardActionsProps {
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const useClipboardActions = ({ setNodes, setCollapsed }: UseClipboardActionsProps) => {
  // Function to recursively get a node and all its descendants in the flat structure
  const getNodeAndDescendants = useCallback((nodes: NodeData[], nodeId: string): NodeData[] => {
    const result: NodeData[] = [];
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return result;
    
    // Add the node itself
    result.push({...node});
    
    // Get all direct children
    const children = nodes.filter(n => n.parent === nodeId);
    
    // For each child, recursively get its descendants
    children.forEach(child => {
      result.push(...getNodeAndDescendants(nodes, child.id));
    });
    
    return result;
  }, []);

  const copyToClipboard = useCallback(async (nodeToCopy: NodeData, allNodes: NodeData[]) => {
    try {
      // Get the node and all its descendants from the current nodes array
      const nodeTree = getNodeAndDescendants(allNodes, nodeToCopy.id);
      const nodeJson = JSON.stringify(nodeTree, null, 2);
      await navigator.clipboard.writeText(nodeJson);
      toast.success(`"${nodeToCopy.name}" and its children copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      toast.error("Failed to copy to clipboard. Make sure you've granted clipboard permissions and are using HTTPS/localhost. See console for details.");
    }
  }, [getNodeAndDescendants]);

  const pasteAsChild = useCallback(async (targetParentNode: NodeData) => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) {
        toast.error("Clipboard is empty or permission to read clipboard was denied.");
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse clipboard content:", parseError);
        toast.error("Failed to paste: Invalid JSON format in clipboard. See console for details.");
        return;
      }
      
      // Function to validate and prepare node in the new format
      const validateAndPrepareNode = (item: any): NodeData | null => {
        const name = item.name || item.label; // Support both formats
        const description = item.description || '';
        
        if (item && typeof name === 'string') { 
          return {
            id: genId(),
            name: name,
            description: description,
            parent: targetParentNode.id
          };
        }
        return null; 
      };
      
      // Process the parsed data into nodes
      let nodesToPaste: NodeData[] = [];
      if (Array.isArray(parsedData)) {
        nodesToPaste = parsedData.map(validateAndPrepareNode).filter(Boolean) as NodeData[];
        if (nodesToPaste.length !== parsedData.length && parsedData.length > 0) {
          toast("Some items in the pasted array were not valid nodes or had missing required fields and were ignored.", { icon: '⚠️' });
        }
      } else {
        const singleNode = validateAndPrepareNode(parsedData);
        if (singleNode) {
          nodesToPaste = [singleNode];
        }
      }
      
      if (nodesToPaste.length === 0) {
        toast.error("Pasted data is not a valid node or array of nodes, or contains no valid nodes after processing (e.g., missing 'name').");
        return;
      }

      // Add the new nodes to the existing nodes array
      setNodes(currentNodes => {
        return [...currentNodes, ...nodesToPaste];
      });

      // Auto-expand the parent node where content was pasted
      setCollapsed((prev) => {
        const next = new Set(prev);
        next.delete(targetParentNode.id); 
        return next;
      });
      
      toast.success("Content pasted successfully as child/children!");

    } catch (err) {
      console.error("Failed to paste from clipboard:", err);
      // Check for Permissions Policy error specifically
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        toast.error("Failed to paste: Clipboard access was denied. This usually happens if the page is not served over HTTPS or from localhost, or if you haven't interacted with the page recently. Please ensure the page has focus and try again. Check the console for more details.");
      } else {
        toast.error("Failed to paste from clipboard. Check permissions (HTTPS/localhost) or see console for details.");
      }
    }
  }, [setNodes, setCollapsed]);

  return { copyToClipboard, pasteAsChild };
};
