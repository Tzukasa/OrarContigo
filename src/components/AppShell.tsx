import type { ReactNode } from 'react'

type Props = {
  variant?: 'home' | 'prayer'
  children: ReactNode
}

export function AppShell({ variant = 'home', children }: Props) {
  const bg = variant === 'prayer' ? 'bg-prayer-bg text-prayer-text' : 'bg-bg text-text'
  return (
    <div className={`min-h-dvh font-sans ${bg}`}>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2 focus:text-text"
      >
        Ir al contenido
      </a>
      <main id="contenido" className="mx-auto flex min-h-dvh w-full max-w-app flex-col">
        {children}
      </main>
    </div>
  )
}
