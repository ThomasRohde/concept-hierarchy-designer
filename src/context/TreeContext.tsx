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
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  
  // Track auto-save debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Custom setter function that saves to storage automatically with debouncing
  const handleSetNodes = useCallback((newNodes: React.SetStateAction<NodeData[]>) => {
    setNodes(prev => {
      const nextNodes = typeof newNodes === 'function' ? newNodes(prev) : newNodes;
      
      // Clear any pending timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Only save if there's a meaningful change
      if (JSON.stringify(prev) !== JSON.stringify(nextNodes)) {
        // Debounce save operation by 1 second
        saveTimeoutRef.current = setTimeout(async () => {
          console.log('Saving model to storage:', { nodeCount: nextNodes.length });
          try {
            const saveResult = await saveTreeToLocalStorage(nextNodes);
            console.log('Save result:', saveResult);
          } catch (error) {
            console.error('Error saving tree data:', error);
          }
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
        // Try direct access to localStorage first for debugging
        console.log('localStorage direct check:');
        try {
          const rawData = localStorage.getItem('concept-hierarchy-data');
          console.log('- Raw data exists:', Boolean(rawData));
          console.log('- Raw data length:', rawData?.length);
          console.log('- First 50 chars:', rawData?.substring(0, 50));
        } catch (e) {
          console.error('Error accessing localStorage directly:', e);
        }
        
        // Try loading from storage using our utility
        console.log('Attempting to load data from localStorage...');
        const storedNodes = await loadTreeFromLocalStorage();
        const storedCollapsed = await loadCollapsedNodesFromLocalStorage();
        
        console.log('Loading results:', { 
          storedNodesFound: Boolean(storedNodes), 
          storedNodesLength: storedNodes?.length,
          storedCollapsedSize: storedCollapsed?.size
        });
        
        // Simulate small loading delay (remove in production if not needed)
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (storedNodes && storedNodes.length > 0) {
          // Use stored data if available
          console.log('Using stored data from storage');
          setNodes(storedNodes);
          setCollapsed(storedCollapsed);
        } else {
          // Otherwise use initial data
          console.log('No valid stored data found, using initial data');
          const initialData = createInitialData();
          setNodes(initialData);
          // Also save this initial data to storage immediately
          console.log('Saving initial data to storage');
          await saveTreeToLocalStorage(initialData);
        }
      } catch (error) {
        console.error("Error initializing data:", error);
        // Fallback to initial data
        const initialData = createInitialData();
        setNodes(initialData);
        // Try to save this initial data to storage
        try {
          await saveTreeToLocalStorage(initialData);
        } catch (e) {
          console.error("Failed to save initial data:", e);
        }
      } finally {
        setIsInitializing(false);
      }
    };
    
    // Initialize when component mounts
    initializeApp();
  }, []);
  // Ensure we save data before unmounting and when window is closed
  useEffect(() => {
    // Save on component unmount
    return () => {
      // If there's a pending save, clear it and save immediately
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        console.log('Saving on unmount:', { nodeCount: nodes.length });
        saveTreeToLocalStorage(nodes);
        saveCollapsedNodesToLocalStorage(collapsed);
      }
    };
  }, [nodes, collapsed]);
  
  // Add beforeunload handler to ensure saving when window/tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        console.log('Saving on window close:', { nodeCount: nodes.length });
        saveTreeToLocalStorage(nodes);
        saveCollapsedNodesToLocalStorage(collapsed);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [nodes, collapsed]);

  return (
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
