import { useEffect, useMemo, useState } from 'react'
import OptionWheel from './OptionWheel'
import './SideNavigator.css'

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
  const labels = useMemo(() => sections.map((section) => section.label), [])

  const goToSection = (index: number) => {
    const section = sections[index]
    if (!section) return
    setSelected(index)
    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => setOpen(false), 260)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        className={`side-nav-trigger${open ? ' side-nav-trigger--open' : ''}`}
        aria-label={open ? 'Zamknij nawigację' : 'Otwórz nawigację'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
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

        <aside className="side-nav-panel" aria-label="Szybka nawigacja po stronie">
          <div className="side-nav-panel__label">NAWIGACJA</div>
          <OptionWheel
            items={labels}
            defaultSelected={selected}
            onChange={(index) => setSelected(index)}
            textColor="#7f7f7f"
            activeColor="#f2c75c"
            side="right"
            fontSize={1.45}
            spacing={1.55}
            curve={1}
            tilt={8}
            blur={1.2}
            fade={0.2}
            smoothing={170}
            inset={30}
            draggable
          />
          <button type="button" className="side-nav-go" onClick={() => goToSection(selected)}>
            Przejdź
          </button>
        </aside>
      </div>
    </>
  )
}
