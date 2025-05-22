import { NodeData } from '../types';

/**
 * Saves the concept hierarchy tree as a JSON file that can be downloaded
 * @param tree The concept hierarchy tree to save
 * @param filename The name of the file to save (without extension)
 */
export const saveTreeAsJson = (tree: NodeData, filename: string = 'concept-hierarchy'): void => {
  // Create a Blob with the JSON data
  const jsonData = JSON.stringify(tree, null, 2);
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
