/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [svgr(), react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
  build: { outDir: './dist' },
  css: {
    modules: {
      generateScopedName:
        command === 'build'
          ? 'pv_[hash:base64:7]'
          : 'pv_[local]_[hash:base64:7]',
    },
    preprocessorOptions: { scss: { api: 'modern-compiler' } },
  },
  test: {
    testTimeout: 30000,
    environment: 'jsdom',
    setupFiles: './setup-test.ts',
    globals: true,
  },
}));
