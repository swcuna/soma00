'use client';

import { useEffect, useRef, useState } from 'react';

export default function ScrollHero() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  useEffect(() => {
    const root = section.current!;
    const panel = stage.current!;
    const media = video.current!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = root.offsetHeight - panel.offsetHeight;
      const progress = motion.matches ? 0 : Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, distance * .85)));
      const eased = progress * progress * (3 - 2 * progress);
      root.style.setProperty('--film-scale', String(1 - .09 * eased));
      root.style.setProperty('--copy-opacity', String(Math.max(0, 1 - progress * 3)));
      root.style.setProperty('--copy-visibility', progress > .34 ? 'hidden' : 'visible');
      copy.current!.inert = progress > .34;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const preference = () => {
      if (motion.matches) media.pause();
      else media.play().catch(() => {});
      update();
    };
    preference();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', preference);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      motion.removeEventListener('change', preference);
    };
  }, []);

  return <section className="film-section" id="top" ref={section} aria-label="SOMA00 introduction">
    <div className="film-stage" ref={stage}>
      <div className="film-frame">
        <video className="opening-video" ref={video} loop muted playsInline preload="auto" width="960" height="540" poster="/media/hero.jpg" aria-label="SOMA00 dexterous manipulation demonstration" onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
          <source src="/media/hero.mp4" type="video/mp4"/>
          <a href="/media/hero.mp4">Watch the SOMA00 demonstration</a>
        </video>
        <div className="film-shade" aria-hidden="true"/>
        <header className="header">
          <a className="wordmark" href="#top" aria-label="SOMA home"><img src="/soma-logo.png" alt="SOMA" width="480" height="345"/></a>
          <nav aria-label="Main navigation"><a href="#in-action">In action</a><a className="outline" href="mailto:yanjie@somastacks.com?subject=SOMA00%20inquiry">Get in touch <span aria-hidden="true">↗</span></a></nav>
        </header>
        <div className="film-copy" ref={copy}>
          <p className="eyebrow">SOMA00 / Dexterous intelligence</p>
          <h1>Human motion.<br/>Robotic possibility.</h1>
        </div>
        <div className="film-bottom">
          <a className="discover" href="#introduction"><span aria-hidden="true">↓</span> Discover SOMA00</a>
          <div className="film-controls"><a href="/media/hero.mp4" target="_blank" rel="noreferrer">Watch full film <span aria-hidden="true">▷</span></a><button onClick={() => { const media = video.current!; if (media.paused) media.play().catch(() => {}); else media.pause(); }} aria-label={paused ? 'Play hero video' : 'Pause hero video'}>{paused ? '▷' : 'Ⅱ'}</button></div>
        </div>
      </div>
    </div>
  </section>;
}
