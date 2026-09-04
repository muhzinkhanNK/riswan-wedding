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

/* ---- Image paths to preload ---- */
const INTRO_FRAMES_PC = Array.from({ length: 120 }, (_, i) =>
  `/images/new/intropc/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
);
const INTRO_FRAMES_MOBILE = Array.from({ length: 210 }, (_, i) =>
  `/images/new/newintromobileg/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
);
const WALKING_FRAMES_PC = Array.from({ length: 117 }, (_, i) =>
  `/images/new/walkingpc/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
);
const WALKING_FRAMES_MOBILE = Array.from({ length: 72 }, (_, i) =>
  `/images/new/walkingmobile/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
);

function getMobilePaths(): string[] {
  const paths: string[] = [];
  paths.push(...INTRO_FRAMES_MOBILE);
  paths.push(...WALKING_FRAMES_MOBILE);
  return paths;
}

function getDesktopPaths(): string[] {
  const paths: string[] = [];
  paths.push(...INTRO_FRAMES_PC);
  paths.push(...WALKING_FRAMES_PC);
  return paths;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const userMutedRef = useRef(false);

  const handleMenuToggle = useCallback((open: boolean) => {
    setMenuOpen(open);
  }, []);

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
      .catch(() => {});
  }, []);

  const pauseAudio = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    isPlayingRef.current = false;
    setIsPlaying(false);
  }, []);

  const toggleAudio = useCallback(() => {
    if (isPlayingRef.current) {
      userMutedRef.current = true;
      pauseAudio();
    } else {
      userMutedRef.current = false;
      playAudio(true);
    }
  }, [playAudio, pauseAudio]);

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
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  /* ---- Preload all images before showing anything ---- */
  const allLoadedRef = useRef(false);

  useEffect(() => {
    const paths = window.innerWidth < 768 ? getMobilePaths() : getDesktopPaths();
    const total = paths.length;
    let loaded = 0;

    paths.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        const pct = Math.round((loaded / total) * 100);
        setLoadingPercent(pct);
        if (pct >= 100 && !allLoadedRef.current) {
          allLoadedRef.current = true;
          setTimeout(() => setAssetsReady(true), 400);
        }
      };
      img.src = src;
    });

    return () => {};
  }, []);

  return (
    <div className="bg-[#05140e] min-h-screen">
      {!assetsReady && (
        <div className="preloader">
          <div className="preloader-inner">
            <h1 className="preloader-names font-cinzel">
              RIZWAN{' '}
              <span className="preloader-amp">&amp;</span>{' '}
              BINSHA
            </h1>
            <div className="preloader-bar-track">
              <div className="preloader-bar-fill" style={{ width: `${loadingPercent}%` }} />
            </div>
            <span className="preloader-text">{loadingPercent}%</span>
          </div>
        </div>
      )}

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

      {assetsReady && <AudioControl isPlaying={isPlaying} onToggle={toggleAudio} />}

      {introDone && (
        <>
          <Navbar onMenuToggle={handleMenuToggle} menuOpen={menuOpen} />
          <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
      )}

      {assetsReady && (
        <IntroSection
          onIntroComplete={() => setIntroDone(true)}
          onIntroReset={() => setIntroDone(false)}
          onDoorOpen={handleDoorOpen}
        />
      )}

      <WalkingBg visible={introDone} />

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
