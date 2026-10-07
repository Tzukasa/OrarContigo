import { getPrayer } from './prayers'
import type { BeadStep, PrayerKey } from './types'

function step(
  index: number,
  prayerKey: PrayerKey,
  beadKind: BeadStep['beadKind'],
  mysteryOrder?: 1 | 2 | 3 | 4 | 5,
): BeadStep {
  const p = getPrayer(prayerKey)
  return {
    index,
    devotion: 'rosary',
    prayerKey,
    mysteryOrder,
    labelEs: p.bodyEs,
    beadKind,
  }
}

/** Secuencia completa del Rosario (~intro + 5 decenas + cierre). */
export function getRosarySteps(): BeadStep[] {
  const steps: BeadStep[] = []
  let i = 0
  const push = (
    key: PrayerKey,
    kind: BeadStep['beadKind'],
    mysteryOrder?: 1 | 2 | 3 | 4 | 5,
  ) => {
    steps.push(step(i++, key, kind, mysteryOrder))
  }

  push('senal_cruz', 'cross')
  push('credo', 'large')
  push('padre_nuestro', 'large')
  push('ave_maria', 'small')
  push('ave_maria', 'small')
  push('ave_maria', 'small')
  push('gloria', 'large')

  for (const decade of [1, 2, 3, 4, 5] as const) {
    push('padre_nuestro', 'large', decade)
    for (let h = 0; h < 10; h++) push('ave_maria', 'small', decade)
    push('gloria', 'large', decade)
    push('oh_mi_jesus', 'large', decade)
  }

  push('salve', 'large')
  push('senal_cruz', 'cross')
  return steps
}
