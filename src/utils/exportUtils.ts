import { NodeData } from '../types';

/**
 * Validates that the provided JSON data conforms to the expected NodeData structure
 * @param data The JSON data to validate
 * @returns Whether the data is valid NodeData
 */
export const validateNodeData = (data: any): data is NodeData[] => {
  if (!Array.isArray(data)) return false;
  
  return data.every(node => 
    node &&
    typeof node === 'object' &&
    typeof node.id === 'string' &&
    typeof node.name === 'string' &&
    typeof node.description === 'string' &&
    (node.parent === null || typeof node.parent === 'string')
  );
};

/**
 * Saves the concept hierarchy tree as a JSON file that can be downloaded
 * @param nodes The concept hierarchy nodes to save
 * @param filename The name of the file to save (without extension)
 */
export const saveTreeAsJson = (nodes: NodeData[], filename: string = 'concept-hierarchy'): void => {
  // Create a Blob with the JSON data
  const jsonData = JSON.stringify(nodes, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  
  // Create a temporary download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Set up the link properties
  link.href = url;
  link.download = `${filename}.json`;
  
  // Append the link, trigger the download, and clean up
  document.body.appendChild(link);
  link.click();
  
  // Clean up the temporary objects
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
