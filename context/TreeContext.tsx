import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { NodeData } from '../types';
import { createInitialData } from '../utils/treeUtils';
import {
  saveTreeToLocalStorage,
  loadTreeFromLocalStorage,
  saveCollapsedNodesToLocalStorage,
  loadCollapsedNodesFromLocalStorage
} from '../utils/storageUtils';

interface TreeContextType {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  collapsed: Set<string>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;  
  isInitializing: boolean;
  setIsInitializing: React.Dispatch<React.SetStateAction<boolean>>;
}

const TreeContext = createContext<TreeContextType | undefined>(undefined);

export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());  // Track auto-save debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Custom setter function that saves to local storage automatically with debouncing
  const handleSetNodes = useCallback((newNodes: React.SetStateAction<NodeData[]>) => {
    setNodes(prev => {
      const nextNodes = typeof newNodes === 'function' ? newNodes(prev) : newNodes;
      
      // Clear any pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Only save if there's a meaningful change
      if (prev.length > 0 && JSON.stringify(prev) !== JSON.stringify(nextNodes)) {
        // Debounce save operation by 1 second
        saveTimeoutRef.current = setTimeout(() => {
          saveTreeToLocalStorage(nextNodes);
          console.log('Concept model auto-saved'); // Keep for debugging if needed
        }, 1000);
      }
      
      return nextNodes;
    });
  }, []);

  // Custom setter function for collapsed nodes that saves to local storage automatically
  const handleSetCollapsed = useCallback((newCollapsed: React.SetStateAction<Set<string>>) => {
    setCollapsed(prev => {
      const nextCollapsed = typeof newCollapsed === 'function' ? newCollapsed(prev) : newCollapsed;
      saveCollapsedNodesToLocalStorage(nextCollapsed);
      return nextCollapsed;
    });
  }, []);
  // Initialize app with data
  useEffect(() => {
    const initializeApp = async () => {
      setIsInitializing(true);
      
      try {
        // Try loading from local storage first
        const storedNodes = loadTreeFromLocalStorage();
        const storedCollapsed = loadCollapsedNodesFromLocalStorage();
        
        // Simulate small loading delay (remove in production if not needed)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (storedNodes && storedNodes.length > 0) {
          // Use stored data if available
          setNodes(storedNodes);
          setCollapsed(storedCollapsed);
        } else {
          // Otherwise use initial data
          setNodes(createInitialData());
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        // Fallback to initial data
        setNodes(createInitialData());
      } finally {
        setIsInitializing(false);
      }
    };
    
    // Initialize when component mounts
    initializeApp();
  }, []);

  // Ensure we save data before unmounting
  useEffect(() => {
    return () => {
      // If there's a pending save, clear it and save immediately
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTreeToLocalStorage(nodes);
        saveCollapsedNodesToLocalStorage(collapsed);
      }
    };
  }, [nodes, collapsed]);return (
    <TreeContext.Provider value={{
        nodes,
        setNodes: handleSetNodes,
        collapsed,
        setCollapsed: handleSetCollapsed,
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
