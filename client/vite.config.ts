import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isDev = mode === "development";
  const isAnalyze = mode === "analyze";

  return {
    plugins: [
      react(),
      tailwindcss(),
      svgr(),
      tsconfigPaths(),

      ...(isAnalyze
        ? [
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
          ]
        : []),
    ],

    esbuild: {
      jsxDev: isDev,
      drop: isDev ? [] : ["console", "debugger"],
    },

    build: {
      sourcemap: isDev ? "inline" : true,
      target: "esnext",
      minify: isDev ? false : "esbuild",
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,

      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("wavesurfer")) {
              return "audio-heavy";
            }

            if (id.includes("react-router")) {
              return "router";
            }

            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform")
            ) {
              return "forms";
            }

            if (id.includes("lucide-react") || id.includes("react-toastify")) {
              return "ui-components";
            }

            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/")
            ) {
              return "react-vendor";
            }

            if (
              id.includes("@tanstack/react-query") ||
              id.includes("@tanstack/react-table")
            ) {
              return "data-libs";
            }

            if (id.includes("axios") || id.includes("zustand")) {
              return "http-state";
            }

            if (
              id.includes("@mobily/ts-belt") ||
              id.includes("neverthrow") ||
              id.includes("clsx")
            ) {
              return "utils";
            }

            if (id.includes("node_modules")) {
              return "vendor";
            }
          },

          chunkFileNames: isDev
            ? "assets/js/[name].js"
            : "assets/js/[name]-[hash].js",
          assetFileNames: isDev
            ? "assets/[ext]/[name].[ext]"
            : "assets/[ext]/[name]-[hash].[ext]",
          entryFileNames: isDev
            ? "assets/js/[name].js"
            : "assets/js/[name]-[hash].js",
        },

        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        },
      },
    },

    server: {
      port: parseInt(env.VITE_DEV_PORT || "3000", 10),
      proxy: {
        [env.VITE_API_PREFIX || "/api"]:
          env.VITE_API_BASE_URL || "http://localhost:8000",
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-router-dom",
        "@tanstack/react-query",
        "axios",
        "zustand",
        "clsx",
      ],
      exclude: ["@tanstack/react-query-devtools", "wavesurfer.js"],
      force: false,
    },
  };
});
