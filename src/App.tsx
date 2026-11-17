import { useState, useCallback, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { OverlayMenu } from './components/OverlayMenu';
import { IntroSection } from './components/IntroSection';
import { HeroImage } from './components/HeroImage';
import { WalkingBg } from './components/WalkingBg';
import { CoupleReveal } from './components/CoupleReveal';
import { WeddingEvents } from './components/WeddingEvents';
import { VenueSection } from './components/VenueSection';
import { ContactSection } from './components/ContactSection';
import { TravelSection } from './components/TravelSection';
import { MediaSection } from './components/MediaSection';
import { Footer } from './components/Footer';
import { AudioControl } from './components/AudioControl';
import { PetalRain } from './components/PetalRain';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

/* ---- Image paths to preload ---- */
const WALKING_FRAMES_PC = Array.from({ length: 117 }, (_, i) =>
  `/images/new/walkingpc/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
);
const WALKING_FRAMES_MOBILE = Array.from({ length: 117 }, (_, i) =>
  `/images/new/walkingmobile/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`
);

function getMobilePaths(): string[] {
  // Mobile intro & hero are now lightweight videos; only walking background needs preloading
  return [...WALKING_FRAMES_MOBILE];
}

function getDesktopPaths(): string[] {
  return ['/images/hero-desktop.webp', ...WALKING_FRAMES_PC];
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingPercent, setLoadingPercent] = useState(0);
  const [assetsReady, setAssetsReady] = useState(false);
  const [preloaderGone, setPreloaderGone] = useState(false);

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

  /* ---- Stable callbacks for IntroSection (prevents re-renders restarting the timeline) ---- */
  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  const handleIntroReset = useCallback(() => {
    setIntroDone(false);
  }, []);

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

  useEffect(() => {
    if (!introDone) {
      lenisRef.current?.stop();
    } else {
      lenisRef.current?.start();
    }
  }, [introDone]);

  /* ---- Unmount preloader from DOM after smooth fade-out ---- */
  useEffect(() => {
    if (assetsReady) {
      const timer = setTimeout(() => setPreloaderGone(true), 900);
      return () => clearTimeout(timer);
    }
  }, [assetsReady]);

  /* ---- Coordinated preloading: Intro Video buffer + Key images ---- */
  const videoReadyRef = useRef(false);
  const allLoadedRef = useRef(false);

  const handleVideoReady = useCallback(() => {
    videoReadyRef.current = true;
  }, []);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const paths = isMobile ? getMobilePaths() : getDesktopPaths();
    const total = paths.length;
    let loaded = 0;
    let targetPct = 12;

    paths.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => {
        loaded++;
        const imgRatio = total > 0 ? loaded / total : 1;
        const imgPct = Math.round(imgRatio * 45);
        const vidPct = videoReadyRef.current ? 45 : 0;
        targetPct = Math.max(targetPct, Math.min(100, 10 + imgPct + vidPct));
      };
      img.src = src;
    });

    const checkInterval = setInterval(() => {
      if (videoReadyRef.current) {
        const imgRatio = total > 0 ? loaded / total : 1;
        const imgPct = Math.round(imgRatio * 45);
        targetPct = Math.max(targetPct, Math.min(100, 10 + imgPct + 45));
      }
    }, 100);

    const ticker = setInterval(() => {
      setLoadingPercent((prev) => {
        if (prev >= 100) {
          clearInterval(ticker);
          clearInterval(checkInterval);
          return 100;
        }
        const step = Math.max(1, Math.ceil((targetPct - prev) * 0.2));
        const next = Math.min(targetPct, prev + step);
        if (next >= 100 && !allLoadedRef.current) {
          allLoadedRef.current = true;
          setTimeout(() => setAssetsReady(true), 350);
        }
        return next;
      });
    }, 40);

    // Guaranteed safety timeout (3.5s max) so slow connections never stall
    const safetyTimeout = setTimeout(() => {
      targetPct = 100;
      setLoadingPercent(100);
      if (!allLoadedRef.current) {
        allLoadedRef.current = true;
        setTimeout(() => setAssetsReady(true), 200);
      }
    }, 3500);

    return () => {
      clearInterval(ticker);
      clearInterval(checkInterval);
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <div className="bg-[#05140e] min-h-screen">
      {!preloaderGone && (
        <div className={`preloader ${assetsReady ? 'preloader-fade' : ''}`}>
          <div className="preloader-inner">
            <h1 className="preloader-names font-cinzel">
              RIZWAN <span className="preloader-amp">&amp;</span> BINSHA
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

      <IntroSection
        onIntroComplete={handleIntroComplete}
        onIntroReset={handleIntroReset}
        onDoorOpen={handleDoorOpen}
        onVideoReady={handleVideoReady}
      />

      <WalkingBg visible={introDone} />
      <PetalRain introDone={introDone} />

      <div className={`post-intro ${introDone ? 'post-intro--visible' : ''}`}>
        <HeroImage visible={introDone} />
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
