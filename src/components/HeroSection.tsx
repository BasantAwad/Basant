import React from 'react';
import { personal } from '../data/personal';
import './Hero.css';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="hero"
      aria-label="Introduction"
    >
      {/* Content layer */}
      <div className="hero__content container--narrow">
        <div className="hero__label-bar">
          <span className="specimen-label">Specimen NB-000 · Field record</span>
          <span className="coordinates">Alexandria, Egypt · 31.2001° N, 29.9187° E</span>
        </div>

        <div className="hero__identity">
          <p className="hero__title-lead">
            Backend Software Engineer
          </p>
          <h1 className="hero__name">
            {personal.name}
          </h1>
          <p className="hero__tagline">
            {personal.tagline}
          </p>
        </div>

        <p className="hero__intro">
          Basant designs reliable systems that connect data, intelligence, and people.
          A backend engineer working across scalable architectures, AI-integrated products,
          distributed systems, and cloud infrastructure — with the patience of someone who
          understands that good systems grow slowly, from strong foundations.
        </p>

        <div className="hero__meta-row">
          <span className="hero__meta-item">
            <span className="specimen-number">{'✦'}</span>
            {personal.location}
          </span>
          <span className="hero__meta-item hero__meta-item--available">
            <span className="specimen-number">{'→'}</span>
            {personal.availability}
          </span>
        </div>

        <div className="hero__actions">
          <a href="#projects" className="btn btn--primary">
            View selected work
          </a>
          <a href="#contact" className="btn btn--ghost">
            Connect with me
          </a>
        </div>

        <p className="hero__scroll-cue">
          <span className="specimen-label">Scroll to enter the garden</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </p>
      </div>

      {/* Data-link anchor — offset so the hero fills first viewport */}
      <a href="#home" className="sr-only" tabIndex={-1}>
        Skip to top
      </a>
    </section>
  );
};
