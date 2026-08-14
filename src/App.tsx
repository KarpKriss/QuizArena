import SideRays from './components/SideRays/SideRays'
import CompassLogo from './components/CompassLogo'
import OrbitParticles from './components/OrbitParticles/OrbitParticles'
import { useEffect, useState } from 'react'
import SideNavigator, { baseNavigationItems } from './components/SideNavigator/SideNavigator'
import InstructionsPage from './pages/InstructionsPage'
import { lookupQuestion, type QuestionLookupResult } from './data/questions'

const normalizePath = (pathname: string) => {
  const path = pathname.replace(/\/+$/, '')
  return path || '/'
}

type Navigate = (path: string) => void

function StartPage({ navigate }: { navigate: Navigate }) {
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
            <a
              className="hero-action-button"
              href="/sprawdz-pytanie"
              onClick={(event) => {
                event.preventDefault()
                navigate('/sprawdz-pytanie')
              }}
            >
              Sprawdź pytanie
            </a>
            <a
              className="hero-action-button"
              href="/instrukcja"
              onClick={(event) => {
                event.preventDefault()
                navigate('/instrukcja')
              }}
            >
              Instrukcja
            </a>
          </nav>
        </div>
      </section>
    </main>
  )
}

function QuestionsPage({ navigate }: { navigate: Navigate }) {
  const [questionId, setQuestionId] = useState('')
  const [lookupResult, setLookupResult] = useState<QuestionLookupResult | null>(null)

  return (
    <main className="site-shell utility-page">
      <SideNavigator currentPath="/sprawdz-pytanie" items={baseNavigationItems} onNavigate={navigate} />
      <div className="utility-page__backdrop" aria-hidden="true" />

      <section className="utility-page__content">
        <div className="utility-page__brand"><CompassLogo compact /></div>
        <p className="utility-page__eyebrow">QUIZ ARENA</p>
        <h1>Sprawdź pytanie</h1>
        <p className="utility-page__lead">
          Wpisz ID karty, aby wyświetlić jej zatwierdzoną treść.
        </p>

        <form className="question-checker" onSubmit={(event) => { event.preventDefault(); setLookupResult(lookupQuestion(questionId)) }}>
          <label htmlFor="question-number">ID karty</label>
          <input
            id="question-number"
            name="question-number"
            type="text"
            autoComplete="off"
            placeholder="np. POL-RR-01"
            aria-describedby="question-number-hint"
            value={questionId}
            onChange={(event) => setQuestionId(event.target.value)}
          />
          <span id="question-number-hint">Np. POL-RR-01, POL-DUO-12, POL-TAR-02.</span>
          <button type="submit">Sprawdź</button>
        </form>
        {lookupResult?.status === 'found' && (
          <article className="question-result" aria-live="polite">
            <div className="question-result__meta"><span>{lookupResult.question.id}</span><span>{lookupResult.question.category}</span></div>
            <dl>
              <div><dt>Tryb</dt><dd>{lookupResult.question.mode}</dd></div>
              {lookupResult.question.difficulty && <div><dt>Poziom trudności</dt><dd>{lookupResult.question.difficulty}</dd></div>}
            </dl>
            <p>{lookupResult.question.question}</p>
          </article>
        )}
        {lookupResult?.status === 'pending-source-transfer' && (
          <p className="question-result question-result--notice" role="status">Dane tej karty nie zostały jeszcze zsynchronizowane.</p>
        )}
        {lookupResult?.status === 'not-found' && (
          <p className="question-result question-result--notice" role="status">Nie znaleziono karty o podanym ID.</p>
        )}
      </section>
    </main>
  )
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname))

  useEffect(() => {
    const syncPath = () => setPath(normalizePath(window.location.pathname))
    window.addEventListener('popstate', syncPath)
    return () => window.removeEventListener('popstate', syncPath)
  }, [])

  const navigate: Navigate = (nextPath) => {
    const normalizedPath = normalizePath(nextPath)
    if (normalizedPath === path) return
    window.history.pushState({}, '', normalizedPath)
    setPath(normalizedPath)
  }

  if (path === '/sprawdz-pytanie') return <QuestionsPage navigate={navigate} />
  if (path === '/instrukcja') return <InstructionsPage navigate={navigate} />
  return <StartPage navigate={navigate} />
}
