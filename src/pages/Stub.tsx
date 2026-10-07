import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'

type Props = { title: string }

export function StubPage({ title }: Props) {
  return (
    <AppShell variant="home">
      <TopBar title={title} backTo="/" />
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="font-serif text-lg text-text">Próximamente</p>
        <p className="text-sm text-muted">
          Esta sección llegará en una siguiente entrega.
        </p>
      </div>
    </AppShell>
  )
}
