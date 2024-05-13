import { defineConfig, mergeConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import vitestConfig from "./vitest.config.ts";

// https://vitejs.dev/config/
export default mergeConfig(
  defineConfig({
    plugins: [svgr(), react(), tsconfigPaths()],
    server: {
      port: 3000,
      open: true,
    },
    build: {
      outDir: "./dist",
    },
  }),
  vitestConfig
);
