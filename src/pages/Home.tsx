import { Link } from 'react-router-dom'
import { Heart, BookOpen } from 'lucide-react'
import { LatinCross } from '../components/LatinCross'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'
import { HomeEntry } from '../components/HomeEntry'
import { TodayChip } from '../components/TodayChip'
import { getMysterySet, resolveMysterySetId } from '../data'

export function HomePage() {
  const setId = resolveMysterySetId()
  const set = getMysterySet(setId)

  return (
    <AppShell variant="home">
      <TopBar title="OrarContigo" showSettings />
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-6 pt-6">
        <TodayChip mysteryName={set.nameEs} />
        <nav
          aria-label="Modos de rezo"
          className="flex flex-col items-center gap-8"
        >
          <HomeEntry
            to="/rosario"
            label="Rezar el Rosario"
            variant="primary"
            badge="hoy"
            icon={<LatinCross size={36} />}
          />
          <HomeEntry
            to="/coronilla"
            label="Coronilla de la Divina Misericordia"
            variant="secondary"
            icon={<Heart size={36} strokeWidth={1.75} aria-hidden />}
          />
          <HomeEntry
            to="/oraciones"
            label="Oraciones"
            variant="tertiary"
            icon={<BookOpen size={36} strokeWidth={1.75} aria-hidden />}
          />
        </nav>
      </div>
      <footer className="pb-8 pt-2 text-center">
        <Link
          to="/privacidad"
          className="font-sans text-sm text-text-muted underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Privacidad
        </Link>
      </footer>
    </AppShell>
  )
}
