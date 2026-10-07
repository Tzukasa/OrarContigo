/** Simple Latin cross icon (own design; Lucide Cross is a plus). */
export function LatinCross({ size = 36, className = '' }: { size?: number; className?: string }) {
  const w = size
  const h = size
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3v18M7 8h10" />
    </svg>
  )
}
