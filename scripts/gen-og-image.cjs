#!/usr/bin/env node
/** Generate og-image.png — 1200x630 portrait with botanical frame + name. */
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1200, H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// --- background ---
const bg = '#0e0c16';
ctx.fillStyle = bg;
ctx.fillRect(0, 0, W, H);

// --- subtle vertical gradient ---
const g = ctx.createLinearGradient(0, 0, 0, H);
g.addColorStop(0, 'rgba(44,13,48,0.18)');
g.addColorStop(0.5, 'rgba(20,40,28,0.12)');
g.addColorStop(1, 'rgba(16,12,28,0.22)');
ctx.fillStyle = g;
ctx.fillRect(0, 0, W, H);

/** Draw a bell flower at (x,y) with given radius and palette override. */
function flower(x, y, r, hue, deep, lit, throat, t = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1 + 0.08 * Math.sin(t * 0.6 + x), 1 + 0.08 * Math.cos(t * 0.6 + x * 0.7));
  // stem
  ctx.strokeStyle = '#4a5a3a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(0, r * 0.9);
  ctx.quadraticCurveTo(r * 0.4, r * 0.6, r * 0.2, r * 0.2);
  ctx.stroke();
  // bell body
  ctx.beginPath();
  ctx.moveTo(-r, r * 0.1);
  ctx.quadraticCurveTo(-r * 1.15, -r * 0.45, -r * 0.55, -r);
  ctx.lineTo(-r * 0.4, -r * 1.2);
  ctx.lineTo(-r * 0.2, -r);
  ctx.quadraticCurveTo(0, -r * 1.05, r * 0.2, -r);
  ctx.lineTo(r * 0.4, -r * 1.2);
  ctx.lineTo(r * 0.55, -r);
  ctx.quadraticCurveTo(r * 1.15, -r * 0.45, r, r * 0.1);
  ctx.closePath();
  ctx.fillStyle = hue;
  ctx.fill();
  ctx.strokeStyle = deep;
  ctx.lineWidth = 1.0;
  ctx.stroke();
  // highlight
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, -r * 0.15);
  ctx.quadraticCurveTo(-r * 0.5, -r * 0.5, -r * 0.35, -r * 0.95);
  ctx.lineTo(-r * 0.15, -r * 0.95);
  ctx.quadraticCurveTo(-r * 0.1, -r * 0.5, -r * 0.2, -r * 0.15);
  ctx.closePath();
  ctx.fillStyle = lit;
  ctx.globalAlpha = 0.55;
  ctx.fill();
  ctx.globalAlpha = 1;
  // throat
  ctx.beginPath();
  ctx.arc(0, -r * 0.85, r * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = throat;
  ctx.fill();
  // stamens
  ctx.strokeStyle = '#f5eae0';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(-r * 0.55, -r * 0.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.85);
  ctx.lineTo(r * 0.5, -r * 0.52);
  ctx.stroke();
  // sepals
  ctx.fillStyle = deep;
  ctx.strokeStyle = '#2e3a22';
  ctx.lineWidth = 0.6;
  ctx.beginPath();
  ctx.moveTo(-r * 0.45, r * 0.1);
  ctx.quadraticCurveTo(-r * 0.8, -r * 0.15, -r * 0.65, r * 0.05);
  ctx.lineTo(-r * 0.35, r * 0.15);
  ctx.quadraticCurveTo(0, r * 0.05, r * 0.35, r * 0.15);
  ctx.lineTo(r * 0.65, r * 0.05);
  ctx.quadraticCurveTo(r * 0.8, -r * 0.15, r * 0.45, r * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** Draw a leaf at (x,y). */
function leaf(x, y, len, wid, rot, dark, light) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((rot * Math.PI) / 180);
  ctx.beginPath();
  const w = wid;
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w * 0.6, -len * 0.35, -w * 0.85, -len * 0.7, -w * 0.35, -len * 1.15);
  ctx.bezierCurveTo(0, -len * 1.15, w * 0.35, -len * 1.15, w * 0.85, -len * 0.7);
  ctx.bezierCurveTo(w * 0.6, -len * 0.35, 0, 0, 0, 0);
  ctx.closePath();
  ctx.fillStyle = dark;
  ctx.fill();
  ctx.strokeStyle = light;
  ctx.lineWidth = 0.7;
  ctx.stroke();
  // midrib
  ctx.strokeStyle = '#6a7a4a';
  ctx.lineWidth = 0.6;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-w * 0.08, -len * 1.1);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();
}

