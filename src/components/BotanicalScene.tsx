import { useRef, useEffect } from 'react';
import './BotanicalScene.css';

const STEM_VIDEO = '/flowers/i_need_more_indivual_stem_and.mp4';

const TOP = [
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '3%',   y: '7%',  w: '120px', h: 'auto', s: 0.9, d: 0 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '7.5%', y: '5.5%', w: '95px',  h: 'auto', s: 0.75, d: 0.08 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '12%',  y: '6.5%', w: '90px',  h: 'auto', s: 0.8,  d: 0.16 },
  { src: '/flowers/Untitled design (1).png',            x: '16.5%', y: '7%',  w: '85px',  h: 'auto', s: 0.7,  d: 0.24 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '21%',  y: '8%',  w: '100px', h: 'auto', s: 0.85, d: 0.32 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '25.5%', y: '6%', w: '80px',  h: 'auto', s: 0.7,  d: 0.4 },
  { src: '/flowers/Untitled design (2).png',            x: '30%',  y: '7.5%', w: '85px',  h: 'auto', s: 0.75, d: 0.48 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '34.5%', y: '5.5%', w: '95px',  h: 'auto', s: 0.8,  d: 0.56 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '39%',  y: '7%',  w: '90px',  h: 'auto', s: 0.75, d: 0.64 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '43.5%', y: '6%', w: '100px', h: 'auto', s: 0.9,  d: 0.72 },
  { src: '/flowers/Untitled design (3).png',            x: '48%',  y: '7.5%', w: '80px',  h: 'auto', s: 0.7,  d: 0.8 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '52.5%', y: '5.5%', w: '90px',  h: 'auto', s: 0.8,  d: 0.88 },
  { src: '/flowers/Gemini_Generated_Image_hxtww5hxtww5hxtw.jfif', x: '57%', y: '7%', w: '110px', h: 'auto', s: 0.85, d: 0.96 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '62%',  y: '6%', w: '95px',  h: 'auto', s: 0.8,  d: 1.04 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '66.5%', y: '7.5%', w: '80px',  h: 'auto', s: 0.7,  d: 1.12 },
  { src: '/flowers/Untitled design (4).png',            x: '71%',  y: '6%', w: '85px',  h: 'auto', s: 0.75, d: 1.2 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '75.5%', y: '5.5%', w: '95px',  h: 'auto', s: 0.8,  d: 1.28 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '80%',  y: '7%', w: '90px',  h: 'auto', s: 0.75, d: 1.36 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '84.5%', y: '6%', w: '100px', h: 'auto', s: 0.9,  d: 1.44 },
  { src: '/flowers/Untitled design (5).png',            x: '89%',  y: '7.5%', w: '80px',  h: 'auto', s: 0.7,  d: 1.52 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '93.5%', y: '5.5%', w: '90px',  h: 'auto', s: 0.8,  d: 1.6 },
  { src: '/flowers/Untitled design (6).png',             x: '97%',  y: '7%',  w: '85px',  h: 'auto', s: 0.75, d: 1.68 },
];
const CORNER_TL = [
  { src: '/flowers/Gemini_Generated_Image_hxtww5hxtww5hxtw.jfif', x: '-3%',  y: '-3%', w: '160px', h: 'auto', s: 1.05, d: 0.5 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '1%',   y: '0%',  w: '110px', h: 'auto', s: 0.9,  d: 0.8 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '-1%',  y: '3%',  w: '90px',  h: 'auto', s: 0.8,  d: 1.1 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '2%',   y: '-2%', w: '100px', h: 'auto', s: 0.9,  d: 1.4 },
  { src: '/flowers/Untitled design (7).png',            x: '3%',   y: '2%',  w: '85px',  h: 'auto', s: 0.75, d: 1.7 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '0%',   y: '4%',  w: '80px',  h: 'auto', s: 0.7,  d: 2.0 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '-2%',  y: '1%',  w: '90px',  h: 'auto', s: 0.8,  d: 2.3 },
];
const CORNER_TR = [
  { src: '/flowers/Gemini_Generated_Image_hxtww5hxtww5hxtw.jfif', x: '98%',  y: '-4%', w: '160px', h: 'auto', s: 1.05, d: 0.5 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '96%',  y: '0%',  w: '110px', h: 'auto', s: 0.9,  d: 0.8 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '100%', y: '-2%', w: '100px', h: 'auto', s: 0.9,  d: 1.1 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '97%',  y: '3%',  w: '80px',  h: 'auto', s: 0.7,  d: 1.4 },
  { src: '/flowers/Untitled design (6).png',             x: '96%',  y: '2%',  w: '85px',  h: 'auto', s: 0.75, d: 1.7 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '99%',  y: '4%',  w: '90px',  h: 'auto', s: 0.8,  d: 2.0 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '101%', y: '1%',  w: '90px',  h: 'auto', s: 0.8,  d: 2.3 },
];
const LEFT_EDGE = [
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '-4%',  y: '18%', w: '85px',  h: 'auto', s: 0.8, d: 2.8 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '-5%',  y: '30%', w: '95px',  h: 'auto', s: 0.85, d: 3.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '-3%',  y: '42%', w: '80px',  h: 'auto', s: 0.75, d: 3.6 },
  { src: '/flowers/Untitled design (2).png',             x: '-5%',  y: '54%', w: '85px',  h: 'auto', s: 0.8,  d: 4.0 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '-4%',  y: '66%', w: '95px',  h: 'auto', s: 0.85, d: 4.4 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '-5%',  y: '78%', w: '80px',  h: 'auto', s: 0.7,  d: 4.8 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '-4%',  y: '90%', w: '90px',  h: 'auto', s: 0.8,  d: 5.2 },
  { src: '/flowers/Untitled design (4).png',             x: '-5%',  y: '95%', w: '85px',  h: 'auto', s: 0.75, d: 5.6 },
];
const RIGHT_EDGE = [
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '104%', y: '18%', w: '85px',  h: 'auto', s: 0.8, d: 2.8 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '105%', y: '30%', w: '95px',  h: 'auto', s: 0.85, d: 3.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '103%', y: '42%', w: '80px',  h: 'auto', s: 0.75, d: 3.6 },
  { src: '/flowers/Untitled design (3).png',             x: '105%', y: '54%', w: '85px',  h: 'auto', s: 0.8,  d: 4.0 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '104%', y: '66%', w: '95px',  h: 'auto', s: 0.85, d: 4.4 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '105%', y: '78%', w: '80px',  h: 'auto', s: 0.7,  d: 4.8 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '104%', y: '90%', w: '90px',  h: 'auto', s: 0.8,  d: 5.2 },
  { src: '/flowers/Untitled design (5).png',             x: '105%', y: '95%', w: '85px',  h: 'auto', s: 0.75, d: 5.6 },
];
const BOTTOM = [
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '4%',   y: '93%', w: '80px',  h: 'auto', s: 0.7, d: 6.0 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '13%',  y: '94%', w: '75px',  h: 'auto', s: 0.65, d: 6.3 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '22%',  y: '93%', w: '90px',  h: 'auto', s: 0.75, d: 6.6 },
  { src: '/flowers/Untitled design (1).png',            x: '31%',  y: '94%', w: '80px',  h: 'auto', s: 0.7,  d: 6.9 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '40%',  y: '93%', w: '75px',  h: 'auto', s: 0.65, d: 7.2 },
  { src: '/flowers/floral-illustration_53876-91239.png',   x: '49%',  y: '94%', w: '90px',  h: 'auto', s: 0.8,  d: 7.5 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '58%',  y: '93%', w: '80px',  h: 'auto', s: 0.7,  d: 7.8 },
  { src: '/flowers/roses-bloom_53876-89175.png',         x: '67%',  y: '94%', w: '90px',  h: 'auto', s: 0.75, d: 8.1 },
  { src: '/flowers/Untitled design (6).png',             x: '76%',  y: '93%', w: '80px',  h: 'auto', s: 0.7,  d: 8.4 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '85%',  y: '94%', w: '75px',  h: 'auto', s: 0.65, d: 8.7 },
  { src: '/flowers/Gemini_Generated_Image_hxtww5hxtww5hxtw.jfif', x: '94%', y: '93%', w: '95px', h: 'auto', s: 0.8,  d: 9.0 },
  { src: '/flowers/Untitled design (7).png',            x: '98%',  y: '94%', w: '80px',  h: 'auto', s: 0.7,  d: 9.3 },
];
const LEAVES = [
  { src: '/flowers/roses-bloom_53876-89175.png', x: '5.5%',  y: '10.5%', w: '50px', h: 'auto', d: 3.5 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '10%',  y: '9%',   w: '45px', h: 'auto', d: 3.8 },
  { src: '/flowers/Untitled design (3).png', x: '14.5%', y: '10%',   w: '50px', h: 'auto', d: 4.1 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '19%',  y: '11%',  w: '45px', h: 'auto', d: 4.4 },
  { src: '/flowers/floral-illustration_53876-91239.png', x: '23.5%', y: '9%',   w: '50px', h: 'auto', d: 4.7 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '28%',  y: '10.5%', w: '45px', h: 'auto', d: 5.0 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '32.5%', y: '9%',   w: '50px', h: 'auto', d: 5.3 },
  { src: '/flowers/Untitled design (4).png', x: '37%',  y: '10.5%', w: '45px', h: 'auto', d: 5.6 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '41.5%', y: '9%',   w: '50px', h: 'auto', d: 5.9 },
  { src: '/flowers/floral-illustration_53876-91239.png', x: '46%',  y: '10.5%', w: '45px', h: 'auto', d: 6.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '50.5%', y: '9%',   w: '50px', h: 'auto', d: 6.5 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '55%',  y: '10.5%', w: '45px', h: 'auto', d: 6.8 },
  { src: '/flowers/Gemini_Generated_Image_hxtww5hxtww5hxtw.jfif', x: '59.5%', y: '9%', w: '50px', h: 'auto', d: 7.1 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '64%',  y: '10.5%', w: '45px', h: 'auto', d: 7.4 },
  { src: '/flowers/Untitled design (5).png', x: '68.5%', y: '9%',   w: '50px', h: 'auto', d: 7.7 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '73%',  y: '10.5%', w: '45px', h: 'auto', d: 8.0 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '77.5%', y: '9%',   w: '50px', h: 'auto', d: 8.3 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '82%',  y: '10.5%', w: '45px', h: 'auto', d: 8.6 },
  { src: '/flowers/floral-illustration_53876-91239.png', x: '86.5%', y: '9%',   w: '50px', h: 'auto', d: 8.9 },
  { src: '/flowers/Untitled design (6).png', x: '91%',  y: '10.5%', w: '45px', h: 'auto', d: 9.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '95.5%', y: '9%',   w: '50px', h: 'auto', d: 9.5 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '-3%',  y: '24%', w: '45px', h: 'auto', d: 10.0 },
  { src: '/flowers/Untitled design (2).png', x: '-4%',  y: '36%', w: '40px', h: 'auto', d: 10.4 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '-3%',  y: '48%', w: '45px', h: 'auto', d: 10.8 },
  { src: '/flowers/floral-illustration_53876-91239.png', x: '-4%',  y: '60%', w: '40px', h: 'auto', d: 11.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '-3%',  y: '72%', w: '45px', h: 'auto', d: 11.6 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '-4%',  y: '84%', w: '40px', h: 'auto', d: 12.0 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '103%', y: '24%', w: '45px', h: 'auto', d: 10.0 },
  { src: '/flowers/floral-illustration_53876-91239.png', x: '104%', y: '36%', w: '40px', h: 'auto', d: 10.4 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '103%', y: '48%', w: '45px', h: 'auto', d: 10.8 },
  { src: '/flowers/Untitled design (3).png', x: '104%', y: '60%', w: '40px', h: 'auto', d: 11.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '103%', y: '72%', w: '45px', h: 'auto', d: 11.6 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '104%', y: '84%', w: '40px', h: 'auto', d: 12.0 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '8%',   y: '96%', w: '45px', h: 'auto', d: 12.5 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '17%',  y: '97%', w: '50px', h: 'auto', d: 12.8 },
  { src: '/flowers/Untitled design (4).png', x: '26%',  y: '96%', w: '45px', h: 'auto', d: 13.1 },
  { src: '/flowers/floral-illustration_53876-91239.png', x: '35%',  y: '97%', w: '50px', h: 'auto', d: 13.4 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '44%',  y: '96%', w: '45px', h: 'auto', d: 13.7 },
  { src: '/flowers/vintage-flower-drawings_53876-89847.png',   x: '53%',  y: '97%', w: '50px', h: 'auto', d: 14.0 },
  { src: '/flowers/roses-bloom_53876-89175.png', x: '62%',  y: '96%', w: '45px', h: 'auto', d: 14.3 },
  { src: '/flowers/Untitled design (5).png', x: '71%',  y: '97%', w: '50px', h: 'auto', d: 14.6 },
  { src: '/flowers/vintage-flower-drawings_53876-89171.png', x: '80%',  y: '96%', w: '45px', h: 'auto', d: 14.9 },
  { src: '/flowers/Gemini_Generated_Image_hxtww5hxtww5hxtw.jfif', x: '89%', y: '97%', w: '50px', h: 'auto', d: 15.2 },
  { src: '/flowers/vintage-flower-drawings_53876-89194.png',   x: '97%',  y: '96%', w: '45px', h: 'auto', d: 15.5 },
];

