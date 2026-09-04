import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Plane, Train, Bus, ChevronDown } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './TravelSection.css';

gsap.registerPlugin(ScrollTrigger);

export function TravelSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

      if (listRef.current) {
        gsap.fromTo(
          listRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const getIcon = (id: string) => {
    switch (id) {
      case 'air':
        return <Plane className="w-5 h-5 text-amber-400" />;
      case 'train':
        return <Train className="w-5 h-5 text-amber-400" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-amber-400" />;
      default:
        return <Plane className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <section ref={sectionRef} className="travel-section" id="guide">
      <div ref={headerRef} className="section-header">
        <p className="section-subtitle">TRAVEL GUIDE</p>
        <h2 className="section-title">How to Reach</h2>
      </div>

      <div ref={listRef} className="accordion-list">
        {weddingData.travelGuide.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.id}
              className={`accordion-item ${isOpen ? 'open' : ''}`}
            >
              <button
                className="accordion-trigger"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span className="acc-title">
                  {getIcon(item.id)}
                  <span>{item.title}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-300 transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="accordion-content">
                  {item.details.map((detail, dIdx) => (
                    <p key={dIdx}>{detail}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
