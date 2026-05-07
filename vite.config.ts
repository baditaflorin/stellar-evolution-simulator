import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { defineConfig } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

const base = "/stellar-evolution-simulator/";
const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as {
  version: string;
};

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      base,
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icon.svg", "maskable-icon.svg"],
      manifest: {
        name: "Stellar Evolution Simulator",
        short_name: "StellarSim",
        description:
          "Browser-based stellar lifecycle simulator using Pyodide, Plotly, and a MESA-inspired model subset.",
        theme_color: "#0b0d10",
        background_color: "#0b0d10",
        display: "standalone",
        scope: base,
        start_url: base,
        icons: [
          {
            src: `${base}icon.svg`,
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: `${base}maskable-icon.svg`,
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: `${base}index.html`,
        globPatterns: ["**/*.{js,css,html,svg,webmanifest}"],
        globIgnores: ["**/plotly-*.js", "**/*.map"],
        sourcemap: false,
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
    __COMMIT_SHA__: JSON.stringify(process.env.VITE_COMMIT_SHA ?? "runtime"),
    __REPO_URL__: JSON.stringify(
      "https://github.com/baditaflorin/stellar-evolution-simulator",
    ),
    __PAYPAL_URL__: JSON.stringify("https://www.paypal.com/paypalme/florinbadita"),
    __PAGES_URL__: JSON.stringify(
      "https://baditaflorin.github.io/stellar-evolution-simulator/",
    ),
  },
  build: {
    outDir: "docs",
    assetsDir: "assets",
    emptyOutDir: false,
    sourcemap: false,
    chunkSizeWarningLimit: 5_000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("plotly.js-dist-min")) {
            return "plotly";
          }
          if (id.includes("react-dom") || id.includes("react")) {
            return "react-vendor";
          }
          if (id.includes("@tanstack/react-query")) {
            return "query-vendor";
          }
          return undefined;
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
