import { saveAs } from 'file-saver';
import { NodeData } from '../../types';
import { CAPABILITY_CARD_LAYOUT } from '../../constants/capabilityCardLayout';


/**
 * Clones an element and applies export mode styling for consistent heights
 */
const prepareElementForExport = (element: HTMLElement): HTMLElement => {
  // Clone the element deeply
  const clone = element.cloneNode(true) as HTMLElement;
  
  // Apply export mode styling by adding data attributes and inline styles
  const applyExportStyles = (el: HTMLElement) => {
    // Find capability tiles and apply fixed heights
    if (el.classList.contains('capability-tile') || 
        el.querySelector('[class*="bg-blue-500"]') || 
        el.querySelector('[class*="bg-pink-400"]') || 
        el.querySelector('[class*="bg-green-400"]')) {
      
      // Determine variant based on background color classes
      let variant: 'current' | 'child' | 'grandchild' = 'child';
      if (el.querySelector('[class*="bg-blue-500"]')) variant = 'current';
      else if (el.querySelector('[class*="bg-pink-400"]')) variant = 'child';
      else if (el.querySelector('[class*="bg-green-400"]')) variant = 'grandchild';
      
      // Apply fixed height and styling
      const height = CAPABILITY_CARD_LAYOUT.CARD_HEIGHTS[variant.toUpperCase() as keyof typeof CAPABILITY_CARD_LAYOUT.CARD_HEIGHTS];
      const padding = CAPABILITY_CARD_LAYOUT.PADDING[variant.toUpperCase() as keyof typeof CAPABILITY_CARD_LAYOUT.PADDING];
      
      el.style.height = `${height}px`;
      el.style.minHeight = `${height}px`;
      el.style.maxHeight = `${height}px`;
      el.style.padding = `${padding}px`;
      el.style.boxSizing = 'border-box';
      el.style.overflow = 'hidden';
      
      // Remove responsive classes that might interfere
      el.classList.remove('h-full');
    }
    
    // Apply consistent spacing
    if (el.classList.contains('space-y-6')) {
      el.classList.remove('space-y-6');
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.gap = `${CAPABILITY_CARD_LAYOUT.SPACING.ROW_GAP}px`;
    }
    
    // Update gap classes
    if (el.classList.contains('gap-4')) {
      el.classList.remove('gap-4');
      el.style.gap = `${CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP}px`;
    }
    
    // Update padding classes
    if (el.classList.contains('p-6')) {
      el.classList.remove('p-6');
      el.style.padding = `${CAPABILITY_CARD_LAYOUT.SPACING.CONTAINER_PADDING}px`;
    }
    
    // Remove overflow-auto for export
    if (el.classList.contains('overflow-auto')) {
      el.classList.remove('overflow-auto');
      el.style.overflow = 'visible';
    }
    
    // Recursively apply to children
    Array.from(el.children).forEach(child => {
      applyExportStyles(child as HTMLElement);
    });
  };
  
  applyExportStyles(clone);
  return clone;
};

/**
 * Gets computed styles for an element and applies them inline
 */
const applyComputedStyles = (originalElement: HTMLElement, clonedElement: HTMLElement) => {
  const computedStyle = window.getComputedStyle(originalElement);
  
  // Apply important styles for SVG export
  const importantStyles = [
    'font-family', 'font-size', 'font-weight', 'color', 'line-height',
    'background-color', 'border', 'border-radius', 'border-color', 'border-width',
    'padding', 'margin', 'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
    'display', 'flex-direction', 'justify-content', 'align-items', 'gap',
    'text-align', 'white-space', 'overflow', 'box-sizing'
  ];
  
  importantStyles.forEach(style => {
    const value = computedStyle.getPropertyValue(style);
    if (value) {
      clonedElement.style.setProperty(style, value);
    }
  });
  
  // Recursively apply styles to children
  Array.from(originalElement.children).forEach((child, index) => {
    if (clonedElement.children[index]) {
      applyComputedStyles(child as HTMLElement, clonedElement.children[index] as HTMLElement);
    }
  });
};

/**
 * Saves the capability card as an SVG file with consistent card heights
 * @param element DOM element to convert to SVG
 * @param _nodes The full node tree (unused in current implementation)
 * @param _currentNodeId The current node ID (unused in current implementation)
 * @param filename The name of the file to save (without extension)
 */
export const saveCapabilityCardAsSvg = async (
  element: HTMLElement,
  _nodes?: NodeData[],
  _currentNodeId?: string,
  filename: string = 'capability-card'
): Promise<void> => {
  try {
    // Prepare the element for export with consistent heights
    const exportElement = prepareElementForExport(element);
    
    // Create a temporary container to measure the export element
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.top = '-9999px';
    tempContainer.style.left = '-9999px';
    tempContainer.style.visibility = 'hidden';
    tempContainer.style.pointerEvents = 'none';
    tempContainer.appendChild(exportElement);
    document.body.appendChild(tempContainer);
    
    // Apply computed styles to ensure accurate rendering
    applyComputedStyles(element, exportElement);
    
    // Get dimensions after styling is applied
    const rect = exportElement.getBoundingClientRect();
    const width = Math.max(rect.width, CAPABILITY_CARD_LAYOUT.EXPORT.DEFAULT_WIDTH);
    const height = Math.max(rect.height, CAPABILITY_CARD_LAYOUT.EXPORT.DEFAULT_HEIGHT);
    
    // Create SVG element
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('xmlns', svgNS);
    
    // Add white background
    const background = document.createElementNS(svgNS, 'rect');
    background.setAttribute('width', '100%');
    background.setAttribute('height', '100%');
    background.setAttribute('fill', 'white');
    svg.appendChild(background);
    
    // Convert the HTML to SVG using foreignObject
    const foreignObject = document.createElementNS(svgNS, 'foreignObject');
    foreignObject.setAttribute('width', '100%');
    foreignObject.setAttribute('height', '100%');
    foreignObject.setAttribute('x', '0');
    foreignObject.setAttribute('y', '0');
    
    // Create a wrapper div with proper namespace
    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    wrapper.style.height = '100%';
    wrapper.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    wrapper.appendChild(exportElement.cloneNode(true));
    
    foreignObject.appendChild(wrapper);
    svg.appendChild(foreignObject);
    
    // Clean up temporary container
    document.body.removeChild(tempContainer);
    
    // Convert the SVG element to a string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // Add XML declaration and improve formatting
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
    
    // Create a blob from the SVG string
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    
    // Save the SVG file
    saveAs(blob, `${filename}.svg`);
    
  } catch (error) {
    console.error('Failed to export capability card as SVG:', error);
    throw error;
  }
};

/**
 * Legacy function that maintains compatibility with existing SVG exporter
 * @deprecated Use saveCapabilityCardAsSvg instead
 */
export const saveCapabilityCardAsSvgLegacy = async (
  element: HTMLElement,
  filename: string = 'capability-card'
): Promise<void> => {
  return saveCapabilityCardAsSvg(element, undefined, undefined, filename);
};