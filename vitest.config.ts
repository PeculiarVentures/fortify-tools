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
      exclude: [
        "**/*.stories.*/**",
        "**/*.test.tsx",
        "**/index.{ts,tsx}",
        "**/types.ts",
        "**/*.d.ts",
      ],
    },
    globals: true,
  },
  css: {
    modules: {
      generateScopedName: "pv_[hash:base64:7]",
    },
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
