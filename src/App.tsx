import { useState, useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { OverlayMenu } from './components/OverlayMenu';
import { IntroSection } from './components/IntroSection';
import { WalkingBg } from './components/WalkingBg';
import { CoupleReveal } from './components/CoupleReveal';
import { WeddingEvents } from './components/WeddingEvents';
import { VenueSection } from './components/VenueSection';
import { ContactSection } from './components/ContactSection';
import { TravelSection } from './components/TravelSection';
import { MediaSection } from './components/MediaSection';
import { Footer } from './components/Footer';
import { AudioControl } from './components/AudioControl';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const userMutedRef = useRef(false);

  const handleMenuToggle = useCallback((open: boolean) => {
    setMenuOpen(open);
  }, []);

  /* ---- Play Audio Function ---- */
  const playAudio = useCallback((force = false) => {
    if (!audioRef.current || isPlayingRef.current) return;
    if (userMutedRef.current && !force) return;

    audioRef.current.volume = 0.5;
    audioRef.current
      .play()
      .then(() => {
        isPlayingRef.current = true;
        setIsPlaying(true);
      })
      .catch(() => {
        // Autoplay policy prevented playback until explicit tap
      });
  }, []);

  /* ---- Pause Audio Function ---- */
  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  /* ---- Toggle Audio Function ---- */
  const toggleAudio = useCallback(() => {
    if (isPlayingRef.current) {
      userMutedRef.current = true;
      pauseAudio();
    } else {
      userMutedRef.current = false;
      playAudio(true);
    }
  }, [playAudio, pauseAudio]);

  /* ---- Unlock audio on first user touch/click/scroll ---- */
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!isPlayingRef.current && !userMutedRef.current) {
        playAudio();
      }
    };

    window.addEventListener('pointerdown', handleFirstUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstUserInteraction, { passive: true });
    window.addEventListener('scroll', handleFirstUserInteraction, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('scroll', handleFirstUserInteraction);
    };
  }, [playAudio]);

  /* ---- Door Open Trigger ---- */
  const handleDoorOpen = useCallback(() => {
    if (userMutedRef.current) return;
    playAudio();
  }, [playAudio]);

  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.2,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="bg-[#05140e] min-h-screen">
      {/* Central Audio Player */}
      <audio
        ref={audioRef}
        src="/audio/nikah-nasheed.mp3"
        loop
        preload="auto"
        onPlay={() => {
          isPlayingRef.current = true;
          setIsPlaying(true);
        }}
        onPause={() => {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }}
      />

      {/* Floating Audio Control Button — always visible from the beginning */}
      <AudioControl isPlaying={isPlaying} onToggle={toggleAudio} />

      {/* Navbar — visible once user scrolls past intro */}
      {introDone && (
        <>
          <Navbar onMenuToggle={handleMenuToggle} menuOpen={menuOpen} />
          <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
      )}

      {/* Intro canvas sequence */}
      <IntroSection
        onIntroComplete={() => setIntroDone(true)}
        onIntroReset={() => setIntroDone(false)}
        onDoorOpen={handleDoorOpen}
      />

      {/* Background canvas sequence */}
      <WalkingBg visible={introDone} />

      {/* Main wedding content */}
      <div className={`post-intro ${introDone ? 'post-intro--visible' : ''}`}>
        <CoupleReveal />
        <WeddingEvents />
        <VenueSection />
        <ContactSection />
        <TravelSection />
        <MediaSection />
        <Footer />
      </div>
    </div>
  );
}

export default App;
