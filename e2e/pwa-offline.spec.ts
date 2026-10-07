import { test, expect } from '@playwright/test'

test.describe('PWA offline shell', () => {
  test('PWA-H1 manifest link + service worker registers', async ({
    page,
  }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') throw new Error(`console error: ${msg.text()}`)
    })

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'OrarContigo' })).toBeVisible()

    const manifestHref = await page
      .locator('link[rel="manifest"]')
      .getAttribute('href')
    expect(manifestHref, 'webmanifest link present').toBeTruthy()

    const manifestUrl = new URL(manifestHref!, page.url()).href
    const manifestRes = await page.request.get(manifestUrl)
    expect(manifestRes.ok()).toBeTruthy()
    const manifest = await manifestRes.json()
    expect(manifest.name).toBe('OrarContigo')
    expect(manifest.lang).toBe('es-MX')
    expect(manifest.display).toBe('standalone')
    expect(manifest.theme_color).toBe('#2F5F5A')
    expect(manifest.background_color).toBe('#F7F0E6')
    expect(Array.isArray(manifest.icons) && manifest.icons.length > 0).toBe(
      true,
    )

    // Wait for SW registration (autoUpdate + immediate)
    await expect
      .poll(
        async () =>
          page.evaluate(async () => {
            if (!('serviceWorker' in navigator)) return 'no-api'
            const reg = await navigator.serviceWorker.getRegistration()
            return reg?.active?.state ?? reg?.installing?.state ?? reg?.waiting?.state ?? 'none'
          }),
        { timeout: 15000 },
      )
      .toMatch(/activated|activating|installed|installing/)
  })
})
