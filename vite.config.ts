import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
    // Use relative paths for preview and dev, absolute path for production build
    const base = command === 'build' ? '/concept-hierarchy-designer/' : './';
    
    return {
      plugins: [react()],
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
