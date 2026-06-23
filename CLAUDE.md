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
- **Ask on behavior, decide on mechanics.** Anything that changes runtime behavior,
  game balance, save-data format, or public APIs: stop and ask the maintainer first.
  Pure mechanics (naming, file layout, test structure, type modeling): decide,
  document the choice in the PR description.
- If existing code looks like a bug, preserve behavior and flag it — don't silently
  "fix" gameplay.
- Every PR: `typecheck`, `lint`, `test`, and `build` must pass locally before push.
  PR descriptions include risk notes and test evidence.
- Agent teams: use parallel read-only subagents for exploration, audits, and review;
  keep a single writer per branch/PR to avoid conflicting edits.
- **QA gate (agent-authored PRs only):** after pushing a branch and opening a PR, every
  agent must run `/qa-review <pr-number>` before the PR is considered ready for the
  maintainer. The QA agent operates with minimal context (linked issue + diff only) and
  posts a formal GitHub APPROVE or REQUEST_CHANGES review. If REQUEST_CHANGES: address
  every comment, push fixes, then invoke `/qa-review` again. Only request maintainer
  review after QA posts APPROVE. Do not pass the QA agent conversation history or
  broader codebase context — this keeps it honest and scope-focused.
- **Watch every PR you open (agent-authored PRs only):** the moment you open a PR,
  subscribe to its activity (`subscribe_pr_activity`) and keep monitoring it for review
  comments and CI status until it is merged or closed. Address actionable review/CI
  events as they arrive (fix when confident and small; ask the maintainer when
  ambiguous or architecturally significant). This is an action only the agent can take,
  so it cannot be a settings hook.
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
- All `localStorage` access goes through the typed save/storage service (Phase 2);
  never call `JSON.parse(localStorage.getItem(...))` directly.
- Redux is the single source of truth for game state shared with the React UI; the
  Phaser side reads it via `mapStateToData` (RxJS) and writes via dispatched actions.
- UI components follow atomic design (`atoms/molecules/organisms/templates`); path
  aliases (`@entities/...`, `@store`, etc.) are defined in `tsconfig.json` and
  `vitest.config.ts` — keep them in sync.
- Tests live next to the code (`foo.test.ts`), Vitest globals enabled. Prefer testing
  pure logic; mock Phaser objects at the entity seam, not deep engine internals.
