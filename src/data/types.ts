export type MysterySetId = 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos'

export type MysterySet = {
  id: MysterySetId
  nameEs: string
  weekdayDefault: number[] // 0=dom .. 6=sáb
}

export type Mystery = {
  id: string
  setId: MysterySetId
  order: 1 | 2 | 3 | 4 | 5
  titleEs: string
  meditationEs?: string
}

export type PrayerKey =
  | 'senal_cruz'
  | 'credo'
  | 'padre_nuestro'
  | 'ave_maria'
  | 'gloria'
  | 'salve'
  | 'oh_mi_jesus'
  | 'eterno_padre'
  | 'por_su_pasion'
  | 'santo_dios'
  | 'jesus_en_ti_confio'

export type Prayer = {
  key: PrayerKey
  titleEs: string
  bodyEs: string
}

export type BeadStep = {
  index: number
  devotion: 'rosary' | 'chaplet'
  prayerKey: PrayerKey
  mysteryOrder?: 1 | 2 | 3 | 4 | 5
  labelEs: string
  beadKind: 'cross' | 'large' | 'small'
}

export type UserPrefs = {
  voice: 'm' | 'f'
  audioOn: boolean
  audioAutoAdvance: boolean
  mysteriesAuto: boolean
  mysterySetOverride?: MysterySetId
  fontScale: number
  theme: ThemePref
}

/** User theme choice; 'system' follows prefers-color-scheme live. */
export type ThemePref = 'light' | 'dark' | 'system'

/** Static clip metadata; playClip may use TTS today and mp3 src later. */
export type AudioClip = {
  prayerKey: PrayerKey
  voice: 'm' | 'f'
  src: string // /audio/{voice}/{key}.mp3
}
