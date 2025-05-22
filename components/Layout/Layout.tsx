import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Card, CardHeader } from '../ui/Card';
import BurgerMenu from './BurgerMenu';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import CustomDragLayer from '../CustomDragLayer';

const Layout: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen py-8 px-4 flex flex-col items-center bg-gray-100 text-gray-900 h-screen">
        <CustomDragLayer />
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Card className="w-full max-w-5xl shadow-2xl flex flex-col flex-grow">
          <CardHeader>
            <div className="flex items-center">
              <BurgerMenu className="mr-2" />
              <div className="text-2xl font-bold text-center flex-grow">Concept Hierarchy Designer</div>
              <div className="w-8">
                {/* Empty div to balance the burger menu */}
              </div>
            </div>
          </CardHeader>
          
          {/* Main content area, using Outlet for routing */}
          <Outlet />
        </Card>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Drag & drop to re-organize. Hover over nodes for actions.</p>
          <p>Powered by React, Tailwind CSS, Framer Motion. Clipboard actions use system clipboard.</p>
          <p>&copy; 2025 Thomas Klok Rohde. All rights reserved.</p>
        </footer>
      </div>
    </DndProvider>
  );
};

export default Layout;
