import compassLogo from '../assets/quiz-arena-compass.png'

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
