import { saveAs } from 'file-saver';
import { NodeData } from '../../types';
import { buildIndex, getCardSubtree } from '../capabilityCardUtils';
import { CAPABILITY_CARD_LAYOUT, getCardHeight } from '../../constants/capabilityCardLayout';

interface SvgTextOptions {
  text: string;
  x: number;
  y: number;
  width: number;
  maxHeight: number;
  fontSize: number;
  fontWeight?: string;
  fill?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
}

/**
 * Wraps text into multiple lines based on width constraints
 */
const wrapText = (
  text: string,
  width: number,
  fontSize: number,
  fontFamily: string = 'Arial'
): string[] => {
  // Fallback for environments without canvas support
  if (typeof document === 'undefined' || !document.createElement) {
    // Simple word-based wrapping when canvas is not available
    const words = text.split(' ');
    const lines: string[] = [];
    const avgCharWidth = fontSize * 0.5; // Rough estimate
    const maxCharsPerLine = Math.floor(width / avgCharWidth);
    
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > maxCharsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    // Fallback to character-based estimation
    const words = text.split(' ');
    const lines: string[] = [];
    const avgCharWidth = fontSize * 0.5;
    const maxCharsPerLine = Math.floor(width / avgCharWidth);
    
    let currentLine = '';
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (testLine.length > maxCharsPerLine && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines;
  }

  ctx.font = `${fontSize}px ${fontFamily}`;
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > width && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

/**
 * Creates SVG text elements with proper wrapping
 */
const createSvgText = (options: SvgTextOptions): SVGElement[] => {
  const {
    text,
    x,
    y,
    width,
    maxHeight,
    fontSize,
    fontWeight = 'normal',
    fill = '#000',
    textAlign = 'left',
    lineHeight = 1.2
  } = options;

  const lines = wrapText(text, width - 16, fontSize); // Account for padding
  const actualLineHeight = fontSize * lineHeight;
  const maxLines = Math.floor(maxHeight / actualLineHeight);
  const displayLines = lines.slice(0, maxLines);

  // If text is truncated, add ellipsis to last line
  if (lines.length > maxLines && maxLines > 0) {
    const lastLine = displayLines[displayLines.length - 1];
    const truncatedLines = wrapText(`${lastLine}...`, width - 16, fontSize);
    displayLines[displayLines.length - 1] = truncatedLines[0];
  }

  const textElements: SVGElement[] = [];
  
  displayLines.forEach((line, index) => {
    const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    
    // Calculate x position based on alignment
    let textX = x + 8; // Default padding
    if (textAlign === 'center') {
      textX = x + width / 2;
    } else if (textAlign === 'right') {
      textX = x + width - 8;
    }
    
    textElement.setAttribute('x', textX.toString());
    textElement.setAttribute('y', (y + (index + 1) * actualLineHeight).toString());
    textElement.setAttribute('font-family', 'Arial, sans-serif');
    textElement.setAttribute('font-size', fontSize.toString());
    textElement.setAttribute('font-weight', fontWeight);
    textElement.setAttribute('fill', fill);
    textElement.setAttribute('text-anchor', textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start');
    textElement.textContent = line;
    
    textElements.push(textElement);
  });

  return textElements;
};

/**
 * Creates a rounded rectangle SVG element
 */
const createRoundedRect = (
  x: number,
  y: number,
  width: number,
  height: number,
  rx: number,
  fill: string,
  stroke?: string,
  strokeWidth?: number
): SVGElement => {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x.toString());
  rect.setAttribute('y', y.toString());
  rect.setAttribute('width', width.toString());
  rect.setAttribute('height', height.toString());
  rect.setAttribute('rx', rx.toString());
  rect.setAttribute('fill', fill);
  
  if (stroke) {
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', (strokeWidth || 1).toString());
  }
  
  return rect;
};

/**
 * Gets color scheme for different tile variants
 */
const getVariantColors = (variant: 'current' | 'child' | 'grandchild') => {
  switch (variant) {
    case 'current':
      return { background: '#3B82F6', border: '#2563EB', text: '#FFFFFF', textSecondary: '#DBEAFE' };
    case 'child':
      return { background: '#F472B6', border: '#EC4899', text: '#FFFFFF', textSecondary: '#FCE7F3' };
    case 'grandchild':
      return { background: '#4ADE80', border: '#22C55E', text: '#FFFFFF', textSecondary: '#DCFCE7' };
    default:
      return { background: '#FFFFFF', border: '#E5E7EB', text: '#000000', textSecondary: '#6B7280' };
  }
};

/**
 * Converts capability card data to pure SVG
 */
export const saveCapabilityCardAsSvg = async (
  element: HTMLElement,
  filename: string = 'capability-card'
): Promise<void> => {
  try {
    // Extract card data from the DOM element
    const nodes = extractCardData(element);
    if (!nodes) {
      throw new Error('Could not extract card data from element');
    }

    const { current, children, grandchildren } = nodes;
    
    // Calculate layout dimensions
    const cardWidth = CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.FIXED_CARD_WIDTH;
    const cardGap = CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP;
    const rowGap = CAPABILITY_CARD_LAYOUT.SPACING.ROW_GAP;
    const padding = CAPABILITY_CARD_LAYOUT.SPACING.CONTAINER_PADDING;
    
    const numColumns = Math.max(1, children.length);
    const totalWidth = numColumns * cardWidth + (numColumns - 1) * cardGap + 2 * padding;
    
    // Calculate number of grandchildren rows
    const maxGrandchildrenPerParent = Math.max(
      0,
      ...children.map(child => child.grandchildren?.length || 0)
    );
    
    const currentHeight = getCardHeight('current');
    const childHeight = getCardHeight('child');
    const grandchildHeight = getCardHeight('grandchild');
    const grandchildRowGap = CAPABILITY_CARD_LAYOUT.SPACING.GRANDCHILD_ROW_GAP;
    
    const totalHeight = padding * 2 + 
                       currentHeight + rowGap + 
                       childHeight + 
                       (maxGrandchildrenPerParent > 0 ? grandchildRowGap + maxGrandchildrenPerParent * (grandchildHeight + grandchildRowGap) : 0);

    // Create SVG element
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', totalWidth.toString());
    svg.setAttribute('height', totalHeight.toString());
    svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
    svg.setAttribute('xmlns', svgNS);

    let currentY = padding;

    // Draw current node (spanning the width)
    const currentColors = getVariantColors('current');
    const currentRect = createRoundedRect(
      padding,
      currentY,
      totalWidth - 2 * padding,
      currentHeight,
      8,
      currentColors.background,
      currentColors.border,
      2
    );
    svg.appendChild(currentRect);

    // Add current node text
    const currentTitleElements = createSvgText({
      text: current.name,
      x: padding,
      y: currentY + 8,
      width: totalWidth - 2 * padding,
      maxHeight: 30,
      fontSize: 20,
      fontWeight: 'bold',
      fill: currentColors.text,
      textAlign: 'left'
    });
    
    currentTitleElements.forEach(el => svg.appendChild(el));

    if (current.description) {
      const currentDescElements = createSvgText({
        text: current.description,
        x: padding,
        y: currentY + 40,
        width: totalWidth - 2 * padding,
        maxHeight: currentHeight - 50,
        fontSize: 14,
        fill: currentColors.textSecondary,
        textAlign: 'left',
        lineHeight: 1.3
      });
      
      currentDescElements.forEach(el => svg.appendChild(el));
    }

    currentY += currentHeight + rowGap;

    // Draw children row
    children.forEach((child, index) => {
      const x = padding + index * (cardWidth + cardGap);
      const childColors = getVariantColors('child');
      
      const childRect = createRoundedRect(
        x,
        currentY,
        cardWidth,
        childHeight,
        8,
        childColors.background,
        childColors.border,
        2
      );
      svg.appendChild(childRect);

      // Add child title
      const childTitleElements = createSvgText({
        text: child.name,
        x: x,
        y: currentY + 8,
        width: cardWidth,
        maxHeight: 25,
        fontSize: 16,
        fontWeight: 'bold',
        fill: childColors.text,
        textAlign: 'left'
      });
      
      childTitleElements.forEach(el => svg.appendChild(el));

      // Add child description
      if (child.description) {
        const childDescElements = createSvgText({
          text: child.description,
          x: x,
          y: currentY + 35,
          width: cardWidth,
          maxHeight: childHeight - 45,
          fontSize: 12,
          fill: childColors.textSecondary,
          textAlign: 'left',
          lineHeight: 1.3
        });
        
        childDescElements.forEach(el => svg.appendChild(el));
      }
    });

    currentY += childHeight + grandchildRowGap;

    // Draw grandchildren rows
    for (let rowIndex = 0; rowIndex < maxGrandchildrenPerParent; rowIndex++) {
      children.forEach((child, childIndex) => {
        const grandchild = child.grandchildren?.[rowIndex];
        if (!grandchild) return;

        const x = padding + childIndex * (cardWidth + cardGap);
        const grandchildColors = getVariantColors('grandchild');
        
        const grandchildRect = createRoundedRect(
          x,
          currentY,
          cardWidth,
          grandchildHeight,
          8,
          grandchildColors.background,
          grandchildColors.border,
          2
        );
        svg.appendChild(grandchildRect);

        // Add grandchild title
        const grandchildTitleElements = createSvgText({
          text: grandchild.name,
          x: x,
          y: currentY + 8,
          width: cardWidth,
          maxHeight: 20,
          fontSize: 14,
          fontWeight: 'bold',
          fill: grandchildColors.text,
          textAlign: 'left'
        });
        
        grandchildTitleElements.forEach(el => svg.appendChild(el));

        // Add grandchild description
        if (grandchild.description) {
          const grandchildDescElements = createSvgText({
            text: grandchild.description,
            x: x,
            y: currentY + 28,
            width: cardWidth,
            maxHeight: grandchildHeight - 35,
            fontSize: 11,
            fill: grandchildColors.textSecondary,
            textAlign: 'left',
            lineHeight: 1.3
          });
          
          grandchildDescElements.forEach(el => svg.appendChild(el));
        }
      });

      currentY += grandchildHeight + grandchildRowGap;
    }

    // Convert SVG to string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // Add XML declaration
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
    
    // Create and save blob
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, `${filename}.svg`);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
};

/**
 * Extracts structured data from the capability card DOM element
 */
function extractCardData(element: HTMLElement) {
  // This is a simplified extraction - in practice, you'd want to pass
  // the actual node data to the export function directly
  // For now, return null to indicate we need to refactor the calling code
  return null;
}

/**
 * Main export function that accepts node data directly
 */
export const exportCapabilityCardAsSvg = async (
  nodes: NodeData[],
  currentId: string,
  filename: string = 'capability-card'
): Promise<void> => {
  try {
    const index = buildIndex(nodes);
    const { current, kids } = getCardSubtree(index, currentId);
    
    if (!current) {
      throw new Error('Current node not found');
    }

    // Prepare data structure
    const children = kids.map(kid => ({
      ...kid,
      grandchildren: index.children.get(kid.id) || []
    }));

    // Calculate layout dimensions
    const cardWidth = CAPABILITY_CARD_LAYOUT.CARDS_PER_ROW.FIXED_CARD_WIDTH;
    const cardGap = CAPABILITY_CARD_LAYOUT.SPACING.CARD_GAP;
    const rowGap = CAPABILITY_CARD_LAYOUT.SPACING.ROW_GAP;
    const padding = CAPABILITY_CARD_LAYOUT.SPACING.CONTAINER_PADDING;
    
    const numColumns = Math.max(1, children.length);
    const totalWidth = numColumns * cardWidth + (numColumns - 1) * cardGap + 2 * padding;
    
    const maxGrandchildrenPerParent = Math.max(
      0,
      ...children.map(child => child.grandchildren?.length || 0)
    );
    
    const currentHeight = getCardHeight('current');
    const childHeight = getCardHeight('child');
    const grandchildHeight = getCardHeight('grandchild');
    const grandchildRowGap = CAPABILITY_CARD_LAYOUT.SPACING.GRANDCHILD_ROW_GAP;
    
    const totalHeight = padding * 2 + 
                       currentHeight + rowGap + 
                       childHeight + 
                       (maxGrandchildrenPerParent > 0 ? grandchildRowGap + maxGrandchildrenPerParent * (grandchildHeight + grandchildRowGap) : 0);

    // Create SVG element
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', totalWidth.toString());
    svg.setAttribute('height', totalHeight.toString());
    svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
    svg.setAttribute('xmlns', svgNS);

    let currentY = padding;

    // Draw current node (spanning the width)
    const currentColors = getVariantColors('current');
    const currentRect = createRoundedRect(
      padding,
      currentY,
      totalWidth - 2 * padding,
      currentHeight,
      8,
      currentColors.background,
      currentColors.border,
      2
    );
    svg.appendChild(currentRect);

    // Add current node text
    const currentTitleElements = createSvgText({
      text: current.name,
      x: padding,
      y: currentY + 8,
      width: totalWidth - 2 * padding,
      maxHeight: 30,
      fontSize: 20,
      fontWeight: 'bold',
      fill: currentColors.text,
      textAlign: 'left'
    });
    
    currentTitleElements.forEach(el => svg.appendChild(el));

    if (current.description) {
      const processedDescription = current.description.startsWith(current.name) 
        ? current.description.substring(current.name.length).trimStart()
        : current.description;
        
      const currentDescElements = createSvgText({
        text: processedDescription,
        x: padding,
        y: currentY + 40,
        width: totalWidth - 2 * padding,
        maxHeight: currentHeight - 50,
        fontSize: 14,
        fill: currentColors.textSecondary,
        textAlign: 'left',
        lineHeight: 1.3
      });
      
      currentDescElements.forEach(el => svg.appendChild(el));
    }

    currentY += currentHeight + rowGap;

    // Draw children row
    children.forEach((child, index) => {
      const x = padding + index * (cardWidth + cardGap);
      const childColors = getVariantColors('child');
      
      const childRect = createRoundedRect(
        x,
        currentY,
        cardWidth,
        childHeight,
        8,
        childColors.background,
        childColors.border,
        2
      );
      svg.appendChild(childRect);

      // Add child title
      const childTitleElements = createSvgText({
        text: child.name,
        x: x,
        y: currentY + 8,
        width: cardWidth,
        maxHeight: 25,
        fontSize: 16,
        fontWeight: 'bold',
        fill: childColors.text,
        textAlign: 'left'
      });
      
      childTitleElements.forEach(el => svg.appendChild(el));

      // Add child description
      if (child.description) {
        const processedDescription = child.description.startsWith(child.name) 
          ? child.description.substring(child.name.length).trimStart()
          : child.description;
          
        const childDescElements = createSvgText({
          text: processedDescription,
          x: x,
          y: currentY + 35,
          width: cardWidth,
          maxHeight: childHeight - 45,
          fontSize: 12,
          fill: childColors.textSecondary,
          textAlign: 'left',
          lineHeight: 1.3
        });
        
        childDescElements.forEach(el => svg.appendChild(el));
      }
    });

    currentY += childHeight + grandchildRowGap;

    // Draw grandchildren rows
    for (let rowIndex = 0; rowIndex < maxGrandchildrenPerParent; rowIndex++) {
      children.forEach((child, childIndex) => {
        const grandchild = child.grandchildren?.[rowIndex];
        if (!grandchild) return;

        const x = padding + childIndex * (cardWidth + cardGap);
        const grandchildColors = getVariantColors('grandchild');
        
        const grandchildRect = createRoundedRect(
          x,
          currentY,
          cardWidth,
          grandchildHeight,
          8,
          grandchildColors.background,
          grandchildColors.border,
          2
        );
        svg.appendChild(grandchildRect);

        // Add grandchild title
        const grandchildTitleElements = createSvgText({
          text: grandchild.name,
          x: x,
          y: currentY + 8,
          width: cardWidth,
          maxHeight: 20,
          fontSize: 14,
          fontWeight: 'bold',
          fill: grandchildColors.text,
          textAlign: 'left'
        });
        
        grandchildTitleElements.forEach(el => svg.appendChild(el));

        // Add grandchild description
        if (grandchild.description) {
          const processedDescription = grandchild.description.startsWith(grandchild.name) 
            ? grandchild.description.substring(grandchild.name.length).trimStart()
            : grandchild.description;
            
          const grandchildDescElements = createSvgText({
            text: processedDescription,
            x: x,
            y: currentY + 28,
            width: cardWidth,
            maxHeight: grandchildHeight - 35,
            fontSize: 11,
            fill: grandchildColors.textSecondary,
            textAlign: 'left',
            lineHeight: 1.3
          });
          
          grandchildDescElements.forEach(el => svg.appendChild(el));
        }
      });

      currentY += grandchildHeight + grandchildRowGap;
    }

    // Convert SVG to string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    
    // Add XML declaration
    svgString = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' + svgString;
    
    // Create and save blob
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    saveAs(blob, `${filename}.svg`);
  } catch (error) {
    console.error('Failed to export SVG:', error);
    throw error;
  }
};
