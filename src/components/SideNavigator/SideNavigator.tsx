import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import OptionWheel from './OptionWheel'
import './SideNavigator.css'

const routes = [
  { label: 'Start', path: '/' },
  { label: 'Sprawdź pytanie', path: '/sprawdz-pytanie' },
  { label: 'Instrukcja', path: '/instrukcja' },
]

type SideNavigatorProps = {
  currentPath: string
}

export default function SideNavigator({ currentPath }: SideNavigatorProps) {
  const currentIndex = Math.max(0, routes.findIndex((route) => route.path === currentPath))
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(currentIndex)
  const labels = useMemo(() => routes.map((route) => route.label), [])

  const goToRoute = (index: number) => {
    const route = routes[index]
    if (!route) return
    setSelected(index)
    setOpen(false)
    window.setTimeout(() => window.location.assign(route.path), 40)
  }

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
        className={`side-nav-trigger${!open ? ' side-nav-trigger--visible' : ''}`}
        style={{ '--nav-reveal': 1 } as CSSProperties}
        aria-label="Otwórz nawigację"
        aria-expanded={open}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
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

        <aside className="side-nav-wheel-shell" aria-label="Szybka nawigacja">
          <OptionWheel
            items={labels}
            defaultSelected={currentIndex}
            onChange={(index) => setSelected(index)}
            onSelect={(index) => goToRoute(index)}
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
          <span className="side-nav-current" aria-live="polite">{routes[selected]?.label}</span>
        </aside>
      </div>
    </>
  )
}
