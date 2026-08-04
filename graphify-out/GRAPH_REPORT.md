# Graph Report - phasercraft  (2026-08-04)

## Corpus Check
- 255 files · ~397,980 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1667 nodes · 3433 edges · 135 communities (83 shown, 52 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 26 edges (avg confidence: 0.66)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1067739f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- Spell
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- Multishot.ts
- settingsStorage.ts
- Invocation.ts
- devDependencies
- react
- AssignClass.ts
- LootItem
- armoryClient.ts
- StoredItem
- items/index.ts
- Trap.ts
- ComponentsGrid.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- TownScene.ts
- HUD.ts
- store/index.ts
- operations/helpers.ts
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
- TownScene.test.ts
- UI.tsx
- UI
- Player.ts
- .prettierrc.json
- e2e/helpers.ts
- biomes.ts
- Enemy.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Armory API (`/api/armory`)
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- PlayerStats
- BiomeScene.ts
- Header.tsx
- vercel.json
- Vercel deployment (Phase 6)
- Projectile.ts
- SiphonSoul
- Consecration
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
- EarthShield
- Button.tsx
- TargetReticle
- exclude
- SnareTrap
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- CastingController.ts
- gameReducer.ts
- keywords
- HudUnderTest
- SceneUnderTest
- lint-staged
- Bug-Fix Agent — Instructions
- eslint-plugin-react-hooks
- @components/*
- prettier
- StatBar.tsx
- lib
- tsconfig.json
- PlayerUnderTest
- lodash
- System.tsx
- eslint-plugin-react
- gh-pages
- jsdom
- lint-staged
- @playwright/test
- react-dnd-test-backend
- serve
- Faith
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
- sharp
- Item
- Item.ts
- eslint-config-prettier

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 73 edges
2. `Player` - 67 edges
3. `react` - 57 edges
4. `Spell` - 56 edges
5. `phaser` - 41 edges
6. `SpellOptions` - 36 edges
7. `Resource` - 29 edges
8. `CastingController` - 29 edges
9. `LootItem` - 27 edges
10. `BiomeScene` - 25 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `PhaserGame()` --calls--> `readSettings()`  [EXTRACTED]
  src/PhaserGame.tsx → src/services/settingsStorage.ts
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts
- `GroupedStats()` --calls--> `formatStatValue()`  [EXTRACTED]
  src/ui/components/organisms/GroupedStats.tsx → src/lib/statConversion.ts
- `Header()` --calls--> `toggleUi`  [INFERRED]
  src/ui/components/organisms/Header.tsx → src/store/gameReducer.ts

## Import Cycles
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Spells/CastingController.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SnareTrap.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Fireball.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Frostbolt.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (135 total, 52 thin omitted)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.09
Nodes (12): MoveOptions, AssignSpell, classes, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield (+4 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.15
Nodes (6): Common, Epic, Fine, Legendary, LootItem, LootTable

### Community 4 - "TownScene"
Cohesion: 0.17
Nodes (4): TownScene, clearTravelRequest, setPlayerPosition, toggleHUD

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (30): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+22 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "Multishot.ts"
Cohesion: 0.15
Nodes (7): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 8 - "settingsStorage.ts"
Cohesion: 0.17
Nodes (14): DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), InstallBanner(), rowStyle (+6 more)

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (16): Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion, PowerInfusionValue (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "react"
Cohesion: 0.10
Nodes (21): react, LootIcon(), LootIconProps, LootIconStyles, Slot(), SlotComponentProps, SlotProps, Stat() (+13 more)

### Community 12 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 13 - "LootItem"
Cohesion: 0.18
Nodes (15): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, Loot(), LootProps (+7 more)

### Community 14 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 15 - "StoredItem"
Cohesion: 0.15
Nodes (9): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+1 more)

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "Trap.ts"
Cohesion: 0.15
Nodes (7): AreaEffect, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions, ArcadeCollisionObject

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.17
Nodes (13): ComponentStack, ComponentsGrid(), ComponentsGridProps, stacks, GearGrid(), GearShopGrid(), PaginationControls(), PaginationControlsProps (+5 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (10): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.06
Nodes (32): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Decisions update (2026-07-30) — Town shops, Deferred / backlog, Later — presentation (+24 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "TownScene.ts"
Cohesion: 0.23
Nodes (7): AssignClass, PlayerType, MapStateOptions, mapStateToData(), state$, BiomeId, GameSceneConfig

### Community 24 - "HUD.ts"
Cohesion: 0.21
Nodes (15): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+7 more)

### Community 25 - "store/index.ts"
Cohesion: 0.18
Nodes (12): gameReducer, GameState, RootState, helm, sampleItems, initialGame, seed(), seedParts() (+4 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

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
Cohesion: 0.07
Nodes (34): MerchantState, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_DEFS, COMPONENT_TYPES (+26 more)

### Community 34 - "BiomeScene"
Cohesion: 0.21
Nodes (4): BiomeDefinition, BiomeScene, setCurrentArea, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "PhaserGame.tsx"
Cohesion: 0.08
Nodes (12): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+4 more)

### Community 38 - "TownScene.test.ts"
Cohesion: 0.18
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 39 - "UI.tsx"
Cohesion: 0.16
Nodes (11): container, PhaserGame, Alchemist(), Arcanum(), Armory(), Blacksmith(), CharacterSelect(), asMenuComponent() (+3 more)

### Community 40 - "UI"
Cohesion: 0.24
Nodes (3): UI, addLoot, toggleUi

### Community 41 - "Player.ts"
Cohesion: 0.08
Nodes (22): HeroConfig, Destination, DrawBarOptions, AssignResource(), AssignResourceName, AssignResourceType, classes, Energy (+14 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 44 - "biomes.ts"
Cohesion: 0.28
Nodes (6): BIOME_IDS, BIOMES, DEFAULT_BIOME, resolveBiome(), FakeTimer, BiomeSelect()

### Community 45 - "Enemy.ts"
Cohesion: 0.09
Nodes (16): phaser, CirclingConfig, EnemyStates, HitParams, Coin, CoinConfig, Crafting, CraftingConfig (+8 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 48 - "Spell.test.ts"
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
Nodes (4): BG, ICON_DIR, root, SOURCE

### Community 52 - "PlayerStats"
Cohesion: 0.16
Nodes (12): PlayerStats, Attribute(), AttributeProps, Attributes(), AttributesProps, AttributesStyles, GroupedAttributes(), GroupedAttributesProps (+4 more)

### Community 53 - "BiomeScene.ts"
Cohesion: 0.20
Nodes (9): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), EnemyStats, setBossActive, setEnemiesRemaining, EnemyAttributes (+1 more)

### Community 54 - "Header.tsx"
Cohesion: 0.31
Nodes (7): Title(), TitleProps, Navigation(), Header(), HeaderConfig, HeaderProps, pixelBackgroundVars()

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile.ts"
Cohesion: 0.25
Nodes (4): Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 63 - "Enemy"
Cohesion: 0.06
Nodes (12): AssignType, classes, Boss, Enemy, Healer, Melee, Monster, MonsterConfig (+4 more)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.20
Nodes (3): CastBar, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource"
Cohesion: 0.06
Nodes (8): Health, Rage, Resource, ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest, Shield, ResourceStats

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "Button.tsx"
Cohesion: 0.24
Nodes (9): PlayerName, requestTravel, selectCharacter, setCoins, Button(), ButtonProps, CharacterCard(), CharacterCardProps (+1 more)

### Community 79 - "TargetReticle"
Cohesion: 0.12
Nodes (3): TargetReticle, GraphicsStub, ReticleUnderTest

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

### Community 88 - "ItemTooltip.tsx"
Cohesion: 0.20
Nodes (13): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+5 more)

### Community 89 - "CastingController.ts"
Cohesion: 0.18
Nodes (8): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, CombatType, TargetKind

### Community 90 - "gameReducer.ts"
Cohesion: 0.12
Nodes (26): addComponent, addXP, buyComponent, buyGear, buyLoot, freshMerchant(), initState, Level (+18 more)

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

### Community 99 - "StatBar.tsx"
Cohesion: 0.33
Nodes (5): getResourceColour(), StatBar(), StatBarProps, HUD(), Level

### Community 100 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 101 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 104 - "System.tsx"
Cohesion: 0.42
Nodes (5): Dialog(), DIALOG_ROOT_ID, DialogProps, getDialogRoot(), System()

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

## Knowledge Gaps
- **421 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+416 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `phaser` connect `Enemy.ts` to `AssignSpell.ts`, `game.ts`, `PhaserGame.tsx`, `TownScene.test.ts`, `Player.ts`, `CastBar`, `Invocation.ts`, `AssignClass.ts`, `TargetReticle`, `Spell.test.ts`, `Trap.ts`, `CastingController`, `BiomeScene.ts`, `TownScene.ts`, `HUD.ts`, `CastingController.ts`, `keywords`, `Projectile.ts`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `react`, `Enemy.ts`, `package.json`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `game.ts`, `StatBar.tsx`, `PhaserGame.tsx`, `UI.tsx`, `settingsStorage.ts`, `System.tsx`, `biomes.ts`, `LootItem`, `Button.tsx`, `armoryClient.ts`, `ComponentsGrid.tsx`, `PlayerStats`, `Header.tsx`, `ItemTooltip.tsx`, `store/index.ts`, `gameReducer.ts`, `keywords`, `HUD.ts`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _421 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09024390243902439 - nodes in this community are weakly interconnected._
- **Should `generateItem.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10252100840336134 - nodes in this community are weakly interconnected._