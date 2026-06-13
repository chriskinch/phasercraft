# CLAUDE.md — Working agreement and project conventions

Phasercraft is a browser action RPG: Phaser 3 game canvas + React/Redux UI overlay,
built with Next.js (static export to GitHub Pages), with a local-dev GraphQL gateway
(`server/`) proxying to an AWS Lambda item service (`services/armory/`).

The phased improvement plan and decisions log live in `docs/ROADMAP.md`. Read it
before starting work; link PRs to the relevant phase issue.

## Versions and docs

- **Phaser 3.90** (pinned until the Phase 7 migration). Before changing anything that
  touches scenes, timers, events, physics, or game objects, consult the official docs
  for this version at https://docs.phaser.io — do not code Phaser APIs from memory.
  For the eventual v4 migration use the official guide and skill:
  https://github.com/phaserjs/phaser/blob/master/changelog/v4/4.0/MIGRATION-GUIDE.md
- **Node 22 LTS** for local dev and CI (`.nvmrc`). Lambda runtime is governed by
  Serverless v3 validation (see ROADMAP decisions log).
- Main app: Next 15 (static export, `dist/`), React 19, Redux Toolkit, Apollo Client,
  Vitest + Testing Library, Playwright (Phase 4+).

## Commands

- `npm run dev` — dev server on :8080 · `npm run gateway` — GraphQL gateway on :4000
- `npm run typecheck` · `npm run lint` · `npm test` · `npm run format:check`
- `npm run build` — static export (CI runs all five)

## Workflow rules

- **Small, focused PRs**: one concern per PR, from a feature branch. The maintainer
  reviews and merges every PR — never merge or push to `main` directly.
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
  that registers event listeners, timers, or store subscriptions must clean them up
  on scene `SHUTDOWN`/destroy. Use `scene.time` (pause-aware) instead of raw
  `setTimeout`/`setInterval`. RxJS/Redux subscriptions (`mapStateToData`) return an
  unsubscribe function — store it and call it in cleanup.
- All `localStorage` access goes through the typed save/storage service (Phase 2);
  never call `JSON.parse(localStorage.getItem(...))` directly.
- Redux is the single source of truth for game state shared with the React UI; the
  Phaser side reads it via `mapStateToData` (RxJS) and writes via dispatched actions.
- UI components follow atomic design (`atoms/molecules/organisms/templates`); path
  aliases (`@entities/...`, `@store`, etc.) are defined in `tsconfig.json` and
  `vitest.config.ts` — keep them in sync.
- Tests live next to the code (`foo.test.ts`), Vitest globals enabled. Prefer testing
  pure logic; mock Phaser objects at the entity seam, not deep engine internals.
