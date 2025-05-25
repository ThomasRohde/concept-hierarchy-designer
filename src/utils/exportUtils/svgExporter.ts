import { saveAs } from 'file-saver';

/**
 * Saves the capability card as an SVG file
 * @param element DOM element to convert to SVG
 * @param filename The name of the file to save (without extension)
 */
export const saveCapabilityCardAsSvg = async (
  element: HTMLElement,
  filename: string = 'capability-card'
): Promise<void> => {
  try {
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Get computed styles for all elements in the clone
    const applyComputedStyles = (originalElement: HTMLElement, clonedElement: HTMLElement) => {
      const computedStyle = window.getComputedStyle(originalElement);
      
      // Apply computed styles to the cloned element
      const importantStyles = [
        'font-family', 'font-size', 'font-weight', 'color',
        'background-color', 'border', 'border-radius', 'padding',
        'margin', 'width', 'height', 'display', 'flex-direction',
        'justify-content', 'align-items', 'gap'
      ];
      
      importantStyles.forEach(style => {
        clonedElement.style.setProperty(style, computedStyle.getPropertyValue(style));
      });
      
      // Recursively apply styles to children
      Array.from(originalElement.children).forEach((child, index) => {
        if (clonedElement.children[index]) {
          applyComputedStyles(child as HTMLElement, clonedElement.children[index] as HTMLElement);
        }
      });
    };
    
    applyComputedStyles(element, clone);
    
    // Create an SVG element
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    
    // Set dimensions based on the original element
    const rect = element.getBoundingClientRect();
    svg.setAttribute('width', rect.width.toString());
    svg.setAttribute('height', rect.height.toString());
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    
    // Convert the HTML to SVG
    const foreignObject = document.createElementNS(svgNS, 'foreignObject');
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.appendChild(clone);
    svg.appendChild(foreignObject);
    
    // Convert the SVG element to a string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // Add XML declaration and doctype
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
    
    // Create a blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    
    // Save the SVG file
    saveAs(blob, `${filename}.svg`);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
};
