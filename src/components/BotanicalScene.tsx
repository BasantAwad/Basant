import React, { useRef, useEffect } from 'react';
import './BotanicalScene.css';

// ─── Flower image manifest ──────────────────────────────────────────────────

// Use only actual flowers, no leaves!
// floral-illustration_53876-91239.png (bouquet)
// roses-bloom_53876-89175.png (roses)
// Untitled design (4).png (pink flower)
// New collection of flowers (No single leaves/stems)
const CANOPY_FLOWERS = [
  // Top left massive cluster
  { src: 'flowers/processed/floral-illustration_53876-91239.png', x: 80, y: 140, rot: 15, size: 400, side: 'left' },
  { src: 'flowers/processed/baroque-bouquet-beautiful-garden-flowers-leaves-black-background-luxurious-pink-white-peonies-roses-tulips-luxury-design-172318794.png', x: 200, y: 160,  rot: -25, size: 350, side: 'left' },
  { src: 'flowers/processed/roses-bloom_53876-89175.png',         x: 80,  y: 300, rot: 10,  size: 300, side: 'left' },
  { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', x: 250, y: 300, rot: 215, size: 320, side: 'left' }, // Flipped (+180)
  
  // Top middle-left dense fill
  { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', x: 400, y: 150, rot: 205, size: 380, side: 'left' }, // Flipped (+180)
  { src: 'flowers/processed/floral-illustration_53876-91239.png',          x: 550, y: 180, rot: -10, size: 350, side: 'left' },
  { src: 'flowers/processed/roses-bloom_53876-89175.png',                  x: 450, y: 280, rot: -15, size: 280, side: 'left' },
  
  // Top Center dense fill (Moved up to fill the empty space and increased size)
  { src: 'flowers/processed/baroque-bouquet-beautiful-garden-flowers-leaves-black-background-luxurious-pink-white-peonies-roses-tulips-luxury-design-172318794.png', x: 750, y: 40, rot: -5, size: 550, side: 'left' },
  
  // Top middle-right dense fill
  { src: 'flowers/processed/baroque-bouquet-beautiful-garden-flowers-leaves-black-background-luxurious-pink-white-peonies-roses-tulips-luxury-design-172318794.png', x: 850, y: 160, rot: -45, size: 360, side: 'left' },
  { src: 'flowers/processed/roses-bloom_53876-89175.png',         x: 1000, y: 140,  rot: -15, size: 320, side: 'left' },
  { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', x: 900, y: 280, rot: 200, size: 300, side: 'left' }, // Flipped (+180)
  
  // Top right massive cluster
  { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', x: 280, y: 160, rot: 200, size: 380, side: 'right' }, // Flipped (+180)
  { src: 'flowers/processed/floral-illustration_53876-91239.png',          x: 120, y: 180, rot: -20, size: 450, side: 'right' },
  { src: 'flowers/processed/roses-bloom_53876-89175.png',                  x: 60,  y: 320, rot: -30, size: 300, side: 'right' },
  { src: 'flowers/processed/baroque-bouquet-beautiful-garden-flowers-leaves-black-background-luxurious-pink-white-peonies-roses-tulips-luxury-design-172318794.png', x: 200, y: 300, rot: 15, size: 350, side: 'right' },
  
  // Fill the circled gap on the right side
  { src: 'flowers/processed/floral-illustration_53876-91239.png', x: 450, y: 180, rot: -15, size: 400, side: 'right' },
  { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', x: 600, y: 150, rot: 210, size: 380, side: 'right' }, // Flipped (+180)
  { src: 'flowers/processed/baroque-bouquet-beautiful-garden-flowers-leaves-black-background-luxurious-pink-white-peonies-roses-tulips-luxury-design-172318794.png', x: 400, y: 330, rot: 10, size: 360, side: 'right' },
  { src: 'flowers/processed/roses-bloom_53876-89175.png', x: 550, y: 280, rot: -20, size: 300, side: 'right' },
  { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', x: 750, y: 120, rot: 225, size: 340, side: 'right' }, // Flipped (+180)
];

// Helper to generate a clustered bouquet at a specific Y percentage
// Base rotation of +90 degrees makes the bottom of the flower face left and the top face right.
// For the left wall, this means the bottom touches the wall, and the bloom points inwards.
// For the right wall, we use +90 degrees as well because CSS applies `scaleX(-1)`, which flips it.
function generateBouquet(yPct: number) {
  const baseRot = 90; 
  return [
    { src: 'flowers/processed/floral-illustration_53876-91239.png', y: yPct, offsetX: -60, rot: baseRot + 15, size: 380 },
    { src: 'flowers/processed/baroque-bouquet-beautiful-garden-flowers-leaves-black-background-luxurious-pink-white-peonies-roses-tulips-luxury-design-172318794.png', y: yPct - 2.5, offsetX: -20, rot: baseRot - 20, size: 350 },
    { src: 'flowers/processed/138813-blossom-real-flower-hq-image-free.png', y: yPct + 3, offsetX: -30, rot: baseRot + 10, size: 360 },
    { src: 'flowers/processed/roses-bloom_53876-89175.png', y: yPct + 1, offsetX: 80, rot: baseRot - 5, size: 280 }, // Sticks out further
  ];
}

const LEFT_FLOWERS = Array.from({ length: 6 }, (_, i) => (i + 1) * 15).flatMap(yPct => generateBouquet(yPct));
const RIGHT_FLOWERS = Array.from({ length: 6 }, (_, i) => (i + 1) * 15).flatMap(yPct => generateBouquet(yPct));

// ─── Hook: trigger bloom when element scrolls into view ─────────────────────
function useScrollBloom(containerRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Observe flowers
    const imgs = container.querySelectorAll<HTMLElement>('.botanical-img');
    const imgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add('botanical-img--visible');
            imgObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '300px 0px 300px 0px', threshold: 0 }
    );
    imgs.forEach((img) => imgObserver.observe(img));

    return () => {
      imgObserver.disconnect();
    };
  }, [containerRef]);
}

export const BotanicalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useScrollBloom(containerRef);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="botanical-scene" ref={containerRef} aria-hidden="true">
      
      {/* Top Canopy */}
      <div className="botanical-canopy">
        {CANOPY_FLOWERS.map((fl, i) => (
          <img
            key={`canopy-${i}`}
            src={fl.src}
            alt=""
            className="botanical-img botanical-canopy__flower"
            style={{
              [fl.side === 'right' ? 'right' : 'left']: `${fl.x}px`,
              top: `${fl.y}px`,
              width: `${fl.size}px`,
              transform: `translate(${fl.side === 'right' ? '50%' : '-50%'}, -50%) rotate(${fl.rot}deg)`,
              '--final-transform': `translate(${fl.side === 'right' ? '50%' : '-50%'}, -50%) rotate(${fl.rot}deg) scale(1)`,
              '--pre-transform': `translate(${fl.side === 'right' ? '50%' : '-50%'}, -50%) rotate(${fl.rot}deg) scale(0.2)`,
              '--bloom-delay': `${Math.random() * 0.4}s`,
              '--bloom-opacity': '0.9',
            } as React.CSSProperties}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>

      {/* Bottom Footer Photo (Repeating, high quality) */}
      <div 
        className="botanical-canopy" 
        style={{ 
          top: 'auto', 
          bottom: 0, 
          height: '149px', // Natural height of the cropped image
          width: '100%',
          backgroundImage: 'url("flowers/processed/footer.png")',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom left',
          backgroundSize: 'auto 100%', // Keep natural aspect ratio
          zIndex: 1,
          opacity: 1
        }} 
      />

      {/* Side cascading flowers (Only rendered on desktop for performance) */}
      {!isMobile && (
        <>
          <div className="botanical-sides botanical-sides--left">
            {LEFT_FLOWERS.map((fl, i) => (
              <img
                key={`left-${i}`}
                src={fl.src}
                className="botanical-img botanical-edge botanical-edge--left"
                style={{
                  top: `${fl.y}%`,
                  marginLeft: `${fl.offsetX}px`,
                  width: `${fl.size}px`,
                  height: 'auto',
                  '--pre-transform': `translateX(-50px) rotate(${fl.rot - 15}deg) scale(0.8)`,
                  '--final-transform': `translateX(0) rotate(${fl.rot}deg) scale(1)`,
                  '--bloom-opacity': '1',
                  '--bloom-delay': `${Math.random() * 0.4}s`
                } as React.CSSProperties}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
          
          <div className="botanical-sides botanical-sides--right">
            {RIGHT_FLOWERS.map((fl, i) => (
              <img
                key={`right-${i}`}
                src={fl.src}
                className="botanical-img botanical-edge botanical-edge--right"
                style={{
                  top: `${fl.y}%`,
                  marginRight: `${fl.offsetX}px`,
                  width: `${fl.size}px`,
                  height: 'auto',
                  '--pre-transform': `translateX(50px) rotate(${fl.rot + 15}deg) scale(-0.8, 0.8)`,
                  '--final-transform': `translateX(0) rotate(${fl.rot}deg) scale(-1, 1)`,
                  '--bloom-opacity': '1',
                  '--bloom-delay': `${Math.random() * 0.4}s`
                } as React.CSSProperties}
                alt=""
                loading="lazy"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
