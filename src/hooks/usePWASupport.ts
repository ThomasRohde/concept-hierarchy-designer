import { useState, useEffect } from 'react';

interface PWASupport {
  hasServiceWorkerSupport: boolean;
  hasIndexedDBSupport: boolean;
  hasBeforeInstallPromptSupport: boolean;
  hasNetworkInformationSupport: boolean;
  isFullySupported: boolean;
  unsupportedFeatures: string[];
}

export const usePWASupport = (): PWASupport => {
  const [support, setSupport] = useState<PWASupport>({
    hasServiceWorkerSupport: false,
    hasIndexedDBSupport: false,
    hasBeforeInstallPromptSupport: false,
    hasNetworkInformationSupport: false,
    isFullySupported: false,
    unsupportedFeatures: [],
  });

  useEffect(() => {
    const checkSupport = () => {
      const hasServiceWorkerSupport = 'serviceWorker' in navigator;
      const hasIndexedDBSupport = 'indexedDB' in window;
      const hasBeforeInstallPromptSupport = 'BeforeInstallPromptEvent' in window;
      const hasNetworkInformationSupport = 'connection' in navigator;

      const unsupportedFeatures = [];
      if (!hasServiceWorkerSupport) unsupportedFeatures.push('Service Workers');
      if (!hasIndexedDBSupport) unsupportedFeatures.push('IndexedDB');
      if (!hasBeforeInstallPromptSupport) unsupportedFeatures.push('Install Prompt');
      if (!hasNetworkInformationSupport) unsupportedFeatures.push('Network Information');

      const isFullySupported = hasServiceWorkerSupport && hasIndexedDBSupport;

      setSupport({
        hasServiceWorkerSupport,
        hasIndexedDBSupport,
        hasBeforeInstallPromptSupport,
        hasNetworkInformationSupport,
        isFullySupported,
        unsupportedFeatures,
      });
    };

    checkSupport();
  }, []);

  return support;
};