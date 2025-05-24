import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

/**
 * A component that shows the auto-save status
 */
const AutoSaveIndicator: React.FC = () => {
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    // Get initial last saved time
    const timestamp = localStorage.getItem('concept-hierarchy-last-saved');
    if (timestamp) {
      setLastSaved(timestamp);
    }

    // Set up event listener to detect changes in localStorage from other components
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'concept-hierarchy-last-saved' && e.newValue) {
        setLastSaved(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates every 30 seconds
    const interval = setInterval(() => {
      const timestamp = localStorage.getItem('concept-hierarchy-last-saved');
      if (timestamp && timestamp !== lastSaved) {
        setLastSaved(timestamp);
      }
    }, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [lastSaved]);

  // Format last saved time for display
  const getFormattedLastSaved = () => {
    if (!lastSaved) return 'Auto-save ready';
    
    try {
      const savedDate = new Date(lastSaved);
      
      // If saved today, show time only
      const now = new Date();
      if (savedDate.toDateString() === now.toDateString()) {
        return `Auto-saved at ${savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      } 
      
      // Otherwise show date and time
      return `Auto-saved ${savedDate.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;
    } catch (e) {
      return 'Auto-save enabled';
    }
  };
  return (
    <div className="flex items-center text-xs text-gray-500 ml-2" title="Your work is automatically saved to browser storage">
      <Save className="w-3 h-3 mr-1" />
      <span className="hidden sm:inline">{getFormattedLastSaved()}</span>
      <span className="sm:hidden">Auto-saved</span>
    </div>
  );
};

export default AutoSaveIndicator;
