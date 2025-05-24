import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command }) => {
    // Use relative paths for preview and dev, absolute path for production build
    const base = command === 'build' ? '/concept-hierarchy-designer/' : './';
    
    return {
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          injectRegister: 'auto',
          workbox: {
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
            skipWaiting: true,
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/cdn\.tailwindcss\.com/,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'cdn-cache',
                  expiration: {
                    maxEntries: 10,
                    maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                  }
                }
              }
            ]
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon-*.png'],
          manifest: {
            name: 'Concept Hierarchy Designer',
            short_name: 'Hierarchy Designer',
            description: 'A powerful tool for creating and managing concept hierarchies with drag-and-drop functionality',
            theme_color: '#4F46E5',
            background_color: '#ffffff',
            display: 'standalone',
            orientation: 'portrait',
            scope: '/',
            start_url: '/',
            categories: ['productivity', 'education', 'utilities'],
            lang: 'en',
            icons: [
              {
                src: '/favicon-64x64.png',
                sizes: '64x64',
                type: 'image/png'
              },
              {
                src: '/favicon-128x128.png',
                sizes: '128x128',
                type: 'image/png'
              },
              {
                src: '/favicon-180x180.png',
                sizes: '180x180',
                type: 'image/png'
              },
              {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png'
              },
              {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png'
              }
            ]
          },
          devOptions: {
            enabled: true
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
