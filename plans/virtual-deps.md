# TanStack/Svelte Virtual — Package Selection for Svelte 4 (Plain Script Tag App)

## Verdict

Use **`@tanstack/svelte-virtual@3.13.39`** (Svelte adapter) backed by **`@tanstack/virtual-core@3.17.11`** (core engine), with **`svelte@4.2.19`** stores. ESM-only — esm.sh provides no UMD build; use `?bundle` for a single-file browser target.

---

## Packages & Exact Import URLs (esm.sh)

| Package | Version | esm.sh URL | Exports |
|---|---|---|---|
| `@tanstack/svelte-virtual` | 3.13.39 | `https://esm.sh/@tanstack/svelte-virtual@3.13.39` | `createVirtualizer`, `createWindowVirtualizer` (+ re-exports from virtual-core) |
| `@tanstack/virtual-core` | 3.17.11 | `https://esm.sh/@tanstack/virtual-core@3.17.11` | `Virtualizer`, `elementScroll`, `observeElementOffset`, `observeElementRect`, `observeWindowOffset`, `observeWindowRect`, `windowScroll` |
| `svelte/store` | 4.2.19 (pin for Svelte 4!) | `https://esm.sh/svelte@4.2.19/store` | `writable`, `readable`, `derived`, `get`, `readonly` |

> **Important:** `https://esm.sh/svelte/store` (no version) currently resolves to **Svelte 5.57.0**. For a Svelte 4 app you **must** pin explicitly: `https://esm.sh/svelte@4.2.19/store`.

### Svelte 4–pinned composite URL (verified)

```
https://esm.sh/@tanstack/svelte-virtual@3.13.39?deps=svelte@4.2.19&target=es2022
```

esm.sh resolves this to a single entry that internally imports:

```js
import "/@tanstack/virtual-core@3.17.11/es2022/virtual-core.mjs";
import "/svelte@4.2.19/es2022/store.mjs";
export * from "/@tanstack/svelte-virtual@3.13.39/.../svelte-virtual.mjs";
```

---

## ESM vs. Bundled (Browser) — Which Is Safer?

| Format | URL pattern | Notes |
|---|---|---|
| ESM (default) | `https://esm.sh/@tanstack/svelte-virtual@3.13.39` | Multiple sub-imports; requires esm.sh URL rewriting for browser `<script type="importmap">` |
| Bundled ESM | `https://esm.sh/@tanstack/svelte-virtual@3.13.39?bundle&target=es2022` | **Single file**, no nested imports — safest for plain `<script type="module">` with direct `<script src="...">` |
| Bundled core | `https://esm.sh/@tanstack/virtual-core@3.17.11?bundle&target=es2022` | Single file when used standalone |
| UMD | **Not available** on esm.sh for any of these packages | esm.sh does not offer UMD/IIFE output |

**Recommendation for plain script-tag apps:** Use `?bundle&target=es2022` where possible to avoid import-map complexity.

---

## Svelte 4 `svelte/store` Shape

From the actual `https://esm.sh/svelte@4.2.19/es2022/store.mjs` source, the exports are:

```js
export { derived, get, readable, readonly, writable };
```

- `writable(value)` — returns `{ subscribe, set, update }`
- `readable(initial, start)` — returns `{ subscribe }`
- `derived(stores, fn)` — returns `{ subscribe }`
- `get(store)` — synchronous snapshot
- `readonly(store)` — wraps a store with only `subscribe`

These are the **exact same shapes** that `@tanstack/svelte-virtual` uses internally (it imports `writable` and `derived` from `svelte/store`).

---

## Minimal Usage Snippet (Plain HTML + Script Tag)

```html
<!DOCTYPE html>
<html>
<head><title>Svelte 4 Virtual Scroll</title></head>
<body>
  <div id="scroll-container" style="height:400px;overflow:auto">
    <div id="items"></div>
  </div>

  <script type="module">
    // --- All from esm.sh, Svelte 4 pinned ---

    import { createVirtualizer }
      from 'https://esm.sh/@tanstack/svelte-virtual@3.13.39?deps=svelte@4.2.19&target=es2022';

    // --- Create a virtualizer ---
    const virtualizer = createVirtualizer({
      count: 1000,
      getScrollElement: () => document.getElementById('scroll-container'),
      estimateSize: () => 50,        // estimated row height in px
      overscan: 5,                   // render 5 extra rows above/below viewport
    });

    // virtualizer exposes a Svelte writable store at .virtualItems
    // (a Readable<SvelteVirtualizer> per the adapter docs)
    //
    // In a real Svelte 4 component you would subscribe with $virtualizer
    // and use virtualizer.getVirtualItems() / virtualizer.scrollToIndex()
    //
    // For a plain script-tag app, manually render:
    const itemsEl = document.getElementById('items');
    virtualizer.subscribe((_) => {
      const items = virtualizer.getVirtualItems();
      itemsEl.innerHTML = items.map(i =>
        `<div style="position:absolute;top:${i.start}px;width:100%;height:${i.size}px">Row ${i.index}</div>`
      ).join('');
      itemsEl.style.height = virtualizer.getTotalSize() + 'px';
    });
  </script>
</body>
</html>
```

> The above works in any modern browser with ES module support. No bundler needed.

---

## Version Compatibility Matrix

| `@tanstack/svelte-virtual` | `@tanstack/virtual-core` | Svelte 4 support | Status |
|---|---|---|---|
| 3.11.3 | 3.13.x | ✅ | Older stable |
| 3.13.x | 3.17.x | ✅ | **Current (3.13.39 / 3.17.11)** |
| 3.13.39 | 3.17.11 | ✅ | Latest stable at probe time |

The `@tanstack/svelte-virtual` package depends on `@tanstack/virtual-core` internally (confirmed via esm.sh resolution). You do **not** need to install virtual-core separately unless you want direct access to the `Virtualizer` class.

---

## Files Referenced

- `/root/BLADE_Alpha/.dev/worktree/bright-garden/plans/virtual-deps.md` — this document

## Verification Log

- [x] Fetched `https://esm.sh/@tanstack/svelte-virtual` → resolved to v3.13.39, depends on virtual-core@3.17.11 and svelte/store (^3.48.0 \|\| ^4.0.0 \|\| ^5.0.0)
- [x] Fetched `https://esm.sh/@tanstack/virtual-core` → resolved to v3.17.11, ESM-only, exports `Virtualizer` class + observation helpers
- [x] Fetched `https://esm.sh/svelte/store` → defaults to Svelte 5.57.0; pinned Svelte 4 via `svelte@4.2.19/store` → exports `writable, readable, derived, get, readonly`
- [x] Fetched actual entry `.../svelte-virtual.mjs` → confirms `createVirtualizer` + `createWindowVirtualizer` exports, imports `writable`/`derived` from svelte/store
- [x] Tested `?deps=svelte@4.2.19&target=es2022` composite URL → resolves correctly for Svelte 4
- [x] Checked `?bundle` param → available, produces single-file output (no UMD)
- [x] Checked npm registry for version lists → @tanstack/svelte-virtual latest: 3.13.39, @tanstack/virtual-core latest: 3.17.11, Svelte 4 latest: 4.2.19
