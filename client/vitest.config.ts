import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";
import { fileURLToPath } from "node:url";
// import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
    // projects: [
    //   {
    //     extends: true,
    //     plugins: [
    //       // The plugin will run tests for the stories defined in your Storybook config
    //       // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
    //       storybookTest({
    //         configDir: path.join(dirname, ".storybook"),
    //       }),
    //     ],
    //     test: {
    //       name: "storybook",
    //       browser: {
    //         enabled: true,
    //         headless: true,
    //         provider: "playwright",
    //         instances: [
    //           {
    //             browser: "chromium",
    //           },
    //         ],
    //       },
    //       setupFiles: [".storybook/vitest.setup.ts"],
    //     },
    //   },
    // ],
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

        "**/index.ts",
        "**/index.tsx",

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
