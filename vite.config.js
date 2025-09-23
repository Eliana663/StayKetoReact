import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', 
     setupFiles: [
    './src/setupTests.js',   
    './src/tests/setupMocks.js' 
  ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/fooditems': 'http://localhost:8081',
    },
  },
});