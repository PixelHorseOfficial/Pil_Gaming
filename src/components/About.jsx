import React from "react";
import "./About.css";

const About = () => {
  return (
    <section className="about">
      <div className="about__container">
        {/* Decorative ornament with title centered between the two dot groups */}
        <div className="about__ornament">
          <div className="about__ornament-side">
            <div className="about__line"></div>
            <div className="about__dot"></div>
            <div className="about__dot about__dot--primary"></div>
          </div>

          <h2 className="about__title">About</h2>

          <div className="about__ornament-side">
            <div className="about__dot about__dot--primary"></div>
            <div className="about__dot"></div>
            <div className="about__line"></div>
          </div>
        </div>

        {/* Content */}
        <div className="about__content">
          <p className="about__text">
            PIL Gaming is a unique learning and engagement platform designed to help children explore, create, and grow beyond traditional education. Through interactive events, entrepreneurship programs, life-skills workshops, and exciting mystery-box experiences, we empower young minds to develop confidence, creativity, communication, and problem-solving abilities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;