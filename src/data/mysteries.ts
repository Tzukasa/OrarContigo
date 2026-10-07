import type { Mystery, MysterySet, MysterySetId } from './types'

export const MYSTERY_SETS: MysterySet[] = [
  { id: 'gozosos', nameEs: 'Misterios gozosos', weekdayDefault: [1, 6] },
  { id: 'dolorosos', nameEs: 'Misterios dolorosos', weekdayDefault: [2, 5] },
  { id: 'gloriosos', nameEs: 'Misterios gloriosos', weekdayDefault: [0, 3] },
  { id: 'luminosos', nameEs: 'Misterios luminosos', weekdayDefault: [4] },
]

const TITLES: Record<MysterySetId, [string, string, string, string, string]> = {
  gozosos: [
    'La Anunciación del Ángel a María',
    'La Visitación de María a Isabel',
    'El Nacimiento de Jesús',
    'La Presentación de Jesús en el Templo',
    'El Niño Jesús perdido y hallado en el Templo',
  ],
  dolorosos: [
    'La Agonía de Jesús en el Huerto',
    'La Flagelación del Señor',
    'La Coronación de Espinas',
    'Jesús con la Cruz a cuestas',
    'La Crucifixión y Muerte de Jesús',
  ],
  gloriosos: [
    'La Resurrección del Señor',
    'La Ascensión de Jesús al Cielo',
    'La Venida del Espíritu Santo',
    'La Asunción de María al Cielo',
    'La Coronación de María como Reina',
  ],
  luminosos: [
    'El Bautismo de Jesús en el Jordán',
    'Las Bodas de Caná',
    'El Anuncio del Reino de Dios',
    'La Transfiguración del Señor',
    'La Institución de la Eucaristía',
  ],
}

export const MYSTERIES: Mystery[] = (
  Object.keys(TITLES) as MysterySetId[]
).flatMap((setId) =>
  TITLES[setId].map((titleEs, i) => ({
    id: `${setId}-${i + 1}`,
    setId,
    order: (i + 1) as 1 | 2 | 3 | 4 | 5,
    titleEs,
  })),
)

export function getMysterySet(id: MysterySetId): MysterySet {
  return MYSTERY_SETS.find((s) => s.id === id)!
}

export function getMysteriesForSet(setId: MysterySetId): Mystery[] {
  return MYSTERIES.filter((m) => m.setId === setId).sort(
    (a, b) => a.order - b.order,
  )
}

/** Pick mystery set by local weekday (device / America/Mexico_City). */
export function getMysterySetForToday(date = new Date()): MysterySetId {
  const day = date.getDay()
  const found = MYSTERY_SETS.find((s) => s.weekdayDefault.includes(day))
  return found?.id ?? 'gloriosos'
}
