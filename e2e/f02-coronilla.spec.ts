import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

function captionTitle(page: import('@playwright/test').Page) {
  return page.locator('[role="status"] p').first()
}

test.describe('F02 Coronilla C01', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') throw new Error(`console error: ${msg.text()}`)
    })
    page.on('response', (res) => {
      if (res.status() >= 500) throw new Error(`${res.status()} on ${res.url()}`)
    })
  })

  test('F02-H1 home enters Coronilla session', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /Coronilla de la Divina Misericordia/i })
      .click()
    await expect(
      page.getByRole('heading', {
        name: 'Coronilla de la Divina Misericordia',
      }),
    ).toBeVisible()
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
    await expect(page.getByRole('img', { name: 'Divina Misericordia' })).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(
      a11y.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      ),
    ).toEqual([])
  })

  test('F02-H2 chevrons advance through intro into first decade', async ({
    page,
  }) => {
    await page.goto('/coronilla')
    const next = page.getByRole('button', { name: 'Siguiente' })
    await expect(page.getByRole('button', { name: 'Anterior' })).toBeDisabled()

    await next.click()
    await expect(captionTitle(page)).toHaveText('Padre Nuestro')
    await next.click()
    await expect(captionTitle(page)).toHaveText('Ave María')
    await next.click()
    await expect(captionTitle(page)).toHaveText('Credo')
    await next.click()
    await expect(captionTitle(page)).toHaveText('Padre Eterno')
    await expect(page.getByText('Decena 1')).toBeVisible()
    await next.click()
    await expect(captionTitle(page)).toHaveText('Por su Pasión')
  })

  test('F02-H3 full sequence ends at closing cruz', async ({ page }) => {
    await page.goto('/coronilla')
    const next = page.getByRole('button', { name: 'Siguiente' })
    let clicks = 0
    while (!(await next.isDisabled()) && clicks < 200) {
      await next.click()
      clicks++
    }
    // 64 steps → 63 advances
    expect(clicks).toBe(63)
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
    await expect(next).toBeDisabled()
  })

  test('F02-E1 keyboard arrows work', async ({ page }) => {
    await page.goto('/coronilla')
    await page.locator('[role="status"]').click()
    await page.keyboard.press('ArrowRight')
    await expect(captionTitle(page)).toHaveText('Padre Nuestro')
    await page.keyboard.press('ArrowLeft')
    await expect(captionTitle(page)).toHaveText('Señal de la Cruz')
  })
})
