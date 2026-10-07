import type { ReactNode } from 'react'

type BaseProps = {
  label: string
  help?: string
  disabled?: boolean
}

type ToggleProps = BaseProps & {
  variant: 'toggle'
  checked: boolean
  onChange: (checked: boolean) => void
}

type ControlProps = BaseProps & {
  variant: 'select' | 'nav'
  children: ReactNode
}

type Props = ToggleProps | ControlProps

export function SettingsRow(props: Props) {
  const { label, help, disabled } = props

  return (
    <div
      className={`flex min-h-[52px] items-center gap-3 border-b border-border px-4 py-3 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-sans text-base font-medium text-text">{label}</p>
        {help ? (
          <p className="mt-0.5 font-sans text-sm text-muted">{help}</p>
        ) : null}
      </div>
      {props.variant === 'toggle' ? (
        <button
          type="button"
          role="switch"
          aria-checked={props.checked}
          aria-label={label}
          disabled={disabled}
          onClick={() => props.onChange(!props.checked)}
          className={`relative h-7 w-12 shrink-0 rounded-pill transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
            props.checked ? 'bg-accent' : 'bg-border'
          }`}
        >
          <span
            aria-hidden
            className={`absolute top-0.5 h-6 w-6 rounded-pill bg-surface shadow-card transition-transform ${
              props.checked ? 'translate-x-5' : 'translate-x-0.5'
            }`}
          />
        </button>
      ) : (
        <div className="shrink-0">{props.children}</div>
      )}
    </div>
  )
}
