import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Navigation } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './VenueSection.css';

gsap.registerPlugin(ScrollTrigger);

export function VenueSection() {
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

      const cards = section.querySelectorAll('.venue-card');
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
    <section ref={sectionRef} className="venue-section" id="venue">
      <div ref={headerRef} className="section-header">
        <p className="section-subtitle">DESTINATIONS</p>
        <h2 className="venue-header">Venue Locations</h2>
      </div>

      <div ref={gridRef} className="venue-info-grid">
        {weddingData.venues.map((venue) => (
          <div key={venue.id} className="venue-card">
            <div className="venue-badge">{(venue as { badge?: string }).badge || 'WEDDING VENUE'}</div>
            <h3 className="v-title">{venue.title}</h3>
            
            <div className="v-location">
              <MapPin className="w-4 h-4 text-amber-400/90" />
              <span>{venue.location}</span>
            </div>

            <p className="v-desc">{venue.desc}</p>
            
            <a
              href={venue.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="v-link"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
