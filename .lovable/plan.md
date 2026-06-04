## Goal
Eject from the Lovable Cloudflare default and force a Vercel-targeted Nitro build.

## Changes

**1. `vite.config.ts`** — add `cloudflare: false` to the wrapper config:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    server: { entry: "server" },
  },
});
```

**2. `package.json`** — replace the `build` script to force the Vercel Nitro preset:

```json
"build": "NITRO_PRESET=vercel tanstack-start build",
```

`dev`, `build:dev`, `preview`, `lint`, `format` are untouched.

## Caveats
- `cloudflare: false` is undocumented in the wrapper; if it's a no-op, the `NITRO_PRESET=vercel` env var on the build script is the real guarantee.
- `tanstack-start build` must exist as a CLI in `@tanstack/react-start` for the new script to run. If it doesn't resolve, fallback is `NITRO_PRESET=vercel vite build`.
- Lovable's in-editor preview and `*.lovable.app` publish still run on Cloudflare. This change only affects builds you run yourself (locally or on Vercel CI).
- `build:dev` still uses `vite build --mode development` — Lovable's internal build pipeline depends on it; do not change.
