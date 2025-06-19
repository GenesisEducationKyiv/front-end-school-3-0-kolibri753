import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: ["./test/msw/setup.ts"],
    include: [
      "src/**/*.test.{ts,tsx}",
      "src/**/*.int.test.{ts,tsx}",
      "src/**/*.msw.int.test.{ts,tsx}",
    ],
    testTimeout: 30000,
  },
});
