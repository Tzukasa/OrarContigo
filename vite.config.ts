import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project Pages: set GITHUB_PAGES=1 (or VITE_BASE=/OrarContigo/) at build time.
const base =
  process.env.VITE_BASE ??
  (process.env.GITHUB_PAGES === '1' ? '/OrarContigo/' : '/')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base,
})
