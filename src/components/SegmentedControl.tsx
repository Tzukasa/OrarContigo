type Option<T extends string> = {
  value: T
  label: string
}

type Props<T extends string> = {
  name: string
  value: T
  options: Option<T>[]
  onChange: (value: T) => void
  disabled?: boolean
  label: string
}

export function SegmentedControl<T extends string>({
  name,
  value,
  options,
  onChange,
  disabled,
  label,
}: Props<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      aria-disabled={disabled || undefined}
      className={`inline-flex h-9 items-stretch overflow-hidden rounded-pill border border-border ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            name={name}
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`min-w-[4.5rem] flex-auto whitespace-nowrap px-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
              selected
                ? 'bg-accent text-on-accent'
                : 'bg-surface text-muted'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
