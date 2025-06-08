import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInWebApp = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInWebApp);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setShowInstallModal(false);
    } catch (error) {
      console.error('Error during app installation:', error);
    }
  };

  // Don't show if already installed or prompt not available
  if (isInstalled || !deferredPrompt) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInstallModal(true)}
        className="hidden sm:flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Install App
      </Button>

      <Modal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        title="Install Concept Hierarchy Designer"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img 
              src="/favicon-64x64.png" 
              alt="App icon" 
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="font-semibold">Concept Hierarchy Designer</h3>
              <p className="text-sm text-gray-600">Install for offline access</p>
            </div>
          </div>
          
          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Benefits of installing:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Works offline - access your concept maps anywhere</li>
              <li>Faster loading with cached resources</li>
              <li>Native app experience on your device</li>
              <li>Automatic background sync when online</li>
              <li>Quick access from your home screen</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleInstallClick}
              className="flex-1"
            >
              Install Now
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowInstallModal(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};