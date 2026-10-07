import { useMemo, useState } from 'react'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'
import { PrayerListRow } from '../components/PrayerListRow'
import { SearchField } from '../components/SearchField'
import { listPrayers } from '../data'

export function OracionesPage() {
  const prayers = useMemo(() => listPrayers(), [])
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return prayers
    return prayers.filter((p) => p.titleEs.toLowerCase().includes(q))
  }, [prayers, query])

  return (
    <AppShell variant="home">
      <TopBar title="Oraciones" backTo="/" />
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder="Buscar oración"
        label="Buscar oración"
      />
      {filtered.length === 0 ? (
        <p className="px-4 py-8 text-center font-sans text-sm text-muted">
          No encontramos esa oración
        </p>
      ) : (
        <ul className="flex-1 overflow-y-auto pb-8">
          {filtered.map((prayer) => (
            <PrayerListRow key={prayer.key} prayer={prayer} />
          ))}
        </ul>
      )}
    </AppShell>
  )
}
