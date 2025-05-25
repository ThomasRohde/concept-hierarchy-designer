import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

/**
 * Saves the capability card as a PNG image
 * @param element DOM element to convert to PNG
 * @param filename The name of the file to save (without extension)
 * @param scale Optional scale factor for the image (default: 2)
 */
export const saveCapabilityCardAsPng = async (
  element: HTMLElement,
  filename: string = 'capability-card',
  scale: number = 2
): Promise<void> => {
  try {
    // Use html2canvas to capture the DOM element as an image
    const canvas = await html2canvas(element, {
      scale: scale, // Higher scale for better quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    // Convert canvas to Blob
    canvas.toBlob((blob) => {
      if (blob) {
        // Save the PNG file
        saveAs(blob, `${filename}.png`);
      } else {
        throw new Error('Failed to generate PNG blob');
      }
    }, 'image/png');
  } catch (error) {
    console.error('Failed to export PNG:', error);
    throw error;
  }
};
