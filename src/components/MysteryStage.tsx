import type { Mystery, MysterySetId } from '../data'

type Props = {
  mystery?: Mystery
  setId?: MysterySetId
  /** mercy = gradiente propio Coronilla (sin arte del original) */
  variant?: 'rosary' | 'mercy'
  titleOverride?: string
}

export function MysteryStage({
  mystery,
  setId,
  variant = 'rosary',
  titleOverride,
}: Props) {
  const title =
    titleOverride ??
    (variant === 'mercy' ? 'Divina Misericordia' : (mystery?.titleEs ?? 'Preparación'))

  const glow =
    variant === 'mercy'
      ? 'absolute left-1/2 top-[30%] h-52 w-52 -translate-x-1/2 rounded-full bg-sacred opacity-35 blur-3xl'
      : 'absolute left-1/2 top-[32%] h-44 w-44 -translate-x-1/2 rounded-full bg-sacred opacity-25 blur-3xl'

  const wash =
    variant === 'mercy'
      ? 'absolute inset-0 bg-gradient-to-b from-[#1a2438] via-[#2a1f2e] to-prayer-bg'
      : 'absolute inset-0 bg-gradient-to-b from-prayer-bg via-prayer-surface to-prayer-bg'

  return (
    <div
      className="relative flex flex-1 flex-col items-center bg-prayer-bg pt-6"
      role="img"
      aria-label={title}
      data-set={setId}
      data-variant={variant}
    >
      <div className={wash} aria-hidden />
      {variant === 'mercy' ? (
        <div
          className="absolute left-1/2 top-[28%] h-28 w-28 -translate-x-1/2 rounded-full border-2 border-sacred/40 opacity-60"
          aria-hidden
        />
      ) : null}
      <div className={glow} aria-hidden />
      <p className="relative z-10 max-w-[90%] px-4 text-center font-serif text-lg font-semibold leading-7 text-prayer-text">
        {title}
      </p>
    </div>
  )
}
