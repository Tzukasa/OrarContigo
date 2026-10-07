import { useEffect, useRef } from 'react'
import { playClip, stopClip } from '../audio'
import type { PrayerKey, UserPrefs } from '../data/types'

type AudioPrefs = Pick<UserPrefs, 'audioOn' | 'audioAutoAdvance' | 'voice'>

/**
 * Speak the current step when audio is on; cancel on step change / leave / off.
 * If audioAutoAdvance, natural utterance end advances like the next chevron.
 */
export function useGuidedAudio(
  prayerKey: PrayerKey,
  prefs: AudioPrefs,
  onAutoAdvance: () => void,
): void {
  const advanceRef = useRef(onAutoAdvance)
  const autoRef = useRef(prefs.audioAutoAdvance)

  useEffect(() => {
    advanceRef.current = onAutoAdvance
  }, [onAutoAdvance])

  useEffect(() => {
    autoRef.current = prefs.audioAutoAdvance
  }, [prefs.audioAutoAdvance])

  useEffect(() => {
    if (!prefs.audioOn) {
      stopClip()
      return
    }

    playClip(prayerKey, {
      voice: prefs.voice,
      onEnded: () => {
        if (autoRef.current) advanceRef.current()
      },
    })

    return () => {
      stopClip()
    }
  }, [prayerKey, prefs.audioOn, prefs.voice])
}
