import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/** Weekday → expected mystery set name (es). */
const BY_DAY: Record<number, string> = {
  0: 'Misterios gloriosos',
  1: 'Misterios gozosos',
  2: 'Misterios dolorosos',
  3: 'Misterios gloriosos',
  4: 'Misterios luminosos',
  5: 'Misterios dolorosos',
  6: 'Misterios gozosos',
}

function captionTitle(page: import('@playwright/test').Page) {
  return page.locator('[role="status"] p').first()
}

test.describe('F01 Slice 1 H01→R01', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') throw new Error(`console error: ${msg.text()}`)
    })
    page.on('response', (res) => {
      if (res.status() >= 500) throw new Error(`${res.status()} on ${res.url()}`)
    })
  })

  test('F01-H1 home shows today mystery and enters Rosario', async ({
    page,
  }) => {
    await page.goto('/')
    const expected = BY_DAY[new Date().getDay()]
    await expect(page.getByText(new RegExp(`Hoy:\\s*${expected}`))).toBeVisible()
    await expect(
      page.getByRole('link', { name: /Rezar el Rosario/i }),
    ).toBeVisible()
    await page.getByRole('link', { name: /Rezar el Rosario/i }).click()
    await expect(
      page.getByRole('heading', { name: 'El Santo Rosario' }),
    ).toBeVisible()
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
    await expect(
      page.getByText(/En el nombre del Padre/),
    ).toBeVisible()
    await expect(page.getByText('Preparación')).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(
      a11y.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      ),
    ).toEqual([])
  })

  test('F01-H2 chevrons advance caption through intro beads', async ({
    page,
  }) => {
    await page.goto('/rosario')
    const next = page.getByRole('button', { name: 'Siguiente' })
    const prev = page.getByRole('button', { name: 'Anterior' })
    await expect(prev).toBeDisabled()

    await next.click()
    await expect(captionTitle(page)).toHaveText('Credo')
    await next.click()
    await expect(captionTitle(page)).toHaveText('Padre Nuestro')
    await next.click()
    await expect(captionTitle(page)).toHaveText('Ave María')
    await next.click()
    await next.click()
    await next.click()
    await expect(captionTitle(page)).toHaveText('Gloria')

    await prev.click()
    await expect(captionTitle(page)).toHaveText('Ave María')
  })

  test('F01-H3 first decade shows mystery title 1', async ({ page }) => {
    await page.goto('/rosario')
    const next = page.getByRole('button', { name: 'Siguiente' })
    for (let i = 0; i < 7; i++) await next.click()
    await expect(captionTitle(page)).toHaveText('Padre Nuestro')
    const titles = [
      'La Anunciación del Ángel a María',
      'La Agonía de Jesús en el Huerto',
      'La Resurrección del Señor',
      'El Bautismo de Jesús en el Jordán',
    ]
    const label = await page.locator('[role="img"]').getAttribute('aria-label')
    expect(titles).toContain(label)
  })

  test('F01-H4 full sequence ends; next disabled; 74 steps', async ({
    page,
  }) => {
    await page.goto('/rosario')
    const next = page.getByRole('button', { name: 'Siguiente' })
    let clicks = 0
    while (!(await next.isDisabled()) && clicks < 200) {
      await next.click()
      clicks++
    }
    expect(clicks).toBe(73)
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
    await expect(next).toBeDisabled()
  })

  test('F01-E1 back mid-flow returns home; re-enter resets step', async ({
    page,
  }) => {
    await page.goto('/rosario')
    await page.getByRole('button', { name: 'Siguiente' }).click()
    await expect(captionTitle(page)).toHaveText('Credo')
    await page.getByRole('link', { name: 'Volver' }).click()
    await expect(
      page.getByRole('heading', { name: 'OrarContigo' }),
    ).toBeVisible()
    await page.getByRole('link', { name: /Rezar el Rosario/i }).click()
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
  })

  test('F01-E2 keyboard arrows advance', async ({ page }) => {
    await page.goto('/rosario')
    await expect(
      page.getByRole('heading', { name: 'El Santo Rosario' }),
    ).toBeVisible()
    // Focus the live region so key events hit the document reliably.
    await page.locator('[role="status"]').click()
    await page.keyboard.press('ArrowRight')
    await expect(captionTitle(page)).toHaveText('Credo')
    await page.keyboard.press('ArrowLeft')
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
  })

  test('F01-E3 mobile width home a11y (serious+)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await page.goto('/')
    const a11y = await new AxeBuilder({ page }).analyze()
    expect(
      a11y.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      ),
    ).toEqual([])
  })

  test('F01-E4 Coronilla + Oraciones + Ajustes reachable', async ({
    page,
  }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /Coronilla de la Divina Misericordia/i })
      .click()
    await expect(
      page.getByRole('heading', {
        name: 'Coronilla de la Divina Misericordia',
      }),
    ).toBeVisible()
    await expect(page.getByText('Próximamente')).toHaveCount(0)
    await page.getByRole('link', { name: 'Volver' }).click()
    await page.getByRole('link', { name: /^Oraciones$/ }).click()
    await expect(page.getByRole('heading', { name: 'Oraciones' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ave María' })).toBeVisible()
    await expect(page.getByText('Próximamente')).toHaveCount(0)
    await page.getByRole('link', { name: 'Volver' }).click()
    await page.getByRole('link', { name: 'Ajustes' }).click()
    await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible()
    await expect(page.getByText('Audio al rezar')).toBeVisible()
    await expect(page.getByText('Próximamente')).toHaveCount(0)
  })

  test('F01-R1 BUG-002 Fatima and Salve have active bead glow', async ({
    page,
  }) => {
    await page.goto('/rosario')
    const next = page.getByRole('button', { name: 'Siguiente' })
    // First Oración de Fátima is step index 19
    for (let i = 0; i < 19; i++) await next.click()
    await expect(captionTitle(page)).toHaveText('Oración de Fátima')
    await expect(page.locator('svg circle[style*="drop-shadow"]')).toHaveCount(1)

    // Salve is step 72
    for (let i = 19; i < 72; i++) await next.click()
    await expect(captionTitle(page)).toHaveText('Salve')
    await expect(page.locator('svg circle[style*="drop-shadow"]')).toHaveCount(1)
  })
})
