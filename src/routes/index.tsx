import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import heroMain from "@/assets/hero-main.mp4.asset.json";
import destMoon from "@/assets/dest-moon.jpg";
import destMars from "@/assets/dest-mars.jpg";
import destJupiter from "@/assets/dest-jupiter.jpg";
import destSaturn from "@/assets/dest-saturn.jpg";
import shipAurora from "@/assets/ship-aurora.png";
import shipNebula from "@/assets/ship-nebula.png";
import shipTitan from "@/assets/ship-titan.png";
import shipInfinity from "@/assets/ship-infinity.png";
import galaxySpiral from "@/assets/galaxy-spiral.jpg";
import footerSpace from "@/assets/footer-space.jpg";
import avatar1 from "@/assets/avatar-1.jpg";
import avatar2 from "@/assets/avatar-2.jpg";
import avatar3 from "@/assets/avatar-3.jpg";

gsap.registerPlugin(ScrollTrigger);


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Space Tours — Luxury Interplanetary Experiences" },
      { name: "description", content: "Book your next vacation among the stars. Cinematic luxury space travel to the Moon, Mars, Jupiter and beyond." },
      { property: "og:title", content: "Space Tours — Luxury Interplanetary Experiences" },
      { property: "og:description", content: "Book your next vacation among the stars." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: SpaceToursPage,
});

/* ────────────────────────────────────────────────────────── */
/*  Star field canvas                                         */
/* ────────────────────────────────────────────────────────── */
function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const stars: { x: number; y: number; z: number; r: number }[] = [];
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 0.5 + 0.05,
        r: Math.random() * 1.2 + 0.2,
      });
    }
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.y += s.z * 0.15;
        if (s.y > canvas.height) {
          s.y = 0; s.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240,238,255,${s.z * 1.4})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none opacity-70" />;
}

/* ────────────────────────────────────────────────────────── */
/*  Custom cursor                                             */
/* ────────────────────────────────────────────────────────── */
function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-custom-cursor");
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let rx = x, ry = y;
    const move = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const tick = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a,button,[data-cursor='hover']")) ringRef.current?.classList.add("hover");
      else ringRef.current?.classList.remove("hover");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);
  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Navbar                                                    */
/* ────────────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 60);
    on(); window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = ["Destinations", "Our Fleet", "Experiences", "About Us", "Contact"];
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[rgba(0,0,0,0.85)] backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 py-5">
        <a href="#top" className="leading-none">
          <div className="font-display font-bold text-[20px] tracking-wider text-foreground">SPACE TOURS</div>
          <div className="font-body text-[9px] tracking-[0.25em] text-foreground/60 mt-1">LUXURY INTERPLANETARY EXPERIENCES</div>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l} href="#" className="text-[13px] text-foreground/80 hover:text-foreground transition-colors">
              {l}
            </a>
          ))}
          <button className="px-5 py-2.5 text-[13px] font-medium border border-foreground/30 rounded-md hover:border-primary hover:shadow-[0_0_20px_var(--primary)] hover:bg-primary/10 transition-all">
            Book Now
          </button>
        </nav>
      </div>
    </motion.header>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Hero                                                      */
