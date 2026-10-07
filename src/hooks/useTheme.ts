import { useEffect } from 'react'
import { loadPrefs } from '../data/prefs'
import { applyTheme, systemDarkQuery } from '../theme'

/**
 * Mount once (App). Applies the stored theme and, while prefs.theme is
 * 'system', follows OS light/dark changes live. Changes made in A01 are
 * applied immediately by usePrefs.
 */
export function useTheme() {
  useEffect(() => {
    applyTheme()
    const mq = systemDarkQuery()
    if (!mq) return
    const onChange = () => {
      if (loadPrefs().theme === 'system') applyTheme('system')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
}
