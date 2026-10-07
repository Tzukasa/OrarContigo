import { useParams, Navigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'
import { PrayerDetail } from '../components/PrayerDetail'
import { getPrayer, isPrayerKey } from '../data'

export function OracionDetailPage() {
  const { key } = useParams<{ key: string }>()

  if (!key || !isPrayerKey(key)) {
    return <Navigate to="/oraciones" replace />
  }

  const prayer = getPrayer(key)

  return (
    <AppShell variant="home">
      <TopBar title="Oraciones" backTo="/oraciones" />
      <div className="flex-1 overflow-y-auto">
        <PrayerDetail prayer={prayer} />
      </div>
    </AppShell>
  )
}
