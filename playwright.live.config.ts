import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  testMatch: 'live-smoke.spec.ts',
  reporter: 'list',
  timeout: 60000,
  use: {
    baseURL: 'https://tzukasa.github.io/OrarContigo/',
    ...devices['Pixel 7'],
  },
})
