import { useState, useEffect, useCallback } from 'react';
import { weddingData } from '../data/wedding';
import './SplashScreen.css';

interface SplashScreenProps {
  onEnter: () => void;
}

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const handleEnter = useCallback(() => {
    if (fading) return;
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      onEnter();
    }, 800);
  }, [fading, onEnter]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleEnter();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleEnter]);

  if (!visible) return null;

  return (
    <div className={`splash-screen ${fading ? 'splash-screen--fading' : ''}`}>
      <div className="splash-ornament splash-ornament--top">✦</div>

      <div className="splash-content">
        <h1 className="splash-names font-cinzel">
          {weddingData.groom.firstName}{' '}
          <span className="splash-ampersand">&amp;</span>{' '}
          {weddingData.bride.firstName}
        </h1>

        <div className="splash-divider" />

        <p className="splash-subtitle font-cormorant">
          {weddingData.invitationText}
        </p>

        <p className="splash-date font-cormorant">
          {weddingData.date.day} · {weddingData.date.month} · {weddingData.date.year}
        </p>

        <button className="splash-enter-btn" onClick={handleEnter} aria-label="Enter the invitation">
          <span className="splash-enter-text">TAP TO ENTER</span>
          <span className="splash-enter-arrow">↓</span>
        </button>
      </div>

      <div className="splash-ornament splash-ornament--bottom">✦</div>

      <div className="splash-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="splash-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              opacity: 0.15 + Math.random() * 0.25,
              fontSize: `${2 + Math.random() * 3}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
