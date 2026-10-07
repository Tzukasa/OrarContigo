import { test, expect } from '@playwright/test'

function captionTitle(page: import('@playwright/test').Page) {
  return page.locator('[role="status"] p').first()
}

/** Mock Web Speech API before any page script runs. */
async function mockSpeech(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    type Utter = {
      text: string
      lang: string
      voice: unknown
      onend: ((ev?: Event) => void) | null
      onerror: ((ev?: Event) => void) | null
    }
    const store: {
      utterances: Utter[]
      cancelCount: number
      current: Utter | null
    } = {
      utterances: [],
      cancelCount: 0,
      current: null,
    }
    ;(window as unknown as { __speechMock: typeof store }).__speechMock = store

    class MockUtterance {
      text: string
      lang = ''
      voice: unknown = null
      onend: ((ev?: Event) => void) | null = null
      onerror: ((ev?: Event) => void) | null = null
      constructor(text: string) {
        this.text = text
      }
    }

    const synth = {
      speaking: false,
      pending: false,
      paused: false,
      getVoices: () => [
        {
          name: 'Sabina',
          lang: 'es-MX',
          localService: true,
          default: true,
          voiceURI: 'es-MX-Sabina',
        },
        {
          name: 'Raul',
          lang: 'es-MX',
          localService: true,
          default: false,
          voiceURI: 'es-MX-Raul',
        },
      ],
      speak(u: Utter) {
        store.utterances.push(u)
        store.current = u
        this.speaking = true
      },
      cancel() {
        store.cancelCount += 1
        this.speaking = false
        store.current = null
      },
      pause() {},
      resume() {},
      addEventListener() {},
      removeEventListener() {},
      dispatchEvent() {
        return false
      },
      onvoiceschanged: null,
    }

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: synth,
    })
    Object.defineProperty(window, 'SpeechSynthesisUtterance', {
      configurable: true,
      value: MockUtterance,
    })
  })
}

async function setPrefs(
  page: import('@playwright/test').Page,
  partial: Record<string, unknown>,
) {
  await page.addInitScript((p) => {
    const base = {
      voice: 'f',
      audioOn: false,
      audioAutoAdvance: false,
      mysteriesAuto: true,
      fontScale: 1,
    }
    localStorage.setItem('rosario.prefs', JSON.stringify({ ...base, ...p }))
  }, partial)
}

test.describe('Audio guided (TTS placeholder)', () => {
  test('AUDIO-H1 toggle visible on R01 and updates prefs', async ({
    page,
  }) => {
    await page.goto('/rosario')
    const toggle = page.getByRole('button', { name: /Activar audio|Silenciar audio/ })
    await expect(toggle).toBeVisible()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await expect(toggle).toHaveAttribute('aria-label', 'Silenciar audio')

    const prefs = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('rosario.prefs') || '{}'),
    )
    expect(prefs.audioOn).toBe(true)

    await toggle.click()
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    const prefsOff = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('rosario.prefs') || '{}'),
    )
    expect(prefsOff.audioOn).toBe(false)
  })

  test('AUDIO-H2 toggle visible on C01', async ({ page }) => {
    await page.goto('/coronilla')
    await expect(
      page.getByRole('button', { name: /Activar audio|Silenciar audio/ }),
    ).toBeVisible()
  })

  test('AUDIO-H3 speaks on step enter when audioOn; cancel on advance', async ({
    page,
  }) => {
    await mockSpeech(page)
    await setPrefs(page, { audioOn: true, audioAutoAdvance: false, voice: 'f' })
    await page.goto('/rosario')

    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { __speechMock: { utterances: unknown[] } })
              .__speechMock.utterances.length,
        ),
      )
      .toBeGreaterThanOrEqual(1)

    const first = await page.evaluate(() => {
      const m = (
        window as unknown as {
          __speechMock: { utterances: { text: string; lang: string }[] }
        }
      ).__speechMock
      return m.utterances[0]
    })
    expect(first.text).toMatch(/En el nombre del Padre/)
    expect(first.lang.toLowerCase()).toMatch(/^es/)

    const cancelsBefore = await page.evaluate(
      () =>
        (window as unknown as { __speechMock: { cancelCount: number } })
          .__speechMock.cancelCount,
    )
    await page.getByRole('button', { name: 'Siguiente' }).click()
    await expect(captionTitle(page)).toHaveText('Credo')

    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { __speechMock: { utterances: unknown[] } })
              .__speechMock.utterances.length,
        ),
      )
      .toBeGreaterThanOrEqual(2)

    const cancelsAfter = await page.evaluate(
      () =>
        (window as unknown as { __speechMock: { cancelCount: number } })
          .__speechMock.cancelCount,
    )
    expect(cancelsAfter).toBeGreaterThan(cancelsBefore)

    const second = await page.evaluate(() => {
      const m = (
        window as unknown as {
          __speechMock: { utterances: { text: string }[] }
        }
      ).__speechMock
      return m.utterances[m.utterances.length - 1]
    })
    expect(second.text).toMatch(/Creo en Dios/)
  })

  test('AUDIO-H4 auto-advance on utterance ended', async ({ page }) => {
    await mockSpeech(page)
    await setPrefs(page, {
      audioOn: true,
      audioAutoAdvance: true,
      voice: 'f',
    })
    await page.goto('/rosario')
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')

    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { __speechMock: { utterances: unknown[] } })
              .__speechMock.utterances.length,
        ),
      )
      .toBeGreaterThanOrEqual(1)

    await page.evaluate(() => {
      const m = (
        window as unknown as {
          __speechMock: {
            current: { onend: ((ev?: Event) => void) | null } | null
          }
        }
      ).__speechMock
      m.current?.onend?.(new Event('end'))
    })

    await expect(captionTitle(page)).toHaveText('Credo')
  })

  test('AUDIO-E1 turning audio off stops speech', async ({ page }) => {
    await mockSpeech(page)
    await setPrefs(page, { audioOn: true })
    await page.goto('/rosario')

    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { __speechMock: { utterances: unknown[] } })
              .__speechMock.utterances.length,
        ),
      )
      .toBeGreaterThanOrEqual(1)

    const before = await page.evaluate(
      () =>
        (window as unknown as { __speechMock: { cancelCount: number } })
          .__speechMock.cancelCount,
    )
    await page.getByRole('button', { name: 'Silenciar audio' }).click()
    const after = await page.evaluate(
      () =>
        (window as unknown as { __speechMock: { cancelCount: number } })
          .__speechMock.cancelCount,
    )
    expect(after).toBeGreaterThan(before)
  })

  test('AUDIO-E2 ended does not advance when auto is off', async ({ page }) => {
    await mockSpeech(page)
    await setPrefs(page, {
      audioOn: true,
      audioAutoAdvance: false,
      voice: 'f',
    })
    await page.goto('/rosario')
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
    await expect
      .poll(async () =>
        page.evaluate(
          () =>
            (window as unknown as { __speechMock: { utterances: unknown[] } })
              .__speechMock.utterances.length,
        ),
      )
      .toBeGreaterThanOrEqual(1)

    await page.evaluate(() => {
      const m = (
        window as unknown as {
          __speechMock: {
            current: { onend: ((ev?: Event) => void) | null } | null
          }
        }
      ).__speechMock
      m.current?.onend?.(new Event('end'))
    })
    // Give React a tick; must stay on first step
    await page.waitForTimeout(150)
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
  })

})
