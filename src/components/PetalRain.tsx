import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './PetalRain.css';

gsap.registerPlugin(ScrollTrigger);

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  sway: number;
  swaySpeed: number;
  swayWidth: number;
  angle: number;
  rotSpeed: number;
  flip: number;
  flipSpeed: number;
  opacity: number;
  colorLight: string;
  colorDark: string;
}

const COLOR_PALETTES = [
  { light: '#ffd1dc', dark: '#f28ba2' }, // soft blush rose
  { light: '#ffe4ea', dark: '#e6738f' }, // classic rose petal
  { light: '#fff0f3', dark: '#f7a8b8' }, // pale peach pink
  { light: '#fce4ec', dark: '#d85d7c' }, // deep romantic rose
];

export function PetalRain({ introDone = false }: { introDone?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  /* ---- Detect when user scrolls past hero section ---- */
  useEffect(() => {
    if (!introDone) return;

    const heroEl = document.getElementById('hero');
    if (!heroEl) {
      setActive(true);
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroEl,
        start: 'bottom 80%',
        onEnter: () => setActive(true),
        onLeaveBack: () => setActive(false),
      });
    });

    return () => ctx.revert();
  }, [introDone]);

  /* ---- Setup and animate canvas petals ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 12 : 22;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initialize petals with random positions and velocities (50% slower, 50% softer fade)
    const w = window.innerWidth;
    const h = window.innerHeight;
    const petals: Petal[] = [];

    for (let i = 0; i < count; i++) {
      const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
      petals.push({
        x: Math.random() * w,
        y: Math.random() * (h + 100) - 50,
        size: isMobile ? 8 + Math.random() * 7 : 10 + Math.random() * 10,
        speedY: 0.45 + Math.random() * 0.8,
        speedX: 0.1 + Math.random() * 0.35,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.01,
        swayWidth: 0.6 + Math.random() * 1.0,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.01 + Math.random() * 0.018,
        opacity: 0.28 + Math.random() * 0.22,
        colorLight: palette.light,
        colorDark: palette.dark,
      });
    }

    petalsRef.current = petals;

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (activeRef.current) {
        const cw = window.innerWidth;
        const ch = window.innerHeight;

        for (let i = 0; i < petals.length; i++) {
          const p = petals[i];

          // Update position
          p.sway += p.swaySpeed;
          p.x += Math.sin(p.sway) * p.swayWidth + p.speedX;
          p.y += p.speedY;
          p.angle += p.rotSpeed;
          p.flip += p.flipSpeed;

          // Recycle petal when it leaves screen
          if (p.y > ch + 40) {
            p.y = -30;
            p.x = Math.random() * (cw + 100) - 50;
          }
          if (p.x > cw + 40) {
            p.x = -30;
          }

          // Draw realistic 3D tumbling petal
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          // Scale X by cos(flip) to create authentic 3D spinning in the wind
          ctx.scale(Math.cos(p.flip), 1);
          ctx.globalAlpha = p.opacity;

          const grad = ctx.createLinearGradient(0, -p.size, 0, p.size);
          grad.addColorStop(0, p.colorLight);
          grad.addColorStop(1, p.colorDark);
          ctx.fillStyle = grad;

          // Curved organic rose petal shape
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.bezierCurveTo(p.size * 0.85, -p.size * 0.55, p.size * 0.75, p.size * 0.6, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.75, p.size * 0.6, -p.size * 0.85, -p.size * 0.55, 0, -p.size);
          ctx.closePath();
          ctx.fill();

          // Subtle central vein highlight for realism
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(0, -p.size * 0.75);
          ctx.quadraticCurveTo(p.size * 0.08, 0, 0, p.size * 0.65);
          ctx.stroke();

          ctx.restore();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={`petal-rain ${active ? 'petal-rain--active' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="petal-rain-canvas" />
    </div>
  );
}
