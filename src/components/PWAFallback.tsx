import React, { useState } from 'react';
import { usePWASupport } from '../hooks/usePWASupport';
import { Button } from './ui/Button';

export const PWAFallback: React.FC = () => {
  const { isFullySupported, unsupportedFeatures } = usePWASupport();
  const [dismissed, setDismissed] = useState(false);

  if (isFullySupported || dismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 m-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        
        <div className="flex-1">
          <h3 className="text-yellow-800 font-medium">Limited PWA Support</h3>
          <p className="text-yellow-700 text-sm mt-1">
            Your browser doesn't support some PWA features. The app will work but with reduced functionality:
          </p>
          
          <ul className="text-yellow-700 text-sm mt-2 list-disc list-inside space-y-1">
            {unsupportedFeatures.includes('Service Workers') && (
              <li>No offline caching - requires internet connection</li>
            )}
            {unsupportedFeatures.includes('IndexedDB') && (
              <li>Data stored in localStorage (limited capacity)</li>
            )}
            {unsupportedFeatures.includes('Install Prompt') && (
              <li>No install prompt - manual installation required</li>
            )}
            {unsupportedFeatures.includes('Network Information') && (
              <li>Basic online/offline detection only</li>
            )}
          </ul>

          <div className="mt-3 text-yellow-700 text-sm">
            <p><strong>Recommendation:</strong> Use a modern browser like Chrome, Firefox, or Safari for the best experience.</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDismissed(true)}
          className="text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
    </div>
  );
};