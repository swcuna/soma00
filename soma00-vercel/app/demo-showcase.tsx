'use client';

import { useState } from 'react';

const films = [
  { src: 'dexterity', title: 'Follow the hand.', label: 'Human motion', copy: 'From a human gesture to a robotic response. Movement, translated.' },
  { src: 'placement', title: 'Find the balance.', label: 'Precise placement', copy: 'Delicate movements. Careful placement. Dexterity in the details.' },
  { src: 'coordination', title: 'Move together.', label: 'Coordinated handling', copy: 'Two hands working through one task. From the first grasp to the final placement.' },
];

export default function DemoShowcase() {
  const [active, setActive] = useState(0);
  const film = films[active];
  return <section className="showcase" id="in-action" aria-labelledby="showcase-title">
    <div className="wrap">
      <div className="showcase-heading"><div><p className="eyebrow">Dexterous demonstrations</p><h2 id="showcase-title">It’s in the movement.</h2></div><span className="film-count">0{active + 1} / 03</span></div>
      <div className="showcase-grid">
        <figure>
          <video key={film.src} controls playsInline preload="metadata" width="960" height="540" poster={`/media/${film.src}.jpg`} aria-label={`${film.title} demonstration`}>
            <source src={`/media/${film.src}.mp4`} type="video/mp4"/>
            <a href={`/media/${film.src}.mp4`}>Watch the demonstration</a>
          </video>
          <figcaption><span>SOMA00</span><span>{film.label}</span><span>Dexterous intelligence</span></figcaption>
        </figure>
        <div className="film-options" role="group" aria-label="Choose a demonstration">
          {films.map((item, index) => <button key={item.src} className="film-option" aria-pressed={active === index} onClick={() => setActive(index)}>
            <span className="option-label">0{index + 1} / {item.label}</span>
            <span className="option-title">{item.title}<span aria-hidden="true">↗</span></span>
            <span className="option-copy">{item.copy}</span>
          </button>)}
        </div>
      </div>
    </div>
  </section>;
}
