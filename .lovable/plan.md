## Fix: Register GSAP ScrollTrigger at module scope

**File:** `src/routes/index.tsx`

**Change 1** — Add at top of file, immediately after the import block and before any component definition:

```ts
gsap.registerPlugin(ScrollTrigger);
```

**Change 2** — Remove the redundant `gsap.registerPlugin(ScrollTrigger);` call from inside the `SpaceToursPage` `useEffect` at line 956.

No other code is modified — no refs, tweens, components, or styles touched.

**Why:** Child components' `useLayoutEffect` hooks fire before the parent `SpaceToursPage`'s `useEffect`, so `ScrollTrigger.create(...)` runs before the plugin is registered, throwing `TypeError: _context2 is not a function`. Registering at module scope guarantees the plugin is installed once during module evaluation, before any component lifecycle runs.