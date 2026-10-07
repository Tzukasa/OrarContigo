import { useMemo, useState, useCallback, useEffect } from 'react'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'
import { MysteryStage } from '../components/MysteryStage'
import { BeadTrack } from '../components/BeadTrack'
import { StepChevron } from '../components/StepChevron'
import { CaptionBar } from '../components/CaptionBar'
import { AudioToggle } from '../components/AudioToggle'
import {
  getMysteriesForSet,
  getPrayer,
  getRosarySteps,
  resolveMysterySetId,
} from '../data'
import { usePrefs } from '../hooks/usePrefs'
import { useGuidedAudio } from '../hooks/useGuidedAudio'

export function RosarioPage() {
  const { prefs, update } = usePrefs()
  const setId = useMemo(() => resolveMysterySetId(prefs), [prefs])
  const mysteries = useMemo(() => getMysteriesForSet(setId), [setId])
  const steps = useMemo(() => getRosarySteps(), [])
  const [index, setIndex] = useState(0)

  const step = steps[index]
  const mystery = step.mysteryOrder
    ? mysteries.find((m) => m.order === step.mysteryOrder)
    : undefined
  const prayer = getPrayer(step.prayerKey)

  const prev = useCallback(
    () => setIndex((i) => Math.max(0, i - 1)),
    [],
  )
  const next = useCallback(
    () => setIndex((i) => Math.min(steps.length - 1, i + 1)),
    [steps.length],
  )

  useGuidedAudio(step.prayerKey, prefs, next)

  const toggleAudio = useCallback(() => {
    const audioOn = !prefs.audioOn
    update({
      audioOn,
      audioAutoAdvance: audioOn ? prefs.audioAutoAdvance : false,
    })
  }, [prefs.audioOn, prefs.audioAutoAdvance, update])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  return (
    <AppShell variant="prayer">
      <TopBar
        variant="prayer"
        title="El Santo Rosario"
        backTo="/"
        actions={
          <AudioToggle audioOn={prefs.audioOn} onToggle={toggleAudio} />
        }
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <MysteryStage mystery={mystery} setId={setId} />
        <BeadTrack steps={steps} currentIndex={index} />
        <div className="absolute inset-y-0 left-1 flex items-center">
          <StepChevron direction="prev" disabled={index === 0} onClick={prev} />
        </div>
        <div className="absolute inset-y-0 right-1 flex items-center">
          <StepChevron
            direction="next"
            disabled={index === steps.length - 1}
            onClick={next}
          />
        </div>
      </div>
      <CaptionBar text={step.labelEs} title={prayer.titleEs} />
    </AppShell>
  )
}
