import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'tertiary'

type Props = {
  to: string
  label: string
  icon: ReactNode
  variant?: Variant
  badge?: string
}

const ring: Record<Variant, string> = {
  primary: 'ring-accent',
  secondary: 'ring-sacred',
  tertiary: 'ring-border',
}

export function HomeEntry({ to, label, icon, variant = 'primary', badge }: Props) {
  return (
    <Link
      to={to}
      className="group flex w-28 flex-col items-center gap-2 focus-visible:outline-none"
    >
      <span
        className={`relative flex h-[var(--entry-size)] w-[var(--entry-size)] items-center justify-center rounded-full bg-surface shadow-entry ring-2 transition duration-[var(--motion-base)] ease-[var(--ease)] group-hover:scale-[0.98] group-active:scale-[0.98] group-focus-visible:ring-accent ${ring[variant]}`}
      >
        <span className="text-accent">{icon}</span>
        {badge ? (
          <span className="absolute -right-1 -top-1 rounded-pill bg-accent px-2 py-0.5 text-xs font-medium text-on-accent">
            {badge}
          </span>
        ) : null}
      </span>
      <span className="text-center font-serif text-sm font-semibold leading-5 text-text">
        {label}
      </span>
    </Link>
  )
}
