import { Link } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { TopBar } from '../components/TopBar'
import { SettingsRow } from '../components/SettingsRow'
import { SegmentedControl } from '../components/SegmentedControl'
import { usePrefs, FONT_SCALE_OPTIONS, fontScaleKey } from '../hooks/usePrefs'
import { MYSTERY_SETS } from '../data/mysteries'
import type { MysterySetId } from '../data/types'

export function AjustesPage() {
  const { prefs, update } = usePrefs()
  const scaleKey = fontScaleKey(prefs.fontScale)

  return (
    <AppShell variant="home">
      <TopBar title="Ajustes" backTo="/" />
      <div className="flex-1 overflow-y-auto pb-10">
        <SettingsRow
          variant="toggle"
          label="Audio al rezar"
          checked={prefs.audioOn}
          onChange={(audioOn) =>
            update({
              audioOn,
              audioAutoAdvance: audioOn ? prefs.audioAutoAdvance : false,
            })
          }
        />
        <SettingsRow
          variant="toggle"
          label="Avanzar solo con el audio"
          help="Se activa cuando hay audio disponible"
          checked={prefs.audioAutoAdvance}
          disabled={!prefs.audioOn}
          onChange={(audioAutoAdvance) => update({ audioAutoAdvance })}
        />
        <SettingsRow variant="select" label="Voz">
          <SegmentedControl
            name="voice"
            label="Voz"
            value={prefs.voice}
            onChange={(voice) => update({ voice })}
            options={[
              { value: 'm', label: 'Masculina' },
              { value: 'f', label: 'Femenina' },
            ]}
          />
        </SettingsRow>
        <SettingsRow
          variant="toggle"
          label="Misterios del día"
          help="Elige automáticamente según el día de la semana"
          checked={prefs.mysteriesAuto}
          onChange={(mysteriesAuto) =>
            update({
              mysteriesAuto,
              mysterySetOverride: mysteriesAuto
                ? undefined
                : (prefs.mysterySetOverride ?? 'gozosos'),
            })
          }
        />
        {!prefs.mysteriesAuto ? (
          <SettingsRow variant="select" label="Elegir misterios">
            <label className="sr-only" htmlFor="mystery-set">
              Elegir misterios
            </label>
            <select
              id="mystery-set"
              value={prefs.mysterySetOverride ?? 'gozosos'}
              onChange={(e) =>
                update({
                  mysterySetOverride: e.target.value as MysterySetId,
                })
              }
              className="h-9 max-w-[11rem] rounded-md border border-border bg-surface px-2 font-sans text-sm font-semibold text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {MYSTERY_SETS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nameEs.replace('Misterios ', '')}
                </option>
              ))}
            </select>
          </SettingsRow>
        ) : null}
        <SettingsRow variant="select" label="Tamaño del texto">
          <SegmentedControl
            name="fontScale"
            label="Tamaño del texto"
            value={scaleKey}
            onChange={(key) => {
              const opt = FONT_SCALE_OPTIONS.find((o) => o.key === key)!
              update({ fontScale: opt.value })
            }}
            options={FONT_SCALE_OPTIONS.map((o) => ({
              value: o.key,
              label: o.label,
            }))}
          />
        </SettingsRow>
        <div className="mt-8 px-4 text-center">
          <Link
            to="/privacidad"
            className="font-sans text-sm text-text-muted underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </AppShell>
  )
}
