import { useScrollProgress } from '../hooks/useScrollProgress';
import './BotanicalScene.css';

/* ------------------------------------------------------------------ ·
 *  BotanicalScene — viewport-filling botanical frame.
 *
 *  Layout (viewBox 0 0 100 100, stretched to fill via preserveAspectRatio="none"):
 *    - Top strip (y 2..18): dense row of bell flowers + hanging leaves + buds.
 *    - Top-left corner (x 0..12, y 0..14): cluster of 6 bell flowers + vines.
 *    - Top-right corner (x 88..100, y 0..14): cluster of 6 bell flowers + vines.
 *    - Left edge (x 2..10, y 14..92): climbing vine with bell flowers every ~15 units.
 *    - Right edge (x 90..98, y 14..92): climbing vine with bell flowers.
 *    - Bottom strip (y 84..96): lighter garland of small bells + leaves.
 *
 *  Visibility model:
 *    - Top strip: ALWAYS visible (opacity 1 at scroll 0), scales up gently on scroll.
 *    - Corners: fade in 0.05→0.25 scroll, grow 0.7→1.0 scale.
 *    - Side edges: fade in 0.10→0.40 scroll, grow 0.6→1.0 scale, vines extend downward.
 *    - Bottom strip: fade in 0.40→0.65 scroll.
 *    - Reduced motion: all layers pinned at full visibility + max scale from scroll 0.
 */

const C = {
  bg:           '#1c1a24',
  stem:         '#3c4a2e',
  leafDark:     '#2e3a22',
  leafLight:    '#5a6a3a',
  leafHi:       '#6a7a4a',
  flowerMain:   '#c94b7a',
  flowerDeep:   '#a0345a',
  flowerLit:    '#e87a9a',
  flowerThroat: '#6a1a3a',
  accent:       '#f5eae0',
  vine:         '#4a3a2a',
};

/* ------------------------------------------------------------------ ·
 *  Layer definitions
 */

type LayerId =
  | 'top-strip'
  | 'top-left-corner'
  | 'top-right-corner'
  | 'left-edge'
  |  'right-edge'
  | 'bottom-strip';

interface ScrollLayer {
  id: LayerId;
  start: number;
  end: number;
  baseOpacity: number;   // opacity at scroll 0 (top-strip = 1, rest = 0)
  endOpacity: number;    // opacity at end scroll
  startScale: number;
  endScale: number;
  growth: 'static' | 'grow' | 'grow-then-hold';
}

const LAYERS: ScrollLayer[] = [
  { id: 'top-strip',      start: 0.0,  end: 0.55, baseOpacity: 1.0, endOpacity: 1.0, startScale: 0.90, endScale: 1.15, growth: 'grow' },
  { id: 'top-left-corner', start: 0.0,  end: 0.35, baseOpacity: 0.35, endOpacity: 1.0, startScale: 0.80, endScale: 1.0,  growth: 'grow' },
  { id: 'top-right-corner', start: 0.0,  end: 0.35, baseOpacity: 0.35, endOpacity: 1.0, startScale: 0.80, endScale: 1.0,  growth: 'grow' },
  { id: 'left-edge',      start: 0.0,  end: 0.45, baseOpacity: 0.3,  endOpacity: 1.0, startScale: 0.75, endScale: 1.0,  growth: 'grow' },
  { id: 'right-edge',     start: 0.0,  end: 0.45, baseOpacity: 0.3,  endOpacity: 1.0, startScale: 0.75, endScale: 1.0,  growth: 'grow' },
  { id: 'bottom-strip',   start: 0.0,  end: 0.55, baseOpacity: 0.25, endOpacity: 1.0, startScale: 0.85, endScale: 1.0,  growth: 'grow' },
];

function getLayer(id: LayerId): ScrollLayer {
  return LAYERS.find((l) => l.id === id)!;
}

function computePhase(progress: number, layer: ScrollLayer): { opacity: number; scale: number } {
  const p = Math.min(1, Math.max(0, (progress - layer.start) / (layer.end - layer.start || 1)));
  // Smoothstep for organic growth
  const smooth = p * p * (3 - 2 * p);
  const opacity = layer.baseOpacity + (layer.endOpacity - layer.baseOpacity) * smooth;
  const scale = layer.startScale + (layer.endScale - layer.startScale) * smooth;
  return { opacity, scale };
}

/* ------------------------------------------------------------------ ·
 *  SVG drawing helpers (viewBox 0 0 100 100)
 */