export const BotanicalScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const video = container.querySelector<HTMLVideoElement>('video.botanical-stem-video');
    if (!video) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { video.play().catch(() => {}); } else { video.pause(); }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="botanical-scene" ref={containerRef} aria-hidden="true">
      <video
        key="stem"
        className="botanical-stem-video"
        src={STEM_VIDEO}
        muted
        loop
        playsInline
        preload="metadata"
      />
      {TOP.map((f, i) => (
        <img
          key={`top-${i}`}
          className="botanical-img"
          src={f.src}
          alt=""
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            transform: `scale(${f.s}) rotate(${Math.sin(parseFloat(f.x)*13.7+parseFloat(f.y)*7.3)*50}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
          }}
        />
      ))}
      {CORNER_TL.map((f, i) => (
        <img
          key={`ctl-${i}`}
          className="botanical-img"
          src={f.src}
          alt=""
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            transform: `scale(${f.s}) rotate(${Math.sin(parseFloat(f.x)*13.7+parseFloat(f.y)*7.3)*60-30}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
          }}
        />
      ))}
      {CORNER_TR.map((f, i) => (
        <img
          key={`ctr-${i}`}
          className="botanical-img"
          src={f.src}
          alt=""
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            transform: `scale(${f.s}) rotate(${Math.sin(parseFloat(f.x)*13.7+parseFloat(f.y)*7.3)*60+30}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
          }}
        />
      ))}
      {LEFT_EDGE.map((f, i) => (
        <img
          key={`lfe-${i}`}
          className="botanical-img"
          src={f.src}
          alt=""
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            transform: `scale(${f.s}) rotate(${Math.sin(parseFloat(f.x)*13.7+parseFloat(f.y)*7.3)*50-20}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
          }}
        />
      ))}
      {RIGHT_EDGE.map((f, i) => (
        <img
          key={`rfe-${i}`}
          className="botanical-img"
          src={f.src}
          alt=""
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            transform: `scale(${f.s}) rotate(${Math.sin(parseFloat(f.x)*13.7+parseFloat(f.y)*7.3)*50+20}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
          }}
        />
      ))}
      {BOTTOM.map((f, i) => (
        <img
          key={`bot-${i}`}
          className="botanical-img"
          src={f.src}
          alt=""
          style={{
            left: f.x, top: f.y, width: f.w, height: f.h,
            transform: `scale(${f.s}) rotate(${Math.sin(parseFloat(f.x)*13.7+parseFloat(f.y)*7.3)*40}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
          }}
        />
      ))}
      {LEAVES.map((l, i) => (
        <img
          key={`leaf-${i}`}
          className="botanical-img botanical-leaf"
          src={l.src}
          alt=""
          style={{
            left: l.x, top: l.y, width: l.w, height: l.h,
            transform: `scale(0.7) rotate(${Math.sin(parseFloat(l.x)*13.7+parseFloat(l.y)*7.3)*60}deg)`,
            transformOrigin: 'center center',
            opacity: 0, willChange: 'transform, opacity',
            filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))',
          }}
        />
      ))}
    </div>
  );
};
