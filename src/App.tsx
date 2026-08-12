import SideRays from './components/SideRays/SideRays'
import CompassLogo from './components/CompassLogo'
import OrbitParticles from './components/OrbitParticles/OrbitParticles'

const gameModes = [
  { number: '01', name: 'Rosyjska ruletka', text: 'Presja czasu, szybkie decyzje i ryzyko, które może się opłacić.' },
  { number: '02', name: 'Gladiatorzy', text: 'Pojedynek graczy, ale reszta stołu też ma coś do ugrania.' },
  { number: '03', name: 'Duo', text: 'Współpraca pod presją — dobra odpowiedź liczy się podwójnie, jeśli działa duet.' },
  { number: '04', name: 'Licytacja', text: 'Najpierw deklarujesz, ile wiesz. Dopiero później musisz to udowodnić.' },
  { number: '05', name: 'Sojusz', text: 'Tymczasowa współpraca, wspólny cel i pytanie: komu naprawdę możesz zaufać?' },
]

const highlights = [
  ['4–8', 'graczy'],
  ['5', 'trybów gry'],
  ['20', 'kategorii'],
  ['∞', 'emocji przy stole'],
]

export default function App() {
  return (
    <main className="site-shell">
      <section className="hero" id="start">
        <div className="hero__background" aria-hidden="true">
          <SideRays
            speed={2.5}
            rayColor1="#EAB308"
            rayColor2="#FFF4CC"
            intensity={2}
            spread={2}
            origin="top-right"
            tilt={0}
            saturation={1.35}
            blend={0.52}
            falloff={1.6}
            opacity={0.9}
          />
        </div>
        <div className="hero__shade" aria-hidden="true" />

        <div className="hero__content">
          <div className="hero-logo" aria-label="Quiz Arena">
            <div className="hero-logo-stage">
              <OrbitParticles count={38} />
              <div className="hero-logo__mark"><CompassLogo /></div>
            </div>
          </div>

          <nav className="hero-mobile-actions" aria-label="Szybkie akcje">
            <a className="hero-action-button" href="#karty">Sprawdź pytanie</a>
            <a className="hero-action-button" href="#jak-grac">Instrukcja</a>
          </nav>
        </div>
      </section>

      <section className="intro section-shell" id="o-grze">
        <div className="section-label">01 / O GRZE</div>
        <div className="intro__grid">
          <h2>Quiz, w którym cały stół bierze udział.</h2>
          <div className="intro__copy">
            <p>
              Quiz Arena łączy klasyczne pytania z mechanikami, które zmuszają graczy
              do podejmowania decyzji. Każda runda może wyglądać inaczej — raz liczy się
              szybkość, innym razem blef, współpraca albo odwaga do podjęcia ryzyka.
            </p>
            <a className="text-link" href="#jak-grac">Jak wygląda rozgrywka <span>↗</span></a>
          </div>
        </div>

        <div className="stats-strip">
          {highlights.map(([value, label]) => (
            <div className="stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="modes section-shell" id="tryby">
        <div className="section-label">02 / TRYBY GRY</div>
        <div className="modes__heading">
          <h2>Ta sama wiedza. Pięć zupełnie różnych napięć.</h2>
          <p>Rzut kostką może zmienić zasady rundy zanim padnie pierwsza odpowiedź.</p>
        </div>

        <div className="mode-list">
          {gameModes.map((mode) => (
            <article className="mode-row" key={mode.number}>
              <span className="mode-row__number">{mode.number}</span>
              <h3>{mode.name}</h3>
              <p>{mode.text}</p>
              <span className="mode-row__arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="how section-shell" id="jak-grac">
        <div className="section-label">03 / JAK GRAĆ</div>
        <div className="coming-card">
          <span>ROZGRYWKA</span>
          <h2>Wchodzisz do Areny. Reszta zależy od stołu.</h2>
          <p>
            W kolejnej iteracji tutaj pojawi się interaktywny przebieg rundy — od rzutu
            kostką, przez wybór trybu, aż po nagrody, monety i karty specjalne.
          </p>
          <a className="button button--primary" href="#karty">Dalej</a>
        </div>
      </section>

      <section className="cards-preview section-shell" id="karty">
        <div className="section-label">04 / KARTY</div>
        <div className="cards-preview__content">
          <div>
            <span className="eyebrow">NIE TYLKO PYTANIA</span>
            <h2>Karty, które potrafią odwrócić grę.</h2>
          </div>
          <p>
            Docelowo ta sekcja pokaże fizyczne karty Quiz Areny, ich rewersy, tryby oraz
            karty specjalne. Na tym etapie zostawiamy miejsce pod właściwe rendery i zdjęcia.
          </p>
        </div>
        <div className="card-fan" aria-hidden="true">
          <div className="mock-card mock-card--one"><span>?</span></div>
          <div className="mock-card mock-card--two"><span>⚡</span></div>
          <div className="mock-card mock-card--three"><CompassLogo compact /></div>
          <div className="mock-card mock-card--four"><span>↻</span></div>
          <div className="mock-card mock-card--five"><span>!</span></div>
        </div>
      </section>

      <footer className="footer section-shell">
        <div className="brand-mini brand-mini--footer">
          <span className="brand-mini__mark"><CompassLogo compact /></span>
          <span className="brand-mini__text"><strong>QUIZ</strong> <em>ARENA</em></span>
        </div>
        <span>Prototype landing page / v0.2</span>
      </footer>
    </main>
  )
}
