import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Team.css";

gsap.registerPlugin(ScrollTrigger);

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Ashrith Munikuntla",
    role: "Founder & CEO",
    bio: "Built a FAMS product for 6 State Governments and somehow convinced them all to use it (yes, even the stubborn ones). Then led R&D at a fintech firm to help RBI prototype its CBDC wallet, before Web3 bros made it a buzzword.",
    image: "/images/t1.png",
    accent: "#ff1493",
    accentRgb: "255, 20, 147",
  },
  {
    id: 2,
    name: "Pavani Lakshmi",
    role: "Head of curriculum ",
    bio: "After 1 year of calming tantrums in behavioural therapy rooms, Pavani has turned to sparking conversations in classrooms. With a background in Clinical Psychology and behavioural science, she makes mental health feel less like theory and more like play.",
    image: "/images/t2.png",
    accent: "#00d4ff",
    accentRgb: "0, 212, 255",
  },
  {
    id: 3,
    name: "Divya Pranathi",
    role: "Head of strategy ",
    bio: "Someone who’s been there done it all and always looking for more, an ex-banker and a forever learner who thrives in swimming against the current while simultaneously baking pancakes and throwing dumbbells around.",
    image: "/images/t3.png",
    accent: "#ff6b2b",
    accentRgb: "255, 107, 43",
  },
  {
    id: 4,
    name: "Mohit Munikuntla",
    role: "CTO",
    bio: "Has 9+ years of experience building serious AI things - the kind that sound scary until he casually explains it over chai. Current, AI Lead at a US-based startup where he made machines smarter than most meetings.",
    image: "/images/t4.png",
    accent: "#ffa500",
    accentRgb: "255, 165, 0",
  },
];

export default function Team() {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const galleryRef = useRef(null);
  const cardRefs = useRef([]);
  const infoPanelRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;
    const cards = cardRefs.current;
    const infoPanel = infoPanelRef.current;

    if (!section || !gallery || !infoPanel) return;

    gsap.set(cards, {
      x: 120,
      opacity: 0,
      scale: 0.82,
      rotateY: 20,
      filter: "grayscale(0.6)",
    });

    gsap.set(infoPanel, { x: -60, opacity: 0 });

    const totalSteps = TEAM_MEMBERS.length;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${totalSteps * 100}%`,
        scrub: 0.6,
        pin: stickyRef.current,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            totalSteps - 1,
            Math.floor(self.progress * totalSteps)
          );
          setActiveIndex(idx);
        },
      },
    });

    cards.forEach((card, i) => {
      const stepStart = i / totalSteps;
      const stepEnd = (i + 0.6) / totalSteps;

      tl.to(
        card,
        {
          x: 0,
          opacity: 1,
          scale: 1,
          rotateY: 0,
          filter: "grayscale(0)",
          duration: stepEnd - stepStart,
          ease: "power3.out",
        },
        stepStart
      );

      if (i > 0) {
        for (let j = 0; j < i; j++) {
          tl.to(
            cards[j],
            {
              scale: 0.82 - j * 0.03,
              opacity: 0.45 - j * 0.05,
              filter: "grayscale(0.5)",
              duration: stepEnd - stepStart,
              ease: "power3.out",
            },
            stepStart
          );
        }
      }
    });

    tl.to(
      infoPanel,
      { x: 0, opacity: 1, duration: 0.3 / totalSteps, ease: "power2.out" },
      0
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  useEffect(() => {
    const infoContent = infoPanelRef.current?.querySelector(".team-info-content");
    if (!infoContent) return;
    gsap.fromTo(
      infoContent.querySelectorAll(
        ".team-info__badge, .team-info__name, .team-info__role, .team-info__bio, .team-info__divider, .team-info__socials"
      ),
      { y: 18, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.07,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      }
    );
  }, [activeIndex]);

  const member = TEAM_MEMBERS[activeIndex];

  return (
    <section className="team" ref={sectionRef}>
      <div className="team-sticky" ref={stickyRef}>

        {/* Background glow */}
        <div
          className="team-bg-glow"
          style={{ "--accent-rgb": member.accentRgb }}
        />
        <div className="team-scanlines" aria-hidden="true" />
        <div className="team-vignette" aria-hidden="true" />

        {/* Header */}
        <div className="team-header">
          <span className="features-eyebrow__text" style={{ display: "inline-block", transform: "translateY(90px)" }}>
  Meet Our Team
</span>
        </div>

        {/* Main layout */}
        <div className="team-layout">

          {/* Info Panel */}
          <div
            className="team-info-panel"
            ref={infoPanelRef}
            style={{
              "--accent-color": member.accent,
              "--accent-rgb": member.accentRgb,
            }}
          >
            <div className="team-info-content">
              <div className="team-info__header">
                <div className="team-info__badge">
                  {String(activeIndex + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="team-info__name">{member.name}</h3>
                  <p className="team-info__role">{member.role}</p>
                </div>
              </div>

              <p className="team-info__bio">{member.bio}</p>

              <div className="team-info__divider" />

              <div className="team-info__socials">
                <a href="#" className="team-info__social-link" title="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 10 0 10-5.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0123 3z" />
                  </svg>
                </a>
                <a href="#" className="team-info__social-link" title="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="#" className="team-info__social-link" title="Instagram">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="3" fill="#04060f" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="#04060f" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Card Gallery */}
          <div className="team-gallery" ref={galleryRef}>
            {TEAM_MEMBERS.map((m, i) => (
              <article
                key={m.id}
                className={`team-card ${i === activeIndex ? "is-active" : ""}`}
                ref={(el) => (cardRefs.current[i] = el)}
                style={{ "--accent-color": m.accent, "--accent-rgb": m.accentRgb }}
              >
                <div className="team-card__frame">
                  <div className="team-card__glow" />
                  <img src={m.image} alt={m.name} className="team-card__image" />
                  <div className="team-card__border" />
                  <div className="team-card__beam" />
                </div>
                <div className="team-card__label">
                  <span className="team-card__label-name">{m.name}</span>
                  <span className="team-card__label-role">{m.role}</span>
                  <div className="team-card__label-glow" />
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="team-progress" aria-label="Team member navigation">
          {TEAM_MEMBERS.map((_, i) => (
            <div
              key={i}
              className={`team-progress__dot ${i === activeIndex ? "is-active" : ""}`}
              style={i === activeIndex ? { "--dot-accent": member.accent } : {}}
            />
          ))}
        </div>
      </div>

      {/* Scroll space */}
      
    </section>
  );
}