import CompassLogo from '../components/CompassLogo'
import AccordionGallery, { type AccordionGalleryItem } from '../components/AccordionGallery/AccordionGallery'
import SideNavigator, { baseNavigationItems, type NavigationItem } from '../components/SideNavigator/SideNavigator'
import instructionSource from '../content/instruction-source.txt?raw'
import './InstructionsPage.css'

type InstructionsPageProps = {
  navigate: (path: string) => void
}

type Chapter = {
  id: string
  label: string
  number: string
  title: string
  body: string
}

const chapterMeta = [
  ['instruction-intro', 'Czym jest Quiz Arena?'],
  ['instruction-box', 'Zawartość pudełka'],
  ['instruction-setup', 'Przygotowanie gry'],
  ['instruction-coins', 'Monety i wymiana'],
  ['instruction-turn', 'Przebieg tury'],
  ['instruction-modes', 'Tryby rozgrywki'],
  ['instruction-special-cards', 'Karty specjalne'],
  ['instruction-website', 'Strona internetowa'],
  ['instruction-general-rules', 'Zasady ogólne'],
  ['instruction-turn-summary', 'Skrót tury'],
] as const

const contentStart = instructionSource.indexOf('1. CZYM JEST QUIZ ARENA?')
const contentEnd = instructionSource.indexOf('11. RESPONSIVE / MOBILE')
const approvedRules = instructionSource.slice(contentStart, contentEnd).trim()

const chapterParts = approvedRules
  .split(/\r?\n-{20,}\r?\n/)
  .map((part) => part.trim())
  .reduce<string[]>((sections, part) => {
    if (/^([1-9]|10)\. [A-ZĄĆĘŁŃÓŚŹŻ]/.test(part)) {
      sections.push(part)
    } else if (sections.length > 0) {
      sections[sections.length - 1] += `\n\n${part}`
    }
    return sections
  }, [])

const chapters: Chapter[] = chapterParts
  .map((part, index) => {
    const [heading, ...body] = part.split('\n')
    const [number, ...title] = heading.split('. ')
    const [id, label] = chapterMeta[index]
    return { id, label, number: number.padStart(2, '0'), title: title.join('. '), body: body.join('\n').trim() }
  })

function RuleCallout({ label, children }: { label: string; children: string }) {
  return (
    <aside className="instruction-callout">
      <span>{label}</span>
      <p>{children}</p>
    </aside>
  )
}

function CoinExchange() {
  return (
    <div className="coin-exchange" aria-label="Kurs wymiany monet">
      <div><b className="coin coin--bronze">3</b><span>brązowe</span><i>=</i><b className="coin coin--silver">1</b><span>srebrna</span></div>
      <div><b className="coin coin--silver">3</b><span>srebrne</span><i>=</i><b className="coin coin--gold">1</b><span>złota</span></div>
      <p>1 złota = 3 srebrne = 9 brązowych</p>
    </div>
  )
}

function TimingFlow() {
  const steps = ['Wymiana monet', 'Sprawdzenie zwycięstwa', 'Hazardzista / Leń', 'Rzut kostką', 'Ewentualne 6', 'Dobranie pytania', 'Błazen', 'Odczytanie pytania', 'Rozgrywka', 'Pomidor', 'Ustalenie wyniku', 'Rewers', 'Rozliczenie monet']
  return <ol className="timing-flow">{steps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, '0')}</b>{step}</li>)}</ol>
}

function renderBody(body: string) {
  return body.split(/\n\s*\n/).map((block, index) => {
    const text = block.trim()
    if (!text) return null
    if (/^(PRZYKŁAD|WAŻNE|TIMING|NAGRODY|KARA)$/m.test(text) && text.split('\n').length > 1) {
      const [label, ...content] = text.split('\n')
      return <RuleCallout key={`${label}-${index}`} label={label}>{content.join('\n')}</RuleCallout>
    }
    if (/^[A-ZĄĆĘŁŃÓŚŹŻ0-9 .–×?]+$/.test(text) && text.length < 72) return <h3 key={`${text}-${index}`}>{text}</h3>
    if (text.startsWith('- ')) {
      return <ul key={index}>{text.split('\n').filter((line) => line.startsWith('- ')).map((line) => <li key={line}>{line.slice(2)}</li>)}</ul>
    }
    return <p key={index}>{text}</p>
  })
}

function ModeAccordion({ body }: { body: string }) {
  const items: AccordionGalleryItem[] = body
    .split(/(?=^6\.[1-6]\. )/m)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part, index) => {
      const [heading, ...content] = part.split('\n')
      const label = heading.replace(/^6\.\d+\.\s*/, '')
      return { id: `instruction-mode-${index + 1}`, label, content: renderBody(content.join('\n').trim()) }
    })

  return <AccordionGallery items={items} orientation="vertical" trigger="hover" defaultIndex={0} expandRatio={0.55} duration={0.6} ease="power3.out" parallax={0.25} tilt={2} gap={10} radius={16} grayscale={false} />
}

export default function InstructionsPage({ navigate }: InstructionsPageProps) {
  const navigationItems: NavigationItem[] = [
    ...baseNavigationItems,
    ...chapters.map((chapter) => ({
      label: chapter.label,
      onSelect: () => document.getElementById(chapter.id)?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      }),
    })),
  ]

  return (
    <main className="instructions-page">
      <SideNavigator currentPath="/instrukcja" items={navigationItems} onNavigate={navigate} />
      <div className="instructions-page__backdrop" aria-hidden="true" />

      <header className="instructions-hero">
        <div className="instructions-hero__mark"><CompassLogo compact /></div>
        <p>QUIZ ARENA</p>
        <span>Imprezowa gra quizowa dla 4–8 osób</span>
        <h1>Instrukcja</h1>
        <div className="instructions-hero__meta"><span>Wersja 1.0</span><span>Sierpień 2026</span></div>
        <small>Przeczytaj przed pierwszą rozgrywką.</small>
        <a href="#instruction-intro">Przewiń, aby czytać <b aria-hidden="true">↓</b></a>
      </header>

      <div className="instructions-content">
        {chapters.map((chapter) => (
          <section className="instruction-section" id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-title`}>
            <div className="instruction-section__intro">
              <span className="instruction-section__number">{chapter.number}</span>
              <p>{chapter.label}</p>
              <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
            </div>
            <div className="instruction-section__body">
              {chapter.id === 'instruction-coins' && <CoinExchange />}
              {chapter.id === 'instruction-special-cards' && <TimingFlow />}
              {chapter.id === 'instruction-modes' ? <ModeAccordion body={chapter.body} /> : renderBody(chapter.body)}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
