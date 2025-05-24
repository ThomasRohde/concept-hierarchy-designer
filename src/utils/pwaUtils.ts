/**
 * PWA utility functions for managing app installation and updates
 */

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export class PWAUtils {
  private static deferredPrompt: BeforeInstallPromptEvent | null = null;

  /**
   * Check if the app is currently running as a PWA
   */
  static isPWA(): boolean {
    // Check if running in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check for iOS standalone mode
    const isInWebAppiOS = (window.navigator as any).standalone === true;
    
    // Check for Android TWA
    const isAndroidTWA = document.referrer.includes('android-app://');
    
    return isStandalone || isInWebAppiOS || isAndroidTWA;
  }

  /**
   * Check if the device supports PWA installation
   */
  static canInstall(): boolean {
    return this.deferredPrompt !== null;
  }

  /**
   * Set the deferred install prompt
   */
  static setDeferredPrompt(prompt: BeforeInstallPromptEvent | null): void {
    this.deferredPrompt = prompt;
  }

  /**
   * Get the deferred install prompt
   */
  static getDeferredPrompt(): BeforeInstallPromptEvent | null {
    return this.deferredPrompt;
  }

  /**
   * Trigger the install prompt
   */
  static async promptInstall(): Promise<'accepted' | 'dismissed' | 'not-available'> {
    if (!this.deferredPrompt) {
      return 'not-available';
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      return outcome;
    } catch (error) {
      console.error('Error prompting install:', error);
      return 'dismissed';
    }
  }

  /**
   * Get device and browser information
   */
  static getDeviceInfo(): {
    isIOS: boolean;
    isAndroid: boolean;
    isMobile: boolean;
    browser: string;
  } {
    const userAgent = navigator.userAgent.toLowerCase();
    
    return {
      isIOS: /iphone|ipad|ipod/.test(userAgent),
      isAndroid: /android/.test(userAgent),
      isMobile: /mobile|android|iphone|ipad|ipod/.test(userAgent),
      browser: this.getBrowserName(userAgent)
    };
  }

  private static getBrowserName(userAgent: string): string {
    if (userAgent.includes('chrome')) return 'chrome';
    if (userAgent.includes('firefox')) return 'firefox';
    if (userAgent.includes('safari')) return 'safari';
    if (userAgent.includes('edge')) return 'edge';
    return 'unknown';
  }

  /**
   * Check if the browser supports service workers
   */
  static supportsServiceWorker(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Check if the browser supports notifications
   */
  static supportsNotifications(): boolean {
    return 'Notification' in window;
  }

  /**
   * Request notification permission
   */
  static async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!this.supportsNotifications()) {
      return 'denied';
    }

    return await Notification.requestPermission();
  }

  /**
   * Show a notification
   */
  static async showNotification(
    title: string, 
    options?: NotificationOptions
  ): Promise<boolean> {
    if (!this.supportsNotifications()) {
      return false;
    }

    const permission = await this.requestNotificationPermission();
    if (permission !== 'granted') {
      return false;
    }

    try {
      new Notification(title, {
        icon: '/android-chrome-192x192.png',
        badge: '/favicon-64x64.png',
        ...options
      });
      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  static async getStorageInfo(): Promise<{
    quota: number;
    usage: number;
    available: number;
    percentage: number;
  } | null> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const quota = estimate.quota || 0;
        const usage = estimate.usage || 0;
        const available = quota - usage;
        const percentage = quota > 0 ? (usage / quota) * 100 : 0;

        return {
          quota,
          usage,
          available,
          percentage
        };
      } catch (error) {
        console.error('Error getting storage info:', error);
      }
    }
    
    return null;
  }

  /**
   * Share content using Web Share API if available
   */
  static async share(data: {
    title?: string;
    text?: string;
    url?: string;
  }): Promise<boolean> {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
    return false;
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    if ('clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
    
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (error) {
      console.error('Fallback copy failed:', error);
      return false;
    }
  }
}
