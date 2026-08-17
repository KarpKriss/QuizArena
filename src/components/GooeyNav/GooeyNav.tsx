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
type NavParticle = {
  id: number
  left: number
  top: number
  startX: number
  startY: number
  endX: number
  endY: number
  size: number
  delay: number
  duration: number
  rotation: number
  color: string
}

const particleColors = ['#FFF4CC', '#F2C75C', '#EAB308', '#FFFFFF']

export default function GooeyNav({
  items,
  activeIndex,
  animationTime = 500,
  particleCount = 8,
  particleDistances = [48, 8],
  particleR = 140,
  timeVariance = 160,
  colors = [1, 2, 3, 1, 2, 3, 4, 2],
  onNavigate,
}: GooeyNavProps) {
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

  const createParticles = (to: ActiveBounds, moveDirection: Direction) => {
    const [outerDistance, innerDistance] = particleDistances
    const safeParticleCount = Math.max(0, Math.floor(particleCount))
    if (safeParticleCount === 0) {
      setParticles([])
      return
    }

    const centerX = to.left + to.width / 2
    const centerY = to.top + to.height / 2
    const directionOffset = moveDirection === 'right' ? -12 : 12
    const colorIndexes = colors.length > 0 ? colors : [1]

    const nextParticles = Array.from({ length: safeParticleCount }, (_, index) => {
      const angleJitter = ((index * 17) % 9) - 4
      const angle = (((360 / safeParticleCount) * index + angleJitter) * Math.PI) / 180
      const verticalRatio = 0.56
      const durationOffset = timeVariance > 0 ? ((index * 47) % timeVariance) - timeVariance / 2 : 0
      const colorIndex = colorIndexes[index % colorIndexes.length]
      const paletteIndex = Math.abs(colorIndex - 1) % particleColors.length

      return {
        id: Date.now() + index,
        left: centerX + directionOffset,
        top: centerY,
        startX: Math.cos(angle) * outerDistance,
        startY: Math.sin(angle) * outerDistance * verticalRatio,
        endX: Math.cos(angle) * innerDistance,
        endY: Math.sin(angle) * innerDistance * verticalRatio,
        size: 5 + (index % 3) * 1.5,
        delay: 18 + index * 15,
        duration: Math.max(360, animationTime + durationOffset),
        rotation: (index % 2 === 0 ? 1 : -1) * (particleR / 2 + index * 7),
        color: particleColors[paletteIndex],
      }
    })

    setParticles(nextParticles)
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
    const cleanupDelay = Math.max(...nextParticles.map(({ delay, duration }) => delay + duration)) + 80
    particleTimerRef.current = window.setTimeout(() => setParticles([]), cleanupDelay)
  }

  const beginTransition = (element: HTMLElement, targetIndex: number) => {
    const container = containerRef.current?.getBoundingClientRect()
    const target = element.getBoundingClientRect()
    if (!container || !activeBounds || targetIndex === activeIndex) return

    const targetBounds = { left: target.left - container.left, top: target.top - container.top, width: target.width, height: target.height }
    const nextDirection: Direction = targetIndex > activeIndex ? 'right' : 'left'
    setDirection(nextDirection)
    setIsMorphing(false)
    createParticles(targetBounds, nextDirection)
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
          {particles.map((particle) => (
            <i
              key={particle.id}
              style={{
                '--particle-start-x': `${particle.startX}px`,
                '--particle-start-y': `${particle.startY}px`,
                '--particle-end-x': `${particle.endX}px`,
                '--particle-end-y': `${particle.endY}px`,
                '--particle-size': `${particle.size}px`,
                '--particle-delay': `${particle.delay}ms`,
                '--particle-duration': `${particle.duration}ms`,
                '--particle-rotation': `${particle.rotation}deg`,
                '--particle-color': particle.color,
                left: particle.left,
                top: particle.top,
              } as React.CSSProperties}
            />
          ))}
        </span>
      </nav>
    </div>
  )
}
