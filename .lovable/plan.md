# Hero section overhaul

## Goal
Strip the hero down to a single full-viewport video (the newly uploaded `gemini_generated_video_39f9348a-2.mp4`) with one left-dark gradient overlay and text/CTAs anchored to the left half, matching the reference mockup. No other sections change.

## Steps

1. **Upload the new video as a Lovable Asset.**
   - Run `lovable-assets create` against `/mnt/user-uploads/gemini_generated_video_39f9348a-2.mp4` → write `src/assets/hero-main.mp4.asset.json`.

2. **Rewrite the `Hero` component in `src/routes/index.tsx`.**
   - Remove imports/usage of `heroBase` and `heroMid` (and their parallax tweens, vignette div, bottom fade div, scanline).
   - Import the new `heroMain` asset JSON.
   - New structure inside `<section className="relative h-screen w-full overflow-hidden">`:
     - `<video>` — autoplay/muted/loop/playsInline, `absolute inset-0 w-full h-full object-cover z-0`, src = `heroMain.url`.
     - Gradient overlay div, `absolute inset-0 z-[1]`, inline style `background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)`.
     - Content wrapper `relative z-[2] h-full flex flex-col justify-center`, constrained to left: `max-w-[55%]`, `pl-[80px]`, `pr-6` (collapses gracefully on mobile via `max-w-full md:max-w-[55%]` and `pl-6 md:pl-[80px]`).
   - Content (keep existing GSAP letter-split + reveals):
     - Label: "EARTH IS BORING." — `text-[11px] tracking-[0.3em] uppercase font-medium`, color `var(--secondary)`.
     - H1: "YOUR NEXT DESTINATION" — Orbitron 900, `clamp(52px, 7vw, 88px)`, `text-foreground`.
     - Sub: "COULD BE SOMEWHERE IN MILKY WAY GALAXY." — Orbitron 700, `clamp(16px, 2vw, 26px)`, color `var(--glow)` (#A78BFA, already a token).
     - Body: "Book your SPACE TOUR with us." — Outfit 300, 16px, `text-foreground/70`.
     - Two CTA buttons (Book Your Space Tour primary, Explore Destinations outline) — unchanged styling.
   - Keep the scroll cue and the existing content parallax tween on the wrapper; drop the per-video parallax tweens since both video refs are gone. Single new tween: subtle `yPercent: 8` parallax on the video element itself, scrubbed to scroll.
   - Keep `useLayoutEffect` GSAP letter reveal exactly as-is.

3. **Leave everything else untouched** — Navbar, StatsBar, Destinations, Galaxy Map, Fleet, Timeline, Testimonials, Pricing, Footer CTA, StarField, CustomCursor, styles.css. No token changes (`--glow` already covers #A78BFA, `--secondary` covers electric blue).

## Result
Cinematic split-frame hero: dark readable text column on the left, untouched spacecraft+planet footage breathing on the right.
