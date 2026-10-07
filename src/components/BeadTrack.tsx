import type { BeadStep } from '../data'

type Props = {
  steps: BeadStep[]
  currentIndex: number
  /** loop = óvalo rosario; curve = arco coronilla */
  variant?: 'loop' | 'curve'
}

function ovalPoint(t: number, cx: number, cy: number, rx: number, ry: number) {
  const a = -Math.PI / 2 + t * Math.PI * 2
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) }
}

/** Arco inferior abierto (Coronilla) — de izq a der, cóncavo hacia arriba. */
function curvePoint(t: number, cx: number, cy: number, rx: number, ry: number) {
  const a = Math.PI + t * Math.PI
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) * 0.55 }
}

export function BeadTrack({
  steps,
  currentIndex,
  variant = 'loop',
}: Props) {
  const W = 320
  const H = 280
  const cx = W / 2
  const cy = variant === 'curve' ? H / 2 + 36 : H / 2 + 8
  const rx = variant === 'curve' ? 132 : 118
  const ry = variant === 'curve' ? 110 : 98
  // Todas las cuentas del paso (incl. Fátima / Salve / cierre) para glow activo.
  const visual = steps
  const n = Math.max(visual.length - 1, 1)

  const activeVisual =
    visual.find((s) => s.index === currentIndex) ??
    [...visual].reverse().find((s) => s.index <= currentIndex) ??
    visual[0]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto h-[42%] max-h-72 w-[92%] max-w-sm"
      aria-hidden
    >
      {variant === 'loop' ? (
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke="var(--color-prayer-muted)"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      ) : (
        <path
          d={`M ${curvePoint(0, cx, cy, rx, ry).x} ${curvePoint(0, cx, cy, rx, ry).y} A ${rx} ${ry * 0.55} 0 0 1 ${curvePoint(1, cx, cy, rx, ry).x} ${curvePoint(1, cx, cy, rx, ry).y}`}
          fill="none"
          stroke="var(--color-prayer-muted)"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      )}
      {visual.map((s, i) => {
        const { x, y } =
          variant === 'curve'
            ? curvePoint(i / n, cx, cy, rx, ry)
            : ovalPoint(i / n, cx, cy, rx, ry)
        const isActive = activeVisual?.index === s.index
        const isDone = s.index < currentIndex
        const isMarker = s.beadKind === 'large'

        if (s.beadKind === 'cross') {
          const c = isActive
            ? 'var(--color-bead-active)'
            : 'var(--color-bead)'
          return (
            <g key={s.index} opacity={isDone && !isActive ? 0.55 : 1}>
              <rect x={x - 2} y={y - 10} width={4} height={20} rx={1} fill={c} />
              <rect x={x - 7} y={y - 5} width={14} height={4} rx={1} fill={c} />
              {isActive ? (
                <circle
                  cx={x}
                  cy={y}
                  r={14}
                  fill="var(--color-bead-glow)"
                  opacity={0.5}
                />
              ) : null}
            </g>
          )
        }

        const r = isMarker ? 7 : 4.5
        let fill = 'var(--color-bead)'
        if (isMarker) fill = 'var(--color-bead-marker)'
        if (isActive) fill = 'var(--color-bead-active)'

        return (
          <circle
            key={s.index}
            cx={x}
            cy={y}
            r={r}
            fill={fill}
            opacity={isDone && !isActive ? 0.55 : 1}
            style={{
              transition: 'all var(--motion-bead) var(--ease)',
              filter: isActive
                ? 'drop-shadow(0 0 8px var(--color-bead-glow))'
                : undefined,
            }}
          />
        )
      })}
    </svg>
  )
}
