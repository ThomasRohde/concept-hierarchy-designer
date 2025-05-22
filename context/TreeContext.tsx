import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NodeData } from '../types';
import { createInitialData } from '../utils/treeUtils';

interface TreeContextType {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  collapsed: Set<string>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;  isInitializing: boolean;
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  // Initialize app with data
  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);
      // Simulate loading delay (remove in production if not needed)
      await new Promise(resolve => setTimeout(resolve, 500));
      setNodes(createInitialData());
      setIsInitializing(false);
    };
    
    // Only initialize if the nodes array is empty (first load)
    if (nodes.length === 0) {
      initializeApp();
    }
  }, [nodes.length]);
  return (
    <TreeContext.Provider      value={{
        nodes,
        setNodes,
        collapsed,
        setCollapsed,
        isLoading,
        setIsLoading,
        isInitializing,
        setIsInitializing
      }}
    >
      {children}
    </TreeContext.Provider>
  );
};

export const useTreeContext = (): TreeContextType => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error('useTreeContext must be used within a TreeProvider');
  }
  return context;
};
