import { useEffect, useRef, useState, useCallback } from "react";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Home",     href: "#home" },
  { label: "About",    href: "#about" },
  { label: "Programs", href: "#features" },
  { label: "Team",     href: "#team" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const navRef        = useRef(null);
  const logoRef       = useRef(null);
  const linksRef      = useRef([]);
  const burgerRef     = useRef(null);
  const mobileMenuRef = useRef(null);

  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  /* ── scroll-aware state ─────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close menu on resize to desktop ───────────────── */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ── lock body scroll when menu open ───────────────── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* ── smooth scroll on nav click ────────────────────── */
  const handleNavClick = useCallback((e, idx) => {
    e.preventDefault();
    setActiveIdx(idx);
    setMenuOpen(false);
    const href    = NAV_LINKS[idx].href;
    const target  = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${menuOpen ? "navbar--menu-open" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* ── background layers ── */}
        <div className="navbar__bg"     aria-hidden="true" />
        <div className="navbar__glow"   aria-hidden="true" />
        <div className="navbar__scanlines" aria-hidden="true" />

        {/* ── bottom border beam ── */}
        <div className="navbar__border-beam" aria-hidden="true" />

        <div className="navbar__inner">

          {/* Logo */}
          <a href="#home" className="navbar__logo" ref={logoRef} aria-label="PIL Gaming home">
            <img
              src="/images/logo.png"
              alt="PIL Gaming"
              className="navbar__logo-img"
            />
          </a>

          {/* Desktop links */}
          <ul className="navbar__links" role="list">
            {NAV_LINKS.map((link, i) => (
              <li key={link.label} className="navbar__item">
                <a
                  href={link.href}
                  ref={(el) => (linksRef.current[i] = el)}
                  className={`navbar__link ${i === activeIdx ? "navbar__link--active" : ""}`}
                  onClick={(e) => handleNavClick(e, i)}
                  aria-current={i === activeIdx ? "page" : undefined}
                >
                  <span className="navbar__link-text">{link.label}</span>
                  <span className="navbar__link-dot" aria-hidden="true" />
                  <span className="navbar__link-underline" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          {/* CTA button */}
          <a href="#contact" className="navbar__cta" onClick={(e) => handleNavClick(e, 4)}>
            <span className="navbar__cta-text">Join Now</span>
            <span className="navbar__cta-glow" aria-hidden="true" />
            <svg className="navbar__cta-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Burger */}
          <button
            ref={burgerRef}
            className={`navbar__burger ${menuOpen ? "navbar__burger--open" : ""}`}
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="navbar__burger-line" aria-hidden="true" />
            <span className="navbar__burger-line" aria-hidden="true" />
            <span className="navbar__burger-line" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="mobile-menu__bg"       aria-hidden="true" />
        <div className="mobile-menu__scanlines" aria-hidden="true" />
        <div className="mobile-menu__glow"      aria-hidden="true" />

        <ul className="mobile-menu__links" role="list">
          {NAV_LINKS.map((link, i) => (
            <li key={link.label} className="mobile-menu__item" style={{ "--i": i }}>
              <a
                href={link.href}
                className={`mobile-menu__link ${i === activeIdx ? "mobile-menu__link--active" : ""}`}
                onClick={(e) => handleNavClick(e, i)}
                tabIndex={menuOpen ? 0 : -1}
              >
                <span className="mobile-menu__link-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
                <span className="mobile-menu__link-arrow" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-menu__footer">
          <a href="#contact" className="mobile-menu__cta" tabIndex={menuOpen ? 0 : -1} onClick={(e) => handleNavClick(e, 4)}>
            Join Now
          </a>
        </div>
      </div>

      {/* ── Mobile overlay backdrop ── */}
      {menuOpen && (
        <div
          className="mobile-menu__overlay"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}