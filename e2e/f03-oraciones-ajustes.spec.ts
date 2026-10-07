import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('F03 P01 / P02 / A01', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') throw new Error(`console error: ${msg.text()}`)
    })
    page.on('response', (res) => {
      if (res.status() >= 500) throw new Error(`${res.status()} on ${res.url()}`)
    })
  })

  test('F03-H1 P01 lists MVP prayers and opens P02', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /^Oraciones$/ }).click()
    await expect(page.getByRole('heading', { name: 'Oraciones' })).toBeVisible()

    const expected = [
      'Señal de la Cruz',
      'Credo',
      'Padre Nuestro',
      'Ave María',
      'Gloria',
      'Oración de Fátima',
      'Salve',
      'Padre Eterno',
      'Por su Pasión',
      'Santo Dios',
      'Jesús, en Ti confío',
    ]
    for (const title of expected) {
      await expect(page.getByRole('link', { name: title })).toBeVisible()
    }

    await page.getByRole('link', { name: 'Ave María' }).click()
    await expect(page).toHaveURL(/\/oraciones\/ave_maria$/)
    await expect(
      page.getByRole('heading', { name: 'Ave María', level: 1 }),
    ).toBeVisible()
    await expect(page.getByText(/Dios te salve, María/)).toBeVisible()
    await expect(page.getByText('Amén.', { exact: false }).first()).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(
      a11y.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      ),
    ).toEqual([])
  })

  test('F03-H2 search filters local list', async ({ page }) => {
    await page.goto('/oraciones')
    await page.getByLabel('Buscar oración').fill('gloria')
    await expect(page.getByRole('link', { name: 'Gloria' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ave María' })).toHaveCount(0)
  })

  test('F03-H3 A01 prefs persist to localStorage', async ({ page }) => {
    await page.goto('/ajustes')
    await page.evaluate(() => localStorage.removeItem('rosario.prefs'))
    await page.reload()
    await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible()

    const audio = page.getByRole('switch', { name: 'Audio al rezar' })
    const auto = page.getByRole('switch', {
      name: 'Avanzar solo con el audio',
    })
    await expect(auto).toBeDisabled()
    await audio.click()
    await expect(audio).toHaveAttribute('aria-checked', 'true')
    await expect(auto).toBeEnabled()

    await page.getByRole('radio', { name: 'Masculina' }).click()
    await page.getByRole('radio', { name: 'Grande' }).click()

    const mysteries = page.getByRole('switch', { name: 'Misterios del día' })
    await mysteries.click()
    await expect(mysteries).toHaveAttribute('aria-checked', 'false')
    await expect(page.getByLabel('Elegir misterios')).toBeVisible()
    await page.getByLabel('Elegir misterios').selectOption('dolorosos')

    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('rosario.prefs') || '{}'),
    )
    expect(stored.audioOn).toBe(true)
    expect(stored.voice).toBe('m')
    expect(stored.fontScale).toBe(1.25)
    expect(stored.mysteriesAuto).toBe(false)
    expect(stored.mysterySetOverride).toBe('dolorosos')

    await page.reload()
    await expect(page.getByRole('switch', { name: 'Audio al rezar' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('radio', { name: 'Masculina' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(page.getByRole('radio', { name: 'Grande' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
  })

  test('F03-H5 A01 Tema: Oscuro sets data-theme=dark and persists', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' })
    await page.goto('/ajustes')
    await page.evaluate(() => localStorage.removeItem('rosario.prefs'))
    await page.reload()
    const html = page.locator('html')
    // default 'system' + light OS → light
    await expect(page.getByRole('radio', { name: 'Automático' })).toHaveAttribute(
      'aria-checked',
      'true',
    )
    await expect(html).toHaveAttribute('data-theme', 'light')

    await page.getByRole('radio', { name: 'Oscuro' }).click()
    await expect(html).toHaveAttribute('data-theme', 'dark')
    const stored = await page.evaluate(() =>
      JSON.parse(localStorage.getItem('rosario.prefs') || '{}'),
    )
    expect(stored.theme).toBe('dark')

    // persists; no-flash script sets it before the app mounts
    await page.reload({ waitUntil: 'commit' })
    await page.waitForFunction(() => document.documentElement.dataset.theme)
    await expect(html).toHaveAttribute('data-theme', 'dark')
    await expect(page.getByRole('radio', { name: 'Oscuro' })).toHaveAttribute(
      'aria-checked',
      'true',
    )

    // 'system' follows OS live
    await page.getByRole('radio', { name: 'Automático' }).click()
    await expect(html).toHaveAttribute('data-theme', 'light')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(html).toHaveAttribute('data-theme', 'dark')
  })

  test('F03-E1 empty search shows empty state', async ({ page }) => {
    await page.goto('/oraciones')
    await page.getByLabel('Buscar oración').fill('zzzz-no-existe')
    await expect(page.getByText('No encontramos esa oración')).toBeVisible()
  })

  test('F03-H4 mystery override changes home chip', async ({ page }) => {
    await page.goto('/ajustes')
    await page.evaluate(() => localStorage.removeItem('rosario.prefs'))
    await page.reload()
    await page.getByRole('switch', { name: 'Misterios del día' }).click()
    await page.getByLabel('Elegir misterios').selectOption('luminosos')
    await page.getByRole('link', { name: 'Volver' }).click()
    await expect(page.getByText(/Hoy:\s*Misterios luminosos/)).toBeVisible()
  })
})
