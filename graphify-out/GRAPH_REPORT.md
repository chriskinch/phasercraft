# Graph Report - phasercraft  (2026-07-30)

## Corpus Check
- 245 files · ~390,590 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1605 nodes · 3238 edges · 134 communities (74 shown, 60 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e55d3d1b`
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
- Header.tsx
- AssignSpell.ts
- devDependencies
- armoryClient.ts
- Player.ts
- LootItem
- CastableSpell
- StoredItem
- items/index.ts
- SnareTrap.ts
- ComponentsGrid.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- TownScene.ts
- HUD.ts
- store/index.ts
- Resource
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- paths
- dependencies
- game.ts
- BiomeScene
- classes.ts
- Hero
- PhaserGame.tsx
- Projectile.ts
- UI.tsx
- UI
- Boons.ts
- .prettierrc.json
- e2e/helpers.ts
- SceneUnderTest
- BiomeScene.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Armory API (`/api/armory`)
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- react
- Enemy.ts
- StatBar.tsx
- vercel.json
- Vercel deployment (Phase 6)
- operations/helpers.ts
- SiphonSoul
- CastingController.test.ts
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
- Resource.ts
- graphify reference: query, path, explain
- ControllerUnderTest
- Resource.test.ts
- TargetReticle.test.ts
- exclude
- CombatText.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- Invocation
- CastingController.ts
- gameReducer.ts
- keywords
- HUD.test.ts
- Gem
- lint-staged
- Bug-Fix Agent — Instructions
- eslint-plugin-react-hooks
- @components/*
- prettier
- Shield
- lib
- tsconfig.json
- PlayerUnderTest
- lodash
- eslint-config-prettier
- eslint-plugin-react
- gh-pages
- jsdom
- lint-staged
- @playwright/test
- TargetReticle
- react-dnd-test-backend
- serve
- BiomeScene.test.ts
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
- SpellCheckUnderTest
- Weapon
- sharp

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 72 edges
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
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts
- `UI()` --indirect_call--> `Armory()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Armory.tsx
- `UI()` --indirect_call--> `Equipment()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Equipment.tsx
- `UI()` --indirect_call--> `MainMenu()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/MainMenu.tsx

## Import Cycles
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Occultist.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/UI/Boons.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/index.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`

## Communities (134 total, 60 thin omitted)

### Community 0 - "Player"
Cohesion: 0.10
Nodes (6): MonsterConfig, Player, AssignResource(), addXP, setLevel, SpellProjectileConfig

### Community 1 - "Frostbolt.ts"
Cohesion: 0.12
Nodes (8): Boon, Enrage, EnrageValue, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue, EffectValue

### Community 2 - "Spell"
Cohesion: 0.13
Nodes (3): MoveOptions, Spell, TargetType

### Community 3 - "Item"
Cohesion: 0.07
Nodes (23): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+15 more)

### Community 4 - "TownScene"
Cohesion: 0.08
Nodes (6): Consecration, EarthShield, AreaEffect, TownScene, setCurrentArea, ArcadeCollisionObject

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (30): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+22 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "targetVector"
Cohesion: 0.16
Nodes (6): Multishot, Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 8 - "Header.tsx"
Cohesion: 0.24
Nodes (8): Title(), TitleProps, Navigation(), HeaderConfig, HeaderProps, PixelBackgroundOptions, pixelBackgroundVars(), PixelEmbossOptions

### Community 9 - "AssignSpell.ts"
Cohesion: 0.08
Nodes (9): AssignSpell, classes, Faith, Fireball, Frostbolt, Heal, ManaShield, Smite (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 12 - "Player.ts"
Cohesion: 0.14
Nodes (12): classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions, SCENE_EVENTS (+4 more)

### Community 13 - "LootItem"
Cohesion: 0.12
Nodes (22): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, LootIcon(), LootIconProps (+14 more)

### Community 15 - "StoredItem"
Cohesion: 0.15
Nodes (9): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+1 more)

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "SnareTrap.ts"
Cohesion: 0.13
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.20
Nodes (10): ComponentsGrid(), ComponentsGridProps, GearGrid(), PaginationControls(), PaginationControlsProps, GridDims, MeasuredPageSize, Pagination (+2 more)

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
Cohesion: 0.21
Nodes (9): PlayerName, BiomeId, BIOMES, DEFAULT_BIOME, GameSceneConfig, SceneUnderTest, clearTravelRequest, toggleHUD (+1 more)

### Community 24 - "HUD.ts"
Cohesion: 0.16
Nodes (20): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+12 more)

### Community 25 - "store/index.ts"
Cohesion: 0.18
Nodes (14): gameReducer, GameState, RootState, ComponentStack, helm, stacks, sampleItems, initialGame (+6 more)

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
Cohesion: 0.09
Nodes (22): EnemyStats, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, CombatType, ComponentDef, ComponentType (+14 more)

### Community 34 - "BiomeScene"
Cohesion: 0.20
Nodes (5): BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (25): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+17 more)

### Community 38 - "Projectile.ts"
Cohesion: 0.25
Nodes (4): Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 39 - "UI.tsx"
Cohesion: 0.12
Nodes (18): container, PhaserGame, BIOME_IDS, requestTravel, setPlayerPosition, toggleUi, Header(), CustomDragLayer() (+10 more)

### Community 41 - "Boons.ts"
Cohesion: 0.18
Nodes (7): Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 45 - "BiomeScene.ts"
Cohesion: 0.18
Nodes (9): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), AssignClass, PlayerType, MapStateOptions, mapStateToData() (+1 more)

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

### Community 52 - "react"
Cohesion: 0.08
Nodes (25): react, Equipment, PlayerStats, Attribute(), AttributeProps, Price(), PriceProps, Stat() (+17 more)

### Community 53 - "Enemy.ts"
Cohesion: 0.11
Nodes (16): phaser, CirclingConfig, EnemyStates, HitParams, Coin, CoinConfig, Crafting, CraftingConfig (+8 more)

### Community 54 - "StatBar.tsx"
Cohesion: 0.33
Nodes (5): getResourceColour(), StatBar(), StatBarProps, HUD(), Level

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 59 - "CastingController.test.ts"
Cohesion: 0.22
Nodes (6): makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 63 - "Enemy"
Cohesion: 0.06
Nodes (11): AssignType, classes, Boss, Enemy, Healer, Melee, Monster, Ranged (+3 more)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.18
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource.ts"
Cohesion: 0.12
Nodes (16): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, Health, HealthOptions, Mana (+8 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "Resource.test.ts"
Cohesion: 0.15
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 80 - "exclude"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

### Community 82 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 83 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 84 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 89 - "CastingController.ts"
Cohesion: 0.20
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, TargetKind

### Community 90 - "gameReducer.ts"
Cohesion: 0.11
Nodes (22): addComponent, buyLoot, initState, Level, selectCharacter, sellComponent, sellComponentStack, sellLoot (+14 more)

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

## Knowledge Gaps
- **410 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+405 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `phaser` connect `Enemy.ts` to `Player`, `Frostbolt.ts`, `Weapon`, `Player.ts`, `SnareTrap.ts`, `TownScene.ts`, `HUD.ts`, `game.ts`, `Hero`, `PhaserGame.tsx`, `Projectile.ts`, `BiomeScene.ts`, `Spell.test.ts`, `CastingController.test.ts`, `CastBar`, `Resource.ts`, `TargetReticle.test.ts`, `CombatText.ts`, `CastingController.ts`, `keywords`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `react`, `Enemy.ts`, `package.json`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `PhaserGame.tsx`, `UI.tsx`, `Header.tsx`, `armoryClient.ts`, `LootItem`, `ComponentsGrid.tsx`, `StatBar.tsx`, `HUD.ts`, `store/index.ts`, `gameReducer.ts`, `keywords`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _410 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.09982174688057041 - nodes in this community are weakly interconnected._
- **Should `Frostbolt.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12318840579710146 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.12698412698412698 - nodes in this community are weakly interconnected._