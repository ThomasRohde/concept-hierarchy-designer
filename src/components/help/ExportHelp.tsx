<!-- filepath: c:\Users\thoma\Projects\concept-hierarchy-designer\src\components\help\ExportHelp.tsx -->
import React from 'react';
import { Card } from '../ui/Card';

const ExportHelp: React.FC = () => {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Exporting Capability Cards</h2>
      
      <p className="mb-4">
        The Concept Hierarchy Designer allows you to export capability cards in various formats for sharing, 
        documentation, presentations, and more.
      </p>

      <h3 className="text-lg font-semibold mt-6 mb-2">Available Export Formats</h3>

      <ul className="list-disc pl-6 space-y-3 mb-6">
        <li>
          <strong>SVG Image (.svg)</strong> - Vector graphics format ideal for presentations and documentation. 
          Maintains clear text and shapes at any size.
        </li>
        <li>
          <strong>PNG Image (.png)</strong> - Raster image format with transparency support. 
          Best for sharing screenshots and social media.
        </li>
        <li>
          <strong>PDF Document (.pdf)</strong> - Document format for printing and formal documentation. 
          Preserves formatting across devices.
        </li>
        <li>
          <strong>HTML File (.html)</strong> - Interactive standalone webpage that can be opened in any browser. 
          Includes styling and formatting.
        </li>
        <li>
          <strong>JSON Data (.json)</strong> - Machine-readable data format containing the capability card structure. 
          Useful for integration with other tools.
        </li>
      </ul>

      <h3 className="text-lg font-semibold mt-6 mb-2">How to Export</h3>

      <ol className="list-decimal pl-6 space-y-3 mb-6">
        <li>Open a capability card by clicking on a node in the tree view</li>
        <li>Click the "Export" button in the top-right corner of the card modal</li>
        <li>Select your desired export format from the dropdown menu</li>
        <li>The browser will automatically download the exported file</li>
      </ol>

      <h3 className="text-lg font-semibold mt-6 mb-2">Export Contents</h3>

      <p className="mb-4">
        All exports include the complete three-generation view:
      </p>

      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Current node</strong> (Level N) - The selected capability</li>
        <li><strong>Children</strong> (Level N+1) - Direct child capabilities</li>
        <li><strong>Grandchildren</strong> (Level N+2) - Children of each child capability</li>
      </ul>

      <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
        <h4 className="text-md font-semibold text-blue-800 mb-2">Pro Tip</h4>
        <p className="text-sm text-blue-700">
          The SVG and HTML exports are particularly useful for documentation as they contain 
          searchable text and can be scaled without losing quality.
        </p>
      </div>
    </Card>
  );
};

export default ExportHelp;