// Bell flower — pendulous fuchsia bell with lobes, throat, stamens, sepals, pedicel.
function BellFlower({
  cx, cy, scale = 1,
  hue = C.flowerMain,
  depth = C.flowerDeep,
  lit = C.flowerLit,
  throat = C.flowerThroat,
}: {
  cx: number; cy: number; scale?: number;
  hue?: string; depth?: string; lit?: string; throat?: string;
}) {
  const r = 3.2 * scale;
  const h = 5.0 * scale;
  const lobeH = 1.2 * scale;
  const stemTop = cy - h * 0.9;
  const stemBot = cy - h * 0.15;

  return (
    <g key={`bell-${cx}-${cy}-${Math.random().toString(36).slice(2,6)}`} transform={`translate(${cx} ${cy}) scale(${scale})`}>
      {stemTop > 0 && <line x1={cx} y1={stemTop} x2={cx} y2={stemBot} stroke={C.stem} strokeWidth={0.15 * scale} strokeLinecap="round" />}
      {/* Bell body */}
      <path
        d={`M ${cx - r} ${cy - h * 0.1}
            Q ${cx - r * 1.15} ${cy - h * 0.55} ${cx - r * 0.55} ${cy - h}
            L ${cx - r * 0.45} ${cy - h - lobeH}
            L ${cx - r * 0.2} ${cy - h}
            Q ${cx} ${cy - h * 1.02} ${cx + r * 0.2} ${cy - h}
            L ${cx + r * 0.45} ${cy - h - lobeH}
            L ${cx + r * 0.55} ${cy - h}
            Q ${cx + r * 1.15} ${cy - h * 0.55} ${cx + r} ${cy - h * 0.1}
            Z`}
        fill={hue}
        stroke={depth}
        strokeWidth={0.18 * scale}
        opacity={0.92}
        style={{ filter: 'url(#bellShadow)' }}
      />
      {/* Lit highlight */}
      <path
        d={`M ${cx - r * 0.4} ${cy - h * 0.2}
            Q ${cx - r * 0.55} ${cy - h * 0.55} ${cx - r * 0.4} ${cy - h * 0.95}
            L ${cx - r * 0.2} ${cy - h * 0.95}
            Q ${cx - r * 0.15} ${cy - h * 0.55} ${cx - r * 0.25} ${cy - h * 0.2}
            Z`}
        fill={lit}
        opacity={0.5}
        style={{ filter: 'url(#bellSoft)' }}
      />
      {/* Throat + stamens */}
      <circle cx={cx} cy={cy - h * 0.88} r={0.9 * scale} fill={throat} stroke={depth} strokeWidth={0.1 * scale} />
      <line x1={cx} y1={cy - h * 0.88} x2={cx - 2.2 * scale} y2={cy - h * 0.7} stroke={C.accent} strokeWidth={0.12 * scale} strokeLinecap="round" opacity={0.85} />
      <line x1={cx} y1={cy - h * 0.88} x2={cx + 2.0 * scale} y2={cy - h * 0.72} stroke={C.accent} strokeWidth={0.12 * scale} strokeLinecap="round" opacity={0.8} />
      {/* Sepals */}
      <path
        d={`M ${cx - r * 0.5} ${cy - h * 0.1}
            Q ${cx - r * 0.8} ${cy - h * 0.2} ${cx - r * 0.7} ${cy - h * 0.05}
            L ${cx - r * 0.4} ${cy - h * 0.15}
            Q ${cx} ${cy - h * 0.05} ${cx + r * 0.4} ${cy - h * 0.15}
            L ${cx + r * 0.7} ${cy - h * 0.05}
            Q ${cx + r * 0.8} ${cy - h * 0.2} ${cx + r * 0.5} ${cy - h * 0.1}
            Z`}
        fill={depth}
        stroke={C.leafDark}
        strokeWidth={0.08 * scale}
      />
      {/* Pedicel */}
      <path
        d={`M ${cx} ${cy - h * 0.1}
            Q ${cx + (Math.random() * 2 - 1) * 0.6} ${cy - h * 0.05}
            ${cx + (Math.random() * 2 - 1) * 1.0} ${cy + 0.4}`}
        fill="none"
        stroke={C.vine}
        strokeWidth={0.2 * scale}
        strokeLinecap="round"
        opacity={0.85}
      />
    </g>
  );
}

