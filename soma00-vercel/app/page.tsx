'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

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

export default function Home() {
  const hero = useRef<HTMLElement>(null);
  const opening = useRef<HTMLVideoElement>(null);
  const demonstrations = useRef<HTMLElement>(null);
  const demonstration = useRef<HTMLVideoElement>(null);
  const requestedPlayback = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const fullFilm = useRef<HTMLVideoElement>(null);
  const filmTrigger = useRef<HTMLButtonElement>(null);
  const [openingPaused, setOpeningPaused] = useState(true);
  const [selected, setSelected] = useState(0);
  const [loadDemos, setLoadDemos] = useState(false);
  const [demoPaused, setDemoPaused] = useState(true);
  const [filmOpen, setFilmOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const current = demos[selected];

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
    const video = demonstration.current;
    if (!video || !loadDemos) return;
    video.load();
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && (!reducedMotion || requestedPlayback.current)) video.play().catch(() => setDemoPaused(true));
      else video.pause();
    }, { threshold: 0.3 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [selected, loadDemos, reducedMotion]);

  useEffect(() => {
    if (!filmOpen) return;
    const panel = dialog.current;
    panel?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    opening.current?.pause();
    demonstration.current?.pause();
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
          <div className="demo-heading"><div><p className="eyebrow">Selected demonstrations</p><h2>It’s in the movement.</h2></div><span className="demo-count">0{selected + 1} / 03</span></div>
          <div className="demo-stage" id="demo-panel" role="tabpanel" aria-labelledby={`demo-tab-${selected}`}>
            <video ref={demonstration} muted loop playsInline preload="none" poster={`/media/${current.file}.jpg`} aria-label={`${current.category} demonstration`} onPlay={() => setDemoPaused(false)} onPause={() => setDemoPaused(true)}>
              {loadDemos && <source src={`/media/${current.file}.mp4`} type="video/mp4" />}
            </video>
            <button className="round-button demo-play" onClick={() => toggleVideo(demonstration.current)} aria-label={demoPaused ? 'Play demonstration' : 'Pause demonstration'}><PlayIcon paused={demoPaused} /></button>
          </div>
          <aside className="demo-playlist" aria-label="Demonstration playlist">
            <p className="playlist-heading">Choose a demonstration</p>
            <div className="playlist-items" role="tablist" aria-label="Choose a demonstration" aria-orientation="vertical">
              {demos.map((demo, index) => <button key={demo.file} id={`demo-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="demo-panel" tabIndex={selected === index ? 0 : -1} className="playlist-item" onClick={() => {
                requestedPlayback.current = true;
                setLoadDemos(true);
                if (window.matchMedia('(max-width: 900px)').matches) {
                  document.getElementById('demo-panel')?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' });
                }
                if (selected === index) demonstration.current?.play().catch(() => {});
                else setSelected(index);
              }} onKeyDown={event => {
                if (['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
                  event.preventDefault();
                  const next = event.key === 'Home' ? 0 : event.key === 'End' ? demos.length - 1 : (index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : demos.length - 1)) % demos.length;
                  setSelected(next);
                  document.getElementById(`demo-tab-${next}`)?.focus();
                }
              }}>
                <span className="playlist-thumbnail"><img src={`/media/${demo.file}.jpg`} alt="" width="160" height="90" /><span className="playlist-play"><PlayIcon paused /></span></span>
                <span className="playlist-copy">
                  <span className="playlist-title">Watch {demo.category.toLowerCase()}</span>
                  <span className="playlist-subtitle">{demo.name}</span>
                  {selected === index && <span className="playlist-status"><span aria-hidden="true">●</span> {demoPaused ? 'Selected · paused' : 'Now playing'}</span>}
                </span>
              </button>)}
            </div>
          </aside>
          <div className="demo-caption"><p aria-live="polite">SOMA00 <span>/</span> {current.category}</p><span>Human motion, embodied.</span></div>
        </div>
      </section>
      <section className="closing section-shell" id="vision">
        <p className="eyebrow"><span className="status-dot" /> Our horizon</p>
        <h2>Your full-stack intelligence<br /><span>in one go.</span></h2>
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
