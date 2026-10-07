/** ponytail: one runnable check — run with: npx tsx src/data/selfcheck.ts */
import {
  getMysterySetForToday,
  getMysteriesForSet,
  getRosarySteps,
  getChapletSteps,
} from './index'

const steps = getRosarySteps()
console.assert(steps.length > 53, `expected >53 steps, got ${steps.length}`)
console.assert(steps[0].prayerKey === 'senal_cruz', 'first step is sign of cross')
console.assert(
  steps.filter((s) => s.prayerKey === 'ave_maria').length === 53,
  '53 Hail Marys',
)
console.assert(
  steps.some((s) => s.prayerKey === 'oh_mi_jesus'),
  'Fatima present',
)
console.assert(steps.some((s) => s.prayerKey === 'salve'), 'Salve present')

const chaplet = getChapletSteps()
console.assert(chaplet.length >= 60, `chaplet >=60 got ${chaplet.length}`)
console.assert(chaplet[0].prayerKey === 'senal_cruz', 'chaplet starts cruz')
console.assert(
  chaplet.filter((s) => s.prayerKey === 'eterno_padre').length === 5,
  '5 eterno padre',
)
console.assert(
  chaplet.filter((s) => s.prayerKey === 'por_su_pasion').length === 50,
  '50 por su pasión',
)
console.assert(
  chaplet.filter((s) => s.prayerKey === 'santo_dios').length === 3,
  '3 santo dios',
)
console.assert(
  chaplet.some((s) => s.prayerKey === 'jesus_en_ti_confio'),
  'jesus confío',
)
console.assert(
  chaplet.every((s) => s.devotion === 'chaplet'),
  'all chaplet devotion',
)

// Fixed weekday: Thursday = luminosos
const thu = new Date(2026, 9, 8) // Oct 8 2026 is Thursday
console.assert(thu.getDay() === 4, 'fixture is Thursday')
console.assert(getMysterySetForToday(thu) === 'luminosos', 'Thu → luminosos')
console.assert(getMysteriesForSet('luminosos').length === 5, '5 luminosos')

console.log('selfcheck ok', { rosary: steps.length, chaplet: chaplet.length })
