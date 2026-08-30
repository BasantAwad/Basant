/**
 * BotanicalScene — layered SVG botanical composition driven by global scroll progress.
 *
 * Layers (back to front):
 *  1. Atmosphere: dust, grain, subtle radial vignettes (always present, subtle motion).
 *  2. Roots: fine branching roots drawing from soil upward; active 0.02–0.20.
 *  3. Stem: main botanical stem drawing upward along a curved path; active 0.10–0.55.
 *  4. Leaves: several leaves unfold at deliberate intervals; active 0.18–0.50.
 *  5. Branches / tendrils: secondary growth toward content sections; active 0.40–0.85.
 *  6. Buds: buds swell before opening; active 0.45–0.78.
 *  7. Hero flower: main fuchsia flower, opens progressively on first visit; active 0.00–0.10.
 *  8. Final bloom: a small secondary flower near the contact section; active 0.85–1.00.
 *
 * Each element exposes:
 *  - start / end progress (0..1 of total page scroll)
 *  - depth (z-index ordering)
 *  - animationType: 'draw' (SVG stroke-dashoffset), 'fade' (opacity), 'scale', 'grow'
 *  - value range for the property being animated
 *
 * The scene is decorative: pointer-events: none, aria-hidden, no interaction.
 */

import React, { useMemo, useEffect, useRef } from 'react';
import './BotanicalScene.css';

export const SPECIMEN_PREFIX = 'NB';

interface BotanicalLayer {
  id: string;
  start: number;
  end: number;
  depth: number;
  animationType: 'draw' | 'fade' | 'scale' | 'grow' | 'translateY';
  min?: number;
  max?: number;
  pathD?: string;           // for draw animation
  pathLength?: number;      // estimated length for dash offset
  initialScale?: number;
  targetScale?: number;
  initialOpacity?: number;
  targetOpacity?: number;
  translateYRange?: number; // px
}

// ---------------------------------------------------------------------------
// Root system — fine branching roots that anchor from the bottom.
// Path drawn with stroke-dashoffset so it "grows" from soil upward.
// ---------------------------------------------------------------------------
const ROOT_PATHS = [
  // Main root crown — thick central root
  'M -30 1000 C -40 820, -55 700, -60 560 C -65 440, -50 360, -30 300 C -10 240, 5 200, 10 140',
  'M 10 1000 C 25 820, 35 700, 30 560 C 25 440, 15 360, 5 300 C -5 240, -10 200, -5 140',
  // Secondary roots spreading outward
  'M -60 560 C -90 520, -120 480, -140 430 C -160 380, -150 320, -120 280',
  'M -30 300 C -70 280, -110 260, -150 230 C -190 200, -220 170, -240 120',
  'M 30 560 C 60 520, 95 480, 115 430 C 135 380, 130 320, 105 280',
  'M 5 300 C 35 280, 70 260, 110 230 C 150 200, 175 170, 195 120',
  // Fine tertiary roots
  'M -140 430 C -165 410, -185 380, -195 340',
  'M -150 230 C -175 215, -195 195, -210 170',
  'M 115 430 C 140 410, 160 380, 170 340',
  'M 110 230 C 135 215, 155 195, 170 170',
];

