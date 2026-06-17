# Agentic Readiness Roadmap

Goal: make Phasercraft stable, fully typed, well-tested, and protected by CI so that
agentic feature development can proceed safely. This document is the source of truth
for the phased plan. Each phase has a tracking GitHub issue under the
[Reforge milestone](https://github.com/chriskinch/phasercraft/milestone/10)
(#306–#312 for original phases; Phases 5 and 6 need new issues); every PR links to its
phase issue and checks items off here.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Decisions log (agreed 2026-06-17)

| Topic                                   | Decision                                                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (`server/`, `services/armory/`) | Keep and modernize both. Gateway remains a local-dev tool for now; production hosting decided later.                                                                |
| Armory deployment                       | AWS account with CI deploys via GitHub Actions secrets (scoped IAM).                                                                                                |
| Deployment tooling                      | Stay on Serverless Framework v3 for now; migrate to AWS CDK later (separate effort, not in this roadmap).                                                           |
| Phaser                                  | Stabilize and test on 3.90 first. Migrate to Phaser 4 as the final phase, validated by the test suite and the official v3→v4 migration guide/skill.                 |
| Dependencies                            | Minor/patch updates immediately. Major upgrades (Apollo Client 4, ESLint 10, TS 6) land as individual PRs after test coverage exists. Next 16 eliminated by Vite migration (Phase 5). |
| Test strategy                           | Full pyramid: unit + React component tests + Playwright E2E. Smoke E2E on every PR; full E2E nightly.                                                               |
| Coverage                                | Enforced ratcheting threshold in CI (fails on regression below high-water mark; target ~80% on non-Phaser code).                                                    |
| Node                                    | Node 22 LTS for local dev and CI. Lambda runtime: highest version Serverless v3 validates (verify `nodejs22.x`; fall back to `nodejs20.x` until the CDK migration). |
| Prod shop fallback                      | When no GraphQL endpoint is configured (production, until hosting exists), Armory/Stock UI shows a graceful "merchant unavailable" state.                           |
| Workflow                                | Small focused PRs; the maintainer reviews every PR. Agents ask on behavior changes, decide on mechanics. See `CLAUDE.md`.                                           |
| Build tooling                           | Replace Next.js with Vite (Phase 5). Next.js is unused as a framework — static export only, no SSR/API routes/image optimisation. Vite removes the framework layer entirely. |
| Hosting                                 | Cloudflare Pages (Phase 6). Free tier, unlimited bandwidth, suits a large-asset game. Production deploys on merge to `main`; preview deploys triggered by the `deploy-preview` PR label. GitHub Pages stays in parallel during transition, retired once Cloudflare production is confirmed. |
| GraphQL layer                           | Direction: remove it. Apollo Client + the `server/` gateway over-complicate the stack for a single data source. A future phase will replace them with direct REST calls to the Armory Lambda. Phase 7 backend work is scoped accordingly — gateway stays local-dev; do not invest in production gateway hosting. |

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

## Phase 4 — Test buildout

- [ ] Unit: Apollo cache field policies (`color`, `adjusted`, `formatted`, `abbreviation`)
- [ ] Unit: `Item.ts` stat allocation/generation; `ui/operations/helpers.ts`; config factories
- [ ] Unit (Phaser mocks): `Resource` regen/adjust flow; `Spell` cooldown/resource checks
- [ ] Component (Testing Library): Inventory/Equipment drag-drop, Save slots, Armory loading/error/"unavailable" states
- [ ] Coverage: enable V8 coverage in Vitest, add ratcheting threshold to CI
- [ ] Playwright: smoke pack on PR (game boots, character select, wave starts, save/load roundtrip); full suite nightly via scheduled workflow

## Phase 5 — Vite migration (issue TBD)

Next.js is unused as a framework here (static export, no SSR, no API routes, no image
optimisation). Removing it eliminates framework overhead, browser-compatibility webpack
hacks, and the pending Next 16 upgrade. Do this after Phase 4 so the test suite validates
the build switch, and before Phase 6 so Cloudflare gets a clean Vite static deploy.

- [ ] Add `vite.config.ts`: carry over path aliases from `tsconfig.json`; add `resolve.alias` stubs for Node built-ins Phaser requires (`fs`, `crypto`, `path` → `false`); set `base` from `VITE_BASE_URL` env var (empty for Cloudflare, `/phasercraft/` for GitHub Pages during transition)
- [ ] Add `index.html` entry point; move page title/meta out of Next.js Metadata API into plain `<meta>` tags
- [ ] Replace `next/font/google` (VT323) with a `<link>` tag in `index.html`
- [ ] Replace `next/dynamic({ ssr: false })` with `React.lazy()` + `Suspense`
- [ ] Remove `'use client'` directives (meaningless in a static build)
- [ ] Remove `src/app/` App Router scaffolding; flatten to a single `src/main.tsx` entry
- [ ] Rename `NEXT_PUBLIC_GRAPHQL_URL` → `VITE_GRAPHQL_URL` everywhere (env var, Apollo Client setup, CI secrets, docs)
- [ ] Replace `eslint-config-next` with `eslint-plugin-react` + `eslint-plugin-react-hooks`; update `.eslintrc`
- [ ] Update `dev`, `build`, `typecheck` scripts in `package.json` to use Vite CLI
- [ ] Gate: all CI checks pass (`typecheck`, `lint`, `format:check`, `test`, `build`); app boots and plays identically

## Phase 6 — Cloudflare Pages (issue TBD)

Static deploy to Cloudflare Pages replacing GitHub Pages. Unlimited bandwidth on the free
tier suits a game with large assets. Do this after Phase 5 so the deploy is a clean
Vite static build with no adapter needed.

- [ ] Connect the GitHub repo to Cloudflare Pages (build command: `npm run build`, output directory: `dist/`)
- [ ] Disable automatic preview deployments in Cloudflare Pages settings (production-only auto-deploy on `main`)
- [ ] Add `VITE_GRAPHQL_URL` env var in the Cloudflare dashboard (production + preview environments)
- [ ] Add GitHub Actions workflow `preview-deploy.yml`: triggers on `pull_request` `labeled` event when label is `deploy-preview`; calls the Cloudflare Pages API to deploy that branch; posts the preview URL as a PR comment
- [ ] Create the `deploy-preview` label in the GitHub repo
- [ ] Confirm production URL (`phasercraft.pages.dev`) is live and the game plays correctly
- [ ] GitHub Pages workflow and `assetPrefix`/`basePath` config stay in place during this phase; retire in the next PR once Cloudflare production is confirmed stable

## Phase 7 — Backend modernization

`services/armory` (89 vulns today, Node 12 runtime):

- [ ] Runtime to Node 20/22 (per Serverless v3 validation), `.babelrc` and `tsconfig` aligned
- [ ] AWS SDK v3 to current; middy to current major; TypeScript 5.x; replace tslint with ESLint
- [ ] Vitest unit tests for handlers and `generateItem`; integration tests via serverless-offline + DynamoDB Local in CI
- [ ] CI deploy workflow (AWS secrets, scoped IAM): deploy on merge to `main` or manual dispatch
- [ ] Clear `yarn audit` highs/critical

`server/` gateway (22 vulns today, stays local-dev):

- [ ] Migrate Apollo Server 3 → 4, graphql 16, JS → TS
- [ ] Replace `apollo-datasource-rest` (EOL) with the Apollo 4 datasource pattern; base URL from env var
- [ ] Tests for resolvers/datasource (mocked REST); remove/replace abandoned `casual`
- [ ] Clear `yarn audit` highs

Frontend integration (may be superseded by GraphQL-removal phase — reassess before starting):

- [ ] Apollo Client URI from `VITE_GRAPHQL_URL`; add error link
- [ ] Graceful "merchant unavailable" state when unset (with component tests)
- [ ] Replace blanket `cache.reset()` after mutations with targeted cache updates

## Phase 8 — Major upgrades (one PR each, in order)

- [ ] TypeScript 6
- [ ] ESLint 10
- [ ] Apollo Client 4 (or superseded by GraphQL-removal phase — revisit when that is scoped)
- [ ] React 19.2.x, react-tooltip 6, lint-staged 17, remaining majors

## Phase 9 — Phaser 4 migration (last, issue #312)

- [ ] Read the official migration guide and v3→v4 migration skill before starting
- [ ] Migrate; validate via full unit/component/E2E suite and manual play-through
- [ ] Update `CLAUDE.md` pinned docs version and lifecycle notes

## Deferred / backlog

- **Remove GraphQL layer**: replace Apollo Client + `server/` gateway with direct REST calls to the Armory Lambda. Scope TBD — needs a design spike (REST shape, error handling, caching strategy). Likely fits between Phase 7 and Phase 8; will affect Phase 8's Apollo Client 4 upgrade (may become moot).
- **Retire GitHub Pages**: remove the `gh-pages` deploy workflow and `VITE_BASE_URL` transition shim once Cloudflare Pages production is confirmed stable (follow-up to Phase 6).
- AWS CDK migration (replaces Serverless v3; unlocks newest Lambda runtimes)
- Coverage ratchet toward 80%+ on non-Phaser code
- Enable `noUncheckedIndexedAccess` (deferred from Phase 3; 29 sites needing deliberate guard/fallback decisions) (#333)
- Lifecycle cleanup for `AreaEffect` overlap colliders and `StatusEffects`/`Banes` timers (pre-existing leaks surfaced during Phase 3) (#328)
