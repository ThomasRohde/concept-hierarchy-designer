import { NodeData } from '../../types';
import { saveAs } from 'file-saver';
import { buildIndex, getCardSubtree } from '../capabilityCardUtils.js';
import { markdownToHtmlSync } from '../markdownUtils.js';

/**
 * Creates a standalone HTML representation of the capability card
 * @param nodes All nodes in the tree
 * @param currentNodeId The ID of the current node to create a capability card for
 * @returns HTML string representation of the capability card
 */
const generateCapabilityCardHtml = (nodes: NodeData[], currentNodeId: string): string => {
  const index = buildIndex(nodes);
  const { current, kids } = getCardSubtree(index, currentNodeId);
  
  if (!current) {
    return `<html><body><h1>Node not found</h1></body></html>`;
  }
  
  // Generate HTML header with embedded CSS
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${current.name}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.5;
      color: #333;
      padding: 0;
      background-color: white;
      margin: 0;
      min-width: 100vw;
    }    

    .card-container {
      width: 100%;
      padding: 30px;
      background-color: white;
    }

    .header {
      margin-bottom: 20px;
      text-align: left;
    }

    .header h1 {
      font-size: 24px;
      color: #1a202c;
    }
    
    .header p {
      color: #718096;
    }
      .capability-card {
      padding: 20px;
    }
    
    .capability-scrollable-container {
      overflow-x: auto;
      width: 100%;
      padding-bottom: 15px; /* Add some padding at the bottom for scrollbar */
    }
    
    .capability-section {
      margin-bottom: 40px;
    }    
    
    .capability-section.current-section {
      margin-bottom: 30px;
    }
    
    .overflow-x-container {
      /* Remove overflow-x: auto from here as well */
      width: 100%;
    }
    
    .capability-section.current-section .capability-tile {
      display: block;
      width: 100%;
      min-width: fit-content;
    }
      .section-title {
      font-size: 20px;
      color: #2d3748;
      margin-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      font-weight: 600;
    }
      .capability-tile {
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 10px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }    .capability-current {
      background-color: #EBF8FF;
      border: 1px solid #90CDF4;
    }
    
    .capability-child {
      background-color: #F0FFF4;
      border: 1px solid #9AE6B4;
    }
    
    .capability-grandchild {
      background-color: #FEFCBF;
      border: 1px solid #FAF089;
    }
      .capability-name {
      font-weight: 600;
      margin-bottom: 8px;
      font-size: 16px;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }.capability-description {
      font-size: 14px;
      color: #4a5568;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }
    
    .capability-description h1,
    .capability-description h2,
    .capability-description h3,
    .capability-description h4,
    .capability-description h5,
    .capability-description h6 {
      margin: 8px 0 4px 0;
      font-weight: 600;
    }
      .capability-description h1 { font-size: 16px; }
    .capability-description h2 { font-size: 15px; }
    .capability-description h3 { font-size: 14px; }
    
    .capability-child .description-content h1 { font-size: 14px; }
    .capability-child .description-content h2 { font-size: 13px; }
    .capability-child .description-content h3 { font-size: 12px; }
    
    .capability-grandchild .description-content h1 { font-size: 13px; }
    .capability-grandchild .description-content h2 { font-size: 12px; }
    .capability-grandchild .description-content h3 { font-size: 11px; }
      .capability-description p {
      margin: 6px 0;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
      .capability-description code {
      background-color: #f7fafc;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
    }
    
    .capability-description pre {
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      margin: 8px 0;
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
    }
    
    .capability-description pre code {
      background-color: transparent;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }
    
    .capability-description strong {
      font-weight: 600;
    }
    
    .capability-description em {
      font-style: italic;
    }
    
    .capability-description a {
      color: #3182ce;
      text-decoration: underline;
    }
      .capability-description a:hover {
      color: #2c5282;
    }
    
    .capability-description table {
      border-collapse: collapse;
      width: 100%;
      margin: 8px 0;
      font-size: 13px;
    }
    
    .capability-description th,
    .capability-description td {
      border: 1px solid #e2e8f0;
      padding: 6px 8px;
      text-align: left;
    }
    
    .capability-description th {
      background-color: #f7fafc;
      font-weight: 600;
    }
    
    .capability-description tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    
    .capability-description hr {
      border: none;
      height: 1px;
      background-color: #e2e8f0;
      margin: 12px 0;
    }
    
    .capability-description blockquote {
      border-left: 4px solid #cbd5e0;
      margin: 8px 0;
      padding: 0 12px;
      color: #4a5568;
      font-style: italic;
    }
    
    .capability-description ul,
    .capability-description ol {
      margin: 6px 0;
      padding-left: 20px;
    }
    
    .capability-description li {
      margin: 2px 0;
    }
    
    .capability-description del {
      text-decoration: line-through;
      color: #718096;
    }.children-row {
      display: flex;
      gap: 20px;
      /* Remove overflow-x: auto since it's handled by the parent container */
      overflow-y: visible; 
      padding-bottom: 15px;
      width: 100%;
      min-width: max-content;
    }
      /* Apply scrollbar styling to the shared container */
    .capability-scrollable-container::-webkit-scrollbar {
      height: 8px;
    }
    
    .capability-scrollable-container::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .capability-scrollable-container::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }
    
    .capability-scrollable-container::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }.child-column {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 400px;
      width: 400px;
      flex-shrink: 0;
    }    
    
    .capability-child {
      min-height: 180px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    }
    
    /* Hover behavior for child cards */
    .capability-child:hover .description-content {
      max-height: none;
    }
    
    .capability-child:hover {
      min-height: auto;
      height: auto;
    }
      
    .capability-grandchild {
      min-height: 140px;
      overflow: hidden;
      position: relative;
      transition: all 0.3s ease;
    }
    
    /* Hover behavior for grandchild cards */
    .capability-grandchild:hover .description-content {
      max-height: none;
    }
    
    .capability-grandchild:hover {
      min-height: auto;
      height: auto;
    }
      
    .description-content {
      max-height: 100px;
      overflow: hidden;
      transition: max-height 0.3s ease;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }
      
    .capability-child.has-overflow .description-content:not(:hover)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(transparent, #F0FFF4);
      pointer-events: none;
    }
    
    .capability-grandchild.has-overflow .description-content:not(:hover)::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: linear-gradient(transparent, #FEFCBF);
      pointer-events: none;
    }
      
    footer {
      margin-top: 30px;
      text-align: left;
      font-size: 12px;
      color: #718096;
    }
  </style>
