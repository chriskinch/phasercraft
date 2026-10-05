# CLAUDE.md — Working agreement and project conventions

Phasercraft is a browser action RPG: Phaser 4 game canvas + React/Redux UI overlay,
built with Vite (static export to Vercel, with GitHub Pages in parallel during the
transition). The armory item service runs as Vercel Functions (`api/armory/`) backed
by Vercel KV (Redis); the frontend talks to it directly over a typed `fetch` REST
client.

The phased improvement plan and decisions log live in `docs/ROADMAP.md`. Read it
before starting work; link PRs to the relevant phase issue.

## Versions and docs

- **Phaser 4.2** (migrated from 3.90 in Phase 10). Before changing anything that
  touches scenes, timers, events, physics, or game objects, consult the official docs
  at https://docs.phaser.io — do not code Phaser APIs from memory. For v3→v4 migration
  reference: https://github.com/phaserjs/phaser/blob/master/changelog/v4/4.0/MIGRATION-GUIDE.md
- **Node 22 LTS** for local dev and CI (`.nvmrc`); the Vercel Functions run on the
  Node runtime Vercel provides.
- Main app: Vite (static export, `dist/`), React 19, Redux Toolkit, Vitest + Testing
  Library, Playwright (Phase 4+). Armory data flows through a typed `fetch` REST client
  to `api/armory/*` (no GraphQL/Apollo).

## Commands

