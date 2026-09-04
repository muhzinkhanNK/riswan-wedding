import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CalendarPlus, ChevronRight } from 'lucide-react';
import { weddingData } from '../data/wedding';
import './CoupleReveal.css';

gsap.registerPlugin(ScrollTrigger);

function padZero(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

export function CoupleReveal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  /* ---- Countdown Timer State ---- */
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    mins: '00',
    secs: '00',
  });

  const updateCountdown = useCallback(() => {
    const target = new Date(weddingData.date.targetIso).getTime();
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      setTimeLeft({ days: '00', hours: '00', mins: '00', secs: '00' });
      return;
    }

    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    setTimeLeft({
      days: padZero(days),
      hours: padZero(hours),
      mins: padZero(mins),
      secs: padZero(secs),
    });
  }, []);

  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [updateCountdown]);

  /* ---- Swipe Slider State ---- */
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);

  const handleStart = (clientX: number) => {
    isDraggingRef.current = true;
    startXRef.current = clientX;
  };

  const handleMove = useCallback(
    (clientX: number) => {
      if (!isDraggingRef.current || !trackRef.current || isDone) return;
      const rect = trackRef.current.getBoundingClientRect();
      const maxDist = rect.width - 56;
      const delta = clientX - startXRef.current;
      const pct = Math.max(0, Math.min(1, delta / maxDist));
      setSwipeProgress(pct);

      if (pct >= 0.8) {
        isDraggingRef.current = false;
        setIsDone(true);
        setSwipeProgress(1);
        const eventsEl = document.getElementById('events');
        if (eventsEl) {
          eventsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [isDone],
  );

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    if (swipeProgress < 0.8) {
      setSwipeProgress(0);
    }
  }, [swipeProgress]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const onEnd = () => handleEnd();

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, [handleMove, handleEnd]);

  /* ---- GSAP Scroll Animations ---- */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 40, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="couple-section" id="couple">
      {/* Background glow */}
      <div className="couple-glow" />

      {/* Main Glass Hero Card */}
      <div ref={cardRef} className="couple-glass-card">
        {/* Bismillah calligraphy header */}
        <div className="bismillah-wrap">
          <img src="/assets/bismillah.svg" alt="Bismillah" className="bismillah-svg" />
        </div>

        {/* Quranic Verse Block (Surah Ar-Rum 30:21) */}
        <div className="quran-verse-card">
          <p className="quran-arabic">{weddingData.quranVerse.arabic}</p>
          <p className="quran-translation">"{weddingData.quranVerse.translation}"</p>
          <span className="quran-citation">— {weddingData.quranVerse.surah} —</span>
        </div>

        <p className="hero-eyebrow">THE WEDDING OF</p>

        <div className="couple-names-wrap">
          <h1 className="groom-name">{weddingData.groom.fullName}</h1>
          <span className="ampersand">&amp;</span>
          <h1 className="bride-name">{weddingData.bride.fullName}</h1>
        </div>

        <div className="hero-divider">✦</div>

        <p className="hero-invite-text">
          {weddingData.invitationText}, they cordially invite you to celebrate their wedding.
        </p>

        <div className="hero-date-badge">
          <span className="day">{weddingData.date.weekday.toUpperCase()}</span>
          <span className="date">{weddingData.date.day} {weddingData.date.month.toUpperCase()} {weddingData.date.year}</span>
          <span className="location">{weddingData.location.toUpperCase()}</span>
        </div>

        {/* Countdown Timer */}
        <div className="countdown-container">
          <div className="count-item">
            <span className="count-num">{timeLeft.days}</span>
            <span className="count-label">Days</span>
          </div>
          <span className="count-colon">:</span>
          <div className="count-item">
            <span className="count-num">{timeLeft.hours}</span>
            <span className="count-label">Hours</span>
          </div>
          <span className="count-colon">:</span>
          <div className="count-item">
            <span className="count-num">{timeLeft.mins}</span>
            <span className="count-label">Mins</span>
          </div>
          <span className="count-colon">:</span>
          <div className="count-item">
            <span className="count-num">{timeLeft.secs}</span>
            <span className="count-label">Secs</span>
          </div>
        </div>

        {/* Swipe to View Invitation Slider */}
        <div className="swipe-container">
          <div
            ref={trackRef}
            className={`swipe-track ${isDone ? 'done' : ''}`}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          >
            <div
              className="swipe-fill"
              style={{ width: `${swipeProgress * 100}%` }}
            />
            <div
              className="swipe-thumb"
              style={{
                transform: `translateX(${
                  swipeProgress *
                  (trackRef.current ? Math.max(0, trackRef.current.offsetWidth - 52) : 220)
                }px)`,
              }}
            >
              <ChevronRight className="w-5 h-5 text-amber-200" />
            </div>
            <span className="swipe-label">
              {isDone ? 'Welcome to Celebration! ✦' : 'Swipe to View Invitation'}
            </span>
          </div>
        </div>

        {/* Save The Date Banner */}
        <div className="save-date-box">
          <div className="sdt-left">
            <span className="sdt-tag">SAVE THE DATE</span>
            <h3 className="sdt-title">{weddingData.date.full}</h3>
            <p className="sdt-sub">Nikkah &amp; Reception Celebrations</p>
          </div>
          <a
            href={weddingData.calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-calendar"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Add to Calendar</span>
          </a>
        </div>
      </div>
    </section>
  );
}

