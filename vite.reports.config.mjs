import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/reports/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/reports/index.js"),
      name: "Reports",
      formats: ["es"],
      fileName: "reports",
    },
    rollupOptions: {
      output: {
        entryFileNames: "reports.js",
      },
    },
  },
});
