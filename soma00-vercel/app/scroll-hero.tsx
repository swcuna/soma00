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
      const progress = motion.matches ? 0 : Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, distance * .8)));
      const eased = progress * progress * (3 - 2 * progress);
      const mobile = root.clientWidth <= 700;
      const startScale = mobile ? .9 : .48;
      root.style.setProperty('--film-scale', String(startScale + (1 - startScale) * eased));
      root.style.setProperty('--film-x', `${mobile ? 0 : root.clientWidth * .23 * (1 - eased)}px`);
      root.style.setProperty('--film-y', `${mobile ? panel.clientHeight * .18 * (1 - eased) : 0}px`);
      root.style.setProperty('--copy-opacity', String(Math.max(0, 1 - progress * 3)));
      root.style.setProperty('--cue-visibility', progress > .34 ? 'hidden' : 'visible');
      root.style.setProperty('--copy-y', `${-progress * 60}px`);
      root.style.setProperty('--film-radius', `${12 * (1 - eased)}px`);
      copy.current!.inert = !motion.matches && progress > .34;
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

  return <section className="zoom-section" id="top" ref={section} aria-labelledby="hero-title">
    <div className="zoom-stage" ref={stage}>
      <div className="zoom-copy" ref={copy}>
        <p className="hero-label">SOMA00 / Physical intelligence</p>
        <h1 id="hero-title">Human-like<br/>{' '}dexterity.<br/><span>Real-world<br/>{' '}possibility.</span></h1>
        <p className="hero-description">Precision in every movement.<br/>{' '}Intelligence in every interaction.</p>
        <a className="button" href="#in-action">Explore in action <span aria-hidden="true">↗</span></a>
      </div>
      <div className="zoom-film">
        <video ref={video} loop muted playsInline controls preload="auto" width="960" height="540" poster="/media/hero.jpg" aria-label="SOMA00 dexterous manipulation demonstration" onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
          <source src="/media/hero.mp4" type="video/mp4"/>
          <a href="/media/hero.mp4">Watch the SOMA00 demonstration</a>
        </video>
      </div>
      <div className="zoom-bottom">
        <a href="#capabilities" className="scroll-cue">Scroll to explore <span aria-hidden="true">↓</span></a>
        <button className="motion-toggle" onClick={() => { const media = video.current!; if (media.paused) media.play().catch(() => {}); else media.pause(); }} aria-label={paused ? 'Play hero video' : 'Pause hero video'}>{paused ? 'Play' : 'Pause'} <span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span></button>
      </div>
    </div>
  </section>;
}
