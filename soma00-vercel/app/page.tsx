'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import ExpandingFilm from './expanding-film';

const contact = 'mailto:yanjie@somastacks.com?subject=SOMA00%20inquiry';
const demos = [
  { file: 'dexterity', name: 'Follow the hand.', category: 'Human motion', copy: 'From a human gesture to a robotic response. Movement, translated.' },
  { file: 'placement', name: 'Find the balance.', category: 'Delicate handling', copy: 'A careful grip. A measured release. Small movements make the difference.' },
  { file: 'coordination', name: 'Move together.', category: 'Two-hand coordination', copy: 'Two hands working through one task, from the first grasp to the final placement.' },
];

function Arrow({ down = false }: { down?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={down ? { transform: 'rotate(90deg)' } : undefined}><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
function PlayIcon({ paused }: { paused: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">{paused ? <path d="m6 4 10 6-10 6V4Z" stroke="currentColor" strokeWidth="1.3" /> : <path d="M7 4v12M13 4v12" stroke="currentColor" strokeWidth="1.6" />}</svg>;
}

function TypedClosing() {
  const heading = useRef<HTMLHeadingElement>(null);
  const [ready, setReady] = useState(false);
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;
    setReady(true);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStarted(true); observer.disconnect(); }
    }, { threshold: 0.35 });
    if (heading.current) observer.observe(heading.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const timer = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const count = elapsed < 28 * 42 ? Math.floor(elapsed / 42) : 28 + Math.max(0, Math.floor((elapsed - 28 * 42 - 230) / 42));
      setVisible(Math.min(38, count));
      if (count >= 38) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
  }, [started]);
  let characterIndex = 0;
  return <h2 ref={heading} className={`typed-closing${ready ? ' typing-ready' : ''}${started ? ' typing-started' : ''}`} aria-label="Your full-stack intelligence in one go.">
    {['Your full-stack intelligence', 'in one go.'].map((line, lineIndex) => <span className={`typing-line typing-line-${lineIndex}`} aria-hidden="true" key={line}>
      {line.split(' ').map((word, wordIndex) => <span className="typing-word" key={word}>
        {Array.from((wordIndex ? ' ' : '') + word).map(character => { const index = characterIndex++; return <span className="typing-character" style={{ opacity: !ready || index < visible ? 1 : 0 }} key={index}>{character}</span>; })}
      </span>)}
    </span>)}
  </h2>;
}

