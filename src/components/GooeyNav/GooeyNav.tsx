import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import './GooeyNav.css'

export type GooeyNavItem = { label: string; href: string }

type GooeyNavProps = {
  items: GooeyNavItem[]
  activeIndex: number
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  colors?: number[]
  onNavigate?: (href: string) => void
}

type Particle = { start: [number, number]; end: [number, number]; time: number; scale: number; color: number; rotate: number }
type RenderedParticle = Particle & { id: number }

const defaultColors = [1, 2, 3, 1, 2, 3, 1, 4]

export default function GooeyNav({
  items,
  activeIndex: controlledActiveIndex,
  animationTime = 560,
  particleCount = 14,
  particleDistances = [70, 10],
  particleR = 136,
  timeVariance = 420,
  colors = defaultColors,
  onNavigate,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const filterRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const particleTimerRef = useRef<number | null>(null)
  const navigationTimerRef = useRef<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(controlledActiveIndex)
  const [particles, setParticles] = useState<RenderedParticle[]>([])
  const noise = (value = 1) => value / 2 - Math.random() * value

  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180)
    return [distance * Math.cos(angle), distance * Math.sin(angle)]
  }

  const createParticle = (index: number, time: number): Particle => {
    const rotation = noise(particleR / 10)
    return {
      start: getXY(particleDistances[0], particleCount - index, particleCount),
      end: getXY(particleDistances[1] + noise(7), particleCount - index, particleCount),
      time,
      scale: 1 + noise(.2),
      color: colors[Math.floor(Math.random() * colors.length)] ?? 1,
      rotate: rotation > 0 ? (rotation + particleR / 20) * 10 : (rotation - particleR / 20) * 10,
    }
  }

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const position = element.getBoundingClientRect()
    const styles = { left: `${position.x - container.x}px`, top: `${position.y - container.y}px`, width: `${position.width}px`, height: `${position.height}px` }
    Object.assign(filterRef.current.style, styles)
    Object.assign(textRef.current.style, styles)
    textRef.current.textContent = element.textContent
  }

  const makeParticles = (element: HTMLSpanElement) => {
    element.style.setProperty('--time', `${animationTime * 2 + timeVariance}ms`)
    element.classList.remove('active')
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
    setParticles(Array.from({ length: particleCount }, (_, index) => ({
      ...createParticle(index, animationTime * 2 + noise(timeVariance * 2)),
      id: Date.now() + index,
    })))
    window.requestAnimationFrame(() => element.classList.add('active'))
    particleTimerRef.current = window.setTimeout(() => setParticles([]), animationTime * 2 + timeVariance * 2)
  }

  const activate = (element: HTMLElement, index: number) => {
    setActiveIndex(index)
    updateEffectPosition(element)
    if (filterRef.current) {
      makeParticles(filterRef.current)
    }
    if (textRef.current) {
      textRef.current.classList.remove('active')
      void textRef.current.offsetWidth
      textRef.current.classList.add('active')
    }
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
    const item = event.currentTarget.parentElement
    if (item) activate(item, index)
    if (onNavigate) {
      event.preventDefault()
      if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current)
      navigationTimerRef.current = window.setTimeout(() => onNavigate(href), 140)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number, href: string) => {
    if (event.key !== ' ') return
    event.preventDefault()
    const item = event.currentTarget.parentElement
    if (item) activate(item, index)
    if (onNavigate) {
      if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current)
      navigationTimerRef.current = window.setTimeout(() => onNavigate(href), 140)
    }
  }

  useEffect(() => { setActiveIndex(controlledActiveIndex) }, [controlledActiveIndex])

  useEffect(() => {
    const activeItem = navRef.current?.querySelectorAll('li')[activeIndex]
    if (activeItem) { updateEffectPosition(activeItem); textRef.current?.classList.add('active') }
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => {
      const currentItem = navRef.current?.querySelectorAll('li')[activeIndex]
      if (currentItem) updateEffectPosition(currentItem)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [activeIndex])

  useEffect(() => () => {
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current)
  }, [])

  return (
    <div className="gooey-nav" ref={containerRef}>
      <nav aria-label="Główna nawigacja">
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? 'active' : ''}>
              <a href={item.href} aria-current={activeIndex === index ? 'page' : undefined} onClick={(event) => handleClick(event, index, item.href)} onKeyDown={(event) => handleKeyDown(event, index, item.href)}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} aria-hidden="true">
        {particles.map((particle) => (
          <span
            className="particle"
            key={particle.id}
            style={{
              '--start-x': `${particle.start[0]}px`,
              '--start-y': `${particle.start[1]}px`,
              '--end-x': `${particle.end[0]}px`,
              '--end-y': `${particle.end[1]}px`,
              '--time': `${particle.time}ms`,
              '--scale': `${particle.scale}`,
              '--color': `var(--color-${particle.color}, #fff4cc)`,
              '--rotate': `${particle.rotate}deg`,
            } as React.CSSProperties}
          ><span className="point" /></span>
        ))}
      </span>
      <span className="effect text" ref={textRef} aria-hidden="true" />
    </div>
  )
}
