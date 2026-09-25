import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/setup-panel/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/setup-panel/index.js"),
      name: "SetupPanel",
      formats: ["es"],
      fileName: "setup-panel",
    },
    rollupOptions: {
      output: {
        entryFileNames: "setup-panel.js",
      },
    },
  },
});
