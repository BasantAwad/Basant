import React from 'react';
import { personal } from '../data/personal';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner container--narrow">
        <div className="site-footer__brand">
          <span className="site-footer__mark" aria-hidden="true">{'✦'}</span>
          <span className="site-footer__brand-name">Basant Awad Mohamed</span>
        </div>


        <p className="site-footer__meta">
          Software Engineer · Alexandria, Egypt · Open to relocation
        </p>

        <div className="site-footer__links">
          <a href={personal.linkedin} className="site-footer__link" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={personal.github} className="site-footer__link" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={`mailto:${personal.email}`} className="site-footer__link">
            Email
          </a>
        </div>

        <p className="site-footer__legal">
          © {new Date().getFullYear()} Basant Awad Mohamed. Built with care.
        </p>
      </div>
    </footer>
  );
};
