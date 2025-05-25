/**
 * PWA Installation Test Script
 * Run this in the browser console after deploying to GitHub Pages
 */

(function() {
  console.log('🔧 PWA Installation Test Script');
  console.log('================================');
  
  // Test 1: Check current URL and expected scope
  const repoName = 'concept-hierarchy-designer';
  const expectedScope = `/${repoName}/`;
  const currentPath = window.location.pathname;
  
  console.log('📍 URL Analysis:');
  console.log(`  Current URL: ${window.location.href}`);
  console.log(`  Current Path: ${currentPath}`);
  console.log(`  Expected Scope: ${expectedScope}`);
  console.log(`  In Scope: ${currentPath.startsWith(expectedScope)}`);
  
  // Test 2: Check manifest
  fetch('/concept-hierarchy-designer/manifest.webmanifest')
    .then(response => response.json())
    .then(manifest => {
      console.log('📱 Manifest Check:');
      console.log(`  Name: ${manifest.name}`);
      console.log(`  Start URL: ${manifest.start_url}`);
      console.log(`  Scope: ${manifest.scope}`);
      console.log(`  ID: ${manifest.id}`);
      console.log(`  Icons: ${manifest.icons.length} configured`);
      
      // Validate icon paths
      const invalidIcons = manifest.icons.filter(icon => !icon.src.startsWith(expectedScope));
      if (invalidIcons.length > 0) {
        console.warn('⚠️  Some icons not properly scoped:', invalidIcons);
      } else {
        console.log('✅ All icons properly scoped');
      }
    })
    .catch(err => {
      console.error('❌ Failed to fetch manifest:', err);
    });
  
  // Test 3: Check if PWA is installable
  let deferredPrompt = null;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('🎯 PWA Install Prompt Available!');
    e.preventDefault();
    deferredPrompt = e;
    
    // Show manual install button for testing
    const installBtn = document.createElement('button');
    installBtn.textContent = '📱 Install PWA (Test)';
    installBtn.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      background: #4F46E5;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-family: sans-serif;
    `;
    
    installBtn.onclick = async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('🎯 Install result:', result.outcome);
        deferredPrompt = null;
        installBtn.remove();
      }
    };
    
    document.body.appendChild(installBtn);
  });
  
  // Test 4: Check PWA detection
  const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = window.navigator.standalone === true;
  const isAndroidTWA = document.referrer.includes('android-app://');
  const isPWA = isStandalone || isInWebAppiOS || isAndroidTWA;
  
  console.log('🔍 PWA Detection:');
  console.log(`  Standalone Mode: ${isStandalone}`);
  console.log(`  iOS Web App: ${isInWebAppiOS}`);
  console.log(`  Android TWA: ${isAndroidTWA}`);
  console.log(`  Running as PWA: ${isPWA}`);
  
  // Test 5: Service Worker Check
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('🔧 Service Worker Status:');
      console.log(`  Registrations: ${registrations.length}`);
      
      registrations.forEach((reg, i) => {
        console.log(`  Registration ${i + 1}:`);
        console.log(`    Scope: ${reg.scope}`);
        console.log(`    State: ${reg.active ? 'Active' : 'Inactive'}`);
      });
      
      if (registrations.length === 0) {
        console.warn('⚠️  No service worker registrations found');
      }
    });
  } else {
    console.warn('⚠️  Service Worker not supported');
  }
  
  // Test 6: Instructions
  console.log('\n📝 Testing Instructions:');
  console.log('1. Deploy this build to GitHub Pages');
  console.log('2. Navigate to: https://your-username.github.io/concept-hierarchy-designer/');
  console.log('3. Open DevTools and run this script');
  console.log('4. Check for PWA install prompt');
  console.log('5. If install prompt appears, install the PWA');
  console.log('6. Test that installed PWA opens to the correct scoped URL');
  console.log('7. Check console for any PWA startup router messages');
  
})();
