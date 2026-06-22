# Vercel deployment (Phase 6)

Phasercraft's frontend is a Vite **static build** (`npm run build` → `dist/`) deployed to
Vercel's free hobby tier. This replaces GitHub Pages; Pages stays running in parallel until
the Vercel production URL is confirmed stable, then it's retired (see `ROADMAP.md`).

## What's config-as-code (already in the repo)

- **`vercel.json`** — pins `framework: vite`, `buildCommand: npm run build`,
  `outputDirectory: dist`, and the **Ignored Build Step** (`ignoreCommand`). Because these
  live in the repo, the only dashboard work is connecting the repo and setting env vars.
- **`scripts/vercel-ignore-build.sh`** — the Ignored Build Step gate. Vercel reads its exit
  code (`1` = build, `0` = skip):
    - **Production** (merge to the production branch) → always builds.
    - **Preview** (a PR) → builds **only if the PR has the `deploy-preview` label**. This stops
      the hobby tier from building a preview on every push. The script reads the PR's labels
      from the public GitHub API (`VERCEL_GIT_PULL_REQUEST_ID` / `_REPO_OWNER` / `_REPO_SLUG`)
      and fails closed (skips) if it can't confirm the label.

### Getting a preview for a PR

Add the **`deploy-preview`** label to the PR. The next push (or re-deploy) builds a preview;
remove the label to stop further preview builds.

## One-time maintainer steps (Vercel dashboard)

These need the Vercel account and can't be done from the repo:

1. **Create the `deploy-preview` GitHub label** (Repo → Issues → Labels → New label). The
   Ignored Build Step gate reads it to decide whether to build a PR preview.
2. **Import the repo** — Vercel → Add New → Project → import `chriskinch/phasercraft`.
   Framework/build/output are picked up from `vercel.json`; no overrides needed.
3. **Production branch** — confirm it's `main` (Project → Settings → Git).
4. **Environment variable** `VITE_ARMORY_URL` (Project → Settings → Environment Variables):
    - Set to `/api/armory` for both **Preview** and **Production** (a same-origin path to the
      armory Vercel Functions). Leave it unset and the shop shows its graceful "merchant
      unavailable" state. It is read at **build time** (Vite inlines `import.meta.env`), so
      changing it requires a redeploy.
5. **Confirm production** — after the first deploy, check `phasercraft.vercel.app` loads and
   the game plays (boot → save picker → character select → run).

## Notes

- **Base path:** the Vercel build leaves `VITE_BASE_URL` unset, so Vite's `base` is `/`
  (served from the domain root). The GitHub Pages workflow keeps setting
  `VITE_BASE_URL=/phasercraft/` for its sub-path build — the two coexist during the
  transition.
- **No SPA rewrites** are needed: the app is a single `index.html` with no client-side
  routing.
