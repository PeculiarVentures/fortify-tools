import { defineConfig, UserConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [tsconfigPaths(), svgr()] as UserConfig["plugins"],
  test: {
    testTimeout: 30000,
    environment: "jsdom",
    setupFiles: "./setup-test.ts",
    coverage: {
      provider: "v8",
      exclude: ["**/*.stories.*/**"],
    },
    globals: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
