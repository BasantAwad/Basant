import React, { useEffect, useRef } from 'react';
import { personal } from '../data/personal';
import './About.css';

export const AboutSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add('about--visible');
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="about">
      <div className="container--narrow about__inner" ref={containerRef as React.RefObject<HTMLDivElement>}>
        <span className="specimen-label">Field annotation · Section II</span>
        <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
          Roots · engineering principles and foundations
        </span>

        <h2 className="about__heading">
          About
        </h2>

        <div className="about__grid">
          <div className="about__copy">
            <p className="about__lede">
              Basant is a Backend Software Engineer and final-year Computer Science student
              specializing in Software Engineering. She builds systems that need to behave
              predictably under load, across services, and over time.
            </p>

            <p>
              Her work lives in the space between data and delivery: REST APIs and microservices,
              distributed data systems, cloud infrastructure, and AI-integrated products. She is
              comfortable designing the backbone of an application — authentication, rate limiting,
              message routing, persistence, observability — and then connecting those pieces so a
              product can actually move.
            </p>

            <p>
              The engineering she values most is unglamorous in the best way: clean architecture,
              SOLID principles, design patterns, data structures, algorithms, and system design.
              These are not badges. They are the habits that keep a codebase legible when it grows
              and a team can still move.
            </p>

            <blockquote className="about__quote">
              “A reliable backend is not a trick. It is a discipline applied repeatedly:
              small interfaces, explicit contracts, careful state, and respect for failure.”
            </blockquote>

            <p className="about__interest-heading">Engineering interests</p>
            <ul className="about__interests">
              {personal.interests.map((item) => (
                <li key={item} className="about__interest">
                  <span className="about__interest-mark" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="about__sidebar" aria-label="Field notes">
            <div className="field-card">
              <span className="specimen-number">NB-001</span>
              <h4 className="field-card__title">Foundations</h4>
              <p className="field-card__body">
                Data structures, algorithms, system design, distributed systems, clean architecture,
                SOLID principles, design patterns, software engineering best practices.
              </p>
              <span className="coordinates">Substrate · deep root system</span>
            </div>

            <div className="field-card">
              <span className="specimen-number">NB-002</span>
              <h4 className="field-card__title">Core stack</h4>
              <p className="field-card__body">
                Python, Java, Node.js, Django, PostgreSQL, Apache Kafka, and related technologies
                for distributed data systems and scalable backend architecture.
              </p>
              <span className="coordinates">Stem · connecting disciplines</span>
            </div>

            <div className="field-card">
              <span className="specimen-number">NB-003</span>
              <h4 className="field-card__title">Beyond code</h4>
              <p className="field-card__body">
                Teaching and mentoring, cloud infrastructure, machine learning, DevOps, real-time
                communication, and AI-integrated products.
              </p>
              <span className="coordinates">Branch · cross-disciplinary growth</span>
            </div>

            <div className="field-card field-card--specimen">
              <span className="specimen-number">NB-000</span>
              <h4 className="field-card__title">Cultivation note</h4>
              <p className="field-card__body">
                This portfolio is a living document. Projects, capabilities, and contact details
                live in data files so the site can be updated without rewriting the experience.
              </p>
            </div>
          </aside>
        </div>

        <div className="about__footer-meta">
          <span className="specimen-label">Document ID · BA-2026-A01</span>
          <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
            Last reviewed · 30 August 2026
          </span>
        </div>
      </div>
    </section>
  );
};
