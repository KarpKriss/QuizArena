export default function CompassLogo({ compact = false }: { compact?: boolean }) {
  const className = compact ? 'compass-logo compass-logo--compact' : 'compass-logo'

  return (
    <svg
      className={className}
      viewBox="0 0 1000 1000"
      role="img"
      aria-label="Quiz Arena — róża wiatrów"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qaGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff3a6" />
          <stop offset="0.26" stopColor="#f1c34d" />
          <stop offset="0.56" stopColor="#c88a24" />
          <stop offset="0.78" stopColor="#ffd76b" />
          <stop offset="1" stopColor="#8f5d14" />
        </linearGradient>
        <linearGradient id="qaGoldDeep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f8d25f" />
          <stop offset="0.5" stopColor="#b8791f" />
          <stop offset="1" stopColor="#5e390b" />
        </linearGradient>
        <linearGradient id="qaWhite" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#ece8de" />
          <stop offset="1" stopColor="#b9b4aa" />
        </linearGradient>
        <radialGradient id="qaCore" cx="44%" cy="38%" r="70%">
          <stop offset="0" stopColor="#fff8ca" />
          <stop offset="0.32" stopColor="#efc24e" />
          <stop offset="0.72" stopColor="#a46b17" />
          <stop offset="1" stopColor="#3c2407" />
        </radialGradient>
        <filter id="qaSoftGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="qaRough" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.09" numOctaves="2" seed="9" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      <g opacity="0.18" filter="url(#qaSoftGlow)">
        <circle cx="500" cy="500" r="330" fill="none" stroke="#d9aa3d" strokeWidth="18" />
      </g>

      <g filter="url(#qaRough)" fill="none" strokeLinecap="round">
        <circle cx="500" cy="500" r="332" stroke="url(#qaWhite)" strokeWidth="35" strokeDasharray="760 70 240 95" transform="rotate(-20 500 500)" />
        <circle cx="500" cy="500" r="335" stroke="url(#qaGold)" strokeWidth="31" strokeDasharray="390 65 520 85" transform="rotate(70 500 500)" />
        <circle cx="500" cy="500" r="286" stroke="#090806" strokeWidth="22" opacity="0.96" />
        <circle cx="500" cy="500" r="270" stroke="url(#qaGoldDeep)" strokeWidth="12" opacity="0.95" />
      </g>

      <g stroke="#070604" strokeWidth="9" strokeLinejoin="round">
        <path d="M500 45 L548 430 L500 500 L452 430 Z" fill="url(#qaGold)" />
        <path d="M500 955 L452 570 L500 500 L548 570 Z" fill="url(#qaGoldDeep)" />
        <path d="M45 500 L430 452 L500 500 L430 548 Z" fill="url(#qaGold)" />
        <path d="M955 500 L570 548 L500 500 L570 452 Z" fill="url(#qaGoldDeep)" />

        <path d="M175 175 L442 433 L500 500 L411 454 Z" fill="#090806" />
        <path d="M825 175 L558 433 L500 500 L589 454 Z" fill="url(#qaGold)" />
        <path d="M825 825 L558 567 L500 500 L589 546 Z" fill="#090806" />
        <path d="M175 825 L442 567 L500 500 L411 546 Z" fill="url(#qaGold)" />
      </g>

      <g stroke="#090806" strokeWidth="6" strokeLinejoin="round">
        <path d="M500 174 L518 315 L500 347 L482 315 Z" fill="url(#qaGold)" />
        <path d="M826 500 L685 518 L653 500 L685 482 Z" fill="url(#qaGold)" />
        <path d="M500 826 L482 685 L500 653 L518 685 Z" fill="url(#qaGold)" />
        <path d="M174 500 L315 482 L347 500 L315 518 Z" fill="url(#qaGold)" />

        <path d="M270 270 L374 386 L381 418 L349 411 Z" fill="url(#qaGoldDeep)" />
        <path d="M730 270 L614 374 L582 381 L589 349 Z" fill="url(#qaGoldDeep)" />
        <path d="M730 730 L626 614 L619 582 L651 589 Z" fill="url(#qaGoldDeep)" />
        <path d="M270 730 L386 626 L418 619 L411 651 Z" fill="url(#qaGoldDeep)" />
      </g>

      <circle cx="500" cy="500" r="59" fill="url(#qaCore)" stroke="#090806" strokeWidth="9" />
      <path d="M500 443 L557 500 L500 557 L443 500 Z" fill="url(#qaGold)" stroke="#090806" strokeWidth="7" />

      <g opacity="0.72" fill="#f0bd3f">
        <circle cx="249" cy="215" r="5" />
        <circle cx="286" cy="186" r="3" />
        <circle cx="742" cy="245" r="4" />
        <circle cx="788" cy="315" r="3" />
        <circle cx="776" cy="702" r="5" />
        <circle cx="300" cy="782" r="4" />
        <circle cx="206" cy="647" r="3" />
      </g>
    </svg>
  )
}
