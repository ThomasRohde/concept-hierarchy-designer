import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const AboutPage: React.FC = () => {
  return (
    <CardContent className="p-6 flex-grow overflow-auto">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Concept Hierarchy Designer</h1>
        
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
          <ul className="list-disc pl-5 space-y-2">
            <li>Drag and drop interface for intuitive organization</li>
            <li>Unlimited depth for complex hierarchies</li>
            <li>Smart clipboard with copy/paste functionality</li>
            <li>AI-powered suggestions with Magic Wand feature</li>
            <li>Import and export in standard JSON format</li>
            <li>Responsive design works on desktop and tablet</li>
            <li>Optimized for performance with virtualized rendering for large hierarchies</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Technology</h2>
          <p className="text-gray-700 mb-4">
            Built with modern web technologies including:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>React for component-based UI</li>
            <li>TypeScript for type safety</li>
            <li>Framer Motion for smooth animations</li>
            <li>React DnD for drag and drop functionality</li>
            <li>React Router for navigation</li>
            <li>Tailwind CSS for styling</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Contact</h2>
          <p className="text-gray-700">
            For questions, bug reports, or feature suggestions, please contact the developer at:<br />
            <a href="mailto:info@example.com" className="text-blue-600 hover:underline">
              info@example.com
            </a>
          </p>
        </section>
      </div>
    </CardContent>
  );
};

export default AboutPage;
