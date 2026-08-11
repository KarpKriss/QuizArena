import Ferrofluid from './components/Ferrofluid/Ferrofluid'
import CompassLogo from './components/CompassLogo'

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
          <Ferrofluid
            colors={['#fff7d6', '#f1c75b', '#c18b27', '#ffffff']}
            speed={0.2}
            scale={1.45}
            turbulence={0.78}
            fluidity={0.12}
            rimWidth={0.18}
            sharpness={2.8}
            shimmer={0.95}
            glow={1.9}
            opacity={0.72}
            flowDirection="down"
            mouseInteraction
            mouseStrength={0.65}
            mouseRadius={0.25}
            mouseDampening={0.14}
          />
        </div>
        <div className="hero__shade" aria-hidden="true" />

        <header className="topbar-wrap">
          <nav className="topbar" aria-label="Główna nawigacja">
            <a className="brand-mini" href="#start" aria-label="Quiz Arena — strona główna">
              <span className="brand-mini__mark"><CompassLogo compact /></span>
              <span className="brand-mini__text"><strong>QUIZ</strong> <em>ARENA</em></span>
            </a>

            <div className="topbar__links">
              <a href="#o-grze">O grze</a>
              <a href="#tryby">Tryby</a>
              <a href="#jak-grac">Jak grać</a>
              <a href="#karty">Karty</a>
            </div>

            <a className="topbar__cta" href="#o-grze">Wejdź do Areny</a>
          </nav>
        </header>

        <div className="hero__content">
          <div className="hero__kicker">
            <span className="hero__kicker-dot" />
            Imprezowa gra quizowa
          </div>

          <div className="hero-logo" aria-label="Quiz Arena">
            <div className="hero-logo__mark"><CompassLogo /></div>
            <div className="hero-logo__wordmark">
              <span>QUIZ</span>
              <strong>ARENA</strong>
            </div>
          </div>

          <p className="hero__claim">Wiedza to dopiero początek.</p>
          <p className="hero__lead">
            Tu nie wystarczy znać odpowiedź. Trzeba jeszcze ryzykować, negocjować,
            współpracować i czasem idealnie wyczuć moment, żeby uderzyć.
          </p>

          <div className="hero__actions">
            <a className="button button--primary" href="#o-grze">Poznaj Quiz Arenę</a>
            <a className="button button--glass" href="#tryby">
              Zobacz tryby
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <div className="hero__bottomline">
          <span>Wiedza</span>
          <i />
          <span>Ryzyko</span>
          <i />
          <span>Taktyka</span>
          <i />
          <span>Chaos</span>
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
