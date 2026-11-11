import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <header class="topbar">
      <a class="brand" href="#"><span class="brand-mark">R</span> RALLYPOINT</a>
      <nav><a href="#programs">Programs</a><a href="#courts">Our courts</a><a href="#join">Membership</a></nav>
      <a class="nav-cta" href="#join">Book your space <span>↗</span></a>
    </header>

    <main>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow"><span class="live-dot"></span> YOUR GAME. YOUR COMMUNITY.</p>
          <h1>Find your<br><em>rally.</em></h1>
          <p class="intro">A better game starts here. Train with purpose, meet your people and make every point count.</p>
          <div class="hero-actions">
            <a class="button button-lime" href="#join">Start playing <span>↗</span></a>
            <a class="text-link" href="#programs">Explore programs <span>↓</span></a>
          </div>
          <div class="hero-stats">
            <div><strong>6</strong><span>Pro courts</span></div>
            <div><strong>250<span>+</span></strong><span>Active players</span></div>
            <div><strong>7</strong><span>Days a week</span></div>
          </div>
        </div>
        <div class="hero-art" role="img" aria-label="Abstract badminton court graphic">
          <div class="court-lines"></div>
          <div class="shuttle"><span></span><i></i></div>
          <div class="art-label">PLAY<br>WITHOUT<br>LIMITS.</div>
          <div class="vertical-label">EST. 2024 — PLAY TOGETHER</div>
        </div>
      </section>

      <section class="ticker" aria-label="Club values">
        <span>PLAY BOLD</span><b>✳</b><span>STAY SHARP</span><b>✳</b><span>RALLY TOGETHER</span><b>✳</b><span>PLAY BOLD</span>
      </section>

      <section class="section programs" id="programs">
        <div class="section-heading"><div><p class="eyebrow">WHAT WE OFFER / 01</p><h2>Make room<br>for <em>more.</em></h2></div><p>Whether you're picking up a racket for the first time or chasing your next tournament win, there's a place for you here.</p></div>
        <div class="program-grid">
          <article class="program-card beginner"><span class="card-number">01 / LEARN</span><div><h3>Start<br>strong.</h3><p>Beginner coaching and friendly sessions to build confidence.</p><a href="#join">Explore beginners ↗</a></div></article>
          <article class="program-card training"><span class="card-number">02 / IMPROVE</span><div><h3>Train<br>smarter.</h3><p>Focused drills, footwork and one-to-one coaching.</p><a href="#join">View training ↗</a></div></article>
          <article class="program-card community"><span class="card-number">03 / CONNECT</span><div><h3>Find your<br>people.</h3><p>Social doubles, club nights and weekend ladders.</p><a href="#join">Join the club ↗</a></div></article>
        </div>
      </section>

      <section class="court-section" id="courts">
        <div><p class="eyebrow">THE HOME COURT / 02</p><h2>Good energy.<br><em>Great courts.</em></h2><p class="court-copy">Space to move, room to grow. Our club is built around quality courts, welcoming people and a love for the game.</p><a class="button button-dark" href="#join">Plan your visit ↗</a></div>
        <div class="court-visual"><div class="court-box"><div class="net"></div><div class="center-line"></div><div class="service-line"></div><span>RALLYPOINT<br>ARENA</span></div></div>
      </section>

      <section class="join" id="join"><p class="eyebrow">YOUR NEXT GAME STARTS HERE / 03</p><h2>Ready to<br><em>rally?</em></h2><p>Bring your energy. We'll bring the court.</p><a class="button button-lime" href="mailto:hello@rallypoint.example">Get in touch <span>↗</span></a></section>
    </main>
    <footer><a class="brand" href="#"><span class="brand-mark">R</span> RALLYPOINT</a><span>GOOD GAMES. GOOD PEOPLE.</span><span>© 2026 RALLYPOINT CLUB</span></footer>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {}
