import { Link } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  variant?: 'home' | 'prayer'
  title: string
  backTo?: string
  actions?: ReactNode
  showSettings?: boolean
}

export function TopBar({
  variant = 'home',
  title,
  backTo,
  actions,
  showSettings,
}: Props) {
  const isPrayer = variant === 'prayer'
  const markSrc = `${import.meta.env.BASE_URL}orarcontigo-mark.svg`
  return (
    <header
      className={`flex h-header shrink-0 items-center gap-2 px-3 ${
        isPrayer
          ? 'bg-prayer-surface text-prayer-text'
          : 'bg-surface text-text shadow-card'
      }`}
    >
      {backTo ? (
        <Link
          to={backTo}
          aria-label="Volver"
          className={`inline-flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            isPrayer ? 'text-prayer-text' : 'text-accent'
          }`}
        >
          <ArrowLeft size={22} aria-hidden />
        </Link>
      ) : (
        <Link
          to="/"
          aria-label="Inicio"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <img src={markSrc} alt="" width={28} height={28} className="h-7 w-7 rounded-md" />
        </Link>
      )}
      <h1 className="flex-1 truncate text-center font-sans text-lg font-semibold leading-7">
        {title}
      </h1>
      <div className="flex min-w-11 items-center justify-end">
        {actions}
        {showSettings ? (
          <Link
            to="/ajustes"
            aria-label="Ajustes"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Settings size={20} aria-hidden />
          </Link>
        ) : !actions ? (
          <span className="w-11" aria-hidden />
        ) : null}
      </div>
    </header>
  )
}
