import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'

export function PrivacidadPage() {
  return (
    <AppShell variant="home">
      <TopBar title="Privacidad" backTo="/" />
      <div className="flex-1 overflow-y-auto px-6 pb-12 pt-4">
        <article className="mx-auto max-w-prose space-y-4 font-sans text-base leading-relaxed text-text">
          <p className="text-text-muted text-sm">Última actualización: 6 de octubre de 2026</p>
          <p>
            <strong>OrarContigo</strong> es una app de rezo (Rosario y Coronilla)
            que funciona en tu dispositivo. No pedimos cuenta ni inicio de sesión.
          </p>
          <h2 className="pt-2 font-sans text-lg font-semibold text-text">
            Datos que guardamos
          </h2>
          <p>
            Solo usamos <strong>almacenamiento local</strong> del navegador
            (<code className="rounded bg-surface px-1 text-sm">localStorage</code>)
            para preferencias: voz, audio, misterios del día y tamaño de texto.
            Esos datos no salen de tu dispositivo.
          </p>
          <h2 className="pt-2 font-sans text-lg font-semibold text-text">
            Lo que no hacemos
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-text">
            <li>No recopilamos datos personales.</li>
            <li>No usamos cookies de seguimiento ni analítica.</li>
            <li>No enviamos información a servidores nuestros.</li>
            <li>No vendemos ni compartimos datos con terceros.</li>
          </ul>
          <h2 className="pt-2 font-sans text-lg font-semibold text-text">
            Audio
          </h2>
          <p>
            Si activas el audio guiado, el navegador puede usar la síntesis de voz
            del sistema (Web Speech). Eso ocurre en tu dispositivo; OrarContigo no
            graba ni transmite tu voz.
          </p>
          <h2 className="pt-2 font-sans text-lg font-semibold text-text">
            Cómo borrar tus preferencias
          </h2>
          <p>
            Borra los datos del sitio en la configuración de tu navegador, o limpia
            el almacenamiento del origen donde abriste OrarContigo. Al hacerlo,
            la app vuelve a los valores por defecto.
          </p>
          <p className="pt-4 text-sm text-text-muted">
            ¿Dudas? Escríbenos desde el repositorio del proyecto en GitHub.
          </p>
          <p className="pt-2">
            <Link
              to="/"
              className="font-semibold text-accent underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Volver al inicio
            </Link>
          </p>
        </article>
      </div>
    </AppShell>
  )
}
