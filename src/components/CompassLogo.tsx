import compassLogo from '../assets/quiz-arena-compass-approved.png'

export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  const className = compact ? 'compass-logo compass-logo--compact' : 'compass-logo'

  return (
    <img
      className={className}
      src={compassLogo}
      alt="Quiz Arena — róża wiatrów"
      draggable={false}
      decoding="async"
    />
  )
}
