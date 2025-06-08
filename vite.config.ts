import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
    // Use absolute path only for production deployment, relative paths for preview and dev
    const base = mode === 'production' ? '/concept-hierarchy-designer/' : './';
    
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png'],
          manifest: {
            name: 'Concept Hierarchy Designer',
            short_name: 'Hierarchy',
            theme_color: '#4F46E5',
            background_color: '#ffffff',
            display: 'standalone'
          }
        })
      ],
      base,
      define: {
        'import.meta.env.DEV': command !== 'build',
        'import.meta.env.PROD': command === 'build'
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: undefined
          }
        }
      }
    };
});
