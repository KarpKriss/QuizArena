import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import OptionWheel from './OptionWheel'
import './SideNavigator.css'

const OPEN_NAV_EVENT = 'quiz-arena:open-navigation'

const sections = [
  { label: 'Start', id: 'start' },
  { label: 'O grze', id: 'o-grze' },
  { label: 'Tryby', id: 'tryby' },
  { label: 'Jak grać', id: 'jak-grac' },
  { label: 'Karty', id: 'karty' },
]

export default function SideNavigator() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(0)
  const [revealProgress, setRevealProgress] = useState(0)
  const [manuallyRevealed, setManuallyRevealed] = useState(false)
  const labels = useMemo(() => sections.map((section) => section.label), [])

  const effectiveReveal = manuallyRevealed ? 1 : revealProgress
  const triggerVisible = effectiveReveal > 0.01

  const goToSection = (index: number) => {
    const section = sections[index]
    if (!section) return
    setSelected(index)
    setOpen(false)
    window.setTimeout(() => {
      document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }

  useEffect(() => {
    const updateVisibility = () => {
      const viewport = Math.max(window.innerHeight, 1)
      const start = Math.max(120, viewport * 0.18)
      const end = Math.max(start + 180, viewport * 0.55)
      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / (end - start)))
      setRevealProgress(progress)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    window.addEventListener('resize', updateVisibility)
    return () => {
      window.removeEventListener('scroll', updateVisibility)
      window.removeEventListener('resize', updateVisibility)
    }
  }, [])

  useEffect(() => {
    const openNavigation = () => {
      setManuallyRevealed(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_NAV_EVENT, openNavigation)
    return () => window.removeEventListener(OPEN_NAV_EVENT, openNavigation)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    const previousTouchAction = document.body.style.touchAction
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.touchAction = previousTouchAction
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className={`side-nav-trigger${triggerVisible && !open ? ' side-nav-trigger--visible' : ''}`}
        style={{ '--nav-reveal': effectiveReveal } as CSSProperties}
        aria-label="Otwórz nawigację"
        aria-expanded={open}
        aria-hidden={!triggerVisible || open}
        tabIndex={triggerVisible && !open ? 0 : -1}
        onClick={() => setOpen(true)}
      >
        <span className="side-nav-trigger__ring" aria-hidden="true" />
        <span className="side-nav-trigger__dot" aria-hidden="true" />
      </button>

      <div className={`side-nav-overlay${open ? ' side-nav-overlay--open' : ''}`} aria-hidden={!open}>
        <button
          type="button"
          className="side-nav-backdrop"
          aria-label="Zamknij nawigację"
          onClick={() => setOpen(false)}
        />

        <aside className="side-nav-wheel-shell" aria-label="Szybka nawigacja po stronie">
          <OptionWheel
            items={labels}
            defaultSelected={selected}
            onChange={(index) => setSelected(index)}
            onSelect={(index) => goToSection(index)}
            textColor="#8a8a8a"
            activeColor="#f2c75c"
            side="right"
            fontSize={1.7}
            spacing={1.68}
            curve={0.92}
            tilt={7}
            blur={0.8}
            fade={0.18}
            minOpacity={0.12}
            smoothing={55}
            inset={58}
            draggable
          />
        </aside>
      </div>
    </>
  )
}
