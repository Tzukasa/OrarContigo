import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/Home'
import { RosarioPage } from './pages/Rosario'
import { CoronillaPage } from './pages/Coronilla'
import { OracionesPage } from './pages/Oraciones'
import { OracionDetailPage } from './pages/OracionDetail'
import { AjustesPage } from './pages/Ajustes'
import { PrivacidadPage } from './pages/Privacidad'
import { loadPrefs } from './data/prefs'
import { useTheme } from './hooks/useTheme'

function applyPrefsCss() {
  const prefs = loadPrefs()
  document.documentElement.style.setProperty(
    '--font-scale',
    String(prefs.fontScale),
  )
}

/** Vite BASE_URL ends with /; React Router basename must not. */
function routerBasename(): string | undefined {
  const raw = import.meta.env.BASE_URL || '/'
  const trimmed = raw.endsWith('/') ? raw.slice(0, -1) : raw
  return trimmed === '' ? undefined : trimmed
}

export default function App() {
  useTheme()
  useEffect(() => {
    applyPrefsCss()
  }, [])

  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rosario" element={<RosarioPage />} />
        <Route path="/coronilla" element={<CoronillaPage />} />
        <Route path="/oraciones" element={<OracionesPage />} />
        <Route path="/oraciones/:key" element={<OracionDetailPage />} />
        <Route path="/ajustes" element={<AjustesPage />} />
        <Route path="/privacidad" element={<PrivacidadPage />} />
      </Routes>
    </BrowserRouter>
  )
}
