import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { weddingData } from '../data/wedding';
import './HeroImage.css';

gsap.registerPlugin(ScrollTrigger);

export function HeroImage() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    const ctx = gsap.context(() => {
      // Slow cinematic reveal when the section appears (fades in from the intro's black)
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

      // Gentle parallax drift as the user scrolls past
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero-image-section" id="hero">
      <div ref={bgRef} className="hero-image-bg" />
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
    </section>
  );
}