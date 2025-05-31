
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'socks-proxy-agent',
        'https-proxy-agent',
        'http-proxy-agent',
        'ws',
        'node-fetch',
        'node:http',
        'node:https',
        'node:fs',
        'node:path',
        'node:crypto',
        'node:url',
        'node:util',
        'node:stream',
        'node:buffer',
        'node:events',
        'node:process',
        'node:os',
        'node:zlib'
      ]
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['ccxt']
  }
});
