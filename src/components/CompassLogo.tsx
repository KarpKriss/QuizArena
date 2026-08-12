import compassLogoHd from '../assets/quiz-arena-compass-hd.avif'

export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  const className = compact ? 'compass-logo compass-logo--compact' : 'compass-logo'

  return (
    <img
      className={className}
      src={compassLogoHd}
      alt="Quiz Arena — róża wiatrów"
      draggable={false}
      decoding="async"
    />
  )
}
