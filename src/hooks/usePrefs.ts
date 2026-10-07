import { useCallback, useEffect, useState } from 'react'
import { loadPrefs, savePrefs } from '../data/prefs'
import type { UserPrefs } from '../data/types'
import { applyTheme } from '../theme'

const FONT_SCALE_CSS = '--font-scale'

function applyFontScale(scale: number) {
  document.documentElement.style.setProperty(FONT_SCALE_CSS, String(scale))
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(() => loadPrefs())

  useEffect(() => {
    applyFontScale(prefs.fontScale)
  }, [prefs.fontScale])

  useEffect(() => {
    applyTheme(prefs.theme)
  }, [prefs.theme])

  const update = useCallback((partial: Partial<UserPrefs>) => {
    const next = savePrefs(partial)
    setPrefs(next)
    return next
  }, [])

  return { prefs, update }
}

/** A01 Tema options (value = prefs.theme). */
export const THEME_OPTIONS = [
  { value: 'light' as const, label: 'Claro' },
  { value: 'dark' as const, label: 'Oscuro' },
  { value: 'system' as const, label: 'Automático' },
]

/** Map UI segment labels ↔ numeric fontScale. */
export const FONT_SCALE_OPTIONS = [
  { value: 0.875, label: 'Pequeño', key: 'sm' as const },
  { value: 1, label: 'Normal', key: 'md' as const },
  { value: 1.25, label: 'Grande', key: 'lg' as const },
]

export function fontScaleKey(scale: number): 'sm' | 'md' | 'lg' {
  if (scale <= 0.9) return 'sm'
  if (scale >= 1.15) return 'lg'
  return 'md'
}
