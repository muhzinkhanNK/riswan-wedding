import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../data/wedding';
import './IntroSection.css';

gsap.registerPlugin(ScrollTrigger);

/* ---------- Config ---------- */
const MOBILE_BREAKPOINT = 768;
const INTRO_TOTAL_FRAMES_PC = 120;
const INTRO_TOTAL_FRAMES_MOBILE = 210;
const INITIAL_BATCH = 15;

function getIntroTotalFrames(isMobile: boolean): number {
  return isMobile ? INTRO_TOTAL_FRAMES_MOBILE : INTRO_TOTAL_FRAMES_PC;
}

function getIntroFramePath(isMobile: boolean, i: number): string {
  const folder = isMobile ? '/images/new/newintromobileg' : '/images/new/intropc';
  return `${folder}/ezgif-frame-${String(i).padStart(3, '0')}.webp`;
}

/* ---------- Helpers ---------- */
function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function checkIsMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/* ---------- Component ---------- */
interface IntroSectionProps {
  onIntroComplete?: () => void;
  onIntroReset?: () => void;
  onDoorOpen?: () => void;
}

export function IntroSection({ onIntroComplete, onIntroReset, onDoorOpen }: IntroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const familiesRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderBarRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLSpanElement>(null);

  const [ready, setReady] = useState(false);
  const [mobileMode, setMobileMode] = useState(() => checkIsMobile());
  const introCompleteRef = useRef(false);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameIdxRef = useRef<number>(0);

  /* ---- Notify parent when intro completes ---- */
  const notifyComplete = useCallback(() => {
    if (!introCompleteRef.current && onIntroComplete) {
      introCompleteRef.current = true;
      onIntroComplete();
    }
  }, [onIntroComplete]);

  const drawDimensionsRef = useRef<{ offsetX: number; offsetY: number; renderW: number; renderH: number } | null>(null);

  /* ---- Calculate canvas cover bounds ---- */
  const calcCoverBounds = useCallback((cw: number, ch: number, iw: number, ih: number) => {
    if (!iw || !ih || !cw || !ch) return;
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

    drawDimensionsRef.current = { offsetX, offsetY, renderW, renderH };
  }, []);

  /* ---- Draw current frame to canvas ---- */
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    currentFrameIdxRef.current = frameIdx;
    const img = framesRef.current[frameIdx];

    if (img && img.complete && img.naturalWidth > 0) {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      if (!drawDimensionsRef.current) {
        calcCoverBounds(canvas.width, canvas.height, iw, ih);
      }
      const bounds = drawDimensionsRef.current;
      if (bounds) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, bounds.offsetX, bounds.offsetY, bounds.renderW, bounds.renderH);
      }
    } else if (img) {
      img.onload = () => {
        if (currentFrameIdxRef.current === frameIdx) {
          const iw = img.naturalWidth || img.width;
          const ih = img.naturalHeight || img.height;
          calcCoverBounds(canvas.width, canvas.height, iw, ih);
          const bounds = drawDimensionsRef.current;
          if (bounds) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, bounds.offsetX, bounds.offsetY, bounds.renderW, bounds.renderH);
          }
        }
      };
    }
  }, [calcCoverBounds]);

  /* ---- Handle Resize ---- */
  useEffect(() => {
    const handleResize = () => {
      const isMob = checkIsMobile();
      if (isMob !== mobileMode) {
        setMobileMode(isMob);
      }
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(window.innerWidth * dpr);
        canvas.height = Math.floor(window.innerHeight * dpr);
        drawDimensionsRef.current = null; // reset cached cover bounds
        renderFrame(currentFrameIdxRef.current);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMode, renderFrame]);

  /* ---- Fade out loader + animate text in ---- */
  const showExperience = useCallback(() => {
    if (loaderRef.current) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (loaderRef.current) loaderRef.current.style.display = 'none';
        },
      });
    }
    const tl = gsap.timeline({ delay: 0.3 });
    if (familiesRef.current) {
      tl.to(familiesRef.current, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0);
    }
    if (scrollIndicatorRef.current) {
      tl.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.2);
    }
    setReady(true);
  }, []);

  /* ---- Preload frames ---- */
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;
    let firstBatchDone = false;
    const count = getIntroTotalFrames(mobileMode);

    for (let i = 1; i <= count; i++) {
      const img = new Image();
      img.src = getIntroFramePath(mobileMode, i);
      img.onload = () => {
        loaded++;
        const pct = Math.round((loaded / count) * 100);
        if (loaderBarRef.current) loaderBarRef.current.style.width = `${pct}%`;
        if (loaderTextRef.current) loaderTextRef.current.textContent = `${pct}%`;

        if (!firstBatchDone && loaded >= INITIAL_BATCH) {
          firstBatchDone = true;
          renderFrame(0);
          showExperience();
        }
      };
      img.onerror = () => {
        loaded++;
        if (!firstBatchDone && loaded >= INITIAL_BATCH) {
          firstBatchDone = true;
          renderFrame(0);
          showExperience();
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
  }, [mobileMode, renderFrame, showExperience]);

  /* ---- ScrollTrigger: scrub frames + fade overlay ---- */
  useEffect(() => {
    if (!ready) return;
    const section = sectionRef.current;
    if (!section) return;

    const isMob = checkIsMobile();
    const count = getIntroTotalFrames(isMob);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: isMob ? '+=160%' : '+=200%',
        pin: true,
        anticipatePin: 1,
        scrub: isMob ? 0.15 : 0.3,
        onUpdate: (self) => {
          const p = self.progress;

          // --- Trigger music start when scroll begins / doors open ---
          if (p > 0.04 && onDoorOpen) {
            onDoorOpen();
          }

          // --- Notify when intro is near end ---
          if (p > 0.85) {
            notifyComplete();
          }

          // --- Reset when user scrolls back into intro ---
          if (p < 0.3 && introCompleteRef.current && onIntroReset) {
            introCompleteRef.current = false;
            onIntroReset();
          }

          // --- Frame scrub ---
          const frameIdx = Math.min(
            Math.floor(p * count),
            count - 1,
          );
          renderFrame(frameIdx);

          // --- Families: fade out 15→30% ---
          if (familiesRef.current) {
            const fadeOut = clamp((p - 0.15) / 0.15);
            familiesRef.current.style.opacity = String(1 - fadeOut);
            familiesRef.current.style.transform = `translateY(${-fadeOut * 15}px)`;
          }

          // --- Scroll indicator: fade out 8→15% ---
          if (scrollIndicatorRef.current) {
            const fadeOut = clamp((p - 0.08) / 0.07);
            scrollIndicatorRef.current.style.opacity = String(1 - fadeOut);
          }

          if (fadeOverlayRef.current) {
            fadeOverlayRef.current.style.opacity = '0';
          }
        },
        onLeave: () => {
          notifyComplete();
        },
      });
    }, section);

    return () => ctx.revert();
  }, [ready, notifyComplete, onIntroReset, onDoorOpen, renderFrame]);

  return (
    <>
      {/* Loader */}
      <div ref={loaderRef} className="intro-loader">
        <div className="intro-loader-inner">
          <div className="intro-loader-bar-track">
            <div ref={loaderBarRef} className="intro-loader-bar-fill" />
          </div>
          <span ref={loaderTextRef} className="intro-loader-text">
            Loading…
          </span>
        </div>
      </div>

      {/* Intro section */}
      <section ref={sectionRef} className="intro-section">
        {/* Hardware-accelerated canvas sequence */}
        <div className="intro-frame-wrap">
          <canvas ref={canvasRef} className="intro-canvas" />
        </div>

        {/* Dark vignette overlay */}
        <div className="intro-vignette" />

        {/* Fade-to-black overlay (end of intro) */}
        <div ref={fadeOverlayRef} className="intro-fade-overlay" />

        {/* Text overlay */}
        <div className="intro-text">
          <p ref={familiesRef} className="intro-families">
            {weddingData.invitationText}
          </p>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} className="intro-scroll-indicator">
          <span className="label">SCROLL TO ENTER</span>
          <span className="arrow">↓</span>
        </div>
      </section>
    </>
  );
}

