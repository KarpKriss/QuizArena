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

export default function GooeyNav({ items, activeIndex, animationTime = 420, onNavigate }: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLUListElement>(null)
  const [activeBounds, setActiveBounds] = useState<ActiveBounds | null>(null)

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

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    const item = event.currentTarget.parentElement
    if (item) updateActiveBounds(item)
    if (onNavigate) {
      event.preventDefault()
      onNavigate(href)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, href: string) => {
    if (event.key !== ' ') return
    event.preventDefault()
    const item = event.currentTarget.parentElement
    if (item) updateActiveBounds(item)
    onNavigate?.(href)
  }

  return (
    <div className="gooey-nav" ref={containerRef} style={{ '--gooey-time': `${animationTime}ms` } as React.CSSProperties}>
      <nav aria-label="Główna nawigacja">
        {activeBounds && (
          <span
            className="gooey-nav__active-indicator"
            aria-hidden="true"
            style={{ left: activeBounds.left, top: activeBounds.top, width: activeBounds.width, height: activeBounds.height }}
          />
        )}
        <ul ref={navRef}>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? 'active' : ''}>
              <a href={item.href} aria-current={activeIndex === index ? 'page' : undefined} onClick={(event) => handleClick(event, item.href)} onKeyDown={(event) => handleKeyDown(event, item.href)}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
