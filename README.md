# OrarContigo

Rosario y Coronilla en español latinoamericano. Sin cuenta, sin servidor: preferencias solo en `localStorage`.

## Live

**https://tzukasa.github.io/OrarContigo/**

## Dev

```bash
npm install
npm run dev
npm run build
npm run test:e2e
```

## Deploy (GitHub Pages)

Project Pages with Vite `base: /OrarContigo/` when `GITHUB_PAGES=1`.

```bash
npm run deploy:pages   # build:pages + gh-pages → branch gh-pages
```

Source: `main`. Site: `gh-pages` branch / root.

## Privacidad

[/privacidad](https://tzukasa.github.io/OrarContigo/privacidad) — no recopilamos datos; solo `localStorage` local.

## PWA / offline

After the first online visit, a service worker caches the app shell so Rosario, Coronilla, and Oraciones work offline. Prefs stay in `localStorage`. Guided audio uses the device Web Speech API (no mp3 files).

Install: browser **Add to Home Screen** / Instalar app (Android Chrome or iOS Safari Share sheet).
