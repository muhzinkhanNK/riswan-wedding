import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Phone, MessageCircle, Send } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './ContactSection.css';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const [selectedEvent, setSelectedEvent] = useState('Both Events (Nikkah & Reception)');

  const getRsvpUrl = () => {
    const text = `Assalamu Alaikum! I will be attending the ${selectedEvent} for Rizwan Mohamed & Binsha Azeez's wedding celebration on Sunday, 27 December 2026.`;
    return `https://wa.me/${weddingData.rsvpWhatsapp}?text=${encodeURIComponent(text)}`;
  };

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

      const cards = section.querySelectorAll('.contact-card, .rsvp-box');
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
              trigger: gridRef.current || section,
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
    <section ref={sectionRef} className="contacts-section" id="contacts">
      <div ref={headerRef} className="section-header">
        <p className="section-subtitle">GET IN TOUCH</p>
        <h2 className="section-title">RSVP &amp; Family Contacts</h2>
        <p className="section-desc">
          Kindly confirm your presence or reach out to our family members for any assistance.
        </p>
      </div>

      {/* Instant 1-Click WhatsApp RSVP Box */}
      <div className="rsvp-box">
        <span className="rsvp-badge">✦ INSTANT RSVP</span>
        <h3 className="rsvp-title">Confirm Your Attendance</h3>
        <p className="rsvp-sub">
          Select which event you will be attending, then tap below to send a pre-filled WhatsApp confirmation directly to the family.
        </p>

        <div className="rsvp-options">
          {[
            'Both Events (Nikkah & Reception)',
            'Nikkah Ceremony',
            'Evening Reception',
          ].map((opt) => (
            <button
              key={opt}
              type="button"
              className={`rsvp-opt-btn ${selectedEvent === opt ? 'active' : ''}`}
              onClick={() => setSelectedEvent(opt)}
            >
              {selectedEvent === opt ? '✓ ' : ''}{opt}
            </button>
          ))}
        </div>

        <a
          href={getRsvpUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-rsvp-send"
        >
          <Send className="w-4 h-4" />
          <span>Send Instant RSVP on WhatsApp</span>
        </a>
      </div>

      {/* Family Contacts Grid */}
      <div ref={gridRef} className="contacts-grid">
        {weddingData.contacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-card ${contact.featured ? 'featured' : ''}`}
          >
            <div className="contact-header">
              <span className="role-badge">{contact.role}</span>
              <h3 className="contact-name">{contact.name}</h3>
            </div>
            <a href={`tel:${contact.tel}`} className="contact-phone-number">
              {contact.phone}
            </a>
            <div className="contact-buttons">
              <a href={`tel:${contact.tel}`} className="btn-call">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
