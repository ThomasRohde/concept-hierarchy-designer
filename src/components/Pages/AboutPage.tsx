import React from 'react';
import { CardContent } from '../ui/Card';

const AboutPage: React.FC = () => {
  return (
    <CardContent className="p-4 sm:p-6 flex-grow overflow-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">About Concept Hierarchy Designer</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Purpose</h2>
          <p className="text-gray-700 mb-4">
            Concept Hierarchy Designer is a powerful tool for creating, organizing, and visualizing hierarchical knowledge structures.
            It was developed to help researchers, educators, and knowledge workers build conceptual frameworks and knowledge maps
            in a simple and intuitive way.
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
            <li>AI-powered suggestions with Magic Wand feature</li>
            <li>Import and export in standard JSON format</li>
            <li>Responsive design works on desktop and tablet</li>
            <li>Optimized for performance with virtualized rendering for large hierarchies</li>
          </ul>
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
            <li>Framer Motion for smooth animations</li>
            <li>React DnD for drag and drop functionality</li>
            <li>React Router for navigation</li>
            <li>Tailwind CSS for styling</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Accessibility</h2>
          <p className="text-gray-700 mb-4">
            The application is designed with accessibility in mind:
          </p>
          <ul className="list-disc pl-4 sm:pl-5 space-y-2">
            <li>Full keyboard navigation support for all tree operations</li>
            <li>Clear visual focus indicators for selected nodes</li>
            <li>ARIA labels and semantic HTML for screen readers</li>
            <li>Responsive design that works across different screen sizes</li>
            <li>High contrast visual feedback for interactive elements</li>
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
