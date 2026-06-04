# Space Tours — Cinematic Luxury Landing Page

A single-page, full-bleed cinematic landing page matching the reference mockup and your detailed brief. Deep-space aesthetic, Orbitron + Outfit typography, dual-video hero, GSAP-driven scroll choreography, and a galaxy map with interactive planet waypoints.

## Stack notes (adapted to this project)

The project runs on TanStack Start (not plain Vite+React). I'll keep all your design, animation, and structural intent — only the routing/build setup differs:

- Page lives at `src/routes/index.tsx` (replaces the placeholder).
- Tailwind v4 tokens defined in `src/styles.css` under `@theme` (no `tailwind.config.js`).
- Fonts loaded via Google Fonts `<link>` in `__root.tsx` head.
- No `vercel.json` needed — deployment is handled by Lovable's built-in publishing.
- Uploaded videos uploaded as Lovable Assets (CDN-hosted), referenced via asset JSON imports.

## Install

`gsap`, `@gsap/react`, `framer-motion`, `lenis`.

## Design tokens (src/styles.css)

```
--background: #00000A
--surface:    #0A0A14
--card:       #0D0D1A
--primary:    #7B6FE8   (deep purple)
--secondary:  #3A8BDE   (electric blue)
--glow:       #A78BFA   (soft violet)
--foreground: #F0EEFF
--font-display: "Orbitron"
--font-body:    "Outfit"
```

Global: SVG-noise grain overlay (3% opacity, fixed), custom cursor (dot + trailing ring), fixed star-field canvas (200 drifting particles), Lenis smooth scroll synced to `gsap.ticker`.

## Sections (in order)

1. **Navbar** — fixed, transparent → blurred `rgba(0,0,0,0.85)` after 60px scroll. Logo lockup + 5 nav links + "Book Now" outline button with purple-glow hover.
2. **Hero (100vh)** — stacked layers: base video (nebula), mid video (spacecraft, screen blend @ 0.55), radial vignette, content. Split-letter headline reveal, parallax on all three planes, scan-line sweep, scroll-to-explore cue.
3. **Stats bar** — 4 GSAP count-up stats with orbit SVG icons and vertical dividers.
4. **Explore Destinations** — 4-card grid (Moon, Mars, Jupiter, Saturn) with image zoom on hover, stagger reveal. Card images generated via imagegen.
5. **Galaxy Map** — 65/35 split. Galaxy spiral rotates 0→50deg on scroll (scrub). 6 pulsing planet waypoints; click updates right-side detail card with framer-motion AnimatePresence.
6. **Luxury Fleet** — GSAP pinned horizontal scroll (300vh) across 4 ship cards with idle float animation and engine-glow hover.
7. **Tour Experience Timeline** — 5 steps connected by an SVG dashed path; stroke draws on scroll, icons pop in at milestone progress points.
8. **Testimonials** — 3 glass cards, auto-advance 5s, pause on hover, stagger-fill stars.
9. **Pricing** — 3 packages, middle "POPULAR" with pulsing blue glow, count-up prices.
10. **Footer CTA** — full-viewport "THE UNIVERSE IS WAITING." with spacecraft scrub flyby (bottom-left → upper-right) and star-trail SVG.

## Assets

- **Uploaded videos** → Lovable Assets, used as the two hero video layers and the footer spacecraft frame.
- **Destination images** (Moon, Mars dome, Jupiter, Saturn rings), **ship renders** (Aurora, Nebula, Titan X, Infinity), **galaxy spiral**, **pricing card backgrounds**, **footer deep-space backdrop**, **testimonial avatars** → generated via imagegen.

## Technical details

- GSAP plugins: ScrollTrigger registered once in a top-level effect.
- Lenis instance created in a root effect; `ScrollTrigger.refresh()` on resize (debounce 200ms).
- All animated nodes get `will-change: transform`.
- Letter-split done manually (no SplitText paid plugin).
- `<head>` updated with title, description, og tags via `Route.head()`.
- All colors via semantic Tailwind tokens (`bg-background`, `text-foreground`, `bg-primary`, etc.) — no hardcoded hex in components.

## Out of scope

- Real booking flow, routing to other pages, backend, forms. All CTAs are visual.
- Mobile is responsive but the choreography is tuned for desktop; horizontal-scroll fleet section degrades to vertical stack under `md`.
