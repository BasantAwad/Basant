import React, { useState, useEffect, useRef, useCallback } from 'react';
import { newsItems } from '../data/news';
import './News.css';

/* ── constants ────────────────────────────────────────────────────────────── */
const STEP   = 195;   // horizontal px between card centres
const MAX_SIDE = 4;   // how many cards shown each side of centre

/* per-slot visual params [index 0 = centre, 1 = ±1 away, …] */
const SLOTS = [
  { ry: 0,  scale: 1.00, opacity: 1.00 },
  { ry: 30, scale: 0.87, opacity: 0.85 },
  { ry: 44, scale: 0.75, opacity: 0.65 },
  { ry: 54, scale: 0.64, opacity: 0.42 },
  { ry: 60, scale: 0.55, opacity: 0.22 },
];

function circularOffset(index: number, active: number, total: number): number {
  let d = ((index - active) % total + total) % total;
  if (d > total / 2) d -= total;
  return d;          // range: -(total-1)/2 … +(total-1)/2
}

function cardStyle(index: number, active: number, total: number) {
  const d   = circularOffset(index, active, total);
  const abs = Math.abs(d);
  const s   = Math.sign(d) || 1;

  if (abs > MAX_SIDE) {
    return {
      transform: `translateX(calc(-50% + ${d * STEP}px)) scale(0.4)`,
      opacity:   0,
      zIndex:    0,
      pointerEvents: 'none' as const,
      cursor: 'default' as const,
    };
  }

  const slot = SLOTS[Math.min(abs, SLOTS.length - 1)];
  return {
    transform: `translateX(calc(-50% + ${d * STEP}px)) rotateY(${s * slot.ry}deg) scale(${slot.scale})`,
    opacity:   slot.opacity,
    zIndex:    20 - abs * 4,
    pointerEvents: 'auto' as const,
    cursor:    abs > 0 ? 'pointer' : 'default',
  };
}

/* ── LinkedInIcon ─────────────────────────────────────────────────────────── */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ── component ────────────────────────────────────────────────────────────── */
export const NewsSection: React.FC = () => {
  const [active, setActive]   = useState(0);
  const [paused, setPaused]   = useState(false);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchX   = useRef<number | null>(null);
  const total    = newsItems.length;

  const triggerAnimation = useCallback((index: number) => {
    setAnimatingIndex(index);
    setAnimKey(Date.now());
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => {
      setAnimatingIndex(null);
    }, 2200); // GIF duration is 2.2s
  }, []);

  const advance = useCallback((dir: 1 | -1) => {
    setActive(prev => {
      const next = ((prev + dir) % total + total) % total;
      triggerAnimation(next);
      return next;
    });
  }, [total, triggerAnimation]);

  /* auto-advance */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => advance(1), 5500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, advance]);

  /* touch swipe */
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(delta) > 40) {
        advance(delta < 0 ? 1 : -1);
        setPaused(true);
    }
    touchX.current = null;
  };

  const activeItem = newsItems[active];

  return (
    <section
      id="news"
      className="news"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-labelledby="news-heading"
    >
      {/* ── Header ── */}
      <div className="news__header container--narrow">
        <span className="specimen-label">LinkedIn · In the press</span>
        <h2 className="news__heading" id="news-heading">News &amp; highlights</h2>
        <p className="news__intro">
          Selected moments, recognition, and milestones shared across the community.
        </p>
      </div>

      {/* ── Fan stage ── */}
      <div
        className="news__stage"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="region"
        aria-label="News fan carousel"
      >
        {/* Arrow — left */}
        <button
          className="news__arrow news__arrow--left"
          aria-label="Previous"
          onClick={() => { advance(-1); setPaused(true); }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Cards */}
        <div className="news__track">
          {newsItems.map((item, i) => {
            const style = cardStyle(i, active, total);
            const isCenter = i === active;
            const isAnimating = i === animatingIndex;
            return (
              <div
                key={item.id}
                className={`news-fan-card${isCenter ? ' news-fan-card--active' : ''}`}
                style={style}
                onClick={() => { 
                  if (!isCenter) { 
                    setActive(i); 
                    triggerAnimation(i); 
                    setPaused(true); 
                  } 
                }}
                aria-hidden={!isCenter}
              >
                {/* Visual card — Flower blooming GIF */}
                <div
                  className="news-fan-card__visual"
                  style={{
                    '--card-glow': item.glow,
                  } as React.CSSProperties}
                >
                  <img 
                    src={
                      !isCenter 
                        ? `${import.meta.env.BASE_URL}flowers/blooming_static.png` 
                        : isAnimating 
                          ? `${import.meta.env.BASE_URL}flowers/blooming.gif?t=${animKey}` 
                          : `${import.meta.env.BASE_URL}flowers/blooming_fully.png`
                    } 
                    alt="Blooming flower" 
                    className="news-fan-card__flower"
                  />

                  {/* Glow orb */}
                  <div
                    className="news-fan-card__orb"
                    style={{ background: item.glow }}
                    aria-hidden="true"
                  />
                </div>

                {/* Caption below the visual */}
                <div className="news-fan-card__caption">
                  <span className="news-fan-card__num">#{String(i + 1).padStart(2, '0')}</span>
                  <span className="news-fan-card__cap-label">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrow — right */}
        <button
          className="news__arrow news__arrow--right"
          aria-label="Next"
          onClick={() => { advance(1); setPaused(true); }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Detail panel (active card info) ── */}
      <div className="news__detail container--narrow" key={activeItem.id}>
        <div className="news__detail-inner">
          <h3 className="news__detail-title">{activeItem.title}</h3>
          <p className="news__detail-excerpt">{activeItem.excerpt}</p>
          <div className="news__detail-footer">
            <div className="news__detail-author-block">
              <span className="news__detail-author">{activeItem.author}</span>
              <span className="news__detail-date">{activeItem.date}</span>
            </div>
            <a
              href={activeItem.url}
              className="news__detail-cta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View post: ${activeItem.title}`}
            >
              <LinkedInIcon />
              View post
            </a>
          </div>
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="news__dots" role="tablist" aria-label="News slides">
        {newsItems.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`Go to slide ${i + 1}`}
            className={`news__dot${i === active ? ' news__dot--active' : ''}`}
            onClick={() => { setActive(i); setPaused(true); }}
          />
        ))}
      </div>
    </section>
  );
};
