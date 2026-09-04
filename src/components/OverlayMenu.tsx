import { useEffect } from 'react';

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
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      className={`
        fixed inset-0 z-40 bg-[#05140e]/95 backdrop-blur-xl
        flex items-center justify-center
        transition-all duration-700
        ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}
      `}
      style={{ transitionTimingFunction: 'var(--ease-menu)' }}
      aria-hidden={!open}
    >
      <div className="flex flex-col items-center gap-8">
        {LINKS.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className="
              font-instrument text-4xl md:text-6xl text-white
              hover:opacity-60 transition-opacity duration-300
              no-underline
            "
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0)' : 'translateY(30px)',
              transition: `opacity 500ms var(--ease-entrance), transform 500ms var(--ease-entrance)`,
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
