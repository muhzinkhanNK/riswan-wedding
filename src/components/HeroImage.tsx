import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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

      // Smooth scroll fade for caption and arrow (works on both mobile & desktop)
      gsap.to(['.hero-image-caption', '.hero-scroll-arrow'], {
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
      <a href="#couple" className="hero-scroll-arrow" aria-label="Scroll down">
        <span></span>
      </a>
    </section>
  );
}