import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { NodeData } from '../types';
import { genId, findNode } from '../utils/treeUtils';

interface UseClipboardActionsProps {
  setTree: React.Dispatch<React.SetStateAction<NodeData>>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const useClipboardActions = ({ setTree, setCollapsed }: UseClipboardActionsProps) => {
  const copyToClipboard = useCallback(async (nodeToCopy: NodeData) => {
    try {
      // Create a deep copy to avoid modifying the original node or its children,
      // especially if any transformations were to be done before stringifying.
      const cleanNodeToCopy = JSON.parse(JSON.stringify(nodeToCopy));
      const nodeJson = JSON.stringify(cleanNodeToCopy, null, 2);
      await navigator.clipboard.writeText(nodeJson);
      toast.success(`"${nodeToCopy.label}" and its children copied to clipboard!`);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      toast.error("Failed to copy to clipboard. Make sure you've granted clipboard permissions and are using HTTPS/localhost. See console for details.");
    }
  }, []);

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
      
      const validateAndPrepareNode = (item: any): NodeData | null => {
        if (item && typeof item.label === 'string') { 
          const newNode: NodeData = {
            id: genId(), 
            label: item.label,
            description: typeof item.description === 'string' ? item.description : '',
            children: [] 
          };
          // Recursively validate and prepare children
          if (Array.isArray(item.children)) {
            newNode.children = item.children.map(validateAndPrepareNode).filter(Boolean) as NodeData[];
          }
          return newNode;
        }
        return null; 
      };
      
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
          toast.error("Pasted data is not a valid node or array of nodes, or contains no valid nodes after processing (e.g., missing 'label').");
          return;
      }

      setTree((currentTree) => {
        const newTree = JSON.parse(JSON.stringify(currentTree)) as NodeData;
        const targetParentInfo = findNode(newTree, targetParentNode.id);
        
        if (targetParentInfo && targetParentInfo.node) {
          const targetParent = targetParentInfo.node;
          targetParent.children = targetParent.children || [];
          nodesToPaste.forEach(pastedNodeInstance => {
            targetParent.children.push(pastedNodeInstance);
          });
        } else {
            // This case should ideally not happen if targetParentNode.id is always valid
            console.error("Paste target parent node not found in the tree:", targetParentNode.id);
            toast.error("Error: Could not find the target parent node to paste under. The tree might have changed unexpectedly.");
            return currentTree; // Return original tree if parent not found
        }
        return newTree;
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
  }, [setTree, setCollapsed]);

  return { copyToClipboard, pasteAsChild };
};
