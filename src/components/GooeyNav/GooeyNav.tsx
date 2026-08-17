import { useId, useState } from 'react'
import './GooeyNav.css'

export type GooeyNavItem = {
  label: string
  href: string
}

type GooeyNavProps = {
  items: GooeyNavItem[]
  activeIndex: number
  animationTime?: number
  particleCount?: number
  particleDistances?: [number, number]
  particleR?: number
  timeVariance?: number
  colors?: string[]
  onNavigate?: (href: string) => void
}

type Particle = {
  id: number
  angle: number
  distance: number
  delay: number
  size: number
  color: string
}

const defaultColors = ['#eab308', '#f2c75c', '#fff4cc', '#ffffff']

function createParticles(
  count: number,
  distances: [number, number],
  radius: number,
  timeVariance: number,
  colors: string[],
): Particle[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    angle: (360 / count) * index + ((index * 37) % 19),
    distance: distances[1] + ((index * 29) % Math.max(distances[0] - distances[1], 1)),
    delay: (index * 47) % timeVariance,
    size: Math.max(3, Math.round(radius / 38) + (index % 3)),
    color: colors[index % colors.length],
  }))
}

export default function GooeyNav({
  items,
  activeIndex,
  animationTime = 560,
  particleCount = 14,
  particleDistances = [70, 10],
  particleR = 136,
  timeVariance = 420,
  colors = defaultColors,
  onNavigate,
}: GooeyNavProps) {
  const filterId = useId().replace(/:/g, '')
  const [burst, setBurst] = useState<{ key: number; index: number } | null>(null)
  const particles = createParticles(particleCount, particleDistances, particleR, timeVariance, colors)

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string, index: number) => {
    if (onNavigate) {
      event.preventDefault()
      onNavigate(href)
    }

    if (index !== activeIndex) {
      setBurst({ key: Date.now(), index })
      window.setTimeout(() => setBurst(null), animationTime + timeVariance)
    }
  }

  return (
    <nav
      className="gooey-nav"
      aria-label="Główna nawigacja"
      style={{ '--gooey-duration': `${animationTime}ms` } as React.CSSProperties}
    >
      <svg className="gooey-nav__filters" aria-hidden="true">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -8" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div className="gooey-nav__surface">
        <div className="gooey-nav__items">
          {items.map((item, index) => {
            const isActive = index === activeIndex
            const isBurstTarget = burst?.index === index
            return (
              <a
                className={`gooey-nav__link${isActive ? ' gooey-nav__link--active' : ''}`}
                href={item.href}
                key={item.href}
                aria-current={isActive ? 'page' : undefined}
                onClick={(event) => handleClick(event, item.href, index)}
              >
                {isBurstTarget && (
                  <span className="gooey-nav__burst" style={{ filter: `url(#${filterId})` }} aria-hidden="true">
                    {particles.map((particle) => (
                      <i
                        key={`${burst.key}-${particle.id}`}
                        style={{
                          '--particle-angle': `${particle.angle}deg`,
                          '--particle-distance': `${particle.distance}px`,
                          '--particle-delay': `${particle.delay}ms`,
                          '--particle-size': `${particle.size}px`,
                          '--particle-color': particle.color,
                        } as React.CSSProperties}
                      />
                    ))}
                  </span>
                )}
                <span>{item.label}</span>
              </a>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
