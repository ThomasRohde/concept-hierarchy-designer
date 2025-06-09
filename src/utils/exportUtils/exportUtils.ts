import { NodeData } from '../../types';
import { saveTreeAsJson } from './jsonExporter.js';
import { saveCapabilityCardAsHtml } from './htmlExporter.js';
import { saveCapabilityCardAsPdf } from './pdfExporter.js';
import { saveCapabilityCardAsSvg } from './svgExporter.js';
import { saveCapabilityCardAsSvg as saveCapabilityCardAsSvgEnhanced } from './capabilityCardSvgExporter.js';
import { saveCapabilityCardAsPng } from './pngExporter.js';

export type ExportFormat = 'json' | 'html' | 'pdf' | 'svg' | 'svg-enhanced' | 'png';

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
 * Export capability card in the selected format
 * @param nodes The full node tree
 * @param currentNodeId The ID of the current node to be exported
 * @param format The export format
 * @param elementRef Optional reference to the DOM element for HTML/SVG/PNG exports
 * @param filename Optional custom filename
 */
export const exportCapabilityCard = async (
  nodes: NodeData[],
  currentNodeId: string,
  format: ExportFormat,
  elementRef?: React.RefObject<HTMLElement> | { current: HTMLElement },
  filename?: string
) => {
  // Default filename based on node name
  const currentNode = nodes.find(n => n.id === currentNodeId);
  const defaultFilename = currentNode?.name 
    ? `capability-card-${currentNode.name.toLowerCase().replace(/\s+/g, '-')}`
    : 'capability-card';
    
  const actualFilename = filename || defaultFilename;
  
  try {
    switch (format) {
      case 'json':
        // Export just the subtree related to this capability card (current, kids, grandkids)
        saveTreeAsJson(nodes, actualFilename);
        break;
        
      case 'html':
        await saveCapabilityCardAsHtml(nodes, currentNodeId, actualFilename);
        break;
        
      case 'pdf':
        if (elementRef?.current) {
          await saveCapabilityCardAsPdf(elementRef.current, actualFilename);
        } else {
          throw new Error('Element reference is required for PDF export');
        }
        break;
        
      case 'svg':
        if (elementRef?.current) {
          await saveCapabilityCardAsSvg(elementRef.current, actualFilename);
        } else {
          throw new Error('Element reference is required for SVG export');
        }
        break;
        
      case 'svg-enhanced':
        if (elementRef?.current) {
          await saveCapabilityCardAsSvgEnhanced(elementRef.current, nodes, currentNodeId, actualFilename);
        } else {
          throw new Error('Element reference is required for enhanced SVG export');
        }
        break;
        
      case 'png':
        if (elementRef?.current) {
          await saveCapabilityCardAsPng(elementRef.current, actualFilename);
        } else {
          throw new Error('Element reference is required for PNG export');
        }
        break;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
    
    return true;
  } catch (error) {
    console.error('Export failed:', error);
    return false;
  }
};
