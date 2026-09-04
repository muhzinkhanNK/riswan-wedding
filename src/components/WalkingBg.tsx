import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './WalkingBg.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Config ---------- */
const MOBILE_BREAKPOINT = 768;
const WALKING_TOTAL_FRAMES = 117;
const INITIAL_BATCH = 15;

function getWalkingFramePath(isMobile: boolean, i: number): string {
  const folder = isMobile ? '/images/new/walkingmobile' : '/images/new/walkingpc';
  return `${folder}/ezgif-frame-${String(i).padStart(3, '0')}.webp`;
}

function checkIsMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const canvas = ctx.canvas;
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;

  const canvasRatio = cw / ch;
  const imgRatio = iw / ih;

  let renderW = cw;
  let renderH = ch;
  let offsetX = 0;
  let offsetY = 0;

  if (imgRatio > canvasRatio) {
    renderH = ch;
    renderW = ch * imgRatio;
    offsetX = (cw - renderW) / 2;
  } else {
    renderW = cw;
    renderH = cw / imgRatio;
    offsetY = (ch - renderH) / 2;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
}

/* ---------- Component ---------- */
interface WalkingBgProps {
  visible?: boolean;
}

export function WalkingBg({ visible = false }: WalkingBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [mobileMode, setMobileMode] = useState(() => checkIsMobile());
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameIdxRef = useRef<number>(0);

  /* ---- Draw current frame to canvas ---- */
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    currentFrameIdxRef.current = frameIdx;
    const img = framesRef.current[frameIdx];

    if (img && img.complete && img.naturalWidth > 0) {
      drawImageCover(ctx, img);
    } else if (img) {
      img.onload = () => {
        if (currentFrameIdxRef.current === frameIdx) {
          drawImageCover(ctx, img);
        }
      };
    }
  }, []);

  /* ---- Handle Resize ---- */
  useEffect(() => {
    const handleResize = () => {
      const isMob = checkIsMobile();
      if (isMob !== mobileMode) {
        setMobileMode(isMob);
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = isMob ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        renderFrame(currentFrameIdxRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMode, renderFrame]);

  /* ---- Preload frames ---- */
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let firstBatchDone = false;

    for (let i = 1; i <= WALKING_TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getWalkingFramePath(mobileMode, i);
      img.onload = () => {
        loaded++;
        if (!firstBatchDone && loaded >= INITIAL_BATCH) {
          firstBatchDone = true;
          renderFrame(0);
          setReady(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (!firstBatchDone && loaded >= INITIAL_BATCH) {
          firstBatchDone = true;
          renderFrame(0);
          setReady(true);
        }
      };
      images.push(img);
    }

    framesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [mobileMode, renderFrame]);

  /* ---- Handle Visibility & Refresh ---- */
  useEffect(() => {
    if (visible && ready) {
      const canvas = canvasRef.current;
      if (canvas) {
        const isMob = checkIsMobile();
        const dpr = isMob ? 1 : Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        renderFrame(currentFrameIdxRef.current);
      }
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [visible, ready, renderFrame]);

  /* ---- ScrollTrigger: scrub frames based on page scroll ---- */
  useEffect(() => {
    if (!ready) return;

    const isMob = checkIsMobile();

    const ctx = gsap.context(() => {
      const targetEl = document.querySelector('.post-intro') || document.body;

      ScrollTrigger.create({
        trigger: targetEl,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: isMob ? true : 0.5,
        onUpdate: (self) => {
          const frameIdx = Math.min(
            Math.floor(self.progress * WALKING_TOTAL_FRAMES),
            WALKING_TOTAL_FRAMES - 1,
          );
          renderFrame(frameIdx);
        },
      });
    });

    return () => ctx.revert();
  }, [ready, renderFrame, visible]);

  return (
    <div className={`walking-bg ${visible ? 'walking-bg--visible' : ''}`}>
      <canvas ref={canvasRef} className="walking-bg-canvas" />
      <div className="walking-bg-overlay" />
    </div>
  );
}

