import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  size?: 'sm' | 'md'
  children: ReactNode
}

export function IconButton({
  label,
  size = 'md',
  children,
  className = '',
  ...rest
}: Props) {
  const dim = size === 'sm' ? 'h-10 w-10' : 'h-11 w-11'
  return (
    <button
      type="button"
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-md text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 ${dim} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
