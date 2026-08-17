import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from 'react'
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
  x: number
  y: number
  size: number
  delay: number
  color: string
}

const particleColors = ['#FFF4CC', '#F2C75C', '#EAB308', '#FFFFFF']

const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount

export default function GooeyNav({
  items,
  activeIndex,
  animationTime = 520,
  particleCount = 8,
  onNavigate,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const indicatorAnimationRef = useRef<Animation | null>(null)
  const navigationTimerRef = useRef<number | null>(null)
  const textTimerRef = useRef<number | null>(null)
  const particleTimerRef = useRef<number | null>(null)
  const morphTimerRef = useRef<number | null>(null)

  const [activeBounds, setActiveBounds] = useState<ActiveBounds | null>(null)
  const [visualIndex, setVisualIndex] = useState(activeIndex)
  const [direction, setDirection] = useState<Direction>('right')
  const [isMorphing, setIsMorphing] = useState(false)
  const [particles, setParticles] = useState<NavParticle[]>([])

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const measureElement = (element: HTMLElement): ActiveBounds | null => {
    const container = containerRef.current?.getBoundingClientRect()
    if (!container) return null
    const rect = element.getBoundingClientRect()
    return {
      left: rect.left - container.left,
      top: rect.top - container.top,
      width: rect.width,
      height: rect.height,
    }
  }

  const measureIndicator = (): ActiveBounds | null => {
    const indicator = indicatorRef.current
    const container = containerRef.current?.getBoundingClientRect()
    if (!indicator || !container) return activeBounds
    const rect = indicator.getBoundingClientRect()
    return {
      left: rect.left - container.left,
      top: rect.top - container.top,
      width: rect.width,
      height: rect.height,
    }
  }

  useLayoutEffect(() => {
    const current = navRef.current?.querySelectorAll('li')[activeIndex]
    if (current instanceof HTMLElement) {
      const nextBounds = measureElement(current)
      if (nextBounds) setActiveBounds(nextBounds)
    }
    setVisualIndex(activeIndex)

    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      const item = navRef.current?.querySelectorAll('li')[activeIndex]
      if (!(item instanceof HTMLElement)) return
      const nextBounds = measureElement(item)
      if (nextBounds) setActiveBounds(nextBounds)
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [activeIndex])

  const clearTransitionTimers = () => {
    if (navigationTimerRef.current !== null) window.clearTimeout(navigationTimerRef.current)
    if (textTimerRef.current !== null) window.clearTimeout(textTimerRef.current)
    if (morphTimerRef.current !== null) window.clearTimeout(morphTimerRef.current)
  }

  const createParticles = (from: ActiveBounds, to: ActiveBounds, moveDirection: Direction) => {
    if (prefersReducedMotion()) return

    const count = Math.max(0, Math.min(particleCount, 10))
    const half = Math.ceil(count / 2)
    const sourceEdge = moveDirection === 'right' ? from.left + 8 : from.left + from.width - 8
    const targetEdge = moveDirection === 'right' ? to.left + 10 : to.left + to.width - 10
    const sourceY = from.top + from.height / 2
    const targetY = to.top + to.height / 2

    const nextParticles = Array.from({ length: count }, (_, index) => {
      const landing = index >= half
      const localIndex = landing ? index - half : index
      const verticalSign = localIndex % 2 === 0 ? -1 : 1
      const outward = 8 + (localIndex % 3) * 5

      return {
        id: Date.now() + index,
        left: landing ? targetEdge : sourceEdge,
        top: (landing ? targetY : sourceY) + verticalSign * (3 + (localIndex % 2) * 3),
        x: (moveDirection === 'right' ? 1 : -1) * (landing ? outward : -outward),
        y: verticalSign * (10 + (localIndex % 3) * 7),
        size: 3 + (index % 3) * 1.5,
        delay: landing ? 135 + localIndex * 24 : localIndex * 20,
        color: particleColors[index % particleColors.length],
      }
    })

    setParticles(nextParticles)
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
    particleTimerRef.current = window.setTimeout(() => setParticles([]), 720)
  }

  const playIndicatorMorph = (from: ActiveBounds, to: ActiveBounds, moveDirection: Direction) => {
    const indicator = indicatorRef.current
    setActiveBounds(to)

    if (!indicator || prefersReducedMotion()) {
      setIsMorphing(false)
      return
    }

    indicatorAnimationRef.current?.cancel()
    setDirection(moveDirection)
    setIsMorphing(true)

    const distance = Math.abs(to.left - from.left)
    const stretch = Math.min(1.2, 1.1 + distance / 1100)
    const midWidth = Math.max(42, lerp(from.width, to.width, 0.52) * stretch)
    const settleWidth = Math.max(42, to.width * 0.985)

    indicatorAnimationRef.current = indicator.animate(
      [
        {
          left: `${from.left}px`,
          top: `${from.top}px`,
          width: `${from.width}px`,
          height: `${from.height}px`,
          transform: 'scaleX(1) scaleY(1)',
          borderRadius: '14px',
          filter: 'brightness(1)',
          offset: 0,
        },
        {
          left: `${lerp(from.left, to.left, 0.5)}px`,
          top: `${lerp(from.top, to.top, 0.5)}px`,
          width: `${midWidth}px`,
          height: `${lerp(from.height, to.height, 0.5)}px`,
          transform: 'scaleX(1.06) scaleY(.94)',
          borderRadius: moveDirection === 'right' ? '18px 10px 10px 18px' : '10px 18px 18px 10px',
          filter: 'brightness(1.08)',
          offset: 0.48,
        },
        {
          left: `${lerp(from.left, to.left, 0.9)}px`,
          top: `${lerp(from.top, to.top, 0.9)}px`,
          width: `${settleWidth}px`,
          height: `${to.height}px`,
          transform: 'scaleX(.975) scaleY(1.025)',
          borderRadius: moveDirection === 'right' ? '12px 15px 15px 12px' : '15px 12px 12px 15px',
          filter: 'brightness(1.03)',
          offset: 0.82,
        },
        {
          left: `${to.left}px`,
          top: `${to.top}px`,
          width: `${to.width}px`,
          height: `${to.height}px`,
          transform: 'scaleX(1) scaleY(1)',
          borderRadius: '14px',
          filter: 'brightness(1)',
          offset: 1,
        },
      ],
      {
        duration: animationTime,
        easing: 'cubic-bezier(.2,.78,.22,1)',
        fill: 'both',
      },
    )

    indicatorAnimationRef.current.onfinish = () => {
      indicatorAnimationRef.current?.cancel()
      indicatorAnimationRef.current = null
      setIsMorphing(false)
    }

    if (morphTimerRef.current !== null) window.clearTimeout(morphTimerRef.current)
    morphTimerRef.current = window.setTimeout(() => setIsMorphing(false), animationTime + 60)
  }

  const beginTransition = (element: HTMLElement, targetIndex: number) => {
    if (targetIndex === visualIndex && targetIndex === activeIndex) return false

    const targetBounds = measureElement(element)
    const currentBounds = measureIndicator() ?? activeBounds
    if (!targetBounds || !currentBounds) return false

    const nextDirection: Direction = targetBounds.left >= currentBounds.left ? 'right' : 'left'
    clearTransitionTimers()
    createParticles(currentBounds, targetBounds, nextDirection)
    playIndicatorMorph(currentBounds, targetBounds, nextDirection)

    const textDelay = Math.min(300, Math.max(190, animationTime * 0.5))
    textTimerRef.current = window.setTimeout(() => setVisualIndex(targetIndex), textDelay)
    return true
  }

  const navigateAfterMorphStarts = (href: string) => {
    if (!onNavigate) return
    const navigationDelay = Math.min(340, Math.max(240, animationTime * 0.58))
    navigationTimerRef.current = window.setTimeout(() => onNavigate(href), navigationDelay)
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
    if (!onNavigate) return
    event.preventDefault()

    if (index === activeIndex) return

    const item = event.currentTarget.parentElement
    if (!(item instanceof HTMLElement)) {
      onNavigate(href)
      return
    }

    beginTransition(item, index)
    navigateAfterMorphStarts(href)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number, href: string) => {
    if (event.key !== ' ') return
    event.preventDefault()

    const item = event.currentTarget.parentElement
    if (item instanceof HTMLElement) beginTransition(item, index)
    navigateAfterMorphStarts(href)
  }

  useLayoutEffect(() => () => {
    clearTransitionTimers()
    if (particleTimerRef.current !== null) window.clearTimeout(particleTimerRef.current)
    indicatorAnimationRef.current?.cancel()
  }, [])

  return (
    <div
      className={`gooey-nav${isMorphing ? ` gooey-nav--morphing gooey-nav--${direction}` : ''}`}
      ref={containerRef}
      style={{ '--gooey-time': `${animationTime}ms` } as CSSProperties}
    >
      <nav aria-label="Główna nawigacja">
        {activeBounds && (
          <span
            ref={indicatorRef}
            className="gooey-nav__active-indicator"
            aria-hidden="true"
            style={{
              left: activeBounds.left,
              top: activeBounds.top,
              width: activeBounds.width,
              height: activeBounds.height,
            }}
          />
        )}

        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={visualIndex === index ? 'active' : ''}>
              <a
                href={item.href}
                aria-current={activeIndex === index ? 'page' : undefined}
                onClick={(event) => handleClick(event, index, item.href)}
                onKeyDown={(event) => handleKeyDown(event, index, item.href)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <span className="gooey-nav__particles" aria-hidden="true">
          {particles.map((particle) => (
            <i
              key={particle.id}
              style={{
                '--particle-x': `${particle.x}px`,
                '--particle-y': `${particle.y}px`,
                '--particle-size': `${particle.size}px`,
                '--particle-delay': `${particle.delay}ms`,
                '--particle-color': particle.color,
                left: particle.left,
                top: particle.top,
              } as CSSProperties}
            />
          ))}
        </span>
      </nav>
    </div>
  )
}
