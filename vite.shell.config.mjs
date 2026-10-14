import { defineConfig } from "vite";
import { bladeSvelte } from "./vite.svelte-plugin.mjs";
import { resolve } from "path";

export default defineConfig({
  plugins: [bladeSvelte()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    target: "es2020",
    module: true,
    outDir: "modules/shell/dist",
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/shell/mount.js"),
      name: "BladeShell",
      formats: ["es"],
      fileName: "shell",
    },
    rollupOptions: {
      output: {
        entryFileNames: "shell.js",
        assetFileNames: "shell.[ext]",
      },
    },
  },
});
