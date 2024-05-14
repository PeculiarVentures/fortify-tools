import { defineConfig, UserConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
export default defineConfig({
  plugins: [tsconfigPaths()] as UserConfig["plugins"],
  test: {
    testTimeout: 30000,
    environment: "jsdom",
    setupFiles: "./setup-test.ts",
    coverage: {
      provider: "v8",
      exclude: ["**/*.stories.*/**"],
    },
  },
});
