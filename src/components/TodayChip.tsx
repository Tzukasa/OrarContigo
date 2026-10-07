type Props = { mysteryName: string }

export function TodayChip({ mysteryName }: Props) {
  return (
    <p className="inline-flex rounded-pill bg-home-warm px-3 py-1 text-sm leading-5 text-text">
      Hoy: {mysteryName}
    </p>
  )
}
