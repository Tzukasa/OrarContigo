import { Music2 } from 'lucide-react'
import { IconButton } from './IconButton'

type Props = {
  audioOn: boolean
  onToggle: () => void
}

/** TopBar note icon — toggles prefs.audioOn on R01 / C01. */
export function AudioToggle({ audioOn, onToggle }: Props) {
  return (
    <IconButton
      label={audioOn ? 'Silenciar audio' : 'Activar audio'}
      aria-pressed={audioOn}
      onClick={onToggle}
      className={
        audioOn
          ? 'text-prayer-text opacity-100'
          : 'text-prayer-text opacity-45'
      }
    >
      <Music2 size={20} aria-hidden data-audio-on={audioOn ? 'true' : 'false'} />
    </IconButton>
  )
}
