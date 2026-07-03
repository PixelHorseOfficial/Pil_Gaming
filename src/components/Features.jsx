import { useEffect, useRef, useCallback } from "react";
import "./Features.css";

const FEATURES = [
  {
    id: 1,
    tag: "SUMMER PROGRAM",
    title: "Turn Fun\nInto Flex",
    desc: "An action-packed 4-week summer program for kids aged 6–12 in Hyderabad. Packed with games, challenges, and hands-on learning that turns playtime into real skills.",
    art: "/images/1.png",
    accent: "#38c6f4",
    accentRgb: "56,198,244",
    stat: { value: "4 WEEKS", label: "Ages 6–12 · Hyderabad" },
  },
  {
    id: 2,
    tag: "YOUNG BUILDER'S LAB",
    title: "Build The\nFuture",
    desc: "A 4-day immersive program to build future founders through games, challenges, and real-world thinking — covering Emotional Awareness, Digital Safety, Financial Literacy & Entrepreneurship.",
    art: "/images/2.png",
    accent: "#f5c842",
    accentRgb: "245,200,66",
    stat: { value: "4 DAYS", label: "Ages 7–12 · Only 20 Slots" },
  },
  {
    id: 3,
    tag: "PITCH PLEASE 2.0",
    title: "Founders\nPlay",
    desc: "PIL's flagship pitch competition where young founders take the hot seat. Present your idea, face the investors, and walk away with funding, mentorship, or both.",
    art: "/images/3.png",
    accent: "#e03e3e",
    accentRgb: "224,62,62",
    stat: { value: "2.0", label: "Investors Pay" },
  },
  {
    id: 4,
    tag: "VENUE PARTNER · DIL PIL",
    title: "BDUBS\nHyderabad",
    desc: "Buffalo Wild Wings, Jubilee Hills is the official venue partner for Dil PIL — September 27th, 3:00 PM. Come hungry, leave inspired.",
    art: "/images/4.png",
    accent: "#f5c842",
    accentRgb: "245,200,66",
    stat: { value: "SEP 27", label: "3:00 PM · Jubilee Hills" },
  },
  {
    id: 5,
    tag: "FITNESS PARTNER · DIL PIL",
    title: "CrossFit\nHitec City",
    desc: "CrossFit Hitec City is the official fitness partner for Dil PIL. Strength, community, and hustle — the same values that drive every PIL event.",
    art: "/images/5.png",
    accent: "#ff6b2b",
    accentRgb: "255,107,43",
    stat: { value: "SEP 27", label: "3:00 PM · Jubilee Hills" },
  },
];

/* ─── Spring physics ─────────────────────────────────────── */
class Spring {
  constructor(stiffness = 0.08, damping = 0.72) {
    this.value = 0;
    this.target = 0;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }
  tick() {
    const force = (this.target - this.value) * this.stiffness;
    this.velocity = this.velocity * this.damping + force;
    this.value += this.velocity;
    return this.value;
  }
  setTarget(t) { this.target = t; }
}

