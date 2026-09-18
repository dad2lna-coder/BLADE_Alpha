import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "path";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@tanstack/svelte-virtual": resolve(__dirname, "node_modules/@tanstack/svelte-virtual/dist/index.js"),
      "@tanstack/virtual-core": resolve(__dirname, "node_modules/@tanstack/virtual-core/dist/esm/index.js"),
    },
  },
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/lines-table/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/lines-table/index.js"),
      name: "LinesTable",
      formats: ["es"],
      fileName: "lines-table",
    },
    rollupOptions: {
      output: {
        entryFileNames: "lines-table.js",
        assetFileNames: "lines-table.[ext]",
      },
    },
  },
});
