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
    outDir: "modules/function-coverage/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/function-coverage/index.js"),
      name: "FunctionCoverage",
      formats: ["es"],
      fileName: "function-coverage",
    },
    rollupOptions: {
      output: {
        entryFileNames: "function-coverage.js",
        assetFileNames: "function-coverage.[ext]",
      },
    },
  },
});