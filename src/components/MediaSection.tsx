import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Download, Camera } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './MediaSection.css';

gsap.registerPlugin(ScrollTrigger);

export function MediaSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }

      const cards = section.querySelectorAll('.media-card');
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="media-section" id="gallery">
      <div ref={headerRef} className="section-header">
        <p className="section-subtitle">MEMORIES &amp; MEDIA</p>
        <h2 className="section-title">Gallery &amp; Invitation Card</h2>
      </div>

      <div ref={gridRef} className="media-grid">
        {/* Digital Card Download */}
        <div className="media-card">
          <div className="card-preview">
            <img src={weddingData.digitalCardUrl} alt="Wedding Card Preview" />
          </div>
          <div className="media-body">
            <h4>Digital Wedding Card</h4>
            <p>Download the high-resolution invitation card for sharing.</p>
            <a
              href={weddingData.digitalCardUrl}
              download="Rizwan_and_Binsha_Wedding_Card.png"
              className="btn-download"
            >
              <Download className="w-4 h-4" />
              <span>Download Card</span>
            </a>
          </div>
        </div>

        {/* AI Smart Gallery Box */}
        <div className="media-card">
          <div className="smart-gallery-box">
            <Camera className="w-8 h-8 text-amber-300" />
            <span>AI Face Recognition Gallery</span>
          </div>
          <div className="media-body">
            <h4>Event Photo Gallery</h4>
            <p>Upload a selfie post-event to receive all your photos automatically.</p>
            <button className="btn-disabled" disabled>
              Link Active After Wedding
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
