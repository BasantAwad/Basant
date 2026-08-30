import { useEffect, useState, useRef, useCallback } from 'react';



interface ScrollProgressReturn {
  progress: number;             // 0..1 normalized scroll
  isReduced: boolean;
  lastChangeTs: number;
  velocity: number;             // px/s approximate
}

export function useScrollProgress(): ScrollProgressReturn {
  const prefersReduced = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isReduced, setIsReduced] = useState(prefersReduced.current);
  const [progress, setProgress] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTs = useRef(0);
  const rafId = useRef<number | null>(null);
  const ticking = useRef(false);

  // Listen for reduced-motion changes at runtime
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setIsReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const update = useCallback(() => {
    const doc = document.documentElement;
    const scrollTop =
      window.scrollY ?? document.documentElement.scrollTop ?? 0;
    const scrollHeight = doc.scrollHeight - window.innerHeight;
    const p = scrollHeight > 0 ? Math.min(1, Math.max(0, scrollTop / scrollHeight)) : 0;

    const now = performance.now();
    const dy = Math.abs(scrollTop - lastScrollY.current);
    const dt = Math.max(1, now - lastTs.current);
    const v = (dy / dt) * 1000; // px/s
    lastScrollY.current = scrollTop;
    lastTs.current = now;

    setProgress(p);
    setVelocity(v);
    ticking.current = false;
    rafId.current = null;
  }, []);

  useEffect(() => {
    if (prefersReduced.current) {
      setProgress(1);
      setVelocity(0);
      return;
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [update]);

  return { progress, isReduced, lastChangeTs: lastTs.current, velocity };
}

/**
 * Convert global scroll progress (0..1) into a local 0..1 for a layer
 * defined by its start/end progress. Returns 0 before start, 1 after end,
 * with smoothstep easing in between.
 */
export function localProgress(
  global: number,
  start: number,
  end: number,
  min = 0,
  max = 1
): number {
  const span = end - start;
  if (span <= 0) return max;
  let t = (global - start) / span;
  if (t <= 0) return min;
  if (t >= 1) return max;
  // smoothstep
  t = t * t * (3 - 2 * t);
  return min + (max - min) * t;
}

/**
 * Clamp and smooth delta to prevent velocity spikes from tiny jitters.
 */
export function smoothVelocity(raw: number, prev: number, dt: number): number {
  const alpha = Math.min(1, 1 / (dt / 60 + 1));
  return prev * (1 - alpha) + raw * alpha;
}
