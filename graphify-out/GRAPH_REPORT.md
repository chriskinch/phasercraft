# Graph Report - phasercraft  (2026-07-31)

## Corpus Check
- 245 files · ~392,171 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1610 nodes · 3266 edges · 127 communities (76 shown, 51 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a5c3ad72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Frostbolt.ts
- Spell
- Item
- TownScene
- generateItem.ts
- compilerOptions
- targetVector
- SnareTrap.ts
- AssignSpell.ts
- devDependencies
- ItemTooltip.tsx
- AssignClass.ts
- react
- armoryClient.ts
- StoredItem
- items/index.ts
- statConversion.ts
- StatBar.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- TownScene.ts
- HUD.ts
- store/index.ts
- PhaserGame.tsx
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- paths
- dependencies
- game.ts
- BiomeScene.ts
- classes.ts
- Hero
- settingsStorage.ts
- phaser
- UI.tsx
- Armory.tsx
- Boons.ts
- .prettierrc.json
- e2e/helpers.ts
- SceneUnderTest
- Stats.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Armory API (`/api/armory`)
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- PlayerStats
- Enemy.ts
- SpellCheckUnderTest
- vercel.json
- Vercel deployment (Phase 6)
- operations/helpers.ts
- SiphonSoul
- SceneUnderTest
- qa-review.md
- log.js
- vite-env.d.ts
- Enemy
- vitest.config.ts
- eslint.config.mjs
- playwright.config.ts
- vitest.setup.ts
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource
- graphify reference: query, path, explain
- Faith
- eslint
- exclude
- Item.test.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- gameReducer.ts
- keywords
- HudUnderTest
- lint-staged
- Bug-Fix Agent — Instructions
- eslint-plugin-react-hooks
- @components/*
- prettier
- lib
- tsconfig.json
- PlayerUnderTest
- lodash
- eslint-plugin-react
- gh-pages
- jsdom
- lint-staged
- @playwright/test
- TargetReticle
- react-dnd-test-backend
- serve
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
- react-dnd
- react-tooltip
- @reduxjs/toolkit
- LootTable
- Player.ts
- sharp

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 73 edges
2. `Player` - 67 edges
3. `Spell` - 56 edges
4. `react` - 51 edges
5. `phaser` - 40 edges
6. `SpellOptions` - 36 edges
7. `Resource` - 29 edges
8. `CastingController` - 29 edges
9. `BiomeScene` - 25 edges
10. `LootItem` - 25 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `PhaserGame()` --calls--> `readSettings()`  [EXTRACTED]
  src/PhaserGame.tsx → src/services/settingsStorage.ts
- `UI()` --indirect_call--> `Armory()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Armory.tsx
- `UI()` --indirect_call--> `Equipment()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Equipment.tsx
- `UI()` --indirect_call--> `MainMenu()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/MainMenu.tsx

## Import Cycles
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Occultist.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Occultist.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Spells/CastingController.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/UI/Boons.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/index.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`

## Communities (127 total, 51 thin omitted)

### Community 1 - "Frostbolt.ts"
Cohesion: 0.08
Nodes (10): Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+2 more)

### Community 2 - "Spell"
Cohesion: 0.12
Nodes (4): MoveOptions, Fireball, Spell, TargetType

### Community 3 - "Item"
Cohesion: 0.14
Nodes (7): Common, Epic, Fine, Item, Legendary, LootItem, Rare

### Community 4 - "TownScene"
Cohesion: 0.08
Nodes (5): Consecration, EarthShield, AreaEffect, TownScene, ArcadeCollisionObject

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (30): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+22 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "targetVector"
Cohesion: 0.16
Nodes (6): Multishot, Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 8 - "SnareTrap.ts"
Cohesion: 0.13
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 9 - "AssignSpell.ts"
Cohesion: 0.10
Nodes (7): AssignSpell, classes, Frostbolt, Heal, ManaShield, Smite, SpellOptions

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint-config-prettier, devDependencies, eslint-config-prettier, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "ItemTooltip.tsx"
Cohesion: 0.32
Nodes (5): statPolarity(), Price(), PriceProps, ItemTooltip(), MenuContext

### Community 12 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 13 - "react"
Cohesion: 0.08
Nodes (36): react, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, LootIcon() (+28 more)

### Community 14 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 15 - "StoredItem"
Cohesion: 0.15
Nodes (9): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+1 more)

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "statConversion.ts"
Cohesion: 0.20
Nodes (12): AdjustedStat, ItemConfig, StatInfo, StatIterator, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION (+4 more)

### Community 18 - "StatBar.tsx"
Cohesion: 0.33
Nodes (5): getResourceColour(), StatBar(), StatBarProps, HUD(), Level

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (11): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.08
Nodes (23): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Deferred / backlog, Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312) (+15 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "TownScene.ts"
Cohesion: 0.19
Nodes (10): BIOME_IDS, BiomeId, BIOMES, DEFAULT_BIOME, resolveBiome(), FakeTimer, GameSceneConfig, clearTravelRequest (+2 more)

### Community 24 - "HUD.ts"
Cohesion: 0.15
Nodes (19): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+11 more)

### Community 25 - "store/index.ts"
Cohesion: 0.17
Nodes (14): gameReducer, GameState, loadGame, RootState, ComponentStack, helm, stacks, initialGame (+6 more)

### Community 26 - "PhaserGame.tsx"
Cohesion: 0.08
Nodes (12): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+4 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.16
Nodes (11): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+3 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+10 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "paths"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 32 - "dependencies"
Cohesion: 0.08
Nodes (25): fantasy-content-generator, ioredis, number-to-words, dependencies, fantasy-content-generator, ioredis, number-to-words, phaser (+17 more)

### Community 33 - "game.ts"
Cohesion: 0.10
Nodes (20): EnemyStats, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, ComponentDef, EnemyAttributes, EnemyConfig (+12 more)

### Community 34 - "BiomeScene.ts"
Cohesion: 0.08
Nodes (17): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), AssignClass, PlayerType, UI, MapStateOptions (+9 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "settingsStorage.ts"
Cohesion: 0.17
Nodes (14): DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), InstallBanner(), rowStyle (+6 more)

### Community 38 - "phaser"
Cohesion: 0.11
Nodes (16): phaser, ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, SpellValue (+8 more)

### Community 39 - "UI.tsx"
Cohesion: 0.10
Nodes (25): container, PhaserGame, requestTravel, switchUi, toggleUi, Button(), ButtonProps, Title() (+17 more)

### Community 40 - "Armory.tsx"
Cohesion: 0.33
Nodes (6): buyLoot, toggleFilter, Stock(), Armory(), SortKey, sampleItems

### Community 41 - "Boons.ts"
Cohesion: 0.18
Nodes (7): Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 45 - "Stats.tsx"
Cohesion: 0.20
Nodes (8): Stat(), StatProps, HealthProps, HealthStats, StatItem, Stats(), StatsProps, StatsStyles

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 49 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate-pwa-icons.mjs"
Cohesion: 0.33
Nodes (4): BG, ICON_DIR, root, SOURCE

### Community 52 - "PlayerStats"
Cohesion: 0.18
Nodes (12): formatStatValue(), PlayerStats, Attribute(), AttributeProps, Attributes(), AttributesProps, AttributesStyles, GroupedAttributesProps (+4 more)

### Community 53 - "Enemy.ts"
Cohesion: 0.08
Nodes (14): CirclingConfig, EnemyStates, HitParams, Coin, CoinConfig, Crafting, CraftingConfig, Gem (+6 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 63 - "Enemy"
Cohesion: 0.06
Nodes (11): AssignType, classes, Boss, Enemy, Healer, Melee, Monster, MonsterConfig (+3 more)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.18
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource"
Cohesion: 0.05
Nodes (21): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+13 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 80 - "exclude"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

### Community 81 - "Item.test.ts"
Cohesion: 0.40
Nodes (3): baseConfig, randomMock, sampleMock

### Community 82 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 83 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 84 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 90 - "gameReducer.ts"
Cohesion: 0.14
Nodes (20): PlayerName, addComponent, addXP, initState, Level, sellComponent, sellComponentStack, sellLoot (+12 more)

### Community 91 - "keywords"
Cohesion: 0.29
Nodes (5): keywords, phaser3, typescript, vite, COMPONENT_DIRS

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 100 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 101 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 110 - "TargetReticle"
Cohesion: 0.12
Nodes (3): TargetReticle, GraphicsStub, ReticleUnderTest

### Community 132 - "Player.ts"
Cohesion: 0.17
Nodes (7): Destination, DrawBarOptions, AssignResourceType, Weapon, WeaponConfig, CombatType, SpellProjectileConfig

## Knowledge Gaps
- **410 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+405 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `phaser` connect `phaser` to `Frostbolt.ts`, `BiomeScene.ts`, `game.ts`, `Hero`, `Player.ts`, `SnareTrap.ts`, `CastBar`, `Resource`, `AssignClass.ts`, `TargetReticle`, `Spell.test.ts`, `CastingController`, `Enemy.ts`, `TownScene.ts`, `HUD.ts`, `PhaserGame.tsx`, `keywords`, `Enemy`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `phaser`, `react`, `package.json`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `gameReducer.ts`, `settingsStorage.ts`, `UI.tsx`, `Armory.tsx`, `ItemTooltip.tsx`, `Stats.tsx`, `armoryClient.ts`, `StatBar.tsx`, `PlayerStats`, `TownScene.ts`, `HUD.ts`, `store/index.ts`, `PhaserGame.tsx`, `keywords`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _410 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._
- **Should `Frostbolt.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07777777777777778 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.11612903225806452 - nodes in this community are weakly interconnected._