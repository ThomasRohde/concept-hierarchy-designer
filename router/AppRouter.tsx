import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AboutPage from '../components/Pages/AboutPage';
import HomePage from '../components/Pages/HomePage';
import { TreeProvider } from '../context/TreeContext';

// Error boundary component for handling route errors
const ErrorBoundary = () => {
  return (
    <div className="min-h-screen py-8 px-4 flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
        <p className="text-gray-700 mb-6">The page you're looking for doesn't exist or has been moved.</p>        <button
          onClick={() => window.location.href = '/concept-hierarchy-designer/'}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
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
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: '*',
        element: <Navigate to="/" replace />
      }
    ]
  }
], {
  // This ensures all routes start with the base path defined in vite.config.ts
  basename: '/concept-hierarchy-designer'
});

const AppRouter: React.FC = () => {
  return (
    <TreeProvider>
      <RouterProvider router={router} />
    </TreeProvider>
  );
};

export default AppRouter;
