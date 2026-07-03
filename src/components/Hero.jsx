import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Hero.css";
import Navbar from "./Navbar";
import About from "./About";
import Verticalsection from "./Verticalsection";
import Features from "./Features";
import Team from "./Team";
import ContactForm from "./ContactForm";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES      = 140;
const IMAGE_BASE        = "/pil_coin/image";
const PAD_LENGTH        = 3;
const SCROLL_MULTIPLIER = 22;
const PRIORITY_FRAMES   = 15;

// ── Responsive coin sizing ──────────────────────────────────────────────────
const MOBILE_BREAKPOINT   = 768;
const MOBILE_SCALE_MULT   = 1.6;   // how big the coin gets on phones
const DESKTOP_SCALE_MULT  = 0.8;   // original desktop size
const MOBILE_Y_OFFSET_PCT = -0.08; // shift coin up ~8% of viewport height on mobile

function getImageSrc(i) {
  return `${IMAGE_BASE}${String(i).padStart(PAD_LENGTH, "0")}.png`;
}

export default function Hero() {
  const canvasRef     = useRef(null);
  const containerRef  = useRef(null);
  const coinWrapRef   = useRef(null);
  const imagesRef     = useRef([]);
  const frameStateRef = useRef({ frame: 0 });
  const lastDrawnRef  = useRef(-1);

  const [loadedCount, setLoadedCount] = useState(0);
  const isReady   = loadedCount >= PRIORITY_FRAMES;
  const isLoading = loadedCount < TOTAL_FRAMES;
  const loadPct   = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // ── drawFrame ─────────────────────────────────────────────────────────────
  const drawFrame = useCallback((frameFloat) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;
    const isMobile = cw < MOBILE_BREAKPOINT;

    const drawOne = (img, alpha = 1) => {
      if (!img?.complete || !img.naturalWidth) return;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scaleMultiplier = isMobile ? MOBILE_SCALE_MULT : DESKTOP_SCALE_MULT;
      const scale = Math.min(cw / iw, ch / ih) * scaleMultiplier;
      const dw = iw * scale;
      const dh = ih * scale;

      const dx = (cw - dw) / 2;
      let dy = (ch - dh) / 2;

      // Nudge coin upward a bit on mobile so it doesn't collide with content below
      if (isMobile) {
        dy += ch * MOBILE_Y_OFFSET_PCT;
      }

      ctx.globalAlpha = alpha;
      ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    };

    ctx.clearRect(0, 0, cw, ch);

    const lo    = Math.floor(frameFloat);
    const hi    = Math.min(lo + 1, TOTAL_FRAMES - 1);
    const t     = frameFloat - lo;
    const imgLo = imagesRef.current[lo];
    const imgHi = imagesRef.current[hi];

    if (imgLo && imgHi) { drawOne(imgLo, 1); if (t > 0.01) drawOne(imgHi, t); }
    else if (imgLo)     drawOne(imgLo, 1);
    else if (imgHi)     drawOne(imgHi, 1);
  }, []);

  // ── Canvas resize ──────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(frameStateRef.current.frame);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ── Image preloading ───────────────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    const load = (indices) =>
      indices.map((i) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = getImageSrc(i);
          img.onload = img.onerror = () => {
            imagesRef.current[i] = img;
            setLoadedCount((c) => c + 1);
            if (i === 0) requestAnimationFrame(() => drawFrame(0));
            resolve();
          };
        })
      );

    const priority = Array.from({ length: PRIORITY_FRAMES }, (_, i) => i);
    const rest     = Array.from({ length: TOTAL_FRAMES - PRIORITY_FRAMES }, (_, i) => i + PRIORITY_FRAMES);
    Promise.all(load(priority)).then(() => Promise.all(load(rest)));
  }, [drawFrame]);

  // ── GSAP ScrollTriggers ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    const coinWrap  = coinWrapRef.current;
    if (!container || !coinWrap) return;

    const seqPx  = TOTAL_FRAMES * SCROLL_MULTIPLIER;
    const exitPx = window.innerHeight;

    // 1. Frame scrub
    const seqTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${seqPx}`,
        scrub: 0.8,
      },
    });
    seqTl.to(frameStateRef.current, {
      frame: TOTAL_FRAMES - 1,
      ease: "none",
      onUpdate: () => {
        const f = frameStateRef.current.frame;
        if (Math.abs(f - lastDrawnRef.current) > 0.01) {
          lastDrawnRef.current = f;
          drawFrame(f);
        }
      },
    });

    // 2. Coin slides UP after sequence finishes
    gsap.to(coinWrap, {
      y: -window.innerHeight,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: `top+=${seqPx} top`,
        end:   `top+=${seqPx + exitPx} top`,
        scrub: true,
      },
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      seqTl.kill();
    };
  }, [isReady, drawFrame]);

  const seqPx  = TOTAL_FRAMES * SCROLL_MULTIPLIER;
  const exitPx = typeof window !== "undefined" ? window.innerHeight : 800;

  return (
    <>
      {/* ══ NAVBAR — sits above everything ══ */}
      <Navbar />

      {/* ══ HERO SECTION ══ */}
      <section className="hero" id="home">

        {/* Fixed background image */}
        <div className="hero-bg" />

        {/* Tall scroll-space — all ScrollTriggers use this as trigger */}
        <div
          ref={containerRef}
          className="hero-scroll-space"
          style={{ height: `${seqPx + exitPx * 2}px` }}
        >
          {/* Sticky coin viewport */}
          <div ref={coinWrapRef} className="hero-sticky">
            <canvas
              ref={canvasRef}
              className={`hero-canvas ${isReady ? "hero-canvas--ready" : ""}`}
            />

            
            {isReady && isLoading && (
              <div className="hero-progress">
                <div className="hero-progress__fill" style={{ width: `${loadPct}%` }} />
              </div>
            )}
          </div>
        </div>

      </section>

      {/* ══ ABOUT SECTION ══ */}
      <div id="about">
        <About />
      </div>

      {/* ══ MISSIONS / VERTICAL SECTION ══ */}
      <Verticalsection />

      {/* ══ FEATURES / PROGRAMS ══ */}
      <div id="features">
        <Features />
      </div>

      {/* ══ TEAM ══ */}
      <div id="team">
        <Team />
      </div>
      <div id="team">
        <ContactForm />
      </div>
      {/* ══ FOOTER (also serves as contact anchor) ══ */}
      <Footer />
    </>
  );
}