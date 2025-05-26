import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
    // Use absolute path only for production deployment, relative paths for preview and dev
    const base = mode === 'production' ? '/concept-hierarchy-designer/' : './';
    
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
