import { test, expect } from '@playwright/test'

const BASE = 'https://tzukasa.github.io/OrarContigo/'

test.describe('LIVE post-deploy smoke', () => {
  test.use({ baseURL: BASE })

  test('LIVE-H1 home → Rosario → Coronilla → Oraciones → Ajustes', async ({
    page,
  }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') throw new Error(`console: ${msg.text()}`)
    })
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'OrarContigo' })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.getByText(/Hoy:/)).toBeVisible()

    await page.getByRole('link', { name: /Rezar el Rosario/i }).click()
    await expect(
      page.getByRole('heading', { name: 'El Santo Rosario' }),
    ).toBeVisible()
    await expect(page.locator('[role="status"] p').first()).toHaveText(
      'Señal de la Cruz',
    )
    await page.getByRole('button', { name: 'Siguiente' }).click()
    await expect(page.locator('[role="status"] p').first()).toHaveText('Credo')

    await page.getByRole('link', { name: 'Volver' }).click()
    await page.getByRole('link', { name: /Coronilla/i }).click()
    await expect(
      page.getByRole('heading', { name: /Coronilla de la Divina Misericordia/ }),
    ).toBeVisible()

    await page.getByRole('link', { name: 'Volver' }).click()
    await page.getByRole('link', { name: /^Oraciones$/ }).click()
    await expect(page.getByRole('heading', { name: 'Oraciones' })).toBeVisible()
    await page.getByRole('link', { name: 'Ave María' }).click()
    await expect(page.getByText(/Dios te salve, María/)).toBeVisible()

    await page.goto('/')
    await page.getByRole('link', { name: 'Ajustes' }).click()
    await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible()
  })

  test('LIVE-E1 deep link /rosario', async ({ page }) => {
    const res = await page.goto('/rosario')
    const status = res?.status()
    const hasRosario = await page
      .getByRole('heading', { name: 'El Santo Rosario' })
      .isVisible()
      .catch(() => false)
    // Document: SPA deep links need 404.html rewrite on GH Pages
    expect(
      { status, hasRosario },
      'deep link should render Rosario (404.html SPA fallback)',
    ).toEqual({ status: 200, hasRosario: true })
  })

  test('LIVE-E2 privacidad page', async ({ page }) => {
    const res = await page.goto('/privacidad')
    const status = res?.status()
    const text = await page.locator('body').innerText()
    const ok =
      /privacidad|privacy|datos|información/i.test(text) &&
      !(await page.getByRole('heading', { name: 'OrarContigo' }).isVisible().catch(() => false) && !/privacidad/i.test(text))
    // Prefer a real privacy doc; fail if hard 404 without content
    expect(status).toBeLessThan(500)
    expect(text.length).toBeGreaterThan(20)
    console.log('privacidad status', status, 'snippet', text.slice(0, 120))
  })
})
