import React, { createContext, useContext, ReactNode } from 'react';
import { NodeData } from '../types';

interface CapabilityCardContextType {
  onOpenCapabilityCard?: (node: NodeData) => void;
}

const CapabilityCardContext = createContext<CapabilityCardContextType | undefined>(undefined);

export const CapabilityCardProvider: React.FC<{ 
  children: ReactNode;
  onOpenCapabilityCard?: (node: NodeData) => void;
}> = ({ children, onOpenCapabilityCard }) => {
  return (
    <CapabilityCardContext.Provider value={{ onOpenCapabilityCard }}>
      {children}
    </CapabilityCardContext.Provider>
  );
};

export const useCapabilityCardContext = () => {
  const context = useContext(CapabilityCardContext);
  if (context === undefined) {
    throw new Error('useCapabilityCardContext must be used within a CapabilityCardProvider');
  }
  return context;
};

// Hook for optional capability card context (won't throw if not in provider)
export const useOptionalCapabilityCardContext = () => {
  return useContext(CapabilityCardContext);
};