// Leaf — organic asymmetric blade with midrib + side veins.
function Leaf({
  cx, cy, angle = 0, length = 6, width = 2.6, rotate = 0,
  dark = C.leafDark, light = C.leafLight, hi = C.leafHi,
}: {
  cx: number; cy: number; angle?: number; length?: number; width?: number; rotate?: number;
  dark?: string; light?: string; hi?: string;
}) {
  const rad = (rotate * Math.PI) / 180;
  const cosA = Math.cos(rad);
  const sinA = Math.sin(rad);
  const rx = cx + angle * 0.3;
  const ry = cy;

  return (
    <g key={`leaf-${cx}-${cy}-${rotate}`} transform={`translate(${cx} ${cy}) rotate(${rotate})`}>
      <path
        d={`M ${rx} ${ry}
            Q ${rx - width * 0.6 * cosA - length * 0.3 * sinA} ${ry - width * 0.6 * sinA + length * 0.3 * cosA}
              ${rx - width * 0.8 * cosA - length * 0.7 * sinA} ${ry - width * 0.8 * sinA + length * 0.7 * cosA}
            Q ${rx - width * 0.4 * cosA - length * 1.0 * sinA} ${ry - width * 0.4 * sinA + length * 1.0 * cosA}
              ${rx - width * 0.1 * cosA - length * 1.15 * sinA} ${ry - width * 0.1 * sinA + length * 1.15 * cosA}
            Q ${rx + width * 0.1 * cosA - length * 1.15 * sinA} ${ry + width * 0.1 * sinA + length * 1.15 * cosA}
              ${rx + width * 0.4 * cosA - length * 1.0 * sinA} ${ry + width * 0.4 * sinA + length * 1.0 * cosA}
            Q ${rx + width * 0.8 * cosA - length * 0.7 * sinA} ${ry + width * 0.8 * sinA + length * 0.7 * cosA}
              ${rx + width * 0.6 * cosA - length * 0.3 * sinA} ${ry + width * 0.6 * sinA + length * 0.3 * cosA}
            Q ${rx + width * 0.3 * cosA} ${ry + width * 0.3 * sinA}
              ${rx} ${ry}
            Z`}
        fill={dark}
        stroke={light}
        strokeWidth={0.12}
        opacity={0.95}
        style={{ filter: 'url(#leafTexture)' }}
      />
      <path d={`M ${rx} ${ry} L ${rx - length * 1.1 * sinA} ${ry + length * 1.1 * cosA}`} stroke={hi} strokeWidth={0.12} strokeLinecap="round" opacity={0.6} />
      {[
        { a: 0.25, d: 0.5 },
        { a: 0.45, d: 0.65 },
        { a: 0.65, d: 0.5 },
      ].map((v) => (
        <path
          key={`vein-${v.a}-${v.d}`}
          d={`M ${rx - v.d * length * 0.4 * sinA} ${ry + v.d * length * 0.4 * cosA}
              L ${rx - v.d * length * sinA - v.a * width * 0.5 * cosA} ${ry + v.d * length * cosA + v.a * width * 0.5 * sinA}`}
          stroke={C.leafLight}
          strokeWidth={0.06}
          strokeLinecap="round"
          opacity={0.35}
        />
      ))}
    </g>
  );
}

