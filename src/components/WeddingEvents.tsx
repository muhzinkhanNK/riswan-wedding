import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Clock, MapPin, Navigation } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './WeddingEvents.css';

gsap.registerPlugin(ScrollTrigger);

export function WeddingEvents() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      const cards = section.querySelectorAll('.event-card');
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
              trigger: cardsRef.current,
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
    <section ref={sectionRef} className="events-section" id="events">
      <div ref={headerRef} className="section-header">
        <p className="section-subtitle">CELEBRATION SCHEDULE</p>
        <h2 className="events-header">Wedding Events</h2>
      </div>

      <div ref={cardsRef} className="events-grid">
        {weddingData.events.map((event) => (
          <div
            key={event.id}
            className={`event-card ${event.featured ? 'featured-event' : ''}`}
          >
            <div className="event-badge">{event.badge}</div>
            <h3 className="event-title">{event.title}</h3>
            
            <div className="event-meta-list">
              <div className="meta-item">
                <Calendar className="w-4 h-4 text-amber-400/80" />
                <span>{event.date}</span>
              </div>
              <div className="meta-item">
                <Clock className="w-4 h-4 text-amber-400/80" />
                <span>{event.time}</span>
              </div>
              <div className="meta-item">
                <MapPin className="w-4 h-4 text-amber-400/80" />
                <span className="font-medium text-white">{event.venue}</span>
              </div>
              <p className="venue-address-sub">{event.address}</p>
            </div>

            <p className="event-description">{event.description}</p>

            <a
              href={event.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={event.featured ? 'btn-primary' : 'btn-outline'}
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

