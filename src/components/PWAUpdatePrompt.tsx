import React, { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import toast from 'react-hot-toast';

const PWAUpdatePrompt: React.FC = () => {
  const [offlineReady, setOfflineReady] = useState(false);
  const [needRefresh, setNeedRefresh] = useState(false);

  const {
    offlineReady: [offline, setOffline],
    needRefresh: [refresh, setRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
    onOfflineReady() {
      setOfflineReady(true);
      toast.success('App is ready to work offline!', {
        duration: 5000,
        icon: '📱',
      });
    },
    onNeedRefresh() {
      setNeedRefresh(true);
      toast((t) => (
        <div className="flex flex-col gap-2">
          <div className="font-medium">New content available!</div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              onClick={() => {
                updateServiceWorker(true);
                toast.dismiss(t.id);
              }}
            >
              Update
            </button>
            <button
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
              onClick={() => toast.dismiss(t.id)}
            >
              Later
            </button>
          </div>
        </div>
      ), {
        duration: 10000,
        icon: '🔄',
      });
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return null; // We're using toast notifications instead of a visible component
};

export default PWAUpdatePrompt;
