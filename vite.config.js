import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // <-- aquí defines '@' para apuntar a src
    },
  },
  server: {
    proxy: {
      '/fooditems': 'http://localhost:8081',
    },
  },
});