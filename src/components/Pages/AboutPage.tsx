import React from 'react';
import { CardContent } from '../ui/Card';

const AboutPage: React.FC = () => {
  return (
    <CardContent className="p-4 sm:p-6 flex-grow overflow-auto">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <img 
            src="/favicon.svg" 
            alt="Themis Logo" 
            className="w-12 h-12 mr-4"
          />
          <h1 className="text-2xl sm:text-3xl font-bold">About Themis</h1>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Purpose</h2>
          <p className="text-gray-700 mb-4">
            Themis (formerly Concept Hierarchy Designer) is a powerful Progressive Web App (PWA) for creating, organizing, and visualizing hierarchical knowledge structures.
            It was developed to help researchers, educators, and knowledge workers build conceptual frameworks and knowledge maps
            in a simple and intuitive way. With cloud synchronization via GitHub Gists, you can backup, share, and collaborate on your concept trees from anywhere.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Features</h2>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li>Drag and drop interface for intuitive organization</li>
            <li>Keyboard navigation with arrow keys and visual selection feedback</li>
            <li>Node selection with highlighting and auto-scroll to focused nodes</li>
            <li>Comprehensive keyboard shortcuts for efficient navigation</li>
            <li>Unlimited depth for complex hierarchies</li>
            <li>Smart clipboard with copy/paste functionality</li>
            <li>AI-powered suggestions with Magic Wand feature and multiple prompt system</li>
            <li>GitHub Gist synchronization for backup and sharing</li>
            <li>Offline-first PWA - works without internet connection</li>
            <li>Background sync with conflict resolution</li>
            <li>Secure Personal Access Token authentication with client-side encryption</li>
            <li>Import and export in multiple formats (JSON, SVG, PNG, PDF, HTML)</li>
            <li>Responsive design works on desktop, tablet, and mobile</li>
            <li>Optimized for performance with virtualized rendering for large hierarchies</li>
            <li>IndexedDB storage with localStorage fallback</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Node Row Icons</h2>
          <p className="text-gray-700 mb-4">
            Each node in the concept tree has the following icons available when hovering:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li><strong>Chevron Right/Down (▶/▼):</strong> Expand or collapse child nodes</li>
            <li><strong>Edit (✏️):</strong> Edit the node name and description</li>
            <li><strong>Capability Card (💳):</strong> View or edit the node's capability card (when available)</li>
            <li><strong>Magic Wand (✨):</strong> Generate AI suggestions for this node</li>
            <li><strong>Copy (📋):</strong> Copy this node and its children to clipboard</li>
            <li><strong>Paste (📌):</strong> Paste clipboard content as children of this node</li>
            <li><strong>Add Child (➕):</strong> Add a new child node</li>
            <li><strong>Delete (🗑️):</strong> Delete this node and its children</li>
          </ul>
          <p className="text-gray-700 mt-3">
            Nodes support drag and drop for easy reordering and restructuring. Hover tooltips display the full node description when available.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Keyboard Navigation</h2>
          <p className="text-gray-700 mb-4">
            Navigate your concept trees efficiently using keyboard shortcuts:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li><strong>Arrow Keys:</strong> Navigate between nodes (↑↓) and expand/collapse (←→)</li>
            <li><strong>Home/End:</strong> Jump to first or last visible node</li>
            <li><strong>Enter:</strong> Edit the currently selected node</li>
            <li><strong>Click/Tab:</strong> Select nodes for keyboard navigation</li>
            <li><strong>Ctrl+Shift+S:</strong> Quick sync to GitHub Gist</li>
            <li><strong>Ctrl+Enter:</strong> Submit forms in modal dialogs</li>
            <li><strong>ESC:</strong> Close modal dialogs</li>
            <li><strong>Visual Feedback:</strong> Selected nodes are highlighted with gray background</li>
            <li><strong>Auto-scroll:</strong> Focused nodes automatically scroll into view</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Technology</h2>
          <p className="text-gray-700 mb-4">
            Built with modern web technologies including:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li>React for component-based UI</li>
            <li>TypeScript for type safety</li>
            <li>Vite for fast development and building</li>
            <li>Framer Motion for smooth animations</li>
            <li>React DnD for drag and drop functionality</li>
            <li>React Router for navigation</li>
            <li>Tailwind CSS for styling</li>
            <li>Vite PWA Plugin for Progressive Web App capabilities</li>
            <li>Workbox for service worker and caching strategies</li>
            <li>IndexedDB for primary client-side storage</li>
            <li>GitHub Gist API for cloud synchronization</li>
            <li>Web Crypto API for secure token encryption</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Accessibility & PWA Features</h2>
          <p className="text-gray-700 mb-4">
            The application is designed with accessibility and modern web standards in mind:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li>Full keyboard navigation support for all tree operations</li>
            <li>Clear visual focus indicators for selected nodes</li>
            <li>ARIA labels and semantic HTML for screen readers</li>
            <li>Responsive design that works across different screen sizes</li>
            <li>High contrast visual feedback for interactive elements</li>
            <li>Progressive Web App - installable on desktop and mobile devices</li>
            <li>Offline functionality with service worker caching</li>
            <li>Background sync capabilities when connection is restored</li>
            <li>Secure local storage with encryption for sensitive data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Data Privacy</h2>
          <p className="text-gray-700 mb-4">
            Themis respects your privacy and data security:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li>All data is stored locally on your device</li>
            <li>GitHub Personal Access Tokens are encrypted using the Web Crypto API</li>
            <li>No data is sent to our servers - synchronization happens directly between your device and GitHub</li>
            <li>When using AI features, only the minimum necessary data is sent to generate suggestions</li>
            <li>You maintain full control over your data export and sharing options</li>
          </ul>
        </section>
          
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-gray-700">
            For questions, bug reports, or feature suggestions, please contact the developer at:<br />
            <a href="mailto:thomas@rohde.name" className="text-blue-600 hover:underline">
              thomas@rohde.name
            </a>
          </p>
        </section>
      </div>
    </CardContent>
  );
};

export default AboutPage;