/* ────────────────────────────────────────────────────────── */
function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = headlineRef.current?.querySelectorAll(".ltr");
      if (letters) {
        gsap.from(letters, {
          y: 40, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.03,
        });
      }
      gsap.from(".hero-sub", { y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.4 });
      gsap.from(".hero-cta", { scale: 0.9, opacity: 0, duration: 0.7, ease: "power3.out", delay: 0.8, stagger: 0.1 });
      gsap.from(".hero-label", { opacity: 0, y: 10, duration: 0.6, delay: 0.2 });

      gsap.to(videoRef.current, {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(contentRef.current, {
        yPercent: 15, opacity: 0.3, ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });

      gsap.to(scrollCueRef.current, {
        opacity: 0,
        scrollTrigger: { trigger: heroRef.current, start: "top -80", toggleActions: "play none none reverse" },
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const headline = "YOUR NEXT DESTINATION";
  return (
    <section ref={heroRef} id="top" className="relative h-screen w-full overflow-hidden">
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={heroMain.url}
      />
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)",
        }}
      />
      <div
        ref={contentRef}
        className="relative z-[2] h-full flex flex-col justify-center max-w-full md:max-w-[55%] pl-6 md:pl-[80px] pr-6"
      >
        <div className="hero-label text-[11px] tracking-[0.3em] font-medium mb-6 uppercase" style={{ color: "var(--secondary)" }}>
          EARTH IS BORING.
        </div>
        <h1
          ref={headlineRef}
          className="font-display font-black text-foreground leading-[0.95]"
          style={{ fontSize: "clamp(52px, 7vw, 88px)", letterSpacing: "-0.02em", fontWeight: 900 }}
        >
          {headline.split(" ").map((word, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
              {word.split("").map((ch, i) => (
                <span key={i} className="ltr inline-block">{ch}</span>
              ))}
            </span>
          ))}
        </h1>
        <p
          className="hero-sub font-display mt-4"
          style={{ fontSize: "clamp(16px, 2vw, 26px)", fontWeight: 700, color: "var(--glow)" }}
        >
          COULD BE SOMEWHERE IN MILKY WAY GALAXY.
        </p>
        <p className="hero-sub font-body mt-6 text-foreground/70" style={{ fontSize: "16px", fontWeight: 300 }}>
          Book your SPACE TOUR with us.
        </p>
        <div className="flex flex-wrap gap-4 mt-8">
          <button className="hero-cta px-7 py-3.5 bg-primary text-foreground font-medium rounded-md text-[14px] hover:shadow-[0_0_30px_var(--primary)] transition-all">
            Book Your Space Tour
          </button>
          <button className="hero-cta px-7 py-3.5 border border-foreground/30 text-foreground rounded-md text-[14px] flex items-center gap-2 hover:border-foreground/70 transition-all">
            Explore Destinations
            <span>→</span>
          </button>
        </div>
      </div>
      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex flex-col items-center gap-3"
      >
        <div className="w-[22px] h-[36px] border border-foreground/40 rounded-full flex justify-center pt-2">

          <motion.div
            className="w-[3px] h-[8px] bg-foreground/80 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-[9px] tracking-[0.3em] text-foreground/50">SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Stats bar                                                 */
/* ────────────────────────────────────────────────────────── */
const stats = [
  { value: 18, suffix: "", label: "Interplanetary Destinations", icon: "planet" },
  { value: 2.4, suffix: "M km", label: "Average Travel Distance", icon: "target", decimals: 1 },
  { value: 99.9, suffix: "%", label: "Passenger Safety", icon: "shield", decimals: 1 },
  { value: 7, suffix: "", label: "Luxury Space Hotels", icon: "compass" },
];

function StatIcon({ name }: { name: string }) {
  const stroke = "rgba(240,238,255,0.45)";
  switch (name) {
    case "planet":
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="6" stroke={stroke} />
          <ellipse cx="16" cy="16" rx="14" ry="5" stroke={stroke} transform="rotate(-20 16 16)" />
        </svg>
      );
    case "target":
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="10" stroke={stroke} />
          <circle cx="16" cy="16" r="3" stroke={stroke} />
          <path d="M16 2v6M16 24v6M2 16h6M24 16h6" stroke={stroke} />
        </svg>
      );
    case "shield":
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7l11-4z" stroke={stroke} />
        </svg>
      );
    case "compass":
      return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="12" stroke={stroke} />
          <path d="M16 6l3 10-10 3 7-13z" stroke={stroke} />
        </svg>
      );
  }
  return null;
}

