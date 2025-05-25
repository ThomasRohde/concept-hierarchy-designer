/**
 * PWA Startup Router - Ensures PWA opens to correct scoped URL
 * This file should be loaded in index.html to handle PWA startup routing
 * IMPORTANT: This script must run as early as possible
 */

(function() {  
  // Enhanced PWA detection - cover all scenarios
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isFullscreen = window.matchMedia && window.matchMedia('(display-mode: fullscreen)').matches;
  const isMinimalUi = window.matchMedia && window.matchMedia('(display-mode: minimal-ui)').matches;
  const isInWebAppiOS = window.navigator.standalone === true;
  const isAndroidTWA = document.referrer.includes('android-app://');
  const hasManifestLink = !!document.querySelector('link[rel="manifest"]');
  
  // If any condition suggests this is a PWA, proceed with routing logic
  const isPWA = isStandalone || isFullscreen || isMinimalUi || isInWebAppiOS || isAndroidTWA || 
                localStorage.getItem('was-installed-as-pwa') === 'true';
  
  if (isPWA) {
    const repoName = 'concept-hierarchy-designer';
    const expectedPath = `/${repoName}/`;
    const currentPath = window.location.pathname;
    
    console.log('PWA Startup Router:', {
      isPWA,
      currentPath,
      expectedPath,
      shouldRedirect: !currentPath.startsWith(expectedPath)
    });
      // ALWAYS redirect to the correct path when in PWA mode
    // Even if we're on a path that technically starts with the repo name,
    // we need to ensure we're exactly at the expected path to avoid any issues
    if (!currentPath.startsWith(expectedPath) || 
        (currentPath !== expectedPath && !currentPath.startsWith(expectedPath + '?') && !currentPath.startsWith(expectedPath + '#'))) {
      
      // Store that this was installed as PWA to help with detection on subsequent loads
      localStorage.setItem('was-installed-as-pwa', 'true');
      
      // Use a more robust redirection strategy
      const newURL = `${window.location.origin}${expectedPath}${window.location.search}${window.location.hash}`;
      console.log('PWA Startup: Redirecting to scoped URL:', newURL);
      
      try {
        // Using replace to avoid back button issues
        window.location.replace(newURL);
        
        // Fallback if replace doesn't trigger fast enough
        setTimeout(() => {
          if (!window.location.pathname.startsWith(expectedPath)) {
            window.location.href = newURL;
          }
        }, 50);
      } catch (error) {
        console.error('PWA redirect failed, trying alternative method:', error);
        window.location.href = newURL;
      }
    } else {
      console.log('PWA Startup: Already at correct path', currentPath);
    }
  } else {
    console.log('PWA Startup Router: Not running as PWA, skipping routing logic');
  }
})();
