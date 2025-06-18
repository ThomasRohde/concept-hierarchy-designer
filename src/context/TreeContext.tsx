import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { NodeData, PromptCollection } from '../types';
import { createInitialData } from '../utils/treeUtils';
import {
  saveTreeToLocalStorage,
  loadTreeFromLocalStorage,
  saveCollapsedNodesToLocalStorage,
  loadCollapsedNodesFromLocalStorage
} from '../utils/storageUtils';
import { loadPromptCollection, savePromptCollection } from '../utils/promptUtils';

interface TreeContextType {
  nodes: NodeData[];
  setNodes: React.Dispatch<React.SetStateAction<NodeData[]>>;
  collapsed: Set<string>;
  setCollapsed: React.Dispatch<React.SetStateAction<Set<string>>>;
  prompts: PromptCollection;
  setPrompts: React.Dispatch<React.SetStateAction<PromptCollection>>;
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
  const [prompts, setPrompts] = useState<PromptCollection>(() => loadPromptCollection());
  
  // Track auto-save debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const collapsedSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const promptsSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
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
        // Debounce save operation by 2 seconds for better performance
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            await saveTreeToLocalStorage(nextNodes);
          } catch (error) {
            console.error('Error saving tree data:', error);
          }
        }, 2000);
      }
      
      return nextNodes;
    });
  }, []);

  // Custom setter function for collapsed nodes that saves to local storage automatically with debouncing
  const handleSetCollapsed = useCallback((newCollapsed: React.SetStateAction<Set<string>>) => {
    setCollapsed(prev => {
      const nextCollapsed = typeof newCollapsed === 'function' ? newCollapsed(prev) : newCollapsed;
      
      // Clear any pending timeout
      if (collapsedSaveTimeoutRef.current) {
        clearTimeout(collapsedSaveTimeoutRef.current);
      }
      
      // Debounce collapsed nodes save by 500ms
      collapsedSaveTimeoutRef.current = setTimeout(() => {
        saveCollapsedNodesToLocalStorage(nextCollapsed);
      }, 500);
      
      return nextCollapsed;
    });
  }, []);

  // Custom setter function for prompts that saves to storage automatically with debouncing
  const handleSetPrompts = useCallback((newPrompts: React.SetStateAction<PromptCollection>) => {
    setPrompts(prev => {
      const nextPrompts = typeof newPrompts === 'function' ? newPrompts(prev) : newPrompts;
      
      // Clear any pending timeout
      if (promptsSaveTimeoutRef.current) {
        clearTimeout(promptsSaveTimeoutRef.current);
      }
      
      // Only save if there's a meaningful change
      if (JSON.stringify(prev) !== JSON.stringify(nextPrompts)) {
        // Debounce prompts save by 3 seconds to reduce rapid sync operations
        promptsSaveTimeoutRef.current = setTimeout(async () => {
          try {
            savePromptCollection(nextPrompts);
            // Emit custom event to notify other components
            window.dispatchEvent(new CustomEvent('promptCollectionChanged'));
            
            // Only trigger sync if there are significant changes (e.g., new prompts added/removed)
            const hasStructuralChanges = prev.prompts.length !== nextPrompts.prompts.length ||
              prev.activePromptId !== nextPrompts.activePromptId;
            
            if (hasStructuralChanges) {
              console.log('🔄 TreeContext: Structural prompt changes detected, triggering sync');
              try {
                const { syncCurrentTreeToGitHub } = await import('../utils/syncIntegration');
                // Get the latest nodes from the ref to ensure we have current data
                setNodes(currentNodes => {
                  syncCurrentTreeToGitHub(currentNodes).then(() => {
                    console.log('🔄 TreeContext: Prompt changes synced to GitHub');
                  }).catch((syncError) => {
                    console.warn('⚠️ TreeContext: Failed to sync prompt changes:', syncError);
                  });
                  return currentNodes; // Return unchanged to avoid unnecessary re-render
                });
              } catch (syncError) {
                console.warn('⚠️ TreeContext: Failed to sync prompt changes:', syncError);
              }
            } else {
              console.log('🔄 TreeContext: Minor prompt changes, skipping automatic sync');
            }
          } catch (error) {
            console.error('Error saving prompt collection:', error);
          }
        }, 3000); // Increased from 1s to 3s
      }
      
      return nextPrompts;
    });
  }, []); // Remove nodes dependency since we now get current nodes from setNodes callback
  
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
        saveTreeToLocalStorage(nodes);
      }
      if (collapsedSaveTimeoutRef.current) {
        clearTimeout(collapsedSaveTimeoutRef.current);
        saveCollapsedNodesToLocalStorage(collapsed);
      }
      if (promptsSaveTimeoutRef.current) {
        clearTimeout(promptsSaveTimeoutRef.current);
        savePromptCollection(prompts);
      }
    };
  }, [nodes, collapsed, prompts]);
  
  // Add beforeunload handler to ensure saving when window/tab is closed
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTreeToLocalStorage(nodes);
      }
      if (collapsedSaveTimeoutRef.current) {
        clearTimeout(collapsedSaveTimeoutRef.current);
        saveCollapsedNodesToLocalStorage(collapsed);
      }
      if (promptsSaveTimeoutRef.current) {
        clearTimeout(promptsSaveTimeoutRef.current);
        savePromptCollection(prompts);
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [nodes, collapsed, prompts]);

  return (
    <TreeContext.Provider value={{
        nodes,
        setNodes: handleSetNodes,
        collapsed,
        setCollapsed: handleSetCollapsed,
        prompts,
        setPrompts: handleSetPrompts,
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
