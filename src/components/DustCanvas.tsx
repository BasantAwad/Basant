/**
 * DustCanvas — subtle spore/dust particles animated with requestAnimationFrame.
 * Particles drift gently; scroll velocity adds a tiny transient motion that
 * settles immediately when idle. Skip entirely in reduced-motion mode.
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; vx: number; vy: number; size: number; alpha: number;
}

export const DustCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastScrollRef = useRef<{ y: number; t: number }>({ y: 0, t: 0 });
  const velocityRef = useRef(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (prefersReduced || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const w = () => canvas.clientWidth;
    const h = () => canvas.clientHeight;

    // Seed particles
    const count = Math.min(45, Math.floor((w() * h()) / 22000));
    particlesRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.08 + Math.random() * 0.18),
      size: 0.4 + Math.random() * 1.0,
      alpha: 0.04 + Math.random() * 0.1,
    }));

    let rafId: number;

    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastScrollRef.current.y);
      const dt = Math.max(16, now - lastScrollRef.current.t);
      velocityRef.current = dy / dt;
      lastScrollRef.current = { y: window.scrollY, t: now };
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    const loop = (timestamp: number) => {
      const vel = velocityRef.current;
      // Decay velocity immediately when not scrolling
      velocityRef.current *= 0.85;

      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      for (const p of particlesRef.current) {
        // Base drift
        p.x += p.vx + vel * 0.3 * (Math.random() - 0.5);
        p.y += p.vy;

        // Gentle wrap
        if (p.y < -10) { p.y = ch + 10; p.x = Math.random() * cw; }
        if (p.x < -10) p.x = cw + 10;
        if (p.x > cw + 10) p.x = -10;

        // Size pulse (very subtle)
        const pulse = 1 + Math.sin(timestamp * 0.001 + p.x) * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184,176,164,${p.alpha})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  );
};
