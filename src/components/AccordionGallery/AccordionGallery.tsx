import { gsap } from 'gsap'
import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react'
import './AccordionGallery.css'

export type AccordionGalleryItem = {
  id: string
  label: string
  content: ReactNode
}

type AccordionGalleryProps = {
  items: AccordionGalleryItem[]
  orientation?: 'vertical'
  trigger?: 'hover'
  defaultIndex?: number
  expandRatio?: number
  duration?: number
  ease?: string
  parallax?: number
  tilt?: number
  gap?: number
  radius?: number
  grayscale?: boolean
}

export default function AccordionGallery({
  items,
  orientation = 'vertical',
  trigger = 'hover',
  defaultIndex = 0,
  expandRatio = 0.55,
  duration = 0.6,
  ease = 'power3.out',
  parallax = 0.25,
  tilt = 2,
  gap = 10,
  radius = 16,
  grayscale = false,
}: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const panelRefs = useRef<Array<HTMLDivElement | null>>([])

  useLayoutEffect(() => {
    const panels = panelRefs.current.filter((panel): panel is HTMLDivElement => panel !== null)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobileLayout = window.matchMedia('(max-width: 760px)').matches
    const activeGrow = Math.max(expandRatio * items.length, 2)

    if (mobileLayout) {
      gsap.set(panels, { height: 'auto', flexGrow: 0 })
      return
    }

    gsap.to(panels, {
      flexGrow: (index) => index === activeIndex ? activeGrow : 0,
      height: (index, panel) => index === activeIndex ? panel.scrollHeight : 64,
      duration: reducedMotion ? 0 : duration,
      ease,
      overwrite: 'auto',
    })
  }, [activeIndex, duration, ease, expandRatio, items.length])

  const activate = (index: number) => setActiveIndex(index)

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    let nextIndex: number | undefined
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = Math.min(index + 1, items.length - 1)
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = Math.max(index - 1, 0)
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = items.length - 1

    if (nextIndex != null) {
      event.preventDefault()
      activate(nextIndex)
      panelRefs.current[nextIndex]?.focus()
    }
  }

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>, index: number) => {
    if (trigger === 'hover' && event.pointerType !== 'touch') activate(index)
  }

  return (
    <div
      className={`accordion-gallery accordion-gallery--${orientation}${grayscale ? ' accordion-gallery--grayscale' : ''}`}
      style={{ '--accordion-gap': `${gap}px`, '--accordion-radius': `${radius}px`, '--accordion-parallax': parallax, '--accordion-tilt': `${tilt}deg` } as React.CSSProperties}
    >
      {items.map((item, index) => {
        const active = index === activeIndex
        return (
          <div
            key={item.id}
            ref={(element) => { panelRefs.current[index] = element }}
            className={`accordion-gallery__panel${active ? ' accordion-gallery__panel--active' : ''}`}
            role="button"
            tabIndex={0}
            aria-expanded={active}
            aria-controls={`${item.id}-content`}
            onClick={() => activate(index)}
            onPointerEnter={(event) => onPointerEnter(event, index)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            <div className="accordion-gallery__backdrop" aria-hidden="true"><span>QA</span></div>
            <div className="accordion-gallery__heading"><b>{String(index + 1).padStart(2, '0')}</b><strong>{item.label}</strong><i aria-hidden="true">+</i></div>
            <div className="accordion-gallery__content" id={`${item.id}-content`}>{item.content}</div>
          </div>
        )
      })}
    </div>
  )
}
