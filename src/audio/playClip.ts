import { getPrayer } from '../data/prayers'
import type { AudioClip, PrayerKey } from '../data/types'

export type PlayClipOptions = {
  voice: 'm' | 'f'
  /** Fired when the current utterance/clip finishes naturally (not on cancel). */
  onEnded?: () => void
}

/**
 * Resolve the future static asset path for a prayer clip.
 * playClip ignores this today (TTS); swap the body of playClip to use HTMLAudioElement + this src.
 */
export function resolveAudioClip(
  prayerKey: PrayerKey,
  voice: 'm' | 'f',
): AudioClip {
  return {
    prayerKey,
    voice,
    src: `/audio/${voice}/${prayerKey}.mp3`,
  }
}

/** Generation counter: cancel/supersede without firing onEnded for the old clip. */
let generation = 0

function stopSpeech() {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel()
  }
}

/** Stop any current clip/utterance. Safe to call when idle. */
export function stopClip(): void {
  generation += 1
  stopSpeech()
}

const FEMALE_HINT =
  /female|femenin|woman|mujer|sabina|paulina|mónica|monica|lucía|lucia|elena|carmen|maria|maría|sofía|sofia|google español de méxico|google español$/i
const MALE_HINT =
  /male|masculin|\bman\b|hombre|jorge|raul|raúl|diego|carlos|juan|pablo|antonio|google español de estados unidos/i

function scoreLang(lang: string): number {
  const l = lang.replace('_', '-').toLowerCase()
  if (l === 'es-mx' || l.startsWith('es-mx')) return 3
  if (l === 'es-us' || l.startsWith('es-us')) return 2
  if (l === 'es' || l.startsWith('es-') || l.startsWith('es_')) return 1
  return 0
}

function genderScore(name: string, preferred: 'm' | 'f'): number {
  const n = name.toLowerCase()
  if (preferred === 'f') {
    if (FEMALE_HINT.test(n)) return 2
    if (MALE_HINT.test(n)) return -1
    return 0
  }
  if (MALE_HINT.test(n)) return 2
  if (FEMALE_HINT.test(n)) return -1
  return 0
}

/** Prefer es-MX → es-US → es-*, then match m|f by voice name heuristics. */
export function pickSpanishVoice(
  preferred: 'm' | 'f',
): SpeechSynthesisVoice | null {
  if (typeof speechSynthesis === 'undefined') return null
  const voices = speechSynthesis.getVoices()
  if (!voices.length) return null

  const es = voices.filter((v) => scoreLang(v.lang) > 0)
  const pool = es.length ? es : voices

  let best: SpeechSynthesisVoice | null = null
  let bestScore = -Infinity
  for (const v of pool) {
    const score = scoreLang(v.lang) * 10 + genderScore(v.name, preferred)
    if (score > bestScore) {
      bestScore = score
      best = v
    }
  }
  return best
}

/**
 * Play guided prayer audio for a step.
 *
 * **Backend today:** Web Speech API (speechSynthesis) reading bodyEs.
 * **Later:** one-module swap to `new Audio(resolveAudioClip(...).src)` + ended.
 *
 * Single-speaker: starting a new clip cancels the previous one.
 */
export function playClip(
  prayerKey: PrayerKey,
  options: PlayClipOptions,
): void {
  stopClip()
  const gen = generation

  const prayer = getPrayer(prayerKey)
  // Keep clip metadata available for the future mp3 path.
  void resolveAudioClip(prayerKey, options.voice)

  if (typeof speechSynthesis === 'undefined' || typeof SpeechSynthesisUtterance === 'undefined') {
    return
  }

  const utter = new SpeechSynthesisUtterance(prayer.bodyEs)
  utter.lang = 'es-MX'
  const voice = pickSpanishVoice(options.voice)
  if (voice) {
    utter.voice = voice
    if (voice.lang) utter.lang = voice.lang
  }

  utter.onend = () => {
    if (gen !== generation) return
    options.onEnded?.()
  }
  utter.onerror = () => {
    // Cancelled utterances often emit 'interrupted'/'canceled' — ignore.
  }

  speechSynthesis.speak(utter)
}
