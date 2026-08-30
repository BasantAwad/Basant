import React, { useState, useEffect, useRef, useCallback } from 'react';
import { navigation } from '../data/personal';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const [active, setActive] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return navigation.find((n) => n.id === hash)?.id ?? 'home';
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Scroll listener to update active + show/hide nav
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      // Determine active via IntersectionObserver instead for robustness
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // IntersectionObserver for active section
  useEffect(() => {
    const ids = navigation.map((n) => n.id).filter(Boolean);
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry most in view
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const top = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          const id = top.target.id;
          if (id) setActive(id);
        }
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: 0,
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const on = () => setMenuOpen(false);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  // Keyboard: Escape closes menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = useCallback(
    (id: string) => {
      setActive(id);
      setMenuOpen(false);
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      } else {
        window.location.hash = id;
      }
    },
    []
  );

  return (
    <>
      <header className={`navigation${scrolled ? ' navigation--scrolled' : ''}`}>
        <div className="navigation__inner container">
          <a href="#home" className="navigation__brand" aria-label="Basant Awad Mohamed — home">
            <span className="navigation__brand-mark" aria-hidden="true">{'✦'}</span>
            <span className="navigation__brand-name">Basant Awad Mohamed</span>
          </a>

          <nav className="navigation__links" aria-label="Primary">
            {navigation.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className={`navigation__link${active === n.id ? ' navigation__link--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(n.id);
                }}
                aria-current={active === n.id ? 'page' : undefined}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <button
            className="navigation__menu-btn"
            ref={buttonRef}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="navigation__menu-icon" aria-hidden="true">
              {menuOpen ? (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M6 6 L18 18 M6 18 L18 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <path d="M4 6 L20 6 M4 12 L20 12 M4 18 L20 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu${menuOpen ? ' mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
      >
        <nav className="mobile-menu__links" aria-label="Mobile">
          {navigation.map((n, i) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className={`mobile-menu__link${active === n.id ? ' mobile-menu__link--active' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(n.id);
              }}
              aria-current={active === n.id ? 'page' : undefined}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__footer container--narrow">
          <span className="specimen-label">Nocturne Botanica · Field specimen NB-000</span>
          <span className="coordinates" style={{ display: 'block', marginTop: '0.25rem' }}>
            Alexandria, Egypt · 31.2001° N, 29.9187° E
          </span>
        </div>
      </div>
    </>
  );
};
