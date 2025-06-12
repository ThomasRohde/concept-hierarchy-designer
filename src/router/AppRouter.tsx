import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AboutPage from '../components/Pages/AboutPage';
import HomePage from '../components/Pages/HomePage';
import AdminPage from '../components/Pages/AdminPage';
import { PromptsPage } from '../components/Pages/PromptsPage';
import { useTreeContext } from '../context/TreeContext';
import { TreeProvider } from '../context/TreeContext';
import { SyncProvider } from '../context/SyncContext';
import { Button } from '../components/ui/Button';

// Wrapper component for PromptsPage to provide required props
const PromptsPageWrapper: React.FC = () => {
  const { prompts: promptCollection, setPrompts: setPromptCollection } = useTreeContext();
  
  const handlePromptSave = (prompt: any) => {
    setPromptCollection(prev => {
      const updatedPrompts = prev.prompts.map(p => 
        p.id === prompt.id ? prompt : p
      );
      if (!prev.prompts.find(p => p.id === prompt.id)) {
        updatedPrompts.push(prompt);
      }
      return { 
        ...prev, 
        prompts: updatedPrompts
      };
    });
  };

  const handlePromptDelete = (promptId: string) => {
    setPromptCollection(prev => {
      const updatedPrompts = prev.prompts.filter(p => p.id !== promptId);
      let newActivePromptId = prev.activePromptId;
      
      // If we're deleting the active prompt, select a different one
      if (prev.activePromptId === promptId) {
        newActivePromptId = updatedPrompts.length > 0 ? updatedPrompts[0].id : null;
      }
      
      return { 
        ...prev, 
        prompts: updatedPrompts,
        activePromptId: newActivePromptId
      };
    });
  };

  const handlePromptSelect = (promptId: string) => {
    setPromptCollection(prev => ({
      ...prev,
      activePromptId: promptId
    }));
  };

  const currentActivePromptId = promptCollection.activePromptId;

  return (
    <PromptsPage
      prompts={promptCollection.prompts}
      onPromptSave={handlePromptSave}
      onPromptDelete={handlePromptDelete}
      onPromptSelect={handlePromptSelect}
      activePromptId={currentActivePromptId}
    />
  );
};

// Error boundary component for handling route errors
const ErrorBoundary = () => {
  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
        <p className="text-gray-700 mb-6">The page you're looking for doesn't exist or has been moved.</p>        <Button
          onClick={() => window.location.href = window.location.hostname === 'localhost' ? '/' : '/concept-hierarchy-designer/'}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

// Using basename to match the base path in vite.config.ts
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'prompts',
        element: <PromptsPageWrapper />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'admin',
        element: <AdminPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
], {
  // This ensures all routes start with the base path defined in vite.config.ts
  // Use conditional basename based on the environment
  basename: import.meta.env.DEV ? '/' : '/concept-hierarchy-designer'
});

const AppRouter: React.FC = () => {
  return (
    <TreeProvider>
      <SyncProvider>
        <RouterProvider router={router} />
      </SyncProvider>
    </TreeProvider>
  );
};

export default AppRouter;
