import React from 'react';
import { useSyncContext } from '../context/SyncContext';

export const OfflineIndicator: React.FC = () => {
  const { syncState } = useSyncContext();
  
  // Only show offline indicator until cloud sync is implemented (task 3.0)
  if (syncState.isOnline) {
    return null;
  }

  return (
    <div 
      className="flex items-center justify-center w-8 h-8 text-amber-600 bg-amber-50 rounded-full border border-amber-200"
      title="Offline"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5v1m0 18v1M4.22 4.22l.707.707m14.142 14.142l.707.707M2.5 12h1m18 0h1M4.22 19.78l.707-.707M19.78 4.22l-.707.707" />
      </svg>
    </div>
  );
};