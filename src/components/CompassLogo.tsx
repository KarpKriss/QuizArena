import fallbackLogo from '../assets/quiz-arena-compass.png'
import compassLogoHd from '../assets/quiz-arena-compass-hd.avif'

export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  const className = compact ? 'compass-logo compass-logo--compact' : 'compass-logo'

  return (
    <picture>
      <source srcSet={compassLogoHd} type="image/avif" />
      <img
        className={className}
        src={fallbackLogo}
        alt="Quiz Arena — róża wiatrów"
        draggable={false}
      />
    </picture>
  )
}
