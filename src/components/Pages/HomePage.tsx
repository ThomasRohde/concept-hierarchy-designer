import React from 'react';
import { CardContent } from '../ui/Card';
import MainContent from './MainContent';
import AutoSaveIndicator from '../AutoSaveIndicator';
import { useOfflineSync } from '../../hooks/useOfflineSync';

const HomePage: React.FC = () => {
  // Initialize offline sync functionality
  useOfflineSync();

  return (
    <CardContent className="p-2 overflow-hidden flex-grow flex flex-col">
      <MainContent />
      <div className="flex items-center justify-end py-1 px-2 text-gray-500">
        <AutoSaveIndicator />
      </div>
    </CardContent>
  );
};

export default HomePage;