function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const els = ref.current!.querySelectorAll<HTMLDivElement>(".stat-num");
      ScrollTrigger.create({
        trigger: ref.current!,
        start: "top 80%",
        once: true,
        onEnter: () => {
          els.forEach((el) => {
            const end = parseFloat(el.dataset.value || "0");
            const decimals = parseInt(el.dataset.decimals || "0");
            const obj = { v: 0 };
            gsap.to(obj, {
              v: end, duration: 2, ease: "power2.out",
              onUpdate: () => { el.textContent = obj.v.toFixed(decimals); },
            });
          });
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <motion.section
      ref={ref}
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7 }}
      className="relative z-10 bg-surface border-y border-white/5"
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center gap-4 px-6 lg:px-10 py-8 ${
              i > 0 ? "md:border-l border-white/5" : ""
            }`}
          >
            <StatIcon name={s.icon} />
            <div>
              <div className="font-display font-bold text-[34px] md:text-[42px] leading-none" style={{ color: "var(--secondary)" }}>
                <span className="stat-num" data-value={s.value} data-decimals={s.decimals ?? 0}>0</span>
                {s.suffix && <span className="text-[20px] ml-1 text-foreground/70">{s.suffix}</span>}
              </div>
              <div className="mt-2 text-[11px] tracking-[0.25em] text-foreground/55 uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Explore Destinations                                      */
/* ────────────────────────────────────────────────────────── */
const destinations = [
  { tag: "MOON RETREAT", name: "Weekend Above Earth", img: destMoon, desc: "Experience sunrise over Earth from the lunar horizon." },
  { tag: "LUNCH AT MARS", name: "Dine on the Red Planet", img: destMars, desc: "Enjoy a gourmet lunch inside the first Martian glass dome." },
  { tag: "DINNER IN JUPITER", name: "Dinner Above the Storms", img: destJupiter, desc: "Witness the Great Red Spot while enjoying a 7-course meal." },
  { tag: "SATURN RING CRUISE", name: "Sail Through the Rings", img: destSaturn, desc: "The most photogenic vacation in the universe." },
];

function SectionHeading({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-10 gap-6">
      <h2 className="font-display font-bold text-[22px] md:text-[26px] tracking-[0.15em] text-foreground relative">
        <span
          className="absolute right-full top-1/2 mr-4 h-px w-[60px] hidden md:block"
          style={{ background: "var(--secondary)" }}
        />
        {children}
      </h2>
      {right}
    </div>
  );
}

function Destinations() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dest-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="relative z-10 py-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading
          right={<a href="#" className="text-[12px] tracking-[0.2em] text-foreground/70 hover:text-foreground flex items-center gap-2">VIEW ALL DESTINATIONS <span>→</span></a>}
        >
          EXPLORE DESTINATIONS
        </SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {destinations.map((d) => (
            <div
              key={d.tag}
              className="dest-card group relative h-[360px] rounded-xl overflow-hidden border border-white/5 cursor-pointer transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(123,111,232,0.25)]"
              data-cursor="hover"
            >
              <img
                src={d.img}
                alt={d.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute top-5 left-5 text-[10px] tracking-[0.25em] font-display font-semibold text-foreground/90">
                {d.tag}
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <div className="font-display font-bold text-[18px] text-foreground mb-2">{d.name}</div>
                <div className="text-[12px] text-foreground/60 leading-relaxed pr-12">{d.desc}</div>
                <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-foreground/80 group-hover:bg-primary group-hover:border-primary transition-all">
                  →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Galaxy Map                                                */
/* ────────────────────────────────────────────────────────── */
const planets = [
  { id: "moon", name: "MOON", sub: "Earth's Companion", x: 22, y: 28, time: "3 Days", acts: "Lunar Walk, Earthrise View", price: "$250,000" },
  { id: "mars", name: "MARS", sub: "The Red Planet", x: 35, y: 55, time: "7 Months", acts: "Dining, Exploration, Habitat Tour", price: "$750,000" },
  { id: "jupiter", name: "JUPITER", sub: "The Gas Giant", x: 55, y: 45, time: "13 Months", acts: "Storm Viewing, Moon Hop", price: "$1,200,000" },
  { id: "saturn", name: "SATURN", sub: "Lord of Rings", x: 72, y: 30, time: "16 Months", acts: "Ring Cruise, Titan Visit", price: "$1,500,000" },
  { id: "neptune", name: "NEPTUNE", sub: "The Ice Giant", x: 60, y: 70, time: "2 Years", acts: "Deep Space Expedition", price: "$2,400,000" },
  { id: "proxima", name: "PROXIMA CENTAURI", sub: "Nearest Star", x: 88, y: 60, time: "Lifetime", acts: "Interstellar Pioneer Voyage", price: "$10M+" },
];

function GalaxyMap() {
  const ref = useRef<HTMLDivElement>(null);
  const galaxyRef = useRef<HTMLImageElement>(null);
  const [active, setActive] = useState("mars");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(galaxyRef.current, {
        rotation: 50,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1.5 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const current = planets.find((p) => p.id === active)!;

  return (
    <section ref={ref} className="relative z-10 py-24 px-6 lg:px-10 bg-surface/40">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1.85fr_1fr] gap-10 items-start">
        {/* Left: heading + galaxy */}
        <div>
          <h2 className="font-display font-bold text-[26px] tracking-[0.12em] mb-3">GALAXY MAP</h2>
          <div className="text-[11px] tracking-[0.3em] mb-5" style={{ color: "var(--secondary)" }}>
            CHOOSE YOUR DESTINATION
          </div>
          <p className="text-foreground/65 max-w-md text-[14px] mb-6">
            Explore the Milky Way and discover extraordinary places waiting for you.
          </p>
          <button className="px-6 py-3 border border-foreground/30 text-foreground text-[13px] rounded-md hover:border-foreground/70 mb-10">
            Explore Galaxy
          </button>
          {/* Galaxy canvas */}
          <div className="relative aspect-square w-full max-w-[640px] mx-auto">
            <img
              ref={galaxyRef}
              src={galaxySpiral}
              alt="Galaxy spiral"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              style={{ willChange: "transform" }}
            />
            <div className="absolute inset-0 rounded-full" style={{
              background: "radial-gradient(circle, transparent 50%, var(--background) 100%)",
            }} />
            {planets.map((p) => (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                data-cursor="hover"
              >
                <span
                  className={`block w-[10px] h-[10px] rounded-full ${active === p.id ? "bg-accent" : "bg-foreground planet-dot"}`}
                  style={active === p.id ? { boxShadow: "0 0 12px var(--glow), 0 0 24px var(--glow)" } : undefined}
                />
                <span className="absolute left-1/2 -translate-x-1/2 top-4 text-[10px] tracking-[0.2em] text-foreground/70 whitespace-nowrap font-display">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        {/* Right: detail card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35 }}
            className="bg-card border border-white/10 rounded-xl p-6 lg:sticky lg:top-28"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full" style={{ background: "radial-gradient(circle at 30% 30%, #c97a4a, #5c2a17)" }} />
              <div>
                <div className="font-display font-bold text-[18px] tracking-wider">{current.name}</div>
                <div className="text-[12px] text-foreground/55">{current.sub}</div>
              </div>
            </div>
            <DetailRow label="Travel Time" value={current.time} />
            <DetailRow label="Activities" value={current.acts} />
            <DetailRow label="Price From" value={current.price} />
            <button className="mt-6 w-full py-3 bg-primary text-foreground rounded-md text-[13px] font-medium hover:shadow-[0_0_25px_var(--primary)] transition-all">
              View Details
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-t border-white/5">
      <div className="w-6 h-6 rounded-full border border-foreground/30 flex items-center justify-center text-[10px]">●</div>
      <div>
        <div className="text-[11px] text-foreground/50 tracking-[0.15em] uppercase">{label}</div>
        <div className="text-[13px] text-foreground/90 mt-1">{value}</div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Fleet — pinned horizontal scroll                          */
/* ────────────────────────────────────────────────────────── */
const ships = [
  { name: "AURORA CLASS", sub: "Luxury Explorer", img: shipAurora },
  { name: "NEBULA CLASS", sub: "Family Cruiser", img: shipNebula },
  { name: "TITAN X", sub: "Premium VIP Vessel", img: shipTitan },
  { name: "INFINITY CLASS", sub: "Ultra Luxury Liner", img: shipInfinity },
];

function Fleet() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.innerWidth < 768) return;
    const ctx = gsap.context(() => {
      const track = trackRef.current!;
      const distance = track.scrollWidth - window.innerWidth + 80;
      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: () => `+=${distance + 200}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} className="relative z-10 py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-12">
        <SectionHeading
          right={<a href="#" className="text-[12px] tracking-[0.2em] text-foreground/70 hover:text-foreground">VIEW ALL SHIPS</a>}
        >
          OUR LUXURY FLEET
        </SectionHeading>
      </div>
      <div ref={trackRef} className="flex gap-6 px-6 lg:px-10 will-change-transform">
        {ships.map((s, i) => (
          <div
            key={s.name}
            className="shrink-0 w-[360px] md:w-[420px] rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 p-6 group hover:bg-white/[0.05] transition-all"
            data-cursor="hover"
          >
            <div className="h-[220px] flex items-center justify-center">
              <img
                src={s.img}
                alt={s.name}
                loading="lazy"
                className="max-h-full w-auto ship-float group-hover:brightness-125 transition-all"
                style={{
                  animationDelay: `${i * 0.8}s`,
                  filter: "drop-shadow(0 20px 40px rgba(58,139,222,0.25))",
                }}
              />
            </div>
            <div className="mt-6 text-center">
              <div className="font-display font-bold text-[15px] tracking-[0.18em]">{s.name}</div>
              <div className="text-[11px] tracking-[0.25em] mt-2" style={{ color: "var(--secondary)" }}>
                {s.sub.toUpperCase()}
              </div>
            </div>
          </div>
        ))}
        <div className="shrink-0 w-10" />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Tour Experience Timeline                                  */
