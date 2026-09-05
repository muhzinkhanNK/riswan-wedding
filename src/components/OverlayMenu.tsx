import { useEffect } from 'react';
import './OverlayMenu.css';

interface OverlayMenuProps {
  open: boolean;
  onClose: () => void;
}

const LINKS = [
  { label: 'Couple', href: '#couple' },
  { label: 'Events', href: '#events' },
  { label: 'Venue', href: '#venue' },
  { label: 'Contacts', href: '#contacts' },
  { label: 'Travel Guide', href: '#guide' },
  { label: 'Gallery & Cards', href: '#gallery' },
];

export function OverlayMenu({ open, onClose }: OverlayMenuProps) {
  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={`overlay-menu ${open ? 'overlay-menu--open' : ''}`}
      aria-hidden={!open}
    >
      <div className="overlay-links">
        {LINKS.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className="overlay-link"
            style={{
              transitionDelay: open ? `${100 + i * 70}ms` : '0ms',
            }}
            onClick={(e) => {
              e.preventDefault();
              onClose();
              const el = document.querySelector(link.href);
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}