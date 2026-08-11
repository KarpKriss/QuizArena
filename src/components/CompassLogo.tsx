export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  return (
    <svg
      className={compact ? 'compass-logo compass-logo--compact' : 'compass-logo'}
      viewBox="0 0 220 220"
      role="img"
      aria-label="Quiz Arena — róża wiatrów"
    >
      <defs>
        <linearGradient id="gold" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#fff1a8" />
          <stop offset="28%" stopColor="#f6d66a" />
          <stop offset="62%" stopColor="#c9972d" />
          <stop offset="100%" stopColor="#7a5015" />
        </linearGradient>
        <filter id="goldGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="110" cy="110" r="82" fill="rgba(5,5,5,.5)" stroke="rgba(255,255,255,.9)" strokeWidth="4" />
      <circle cx="110" cy="110" r="70" fill="none" stroke="url(#gold)" strokeWidth="3" opacity=".95" />
      <circle cx="110" cy="110" r="58" fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.5" />

      <g stroke="url(#gold)" strokeWidth="2" opacity=".9">
        <line x1="110" y1="28" x2="110" y2="42" />
        <line x1="110" y1="178" x2="110" y2="192" />
        <line x1="28" y1="110" x2="42" y2="110" />
        <line x1="178" y1="110" x2="192" y2="110" />
        <line x1="52" y1="52" x2="62" y2="62" />
        <line x1="158" y1="158" x2="168" y2="168" />
        <line x1="52" y1="168" x2="62" y2="158" />
        <line x1="158" y1="62" x2="168" y2="52" />
      </g>

      <g filter="url(#goldGlow)">
        <path d="M110 14 L126 94 L110 110 L94 94 Z" fill="url(#gold)" />
        <path d="M206 110 L126 126 L110 110 L126 94 Z" fill="url(#gold)" />
        <path d="M110 206 L94 126 L110 110 L126 126 Z" fill="url(#gold)" />
        <path d="M14 110 L94 94 L110 110 L94 126 Z" fill="url(#gold)" />
      </g>

      <g fill="rgba(255,255,255,.96)">
        <path d="M110 44 L118 100 L110 110 L102 100 Z" />
        <path d="M176 110 L120 118 L110 110 L120 102 Z" />
        <path d="M110 176 L102 120 L110 110 L118 120 Z" />
        <path d="M44 110 L100 102 L110 110 L100 118 Z" />
      </g>

      <circle cx="110" cy="110" r="8" fill="#050505" stroke="url(#gold)" strokeWidth="3" />
    </svg>
  )
}
