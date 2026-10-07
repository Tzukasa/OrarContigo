import { getPrayer } from './prayers'
import type { BeadStep, PrayerKey } from './types'

function step(
  index: number,
  prayerKey: PrayerKey,
  beadKind: BeadStep['beadKind'],
  decade?: 1 | 2 | 3 | 4 | 5,
): BeadStep {
  const p = getPrayer(prayerKey)
  return {
    index,
    devotion: 'chaplet',
    prayerKey,
    mysteryOrder: decade,
    labelEs: p.bodyEs,
    beadKind,
  }
}

/**
 * Coronilla de la Divina Misericordia:
 * intro (cruz + PN + Ave + Credo) + 5 decenas + cierre (Santo Dios ×3 + confío + cruz).
 */
export function getChapletSteps(): BeadStep[] {
  const steps: BeadStep[] = []
  let i = 0
  const push = (
    key: PrayerKey,
    kind: BeadStep['beadKind'],
    decade?: 1 | 2 | 3 | 4 | 5,
  ) => {
    steps.push(step(i++, key, kind, decade))
  }

  push('senal_cruz', 'cross')
  push('padre_nuestro', 'large')
  push('ave_maria', 'small')
  push('credo', 'large')

  for (const decade of [1, 2, 3, 4, 5] as const) {
    push('eterno_padre', 'large', decade)
    for (let h = 0; h < 10; h++) push('por_su_pasion', 'small', decade)
  }

  push('santo_dios', 'large')
  push('santo_dios', 'large')
  push('santo_dios', 'large')
  push('jesus_en_ti_confio', 'large')
  push('senal_cruz', 'cross')

  return steps
}
