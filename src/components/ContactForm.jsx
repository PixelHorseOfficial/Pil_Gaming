import { useEffect, useRef, useState } from "react";
import "./ContactForm.css";

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Program Enrollment",
  "Partnership",
  "Press / Media",
];

const INITIAL_STATE = {
  name: "",
  email: "",
  phone: "",
  subject: SUBJECT_OPTIONS[0],
  message: "",
};

const SOCIALS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4" fill="#0c0405"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="#0c0405"/>
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
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02" fill="#0c0405"/>
      </svg>
    ),
  },
];

export default function ContactForm() {
  const sectionRef = useRef(null);
  const [fields, setFields] = useState(INITIAL_STATE);
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [errors, setErrors] = useState({});

  /* ── Entrance animation on scroll into view ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) section.classList.add("contact-form--visible");
      },
      { threshold: 0.15 }
    );

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const next = {};
    if (!fields.name.trim()) next.name = "Tell us your name.";
    if (!fields.email.trim()) {
      next.email = "Tell us your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = "That email doesn't look right.";
    }
    if (!fields.message.trim()) next.message = "Add a short message.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    // Replace with real submission logic (API call / form service)
    setTimeout(() => {
      setStatus("sent");
      setFields(INITIAL_STATE);
      setTimeout(() => setStatus("idle"), 4000);
    }, 1400);
  };

  const isFieldFilled = (key) => fields[key] && fields[key].length > 0;

  return (
    <section className="contact-form" ref={sectionRef}>
      <div className="contact-form__glow contact-form__glow--a" aria-hidden="true" />
      <div className="team-header">
            <span className="features-eyebrow__text" style={{ display: "inline-block", transform: "translateY(50px)" }}>
  Book Now
</span>
          </div>
      <div className="contact-form__glow contact-form__glow--b" aria-hidden="true" />
      <div className="contact-form__scanlines" aria-hidden="true" />

      <div className="contact-form__layout">

        {/* ══ Side panel: contact info + socials ══ */}
        <aside className="contact-form__side">
          <span className="contact-form__eyebrow">
            <span className="contact-form__eyebrow-dot" aria-hidden="true" />
            Get in Touch
          </span>
          <h2 className="contact-form__title">Let's Talk</h2>
          <p className="contact-form__subtitle">
            Questions about a program, a partnership idea, or just want to say hi —
            reach out any way that's easiest for you.
          </p>

          <ul className="contact-form__info-list">
            <li className="contact-form__info-item">
              <span className="contact-form__info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <span className="contact-form__info-label">Email</span>
                <span className="contact-form__info-value">hello@pilgaming.in</span>
              </div>
            </li>
            <li className="contact-form__info-item">
              <span className="contact-form__info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M2.25 6.75c0 8.284 6.716 15 15 15h.75a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.125 1.125 0 00-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97a1.125 1.125 0 00.418-1.173L5.963 3.102a1.125 1.125 0 00-1.091-.852H3.5A2.25 2.25 0 001.25 4.5v.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <span className="contact-form__info-label">Phone</span>
                <span className="contact-form__info-value">+91 90000 00000</span>
              </div>
            </li>
            <li className="contact-form__info-item">
              <span className="contact-form__info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <div>
                <span className="contact-form__info-label">Location</span>
                <span className="contact-form__info-value">Hyderabad, Telangana</span>
              </div>
            </li>
          </ul>

          <div className="contact-form__side-divider" aria-hidden="true" />

          <div className="contact-form__socials-block">
            <span className="contact-form__socials-label">Follow Along</span>
            <div className="contact-form__socials">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="contact-form__social"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact-form__social-icon">{s.icon}</span>
                  <span className="contact-form__social-glow" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* ══ Form card ══ */}
        <div className="contact-form__inner">
          <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row">
              <div
                className={`contact-form__field ${focusedField === "name" ? "contact-form__field--focused" : ""} ${isFieldFilled("name") ? "contact-form__field--filled" : ""} ${errors.name ? "contact-form__field--error" : ""}`}
              >
                <label htmlFor="cf-name" className="contact-form__label">Name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  className="contact-form__field-input"
                  value={fields.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="name"
                  placeholder="Your name"
                />
                <span className="contact-form__field-line" aria-hidden="true" />
                {errors.name && <span className="contact-form__error">{errors.name}</span>}
              </div>

              <div
                className={`contact-form__field ${focusedField === "email" ? "contact-form__field--focused" : ""} ${isFieldFilled("email") ? "contact-form__field--filled" : ""} ${errors.email ? "contact-form__field--error" : ""}`}
              >
                <label htmlFor="cf-email" className="contact-form__label">Email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  className="contact-form__field-input"
                  value={fields.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                <span className="contact-form__field-line" aria-hidden="true" />
                {errors.email && <span className="contact-form__error">{errors.email}</span>}
              </div>
            </div>

            <div className="contact-form__row">
              <div
                className={`contact-form__field ${focusedField === "phone" ? "contact-form__field--focused" : ""} ${isFieldFilled("phone") ? "contact-form__field--filled" : ""}`}
              >
                <label htmlFor="cf-phone" className="contact-form__label">
                  Phone <span className="contact-form__optional">(optional)</span>
                </label>
                <input
                  id="cf-phone"
                  name="phone"
                  type="tel"
                  className="contact-form__field-input"
                  value={fields.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="tel"
                  placeholder="+91 00000 00000"
                />
                <span className="contact-form__field-line" aria-hidden="true" />
              </div>

              <div
                className={`contact-form__field ${focusedField === "subject" ? "contact-form__field--focused" : ""} contact-form__field--filled`}
              >
                <label htmlFor="cf-subject" className="contact-form__label">Event</label>
                <select
                  id="cf-subject"
                  name="subject"
                  className="contact-form__field-input contact-form__select"
                  value={fields.subject}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                >
                  {SUBJECT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <span className="contact-form__select-arrow" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M5 7.5L10 12.5L15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="contact-form__field-line" aria-hidden="true" />
              </div>
            </div>

            <div
              className={`contact-form__field ${focusedField === "message" ? "contact-form__field--focused" : ""} ${isFieldFilled("message") ? "contact-form__field--filled" : ""} ${errors.message ? "contact-form__field--error" : ""}`}
            >
              <label htmlFor="cf-message" className="contact-form__label">Message</label>
              <textarea
                id="cf-message"
                name="message"
                className="contact-form__field-input contact-form__textarea"
                rows={5}
                value={fields.message}
                onChange={handleChange}
                onFocus={() => setFocusedField("message")}
                onBlur={() => setFocusedField(null)}
                placeholder="Tell us what's on your mind..."
              />
              <span className="contact-form__field-line" aria-hidden="true" />
              {errors.message && <span className="contact-form__error">{errors.message}</span>}
            </div>

            <div className="contact-form__footer">
              <button
                type="submit"
                className={`contact-form__submit ${status === "sending" ? "contact-form__submit--sending" : ""} ${status === "sent" ? "contact-form__submit--sent" : ""}`}
                disabled={status !== "idle"}
              >
                <span className="contact-form__submit-glow" aria-hidden="true" />
                <span className="contact-form__submit-shine" aria-hidden="true" />
                <span className="contact-form__submit-content">
                  {status === "idle" && (
                    <>
                      Send Message
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M3 10h14M10 3l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                  {status === "sending" && (
                    <>
                      <span className="contact-form__spinner" aria-hidden="true" />
                      Sending
                    </>
                  )}
                  {status === "sent" && (
                    <>
                      Message Sent
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M4 10.5L8 14.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </span>
              </button>

              {status === "sent" && (
                <p className="contact-form__success-note" role="status">
                  Thanks for reaching out — we'll reply within 1–2 business days.
                </p>
              )}
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}