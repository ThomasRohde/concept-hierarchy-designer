// filepath: c:\Users\thoma\Projects\concept-hierarchy-designer\App.tsx
import React from 'react';
import AppRouter from './router/AppRouter';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import InstallPrompt from './components/InstallPrompt';
import NetworkStatus from './components/NetworkStatus';

const App: React.FC = () => {
  return (
    <>
      <AppRouter />
      <PWAUpdatePrompt />
      <InstallPrompt />
      <NetworkStatus />
    </>
  );
};

export default App;
