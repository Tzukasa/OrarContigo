import type { Prayer } from '../data/types'

type Props = {
  prayer: Prayer
}

/** Split trailing Amén for accent styling when present. */
function splitAmen(body: string): { main: string; amen: string | null } {
  const match = body.match(/^(.*?)(\s*Amén\.?\s*)$/s)
  if (!match) return { main: body, amen: null }
  return { main: match[1], amen: match[2].trim() }
}

export function PrayerDetail({ prayer }: Props) {
  const { main, amen } = splitAmen(prayer.bodyEs)

  return (
    <article className="px-5 py-6">
      <h1 className="prayer-dropcap mb-4 font-serif text-xl font-semibold leading-8 text-text">
        {prayer.titleEs}
      </h1>
      <p
        className="font-serif leading-7 text-text"
        style={{ fontSize: 'calc(1.125rem * var(--font-scale, 1))' }}
      >
        {main}
        {amen ? (
          <>
            {' '}
            <span className="font-semibold text-accent">{amen}</span>
          </>
        ) : null}
      </p>
    </article>
  )
}
