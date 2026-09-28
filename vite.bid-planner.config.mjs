import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/bid-planner/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/bid-planner/index.js"),
      name: "BidPlanner",
      formats: ["es"],
      fileName: "bid-planner",
    },
    rollupOptions: {
      output: {
        entryFileNames: "bid-planner.js",
      },
    },
  },
});
