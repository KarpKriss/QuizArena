import part1 from '../assets/compass-data/part1'
import part2 from '../assets/compass-data/part2'
import part3 from '../assets/compass-data/part3'
import part4 from '../assets/compass-data/part4'
import part5 from '../assets/compass-data/part5'

const compassLogo = `data:image/png;base64,${part1}${part2}${part3}${part4}${part5}`

export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      className={compact ? 'compass-logo compass-logo--compact' : 'compass-logo'}
      src={compassLogo}
      alt="Quiz Arena — róża wiatrów"
      draggable={false}
    />
  )
}
