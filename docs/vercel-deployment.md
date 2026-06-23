# Vercel deployment (Phase 6)

Phasercraft's frontend is a Vite **static build** (`npm run build` → `dist/`) deployed to
Vercel's free hobby tier. This replaces GitHub Pages; Pages stays running in parallel until
the Vercel production URL is confirmed stable, then it's retired (see `ROADMAP.md`).

## What's config-as-code (already in the repo)

- **`vercel.json`** — pins `framework: vite`, `buildCommand: npm run build`, and
  `outputDirectory: dist`. Because these live in the repo, the only dashboard work is
  connecting the repo and setting env vars.

## One-time maintainer steps (Vercel dashboard)

These need the Vercel account and can't be done from the repo:

1. **Import the repo** — Vercel → Add New → Project → import `chriskinch/phasercraft`.
   Framework/build/output are picked up from `vercel.json`; no overrides needed.
2. **Production branch** — confirm it's `main` (Project → Settings → Git).
3. **Environment variable** `VITE_ARMORY_URL` (Project → Settings → Environment Variables):
    - Set to `/api/armory` for both **Preview** and **Production** (a same-origin path to the
      armory Vercel Functions). Leave it unset and the shop shows its graceful "merchant
      unavailable" state. It is read at **build time** (Vite inlines `import.meta.env`), so
      changing it requires a redeploy.
4. **Confirm production** — after the first deploy, check `phasercraft.vercel.app` loads and
   the game plays (boot → save picker → character select → run).

## Notes

- **Base path:** the Vercel build leaves `VITE_BASE_URL` unset, so Vite's `base` is `/`
  (served from the domain root). The GitHub Pages workflow keeps setting
  `VITE_BASE_URL=/phasercraft/` for its sub-path build — the two coexist during the
  transition.
- **No SPA rewrites** are needed: the app is a single `index.html` with no client-side
  routing.
