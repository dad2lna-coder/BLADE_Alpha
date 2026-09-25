import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/coverage/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/coverage/index.js"),
      name: "Coverage",
      formats: ["es"],
      fileName: "coverage",
    },
    rollupOptions: {
      output: {
        entryFileNames: "coverage.js",
      },
    },
  },
});
