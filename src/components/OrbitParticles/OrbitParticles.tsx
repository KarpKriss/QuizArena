import type { CSSProperties } from 'react'
import './OrbitParticles.css'

type Tone = 'gold' | 'white' | 'dark'

type Particle = {
  id: number
  size: number
  orbit: number
  squash: number
  counterSquash: number
  tilt: number
  duration: number
  delay: number
  phase: number
  opacity: number
  pulse: number
  reverse: boolean
  tone: Tone
}

const seeded = (seed: number) => {
  const value = Math.sin(seed * 999.91) * 43758.5453123
  return value - Math.floor(value)
}

const makeParticle = (id: number): Particle => {
  const r1 = seeded(id + 1)
  const r2 = seeded(id + 11)
  const r3 = seeded(id + 23)
  const r4 = seeded(id + 47)
  const r5 = seeded(id + 71)
  const r6 = seeded(id + 101)

  const toneRoll = seeded(id + 151)
  const tone: Tone = toneRoll < 0.62 ? 'gold' : toneRoll < 0.84 ? 'white' : 'dark'
  const squash = 0.72 + r3 * 0.24

  return {
    id,
    size: 2.2 + r1 * 7.2,
    orbit: 78 + r2 * 30,
    squash,
    counterSquash: 1 / squash,
    tilt: -24 + r4 * 48,
    duration: 24 + r5 * 30,
    delay: -(r6 * 45),
    phase: seeded(id + 181) * 360,
    opacity: 0.28 + seeded(id + 211) * 0.66,
    pulse: 3.2 + seeded(id + 241) * 5.2,
    reverse: seeded(id + 271) > 0.54,
    tone,
  }
}

export default function OrbitParticles({ count = 38 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, id) => makeParticle(id))

  return (
    <div className="orbit-particles" aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="orbit-particle__frame"
          style={
            {
              '--orbit': `${particle.orbit}%`,
              '--squash': particle.squash,
              '--counter-squash': particle.counterSquash,
              '--tilt': `${particle.tilt}deg`,
            } as CSSProperties
          }
        >
          <span
            className={`orbit-particle__rotor${particle.reverse ? ' orbit-particle__rotor--reverse' : ''}`}
            style={
              {
                '--duration': `${particle.duration}s`,
                '--delay': `${particle.delay}s`,
                '--phase': `${particle.phase}deg`,
              } as CSSProperties
            }
          >
            <span
              className={`orbit-particle orbit-particle--${particle.tone}`}
              style={
                {
                  '--size': `${particle.size}px`,
                  '--opacity': particle.opacity,
                  '--pulse': `${particle.pulse}s`,
                } as CSSProperties
              }
            />
          </span>
        </span>
      ))}
    </div>
  )
}
