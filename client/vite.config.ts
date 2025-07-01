import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr(),
    tsconfigPaths(),
    visualizer({
      filename: "dist/bundle-analysis-treemap.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
      title: "Bundle Analysis - Treemap",
    }),
    visualizer({
      filename: "dist/bundle-analysis-sunburst.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "sunburst",
      title: "Bundle Analysis - Sunburst",
    }),
    visualizer({
      filename: "dist/bundle-analysis-network.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: "network",
      title: "Bundle Analysis - Network",
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          router: ["react-router-dom"],
          data: [
            "@tanstack/react-query",
            "@tanstack/react-query-devtools",
            "@tanstack/react-table",
          ],
          http: ["axios"],
          forms: ["react-hook-form", "@hookform/resolvers", "zod"],
          audio: ["wavesurfer.js"],
          utils: ["@mobily/ts-belt", "neverthrow", "zustand", "clsx"],
          ui: ["react-toastify", "lucide-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
});
