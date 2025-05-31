
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: [
        'ccxt',
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
        'node:zlib',
        'node:net',
        'net',
        'tls',
        'events',
        'http',
        'https',
        'assert'
      ]
    }
  },
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    exclude: ['ccxt']
  }
}));
