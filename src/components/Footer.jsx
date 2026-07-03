import { useEffect, useRef } from "react";
import "./Footer.css";

const FOOTER_LINKS = {
  Programs: [
    { label: "Summer Program",     href: "#features" },
    { label: "Young Builder's Lab", href: "#features" },
    { label: "Pitch Please 2.0",   href: "#features" },
    { label: "Dil PIL Events",     href: "#features" },
  ],
  Company: [
    { label: "About PIL",  href: "#about" },
    { label: "Our Team",   href: "#team" },
    { label: "Partners",   href: "#features" },
    { label: "Contact",    href: "#contact" },
  ],
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4" fill="#04060f"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="#04060f"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 001.95-1.97A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#04060f"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const footerRef    = useRef(null);
  const beamRef      = useRef(null);
  const particlesRef = useRef(null);

  /* ── Particle canvas ──────────────────────────────────── */
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;

    const ctx    = canvas.getContext("2d");
    let running  = true;
    let particles = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () => ({
      x:  Math.random() * canvas.width,
      y:  canvas.height + 10,
      r:  Math.random() * 1.2 + 0.3,
      vy: -(Math.random() * 0.4 + 0.15),
      vx: (Math.random() - 0.5) * 0.2,
      o:  Math.random() * 0.5 + 0.1,
      c:  Math.random() > 0.5 ? "120,220,255" : "176,107,255",
    });

    for (let i = 0; i < 30; i++) {
      const p = spawn();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.y += p.vy;
        p.x += p.vx;
        p.o -= 0.0007;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c}, ${Math.max(0, p.o)})`;
        ctx.fill();

        if (p.y < -10 || p.o <= 0) particles[i] = spawn();
      });

      requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    tick();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── Intersection-based entrance ─────────────────────── */
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) footer.classList.add("footer--visible");
      },
      { threshold: 0.1 }
    );

    obs.observe(footer);
    return () => obs.disconnect();
  }, []);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="footer" ref={footerRef} id="contact">

      {/* ── Particle canvas background ── */}
      <canvas className="footer__particles" ref={particlesRef} aria-hidden="true" />

      {/* ── Top beam ── */}
      <div className="footer__top-beam" ref={beamRef} aria-hidden="true">
        <div className="footer__top-beam-line" />
        <div className="footer__top-beam-glow" />
      </div>

      {/* ── Decorative background glows ── */}
      <div className="footer__bg-glow footer__bg-glow--left"  aria-hidden="true" />
      <div className="footer__bg-glow footer__bg-glow--right" aria-hidden="true" />
      <div className="footer__scanlines"                       aria-hidden="true" />

      <div className="footer__inner">

        {/* ══ Brand column ══ */}
        <div className="footer__brand">
          <a href="#home" className="footer__logo" onClick={(e) => handleSmoothScroll(e, "#home")} aria-label="PIL Gaming home">
            <div className="footer__logo-icon">
              <img src="/images/logo.png" alt="PIL Gaming logo" />
            </div>
            <div className="footer__logo-text">
              <span className="footer__logo-main">PIL</span>
              <span className="footer__logo-sub">GAMING</span>
            </div>
          </a>

          <p className="footer__tagline">
            Empowering young minds through play, creativity, and real-world challenges.
          </p>

          {/* Socials */}
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="footer__social"
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="footer__social-icon">{s.icon}</span>
                <span className="footer__social-glow" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Contact badge */}
          <div className="footer__contact">
            <div className="footer__contact-item">
              <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>hello@pilgaming.in</span>
            </div>
            <div className="footer__contact-item">
              <svg className="footer__contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Hyderabad, Telangana</span>
            </div>
          </div>
        </div>

        {/* ══ Link columns ══ */}
        {Object.entries(FOOTER_LINKS).map(([group, links], gi) => (
          <div key={group} className="footer__col" style={{ "--col-delay": `${gi * 0.1 + 0.1}s` }}>
            <h4 className="footer__col-heading">
              <span className="footer__col-heading-accent" aria-hidden="true">// </span>
              {group}
            </h4>
            <ul className="footer__col-links" role="list">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="footer__col-link"
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                  >
                    <span className="footer__col-link-arrow" aria-hidden="true">→</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ══ Newsletter / CTA column ══ */}
        <div className="footer__col footer__col--cta" style={{ "--col-delay": "0.3s" }}>
          <h4 className="footer__col-heading">
            <span className="footer__col-heading-accent" aria-hidden="true">// </span>
            Stay in the Game
          </h4>
          <p className="footer__newsletter-desc">
            Get updates on upcoming events, programs, and PIL community news.
          </p>
          <div className="footer__newsletter">
            <input
              type="email"
              className="footer__newsletter-input"
              placeholder="your@email.com"
              aria-label="Email address"
            />
            <button className="footer__newsletter-btn" aria-label="Subscribe">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M3 10h14M10 3l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="footer__newsletter-btn-glow" aria-hidden="true" />
            </button>
          </div>

          {/* Event highlight badge */}
          <div className="footer__event-badge">
            <span className="footer__event-badge-dot" aria-hidden="true" />
            <div>
              <span className="footer__event-badge-label">Next Event</span>
              <span className="footer__event-badge-title">Dil PIL — Sep 27, 3:00 PM</span>
              <span className="footer__event-badge-venue">Buffalo Wild Wings, Jubilee Hills</span>
            </div>
          </div>
        </div>

      </div>

      {/* ══ Bottom bar ══ */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <div className="footer__bottom-divider" aria-hidden="true" />
          <div className="footer__bottom-content">
            <p className="footer__copyright">
              © {new Date().getFullYear()} PIL Gaming. All rights reserved.
            </p>
            <p className="footer__copyright">
              Designed & Developed by Pixel Horse.
            </p>
            <div className="footer__bottom-links">
              <a href="#" className="footer__bottom-link">Privacy Policy</a>
              <span className="footer__bottom-sep" aria-hidden="true">·</span>
              <a href="#" className="footer__bottom-link">Terms of Use</a>
            </div>
            <p className="footer__made-with">
              Built in{" "}
              <span className="footer__made-accent">Hyderabad</span>
              {" "}with ♥
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}