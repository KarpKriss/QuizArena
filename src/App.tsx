import SideRays from './components/SideRays/SideRays'
import CompassLogo from './components/CompassLogo'
import OrbitParticles from './components/OrbitParticles/OrbitParticles'
import SideNavigator from './components/SideNavigator/SideNavigator'
import './app-pages.css'

const normalizePath = (pathname: string) => {
  const path = pathname.replace(/\/+$/, '')
  return path || '/'
}

function StartPage() {
  return (
    <main className="site-shell start-page">
      <section className="hero start-hero" id="start">
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

          <nav className="hero-mobile-actions start-actions" aria-label="Główne akcje">
            <a className="hero-action-button" href="/sprawdz-pytanie">Sprawdź pytanie</a>
            <a className="hero-action-button" href="/instrukcja">Instrukcja</a>
          </nav>
        </div>
      </section>
    </main>
  )
}

function QuestionsPage() {
  return (
    <main className="site-shell utility-page">
      <SideNavigator currentPath="/sprawdz-pytanie" />
      <div className="utility-page__backdrop" aria-hidden="true" />

      <section className="utility-page__content">
        <div className="utility-page__brand"><CompassLogo compact /></div>
        <p className="utility-page__eyebrow">QUIZ ARENA</p>
        <h1>Sprawdź pytanie</h1>
        <p className="utility-page__lead">
          Wpisz numer pytania z karty. W kolejnym kroku podłączymy do tego właściwą bazę pytań i odpowiedzi.
        </p>

        <form className="question-checker" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="question-number">Numer pytania</label>
          <input
            id="question-number"
            name="question-number"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder="np. 0147"
            aria-describedby="question-number-hint"
          />
          <span id="question-number-hint">Na razie przygotowujemy sam ekran i wpisywanie numeru.</span>
          <button type="submit">Sprawdź</button>
        </form>
      </section>
    </main>
  )
}

function InstructionsPage() {
  return (
    <main className="site-shell utility-page">
      <SideNavigator currentPath="/instrukcja" />
      <div className="utility-page__backdrop" aria-hidden="true" />

      <section className="utility-page__content utility-page__content--instructions">
        <div className="utility-page__brand"><CompassLogo compact /></div>
        <p className="utility-page__eyebrow">QUIZ ARENA</p>
        <h1>Instrukcja</h1>
        <p className="utility-page__lead">
          To jest osobna przestrzeń na instrukcję gry. Na razie zostawiamy tutaj bazowy ekran — w następnej iteracji dodamy właściwe sekcje instrukcji do koła nawigacji.
        </p>
      </section>
    </main>
  )
}

export default function App() {
  const path = normalizePath(window.location.pathname)

  if (path === '/sprawdz-pytanie') return <QuestionsPage />
  if (path === '/instrukcja') return <InstructionsPage />
  return <StartPage />
}
