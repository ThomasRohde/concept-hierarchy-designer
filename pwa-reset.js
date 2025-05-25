/**
 * PWA Reset Helper
 * Helps uninstall/reinstall PWAs when issues are detected
 */

(function() {
  // Don't auto-run, this script is called manually when needed
  window.resetPWA = function() {
    console.log('🔄 PWA Reset Helper: Starting reset process');
    
    // 1. Clear all service worker registrations
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(registrations => {
        console.log('🧹 Clearing service worker registrations:', registrations.length);
        
        const clearPromises = registrations.map(registration => {
          console.log('   - Unregistering:', registration.scope);
          return registration.unregister();
        });
        
        Promise.all(clearPromises).then(() => {
          console.log('✅ All service workers unregistered');
        });
      });
    }
    
    // 2. Clear caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        console.log('🧹 Clearing caches:', cacheNames.length);
        
        const clearPromises = cacheNames.map(cacheName => {
          console.log('   - Deleting cache:', cacheName);
          return caches.delete(cacheName);
        });
        
        Promise.all(clearPromises).then(() => {
          console.log('✅ All caches cleared');
        });
      });
    }
    
    // 3. Clear localStorage for PWA items
    console.log('🧹 Clearing localStorage PWA entries');
    localStorage.removeItem('was-installed-as-pwa');
    localStorage.removeItem('pwa-installed');
    localStorage.removeItem('pwa-updated');
    
    // 4. Show uninstall instructions
    const repoName = 'concept-hierarchy-designer';
    
    // Create modal with instructions
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      font-family: system-ui, sans-serif;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 0.5rem;
      max-width: 600px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
    `;
    
    content.innerHTML = `
      <h2 style="margin-top:0;color:#4F46E5;font-size:1.5rem;">PWA Reset Required</h2>
      <p>Your PWA installation needs to be reset due to scoping issues. Please:</p>
      <ol>
        <li>Uninstall this PWA from your device</li>
        <li>Clear your browser cache</li>
        <li>Reload the page</li>
        <li>Install the PWA again</li>
      </ol>
      <p><strong>Uninstall instructions:</strong></p>
      <ul>
        <li><strong>Chrome/Edge (Windows/Mac):</strong> Settings → Apps → ${repoName} → Uninstall</li>
        <li><strong>Android:</strong> Long press app icon → Uninstall</li>
        <li><strong>iOS:</strong> Long press app icon → Remove App</li>
      </ul>
      <div style="text-align:center;margin-top:1.5rem;">
        <button id="pwa-reset-close" style="background:#4F46E5;color:white;border:none;padding:0.75rem 1.5rem;border-radius:0.375rem;font-weight:600;cursor:pointer;">
          I understand, I'll reset my PWA
        </button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    document.getElementById('pwa-reset-close').addEventListener('click', function() {
      modal.remove();
    });
    
    console.log('✅ PWA Reset helper completed');
  };
  
  // Register as global variable for easy access from console
  window.checkAndResetPWA = function() {
    const repoName = 'concept-hierarchy-designer';
    const isPWA = window.matchMedia && 
                 (window.matchMedia('(display-mode: standalone)').matches || 
                  window.matchMedia('(display-mode: fullscreen)').matches || 
                  window.matchMedia('(display-mode: minimal-ui)').matches) || 
                 window.navigator.standalone === true;
                 
    if (isPWA) {
      const currentPath = window.location.pathname;
      const expectedPath = `/${repoName}/`;
      
      if (!currentPath.startsWith(expectedPath)) {
        console.warn('⚠️ PWA running with incorrect scope!');
        console.warn('Current Path:', currentPath);
        console.warn('Expected Path:', expectedPath);
        console.log('Initiating PWA reset...');
        window.resetPWA();
        return true;
      }
    }
    return false;
  };
  
  // Check for installed PWA with wrong scope
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(window.checkAndResetPWA, 1000); // Small delay to let app stabilize
  } else {
    window.addEventListener('DOMContentLoaded', function() {
      setTimeout(window.checkAndResetPWA, 1000);
    });
  }
})();
