import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faInfoCircle, 
  faHdd, 
  faWifi, 
  faMobile,
  faDownload,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import { PWAUtils } from '../utils/pwaUtils';

interface StorageInfo {
  quota: number;
  usage: number;
  available: number;
  percentage: number;
}

interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  browser: string;
}

const PWAStatus: React.FC = () => {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isPWA, setIsPWA] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [supportsNotifications, setSupportsNotifications] = useState(false);

  useEffect(() => {
    const loadPWAStatus = async () => {
      // Get storage info
      const storage = await PWAUtils.getStorageInfo();
      setStorageInfo(storage);
      
      // Get device info
      const device = PWAUtils.getDeviceInfo();
      setDeviceInfo(device);
      
      // Check PWA status
      setIsPWA(PWAUtils.isPWA());
      setCanInstall(PWAUtils.canInstall());
      setSupportsNotifications(PWAUtils.supportsNotifications());
    };

    loadPWAStatus();

    // Listen for install prompt events
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsPWA(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleInstall = async () => {
    await PWAUtils.promptInstall();
  };

  const handleNotificationPermission = async () => {
    await PWAUtils.requestNotificationPermission();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon icon={faInfoCircle} className="h-5 w-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          PWA Status
        </h3>
      </div>

      <div className="space-y-4">
        {/* Installation Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faMobile} className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Installation Status
            </span>
          </div>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              isPWA 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {isPWA ? 'Installed' : 'Web App'}
            </span>
            {canInstall && !isPWA && (
              <button
                onClick={handleInstall}
                className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                Install
              </button>
            )}
          </div>
        </div>

        {/* Device Info */}
        {deviceInfo && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMobile} className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Device
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {deviceInfo.browser} • {deviceInfo.isMobile ? 'Mobile' : 'Desktop'}
              {deviceInfo.isIOS && ' • iOS'}
              {deviceInfo.isAndroid && ' • Android'}
            </span>
          </div>
        )}

        {/* Service Worker Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faWifi} className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Offline Support
            </span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            PWAUtils.supportsServiceWorker()
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {PWAUtils.supportsServiceWorker() ? 'Available' : 'Not Available'}
          </span>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBell} className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Notifications
            </span>
          </div>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full ${
              supportsNotifications
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {supportsNotifications ? 'Supported' : 'Not Supported'}
            </span>
            {supportsNotifications && Notification.permission === 'default' && (
              <button
                onClick={handleNotificationPermission}
                className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Storage Info */}
        {storageInfo && (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faHdd} className="h-4 w-4 text-gray-500 mr-2" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Storage Usage
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatBytes(storageInfo.usage)} / {formatBytes(storageInfo.quota)}
              </div>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                <div
                  className={`h-2 rounded-full ${
                    storageInfo.percentage > 80
                      ? 'bg-red-500'
                      : storageInfo.percentage > 60
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAStatus;
