# Agentic Readiness Roadmap

Goal: make Phasercraft stable, fully typed, well-tested, and protected by CI so that
agentic feature development can proceed safely. This document is the source of truth
for the phased plan. Each phase has a tracking GitHub issue under the
[Reforge milestone](https://github.com/chriskinch/phasercraft/milestone/10)
(#306–#312 for original phases; Phases 5–8 need new issues when work starts); every PR
links to its phase issue and checks items off here.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Decisions log (agreed 2026-06-17)

| Topic         | Decision                                                                                                                                                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phaser        | Stabilize and test on 3.90 first. Migrate to Phaser 4 as the final phase, validated by the test suite and the official v3→v4 migration guide/skill.                                                                                                                                                                                                           |
| Build tooling | Replace Next.js with Vite (Phase 5). Next.js is unused as a framework — static export only, no SSR/API routes/image optimisation. Vite removes the framework layer entirely.                                                                                                                                                                                  |
| Hosting       | All-in on Vercel — frontend and backend on one platform. Frontend (Phase 6): free hobby tier, Vite static build, no adapter needed; production on merge to `main`; previews gated by Ignored Build Step script checking GitHub API for `deploy-preview` label. GitHub Pages stays in parallel, retired once Vercel is confirmed.                              |
| Backend       | Armory moves to Vercel (Phase 7): Lambda + DynamoDB → Vercel Functions + Vercel KV (Redis hash, `id` as field, JSON values). `generateItem` logic ports unchanged. Functions live in `/api/` in the monorepo. Gateway points at the new Vercel endpoint during transition. AWS infrastructure (Lambda, DynamoDB, IAM, Serverless Framework) retired entirely. |
| GraphQL       | Remove it (Phase 8). Apollo Client + `server/` gateway over-complicate the stack for a single data source. Phase 8 replaces them with `fetch()` calls to the Vercel Functions REST API and deletes the gateway. Apollo Client 4 upgrade (Phase 9) is eliminated as a result.                                                                                  |
| Prod shop     | While GraphQL is still in place (Phases 1–7), show a graceful "merchant unavailable" state when `VITE_GRAPHQL_URL` is unset.                                                                                                                                                                                                                                  |
| Dependencies  | Minor/patch updates immediately. Major upgrades (ESLint 10, TS 6) land as individual PRs after test coverage exists. Next 16 and Apollo Client 4 both eliminated by earlier phases.                                                                                                                                                                           |
| Test strategy | Full pyramid: unit + React component tests + Playwright E2E. Smoke E2E on every PR; full E2E nightly.                                                                                                                                                                                                                                                         |
| Coverage      | Enforced ratcheting threshold in CI (fails on regression below high-water mark; target ~80% on non-Phaser code).                                                                                                                                                                                                                                              |
| Node          | Node 22 LTS for local dev and CI.                                                                                                                                                                                                                                                                                                                             |
| Workflow      | Small focused PRs; the maintainer reviews every PR. Agents ask on behavior changes, decide on mechanics. See `CLAUDE.md`.                                                                                                                                                                                                                                     |

### Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive)

Re-approach to de-risk the armory/GraphQL migration. The original Phase 7 (repoint
the gateway at Vercel) and Phase 8 (delete GraphQL) are replaced by an **additive,
verify-at-each-gate** sequence on fresh branches from `main`. Old infrastructure is
deleted **only after** the new path is proven.

| Topic                   | Decision                                                                                                                                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sequencing              | Four small PRs, each branched from `main`, each merged before the next: (1) legacy contract tests, (2) new `/api/armory/*`, (3) frontend → REST swap, (4) teardown. Nothing old is removed until PRs 2 and 3 are verified.                                                                            |
| Data path               | The frontend will call the REST API **directly** with `fetch()` (Apollo removed from the data path), **not** by repointing the gateway. The `server/` gateway stays deployed-but-unused until the teardown PR, so each step is reversible.                                                            |
| API location            | New functions live under `api/armory/*` (the repo will host other APIs alongside it). Shared logic (`generateItem`, constants) is ported unchanged into `api/armory/_lib/`. The existing `services/armory/` is **not touched** until teardown.                                                        |
| Storage                 | Vercel KV (Redis) via a small swappable adapter: an in-memory implementation for local/standalone tests, the real Vercel KV binding in production (maintainer provisions it in the dashboard). No agent access to live infra.                                                                         |
| Sort / filter / derived | All move **client-side** into plain TS: sorting (already client-side via the Apollo cache), stat filtering (was in the gateway), and the `color`/`adjusted`/`formatted`/`abbreviation` display fields (were Apollo cache field policies in `src/lib/cache.ts`). The REST API stays a dumb CRUD store. |
| Parity definition       | "Identical" = response **schema/contract** match (mandatory & optional fields + types); values may differ since items are randomly generated. Captured once as a shared contract (`test/contract/armoryContract.ts`) and asserted against both old and new.                                           |
| Data migration          | None. The shop is randomly generated, transient stock — first deploy simply stocks fresh, so there is no DynamoDB → KV data copy.                                                                                                                                                                     |

---

## Phase 0 — Baseline (done, PR #305)

- [x] Vitest + jsdom configured, 16 baseline tests (helpers, gameReducer)
- [x] Prettier, `typecheck` script, simple-git-hooks + lint-staged pre-commit

## Phase 1 — CI quality gates

Do this first so every later PR is protected.

- [x] New `ci.yml` workflow on every PR: `typecheck`, `lint`, `format:check`, `test`, `build` (Node 22)
- [x] Make Pages deploy and Dependabot auto-merge depend on the quality job, not build alone
- [x] Pin Node 22: `.nvmrc`, `package.json#engines`, CI `node-version`
- [x] Batch minor/patch dependency updates for the main app; 0 `npm audit` vulnerabilities (postcss override pending Next 16)
- [ ] Maintainer action: enable branch protection on `main` requiring the CI checks

## Phase 2 — Stability fixes (known bugs)

Consult the pinned Phaser 3.90 docs (scene lifecycle, events, time) before each change.
Each bullet is one small PR unless trivially related.

- [x] `GameScene.ts:231` — replace raw `setTimeout` with a pause-aware, scene-owned timer cleaned up on shutdown
- [x] `HUD.js` — remove keyboard listeners on shutdown; guard `JSON.parse(localStorage.getItem(...))`
- [x] Introduce a typed, error-handled save/storage service wrapping all `localStorage` access (`HUD.js`, `Save.tsx`, `System.tsx`, `LoadScene.ts`) — with unit tests
- [x] `Resource.ts` — add cleanup; unsubscribe RxJS subscriptions on shutdown
- [x] `Gem.js`, `Trap.js`, `Spell.ts` — unregister event listeners on destroy/shutdown
- [x] `PhaserGame.tsx` — remove the `setTimeout(createGame, 100)` boot race (arcade `debug` kept on per maintainer decision)
- [x] Document the resulting lifecycle conventions in `CLAUDE.md` (every entity cleans up on `SHUTDOWN`)

## Phase 3 — TypeScript completion (done)

- [x] Convert trivial JS loot classes: `Fine.js`, `Rare.js`, `Legendary.js`, `Gem.js` (#324; re-enabled gem loot)
- [x] Convert UI entities: `HUD.js`, `CombatText.js`, `StatusEffects.js`, `Banes.js`, `Boons.js` (#327)
- [x] Convert `Weapons/AreaEffect.js`, `Weapons/Trap.js`, `helpers/spawnStyle.js` (#326)
- [x] Convert `lib/cache.js` (typed field policies) (#325)
- [x] Replace scene-augmentation casts with an explicit typed scene interface (`GameSceneLike`, `src/types/scene.ts`) (#330)
- [x] Eliminate `any` across entities/spells/UI; add `@typescript-eslint` `no-explicit-any` (#331)
- [x] Tighten `tsconfig`: enable `strictPropertyInitialization` (#332). `noUncheckedIndexedAccess` evaluated and deferred — see backlog (#333)
- [x] Gate: 0 JS files in `src/`, `any` count = 0 (≤ 5 target met)

## Phase 4 — Test buildout (done)

- [x] Unit: Apollo cache field policies (`color`, `adjusted`, `formatted`, `abbreviation`) (#335) — note: become moot when Apollo is removed in Phase 8
- [x] Unit: `Item.ts` stat allocation/generation; `ui/operations/helpers.ts`; config factories (#337)
- [x] Unit (Phaser mocks): `Resource` regen/adjust flow; `Spell` cooldown/resource checks (#336)
- [x] Component (Testing Library): Inventory/Equipment drag-drop, Save slots, Armory loading/error states (#338; "merchant unavailable" state test deferred until that graceful-unset state is implemented)
- [x] Coverage: enable V8 coverage in Vitest, add ratcheting threshold to CI (#340; floor at the current high-water mark, ratchet upward toward ~80% non-Phaser)
- [x] Playwright: smoke pack on PR (game boots, character select, save/load roundtrip; wave-start deferred — canvas-only readout) + nightly full suite via scheduled workflow (#339)

## Phase 5 — Vite migration (issue TBD)

Next.js is unused as a framework here (static export, no SSR, no API routes, no image
optimisation). Removing it eliminates framework overhead, browser-compatibility webpack
hacks, and the pending Next 16 upgrade. Do this after Phase 4 so the test suite validates
the build switch, and before Phase 6 so Vercel gets a clean Vite static deploy.

Prerequisite (split out as its own PR, agreed 2026-06-17): the UI used `styled-jsx`
(`<style jsx>`) in 30 components — a Next.js-coupled feature with no automatic transform
under Vite + `@vitejs/plugin-react@6` (Rolldown/oxc dropped the `babel` option). Rather
than add a Babel toolchain, `styled-jsx` was removed in favour of **CSS Modules** (Vite
native, zero new deps): static rules in `*.module.css`, per-render values passed as CSS
custom properties via inline `style`, shared `pixel_*` mixins ported to `themes.module.css`.
Done on the current Next.js build first so visual parity is validated against a known-good
stack; the Vite switch below then carries no styling risk.

- [x] Remove `styled-jsx` → CSS Modules across all 30 UI components (prerequisite PR, #343)
- [x] Add `vite.config.ts`: carry over path aliases from `tsconfig.json` (incl. the `@components` multi-dir resolver shared with `vitest.config.ts`); set `base` from `VITE_BASE_URL` env var (empty for Vercel, `/phasercraft/` for GitHub Pages during transition). Node-builtin stubs proved unnecessary — no browser code imports `fs`/`path`/`crypto`; the one CJS `require("number-to-words")` in `Player.ts` was converted to an ESM import (the only build-time fix needed)
- [x] Add `index.html` entry point; move page title/meta out of Next.js Metadata API into plain `<meta>` tags
- [x] Replace `next/font/google` (VT323) with a `<link>` tag in `index.html`
- [x] Replace `next/dynamic({ ssr: false })` with `React.lazy()` + `Suspense` (Phaser is now its own lazy chunk)
- [x] Remove `'use client'` directives (meaningless in a static build)
- [x] Remove `src/app/` App Router scaffolding; flatten to a single `src/main.tsx` entry
- [x] Rename `NEXT_PUBLIC_GRAPHQL_URL` → `VITE_GRAPHQL_URL` (Apollo Client now reads `import.meta.env.VITE_GRAPHQL_URL`; only the ROADMAP referenced the old name — no CI secret used it)
- [x] Replace `eslint-config-next` with `eslint-plugin-react` + `eslint-plugin-react-hooks`; rewrite `eslint.config.mjs` (flat config) keeping the Phase 3 `no-explicit-any` ban
- [x] Update `dev`, `build` scripts in `package.json` to use the Vite CLI (`typecheck` stays `tsc --noEmit`); `static.yml` now sets `VITE_BASE_URL=/phasercraft/` instead of `DEPLOY=production`
- [x] Gate: all CI checks pass (`typecheck`, `lint`, `format:check`, `test`, `build`); app boots and plays identically

## Phase 6 — Vercel deployment (issue TBD)

Static deploy to Vercel replacing GitHub Pages. Vercel auto-detects Vite projects with
no adapter or framework config required. Do this after Phase 5 so the deploy is a clean
Vite static build.

The repo-side config is captured as code in `vercel.json` and documented in
`docs/vercel-deployment.md`; the remaining items are Vercel-dashboard actions only the
maintainer can do (account access).

- [ ] **(maintainer)** Connect the GitHub repo to Vercel. Framework (`vite`), build command (`npm run build`) and output dir (`dist`) are pinned in `vercel.json`, so no dashboard overrides are needed.
- [ ] **(maintainer)** Add `VITE_GRAPHQL_URL` env var in the Vercel dashboard — may be left **unset in Production** until Phase 7 (no public gateway yet → graceful "merchant unavailable"); set it once a reachable gateway exists.
- [ ] **(maintainer)** Confirm production URL (`phasercraft.vercel.app`) is live and the game plays correctly
- [ ] GitHub Pages workflow and `VITE_BASE_URL` transition shim stay in place during this phase; retire in the next PR once Vercel production is confirmed stable

## Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)

Stand up the new armory on Vercel **alongside** the legacy AWS one. Nothing old is
touched in this phase; the existing `services/armory/` and `server/` gateway keep
running. See the 2026-06-21 decisions update above.

### PR1 — Legacy contract baseline (pre-step) ✅ this PR

Characterise the legacy armory response shape so we have a verified yardstick before
building the replacement.

- [x] Shared structural contract `test/contract/armoryContract.ts` (dependency-free; mandatory/optional fields + types, strict on unexpected fields)
- [x] Recorded fixtures from the live legacy endpoint (`GET /items`, `GET /items/{id}`, `POST /items`, `DELETE /items/{id}`, `POST /createStore`); `POST /clearStore` documented from source (plain-text body, never called live — it is destructive)
- [x] CI-safe contract test validating the fixtures + validator self-checks; opt-in **read-only** live check gated on `ARMORY_LIVE_URL`
- [x] `vitest.config.ts` discovers `test/**` suites

### PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)

- [ ] Port `generateItem.ts` + constants into `api/armory/_lib/` (no logic changes)
- [ ] KV adapter: in-memory implementation for tests/local, Vercel KV (Redis hash, field = `id`, value = JSON) in production
- [ ] `api/armory/items/index.ts` (GET all; POST create one) and `api/armory/items/[id].ts` (GET by id; DELETE)
- [ ] `api/armory/store/create.ts` (POST — batch-generate N) and `api/armory/store/clear.ts` (POST — clear)
- [ ] Vitest unit tests for `generateItem` and every handler (in-memory KV); **contract parity test** asserting each handler satisfies `test/contract/armoryContract.ts`
- [ ] Standalone harness proving generate → store → retrieve → delete locally (no live infra)
- [ ] **(maintainer)** Create the Vercel KV store and bind it to the project
- [ ] Gate: standalone CRUD + restock verified; contract parity green; legacy armory untouched; CI passes

## Phase 8 — Frontend → REST, then teardown (issue TBD)

### PR3 — Swap the frontend to the REST API (gate: merchant UI identical)

The gateway stays deployed-but-unused so this step is reversible. (Apollo deps,
`src/lib/cache.ts`, the GraphQL operations, and `server/` are left in place for PR4.)

- [x] Replace `useQuery`/`useMutation`/`ApolloProvider` with `fetch()` calls to `/api/armory/*` — `src/lib/armoryClient.ts` (typed REST client) + `src/ui/hooks/useArmory.ts` (data hook); `ApolloProvider` removed from `main.tsx`
- [x] Move sort + stat filter client-side into plain TS (`Armory.tsx`); port the `color` derived field into `armoryClient.ts`. `adjusted`/`formatted`/`abbreviation` were **unused by the merchant UI** (a parallel impl lives in the Phaser loot entity; `formatted` was even reading a nonexistent `converted` field → `NaN`), so they are dropped rather than ported
- [x] Add `VITE_ARMORY_URL` (`vite-env.d.ts`); unset or a failed fetch → graceful "merchant unavailable" state
- [x] Component tests for Armory against the fetch client (mock `fetch`): loading / loaded / unavailable
- [ ] Gate: merchant UI buys/restocks/sorts/filters identically end-to-end (maintainer verify); local `typecheck`/`lint`/`test`/`build` green. Note: restock = `POST /store/clear` then `POST /store/create` (no single restock endpoint), mirroring the old `restockStore` resolver

### PR4 — Teardown (gate: only after PR2 + PR3 verified)

Split into two PRs (agreed 2026-06-22) for smaller, more reversible reviews:
PR4a removes the now-dead frontend Apollo/GraphQL code (safe — the live merchant
already runs on `fetch()` since PR3); PR4b removes the backend infra once the
merchant is verified end-to-end on Vercel.

PR4a — frontend Apollo/GraphQL removal:

- [x] Remove `@apollo/client` (and its transitive `graphql`), `src/lib/cache.ts` and its Phase-4 cache tests, the GraphQL operations (`src/ui/operations/{queries,mutations}/*`), and the `MockedProvider` wrapper from the test harness; drop the dead `VITE_GRAPHQL_URL` env type

PR4b — backend teardown:

- [x] Delete the `server/` gateway entirely (and its CI `server` job)
- [x] Retire `services/armory/` + `serverless.yml` (and its CI `armory` job); remove the `gateway`/`service:armory` npm scripts and the stale `server`/`services` tsconfig+vitest excludes; update `docs/vercel-deployment.md` (`VITE_GRAPHQL_URL` step → `VITE_ARMORY_URL`) and `CLAUDE.md`/`README.md` architecture notes
- [x] Gate: no Apollo/GraphQL references remain; AWS references only survive as historical provenance in the recorded contract fixtures (`test/contract/*`), which are kept intentionally to guard the new API's response shape; merchant verified end-to-end on Vercel; CI passes
- [ ] **(maintainer)** Delete any AWS secrets (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.) from repo/Actions settings — none are referenced by any workflow, so this is cleanup only
- [ ] **(maintainer)** Update branch-protection required checks on `main` to drop `server` and `armory` (now removed); keep `quality`

## Phase 9 — Major upgrades (one PR each, in order)

- [x] TypeScript 6
- [x] ESLint 10
- [x] React 19.2.x, react-tooltip 6, lint-staged 17, remaining majors

## Phase 10 — Phaser 4 migration (last, issue #312)

- [ ] Read the official migration guide and v3→v4 migration skill before starting
- [ ] Migrate; validate via full unit/component/E2E suite and manual play-through
- [ ] Update `CLAUDE.md` pinned docs version and lifecycle notes

## Phase 11 — PWA installability & offline play (issue TBD)

Make Phasercraft installable on Android and iPhone, launching full-screen in
landscape and behaving like a native app, with full offline play and silent
updates on refresh. Single focused PR.

- [ ] Add `vite-plugin-pwa` (Workbox): web manifest (`display: fullscreen`,
      `orientation: landscape`, relative `start_url`/`scope` so both deploy bases
      resolve) + service worker precaching the app shell and all game assets
      (~4 MB) for full offline play; armory API left `NetworkOnly` (keeps its
      existing graceful-unavailable state) — `vite.config.ts`
- [ ] `registerType: 'autoUpdate'` (skipWaiting + clientsClaim): a new build
      silently takes over on the next refresh, no prompt UI. Cache-Control headers
      on `sw.js`/manifest/`index.html` in `vercel.json` so updates are detected
- [ ] Self-host the VT323 pixel font (vendored woff2 under `src/styles/`) so text
      renders offline; drop the Google Fonts `<link>`s from `index.html`
- [ ] PWA + iOS meta tags and placeholder app icons (192/512/maskable +
      apple-touch-icon) generated from existing art via
      `scripts/generate-pwa-icons.mjs` — swap for real Phasercraft art later
- [ ] Fix Phaser canvas sizing for standalone/landscape: `Scale.RESIZE` +
      `innerWidth/innerHeight` (replacing `outerWidth/outerHeight` + the
      `fullscreen` flag, which mis-measured a standalone PWA) + safe-area / `100dvh`
      CSS — `src/PhaserGame.tsx`, `src/styles/globals.css`
- [ ] Verify: Lighthouse "Installable"; offline boot/play; build A→B refresh picks
      up the new build; Android "Add to Home Screen" full-screen; iOS Share-sheet
      install (manual; Safari does not enforce the orientation lock)
- [ ] **(follow-up)** iOS apple splash screens (device-specific; deferred from this
      PR) and real square app icons

### Decisions update (2026-06-23) — PWA installability (Phase 11)

| Topic      | Decision                                                                                                                                                                                                               |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Offline    | Full offline play — Workbox precaches the shell + all game assets (~4 MB). First install costs that download on mobile data (accepted). The armory/merchant API stays `NetworkOnly` and keeps its graceful fallback.   |
| Updates    | Silent auto-update on refresh (`autoUpdate` + skipWaiting + clientsClaim); no update-prompt UI. A tab held open across a deploy keeps old JS until a full reload.                                                      |
| Install/UI | `display: fullscreen`, `orientation: landscape`, both Android + iPhone. iOS installs manually via the Share sheet (no `beforeinstallprompt`), ignores the orientation lock, and uses apple-meta tags; splash deferred. |
| Canvas     | Approved runtime change: `Scale.RESIZE` + `innerWidth/innerHeight` replaces `outerWidth/outerHeight` + `fullscreen` so a standalone landscape install fills the screen. Scenes still read full-window pixel coords.    |
| Font       | VT323 self-hosted (vendored woff2) — removes the Google Fonts runtime dependency so offline text renders.                                                                                                              |
| Icons      | Placeholder icons generated from existing art; real Phasercraft square art is a follow-up.                                                                                                                             |

## Deferred / backlog

- **Retire GitHub Pages**: remove the `gh-pages` deploy workflow and `VITE_BASE_URL` transition shim once Vercel production is confirmed stable (follow-up to Phase 6).
- Coverage ratchet toward 80%+ on non-Phaser code
- Enable `noUncheckedIndexedAccess` (deferred from Phase 3; 29 sites needing deliberate guard/fallback decisions) (#333)
- Lifecycle cleanup for `AreaEffect` overlap colliders and `StatusEffects`/`Banes` timers (pre-existing leaks surfaced during Phase 3) (#328)
