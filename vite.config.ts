import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [svgr(), react()],
  resolve: {
    // Resolves the @testing aliases from tsconfig.json paths.
    tsconfigPaths: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  build: { outDir: './dist' },
  css: {
    modules: {
      generateScopedName: command === 'build' ? 'pv_[hash:base64:7]' : 'pv_[local]_[hash:base64:7]',
    },
  },
  test: {
    testTimeout: 30000,
    environment: 'jsdom',
    setupFiles: './setup-test.ts',
    globals: true,
  },
}));
