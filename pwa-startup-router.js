/**
 * PWA Startup Router - Ensures PWA opens to correct scoped URL
 * This file should be loaded in index.html to handle PWA startup routing
 */

(function() {  // Only run this logic when app is running as a PWA
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = window.navigator.standalone === true;
  const isAndroidTWA = document.referrer.includes('android-app://');
  
  const isPWA = isStandalone || isInWebAppiOS || isAndroidTWA;
  
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
    
    // If we're running as a PWA but not on the correct scoped path, redirect
    if (!currentPath.startsWith(expectedPath)) {
      const newURL = `${window.location.origin}${expectedPath}${window.location.search}${window.location.hash}`;
      console.log('PWA Startup: Redirecting to scoped URL:', newURL);
      window.location.replace(newURL);
    }
  }
})();
