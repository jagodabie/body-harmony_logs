/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Body Harmony Logs',
        short_name: 'BH Logs',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    host: true,
    allowedHosts: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/_tests_/setup.ts'],
    globals: true,
    include: ['src/_tests_/**/*.test.{ts,tsx}'],
    exclude: ['node_modules'],
    css: false,
  },
});
