import ScrollHero from './scroll-hero';
import DemoShowcase from './demo-showcase';

const contact = 'mailto:yanjie@somastacks.com?subject=SOMA00%20inquiry';

export default function Home() {
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <main id="main">
      <ScrollHero/>
      <section className="introduction wrap" id="introduction" aria-labelledby="intro-title">
        <div><p className="eyebrow">SOMA00 / Dexterous intelligence</p><h2 id="intro-title">A world built for people.<br/><span>Within reach of robots.</span></h2></div>
        <div className="intro-detail"><p>The everyday world asks a lot of a pair of hands. We’re bringing that dexterity to robotics.</p><a className="text-link" href="#in-action">See it in action <span aria-hidden="true">↗</span></a></div>
      </section>
      <DemoShowcase/>
      <section className="vision wrap" id="vision" aria-labelledby="vision-title">
        <p className="eyebrow">Our ambition</p>
        <h2 id="vision-title">Intelligence,<br/><span>out in the world.</span></h2>
        <div className="vision-bottom"><p>More capable hands.<br/>More possibilities ahead.</p><a className="text-link" href={contact}>Build with SOMA <span aria-hidden="true">↗</span></a></div>
      </section>
    </main>
    <footer className="wrap"><a className="wordmark" href="#top" aria-label="SOMA home"><img src="/soma-logo.png" alt="SOMA" width="480" height="345"/></a><p>© 2026 SOMA</p><a href={contact}>Get in touch <span aria-hidden="true">↗</span></a></footer>
  </>;
}
