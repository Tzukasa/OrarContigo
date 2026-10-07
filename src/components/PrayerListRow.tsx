import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Prayer } from '../data/types'

type Props = {
  prayer: Prayer
}

export function PrayerListRow({ prayer }: Props) {
  return (
    <li>
      <Link
        to={`/oraciones/${prayer.key}`}
        className="flex min-h-12 items-center gap-3 border-b border-border px-4 py-3 text-text transition-colors hover:bg-home-warm/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent active:bg-home-warm/40"
      >
        <span className="flex-1 font-sans text-base font-medium leading-6">
          {prayer.titleEs}
        </span>
        <ChevronRight
          size={20}
          className="shrink-0 text-accent"
          aria-hidden
        />
      </Link>
    </li>
  )
}
