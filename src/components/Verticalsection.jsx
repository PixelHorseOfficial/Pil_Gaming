import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Verticalsection.css";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES      = 90; // image00.png → image89.png
const IMAGE_BASE        = "/PIL_PAGE_2/image";
const PAD_LENGTH        = 2;
const SCROLL_MULTIPLIER = 32; // px per frame → 89 × 32 = 2848px scroll space

function getImageSrc(index) {
  const padded = String(index).padStart(PAD_LENGTH, "0");
  return `${IMAGE_BASE}${padded}.png`;
}

export default function VerticalSection() {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const imagesRef    = useRef([]);
  const lastDrawnRef = useRef(-1);
  const textBoxRef   = useRef(null);

  const frameStateRef = useRef({ frame: 0 });

  const [loadedCount, setLoadedCount] = useState(0);

  const PRIORITY_FRAMES = 8;
  const isReady          = loadedCount >= PRIORITY_FRAMES;
  const isLoading        = loadedCount < TOTAL_FRAMES;
  const loadPercent      = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // ── drawFrame ─────────────────────────────────────────────────────────────
  const drawFrame = useCallback((frameFloat) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d"); // no alpha:false — keeps canvas transparent
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const cw = canvas.width;
    const ch = canvas.height;

    const drawOne = (img, alpha = 1) => {
      if (!img?.complete || !img.naturalWidth) return;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
      ctx.globalAlpha = 1;
    };

    // Clear to transparent so hero.png background bleeds through
    ctx.clearRect(0, 0, cw, ch);

    const lo    = Math.floor(frameFloat);
    const hi    = Math.min(lo + 1, TOTAL_FRAMES - 1);
    const t     = frameFloat - lo;
    const imgLo = imagesRef.current[lo];
    const imgHi = imagesRef.current[hi];

    if (imgLo && imgHi) { drawOne(imgLo, 1); if (t > 0.01) drawOne(imgHi, t); }
    else if (imgLo)      drawOne(imgLo, 1);
    else if (imgHi)      drawOne(imgHi, 1);
  }, []);

  // ── Canvas resize ─────────────────────────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = containerRef.current;
    if (!container) return;
    canvas.width  = container.clientWidth;
    canvas.height = window.innerHeight;
    drawFrame(frameStateRef.current.frame);
  }, [drawFrame]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ── Image preloading ──────────────────────────────────────────────────────
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES).fill(null);

    const loadBatch = (indices) =>
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
    Promise.all(loadBatch(priority)).then(() => Promise.all(loadBatch(rest)));
  }, [drawFrame]);

  // ── GSAP ScrollTrigger: drives frame scrub ──────────────────────────────
  useEffect(() => {
    if (!isReady) return;

    const container = containerRef.current;
    if (!container) return;

    const seqScrollRange = TOTAL_FRAMES * SCROLL_MULTIPLIER;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: `+=${seqScrollRange}`,
        scrub: 0.9,
        pin: false,
      },
    });

    tl.to(frameStateRef.current, {
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

    // Animate text box visibility
    if (textBoxRef.current) {
      gsap.set(textBoxRef.current, { opacity: 0 });
      gsap.to(textBoxRef.current, {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: `+=${seqScrollRange * 0.15}`,
          scrub: true,
        },
      });

      gsap.to(textBoxRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: `top+=${seqScrollRange * 0.85} top`,
          end: `top+=${seqScrollRange} top`,
          scrub: true,
        },
      });
    }

    ScrollTrigger.refresh();

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
    };
  }, [isReady, drawFrame]);

  return (
    <section className="vertical-section">
      <div
        ref={containerRef}
        className="vertical-scroll-space"
        style={{ height: `calc(100vh + ${TOTAL_FRAMES * SCROLL_MULTIPLIER}px)` }}
      >
        <div className="vertical-sticky">

          <video
            className="vertical-bg-video"
            src="/images/bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />

          <canvas
            ref={canvasRef}
            className={`vertical-canvas ${isReady ? "vertical-canvas--ready" : ""}`}
          />

          <div className="team-header">
            <span className="features-eyebrow__text" style={{ display: "inline-block", transform: "translateY(90px)" }}>
  OUR Missions
</span>
          </div>

          {!isReady && (
            <div className="vertical-loader">
              <div className="vertical-loader__title">Loading</div>
              <div className="vertical-loader__bar">
                <div
                  className="vertical-loader__fill"
                  style={{ width: `${loadPercent}%` }}
                />
              </div>
              <div className="vertical-loader__count">{loadedCount} / {TOTAL_FRAMES}</div>
            </div>
          )}

          {isReady && isLoading && (
            <div className="vertical-progress">
              <div
                className="vertical-progress__fill"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
          )}

        </div>
      </div>
    </section>
  );
}