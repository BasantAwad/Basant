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

        <div className="hero__identity">
          <p className="hero__title-lead">
            Software Engineer
          </p>
          <h1 className="hero__name">
            {personal.name}
          </h1>
          <p className="hero__tagline">
            {personal.tagline}
          </p>
        </div>

        <p className="hero__intro">
          I build across the full stack — backend systems, AI-powered products, mobile apps,
          and hardware prototypes. I specialize in backend architecture, but I'm flexible with
          any technology. If it needs to be built, I'll figure it out and ship it.
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
          <a
            href={personal.cvUrl}
            className="btn btn--ghost"
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download CV
          </a>
        </div>

        <p className="hero__scroll-cue">
          <span className="specimen-label">Scroll to explore</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </p>
      </div>

      {/* Data-link anchor — offset so the hero fills first viewport */}
      <a href="#home" className="visually-hidden" tabIndex={-1}>
        Skip to top
      </a>
    </section>
  );
};
