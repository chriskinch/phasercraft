# Agentic Readiness Roadmap

Goal: make Phasercraft stable, fully typed, well-tested, and protected by CI so that
agentic feature development can proceed safely. This document is the source of truth
for the phased plan. Each phase has a tracking GitHub issue under the
[Reforge milestone](https://github.com/chriskinch/phasercraft/milestone/10)
(#306–#312); every PR links to its phase issue and checks items off here.

Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Decisions log (agreed 2026-06-11)

| Topic                                   | Decision                                                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (`server/`, `services/armory/`) | Keep and modernize both. Gateway remains a local-dev tool for now; production hosting decided later.                                                                |
| Armory deployment                       | AWS account with CI deploys via GitHub Actions secrets (scoped IAM).                                                                                                |
| Deployment tooling                      | Stay on Serverless Framework v3 for now; migrate to AWS CDK later (separate effort, not in this roadmap).                                                           |
| Phaser                                  | Stabilize and test on 3.90 first. Migrate to Phaser 4 as the final phase, validated by the test suite and the official v3→v4 migration guide/skill.                 |
| Dependencies                            | Minor/patch updates immediately. Major upgrades (Next 16, Apollo Client 4, ESLint 10, TS 6) land as individual PRs after test coverage exists.                      |
| Test strategy                           | Full pyramid: unit + React component tests + Playwright E2E. Smoke E2E on every PR; full E2E nightly.                                                               |
| Coverage                                | Enforced ratcheting threshold in CI (fails on regression below high-water mark; target ~80% on non-Phaser code).                                                    |
| Node                                    | Node 22 LTS for local dev and CI. Lambda runtime: highest version Serverless v3 validates (verify `nodejs22.x`; fall back to `nodejs20.x` until the CDK migration). |
| Prod shop fallback                      | When no GraphQL endpoint is configured (production, until hosting exists), Armory/Stock UI shows a graceful "merchant unavailable" state.                           |
| Workflow                                | Small focused PRs; the maintainer reviews every PR. Agents ask on behavior changes, decide on mechanics. See `CLAUDE.md`.                                           |

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
- [ ] `Gem.js`, `Trap.js`, `Spell.ts` — unregister event listeners on destroy/shutdown
- [ ] `PhaserGame.tsx` — remove the `setTimeout(createGame, 100)` boot race; turn off arcade `debug: true` (behavior-visible: flag in PR)
- [ ] Document the resulting lifecycle conventions in `CLAUDE.md` (every entity cleans up on `SHUTDOWN`)

## Phase 3 — TypeScript completion

- [ ] Convert trivial JS loot classes: `Fine.js`, `Rare.js`, `Legendary.js`, `Gem.js`
- [ ] Convert UI entities: `HUD.js` (after Phase 2 fixes), `CombatText.js`, `StatusEffects.js`, `Banes.js`, `Boons.js`
- [ ] Convert `Weapons/AreaEffect.js`, `Weapons/Trap.js`, `helpers/spawnStyle.js`
- [ ] Convert `lib/cache.js` (typed field policies)
- [ ] Replace scene-augmentation casts (`this.scene as Scene & {...}`) with explicit typed scene interfaces
- [ ] Eliminate `any` across entities/spells/UI (notably `Spell.ts#player`, `CharacterCard.tsx`, TownScene handlers, react-dnd refs); add `@typescript-eslint` with `no-explicit-any`
- [ ] Tighten `tsconfig`: enable `strictPropertyInitialization`, evaluate `noUncheckedIndexedAccess`
- [ ] Gate: 0 JS files in `src/`, `any` count ≤ 5 (documented exceptions only)

## Phase 4 — Test buildout

- [ ] Unit: Apollo cache field policies (`color`, `adjusted`, `formatted`, `abbreviation`)
- [ ] Unit: `Item.ts` stat allocation/generation; `ui/operations/helpers.ts`; config factories
- [ ] Unit (Phaser mocks): `Resource` regen/adjust flow; `Spell` cooldown/resource checks
- [ ] Component (Testing Library): Inventory/Equipment drag-drop, Save slots, Armory loading/error/"unavailable" states
- [ ] Coverage: enable V8 coverage in Vitest, add ratcheting threshold to CI
- [ ] Playwright: smoke pack on PR (game boots, character select, wave starts, save/load roundtrip); full suite nightly via scheduled workflow

## Phase 5 — Backend modernization

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

Frontend integration:

- [ ] Apollo Client URI from `NEXT_PUBLIC_GRAPHQL_URL`; add error link
- [ ] Graceful "merchant unavailable" state when unset (with component tests)
- [ ] Replace blanket `cache.reset()` after mutations with targeted cache updates

## Phase 6 — Major upgrades (one PR each, in order)

- [ ] TypeScript 6
- [ ] ESLint 10 (+ eslint-config-next compatibility)
- [ ] Apollo Client 4
- [ ] Next 16 (verify static export + basePath behavior on Pages)
- [ ] React 19.2.x, react-tooltip 6, lint-staged 17, remaining majors

## Phase 7 — Phaser 4 migration (last)

- [ ] Read the official migration guide and v3→v4 migration skill before starting
- [ ] Migrate; validate via full unit/component/E2E suite and manual play-through
- [ ] Update `CLAUDE.md` pinned docs version and lifecycle notes

## Deferred / backlog

- Gateway production hosting decision (Lambda merge, PaaS, or other)
- AWS CDK migration (replaces Serverless v3; unlocks newest Lambda runtimes)
- Coverage ratchet toward 80%+ on non-Phaser code
