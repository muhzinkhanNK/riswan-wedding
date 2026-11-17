import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { weddingData } from '../data/wedding';
import './IntroSection.css';

/* ---------- Config ---------- */
const MOBILE_BREAKPOINT = 768;
const MOBILE_INTRO_VIDEO = '/videos/no_our wedding mobile.mp4';
const PC_INTRO_VIDEO = '/videos/notext pc view.mp4';

function checkIsMobile(): boolean {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

/* ---------- Component ---------- */
interface IntroSectionProps {
  onIntroComplete?: () => void;
  onIntroReset?: () => void;
  onDoorOpen?: () => void;
}

export function IntroSection({ onIntroComplete, onDoorOpen }: IntroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const tapEnterRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [entered, setEntered] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [mobileMode, setMobileMode] = useState(() => checkIsMobile());
  const introCompleteRef = useRef(false);

  // Prevent scrolling during entire intro until hero section appears
  useEffect(() => {
    if (introFinished) {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.documentElement.style.overflow = '';
      return;
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
      }
    };

    const body = document.body;
    const html = document.documentElement;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.width = '100%';
    html.style.overflow = 'hidden';

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll);

    return () => {
      body.style.overflow = '';
      body.style.position = '';
      body.style.width = '';
      html.style.overflow = '';
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [introFinished]);

  const enteredRef = useRef(false);

  /* ---- Notify parent when intro completes ---- */
  const notifyComplete = useCallback(() => {
    if (!introCompleteRef.current && onIntroComplete) {
      introCompleteRef.current = true;
      onIntroComplete();
    }
  }, [onIntroComplete]);

  /* ---- Handle Resize ---- */
  useEffect(() => {
    const handleResize = () => {
      const isMob = checkIsMobile();
      if (isMob !== mobileMode) {
        setMobileMode(isMob);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMode]);

  /* ---- Reveal "Tap to Enter" overlay immediately ---- */
  useEffect(() => {
    if (loaderRef.current) {
      loaderRef.current.style.display = 'none';
    }
    if (tapEnterRef.current) {
      gsap.to(tapEnterRef.current, { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.2 });
    }
    setReady(true);
  }, []);

  /* ---- Tap to enter handler ---- */
  const handleEnter = useCallback(() => {
    if (enteredRef.current) return;
    enteredRef.current = true;
    setEntered(true);
  }, []);

  /* ---- Video playback & completion ---- */
  useEffect(() => {
    if (!ready || !entered) return;

    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.play().catch(() => {});
    if (onDoorOpen) onDoorOpen();

    // Fade out the tap overlay
    if (tapEnterRef.current) {
      gsap.to(tapEnterRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' });
    }

    const handleEnded = () => {
      if (fadeOverlayRef.current) {
        gsap.to(fadeOverlayRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          onComplete: () => {
            notifyComplete();
            setIntroFinished(true);
            if (sectionRef.current) sectionRef.current.style.display = 'none';
          },
        });
      } else {
        notifyComplete();
        setIntroFinished(true);
        if (sectionRef.current) sectionRef.current.style.display = 'none';
      }
    };

    video.addEventListener('ended', handleEnded, { once: true });
    return () => video.removeEventListener('ended', handleEnded);
  }, [ready, entered, onDoorOpen, notifyComplete]);

  return (
    <>
      {/* Intro section */}
      <section ref={sectionRef} className="intro-section">
        {/* Video intro — mobile and desktop */}
        <div className="intro-frame-wrap">
          <video
            ref={videoRef}
            className="intro-video-mobile"
            src={mobileMode ? MOBILE_INTRO_VIDEO : PC_INTRO_VIDEO}
            muted
            playsInline
            preload="auto"
          />
        </div>

        {/* Dark vignette overlay */}
        <div className="intro-vignette" />

        {/* Fade-to-black overlay (end of intro) */}
        <div ref={fadeOverlayRef} className="intro-fade-overlay" />

        {/* Text overlay */}
        <div ref={tapEnterRef} className="intro-enter" onClick={handleEnter}>
          {/* Top ornament */}
          <div className="intro-enter-ornament">
            <span className="ornament-line" />
            <span className="ornament-diamond">◆</span>
            <span className="ornament-line" />
          </div>

          {/* Families / invitation line */}
          <p className="intro-families">{weddingData.invitationText}</p>

          {/* Names */}
          <h1 className="intro-names">
            {weddingData.groom.firstName}
            <span className="amp">&amp;</span>
            {weddingData.bride.firstName}
          </h1>

          {/* Wedding date */}
          <p className="intro-enter-date">{weddingData.date.full}</p>

          {/* Bottom ornament */}
          <div className="intro-enter-ornament bottom">
            <span className="ornament-line" />
            <span className="ornament-diamond">◆</span>
            <span className="ornament-line" />
          </div>

          {/* CTA Button */}
          <button type="button" className="intro-enter-btn">
            <span className="intro-enter-btn-ring" />
            <span className="intro-enter-btn-ring pulse" />
            <span className="intro-enter-btn-label">Enter</span>
          </button>
        </div>
      </section>
    </>
  );
}