</head>
<body>
  <div class="card-container">
    <div class="header">
      <h1>${current.name}</h1>
      <p>Exported from Themis</p>
    </div>
      <div class="capability-card">      <!-- Current Capability -->
      <div class="capability-section current-section">
        <div class="overflow-x-container">
          <div class="capability-tile capability-current">
            <div class="capability-name">${current.name}</div>
            <div class="capability-description">${markdownToHtmlSync(current.description || 'No description')}</div>
          </div>
        </div>
      </div>
        <!-- Children Capabilities -->
      ${kids.length > 0 ? `
      <div class="capability-section">
        <div class="children-row">
          ${kids.map(kid => {
            const grandchildren = index.children.get(kid.id) || [];
            return `
            <div class="child-column">
              <div class="capability-tile capability-child" id="child-${kid.id}">
                <div class="capability-name">${kid.name}</div>
                <div class="description-content" id="desc-${kid.id}">${markdownToHtmlSync(kid.description || 'No description')}</div>
              </div>              ${grandchildren.length > 0 ? `
                <div class="grandchildren-section">
                  ${grandchildren.map(grandchild => `
                    <div class="capability-tile capability-grandchild" id="grandchild-${grandchild.id}">
                      <div class="capability-name">${grandchild.name}</div>
                      <div class="description-content" id="desc-${grandchild.id}">${markdownToHtmlSync(grandchild.description || 'No description')}</div>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
            `;
          }).join('')}        </div>
      </div>      ` : ''}
      </div>
    </div>
    
    <footer>
      <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
    </footer>
  </div>
    <script>
    // Check for overflow and set current capability width to match children row
    document.addEventListener('DOMContentLoaded', function() {
      // Check overflow for child cards
      const childCards = document.querySelectorAll('.capability-child');
      childCards.forEach(card => {
        const descContent = card.querySelector('.description-content');
        if (descContent.scrollHeight > descContent.clientHeight) {
          card.classList.add('has-overflow');
        }
      });
      
      // Check overflow for grandchild cards
      const grandchildCards = document.querySelectorAll('.capability-grandchild');
      grandchildCards.forEach(card => {
        const descContent = card.querySelector('.description-content');
        if (descContent.scrollHeight > descContent.clientHeight) {
          card.classList.add('has-overflow');
        }
      });
        // Set current capability width to match children row width
      const updateCurrentNodeWidth = () => {
        const childrenRow = document.querySelector('.children-row');
        const currentCapabilityTile = document.querySelector('.capability-current');
        
        if (childrenRow && currentCapabilityTile) {
          // Calculate total width of children row content
          const childColumns = childrenRow.querySelectorAll('.child-column');
          const gap = 20; // gap between columns
          let totalWidth = 0;
          
          childColumns.forEach(column => {
            totalWidth += column.offsetWidth;
          });
          
          if (childColumns.length > 1) {
            totalWidth += (childColumns.length - 1) * gap; // add gaps between columns
          }
          
          // Set the current capability width to match the children row width
          currentCapabilityTile.style.width = totalWidth + 'px';
          currentCapabilityTile.style.minWidth = totalWidth + 'px';
        }
      };
      
      // Update width initially
      updateCurrentNodeWidth();
      
      // Update width on resize
      window.addEventListener('resize', updateCurrentNodeWidth);
    });
  </script>
</body>
</html>
  `;
  
  return html;
};

/**
 * Saves the capability card as a standalone HTML file and opens it in the browser
 * @param nodes All nodes in the tree
 * @param currentNodeId The ID of the node to create a capability card for
 * @param filename The name of the file to save (without extension)
 */
export const saveCapabilityCardAsHtml = async (
  nodes: NodeData[],
  currentNodeId: string,
  filename: string = 'capability-card'
): Promise<void> => {
  const html = generateCapabilityCardHtml(nodes, currentNodeId);
  
  const blob = new Blob([html], { type: 'text/html' });
  
  // Save the file using file-saver
  saveAs(blob, `${filename}.html`);
  
  // Also open the HTML in a new browser tab/window
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, '_blank');
  
  // Clean up the URL after a delay to ensure it has time to load
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 10000); // 10 seconds should be enough for the browser to load the content
  
  // Fallback: if popup was blocked, provide user feedback
  if (!newWindow) {
    console.warn('Popup blocked - HTML file saved but could not be opened automatically');
    // You could add a toast notification here if you have a toast system
  }
};