/* ─── Counter roller ─────────────────────────────────────── */
function rollCounter(el, from, to, total) {
  if (!el) return;
  const pad = (n) => String(n + 1).padStart(2, "0");
  const tot = String(total).padStart(2, "0");
  let frame = 0;
  const FRAMES = 10;
  const tick = () => {
    frame++;
    const val = Math.round(from + ((to - from) * frame) / FRAMES);
    el.textContent = `${pad(val)} / ${tot}`;
    if (frame < FRAMES) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function Features() {
  const sectionRef      = useRef(null);
  const cardsRef        = useRef([]);
  const artWrapRef      = useRef([]);
  const artRef          = useRef([]);
  const bgGlowRef       = useRef(null);
  const progressFillRef = useRef(null);
  const counterRef      = useRef(null);
  const activeRef       = useRef(-1);
  const prevActiveRef   = useRef(-1);

  const springs = useRef({
    mouseX: new Spring(0.06, 0.74),
    mouseY: new Spring(0.06, 0.74),
    tiltX:  new Spring(0.09, 0.68),
    tiltY:  new Spring(0.09, 0.68),
  });
  const rawMouse = useRef({ x: 0, y: 0 });
  const rafId    = useRef(null);

  /* ── Spring RAF loop: mouse tilt + parallax ───────────── */
  useEffect(() => {
    let running = true;
    const sp = springs.current;

    const tick = () => {
      if (!running) return;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const nx = (rawMouse.current.x - cx) / cx;
      const ny = (rawMouse.current.y - cy) / cy;

      sp.mouseX.setTarget(nx);
      sp.mouseY.setTarget(ny);
      sp.tiltX.setTarget(nx);
      sp.tiltY.setTarget(ny);

      const mx = sp.mouseX.tick();
      const my = sp.mouseY.tick();
      const tx = sp.tiltX.tick();
      const ty = sp.tiltY.tick();

      const idx = activeRef.current;
      const art = artRef.current[idx];
      if (art) {
        art.style.transform = `
          perspective(1000px)
          rotateY(${tx * 12}deg)
          rotateX(${-ty * 8}deg)
          translateX(${mx * 14}px)
          translateY(${my * 10}px)
          scale(1.03)
        `;
        art.style.setProperty("--holo-x", `${(mx + 1) * 50}%`);
        art.style.setProperty("--holo-y", `${(my + 1) * 50}%`);
      }

      const textEl = cardsRef.current[idx]?.querySelector(".feature-card__text");
      if (textEl) {
        textEl.style.transform = `
          perspective(1200px)
          rotateY(${tx * -3}deg)
          rotateX(${-ty * 2}deg)
          translateX(${mx * -6}px)
        `;
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  const onMouseMove = useCallback((e) => {
    rawMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  /* ── Z-tunnel transition between cards ─────────────────── */
  const triggerTunnel = useCallback((fromIdx, toIdx) => {
    const from = cardsRef.current[fromIdx];
    if (from) {
      from.classList.add("tunnel-out");
      setTimeout(() => from.classList.remove("tunnel-out"), 700);
    }
    const to = cardsRef.current[toIdx];
    if (to) {
      to.classList.add("tunnel-in");
      setTimeout(() => to.classList.remove("tunnel-in"), 700);
    }
  }, []);

  /* ── Scroll handler ─────────────────────────────────────── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const N = FEATURES.length;

    const setActive = (idx) => {
      const prev = activeRef.current;
      if (idx === prev) return;
      prevActiveRef.current = prev;
      activeRef.current = idx;

      artRef.current.forEach((art, i) => {
        if (art && i !== idx) {
          art.style.transform = "";
          art.style.removeProperty("--holo-x");
          art.style.removeProperty("--holo-y");
        }
      });
      const textEls = document.querySelectorAll(".feature-card__text");
      textEls.forEach((t, i) => { if (i !== idx) t.style.transform = ""; });

      if (bgGlowRef.current) {
        bgGlowRef.current.style.setProperty("--glow-color", FEATURES[idx]?.accent ?? "#78dcff");
        bgGlowRef.current.style.setProperty("--glow-rgb", FEATURES[idx]?.accentRgb ?? "120,220,255");
      }

      if (prev >= 0) triggerTunnel(prev, idx);

      rollCounter(counterRef.current, prev < 0 ? idx : prev, idx, N);

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        card.classList.remove("is-active", "is-prev", "is-next");
        if      (i === idx) card.classList.add("is-active");
        else if (i < idx)   card.classList.add("is-prev");
        else                card.classList.add("is-next");
      });
    };

    const handleScroll = () => {
      const rect        = section.getBoundingClientRect();
      const scrolled    = -rect.top;
      const scrollRange = section.offsetHeight - window.innerHeight;
      const progress    = Math.max(0, Math.min(1, scrolled / scrollRange));

      if (progressFillRef.current) {
        progressFillRef.current.style.width = `${progress * 100}%`;
      }

      const slot = Math.min(N - 1, Math.floor(progress * N));
      setActive(slot);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [triggerTunnel]);

  return (
    <section
      className="features"
      ref={sectionRef}
      style={{ height: `calc(${FEATURES.length * 100}vh + 100vh)` }}
    >
      <div className="features-sticky">

        {/* depth background glow */}
        <div className="features-bg-glow" ref={bgGlowRef} />

        {/* scan-line overlay */}
        <div className="features-scanlines" aria-hidden="true" />

        {/* vignette */}
        <div className="features-vignette" aria-hidden="true" />

        {/* progress */}
        <div className="features-progress">
          <div className="features-progress__track" />
          <div className="features-progress__fill" ref={progressFillRef} />
        </div>

        {/* counter */}
        <div className="features-counter" ref={counterRef}>01 / 05</div>

        {/* eyebrow */}
        <div className="features-eyebrow">
          <span className="features-eyebrow__text" style={{ display: "inline-block", transform: "translateY(90px)" }}>
  OUR PROGRAMS &amp; EVENTS
</span>
        </div>

        {/* depth fog layers */}
        <div className="features-fog features-fog--near" aria-hidden="true" />
        <div className="features-fog features-fog--far"  aria-hidden="true" />

        {/* card stack */}
        <div className="features-stack">
          {FEATURES.map((f, i) => (
            <article
              key={f.id}
              className={`feature-card feature-card--${i + 1} ${i === 0 ? "is-active" : "is-next"}`}
              ref={(el) => (cardsRef.current[i] = el)}
              style={{ "--accent": f.accent, "--accent-rgb": f.accentRgb }}
            >
              {/* left: text */}
              <div className="feature-card__text">

                <span className="feature-card__tag">
                  {f.tag.split("").map((ch, ci) => (
                    <span key={ci} className="feature-card__tag-char" style={{ "--ci": ci }}>
                      {ch === " " ? "\u00A0" : ch}
                    </span>
                  ))}
                </span>

                <h2 className="feature-card__title">
                  {f.title.split("\n").map((line, li) => (
                    <span key={li} className="feature-card__title-line" style={{ "--li": li }}>
                      {line.split("").map((ch, ci) => (
                        <span
                          key={ci}
                          className="feature-card__title-char"
                          style={{ "--ci": ci, "--llen": line.length }}
                        >
                          {ch === " " ? "\u00A0" : ch}
                        </span>
                      ))}
                    </span>
                  ))}
                </h2>

                <p className="feature-card__desc">{f.desc}</p>

                <div className="feature-card__stat">
                  <div className="feature-card__stat-inner">
                    <span className="feature-card__stat-value">{f.stat.value}</span>
                    <span className="feature-card__stat-label">{f.stat.label}</span>
                  </div>
                  <div className="feature-card__stat-bar" />
                </div>

              </div>

              {/* right: art */}
              <div
                className="feature-card__art-wrap"
                ref={(el) => (artWrapRef.current[i] = el)}
              >
                <div className="feature-card__art-glow" />

                <div className="feature-card__art-frame">
                  <img
                    src={f.art}
                    alt={f.tag}
                    className="feature-card__art"
                    ref={(el) => (artRef.current[i] = el)}
                  />
                  {/* holographic shimmer layer */}
                  <div className="feature-card__holo" aria-hidden="true" />
                  {/* edge glow border */}
                  <div className="feature-card__art-border" />
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}