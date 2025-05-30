
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['http-proxy-agent', 'https-proxy-agent', 'node:http', 'node:https'],
    }
  },
  define: {
    global: 'globalThis',
  },
});
