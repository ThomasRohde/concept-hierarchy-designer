import { NodeData } from '../../types';
import { saveAs } from 'file-saver';
import { buildIndex, getCardSubtree } from '../capabilityCardUtils.js';

/**
 * Saves the concept hierarchy tree as a JSON file that can be downloaded
 * @param nodes The concept hierarchy nodes to save
 * @param filename The name of the file to save (without extension)
 * @param currentNodeId Optional - if provided, exports only the capability card subtree
 */
export const saveTreeAsJson = (
  nodes: NodeData[], 
  filename: string = 'concept-hierarchy',
  currentNodeId?: string
): void => {
  let dataToSave = nodes;
  
  // If a currentNodeId is provided, only export the capability card subtree
  if (currentNodeId) {
    const index = buildIndex(nodes);
    const subtree = getCardSubtree(index, currentNodeId);
    
    // Collect all nodes in the subtree into a single array
    const subtreeNodes: NodeData[] = [
      ...(subtree.current ? [subtree.current] : []),
      ...subtree.kids,
      ...subtree.grandkids
    ];
    
    // Filter out duplicates (in case of complex hierarchies)
    const uniqueIds = new Set<string>();
    dataToSave = subtreeNodes.filter(node => {
      if (uniqueIds.has(node.id)) return false;
      uniqueIds.add(node.id);
      return true;
    });
  }
  
  // Create a Blob with the JSON data
  const jsonData = JSON.stringify(dataToSave, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Use FileSaver to trigger the download
  saveAs(blob, `${filename}.json`);
};