/* ────────────────────────────────────────────────────────── */
const steps = [
  { t: "LAUNCH", d: "Begin your journey from Earth" },
  { t: "EXPLORE", d: "Experience breathtaking destinations" },
  { t: "INDULGE", d: "Luxury dining & unmatched comfort" },
  { t: "RELAX", d: "Enjoy panoramic views like never before" },
  { t: "RETURN", d: "Take memories that last a lifetime" },
];

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current!;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top 75%", end: "bottom 60%", scrub: 1 },
      });
      // icon pop in
      gsap.utils.toArray<HTMLDivElement>(".tl-icon").forEach((icon, i) => {
        gsap.from(icon, {
          scale: 0, opacity: 0, ease: "back.out(2)", duration: 0.6,
          scrollTrigger: {
            trigger: ref.current,
            start: `top+=${i * 100} 60%`,
            toggleActions: "play none none reverse",
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative z-10 py-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading>THE SPACE TOUR EXPERIENCE</SectionHeading>
        <div className="relative mt-16">
          <svg className="absolute inset-x-0 top-[40px] w-full h-[2px] overflow-visible hidden md:block" preserveAspectRatio="none" viewBox="0 0 1000 2">
            <path
              ref={pathRef}
              d="M 20 1 L 980 1"
              stroke="var(--secondary)"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              fill="none"
            />
          </svg>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 relative">
            {steps.map((s, i) => (
              <div key={s.t} className="flex flex-col items-center text-center">
                <div
                  className="tl-icon w-[80px] h-[80px] rounded-full flex items-center justify-center relative"
                  style={{
                    background: "var(--background)",
                    boxShadow: "0 0 0 1px transparent",
                    backgroundImage: "linear-gradient(var(--background), var(--background)), linear-gradient(135deg, var(--primary), var(--secondary))",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    border: "1.5px solid transparent",
                  }}
                >
                  <span className="text-[22px]" style={{ color: "var(--glow)" }}>
                    {["🚀","🌌","✨","🛰","🌍"][i]}
                  </span>
                </div>
                <div className="font-display font-bold text-[12px] tracking-[0.25em] mt-5">{s.t}</div>
                <div className="text-[12px] text-foreground/60 mt-2 max-w-[160px]">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Testimonials                                              */
/* ────────────────────────────────────────────────────────── */
const testimonials = [
  { q: "The Martian lunch was unforgettable.", n: "Captain Olivia Chen", a: avatar1 },
  { q: "Dinner above Jupiter was the highlight of my life.", n: "James Walker", a: avatar2 },
  { q: "Earth vacations feel outdated now.", n: "Sophia Martinez", a: avatar3 },
  { q: "A truly out-of-this-world experience.", n: "Marcus Reid", a: avatar2 },
  { q: "Saturn's rings up close — no words.", n: "Aiko Tanaka", a: avatar1 },
];

function Testimonials() {
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setStart((s) => (s + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [paused]);
  const visible = useMemo(() => [0,1,2].map((o) => testimonials[(start + o) % testimonials.length]), [start]);
  return (
    <section className="relative z-10 py-24 px-6 lg:px-10 bg-surface/40">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading>WHAT OUR TRAVELERS SAY</SectionHeading>
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="popLayout">
            {visible.map((t) => (
              <motion.div
                key={t.n + start}
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl p-7 backdrop-blur-md"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="flex gap-1 mb-4">
                  {[0,1,2,3,4].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08, duration: 0.3 }}
                      className="text-[#facc15] text-[14px]"
                    >★</motion.span>
                  ))}
                </div>
                <p className="italic text-foreground/85 text-[15px] leading-relaxed mb-6">"{t.q}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.a} alt={t.n} loading="lazy" className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <div className="text-[13px] font-medium">— {t.n}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Pricing                                                   */
/* ────────────────────────────────────────────────────────── */
const packages = [
  { name: "EXPLORER PACKAGE", sub: "Perfect for first-time explorers", price: 250000, features: ["Lunar Retreat", "3 Days Experience"], bg: destMoon },
  { name: "BUSINESS ORBIT", sub: "Comfort meets adventure", price: 750000, features: ["Mars Lunch Experience", "5 Days Experience"], popular: true, bg: destMars },
  { name: "GALACTIC ELITE", sub: "The ultimate luxury experience", price: 1500000, features: ["Jupiter Dinner + Saturn Cruise", "10 Days Experience"], bg: destJupiter },
];

function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".pkg-card", {
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
      ref.current!.querySelectorAll<HTMLDivElement>(".price-num").forEach((el) => {
        const v = parseFloat(el.dataset.value!);
        ScrollTrigger.create({
          trigger: ref.current!,
          start: "top 75%",
          once: true,
          onEnter: () => {
            const obj = { v: 0 };
            gsap.to(obj, {
              v, duration: 2, ease: "power2.out",
              onUpdate: () => { el.textContent = "$" + Math.round(obj.v).toLocaleString(); },
            });
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="relative z-10 py-24 px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <SectionHeading>CHOOSE YOUR JOURNEY</SectionHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {packages.map((p) => (
            <div
              key={p.name}
              className={`pkg-card relative rounded-2xl p-7 overflow-hidden bg-card border ${
                p.popular ? "border-secondary popular-pulse" : "border-white/8"
              }`}
            >
              <img src={p.bg} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-card/40 via-card/80 to-card pointer-events-none" />
              {p.popular && (
                <div
                  className="absolute left-1/2 -top-3 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] tracking-[0.25em] font-display font-semibold"
                  style={{ background: "var(--secondary)", color: "var(--foreground)" }}
                >
                  POPULAR
                </div>
              )}
              <div className="relative">
                <div className="font-display font-bold text-[14px] tracking-[0.2em]">{p.name}</div>
                <div className="text-[12px] text-foreground/55 mt-2">{p.sub}</div>
                <div className="mt-6 flex items-baseline gap-2">
                  <span className="price-num font-display font-black" style={{ fontSize: "clamp(28px, 4vw, 38px)", color: "var(--secondary)" }} data-value={p.price}>$0</span>
                  <span className="text-[12px] text-foreground/55">/ per person</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-foreground/80">
                      <span className="mt-0.5" style={{ color: "var(--secondary)" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full py-3 rounded-md text-[13px] font-medium transition-all ${
                  p.popular
                    ? "bg-primary text-foreground hover:shadow-[0_0_30px_var(--primary)]"
                    : "border border-foreground/25 text-foreground hover:border-foreground/60"
                }`}>
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Footer CTA                                                */
/* ────────────────────────────────────────────────────────── */
function FooterCTA() {
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const letters = headRef.current!.querySelectorAll(".fltr");
      gsap.from(letters, {
        y: 60, opacity: 0, duration: 1, ease: "power3.out", stagger: 0.03,
        scrollTrigger: { trigger: ref.current, start: "top 70%" },
      });
      gsap.fromTo(
        shipRef.current,
        { x: "-30vw", y: "30vh", opacity: 0.4 },
        {
          x: "35vw", y: "-20vh", opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: 1 },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  const text = "THE UNIVERSE IS WAITING.";
  return (
    <section ref={ref} className="relative z-10 min-h-screen flex items-center justify-center overflow-hidden">
      <img src={footerSpace} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" loading="lazy" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 0%, var(--background) 80%)" }} />
      {/* spacecraft */}
      <div ref={shipRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[300px] md:w-[440px]">
        <img src={shipAurora} alt="" className="w-full h-auto" style={{ filter: "drop-shadow(0 0 40px rgba(58,139,222,0.5))" }} />
        <svg className="absolute top-1/2 right-full -translate-y-1/2 w-[400px] h-[40px] pointer-events-none" viewBox="0 0 400 40" preserveAspectRatio="none">
          <line x1="0" y1="20" x2="400" y2="20" stroke="rgba(167,139,250,0.5)" strokeWidth="1" strokeDasharray="2 8" />
        </svg>
      </div>
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <h2
          ref={headRef}
          className="font-display font-black text-foreground leading-[0.95]"
          style={{ fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-0.02em" }}
        >
          {text.split(" ").map((w, wi) => (
            <span key={wi} className="inline-block whitespace-nowrap mr-[0.25em]">
              {w.split("").map((c, i) => (
                <span key={i} className="fltr inline-block">{c}</span>
              ))}
            </span>
          ))}
        </h2>
        <p className="mt-6 text-foreground/65 text-[16px] md:text-[18px]">Where will your next journey take you?</p>
        <button className="mt-10 px-8 py-4 bg-primary text-foreground rounded-md text-[14px] font-medium hover:shadow-[0_0_40px_var(--primary)] transition-all">
          Book Your Space Tour
        </button>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Page                                                      */
/* ────────────────────────────────────────────────────────── */
function SpaceToursPage() {
  // Register GSAP plugins + Lenis
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    const tick = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let debounce: number;
    const onResize = () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      <StarField />
      <div className="grain-overlay" />
      <CustomCursor />
      <Navbar />
      <main className="relative">
        <Hero />
        <StatsBar />
        <Destinations />
        <GalaxyMap />
        <Fleet />
        <Timeline />
        <Testimonials />
        <Pricing />
        <FooterCTA />
        <footer className="relative z-10 py-10 px-6 lg:px-10 border-t border-white/5">
          <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4 text-[12px] text-foreground/55">
            <div className="font-display tracking-[0.2em]">SPACE TOURS © 2026</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
