import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
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
type EffectBounds = ActiveBounds
type Direction = 'left' | 'right'

type Particle = {
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
}

type Particle = {
  id: number
  startX: number
  startY: number
  endX: number
  endY: number
  time: number
  scale: number
  color: string
  rotate: number
  delay: number
}

const colorMap: Record<number, string> = {
  1: '#FFF4CC',
  2: '#F2C75C',
  3: '#EAB308',
  4: '#FFFFFF',
}

export default function GooeyNav({
  items,
  activeIndex,
  animationTime = 600,
  particleCount = 17,
  particleDistances = [90, 10],
  particleR = 400,
  timeVariance = 700,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  onNavigate,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const navigationTimerRef = useRef<number | null>(null)
  const particleTimerRef = useRef<number | null>(null)
  const particleIdRef = useRef(0)

  const [visualIndex, setVisualIndex] = useState(activeIndex)
  const [effectBounds, setEffectBounds] = useState<EffectBounds | null>(null)
  const [particles, setParticles] = useState<Particle[]>([])
  const [animationNonce, setAnimationNonce] = useState(0)

  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const noise = (n = 1) => n / 2 - Math.random() * n

  const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
    const angle =
      (((360 + noise(8)) / totalPoints) * pointIndex * Math.PI) / 180
    return [distance * Math.cos(angle), distance * Math.sin(angle)] as const
  }

  const measureElement = (element: HTMLElement): EffectBounds | null => {
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
  }

  const createParticle = (index: number): Particle => {
    const total = Math.max(1, particleCount)
    const rotateNoise = noise(particleR / 10)
    const time = Math.max(420, animationTime * 2 + noise(timeVariance * 2))
    const start = getXY(particleDistances[0], total - index, total)
    const end = getXY(
      particleDistances[1] + noise(7),
      total - index,
      total,
    )
    const colorKey = colors[Math.floor(Math.random() * colors.length)] ?? 1

    particleIdRef.current += 1

    return {
      id: particleIdRef.current,
      startX: start[0],
      startY: start[1],
      endX: end[0],
      endY: end[1],
      time,
      scale: 1 + noise(0.2),
      color: colorMap[colorKey] ?? '#FFF4CC',
      rotate:
        rotateNoise > 0
          ? (rotateNoise + particleR / 20) * 10
          : (rotateNoise - particleR / 20) * 10,
      delay: 30 + index * 6,
    }
  }

  const startReactBitsAnimation = () => {
    if (prefersReducedMotion()) {
      setParticles([])
      setAnimationNonce((value) => value + 1)
      return
    }

    const count = Math.max(0, Math.min(particleCount, 24))
    const nextParticles = Array.from({ length: count }, (_, index) =>
      createParticle(index),
    )

    setParticles(nextParticles)
    setAnimationNonce((value) => value + 1)

    if (particleTimerRef.current !== null) {
      window.clearTimeout(particleTimerRef.current)
    }

    const longestParticle = nextParticles.reduce(
      (longest, particle) => Math.max(longest, particle.time + particle.delay),
      animationTime,
    )

    particleTimerRef.current = window.setTimeout(
      () => setParticles([]),
      longestParticle + 120,
    )
  }

  const moveEffectTo = (element: HTMLElement) => {
    const bounds = measureElement(element)
    if (!bounds) return false
    setEffectBounds(bounds)
    return true
  }

  useLayoutEffect(() => {
    const item = navRef.current?.querySelectorAll('li')[activeIndex]
    if (item instanceof HTMLElement) {
      moveEffectTo(item)
    }
    setVisualIndex(activeIndex)

    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(() => {
      const activeItem = navRef.current?.querySelectorAll('li')[activeIndex]
      if (activeItem instanceof HTMLElement) {
        moveEffectTo(activeItem)
      }
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [activeIndex])

  const navigateAfterAnimationStarts = (href: string) => {
    if (!onNavigate) return

    if (navigationTimerRef.current !== null) {
      window.clearTimeout(navigationTimerRef.current)
    }

    const delay = prefersReducedMotion()
      ? 0
      : Math.min(330, Math.max(250, animationTime * 0.46))

    navigationTimerRef.current = window.setTimeout(() => {
      onNavigate(href)
    }, delay)
  }

  const activateItem = (element: HTMLElement, index: number, href: string) => {
    if (index === visualIndex && index === activeIndex) return

    const moved = moveEffectTo(element)
    if (!moved) {
      onNavigate?.(href)
      return
    }

    setVisualIndex(index)
    startReactBitsAnimation()
    navigateAfterAnimationStarts(href)
  }

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    index: number,
    href: string,
  ) => {
    if (!onNavigate) return
    event.preventDefault()

    const item = event.currentTarget.parentElement
    if (!(item instanceof HTMLElement)) {
      onNavigate(href)
      return
    }

    activateItem(item, index, href)
  }

  const handleKeyDown = (
    event: KeyboardEvent<HTMLAnchorElement>,
    index: number,
    href: string,
  ) => {
    if (event.key !== ' ') return
    event.preventDefault()

    const item = event.currentTarget.parentElement
    if (!(item instanceof HTMLElement)) return
    activateItem(item, index, href)
  }

  useLayoutEffect(
    () => () => {
      if (navigationTimerRef.current !== null) {
        window.clearTimeout(navigationTimerRef.current)
      }
      if (particleTimerRef.current !== null) {
        window.clearTimeout(particleTimerRef.current)
      }
    },
    [],
  )

  return (
    <div className="gooey-nav" ref={containerRef}>
      <svg className="gooey-nav__svg-filter" aria-hidden="true">
        <defs>
          <filter id="gooey-nav-liquid-filter" x="-80%" y="-120%" width="260%" height="340%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <nav aria-label="Główna nawigacja">
        {effectBounds && (
          <span
            className="gooey-nav__effect"
            aria-hidden="true"
            style={{
              left: effectBounds.left,
              top: effectBounds.top,
              width: effectBounds.width,
              height: effectBounds.height,
            }}
          >
            <span key={animationNonce} className="gooey-nav__liquid">
              <span className="gooey-nav__blob" />
              {particles.map((particle) => (
                <span
                  key={particle.id}
                  className="gooey-nav__particle"
                  style={{
                    '--start-x': `${particle.startX}px`,
                    '--start-y': `${particle.startY}px`,
                    '--end-x': `${particle.endX}px`,
                    '--end-y': `${particle.endY}px`,
                    '--particle-time': `${particle.time}ms`,
                    '--particle-scale': particle.scale,
                    '--particle-color': particle.color,
                    '--particle-rotate': `${particle.rotate}deg`,
                    '--particle-delay': `${particle.delay}ms`,
                  } as CSSProperties}
                >
                  <span />
                </span>
              ))}
            </span>
          </span>
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
