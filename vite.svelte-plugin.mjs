import { svelte } from "@sveltejs/vite-plugin-svelte";

/** Per-file runes detection. Do not force runes — LinesTable.svelte is still legacy. */
export function bladeSvelte() {
  return svelte();
}