- `npm run dev` — dev server on :8080 · `npm run armory:smoke` — local armory CRUD smoke
- `npm run typecheck` · `npm run lint` · `npm test` · `npm run format:check`
- `npm run build` — static export (CI runs all five)
- `npm run perf` — perf harness: `VITE_PERF=1` build + Playwright frame-time matrix → `perf-results/`;
  `npm run perf:compare -- base.json head.json` (#526). Report only; CI runs it on the `perf` PR label + nightly
- `npm run perf:equivalence` — seeded fixed-step replays vs `perf/goldens/equivalence.json` (#527). Perf
  stories must pass unchanged; `PERF_EQUIVALENCE=update` only for intended gameplay changes

## Reply style

- Extremely concise; sacrifice grammar for concision.
- No preamble, recaps, restating the question, selling the work, or unactionable info.
- Lead with what the maintainer must do or decide. Questions last, on their own line.
- Mirrored by an inline `UserPromptSubmit` hook in `.claude/settings.json` (the
  `concise-replies` plugin doesn't sync in the web container — same as #449).

## Workflow rules

- **Branch names** follow Conventional Commits types in kebab-case:
  `<type>/<short-description>` — e.g. `feat/player-shield`, `fix/loot-cleanup`,
  `chore/update-deps`, `docs/roadmap-phase-3`. Keep the description to 2–4 words.
  Valid types: `feat`, `fix`, `refactor`, `test`, `chore`, `docs`, `perf`, `ci`.
- **Small, focused PRs**: one concern per PR, from a feature branch. The maintainer
  reviews and merges every PR — never merge or push to `main` directly.
- **Open PRs without asking when you're confident** nothing needs the maintainer's
  input: routine mechanical work may go straight to a PR. This does not relax the next
  bullet — behavior/balance/save-format/public-API changes still require asking first.
- **Open agent-authored PRs as ready for review by default**, not as drafts. Use draft
  status only when the maintainer explicitly requests it; set `draft: false` when the
  PR tool/API otherwise defaults to drafts.
- **Ask on behavior, decide on mechanics.** Anything that changes runtime behavior,
  game balance, save-data format, or public APIs: stop and ask the maintainer first.
  Pure mechanics (naming, file layout, test structure, type modeling): decide,
  document the choice in the PR description.
- If existing code looks like a bug, preserve behavior and flag it — don't silently
  "fix" gameplay.
- Every PR: `typecheck`, `lint`, `test`, and `build` must pass locally before push.
  PR descriptions: bare minimum — what changed, risk, test evidence, one line each
  where possible. No narrative, no recap of the diff. PR comments and replies: same,
  one or two lines.
- Agent teams: use parallel read-only subagents for exploration, audits, and review;
  keep a single writer per branch/PR to avoid conflicting edits.
- **QA gate (agent-authored PRs only):** after pushing a branch and opening a PR, every
  agent must run `/qa-review <pr-number>` (the slash command defined in
  `.claude/commands/qa-review.md`) before the PR is considered ready for the
  maintainer. The QA agent operates with minimal context — its scope contract (the
  linked issue, or a `Scope:` section in the PR body when there is no issue) plus the
  PR's source changes, with generated artifacts (`graphify-out/`, lockfiles, `dist/`)
  excluded. Because agent PRs are authored under the maintainer's own account, GitHub
  forbids a formal APPROVE/REQUEST_CHANGES on them, so the gate posts its verdict as a
  `COMMENT`-event review whose body starts `[QA] PR #N reviewed…` and carries an
  explicit `Verdict: APPROVE` or `Verdict: REQUEST_CHANGES`. If the verdict is
  REQUEST_CHANGES: address every finding, push fixes, then invoke `/qa-review` again.
  Only request maintainer review after the QA verdict is APPROVE. Do not pass the QA
  agent conversation history or broader codebase context — this keeps it honest and
  scope-focused.
- **Watch every PR you open (agent-authored PRs only):** the moment you open a PR,
  subscribe to its activity (`subscribe_pr_activity`) and keep monitoring it for review
  comments and CI status until it is merged or closed. Address actionable review/CI
  events as they arrive (fix when confident and small; ask the maintainer when
  ambiguous or architecturally significant). This is an action only the agent can take,
  so it cannot be a settings hook.
- **Never use time-based polling.** No `while true` + `sleep` loops, no repeating
  timers, no scheduled wake-ups to re-check state — not for PR activity, CI, deploys,
  background jobs, or anything else. Wait only on event-driven subscriptions
  (`subscribe_pr_activity`) or on a single command that blocks until its condition is
  true and then exits. If neither is available, do not improvise a poll loop: report the
  current state once, hand it back, and say what you would need to watch it properly.
- Dependency majors are individual PRs, never bundled with feature work.

## Code conventions

- TypeScript everywhere in `src/` (Phase 3 removes the last JS files). No new `any` —
  type the seam properly or ask. No `@ts-ignore`/`@ts-expect-error` without a comment
  explaining why and an issue reference.
- **Lifecycle discipline (the historical source of bugs here):** every Phaser entity
  that registers event listeners, timers, store subscriptions, or physics colliders
  must release them when it goes away. Conventions established in Phase 2:
    - **Give the entity a `cleanup()` method** that releases everything it registered, and
      make it **idempotent** — the destroy and shutdown paths below can both fire for the
      same entity.
    - **Wire `cleanup()` to the right lifecycle event.** For entities destroyed during play
      (loot, traps, projectiles), register it on the object's own destroy event:
      `this.once(GameObjects.Events.DESTROY, this.cleanup, this)`. Phaser does **not**
      destroy GameObjects on scene `SHUTDOWN` (a shut-down scene may reactivate), so
      entities that outlive a wave/run must _also_ be cleaned on `SHUTDOWN` — either
      self-subscribe (`scene.events.once(Scenes.Events.SHUTDOWN, this.cleanup, this)`) or
      have the owner propagate it: `Player.cleanup()` calls `health/resource/shield.cleanup()`,
      and a scene's `shutdown()` calls `player.cleanup()` / `UI.cleanup()`.
    - **Only _external_ listeners need manual removal.** `destroy()` emits `DESTROY` then
      calls `removeAllListeners()`, so an entity's own `this.on(...)` listeners are cleaned
      automatically; listeners added to _other_ emitters (`scene.events`,
      `scene.input.keyboard`, `player.resource`, a `button`) are not — `off()` them in
      `cleanup()` with the same `(event, fn, context)` you registered.
    - **Timers:** use `scene.time` (pause-aware) instead of raw `setTimeout`/`setInterval`;
      store the `TimerEvent` and `.remove()` it in `cleanup()`.
    - **Store subscriptions:** `mapStateToData` (RxJS) returns an unsubscribe function —
      store it and call it in `cleanup()`.
    - **Physics colliders:** store the `Collider` returned by `scene.physics.add.collider(...)`
      and `scene.physics.world.removeCollider(...)` it in `cleanup()` (stale colliders are
      guarded no-ops in Arcade but accumulate within a run).
    - Mock entities at this seam in tests: build a constructor-free fake with
      `Object.create(Entity.prototype)`, stub the emitters/timers, and assert `cleanup()`
      releases them (see the HUD/Resource/Spell lifecycle tests).
- **New ability = define its level scaling.** Part of the spec for adding any ability:
  list its scalable aspects in `SPELL_ASPECTS` (wire non-`power` ones in the spell's
  `applyLevel()`) and give it a `scaling` entry in `SPELL_DEFS` (`src/types/game.ts`) —
  which aspects scale with level (L1–L3) and by what curve. `scaling` is required and a
  test fails if it is empty. The curve per aspect is a balance call: ask the maintainer.
- **New ability = define its Arcanum recipe.** Also give it a `SPELL_RECIPES` entry
  (`src/types/game.ts`): components, coins and its one mandatory special item. A test
  fails if any spell lacks one. Values are a balance call: ask the maintainer.
- All `localStorage` access goes through the typed save/storage service (Phase 2);
  never call `JSON.parse(localStorage.getItem(...))` directly.
- Redux is the single source of truth for game state shared with the React UI; the
  Phaser side reads it via `mapStateToData` (RxJS) and writes via dispatched actions.
- UI components follow atomic design (`atoms/molecules/organisms/templates`); path
  aliases (`@entities/...`, `@store`, etc.) are defined in `tsconfig.json` and
  `vitest.config.ts` — keep them in sync.
- Tests live next to the code (`foo.test.ts`), Vitest globals enabled. Prefer testing
  pure logic; mock Phaser objects at the entity seam, not deep engine internals.

## graphify (codebase knowledge graph)

Agents use a local knowledge graph at `graphify-out/graph.json` (+
`GRAPH_REPORT.md`) built by [Graphify](https://github.com/safishamsi/graphify) —
community structure, hub nodes, and cross-file relationships for the whole codebase.
The `graphify` skill lives in `.claude/skills/graphify/` and self-installs the CLI
(`uv tool install graphifyy`) if it's missing.

Rules:

- For orientation questions (architecture, "what calls X", "how do A and B relate"),
  query the graph before grepping or reading whole files: `graphify query "<question>"`,
  `graphify path "<A>" "<B>"`, `graphify explain "<concept>"`. These return a scoped
  subgraph, usually far smaller than raw grep/read output. Grepping for exact strings
  you already intend to edit is fine.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when
  query/path/explain don't surface enough context.
- `graphify-out/` is gitignored and **never committed** (Graphify's default; committing
  it put thousands of generated lines in every PR diff). If `graph.json` is missing or
  stale, run `graphify update .` (AST-only, fast, no API cost) before querying.
- Optional: `graphify hook install` once per clone rebuilds the graph on commit and
  branch switch; run `graphify update .` after `git pull`.
