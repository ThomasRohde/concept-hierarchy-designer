/**
 * PWA Multi-Domain Validation Script
 * 
 * Run this in the browser console to validate PWA scoping configuration
 */

(async function validatePWAScoping() {
  console.group('🔍 PWA Multi-Domain Validation');
  
  const repoName = 'concept-hierarchy-designer';
  const currentURL = window.location.href;
  const currentPath = window.location.pathname;
  
  // Detect environment
  const isProd = currentPath.startsWith(`/${repoName}/`) || 
                 window.location.hostname.includes('github.io');
  
  console.log('📍 Environment Detection:');
  console.log('  Current URL:', currentURL);
  console.log('  Current path:', currentPath);
  console.log('  Is Production:', isProd);
  console.log('  Expected scope:', isProd ? `/${repoName}/` : '/');
  
  // Check Service Worker
  console.log('\n🔧 Service Worker Status:');
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        console.log('✅ Service Worker registered');
        console.log('  Scope:', registration.scope);
        console.log('  Script URL:', registration.active?.scriptURL);
        
        const expectedScope = isProd ? 
          `${window.location.origin}/${repoName}/` : 
          `${window.location.origin}/`;
        
        if (registration.scope === expectedScope) {
          console.log('✅ Service Worker scope is correct');
        } else {
          console.warn('⚠️ Service Worker scope mismatch:');
          console.warn('  Expected:', expectedScope);
          console.warn('  Actual:', registration.scope);
        }
      } else {
        console.warn('⚠️ No Service Worker registered');
      }
    } catch (error) {
      console.error('❌ Service Worker check failed:', error);
    }
  } else {
    console.error('❌ Service Workers not supported');
  }
  
  // Check Manifest
  console.log('\n📋 Manifest Validation:');
  try {
    const manifestPath = isProd ? 
      `/${repoName}/manifest.webmanifest` : 
      '/manifest.webmanifest';
    
    console.log('  Manifest path:', manifestPath);
    
    const response = await fetch(manifestPath);
    if (response.ok) {
      const manifest = await response.json();
      console.log('✅ Manifest loaded successfully');
      
      const expectedScope = isProd ? `/${repoName}/` : '/';
      const expectedStartUrl = isProd ? `/${repoName}/` : '/';
      const expectedId = isProd ? `/${repoName}/` : '/';
      
      // Validate critical fields
      const checks = [
        { field: 'scope', expected: expectedScope, actual: manifest.scope },
        { field: 'start_url', expected: expectedStartUrl, actual: manifest.start_url },
        { field: 'id', expected: expectedId, actual: manifest.id },
      ];
      
      checks.forEach(({ field, expected, actual }) => {
        if (actual === expected) {
          console.log(`✅ ${field}: ${actual}`);
        } else {
          console.warn(`⚠️ ${field} mismatch:`);
          console.warn(`  Expected: ${expected}`);
          console.warn(`  Actual: ${actual}`);
        }
      });
      
    } else {
      console.error('❌ Manifest fetch failed:', response.status);
    }
  } catch (error) {
    console.error('❌ Manifest check failed:', error);
  }
  
  // Check Install Prompt
  console.log('\n📱 Install Prompt Status:');
  const beforeInstallPromptSupported = 'onbeforeinstallprompt' in window;
  console.log('  beforeinstallprompt supported:', beforeInstallPromptSupported);
  
  if (window.deferredPrompt || (window as any).PWAUtils?.getDeferredPrompt()) {
    console.log('✅ Install prompt is available');
  } else {
    console.log('ℹ️ Install prompt not captured (may appear later)');
  }
  
  // Summary
  console.log('\n📊 Summary:');
  console.log('  This validation helps ensure your PWA won\'t conflict with');
  console.log('  other PWAs deployed on the same GitHub Pages domain.');
  console.log('');
  console.log('  Key requirements for multi-PWA support:');
  console.log('  ✓ Unique service worker scope per app');
  console.log('  ✓ Unique manifest id, scope, and start_url');
  console.log('  ✓ Proper navigation fallback configuration');
  console.log('  ✓ App-specific cache names');
  
  console.groupEnd();
})();

// Export for manual use
window.validatePWAScoping = () => {
  // Re-run the validation
  location.reload();
};
