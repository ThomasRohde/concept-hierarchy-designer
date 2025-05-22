import React from 'react';
import { CardContent } from '../ui/Card';
import MainContent from './MainContent';

const HomePage: React.FC = () => {
  return (
    <CardContent className="p-2 overflow-hidden flex-grow flex flex-col">
      <MainContent />
    </CardContent>
  );
};

export default HomePage;
