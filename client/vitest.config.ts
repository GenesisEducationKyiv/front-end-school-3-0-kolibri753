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
    coverage: {
      provider: "v8",
      reportsDirectory: "./coverage",
      reporter: ["text", "html", "lcov", "json-summary"],
      all: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.int.test.{ts,tsx}",
        "src/**/*.msw.int.test.{ts,tsx}",
        "src/**/*.ct.{ts,tsx}",

        "**/*.d.ts",
        "**/vite-env.d.ts",

        "src/components/index.ts",
        "src/components/*/index.ts",
        "src/features/index.ts",
        "src/helpers/index.ts",
        "src/hooks/index.ts",
        "src/hooks/*/index.ts",
        "src/lib/index.ts",
        "src/schemas/index.ts",
        "src/stores/index.ts",

        "src/types/**/*",
        "src/config/**/*",
        "src/constants/**/*",
        "src/assets/**/*",

        "**/__mocks__/**/*",
        "**/mocks/**/*",
      ],
    },
  },
});
