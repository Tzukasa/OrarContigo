type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Buscar oración',
  label = 'Buscar oración',
}: Props) {
  return (
    <div className="px-4 pb-2 pt-3">
      <label className="sr-only" htmlFor="oracion-search">
        {label}
      </label>
      <input
        id="oracion-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-border bg-surface px-3 font-sans text-sm text-text placeholder:text-muted focus:border-border-input focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
    </div>
  )
}
