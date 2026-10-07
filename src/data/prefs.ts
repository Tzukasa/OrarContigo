import type { MysterySetId, UserPrefs } from './types'
import { getMysterySetForToday } from './mysteries'

const KEY = 'rosario.prefs'

const DEFAULTS: UserPrefs = {
  voice: 'f',
  audioOn: false,
  audioAutoAdvance: false,
  mysteriesAuto: true,
  fontScale: 1,
}

export function loadPrefs(): UserPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

export function savePrefs(partial: Partial<UserPrefs>): UserPrefs {
  const next = { ...loadPrefs(), ...partial }
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

/** Active mystery set: auto by weekday, or manual override. */
export function resolveMysterySetId(prefs = loadPrefs()): MysterySetId {
  if (!prefs.mysteriesAuto && prefs.mysterySetOverride) {
    return prefs.mysterySetOverride
  }
  return getMysterySetForToday()
}
