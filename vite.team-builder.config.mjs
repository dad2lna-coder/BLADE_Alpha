import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/team-builder/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "modules/team-builder/index.js"),
      name: "TeamBuilder",
      formats: ["es"],
      fileName: "team-builder",
    },
    rollupOptions: {
      output: {
        entryFileNames: "team-builder.js",
      },
    },
  },
});