export default function Home() {
  const hero = useRef<HTMLElement>(null);
  const opening = useRef<HTMLVideoElement>(null);
  const demonstrations = useRef<HTMLElement>(null);
  const demoVideos = useRef<(HTMLVideoElement | null)[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const fullFilm = useRef<HTMLVideoElement>(null);
  const filmTrigger = useRef<HTMLButtonElement>(null);
  const [openingPaused, setOpeningPaused] = useState(true);
  const [loadDemos, setLoadDemos] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => { setReducedMotion(motion.matches); if (motion.matches) opening.current?.pause(); };
    preference();
    motion.addEventListener('change', preference);
    if (!motion.matches) opening.current?.play().catch(() => setOpeningPaused(true));
    let frame = 0;
    const update = () => {
      frame = 0;
      const section = hero.current;
      if (!section) return;
      const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / (0.52 * innerHeight)));
      section.style.setProperty('--recede', String(motion.matches ? 0 : progress));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setLoadDemos(true); observer.disconnect(); }
    }, { rootMargin: '180px' });
    if (demonstrations.current) observer.observe(demonstrations.current);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      observer.disconnect();
      motion.removeEventListener('change', preference);
    };
  }, []);

  useEffect(() => {
    const section = demonstrations.current;
    if (!section) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 901px)');
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = Math.max(1, section.offsetHeight - innerHeight);
      const progress = !desktop.matches || motion.matches ? 1 : Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
      const galleryWidth = section.querySelector('.demo-gallery')?.getBoundingClientRect().width ?? 1000;
      const finalHeight = (galleryWidth - 56) / 3 * 9 / 16;
      section.style.setProperty('--film-height', `${Math.min(390, innerHeight * .45) * (1 - progress) + finalHeight * progress}px`);
      section.style.setProperty('--spread', String(progress));
      section.style.setProperty('--spread-columns', `${3 - 2 * progress}fr ${progress}fr ${progress}fr`);
      section.dataset.expanding = desktop.matches && !motion.matches ? 'true' : 'false';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    motion.addEventListener('change', schedule);
    update();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); motion.removeEventListener('change', schedule); cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (!entry.isIntersecting) (entry.target as HTMLVideoElement).pause(); });
    }, { threshold: 0.1 });
    demoVideos.current.forEach(video => { if (video) observer.observe(video); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!filmOpen) return;
    const panel = dialog.current;
    panel?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    opening.current?.pause();
    demoVideos.current.forEach(video => video?.pause());
    fullFilm.current?.play().catch(() => {});
    return () => {
      document.body.style.overflow = overflow;
      panel?.close();
      filmTrigger.current?.focus();
    };
  }, [filmOpen]);

  const closeFilm = () => { fullFilm.current?.pause(); setFilmOpen(false); };
  const toggleVideo = (video: HTMLVideoElement | null) => {
    if (video) { if (video.paused) video.play().catch(() => {}); else video.pause(); }
  };

  return <>
    <a className="skip" href="#main">Skip to content</a>
    <header className="header">
      <a className="wordmark" href="#top" aria-label="SOMA home"><img src="/soma-logo.png" alt="SOMA" width="160" height="115" /></a>
      <nav aria-label="Main navigation"><a href="#in-action">In action</a><a href={contact}>Get in touch <Arrow /></a></nav>
    </header>
    <main id="main">
      <section className="hero" id="top" ref={hero} style={{ '--recede': 0 } as CSSProperties} aria-label="Introducing SOMA00">
        <div className="hero-stage">
          <div className="hero-film">
            <video ref={opening} loop muted playsInline preload="auto" poster="/media/hero-opening.jpg" aria-label="SOMA00 following human movements and stacking objects"
              onTimeUpdate={event => { const video = event.currentTarget; hero.current?.style.setProperty('--played', String(video.duration ? video.currentTime / video.duration : 0)); }}
              onPlay={() => setOpeningPaused(false)} onPause={() => setOpeningPaused(true)}>
              <source src="/media/hero-opening.mp4" type="video/mp4" />
            </video>
            <div className="hero-shade" />
          </div>
          <div className="hero-copy">
            <p className="eyebrow light"><span className="status-dot" /> SOMA00 <span className="eyebrow-divider" /> Dexterous intelligence</p>
            <h1>Human motion.<br /><span>Robotic possibility.</span></h1>
          </div>
          <div className="hero-bottom">
            <a className="scroll-link" href="#introduction"><Arrow down /><span>Discover SOMA00</span></a>
            <div className="film-actions">
              <button className="film-link" ref={filmTrigger} onClick={() => setFilmOpen(true)}>Watch full film <span className="film-duration">00:53</span><PlayIcon paused /></button>
              <button className="round-button" onClick={() => toggleVideo(opening.current)} aria-label={openingPaused ? 'Play opening film' : 'Pause opening film'}><PlayIcon paused={openingPaused} /></button>
            </div>
          </div>
        </div>
      </section>
      <section className="introduction section-shell" id="introduction">
        <p className="eyebrow">SOMA00 / Dexterous intelligence</p>
        <div className="intro-grid">
          <h2>A world built for people.<br /><span>Within reach of robots.</span></h2>
          <div className="intro-aside"><p>We bring state-of-the-art dexterity to real-world robots—turning capability into value.</p><a href="#in-action" className="text-link">See it in motion <Arrow /></a></div>
        </div>
      </section>
      <section className="demonstrations" id="in-action" ref={demonstrations}>
        <div className="section-shell">
          <div className="demo-heading"><div><p className="eyebrow">Selected demonstrations</p><h2>It’s in the movement.</h2></div><span className="demo-count">03 films</span></div>
          <div className="demo-gallery">
            {demos.map((demo, index) => <article className="demo-card" key={demo.file} aria-labelledby={`demo-title-${index}`}>
              <div className="demo-card-media">
                <video ref={element => { demoVideos.current[index] = element; }} controls muted playsInline preload="none" src={loadDemos ? `/media/${demo.file}.mp4` : undefined} poster={`/media/${demo.file}.jpg`} aria-label={`${demo.category} demonstration`}
                  onPlay={() => { demoVideos.current.forEach((video, other) => { if (other !== index) video?.pause(); }); }}>
                </video>
              </div>
              <p className="demo-card-category"><span>0{index + 1}</span>{demo.category}</p>
              <h3 id={`demo-title-${index}`}>{demo.name}</h3>
              <p className="demo-card-description">{demo.copy}</p>
            </article>)}
          </div>
        </div>
      </section>
      <ExpandingFilm suspended={filmOpen} onPlay={() => { opening.current?.pause(); demoVideos.current.forEach(video => video?.pause()); }} />
      <section className="closing section-shell" id="vision">
        <p className="eyebrow"><span className="status-dot" /> Our horizon</p>
        <TypedClosing />
        <div className="closing-bottom"><p>More capable hands.<br />More possibilities ahead.</p><a href={contact} className="contact-link">Build with SOMA <Arrow /></a></div>
      </section>
    </main>
    <footer className="section-shell"><a className="wordmark" href="#top" aria-label="SOMA home"><img src="/soma-logo.png" alt="SOMA" width="160" height="115" /></a><span>© 2026 SOMA</span><a href="#top" className="back-top">Back to top <Arrow /></a></footer>
    <dialog ref={dialog} className="film-dialog" aria-labelledby="film-title" onCancel={closeFilm} onClick={event => { if (event.target === event.currentTarget) closeFilm(); }}>
      <div className="film-dialog-heading"><p id="film-title">SOMA00 — In the physical world</p><button onClick={closeFilm} className="close-film" aria-label="Close full film">Close <span aria-hidden="true">×</span></button></div>
      {filmOpen && <video ref={fullFilm} controls playsInline preload="metadata" poster="/media/hero-opening.jpg" src="/media/hero.mp4" />}
    </dialog>
  </>;
}
