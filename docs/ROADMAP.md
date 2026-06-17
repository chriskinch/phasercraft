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

- [ ] Add `vite.config.ts`: carry over path aliases from `tsconfig.json`; add `resolve.alias` stubs for Node built-ins Phaser requires (`fs`, `crypto`, `path` → `false`); set `base` from `VITE_BASE_URL` env var (empty for Vercel, `/phasercraft/` for GitHub Pages during transition)
- [ ] Add `index.html` entry point; move page title/meta out of Next.js Metadata API into plain `<meta>` tags
- [ ] Replace `next/font/google` (VT323) with a `<link>` tag in `index.html`
- [ ] Replace `next/dynamic({ ssr: false })` with `React.lazy()` + `Suspense`
- [ ] Remove `'use client'` directives (meaningless in a static build)
- [ ] Remove `src/app/` App Router scaffolding; flatten to a single `src/main.tsx` entry
- [ ] Rename `NEXT_PUBLIC_GRAPHQL_URL` → `VITE_GRAPHQL_URL` everywhere (env var, Apollo Client setup, CI secrets, docs)
- [ ] Replace `eslint-config-next` with `eslint-plugin-react` + `eslint-plugin-react-hooks`; update `.eslintrc`
- [ ] Update `dev`, `build`, `typecheck` scripts in `package.json` to use Vite CLI
- [ ] Gate: all CI checks pass (`typecheck`, `lint`, `format:check`, `test`, `build`); app boots and plays identically

## Phase 6 — Vercel deployment (issue TBD)

Static deploy to Vercel replacing GitHub Pages. Vercel auto-detects Vite projects with
no adapter or framework config required. Do this after Phase 5 so the deploy is a clean
Vite static build.

- [ ] Connect the GitHub repo to Vercel (framework: Vite auto-detected; build command: `npm run build`; output directory: `dist/`)
- [ ] Add `VITE_GRAPHQL_URL` env var in the Vercel dashboard (production + preview environments)
- [ ] Configure Vercel's **Ignored Build Step**: add a shell script that exits `0` (skip) for preview environments unless the PR carries the `deploy-preview` label (checked via GitHub API using `VERCEL_GIT_PULL_REQUEST_ID`); exits `1` (build) for production
- [ ] Create the `deploy-preview` label in the GitHub repo
- [ ] Confirm production URL (`phasercraft.vercel.app`) is live and the game plays correctly
- [ ] GitHub Pages workflow and `VITE_BASE_URL` transition shim stay in place during this phase; retire in the next PR once Vercel production is confirmed stable

## Phase 7 — Armory migration to Vercel (issue TBD)

Replace AWS Lambda + DynamoDB with Vercel Functions + Vercel KV. The `server/` gateway
stays in place pointing at the new Vercel endpoint — no frontend changes in this phase.
AWS infrastructure is retired entirely once the new endpoints are confirmed working.

- [ ] Create Vercel KV store in the Vercel dashboard; define item storage as a Redis hash (`items`, field = `id`, value = JSON-stringified item)
- [ ] Add `/api/items/index.ts` (GET all items — `HGETALL`; POST create item — `HSET`)
- [ ] Add `/api/items/[id].ts` (GET item by id — `HGET`; DELETE item — `HDEL`)
- [ ] Add `/api/store/create.ts` (POST — batch-generate N items via `generateItem`, bulk `HSET`)
- [ ] Add `/api/store/clear.ts` (POST — `DEL items` then recreate empty hash)
- [ ] Port `generateItem.ts` and constants/types into shared `api/_lib/` (no logic changes)
- [ ] Add `VITE_ARMORY_URL` env var in Vercel dashboard; update `server/` gateway datasource base URL to use it
- [ ] Vitest unit tests for `generateItem` and each handler (mock `@vercel/kv`)
- [ ] One-time data migration: script to read all items from DynamoDB and write to Vercel KV
- [ ] Retire `services/armory/` directory, `serverless.yml`, and all AWS GitHub Actions secrets
- [ ] Gate: all existing GraphQL operations work through the gateway pointing at Vercel; CI passes

## Phase 8 — Remove GraphQL layer (issue TBD)

Replace Apollo Client + `server/` gateway with direct `fetch()` calls to the Vercel
Functions REST API. The gateway and all GraphQL schema code are deleted.

- [ ] Define TypeScript types for the REST API responses (share or copy from `api/_lib/`)
- [ ] Replace `ApolloProvider` and all `useQuery`/`useMutation` hooks with `fetch()` calls and React state (or a lightweight data-fetching hook)
- [ ] Replace `VITE_GRAPHQL_URL` with `VITE_ARMORY_URL` in the frontend env var and Apollo Client setup
- [ ] Remove `@apollo/client`, `graphql`, and `src/lib/cache.ts` (field policies); remove the Apollo cache field policy tests added in Phase 4 if present
- [ ] Delete `server/` gateway entirely
- [ ] Add component tests for Armory/Stock UI against the new fetch-based client (mock `fetch`)
- [ ] Update "merchant unavailable" graceful state to check `VITE_ARMORY_URL` instead of `VITE_GRAPHQL_URL`
- [ ] Gate: merchant UI works end-to-end; no Apollo or GraphQL imports remain in `src/`

## Phase 9 — Major upgrades (one PR each, in order)

- [ ] TypeScript 6
- [ ] ESLint 10
- [ ] React 19.2.x, react-tooltip 6, lint-staged 17, remaining majors

## Phase 10 — Phaser 4 migration (last, issue #312)

- [ ] Read the official migration guide and v3→v4 migration skill before starting
- [ ] Migrate; validate via full unit/component/E2E suite and manual play-through
- [ ] Update `CLAUDE.md` pinned docs version and lifecycle notes

## Deferred / backlog

- **Retire GitHub Pages**: remove the `gh-pages` deploy workflow and `VITE_BASE_URL` transition shim once Vercel production is confirmed stable (follow-up to Phase 6).
- Coverage ratchet toward 80%+ on non-Phaser code
- Enable `noUncheckedIndexedAccess` (deferred from Phase 3; 29 sites needing deliberate guard/fallback decisions) (#333)
- Lifecycle cleanup for `AreaEffect` overlap colliders and `StatusEffects`/`Banes` timers (pre-existing leaks surfaced during Phase 3) (#328)
