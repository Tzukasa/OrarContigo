import { loadPrefs } from './data/prefs'
import type { ThemePref } from './data/types'

/**
 * Theme resolution. index.html has an inline IIFE doing the same before paint
 * (no flash); keep the two in sync.
 */
export type ResolvedTheme = 'light' | 'dark'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export function systemDarkQuery(): MediaQueryList | undefined {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia(DARK_QUERY)
    : undefined
}

export function resolveTheme(pref: ThemePref): ResolvedTheme {
  if (pref === 'light' || pref === 'dark') return pref
  return systemDarkQuery()?.matches ? 'dark' : 'light'
}

/** Status-bar colour: light keeps index.html's value; dark uses --color-bg. */
function syncThemeColor(theme: ResolvedTheme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (!meta) return
  meta.dataset.light ??= meta.content
  const dark = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-bg')
    .trim()
  meta.content = theme === 'dark' && dark ? dark : meta.dataset.light
}

export function applyTheme(pref: ThemePref = loadPrefs().theme): ResolvedTheme {
  const theme = resolveTheme(pref)
  document.documentElement.dataset.theme = theme
  syncThemeColor(theme)
  return theme
}
