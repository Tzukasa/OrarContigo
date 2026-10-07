import { useMemo, useState, useCallback, useEffect } from 'react'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'
import { MysteryStage } from '../components/MysteryStage'
import { BeadTrack } from '../components/BeadTrack'
import { StepChevron } from '../components/StepChevron'
import { CaptionBar } from '../components/CaptionBar'
import { AudioToggle } from '../components/AudioToggle'
import { getChapletSteps, getPrayer } from '../data'
import { usePrefs } from '../hooks/usePrefs'
import { useGuidedAudio } from '../hooks/useGuidedAudio'

export function CoronillaPage() {
  const { prefs, update } = usePrefs()
  const steps = useMemo(() => getChapletSteps(), [])
  const [index, setIndex] = useState(0)

  const step = steps[index]
  const prayer = getPrayer(step.prayerKey)

  const decadeTitle =
    step.mysteryOrder != null
      ? `Decena ${step.mysteryOrder}`
      : undefined

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
        title="Coronilla de la Divina Misericordia"
        backTo="/"
        actions={
          <AudioToggle audioOn={prefs.audioOn} onToggle={toggleAudio} />
        }
      />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <MysteryStage
          variant="mercy"
          titleOverride={decadeTitle ?? 'Divina Misericordia'}
        />
        <BeadTrack
          steps={steps}
          currentIndex={index}
          variant="curve"
        />
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