/* ---- Top strip: dense row of bell flowers + leaves + buds ---- */
const topFlowers = [
  [60,  70, 26, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [110, 60, 30, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [165, 76, 22, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [215, 56, 28, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [270, 70, 24, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [320, 64, 29, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [378, 74, 22, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [425, 58, 31, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [480, 70, 25, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [530, 62, 27, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [580, 75, 23, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [630, 58, 28, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [682, 72, 24, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [735, 64, 29, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [785, 76, 23, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [835, 58, 28, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [890, 70, 25, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [945, 64, 30, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [1000, 72, 24, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
];

const topLeaves = [
  [30, 38, 26, 11, -28],
  [80, 32, 30, 13, 22],
  [130, 38, 26, 11, -25],
  [180, 32, 30, 13, 24],
  [230, 38, 26, 11, -27],
  [280, 32, 30, 13, 21],
  [330, 38, 26, 11, -24],
  [380, 32, 30, 13, 26],
  [430, 38, 26, 11, -28],
  [480, 32, 30, 13, 22],
  [530, 38, 26, 11, -25],
  [580, 32, 30, 13, 24],
  [630, 38, 26, 11, -27],
  [680, 32, 30, 13, 21],
  [730, 38, 26, 11, -24],
  [780, 32, 30, 13, 26],
  [830, 38, 26, 11, -28],
  [880, 32, 30, 13, 22],
  [930, 38, 26, 11, -25],
  [980, 32, 30, 13, 24],
  [1030, 38, 26, 11, -27],
];

const topStrandLeaves = [
  [40, 108, 22, 9, 18],
  [90, 110, 24, 10, -15],
  [140, 106, 22, 9, 22],
  [190, 110, 24, 10, -18],
  [240, 108, 22, 9, 16],
  [290, 110, 24, 10, -20],
  [340, 106, 22, 9, 24],
  [390, 110, 24, 10, -14],
  [440, 108, 22, 9, 19],
  [490, 110, 24, 10, -17],
  [540, 106, 22, 9, 21],
  [590, 110, 24, 10, -15],
  [640, 108, 22, 9, 18],
  [690, 110, 24, 10, -22],
  [740, 106, 22, 9, 17],
  [790, 110, 24, 10, -19],
  [840, 108, 22, 9, 20],
  [890, 110, 24, 10, -16],
  [940, 106, 22, 9, 23],
  [990, 110, 24, 10, -18],
  [1040, 108, 22, 9, 16],
];

const topBuds = [
  [70, 105, 10],
  [130, 108, 9],
  [200, 105, 11],
  [260, 108, 9],
  [330, 105, 10],
  [390, 108, 9],
  [460, 105, 11],
  [520, 108, 9],
  [590, 105, 10],
  [650, 108, 9],
  [720, 105, 11],
  [780, 108, 9],
  [850, 105, 10],
  [920, 108, 9],
  [990, 105, 11],
  [1050, 108, 9],
];

/* ---- corners ---- */
const cornerLFlowers = [
  [32, 40, 22, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [52, 32, 24, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [22, 24, 20, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [60, 22, 21, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [14, 30, 18, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [68, 30, 19, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
];
const cornerLLeaves = [
  [14, 12, 22, 9, -50],
  [22, 8, 20, 8, -72],
  [36, 10, 24, 10, 48],
  [48, 8, 22, 9, 32],
  [10, 18, 20, 8, -38],
  [58, 14, 22, 9, 42],
];
const cornerLBuds = [
  [26, 18, 10],
  [50, 16, 9],
  [58, 24, 9],
  [30, 26, 8],
];

const cornerRFlowers = [
  [1140, 40, 22, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [1160, 32, 24, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [1150, 24, 20, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [1132, 22, 21, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  [1168, 30, 19, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
  [1140, 30, 18, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
];
const cornerRLeaves = [
  [1156, 12, 22, 9, 50],
  [1150, 8, 20, 8, 72],
  [1136, 10, 24, 10, -48],
  [1122, 8, 22, 9, -32],
  [1160, 18, 20, 8, 38],
  [1114, 14, 22, 9, -42],
];
const cornerRBuds = [
  [1144, 18, 10],
  [1126, 16, 9],
  [1144, 24, 9],
  [1150, 26, 8],
];

/* ---- side vines ---- */
function sideVine(side) {
  const xBase = side === 'left' ? 40 : 1160;
  const flipX = side === 'left' ? 1 : -1;
  const pts = [
    [xBase + flipX * 8, 120],
    [xBase + flipX * 22, 150],
    [xBase + flipX * 18, 185],
    [xBase + flipX * 30, 215],
    [xBase + flipX * 20, 250],
    [xBase + flipX * 34, 285],
    [xBase + flipX * 22, 320],
    [xBase + flipX * 30, 355],
    [xBase + flipX * 18, 390],
    [xBase + flipX * 36, 425],
  ];
  // stem
  ctx.strokeStyle = '#4a3a2a';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.stroke();
  // small branches + leaves
  for (let i = 0; i < pts.length; i++) {
    const [px, py] = pts[i];
    const bx = px + flipX * (6 + Math.random() * 8);
    const by = py + (i % 2 === 0 ? -12 : 10);
    ctx.strokeStyle = '#4a3a2a';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo((px + bx) / 2 + flipX * 4, (py + by) / 2, bx, by);
    ctx.stroke();
    leaf(bx + flipX * 6, by + (i % 2 === 0 ? 4 : -4), 14 + Math.random() * 4, 6 + Math.random() * 2, (i % 2 === 0 ? 28 : -28) + (Math.random() * 20 - 10), '#2e3a22', '#5a6a3a');
  }
  // bell flowers along the vine
  const foci = [
    [pts[1][0] + flipX * 14, pts[1][1] - 8, 13, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
    [pts[2][0] + flipX * 16, pts[2][1] + 4, 14, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
    [pts[3][0] + flipX * 14, pts[3][1] - 6, 13, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
    [pts[4][0] + flipX * 16, pts[4][1] + 4, 14, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
    [pts[5][0] + flipX * 14, pts[5][1] - 8, 13, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
    [pts[6][0] + flipX * 16, pts[6][1] + 4, 14, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
    [pts[7][0] + flipX * 14, pts[7][1] - 6, 13, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
    [pts[8][0] + flipX * 16, pts[8][1] + 4, 14, '#e87a9a', '#a0345a', '#c94b7a', '#6a1a3a'],
    [pts[9][0] + flipX * 14, pts[9][1] - 8, 13, '#c94b7a', '#a0345a', '#e87a9a', '#6a1a3a'],
  ];
  foci.forEach(([x, y, r, ...rest]) => flower(x, y, r, ...rest));
  // buds
  [
    [pts[1][0] + flipX * 18, pts[1][1] - 4, 7, '#c94b7a', '#a0345a'],
    [pts[3][0] + flipX * 18, pts[3][1] + 2, 7, '#e87a9a', '#a0345a'],
    [pts[5][0] + flipX * 18, pts[5][1] - 4, 7, '#c94b7a', '#a0345a'],
    [pts[7][0] + flipX * 18, pts[7][1] + 2, 7, '#e87a9a', '#a0345a'],
  ].forEach(([x, y, r, hue, deep]) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.ellipse(0, r * 0.4, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = hue;
    ctx.fill();
    ctx.strokeStyle = deep;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  });
}

/* ---- bottom strip ---- */
const bottomFlowers = [
  [60,  575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [120, 568, 20, '#e87a9a', '#a0345a', '#c94b7a'],
  [185, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [250, 565, 22, '#e87a9a', '#a0345a', '#c94b7a'],
  [320, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [385, 568, 20, '#e87a9a', '#a0345a', '#c94b7a'],
  [450, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [515, 565, 22, '#e87a9a', '#a0345a', '#c94b7a'],
  [585, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [650, 568, 20, '#e87a9a', '#a0345a', '#c94b7a'],
  [720, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [790, 565, 22, '#e87a9a', '#a0345a', '#c94b7a'],
  [855, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
  [920, 568, 20, '#e87a9a', '#a0345a', '#c94b7a'],
  [985, 575, 18, '#c94b7a', '#a0345a', '#e87a9a'],
];
const bottomLeaves = [
  [30, 590, 15, 6, 22],
  [90, 588, 16, 7, -18],
  [150, 590, 15, 6, 20],
  [210, 588, 16, 7, -16],
  [270, 590, 15, 6, 22],
  [330, 588, 16, 7, -19],
  [390, 590, 15, 6, 18],
  [450, 588, 16, 7, -17],
  [510, 590, 15, 6, 21],
  [570, 588, 16, 7, -20],
  [630, 590, 15, 6, 19],
  [690, 588, 16, 7, -16],
  [750, 590, 15, 6, 22],
  [810, 588, 16, 7, -18],
  [870, 590, 15, 6, 20],
  [930, 588, 16, 7, -17],
  [990, 590, 15, 6, 19],
];

/* ---- render everything ---- */
const t = 0;
ctx.textBaseline = 'alphabetic';

// Top strip flowers
topFlowers.forEach(([x, y, r, ...c]) => flower(x, y, r, ...c));

// Top strip leaves (top + strand)
topLeaves.forEach(([x, y, len, w, rot]) => leaf(x, y, len, w, rot, '#2e3a22', '#5a6a3a'));
topStrandLeaves.forEach(([x, y, len, w, rot]) => leaf(x, y, len, w, rot, '#2e3a22', '#5a6a3a'));

// Top strip buds
topBuds.forEach(([x, y, r, hue, deep]) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = hue || '#c94b7a';
  ctx.fill();
  ctx.strokeStyle = deep || '#a0345a';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
});

// Corners
cornerLFlowers.forEach(([x, y, r, ...c]) => flower(x, y, r, ...c));
cornerLLeaves.forEach(([x, y, len, w, rot]) => leaf(x, y, len, w, rot, '#2e3a22', '#5a6a3a'));
cornerLBuds.forEach(([x, y, r, hue, deep]) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = hue;
  ctx.fill();
  ctx.strokeStyle = deep;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
});

cornerRFlowers.forEach(([x, y, r, ...c]) => flower(x, y, r, ...c));
cornerRLeaves.forEach(([x, y, len, w, rot]) => leaf(x, y, len, w, rot, '#2e3a22', '#5a6a3a'));
cornerRBuds.forEach(([x, y, r, hue, deep]) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.ellipse(0, r * 0.4, r * 0.5, r * 0.45, 0, 0, Math.PI * 2);
  ctx.fillStyle = hue;
  ctx.fill();
  ctx.strokeStyle = deep;
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
});

// Side vines
sideVine('left');
sideVine('right');

// Bottom strip
bottomFlowers.forEach(([x, y, r, ...c]) => flower(x, y, r, ...c));
bottomLeaves.forEach(([x, y, len, w, rot]) => leaf(x, y, len, w, rot, '#2e3a22', '#5a6a3a'));

/* ---- text ---- */
ctx.textBaseline = 'alphabetic';

// name
const nameX = 580, nameY = 300;
ctx.font = '800 64px "Cormorant Garamond", Georgia, serif';
ctx.textAlign = 'center';
ctx.fillStyle = '#f5eae0';
ctx.fillText('Basant Awad Mohamed', nameX, nameY);

// title
ctx.font = '400 30px "Cormorant Garamond", Georgia, serif';
ctx.fillStyle = '#e87a9a';
ctx.fillText('Backend Software Engineer', nameX, nameY + 50);

// location
ctx.font = '400 22px "Cormorant Garamond", Georgia, serif';
ctx.fillStyle = '#b8a0b0';
ctx.fillText('Alexandria, Egypt  ·  Open to relocation', nameX, nameY + 90);

// tagline
ctx.font = '400 24px "Cormorant Garamond", Georgia, serif';
ctx.fillStyle = '#c94b7a';
ctx.fillText('Designing reliable systems that connect data, intelligence, and people.', nameX, nameY + 135);

// small bottom note
ctx.font = '400 16px "Cormorant Garamond", Georgia, serif';
ctx.fillStyle = '#807080';
ctx.fillText('Nocturne Botanica · A Garden in Progress', nameX, nameY + 175);

const outPath = path.join(__dirname, 'public', 'og-image.png');
const buf = canvas.toBuffer('image/png');
fs.writeFileSync(outPath, buf);
console.log('OK: wrote', outPath, '(' + buf.length + ' bytes)');
