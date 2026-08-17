import { useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
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

type ActiveBounds = { left: number; top: number; width: number; height: number }
type Direction = 'left' | 'right'
type NavParticle = { id: number; left: number; top: number; x: number; y: number; size: number; delay: number; color: string }

const particleColors = ['#FFF4CC', '#F2C75C', '#EAB308', '#FFFFFF']

export default function GooeyNav({ items, activeIndex, animationTime = 460, particleCount = 8, onNavigate }: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const navigationTimerRef = useRef<number | null>(null)
  const particleTimerRef = useRef<number | null>(null)
  const [activeBounds, setActiveBounds] = useState<ActiveBounds | null>(null)
  const [direction, setDirection] = useState<Direction>('right')
  const [isMorphing, setIsMorphing] = useState(false)
  const [particles, setParticles] = useState<NavParticle[]>([])

  const updateActiveBounds = (element: HTMLElement) => {
    const container = containerRef.current?.getBoundingClientRect()
    const item = element.getBoundingClientRect()
    if (!container) return
    setActiveBounds({ left: item.left - container.left, top: item.top - container.top, width: item.width, height: item.height })
  }

  useLayoutEffect(() => {
    const current = navRef.current?.querySelectorAll('li')[activeIndex]
    if (current) updateActiveBounds(current)

    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => {
      const item = navRef.current?.querySelectorAll('li')[activeIndex]
      if (item) updateActiveBounds(item)
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [activeIndex])

  const createParticles = (from: ActiveBounds, to: ActiveBounds, moveDirection: Direction) => {
    const sourceEdge = moveDirection === 'right' ? from.left + from.width - 8 : from.left + 8
    const targetEdge = moveDirection === 'right' ? to.left + 10 : to.left + to.width - 10
    const nextParticles = Array.from({ length: particleCount }, (_, index) => {
      const landing = index >= Math.ceil(particleCount / 2)
      const left = landing ? targetEdge : sourceEdge
      const spread = landing ? 18 : 26
      return {
        id: Date.now() + index,
        left,
        top: from.top + from.height / 2 + (index % 2 === 0 ? -5 : 5),
        x: (moveDirection === 'right' ? 1 : -1) * (landing ? 8 + (index % 3) * 5 : -8 - (index % 3) * 6),
        y: (index % 3 - 1) * spread,
        size: 3 + (index % 3) * 2,
        delay: index * 22,
        color: particleColors[index % particleColors.length],
      }
    })
    setParticles(nextParticles)
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
    particleTimerRef.current = window.setTimeout(() => setParticles([]), 620)
  }

  const beginTransition = (element: HTMLElement, targetIndex: number) => {
    const container = containerRef.current?.getBoundingClientRect()
    const target = element.getBoundingClientRect()
    if (!container || !activeBounds || targetIndex === activeIndex) return

    const targetBounds = { left: target.left - container.left, top: target.top - container.top, width: target.width, height: target.height }
    const nextDirection: Direction = targetIndex > activeIndex ? 'right' : 'left'
    setDirection(nextDirection)
    setIsMorphing(false)
    createParticles(activeBounds, targetBounds, nextDirection)
    setActiveBounds(targetBounds)
    window.requestAnimationFrame(() => setIsMorphing(true))
  }

  const navigateAfterMorph = (href: string) => {
    if (!onNavigate) return
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current)
    navigationTimerRef.current = window.setTimeout(() => onNavigate(href), 240)
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
    const item = event.currentTarget.parentElement
    if (item) beginTransition(item, index)
    if (onNavigate) {
      event.preventDefault()
      navigateAfterMorph(href)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number, href: string) => {
    if (event.key !== ' ') return
    event.preventDefault()
    const item = event.currentTarget.parentElement
    if (item) beginTransition(item, index)
    navigateAfterMorph(href)
  }

  useLayoutEffect(() => {
    if (!isMorphing) return
    const timer = window.setTimeout(() => setIsMorphing(false), animationTime)
    return () => window.clearTimeout(timer)
  }, [animationTime, isMorphing])

  useLayoutEffect(() => () => {
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current)
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
  }, [])

  return (
    <div className="gooey-nav" ref={containerRef} style={{ '--gooey-time': `${animationTime}ms` } as React.CSSProperties}>
      <nav aria-label="Główna nawigacja">
        {activeBounds && (
          <span
            className={`gooey-nav__active-indicator${isMorphing ? ` gooey-nav__active-indicator--morphing gooey-nav__active-indicator--${direction}` : ''}`}
            aria-hidden="true"
            style={{ left: activeBounds.left, top: activeBounds.top, width: activeBounds.width, height: activeBounds.height }}
          />
        )}
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? 'active' : ''}>
              <a href={item.href} aria-current={activeIndex === index ? 'page' : undefined} onClick={(event) => handleClick(event, index, item.href)} onKeyDown={(event) => handleKeyDown(event, index, item.href)}>{item.label}</a>
            </li>
          ))}
        </ul>
        <span className="gooey-nav__particles" aria-hidden="true">
          {particles.map((particle) => <i key={particle.id} style={{ '--particle-x': `${particle.x}px`, '--particle-y': `${particle.y}px`, '--particle-size': `${particle.size}px`, '--particle-delay': `${particle.delay}ms`, '--particle-color': particle.color, left: particle.left, top: particle.top } as React.CSSProperties} />)}
        </span>
      </nav>
    </div>
  )
}
