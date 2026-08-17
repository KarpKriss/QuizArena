import SideRays from './components/SideRays/SideRays'
import CompassLogo from './components/CompassLogo'
import OrbitParticles from './components/OrbitParticles/OrbitParticles'
import { useEffect, useState } from 'react'
import InstructionsPage from './pages/InstructionsPage'
import { lookupQuestion, type QuestionLookupResult } from './data/questions'
import { verifyQuestionAnswer, type VerificationResult } from './data/questions/questionVerification'
import GooeyNav, { type GooeyNavItem } from './components/GooeyNav/GooeyNav'

const normalizePath = (pathname: string) => {
  const path = pathname.replace(/\/+$/, '')
  return path || '/'
}

type Navigate = (path: string) => void

const navigationItems: GooeyNavItem[] = [
  { label: 'Start', href: '/' },
  { label: 'Sprawdź pytanie', href: '/sprawdz-pytanie' },
  { label: 'Instrukcja', href: '/instrukcja' },
]

function AppBottomNav({ currentPath, navigate }: { currentPath: string; navigate: Navigate }) {
  const activeIndex = currentPath === '/sprawdz-pytanie' ? 1 : currentPath === '/instrukcja' ? 2 : 0
  return (
    <GooeyNav
      items={navigationItems}
      activeIndex={activeIndex}
      particleCount={8}
      particleDistances={[48, 8]}
      particleR={140}
      animationTime={500}
      timeVariance={160}
      colors={[1, 2, 3, 1, 2, 3, 4, 2]}
      onNavigate={navigate}
    />
  )
}

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

function QuestionsPage() {
  const [questionId, setQuestionId] = useState('')
  const [lookupResult, setLookupResult] = useState<QuestionLookupResult | null>(null)
  const [answer, setAnswer] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [answerError, setAnswerError] = useState<string | null>(null)

  const findQuestion = () => {
    if (!questionId.trim()) {
      setLookupResult(null)
      setSearchError('Wpisz ID karty, aby ją sprawdzić.')
      return
    }

    setLookupResult(lookupQuestion(questionId))
    setSearchError(null)
    setAnswer('')
    setAnswerError(null)
    setVerificationResult(null)
  }

  const verifyAnswer = () => {
    if (!lookupResult || lookupResult.status !== 'found') return
    if (!answer.trim()) {
      setAnswerError('Wpisz swoją odpowiedź przed sprawdzeniem.')
      return
    }

    setAnswerError(null)
    setVerificationResult(verifyQuestionAnswer(answer, lookupResult.question))
  }

  useEffect(() => {
    if (!verificationResult) return

    const frame = window.requestAnimationFrame(() => {
      const result = document.querySelector('.verification-result')
      const nav = document.querySelector('.gooey-nav')
      if (!(result instanceof HTMLElement) || !(nav instanceof HTMLElement)) return

      const overlap = result.getBoundingClientRect().bottom - nav.getBoundingClientRect().top + 18
      if (overlap > 0) {
        window.scrollBy({
          top: overlap,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        })
      }
    })

    return () => window.cancelAnimationFrame(frame)
  }, [verificationResult])

  return (
    <main className="site-shell utility-page">
      <div className="utility-page__backdrop" aria-hidden="true" />

      <section className="utility-page__content">
        <div className="utility-page__brand"><CompassLogo compact /></div>
        <p className="utility-page__eyebrow">QUIZ ARENA</p>
        <h1>Sprawdź pytanie</h1>
        <p className="utility-page__lead">
          Wpisz ID karty, aby wyświetlić jej zatwierdzoną treść.
        </p>

        <form className="question-checker" onSubmit={(event) => { event.preventDefault(); findQuestion() }}>
          <label htmlFor="question-number">ID karty</label>
          <input
            id="question-number"
            name="question-number"
            type="text"
            autoComplete="off"
            placeholder="np. POL-RR-01"
            aria-describedby="question-number-hint"
            value={questionId}
            aria-invalid={searchError ? true : undefined}
            onChange={(event) => {
              setQuestionId(event.target.value)
              if (searchError) setSearchError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                findQuestion()
              }
            }}
          />
          <span id="question-number-hint">Np. POL-RR-01, POL-DUO-12, POL-TAR-02.</span>
          <button type="submit">Sprawdź</button>
        </form>
        {searchError && <p className="form-feedback form-feedback--error" role="status">{searchError}</p>}
        {lookupResult?.status === 'found' && (
          <article className="question-result" aria-live="polite">
            <div className="question-result__meta"><span>{lookupResult.question.id}</span><span>{lookupResult.question.category}</span></div>
            <dl>
              <div><dt>Tryb</dt><dd>{lookupResult.question.mode}</dd></div>
              {lookupResult.question.difficulty && <div><dt>Poziom trudności</dt><dd>{lookupResult.question.difficulty}</dd></div>}
            </dl>
            <p>{lookupResult.question.question}</p>
            <form className="answer-checker" onSubmit={(event) => {
              event.preventDefault()
              verifyAnswer()
            }}>
              <label htmlFor="player-answer">Twoja odpowiedź</label>
              <input
                id="player-answer"
                type={lookupResult.question.mode === 'Target' ? 'number' : 'text'}
                inputMode={lookupResult.question.mode === 'Target' ? 'decimal' : 'text'}
                value={answer}
                aria-invalid={answerError ? true : undefined}
                onChange={(event) => {
                  setAnswer(event.target.value)
                  if (answerError) setAnswerError(null)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    verifyAnswer()
                  }
                }}
                placeholder={lookupResult.question.mode === 'Target' ? 'Wpisz liczbę' : 'Wpisz swoją odpowiedź'}
              />
              <button type="submit">Sprawdź odpowiedź</button>
            </form>
            {answerError && <p className="form-feedback form-feedback--error" role="status">{answerError}</p>}
            {verificationResult && (
              <p className={`verification-result verification-result--${verificationResult.status}`} role="status">
                {verificationResult.status === 'correct' && 'Poprawna odpowiedź'}
                {verificationResult.status === 'incorrect' && 'Niepoprawna odpowiedź'}
                {verificationResult.status === 'exact-target' && 'Dokładne trafienie'}
                {verificationResult.status === 'within-target-tolerance' && 'Odpowiedź w tolerancji'}
                {verificationResult.status === 'missing-answer-key' && 'Klucz odpowiedzi do tego pytania nie został jeszcze dodany.'}
              </p>
            )}
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

  const page = path === '/sprawdz-pytanie'
    ? <QuestionsPage />
    : path === '/instrukcja'
      ? <InstructionsPage />
      : <StartPage navigate={navigate} />

  return <>{page}<AppBottomNav currentPath={path} navigate={navigate} /></>
}
