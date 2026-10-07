type Props = { text: string; title?: string }

export function CaptionBar({ text, title }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-caption w-full shrink-0 bg-caption-bg px-4 py-3 text-caption-text"
    >
      {title ? (
        <p className="mb-1 font-sans text-xs font-medium uppercase tracking-wide text-prayer-muted">
          {title}
        </p>
      ) : null}
      <p
        className="max-h-[30vh] overflow-y-auto font-serif leading-7"
        style={{ fontSize: 'calc(1.125rem * var(--font-scale, 1))' }}
      >
        {text}
      </p>
    </div>
  )
}
