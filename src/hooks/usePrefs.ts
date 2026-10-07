import { useCallback, useEffect, useState } from 'react'
import { loadPrefs, savePrefs } from '../data/prefs'
import type { UserPrefs } from '../data/types'

const FONT_SCALE_CSS = '--font-scale'

function applyFontScale(scale: number) {
  document.documentElement.style.setProperty(FONT_SCALE_CSS, String(scale))
}

export function usePrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(() => loadPrefs())

  useEffect(() => {
    applyFontScale(prefs.fontScale)
  }, [prefs.fontScale])

  const update = useCallback((partial: Partial<UserPrefs>) => {
    const next = savePrefs(partial)
    setPrefs(next)
    return next
  }, [])

  return { prefs, update }
}

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
