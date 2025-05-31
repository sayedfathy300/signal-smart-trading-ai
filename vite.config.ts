
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
      // Completely replace ccxt with our mock
      "ccxt": path.resolve(__dirname, "./src/services/mockBacktestingService.ts"),
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
        'assert',
        'crypto',
        'fs',
        'path',
        'os',
        'util',
        'stream',
        'buffer',
        'process',
        'zlib'
      ]
    }
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  optimizeDeps: {
    exclude: [
      'ccxt',
      'http-proxy-agent',
      'https-proxy-agent',
      'socks-proxy-agent'
    ],
    include: []
  }
}));
