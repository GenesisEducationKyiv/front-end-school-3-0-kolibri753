import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    setupFiles: ["./test/msw/setup.ts"],
    include: ["src/**/*.test.ts"],
    testTimeout: 30000,
  },
});