function useScrollProgress() {
  // Returns normalized scroll progress 0..1 across the whole document.
  // Stable across re-renders and respects reduced-motion (returns 1 immediately).
  const preferReduced = useRef(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [progress, setProgress] = React.useState(
    preferReduced.current ? 1 : 0
  );

  useEffect(() => {
    if (preferReduced.current) {
      setProgress(1);
      return;
    }
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const scrollHeight = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const p = scrollHeight > 0 ? Math.min(1, Math.max(0, y / scrollHeight)) : 0;
      setProgress(p);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

// Map global progress to a layer-local value 0..1 given start/end.
function layerValue(global: number, start: number, end: number, min = 0, max = 1) {
  const span = end - start;
  if (span <= 0) return max;
  let t = (global - start) / span;
  t = Math.min(1, Math.max(0, t));
  // Slight ease for organic feel
  t = t * t * (3 - 2 * t); // smoothstep
  return min + (max - min) * t;
}

export const BotanicalScene: React.FC = () => {
  const progress = useScrollProgress();

  // Memoize layers so scroll changes don't reallocate.
  const layers = useMemo<BotanicalLayer[]>(() => {
    const items: BotanicalLayer[] = [];

    // 1. Atmosphere layers (always active, subtle)
    items.push({
      id: 'grain',
      start: 0,
      end: 1,
      depth: 0,
      animationType: 'fade',
      initialOpacity: 0.15,
      targetOpacity: 0.35,
    });
    items.push({
      id: 'vignette-top',
      start: 0,
      end: 1,
      depth: 0,
      animationType: 'fade',
      initialOpacity: 0.2,
      targetOpacity: 0.5,
    });

    // 2. Roots — draw animation
    const rootStart = 0.02;
    const rootEnd = 0.20;
    ROOT_PATHS.forEach((d, i) => {
      const len = 600 + i * 40; // approximate
      items.push({
        id: `root-${i}`,
        start: rootStart,
        end: rootEnd,
        depth: 6,
        animationType: 'draw',
        pathD: d,
        pathLength: len,
        initialOpacity: 0.0,
        targetOpacity: 0.55,
        min: 0,
        max: len, // dash offset sweeps from length → 0
      });
    });

    // 3. Stem — main stem drawing upward
    const stemStart = 0.10;
    const stemEnd = 0.55;
    items.push({
      id: 'stem',
      start: stemStart,
      end: stemEnd,
      depth: 7,
      animationType: 'draw',
      pathD: 'M 0 1000 C 0 820, -8 700, -12 560 C -16 440, -8 360, 0 300 C 8 240, 12 200, 10 140 C 8 100, 0 80, 0 60',
      pathLength: 1100,
      initialOpacity: 0.0,
      targetOpacity: 0.7,
      min: 0,
      max: 1100,
    });

    // 4. Leaves — scale + fade at intervals
    const leafStart = 0.18;
    const leafDefs = [
      { id: 'leaf-left-1', x: -140, y: 430, rot: -25, scale: 0.85 },
      { id: 'leaf-right-1', x: 120, y: 450, rot: 20, scale: 0.9 },
      { id: 'leaf-left-2', x: -100, y: 300, rot: -35, scale: 0.75 },
      { id: 'leaf-right-2', x: 90, y: 320, rot: 30, scale: 0.8 },
      { id: 'leaf-mid', x: 0, y: 200, rot: 0, scale: 1.0 },
      { id: 'leaf-bud-1', x: -80, y: 140, rot: -15, scale: 0.6 },
    ];
    leafDefs.forEach((def, i) => {
      const localStart = leafStart + (i * 0.03);
      const localEnd = localStart + 0.08;
      items.push({
        id: def.id,
        start: localStart,
        end: Math.min(1, localEnd),
        depth: 8 + i,
        animationType: 'scale',
        initialScale: 0.01,
        targetScale: def.scale,
        initialOpacity: 0.0,
        targetOpacity: 0.85,
        translateYRange: 30,
      });
    });

    // 5. Branches / tendrils — secondary growth toward sections
    const branchStart = 0.40;
    const branchDefs = [
      { id: 'tendril-left', x: -240, y: 120, dir: -1, len: 180 },
      { id: 'tendril-right', x: 195, y: 120, dir: 1, len: 180 },
      { id: 'branch-section-a', x: -180, y: 280, dir: -1, len: 220 },
      { id: 'branch-section-b', x: 170, y: 280, dir: 1, len: 220 },
    ];
    branchDefs.forEach((def, i) => {
      const localStart = branchStart + (i * 0.04);
      const localEnd = localStart + 0.10;
      const d = `M ${def.x} ${def.y} C ${def.x + def.dir * 40} ${def.y - 60}, ${def.x + def.dir * 100} ${def.y - 120}, ${def.x + def.dir * def.len} ${def.y - 160}`;
      items.push({
        id: def.id,
        start: localStart,
        end: Math.min(1, localEnd),
        depth: 9,
        animationType: 'draw',
        pathD: d,
        pathLength: def.len + 60,
        initialOpacity: 0.0,
        targetOpacity: 0.45,
        min: 0,
        max: def.len + 60,
      });
    });

    // 6. Buds — grow and fade
    const budStart = 0.45;
    const budDefs = [
      { id: 'bud-left', x: -180, y: 160, size: 14 },
      { id: 'bud-right', x: 170, y: 170, size: 12 },
      { id: 'bud-upper', x: -40, y: 100, size: 16 },
    ];
    budDefs.forEach((def, i) => {
      const localStart = budStart + (i * 0.05);
      const localEnd = localStart + 0.12;
      items.push({
        id: def.id,
        start: localStart,
        end: Math.min(1, localEnd),
        depth: 10,
        animationType: 'scale',
        initialScale: 0.01,
        targetScale: 1.0,
        initialOpacity: 0.0,
        targetOpacity: 0.8,
      });
    });

    // 7. Hero flower — opens at very start, holds
    items.push({
      id: 'hero-flower',
      start: 0.0,
      end: 0.12,
      depth: 20,
      animationType: 'scale',
      initialScale: 0.6,
      targetScale: 1.0,
      initialOpacity: 0.0,
      targetOpacity: 1.0,
    });
    items.push({
      id: 'hero-flower-inner',
      start: 0.02,
      end: 0.14,
      depth: 21,
      animationType: 'scale',
      initialScale: 0.4,
      targetScale: 1.0,
      initialOpacity: 0.0,
      targetOpacity: 1.0,
    });

    // 8. Final bloom near contact
    items.push({
      id: 'final-bloom',
      start: 0.85,
      end: 1.0,
      depth: 15,
      animationType: 'scale',
      initialScale: 0.01,
      targetScale: 1.0,
      initialOpacity: 0.0,
      targetOpacity: 0.9,
    });

    return items;
  }, []);

  // Compute animated values for each layer based on global progress.
  const animated = useMemo(() => {
    return layers.map((l) => {
      const v = layerValue(progress, l.start, l.end);
      const initialOpacity = l.initialOpacity ?? 0;
      const targetOpacity = l.targetOpacity ?? initialOpacity;
      const initialScale = l.initialScale ?? 1;
      const targetScale = l.targetScale ?? initialScale;
      let opacity = initialOpacity;
      let scale = initialScale;
      let dashOffset = 0;
      let translateY = 0;

      if (l.animationType === 'fade') {
        opacity = initialOpacity + (targetOpacity - initialOpacity) * v;
      } else if (l.animationType === 'scale') {
        scale = initialScale + (targetScale - initialScale) * v;
        opacity = initialOpacity + (targetOpacity - initialOpacity) * v;
      } else if (l.animationType === 'draw') {
        const max = l.max ?? l.pathLength ?? 1000;
        dashOffset = max * (1 - v);
        opacity = initialOpacity + (targetOpacity - initialOpacity) * v;
      } else if (l.animationType === 'translateY') {
        translateY = l.translateYRange ? l.translateYRange * (1 - v) : 0;
        opacity = initialOpacity + (targetOpacity - initialOpacity) * v;
      } else if (l.animationType === 'grow') {
        scale = 1 + (targetScale - 1) * v;
        opacity = initialOpacity + (targetOpacity - initialOpacity) * v;
      }

      return {
        ...l,
        computedOpacity: opacity,
        computedScale: scale,
        computedDashOffset: dashOffset,
        computedTranslateY: translateY,
      };
    });
  }, [progress, layers]);

  // Lookup helpers
  const byId = React.useMemo(() => {
    const map = new Map<string, BotanicalLayer & { computedOpacity: number; computedScale: number; computedDashOffset: number; computedTranslateY: number }>();
    animated.forEach((a) => map.set(a.id, a));
    return map;
  }, [animated]);

  const get = (id: string) => byId.get(id) as BotanicalLayer & { computedOpacity: number; computedScale: number; computedDashOffset: number; computedTranslateY: number } | undefined;

  // ---- SVG content -----------------------------------------------------------
  // Small final bloom near contact
  const FinalBloomSVG = () => {
    const b = get('final-bloom');
    const op = b ? b.computedOpacity : 0;
    const sc = b ? b.computedScale : 0.01;
    return (
      <g transform={`translate(0 40) scale(${sc})`} opacity={op}>
        <g transform="rotate(0)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <ellipse
              key={a}
              cx={0} cy={-22}
              rx={7} ry={14}
              fill="url(#finalBloomGradient)"
              transform={`rotate(${a})`}
              opacity={0.85}
            />
          ))}
        </g>
        <circle cx={0} cy={0} r={5} fill="#4a2028" />
        <circle cx={0} cy={0} r={2} fill="#c8a878" opacity={0.7} />
      </g>
    );
  };

  // Hero fuchsia flower — multiple petal layers with asymmetry.
  const HeroFlowerSVG = () => {
    const outer = get('hero-flower');
    const inner = get('hero-flower-inner');
    const opOuter = outer ? outer.computedOpacity : 0;
    const scOuter = outer ? outer.computedScale : 0.6;
    const opInner = inner ? inner.computedOpacity : 0;
    const scInner = inner ? inner.computedScale : 0.4;
    return (
      <g transform={`translate(0 60) scale(${scOuter})`} opacity={opOuter}>
        {/* Outer petals — deep fuchsia / wine */}
        <g>
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rot = angle + (i % 3 === 0 ? 4 : i % 3 === 1 ? -3 : 0); // asymmetry
            const len = 40 + (i % 4 === 0 ? 8 : i % 4 === 1 ? -4 : 0);
            return (
              <ellipse
                key={i}
                cx={0} cy={-len}
                rx={14 + (i % 5 === 0 ? 3 : 0)} ry={len * 0.9}
                fill="url(#petalOuterGradient)"
                transform={`rotate(${rot})`}
                opacity={0.9}
              />
            );
          })}
        </g>
        {/* Inner petals — lighter fuchsia */}
        <g transform={`scale(${scInner})`} opacity={opInner}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
            const rot = angle + (i % 2 === 0 ? 5 : -4);
            const len = 24 + (i % 3 === 0 ? 4 : -2);
            return (
              <ellipse
                key={i}
                cx={0} cy={-len}
                rx={9 + (i % 2 === 0 ? 2 : 0)} ry={len * 0.8}
                fill="url(#petalInnerGradient)"
                transform={`rotate(${rot})`}
                opacity={0.85}
              />
            );
          })}
        </g>
        {/* Stamens / center */}
        <g transform={`scale(${scInner})`} opacity={opInner}>
          <circle cx={0} cy={0} r={8} fill="#3a1a24" />
          <circle cx={0} cy={0} r={4} fill="#2a1018" />
          <g fill="#c8a878" opacity={0.8}>
            {[-12, -6, 0, 6, 12].map((x, i) => (
              <circle key={i} cx={x} cy={-3} r={1.2} />
            ))}
          </g>
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <line
              key={i}
              x1={0} y1={0}
              x2={Math.cos((angle * Math.PI) / 180) * 14}
              y2={Math.sin((angle * Math.PI) / 180) * 14 - 6}
              stroke="#4a2a2a"
              strokeWidth="0.8"
              opacity={0.7}
            />
          ))}
        </g>
      </g>
    );
  };

  // Tendril / branch decorative accents
  const BranchAccentsSVG = () => {
    const tl = get('tendril-left');
    const tr = get('tendril-right');
    const opL = tl ? tl.computedOpacity : 0;
    const opR = tr ? tr.computedOpacity : 0;
    return (
      <g opacity={Math.max(opL, opR) * 0.6}>
        {/* small leaf accents on tendrils */}
        {opL > 0.1 && (
          <path
            d="M -240 120 C -250 100, -260 80, -265 60"
            fill="none"
            stroke="#3a4a3a"
            strokeWidth="1"
            opacity={opL}
          />
        )}
        {opR > 0.1 && (
          <path
            d="M 195 120 C 205 100, 215 80, 220 60"
            fill="none"
            stroke="#3a4a3a"
            strokeWidth="1"
            opacity={opR}
          />
        )}
      </g>
    );
  };

  return (
    <div className="botanical-scene" aria-hidden="true">
      <svg
        className="botanical-svg"
        viewBox="0 0 800 1100"
        preserveAspectRatio="xMidYMax meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Petal gradients — deep fuchsia to wine */}
          <linearGradient id="petalOuterGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a3a52" />
            <stop offset="50%" stopColor="#6a2840" />
            <stop offset="100%" stopColor="#4a2028" />
          </linearGradient>
          <linearGradient id="petalInnerGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b04a6a" />
            <stop offset="50%" stopColor="#8a3a52" />
            <stop offset="100%" stopColor="#6a2840" />
          </linearGradient>
          <radialGradient id="budGradient" cx="0.4" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#5a2830" />
            <stop offset="100%" stopColor="#3a1a24" />
          </radialGradient>
          <radialGradient id="finalBloomGradient" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#b04a6a" />
            <stop offset="70%" stopColor="#8a3a52" />
            <stop offset="100%" stopColor="#6a2840" />
          </radialGradient>
          <linearGradient id="leafGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a6a4a" />
            <stop offset="50%" stopColor="#3a4a3a" />
            <stop offset="100%" stopColor="#2a3a2a" />
          </linearGradient>
          <linearGradient id="stemGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3a2a" />
            <stop offset="50%" stopColor="#1a2a1a" />
            <stop offset="100%" stopColor="#0a1a0a" />
          </linearGradient>
          <radialGradient id="rootGrad" cx="0.5" cy="0" r="0.8">
            <stop offset="0%" stopColor="#2a1a14" />
            <stop offset="100%" stopColor="#1a0e0a" />
          </radialGradient>

          {/* Soft glow behind hero flower */}
          <radialGradient id="flowerGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#8a3a52" stopOpacity={0.18} />
            <stop offset="60%" stopColor="#6a2840" stopOpacity={0.05} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>

          {/* Atmospheric vignette */}
          <radialGradient id="vignetteTop" cx="0.5" cy="0" r="0.7">
            <stop offset="0%" stopColor="#0a0e12" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#000000" stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* ---- Atmosphere layer ---- */}
        <rect width="800" height="1100" fill="url(#vignetteTop)" opacity={get('vignette-top')?.computedOpacity ?? 0.3} />

        {/* Dust/grain — subtle SVG noise approximation via scattered dots */}
        <g id="atmosphere-dust" opacity={get('grain')?.computedOpacity ?? 0.2}>
          {Array.from({ length: 60 }).map((_, i) => {
            const x = (i * 137 + 50) % 800;
            const y = (i * 97 + 200) % 1100;
            const r = 0.4 + (i % 3) * 0.3;
            return (
              <circle
                key={i}
                cx={x} cy={y} r={r}
                fill="#8a8278"
                opacity={0.1 + (i % 5) * 0.03}
              />
            );
          })}
        </g>

        {/* ---- Roots layer ---- */}
        <g id="roots" stroke="url(#rootGrad)" fill="none" strokeWidth="2.5" strokeLinecap="round">
          {ROOT_PATHS.map((d, i) => {
            const r = get(`root-${i}`);
            if (!r) return null;
            const dash = r.computedDashOffset;
            const op = r.computedOpacity;
            const sw = i < 2 ? 2.5 : i < 6 ? 1.8 : 1;
            return (
              <path
                key={i}
                d={d}
                strokeDasharray={`${r.pathLength} ${r.pathLength}`}
                strokeDashoffset={dash}
                opacity={op}
                strokeWidth={sw}
                style={{ transition: 'none' }}
              />
            );
          })}
        </g>

        {/* ---- Stem layer ---- */}
        <g id="stem">
          <path
            d={get('stem')?.pathD}
            fill="none"
            stroke="url(#stemGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${get('stem')?.pathLength ?? 1100} ${get('stem')?.pathLength ?? 1100}`}
            strokeDashoffset={get('stem')?.computedDashOffset ?? 1100}
            opacity={get('stem')?.computedOpacity ?? 0}
            style={{ transition: 'none' }}
          />
          {/* Subtle stem highlight */}
          <path
            d={get('stem')?.pathD}
            fill="none"
            stroke="#3a4a3a"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray={`${get('stem')?.pathLength ?? 1100} ${get('stem')?.pathLength ?? 1100}`}
            strokeDashoffset={get('stem')?.computedDashOffset ?? 1100}
            opacity={(get('stem')?.computedOpacity ?? 0) * 0.25}
            style={{ transition: 'none' }}
          />
        </g>

        {/* ---- Leaves layer ---- */}
        <g id="leaves">
          {[
            { id: 'leaf-left-1', x: -140, y: 430, rot: -25, scale: 0.85 },
            { id: 'leaf-right-1', x: 120, y: 450, rot: 20, scale: 0.9 },
            { id: 'leaf-left-2', x: -100, y: 300, rot: -35, scale: 0.75 },
            { id: 'leaf-right-2', x: 90, y: 320, rot: 30, scale: 0.8 },
            { id: 'leaf-mid', x: 0, y: 200, rot: 0, scale: 1.0 },
            { id: 'leaf-bud-1', x: -80, y: 140, rot: -15, scale: 0.6 },
          ].map((def) => {
            const l = get(def.id);
            if (!l) return null;
            const op = l.computedOpacity;
            const sc = l.computedScale;
            const ty = l.computedTranslateY;
            return (
              <g
                key={def.id}
                transform={`translate(${def.x} ${def.y + ty}) rotate(${def.rot}) scale(${sc})`}
                opacity={op}
                style={{ transformOrigin: 'center', transition: 'none' }}
              >
                <path
                  d="M 0 0 C 10 -8, 20 -10, 26 -5 C 22 -2, 13 3, 0 5 C -13 3, -7 -1, 0 0 Z"
                  fill="url(#leafGradient)"
                  opacity={0.85}
                />
                <path
                  d="M 0 0 C 7 -4, 13 -5, 19 -3"
                  fill="none"
                  stroke="#2a3a2a"
                  strokeWidth="0.6"
                  opacity={0.5}
                />
                {/* Vein lines */}
                <path d="M 2 -2 L 10 -6" stroke="#2a3a2a" strokeWidth="0.3" opacity={0.3} />
                <path d="M 2 0 L 12 -2" stroke="#2a3a2a" strokeWidth="0.3" opacity={0.3} />
              </g>
            );
          })}
        </g>

        {/* ---- Branches / tendrils ---- */}
        <g id="branches">
          {['tendril-left', 'tendril-right', 'branch-section-a', 'branch-section-b'].map((id) => {
            const b = get(id);
            if (!b) return null;
            return (
              <path
                key={id}
                d={b.pathD}
                fill="none"
                stroke="#2a3a2a"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeDasharray={`${b.pathLength} ${b.pathLength}`}
                strokeDashoffset={b.computedDashOffset}
                opacity={b.computedOpacity}
                style={{ transition: 'none' }}
              />
            );
          })}
        </g>

        {/* ---- Buds ---- */}
        <g id="buds">
          <g key="bud-left" transform={`translate(-180 160) scale(${get('bud-left')?.computedScale ?? 0.01})`} opacity={get('bud-left')?.computedOpacity ?? 0}>
            <ellipse cx={0} cy={0} rx={14} ry={18} fill="url(#budGradient)" />
            <path d="M 0 -18 C -4 -21, -6 -25, -5 -28" fill="none" stroke="#2a1a24" strokeWidth="1" opacity={0.6} />
            <path d="M 0 -18 C 4 -21, 6 -25, 5 -28" fill="none" stroke="#2a1a24" strokeWidth="1" opacity={0.6} />
          </g>
          <g key="bud-right" transform={`translate(170 170) scale(${get('bud-right')?.computedScale ?? 0.01})`} opacity={get('bud-right')?.computedOpacity ?? 0}>
            <ellipse cx={0} cy={0} rx={12} ry={15} fill="url(#budGradient)" />
            <path d="M 0 -15 C -3 -18, -5 -21, -4 -23" fill="none" stroke="#2a1a24" strokeWidth="1" opacity={0.6} />
            <path d="M 0 -15 C 3 -18, 5 -21, 4 -23" fill="none" stroke="#2a1a24" strokeWidth="1" opacity={0.6} />
          </g>
          <g key="bud-upper" transform={`translate(-40 100) scale(${get('bud-upper')?.computedScale ?? 0.01})`} opacity={get('bud-upper')?.computedOpacity ?? 0}>
            <ellipse cx={0} cy={0} rx={16} ry={20} fill="url(#budGradient)" />
            <path d="M 0 -20 C -5 -24, -7 -28, -6 -32" fill="none" stroke="#2a1a24" strokeWidth="1" opacity={0.6} />
            <path d="M 0 -20 C 5 -24, 7 -28, 6 -32" fill="none" stroke="#2a1a24" strokeWidth="1" opacity={0.6} />
          </g>
        </g>

        {/* ---- Hero flower glow + flower ---- */}
        <ellipse cx="0" cy="60" rx="120" ry="120" fill="url(#flowerGlow)" opacity={get('hero-flower')?.computedOpacity ?? 0} />
        <g id="hero-flower" transform="translate(0 60) scale(0.6)" opacity={0} style={{ transformOrigin: 'center' }}>
          <HeroFlowerSVG />
        </g>

        {/* ---- Final bloom ---- */}
        <g id="final-bloom" transform="translate(0 40) scale(0.01)" opacity={0} style={{ transformOrigin: 'center' }}>
          <FinalBloomSVG />
        </g>

        {/* ---- Branch accents ---- */}
        <BranchAccentsSVG />
      </svg>

      {/* Small canvas-based dust motes that gently respond to scroll velocity (subtle) */}
      <canvas
        className="dust-canvas"
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  );
};
