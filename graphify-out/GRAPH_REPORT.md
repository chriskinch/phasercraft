# Graph Report - phasercraft  (2026-07-23)

## Corpus Check
- 226 files · ~348,019 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1503 nodes · 2925 edges · 130 communities (75 shown, 55 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3367550f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Frostbolt.ts
- Spell
- Item
- Consecration
- generateItem.ts
- compilerOptions
- Player.ts
- Gem.ts
- AssignSpell.ts
- devDependencies
- Armory.tsx
- Enemy
- LootItem
- PlayerStats
- StoredItem
- index.ts
- EnemyOptions
- UI.tsx
- System.tsx
- Agentic Readiness Roadmap
- Phasercraft
- game.ts
- gameReducer.ts
- HUD.ts
- index.ts
- AssignResource.ts
- TownScene
- handlers.test.ts
- scripts
- GameScene.ts
- package.json
- dependencies
- Resource
- GameScene
- classes.ts
- Resource.test.ts
- LoadScene.ts
- SceneUnderTest
- Health.ts
- UI
- ItemTooltip.tsx
- .prettierrc.json
- helpers.ts
- Hero
- SnareTrap
- armory-smoke.ts
- tsconfig.json
- Resource.ts
- Armory API (`/api/armory`)
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- Multishot
- Whirlwind
- StatBar.tsx
- vercel.json
- Vercel deployment (Phase 6)
- Shield
- HudUnderTest
- GameOverScene
- qa-review.md
- log.js
- vite-env.d.ts
- vite.config.ts
- vitest.config.ts
- eslint.config.mjs
- playwright.config.ts
- vitest.setup.ts
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- Healer
- Faith
- graphify reference: query, path, explain
- Frostbolt
- ManaShield
- PlayerStats
- Monster
- Smite
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- repository
- Health.ts
- .constructor
- EarthShield
- Consecration
- SnareTrap.ts
- SceneUnderTest
- @components/*
- Shield
- lib
- tsconfig.json
- Rage
- CasterLike
- eslint
- eslint-config-prettier
- eslint-plugin-react-hooks
- gh-pages
- jsdom
- lint-staged
- lodash
- react-dnd
- react-tooltip
- @reduxjs/toolkit
- @playwright/test
- prettier
- react-dnd-test-backend
- serve
- sharp
- simple-git-hooks
- @testing-library/dom
- @testing-library/jest-dom
- @testing-library/react
- @types/lodash
- @types/node
- @types/react
- @types/react-dom
- typescript
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vitejs/plugin-react
- @vitest/coverage-v8
- @vitest/ui

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 72 edges
2. `Player` - 66 edges
3. `Spell` - 56 edges
4. `react` - 45 edges
5. `phaser` - 40 edges
6. `SpellOptions` - 36 edges
7. `Resource` - 29 edges
8. `CastingController` - 29 edges
9. `LootItem` - 25 edges
10. `GameScene` - 24 edges

## Surprising Connections (you probably didn't know these)
- `LootListDrag()` --indirect_call--> `icon()`  [INFERRED]
  src/ui/components/molecules/LootListDrag.tsx → scripts/generate-pwa-icons.mjs
- `Header()` --calls--> `toggleUi`  [INFERRED]
  src/ui/components/organisms/Header.tsx → src/store/gameReducer.ts
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `PhaserGame()` --indirect_call--> `GameScene`  [INFERRED]
  src/PhaserGame.tsx → src/scenes/GameScene.ts
- `PhaserGame()` --indirect_call--> `TownScene`  [INFERRED]
  src/PhaserGame.tsx → src/scenes/TownScene.ts

## Import Cycles
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/UI/Boons.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SnareTrap.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Smite.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`

## Communities (130 total, 55 thin omitted)

### Community 1 - "Frostbolt.ts"
Cohesion: 0.07
Nodes (15): Boon, Enrage, EnrageValue, Invocation, InvocationValue, PowerInfusion, PowerInfusionValue, Banes (+7 more)

### Community 2 - "Spell"
Cohesion: 0.12
Nodes (3): Heal, Spell, TargetType

### Community 3 - "Item"
Cohesion: 0.09
Nodes (15): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+7 more)

### Community 4 - "Consecration"
Cohesion: 0.16
Nodes (4): AreaEffect, TownScene, setPlayerPosition, ArcadeCollisionObject

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (31): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+23 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "Player.ts"
Cohesion: 0.07
Nodes (10): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 8 - "Gem.ts"
Cohesion: 0.09
Nodes (10): Coin, CoinConfig, Crafting, CraftingConfig, Gem, GemConfig, GemUnderTest, getRandomVelocity() (+2 more)

### Community 9 - "AssignSpell.ts"
Cohesion: 0.09
Nodes (20): Destination, DrawBarOptions, ActiveCast, CastingControllerOptions, CastingState, CastTarget, PendingCast, SpellValue (+12 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint-plugin-react, devDependencies, eslint-plugin-react, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "Armory.tsx"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 12 - "Enemy"
Cohesion: 0.07
Nodes (14): CirclingConfig, Enemy, EnemyStates, EnemyStats, HitParams, MoveOptions, Monster, MonsterConfig (+6 more)

### Community 13 - "LootItem"
Cohesion: 0.12
Nodes (26): react, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, LootIcon() (+18 more)

### Community 14 - "PlayerStats"
Cohesion: 0.15
Nodes (10): PlayerStats, AttributeProps, Attributes(), AttributesProps, AttributesStyles, GroupedAttributes(), GroupedAttributesProps, NumericStats (+2 more)

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "EnemyOptions"
Cohesion: 0.19
Nodes (5): TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 18 - "UI.tsx"
Cohesion: 0.11
Nodes (19): container, PhaserGame, switchUi, Title(), TitleProps, Navigation(), Header(), HeaderConfig (+11 more)

### Community 19 - "System.tsx"
Cohesion: 0.13
Nodes (19): DEFAULT_SETTINGS, readSettings(), Settings, StartLocation, writeSettings(), selectCharacter, setCoins, Button() (+11 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.08
Nodes (23): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Deferred / backlog, Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312) (+15 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "game.ts"
Cohesion: 0.10
Nodes (19): OverlapTarget, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, CombatType, EQUIPMENT_SLOTS, GAME_BALANCE (+11 more)

### Community 23 - "gameReducer.ts"
Cohesion: 0.20
Nodes (12): AssignClass, classes, PlayerConfig, PlayerName, PlayerType, TODO: Make the timings smarter, GameSceneConfig, initState (+4 more)

### Community 24 - "HUD.ts"
Cohesion: 0.33
Nodes (5): DrawBarOptions, MapStateOptions, mapStateToData(), state$, ResourceStats

### Community 25 - "index.ts"
Cohesion: 0.17
Nodes (11): gameReducer, GameState, RootState, helm, sampleItems, initialGame, seed(), makeTestStore() (+3 more)

### Community 27 - "TownScene"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.16
Nodes (11): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+3 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+10 more)

### Community 30 - "GameScene.ts"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 32 - "dependencies"
Cohesion: 0.08
Nodes (25): fantasy-content-generator, ioredis, number-to-words, dependencies, fantasy-content-generator, ioredis, number-to-words, phaser (+17 more)

### Community 33 - "Resource"
Cohesion: 0.15
Nodes (7): Cleric, Mage, Occultist, Ranger, Warrior, SpellType, PlayerOptions

### Community 34 - "GameScene"
Cohesion: 0.14
Nodes (4): GameScene, FakeTimer, nextWave, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "Resource.test.ts"
Cohesion: 0.14
Nodes (7): AssignType, classes, Boss, Healer, Melee, Ranged, EnemyOptions

### Community 37 - "LoadScene.ts"
Cohesion: 0.10
Nodes (13): phaser, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene (+5 more)

### Community 39 - "Health.ts"
Cohesion: 0.17
Nodes (15): readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave(), setSaveSlot (+7 more)

### Community 40 - "UI"
Cohesion: 0.19
Nodes (6): LabelledContainer, styles, UI, addLoot, loadGame, toggleUi

### Community 41 - "ItemTooltip.tsx"
Cohesion: 0.10
Nodes (12): Equipment, LootStat, Price(), PriceProps, StatProps, HealthProps, HealthStats, ItemTooltipProps (+4 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "helpers.ts"
Cohesion: 0.39
Nodes (6): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, seedSave()

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 48 - "Resource.ts"
Cohesion: 0.18
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate-pwa-icons.mjs"
Cohesion: 0.33
Nodes (5): BG, icon(), ICON_DIR, root, SOURCE

### Community 52 - "Multishot"
Cohesion: 0.09
Nodes (9): AssignSpell, classes, Fireball, Frostbolt, FrostboltValue, ManaShield, Multishot, Smite (+1 more)

### Community 54 - "StatBar.tsx"
Cohesion: 0.31
Nodes (5): getResourceColour(), StatBar(), StatBarProps, HUD(), Level

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 59 - "GameOverScene"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 60 - "qa-review.md"
Cohesion: 0.50
Nodes (3): Comment style rules, Context restriction (CRITICAL — do not skip), Step-by-step process

### Community 63 - "vite.config.ts"
Cohesion: 0.29
Nodes (5): keywords, phaser3, typescript, vite, COMPONENT_DIRS

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "Healer"
Cohesion: 0.12
Nodes (3): TargetReticle, GraphicsStub, ReticleUnderTest

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Frostbolt"
Cohesion: 0.18
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 78 - "ManaShield"
Cohesion: 0.21
Nodes (9): AssignResourceName, classes, Energy, EnergyOptions, Mana, ManaOptions, RageOptions, ResourceOptions (+1 more)

### Community 79 - "PlayerStats"
Cohesion: 0.24
Nodes (7): buyLoot, sellLoot, toggleFilter, Inventory(), Armory(), SortKey, Equipment()

### Community 80 - "Monster"
Cohesion: 0.15
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 81 - "Smite"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 82 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 83 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 84 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 88 - "repository"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

### Community 89 - "Health.ts"
Cohesion: 0.22
Nodes (4): Health, HealthOptions, CombatText, CombatTextConfig

### Community 90 - ".constructor"
Cohesion: 0.22
Nodes (3): addXP, setBaseStats, setLevel

### Community 95 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 97 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 98 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

## Knowledge Gaps
- **388 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+383 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **55 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `phaser` connect `LoadScene.ts` to `Frostbolt.ts`, `Player.ts`, `Gem.ts`, `AssignSpell.ts`, `UI`, `Healer`, `Enemy`, `Hero`, `Frostbolt`, `SnareTrap`, `Resource.ts`, `EnemyOptions`, `game.ts`, `gameReducer.ts`, `HUD.ts`, `Health.ts`, `vite.config.ts`?**
  _High betweenness centrality (0.159) - this node is a cross-community bridge._
- **Why does `keywords` connect `vite.config.ts` to `LootItem`, `LoadScene.ts`, `package.json`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Player`, `Frostbolt.ts`, `Spell`, `Resource.test.ts`, `AssignSpell.ts`, `Multishot`, `Whirlwind`, `game.ts`, `Shield`, `Consecration`, `SnareTrap.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _388 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frostbolt.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.12183908045977011 - nodes in this community are weakly interconnected._
- **Should `Item` be split into smaller, more focused modules?**
  _Cohesion score 0.0858974358974359 - nodes in this community are weakly interconnected._