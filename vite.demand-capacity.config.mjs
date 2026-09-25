import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/demand-capacity/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/demand-capacity/index.js"),
      name: "DemandCapacity",
      formats: ["es"],
      fileName: "demand-capacity",
    },
    rollupOptions: {
      output: {
        entryFileNames: "demand-capacity.js",
      },
    },
  },
});
