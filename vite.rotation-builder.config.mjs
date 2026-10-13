import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/rotation-builder/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/rotation-builder/index.js"),
      name: "RotationBuilder",
      formats: ["es"],
      fileName: "rotation-builder",
    },
    rollupOptions: {
      output: {
        entryFileNames: "rotation-builder.js",
      },
    },
  },
});
