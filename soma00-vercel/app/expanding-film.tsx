'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

export default function ExpandingFilm({ suspended, onPlay }: { suspended: boolean; onPlay: () => void }) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const autoplayStarted = useRef(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = section.current;
    if (!container) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 901px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const stageHeight = container.firstElementChild?.getBoundingClientRect().height ?? innerHeight;
      const distance = Math.max(1, container.offsetHeight - stageHeight);
      const progress = desktop.matches && !motion.matches
        ? Math.max(0, Math.min(1, -container.getBoundingClientRect().top / distance))
        : 1;
      container.style.setProperty('--film-expand', String(progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const preference = () => { if (motion.matches) video.current?.pause(); schedule(); };
    const loader = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoaded(true); loader.disconnect(); }
    }, { rootMargin: '200px' });
    loader.observe(container);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', preference);
    update();
    return () => {
      cancelAnimationFrame(frame);
      loader.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', preference);
    };
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!loaded || !player) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) player.pause();
      else if (!autoplayStarted.current && !suspended && window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)').matches) {
        autoplayStarted.current = true;
        player.play().catch(() => {});
      }
    }, { threshold: 0.45 });
    observer.observe(player);
    return () => observer.disconnect();
  }, [loaded, suspended]);

  useEffect(() => { if (suspended) video.current?.pause(); }, [suspended]);

  return <section className="expanding-film" id="simulation" ref={section} aria-label="SOMA00 in simulation" style={{ '--film-expand': 0 } as CSSProperties}>
    <div className="expanding-film-stage">
      <div className="expanding-film-frame">
        <video ref={video} controls muted loop playsInline preload="none" width="1920" height="1080"
          src={loaded ? '/media/simulation.mp4' : undefined} poster="/media/simulation.jpg"
          aria-label="SOMA00 simulation demonstration" onPlay={onPlay}>
          Your browser does not support video playback. <a href="/media/simulation.mp4">Watch the film</a>.
        </video>
      </div>
    </div>
  </section>;
}
