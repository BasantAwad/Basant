import React from 'react';
import { personal } from '../data/personal';
import './Contact.css';

export const ContactSection: React.FC = () => {
  const mailto = `mailto:${personal.email}`;

  return (
    <section id="contact" className="contact">
      <div className="contact__inner container--narrow">

        <h2 className="contact__heading">Contact</h2>

        <p className="contact__invitation">
          I am open to backend engineering opportunities that involve scalable systems,
          distributed architecture, cloud infrastructure, machine learning integration, and
          thoughtful engineering culture. If you would like to collaborate, discuss a role,
          or review one of the projects in this archive, please reach out.
        </p>

        {/* Final bloom */}
        <div className="contact__bloom" aria-hidden="true">
          <div className="contact__bloom-flower" />
        </div>

        {/* Contact card */}
        <div className="contact__card">
          <div className="contact__identity">
            <span className="contact__name">{personal.name}</span>
            <span className="contact__title">Backend Software Engineer</span>
            <span className="coordinates">{personal.location} · {personal.availability}</span>
          </div>

          <ul className="contact__links">
            <li className="contact__link-item">
              <a href={mailto} className="contact__link contact__link--email">
                <span className="contact__link-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7 L12 13 L21 7" />
                  </svg>
                </span>
                <span>{personal.email}</span>
              </a>
            </li>
            <li className="contact__link-item">
              <a
                  href={personal.linkedin}
                  className="contact__link contact__link--linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="contact__link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-5h2v5zm-2-4H7v4h2V14zm6 8H7v-5h2v5zm-2-4H7V9h2v5zm6 8h-2v-5h2v5zm-2-4h-2V9h2v5z" />
                    </svg>
                  </span>
                  <span className="contact__link-text">LinkedIn</span>
                  <span className="specimen-label contact__link-hint">basantabdalla</span>
                </a>
            </li>
            <li className="contact__link-item">
              <a
                href={personal.github}
                className="contact__link contact__link--github"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact__link-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.975 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.36.81 1.095.81 2.235 0 1.635-.015 2.88-.015 3.3 0 .315.225.682.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </span>
                <span className="contact__link-text">GitHub</span>
                <span className="specimen-label contact__link-hint">BasantAwad</span>
              </a>
            </li>
            <li className="contact__link-item">
              <a
                href={personal.instagram}
                className="contact__link contact__link--instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact__link-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </span>
                <span>Instagram</span>
              </a>
            </li>
          </ul>

          <div className="contact__secondary">
            <span className="contact__secondary-label">Direct line</span>
            <a href={`tel:${personal.phone}`} className="contact__phone">
              {personal.phone}
            </a>
          </div>
        </div>

        <p className="contact__closing">
          A brief message is always welcome. Every good system starts with a clear signal.
        </p>
      </div>
    </section>
  );
};