// Vine segment — quadratic curve with leaves.
function VineSegment({
  x1, y1, x2, y2, leaves = 2, color = C.stem,
}: {
  x1: number; y1: number; x2: number; y2: number; leaves?: number; color?: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const curveOff = 2.5 * (Math.random() > 0.5 ? 1 : -1);
  const cpx = mx + nx * curveOff;
  const cpy = my + ny * curveOff;

  return (
    <g key={`vine-${x1}-${y1}-${x2}-${y2}`}>
      <path d={`M ${x1} ${y1} Q ${cpx} ${cpy} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={0.25} strokeLinecap="round" opacity={0.9} />
      {Array.from({ length: leaves }, (_, i) => {
        const t = 0.25 + (i / (leaves - 1)) * 0.5;
        const lx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cpx + t * t * x2;
        const ly = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cpy + t * t * y2;
        const side = i % 2 === 0 ? 1 : -1;
        return (
          <Leaf
            key={`vine-leaf-${x1}-${y1}-${i}`}
            cx={lx + nx * side * 1.2}
            cy={ly + ny * side * 1.2}
            angle={0}
            length={3.5}
            width={1.6}
            rotate={side > 0 ? 30 + Math.random() * 40 : -30 - Math.random() * 40}
          />
        );
      })}
    </g>
  );
}

// Small bud.
function BellBud({
  cx, cy, scale = 1,
  hue = C.flowerMain, depth = C.flowerDeep,
}: {
  cx: number; cy: number; scale?: number;
  hue?: string; depth?: string;
}) {
  const r = 1.8 * scale;
  return (
    <g key={`bud-${cx}-${cy}`} transform={`translate(${cx} ${cy})`}>
      <path
        d={`M ${cx - r * 0.55} ${cy + r * 0.4}
            Q ${cx - r * 0.9} ${cy - r * 0.1} ${cx - r * 0.5} ${cy - r * 0.4}
            Q ${cx} ${cy - r * 0.6} ${cx + r * 0.5} ${cy - r * 0.4}
            Q ${cx + r * 0.9} ${cy - r * 0.1} ${cx + r * 0.55} ${cy + r * 0.4}
            Q ${cx} ${cy + r * 0.5} ${cx - r * 0.55} ${cy + r * 0.4}
            Z`}
        fill={hue}
        stroke={depth}
        strokeWidth={0.15 * scale}
        opacity={0.9}
      />
    </g>
  );
}

// ------------------------------------------------------------------ ·
//  Top strip — dense row of bell flowers across the full top edge.
// ------------------------------------------------------------------ ·

const TOP_FLOWERS = [
  { x: 2,    y: 10, s: 1.1,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 5.5,  y: 9,  s: 0.9,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 9,    y: 11, s: 1.2,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 13,   y: 8.5, s: 1.0,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 16.5, y: 10.5, s: 0.85, hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 20,   y: 9,   s: 1.15, hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 23.5, y: 11.5, s: 0.95, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 27,   y: 9.5, s: 1.25, hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 30.5, y: 8,   s: 1.0,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 34,   y: 10,  s: 0.9,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 37.5, y: 11,  s: 1.1,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 41,   y: 9,   s: 1.2,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 44.5, y: 10.5, s: 0.85, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 48,   y: 8.5, s: 1.05, hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 51.5, y: 11,  s: 0.95, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 55,   y: 9.5, s: 1.15, hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 58.5, y: 8,   s: 1.0,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 62,   y: 10.5, s: 0.9,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 65.5, y: 11,  s: 1.2,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 69,   y: 9,   s: 0.95, hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 72.5, y: 8.5, s: 1.05, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 76,   y: 10,  s: 1.1,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 79.5, y: 9.5, s: 0.85, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 83,   y: 11,  s: 1.2,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 86.5, y: 8.5, s: 0.9,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 90,   y: 10,  s: 1.0,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 93.5, y: 9,   s: 1.15, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
];

const TOP_STRAND_LEAVES = [
  { x: 3,   y: 14,   len: 4.5, wid: 2.0, rot: 18 },
  { x: 7,   y: 14.5, len: 5,   wid: 2.2, rot: -15 },
  { x: 11,  y: 13.5, len: 4,   wid: 1.8, rot: 22 },
  { x: 15,  y: 14.5, len: 5,   wid: 2.3, rot: -18 },
  { x: 19,  y: 14,   len: 4.5, wid: 2.0, rot: 16 },
  { x: 23,  y: 14.5, len: 5,   wid: 2.2, rot: -20 },
  { x: 27,  y: 13.5, len: 4,   wid: 1.8, rot: 24 },
  { x: 31,  y: 14.5, len: 5,   wid: 2.3, rot: -14 },
  { x: 35,  y: 14,   len: 4.5, wid: 2.0, rot: 19 },
  { x: 39,  y: 14.5, len: 5,   wid: 2.2, rot: -17 },
  { x: 43,  y: 13.5, len: 4,   wid: 1.8, rot: 21 },
  { x: 47,  y: 14.5, len: 5,   wid: 2.3, rot: -16 },
  { x: 51,  y: 14,   len: 4.5, wid: 2.0, rot: 18 },
  { x: 55,  y: 14.5, len: 5,   wid: 2.2, rot: -22 },
  { x: 59,  y: 13.5, len: 4,   wid: 1.8, rot: 15 },
  { x: 63,  y: 14.5, len: 5,   wid: 2.3, rot: -19 },
  { x: 67,  y: 14,   len: 4.5, wid: 2.0, rot: 20 },
  { x: 71,  y: 14.5, len: 5,   wid: 2.2, rot: -15 },
  { x: 75,  y: 13.5, len: 4,   wid: 1.8, rot: 23 },
  { x: 79,  y: 14.5, len: 5,   wid: 2.3, rot: -18 },
  { x: 83,  y: 14,   len: 4.5, wid: 2.0, rot: 17 },
  { x: 87,  y: 14.5, len: 5,   wid: 2.2, rot: -21 },
  { x: 91,  y: 13.5, len: 4,   wid: 1.8, rot: 19 },
  { x: 95,  y: 14.5, len: 5,   wid: 2.3, rot: -16 },
];

const TOP_TOP_LEAVES = [
  { x: 2,   y: 4,   len: 4,   wid: 1.8, rot: -30 },
  { x: 6,   y: 3.5, len: 4.5, wid: 2,   rot: 25 },
  { x: 10,  y: 4,   len: 4,   wid: 1.8, rot: -28 },
  { x: 14,  y: 3.5, len: 4.5, wid: 2,   rot: 22 },
  { x: 18,  y: 4,   len: 4,   wid: 1.8, rot: -25 },
  { x: 22,  y: 3.5, len: 4.5, wid: 2,   rot: 28 },
  { x: 26,  y: 4,   len: 4,   wid: 1.8, rot: -22 },
  { x: 30,  y: 3.5, len: 4.5, wid: 2,   rot: 25 },
  { x: 34,  y: 4,   len: 4,   wid: 1.8, rot: -28 },
  { x: 38,  y: 3.5, len: 4.5, wid: 2,   rot: 22 },
  { x: 42,  y: 4,   len: 4,   wid: 1.8, rot: -25 },
  { x: 46,  y: 3.5, len: 4.5, wid: 2,   rot: 28 },
  { x: 50,  y: 4,   len: 4,   wid: 1.8, rot: -22 },
  { x: 54,  y: 3.5, len: 4.5, wid: 2,   rot: 25 },
  { x: 58,  y: 4,   len: 4,   wid: 1.8, rot: -28 },
  { x: 62,  y: 3.5, len: 4.5, wid: 2,   rot: 22 },
  { x: 66,  y: 4,   len: 4,   wid: 1.8, rot: -25 },
  { x: 70,  y: 3.5, len: 4.5, wid: 2,   rot: 28 },
  { x: 74,  y: 4,   len: 4,   wid: 1.8, rot: -22 },
  { x: 78,  y: 3.5, len: 4.5, wid: 2,   rot: 25 },
  { x: 82,  y: 4,   len: 4,   wid: 1.8, rot: -28 },
  { x: 86,  y: 3.5, len: 4.5, wid: 2,   rot: 22 },
  { x: 90,  y: 4,   len: 4,   wid: 1.8, rot: -25 },
  { x: 94,  y: 3.5, len: 4.5, wid: 2,   rot: 28 },
];

const TOP_BUDS = [
  { x: 4,   y: 12.5, s: 0.5 },
  { x: 12,  y: 12,   s: 0.45 },
  { x: 21,  y: 12.5, s: 0.5 },
  { x: 29,  y: 12,   s: 0.45 },
  { x: 38,  y: 12.5, s: 0.5 },
  { x: 46,  y: 12,   s: 0.45 },
  { x: 54,  y: 12.5, s: 0.5 },
  { x: 63,  y: 12,   s: 0.45 },
  { x: 72,  y: 12.5, s: 0.5 },
  { x: 81,  y: 12,   s: 0.45 },
  { x: 89,  y: 12.5, s: 0.5 },
  { x: 97,  y: 12,   s: 0.5 },
];

function TopStrip({ opacity, scale }: { opacity: number; scale: number }) {
  return (
    <g opacity={opacity} transform={`scale(${scale})`} style={{ transformOrigin: '50% 50%' }}>
      {/* Top framing leaves */}
      {TOP_TOP_LEAVES.map((l, i) => (
        <Leaf key={`top-top-leaf-${i}`} cx={l.x} cy={l.y} angle={l.x / 100} length={l.len} width={l.wid} rotate={l.rot} />
      ))}
      {/* Main flowers */}
      {TOP_FLOWERS.map((f, i) => (
        <BellFlower key={`top-flower-${i}`} cx={f.x} cy={f.y} scale={f.s} hue={f.hue} depth={f.depth} lit={f.lit} />
      ))}
      {/* Strand leaves */}
      {TOP_STRAND_LEAVES.map((l, i) => (
        <Leaf key={`strand-leaf-${i}`} cx={l.x} cy={l.y} angle={l.x / 100} length={l.len} width={l.wid} rotate={l.rot} />
      ))}
      {/* Buds */}
      {TOP_BUDS.map((b, i) => (
        <BellBud key={`bud-${i}`} cx={b.x} cy={b.y} scale={b.s} hue={C.flowerLit} depth={C.flowerDeep} />
      ))}
    </g>
  );
}

// ------------------------------------------------------------------ ·
//  Corner cluster — 6-7 bell flowers + leaves + vines.
// ------------------------------------------------------------------ ·

function CornerCluster({ cx, cy, flipX = 1, flipY = 1, opacity, scale }: {
  cx: number; cy: number; flipX?: number; flipY?: number;
  opacity: number; scale: number;
}) {
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${flipX * scale} ${flipY * scale})`} style={{ transformOrigin: '0 0' }}>
      {/* Corner stems */}
      <path d="M 0 0 Q -3 -4 -1 -8 Q 2 -12 0 -15" fill="none" stroke={C.stem} strokeWidth={0.35} strokeLinecap="round" opacity={0.85} />
      <path d="M 0 0 Q 3 -4 1 -8 Q -2 -12 0 -15" fill="none" stroke={C.stem} strokeWidth={0.3} strokeLinecap="round" opacity={0.75} />

      {/* Dense cluster of 7 bell flowers */}
      <BellFlower cx={-4}  cy={-9}  scale={0.85} hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />
      <BellFlower cx={3}   cy={-8}  scale={0.9}  hue={C.flowerLit}  depth={C.flowerDeep} lit={C.flowerMain} />
      <BellFlower cx={-2}  cy={-12} scale={0.75} hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />
      <BellFlower cx={5}   cy={-11} scale={0.8}  hue={C.flowerLit}  depth={C.flowerDeep} lit={C.flowerMain} />
      <BellFlower cx={-5}  cy={-13} scale={0.7}  hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />
      <BellFlower cx={6}   cy={-14} scale={0.65} hue={C.flowerLit}  depth={C.flowerDeep} lit={C.flowerMain} />
      <BellFlower cx={0}   cy={-15} scale={0.7}  hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />

      {/* Dense leaves around the corner */}
      <Leaf cx={-6} cy={-6} length={4}   width={1.8} rotate={-55} />
      <Leaf cx={-2} cy={-5} length={3.5} width={1.6} rotate={-75} />
      <Leaf cx={3}  cy={-5} length={4}   width={1.7} rotate={50} />
      <Leaf cx={6}  cy={-6} length={3.5} width={1.6} rotate={35} />
      <Leaf cx={-4} cy={-3} length={3.2} width={1.5} rotate={-65} />
      <Leaf cx={2}  cy={-3} length={3.5} width={1.5} rotate={60} />
      <Leaf cx={-7} cy={-8} length={3}   width={1.4} rotate={-40} />
      <Leaf cx={7}  cy={-9} length={3.2} width={1.5} rotate={45} />
      <Leaf cx={-1} cy={-7} length={3}   width={1.4} rotate={-45} />
      <Leaf cx={4}  cy={-4} length={3}   width={1.4} rotate={40} />

      {/* Buds */}
      <BellBud cx={-3} cy={-7}  scale={0.4}  hue={C.flowerMain} depth={C.flowerDeep} />
      <BellBud cx={2}  cy={-10} scale={0.35} hue={C.flowerLit}  depth={C.flowerDeep} />
      <BellBud cx={-5} cy={-10} scale={0.38} hue={C.flowerLit}  depth={C.flowerDeep} />
      <BellBud cx={4}  cy={-7}  scale={0.35} hue={C.flowerMain} depth={C.flowerDeep} />

      {/* Vine tendrils */}
      <path d="M -4 -9 Q -8 -10 -10 -8" fill="none" stroke={C.vine} strokeWidth={0.2} strokeLinecap="round" opacity={0.7} />
      <path d="M 3 -8 Q 7 -7 9 -9"     fill="none" stroke={C.vine} strokeWidth={0.2} strokeLinecap="round" opacity={0.7} />
      <path d="M 0 -15 Q -2 -18 0 -20" fill="none" stroke={C.vine} strokeWidth={0.18} strokeLinecap="round" opacity={0.6} />
    </g>
  );
}

// ------------------------------------------------------------------ ·
//  Edge vine — full height with bell flowers every ~15 units.
// ------------------------------------------------------------------ ·

function EdgeVine({ side, opacity, scale }: { side: 'left' | 'right'; opacity: number; scale: number }) {
  const xBase = side === 'left' ? 4 : 96;
  const flipX = side === 'left' ? 1 : -1;

  const points = [
    { x: xBase + flipX * 0.5,  y: 14 },
    { x: xBase + flipX * 1.8,  y: 22 },
    { x: xBase + flipX * 1.2,  y: 30 },
    { x: xBase + flipX * 2.5,  y: 38 },
    { x: xBase + flipX * 1.5,  y: 46 },
    { x: xBase + flipX * 2.8,  y: 54 },
    { x: xBase + flipX * 1.8,  y: 62 },
    { x: xBase + flipX * 2.5,  y: 70 },
    { x: xBase + flipX * 1.2,  y: 78 },
    { x: xBase + flipX * 3.0,  y: 86 },
  ];

  return (
    <g opacity={opacity} transform={`scale(${scale})`} style={{ transformOrigin: '50% 50%' }}>
      {/* Main vine stem */}
      <path
        d={points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`)).join(' ')}
        fill="none"
        stroke={C.vine}
        strokeWidth={0.35}
        strokeLinecap="round"
        opacity={0.85}
      />

      {/* Sub-branches with leaves */}
      <VineSegment x1={points[0].x} y1={points[0].y} x2={points[0].x + flipX * 3}     y2={points[0].y - 4} leaves={2} />
      <VineSegment x1={points[1].x} y1={points[1].y} x2={points[1].x + flipX * 3.5}   y2={points[1].y - 3} leaves={2} />
      <VineSegment x1={points[2].x} y1={points[2].y} x2={points[2].x + flipX * 3}     y2={points[2].y + 4} leaves={2} />
      <VineSegment x1={points[3].x} y1={points[3].y} x2={points[3].x + flipX * 3.5}   y2={points[3].y - 2} leaves={2} />
      <VineSegment x1={points[4].x} y1={points[4].y} x2={points[4].x + flipX * 3}     y2={points[4].y + 3} leaves={2} />
      <VineSegment x1={points[5].x} y1={points[5].y} x2={points[5].x + flipX * 3.5}   y2={points[5].y - 4} leaves={2} />
      <VineSegment x1={points[6].x} y1={points[6].y} x2={points[6].x + flipX * 3}     y2={points[6].y + 2} leaves={2} />
      <VineSegment x1={points[7].x} y1={points[7].y} x2={points[7].x + flipX * 3.5}   y2={points[7].y - 3} leaves={2} />
      <VineSegment x1={points[8].x} y1={points[8].y} x2={points[8].x + flipX * 3}     y2={points[8].y + 4} leaves={2} />
      <VineSegment x1={points[9].x} y1={points[9].y} x2={points[9].x + flipX * 3.5}   y2={points[9].y - 2} leaves={2} />

      {/* Bell flowers along the edge */}
      <BellFlower cx={points[1].x + flipX * 2}   cy={points[1].y - 2}   scale={0.8}  hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />
      <BellFlower cx={points[3].x + flipX * 2.5} cy={points[3].y + 1}   scale={0.75} hue={C.flowerLit}  depth={C.flowerDeep} lit={C.flowerMain} />
      <BellFlower cx={points[5].x + flipX * 2}   cy={points[5].y - 2}   scale={0.85} hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />
      <BellFlower cx={points[7].x + flipX * 2.5} cy={points[7].y - 1}   scale={0.7}  hue={C.flowerLit}  depth={C.flowerDeep} lit={C.flowerMain} />
      <BellFlower cx={points[8].x + flipX * 2}   cy={points[8].y + 1}   scale={0.8}  hue={C.flowerMain} depth={C.flowerDeep} lit={C.flowerLit} />

      {/* Leaves directly on the main vine */}
      {points.slice(1).map((p, i) => (
        <Leaf
          key={`edge-leaf-${side}-${i}`}
          cx={p.x + flipX * 1.5} cy={p.y + 2}
          length={3 + Math.random() * 1.5} width={1.5 + Math.random() * 0.5}
          rotate={side === 'left' ? 30 + Math.random() * 30 : -30 - Math.random() * 30}
        />
      ))}

      {/* Buds */}
      <BellBud cx={points[2].x + flipX * 2} cy={points[2].y + 1} scale={0.4}  hue={C.flowerMain} depth={C.flowerDeep} />
      <BellBud cx={points[4].x + flipX * 2} cy={points[4].y - 1} scale={0.38} hue={C.flowerLit}  depth={C.flowerDeep} />
      <BellBud cx={points[6].x + flipX * 2} cy={points[6].y + 1} scale={0.42} hue={C.flowerMain} depth={C.flowerDeep} />
    </g>
  );
}

// ------------------------------------------------------------------ ·
//  Bottom strip — lighter garland.
// ------------------------------------------------------------------ ·

const BOTTOM_FLOWERS = [
  { x: 5,    s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 12,   s: 0.8,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 19,   s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 26,   s: 0.85, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 33,   s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 40,   s: 0.8,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 47,   s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 54,   s: 0.85, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 61,   s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 68,   s: 0.8,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 75,   s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 82,   s: 0.85, hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
  { x: 89,   s: 0.7,  hue: C.flowerMain, depth: C.flowerDeep, lit: C.flowerLit },
  { x: 96,   s: 0.6,  hue: C.flowerLit,  depth: C.flowerDeep, lit: C.flowerMain },
];

const BOTTOM_LEAVES = [
  { x: 3,    len: 3,   wid: 1.4, rot: 25 },
  { x: 9.5,  len: 3.2, wid: 1.5, rot: -20 },
  { x: 16,   len: 3,   wid: 1.4, rot: 22 },
  { x: 23,   len: 3.2, wid: 1.5, rot: -18 },
  { x: 30,   len: 3,   wid: 1.4, rot: 24 },
  { x: 37,   len: 3.2, wid: 1.5, rot: -22 },
  { x: 44,   len: 3,   wid: 1.4, rot: 20 },
  { x: 51,   len: 3.2, wid: 1.5, rot: -19 },
  { x: 58,   len: 3,   wid: 1.4, rot: 23 },
  { x: 65,   len: 3.2, wid: 1.5, rot: -21 },
  { x: 72,   len: 3,   wid: 1.4, rot: 22 },
  { x: 79,   len: 3.2, wid: 1.5, rot: -17 },
  { x: 86,   len: 3,   wid: 1.4, rot: 25 },
  { x: 93,   len: 3.2, wid: 1.5, rot: -20 },
];

function BottomStrip({ opacity, scale }: { opacity: number; scale: number }) {
  return (
    <g opacity={opacity} transform={`scale(${scale})`} style={{ transformOrigin: '50% 50%' }}>
      <path d="M 3 92 Q 25 89 50 91 Q 75 93 97 90" fill="none" stroke={C.vine} strokeWidth={0.25} strokeLinecap="round" opacity={0.7} />
      {BOTTOM_FLOWERS.map((f, i) => (
        <BellFlower key={`bot-flower-${i}`} cx={f.x} cy={90} scale={f.s} hue={f.hue} depth={f.depth} lit={f.lit} />
      ))}
      {BOTTOM_LEAVES.map((l, i) => (
        <Leaf key={`bot-leaf-${i}`} cx={l.x} cy={91.5} angle={l.x / 100} length={l.len} width={l.wid} rotate={l.rot} />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ ·
 *  Main component
 */

export const BotanicalScene: React.FC = () => {
  const { progress } = useScrollProgress();
  const effectiveProgress = progress;

  const topStrip     = getLayer('top-strip');
  const cornerL      = getLayer('top-left-corner');
  const cornerR      = getLayer('top-right-corner');
  const leftEdge     = getLayer('left-edge');
  const rightEdge    = getLayer('right-edge');
  const bottomStrip  = getLayer('bottom-strip');

  const phaseTop      = computePhase(effectiveProgress, topStrip);
  const phaseCornerL  = computePhase(effectiveProgress, cornerL);
  const phaseCornerR  = computePhase(effectiveProgress, cornerR);
  const phaseLeft     = computePhase(effectiveProgress, leftEdge);
  const phaseRight    = computePhase(effectiveProgress, rightEdge);
  const phaseBottom   = computePhase(effectiveProgress, bottomStrip);

  return (
    <div className="botanical-scene" aria-hidden="true">
      <svg
        className="botanical-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="bellShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0.2" dy="0.3" stdDeviation="0.3" floodColor="#000" floodOpacity="0.25" />
          </filter>
          <filter id="bellSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="leafTexture" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0.1" dy="0.15" stdDeviation="0.15" floodColor="#000" floodOpacity="0.18" />
          </filter>
          <filter id="stemSoft" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="0.25" />
          </filter>
          <radialGradient id="flowerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#c94b7a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c94b7a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Top strip — ALWAYS visible, grows on scroll */}
        <TopStrip opacity={phaseTop.opacity} scale={phaseTop.scale} />

        {/* Top-left corner */}
        <CornerCluster cx={2} cy={2} flipX={1} flipY={1} opacity={phaseCornerL.opacity} scale={phaseCornerL.scale} />

        {/* Top-right corner */}
        <CornerCluster cx={98} cy={2} flipX={-1} flipY={1} opacity={phaseCornerR.opacity} scale={phaseCornerR.scale} />

        {/* Left edge vine */}
        <EdgeVine side="left" opacity={phaseLeft.opacity} scale={phaseLeft.scale} />

        {/* Right edge vine */}
        <EdgeVine side="right" opacity={phaseRight.opacity} scale={phaseRight.scale} />

        {/* Bottom strip */}
        <BottomStrip opacity={phaseBottom.opacity} scale={phaseBottom.scale} />
      </svg>
    </div>
  );
}

export default BotanicalScene;
