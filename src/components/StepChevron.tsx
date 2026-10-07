import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  direction: 'prev' | 'next'
  disabled?: boolean
  onClick: () => void
}

export function StepChevron({ direction, disabled, onClick }: Props) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const label = direction === 'prev' ? 'Anterior' : 'Siguiente'
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-[var(--chevron-size)] w-[var(--chevron-size)] items-center justify-center rounded-md text-prayer-text/85 opacity-85 transition active:opacity-70 disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon size={36} strokeWidth={2} aria-hidden />
    </button>
  )
}
