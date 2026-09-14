import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      // Ensure Svelte runtime is bundled, not pulled from node_modules
    },
  },
  build: {
    target: "es2020",
    module: true,
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "modules/lines-table/index.js"),
      name: "LinesTable",
      formats: ["es"],
      fileName: "lines-table",
    },
    rollupOptions: {
      output: {
        entryFileNames: "lines-table.js",
        assetFileNames: "lines-table.[extname]",
      },
    },
  },
});