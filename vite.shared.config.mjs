import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/shared/dist",
    emptyOutDir: true,
    lib: {
      entry: {
        "shared-utils": resolve(__dirname, "modules/shared/utils/index.js"),
        "shared-chrome": resolve(__dirname, "modules/shared/chrome.js"),
        "shared-lines": resolve(__dirname, "modules/shared/lines/helpers.js"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
});
