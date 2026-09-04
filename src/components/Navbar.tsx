import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onMenuToggle: (open: boolean) => void;
  menuOpen: boolean;
}

export function Navbar({ onMenuToggle, menuOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-500
        ${scrolled || menuOpen ? 'bg-[#05140e]/90 backdrop-blur-md border-b border-amber-500/20 shadow-lg' : 'bg-transparent'}
      `}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 flex items-center justify-between h-16 md:h-20">
        {/* Left — Brand Logo */}
        <a
          href="#hero"
          className="text-white text-lg md:text-xl font-medium tracking-wider z-50 flex items-center gap-2"
        >
          <span className="font-serif text-amber-200/90 text-xl md:text-2xl">R &amp; B</span>
        </a>

        {/* Center — Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.25em] text-white/70">
          <a href="#couple" className="hover:text-amber-300 transition-colors">Couple</a>
          <a href="#events" className="hover:text-amber-300 transition-colors">Events</a>
          <a href="#venue" className="hover:text-amber-300 transition-colors">Venue</a>
          <a href="#contacts" className="hover:text-amber-300 transition-colors">Contacts</a>
          <a href="#guide" className="hover:text-amber-300 transition-colors">Travel</a>
        </div>

        {/* Right — Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          {/* Menu Drawer Toggle */}
          <button
            className="p-2 rounded-full border border-white/20 text-white/90 hover:bg-white/10 transition-colors bg-transparent"
            onClick={() => onMenuToggle(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
}

