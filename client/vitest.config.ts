import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    setupFiles: ["./tests/msw/setup.ts"],
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.int.test.{ts,tsx}",
      "src/**/*.msw.int.test.{ts,tsx}",
    ],
    testTimeout: 30000,
  },
});
