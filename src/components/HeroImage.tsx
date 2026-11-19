import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './HeroImage.css';

gsap.registerPlugin(ScrollTrigger);

interface HeroImageProps {
  visible?: boolean;
}

export function HeroImage({ visible }: HeroImageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ---- Swipe Slider State ---- */
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  // Lock page scrolling while user is on Hero until they swipe
  useEffect(() => {
    if (!visible) return;

    if (!isUnlocked) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      // Also prevent touchmove default to stop bounce/scroll on mobile
      const preventDefaultTouch = (e: TouchEvent) => {
        // Allow touch inside the swipe container so user can swipe
        if (trackRef.current && trackRef.current.contains(e.target as Node)) {
          return;
        }
        e.preventDefault();
      };

      // Prevent wheel/arrow scrolling
      const preventScrollKeys = (e: KeyboardEvent) => {
        if (['Space', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
          e.preventDefault();
        }
      };

      const preventWheel = (e: WheelEvent) => {
        e.preventDefault();
      };

      window.addEventListener('touchmove', preventDefaultTouch, { passive: false });
      window.addEventListener('wheel', preventWheel, { passive: false });
      window.addEventListener('keydown', preventScrollKeys, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        window.removeEventListener('touchmove', preventDefaultTouch);
        window.removeEventListener('wheel', preventWheel);
        window.removeEventListener('keydown', preventScrollKeys);
      };
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [visible, isUnlocked]);

  const triggerScroll = useCallback(() => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setIsUnlocked(true);
    setSwipeProgress(1);

    // Re-enable scroll immediately so scrollIntoView works seamlessly
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    requestAnimationFrame(() => {
      const coupleEl = document.getElementById('couple');
      if (coupleEl) {
        coupleEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }, []);

  const handleStart = (clientX: number) => {
    if (isUnlocked) return;
    isDraggingRef.current = true;
    setIsDragging(true);
    startXRef.current = clientX;
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current || !trackRef.current || isUnlocked) return;
      const rect = trackRef.current.getBoundingClientRect();
      const trackHeight = trackRef.current.offsetHeight || 48;
      const maxDist = Math.max(1, rect.width - trackHeight);
      const delta = clientX - startXRef.current;
      const pct = Math.max(0, Math.min(1, delta / maxDist));
      setSwipeProgress(pct);

      if (pct >= 0.55 || delta > 80) {
        triggerScroll();
      }
    },
    [isUnlocked, triggerScroll],
  );

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    if (swipeProgress < 0.55) {
      setSwipeProgress(0);
    }
  }, [swipeProgress]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    };
    const onEnd = () => handleEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [handleMove, handleEnd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // React's muted attribute doesn't always set the underlying DOM property on iOS Safari
    video.muted = true;
    video.defaultMuted = true;

    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    tryPlay();

    // Trigger on any touch / user interaction in case browser blocked autoplay
    window.addEventListener('touchstart', tryPlay, { once: true, passive: true });
    window.addEventListener('pointerdown', tryPlay, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', tryPlay);
      window.removeEventListener('pointerdown', tryPlay);
    };
  }, [visible]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const bg = bgRef.current;
      // Desktop-only image reveal & gentle parallax
      if (bg) {
        gsap.fromTo(
          bg,
          { scale: 1.12, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 2.4,
            ease: 'power2.out',
            delay: 0.1,
          },
        );

        gsap.fromTo(
          bg,
          { yPercent: 0, scale: 1 },
          {
            yPercent: 10,
            scale: 1.18,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        );
      }

      // Smooth scroll fade for caption and swipe slider
      gsap.to(['.hero-image-caption', '.hero-swipe-container'], {
        opacity: 0,
        y: -25,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '45% top',
          scrub: 0.3,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero-image-section" id="hero">
      {/* Desktop background */}
      <div ref={bgRef} className="hero-image-bg" />

      {/* Mobile hero video */}
      <video
        ref={videoRef}
        className="hero-video-mobile"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/videos/mobile%20intro.mp4" type="video/mp4" />
        <source src="/videos/mobile intro.mp4" type="video/mp4" />
      </video>

      <div className="hero-image-overlay" />

      <div className="hero-image-caption">
        <span className="hero-caption-divider">✦</span>
        <h2 className="hero-caption-names">
          {weddingData.groom.firstName.toUpperCase()}
          <span className="amp">&amp;</span>
          {weddingData.bride.firstName.toUpperCase()}
        </h2>
        <span className="hero-caption-sub">THE JOURNEY BEGINS</span>
      </div>

      {/* Swipe to View Invitation Slider */}
      <div className={`hero-swipe-container ${isDragging ? 'is-dragging' : ''} ${isUnlocked ? 'is-unlocked' : ''}`}>
        {/* Animated undulating / wiggling aura & ripple waves around the button */}
        <div className="hero-swipe-aura" />
        <div className="hero-swipe-wave hero-swipe-wave--1" />
        <div className="hero-swipe-wave hero-swipe-wave--2" />

        <div
          ref={trackRef}
          className={`hero-swipe-track ${isUnlocked ? 'done' : ''}`}
          onMouseDown={(e) => handleStart(e.clientX)}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        >
          <div
            className="hero-swipe-fill"
            style={{ width: `${swipeProgress * 100}%` }}
          />
          <div
            className="hero-swipe-thumb"
            style={{
              transform: `translateX(${
                swipeProgress *
                (trackRef.current ? Math.max(0, trackRef.current.offsetWidth - (trackRef.current.offsetHeight || 48)) : 220)
              }px)`,
            }}
          >
            <ChevronRight className="w-5 h-5 text-amber-950" />
          </div>
          <span className="hero-swipe-label">
            {isUnlocked ? 'Opening Invitation... ✦' : 'Swipe to View Invitation'}
          </span>
        </div>
      </div>
    </section>
  );
}
