import { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

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
    <nav className={`navbar ${scrolled || menuOpen ? 'navbar--scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left — Brand Logo */}
        <a href="#hero" className="navbar-logo">
          <span>R &amp; B</span>
        </a>

        {/* Center — Navigation Links (Desktop) */}
        <div className="navbar-links">
          <a href="#couple">Couple</a>
          <a href="#events">Events</a>
          <a href="#venue">Venue</a>
          <a href="#contacts">Contacts</a>
          <a href="#guide">Travel</a>
        </div>

        {/* Right — Mobile Menu Toggle */}
        <button
          className="navbar-toggle"
          onClick={() => onMenuToggle(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}