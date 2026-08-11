import part1 from '../assets/compass-data/part1'
import part2 from '../assets/compass-data/part2'
import part3 from '../assets/compass-data/part3'
import part4 from '../assets/compass-data/part4'
import part5 from '../assets/compass-data/part5'

const compassLogo = `data:image/png;base64,${part1}${part2}${part3}${part4}${part5}`

export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={compact ? 'compass-logo compass-logo--compact' : 'compass-logo'}
      role="img"
      aria-label="Quiz Arena — róża wiatrów"
      style={{ backgroundImage: `url(${compassLogo})` }}
    />
  )
}
