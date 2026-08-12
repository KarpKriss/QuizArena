import fallbackLogo from '../assets/quiz-arena-compass.png'
import part01 from '../assets/clean-logo-data/part01'
import part02 from '../assets/clean-logo-data/part02'
import part03 from '../assets/clean-logo-data/part03'
import part04 from '../assets/clean-logo-data/part04'
import part05 from '../assets/clean-logo-data/part05'
import part06 from '../assets/clean-logo-data/part06'
import part07 from '../assets/clean-logo-data/part07'

const hdLogo = `data:image/avif;base64,${part01}${part02}${part03}${part04}${part05}${part06}${part07}`

export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  const className = compact ? 'compass-logo compass-logo--compact' : 'compass-logo'

  return (
    <img
      className={className}
      src={hdLogo}
      alt="Quiz Arena — róża wiatrów"
      draggable={false}
      onError={(event) => {
        const image = event.currentTarget
        if (image.dataset.fallbackApplied) return
        image.dataset.fallbackApplied = 'true'
        image.src = fallbackLogo
      }}
    />
  )
}
