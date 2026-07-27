# Graph Report - phasercraft  (2026-07-27)

## Corpus Check
- 240 files · ~359,267 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1556 nodes · 3107 edges · 126 communities (74 shown, 52 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 24 edges (avg confidence: 0.65)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `75d11523`
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
- PhaserGame.tsx
- Enemy.ts
- devDependencies
- armoryClient.ts
- Enemy
- react
- ItemTooltip.tsx
- StoredItem
- items/index.ts
- SnareTrap
- ComponentsGrid.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- BiomeScene.ts
- Save.tsx
- renderWithProviders.tsx
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
- biomes.ts
- operations/helpers.ts
- ProjectileTarget
- UI.tsx
- UI
- StatusEffects
- .prettierrc.json
- e2e/helpers.ts
- SiphonSoul
- Crafting.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Armory API (`/api/armory`)
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- PlayerStats
- Gem
- StatBar.tsx
- vercel.json
- Vercel deployment (Phase 6)
- Invocation
- Enrage
- PowerInfusion
- qa-review.md
- log.js
- vite-env.d.ts
- Frostbolt
- vitest.config.ts
- eslint.config.mjs
- playwright.config.ts
- vitest.setup.ts
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource.ts
- graphify reference: query, path, explain
- ManaShield
- HudUnderTest
- TargetReticle
- exclude
- Smite
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- CasterLike
- CastingController.ts
- gameReducer.ts
- keywords
- prettier
- lint-staged
- Player.ts
- eslint-plugin-react-hooks
- @components/*
- lib
- tsconfig.json
- lodash
- eslint-config-prettier
- eslint-plugin-react
- gh-pages
- jsdom
- lint-staged
- @playwright/test
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
- react-dnd
- react-tooltip
- @reduxjs/toolkit

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 72 edges
2. `Player` - 66 edges
3. `Spell` - 56 edges
4. `react` - 50 edges
5. `phaser` - 40 edges
6. `SpellOptions` - 36 edges
7. `Resource` - 29 edges
8. `CastingController` - 29 edges
9. `LootItem` - 25 edges
10. `TownScene` - 23 edges

## Surprising Connections (you probably didn't know these)
- `LootListDrag()` --indirect_call--> `icon()`  [INFERRED]
  src/ui/components/molecules/LootListDrag.tsx → scripts/generate-pwa-icons.mjs
- `Header()` --calls--> `toggleUi`  [INFERRED]
  src/ui/components/organisms/Header.tsx → src/store/gameReducer.ts
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts
- `SystemProps` --references--> `RootState`  [EXTRACTED]
  src/ui/components/templates/System.tsx → src/store/index.ts

## Import Cycles
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Fireball.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Frostbolt.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Smite.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SnareTrap.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (126 total, 52 thin omitted)

### Community 0 - "Player"
Cohesion: 0.08
Nodes (6): MonsterConfig, Player, AssignResource(), Faith, addXP, setLevel

### Community 1 - "Frostbolt.ts"
Cohesion: 0.30
Nodes (6): Boon, EnrageValue, FrostboltValue, InvocationValue, PowerInfusionValue, EffectValue

### Community 3 - "Item"
Cohesion: 0.09
Nodes (15): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+7 more)

### Community 4 - "TownScene"
Cohesion: 0.07
Nodes (8): BiomeId, Consecration, EarthShield, AreaEffect, GameSceneConfig, TownScene, setCurrentArea, ArcadeCollisionObject

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (31): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+23 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "targetVector"
Cohesion: 0.24
Nodes (5): Multishot, clone(), targetVector(), TargetWithBody, VectorResult

### Community 8 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (25): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+17 more)

### Community 9 - "Enemy.ts"
Cohesion: 0.11
Nodes (18): phaser, CirclingConfig, EnemyStates, HitParams, MoveOptions, CoinConfig, GemConfig, classes (+10 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 12 - "Enemy"
Cohesion: 0.05
Nodes (14): AssignType, classes, Boss, Enemy, EnemyStats, Healer, Melee, Monster (+6 more)

### Community 13 - "react"
Cohesion: 0.14
Nodes (22): react, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, LootIcon() (+14 more)

### Community 14 - "ItemTooltip.tsx"
Cohesion: 0.24
Nodes (6): Equipment, LootStat, Price(), PriceProps, ItemTooltipProps, MenuContext

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "SnareTrap"
Cohesion: 0.12
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.20
Nodes (10): ComponentsGrid(), ComponentsGridProps, GearGrid(), PaginationControls(), PaginationControlsProps, GridDims, MeasuredPageSize, Pagination (+2 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (11): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.07
Nodes (28): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Decisions update (2026-07-27) — Biomes, Deferred / backlog, Phase 0 — Baseline (done, PR #305) (+20 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "BiomeScene.ts"
Cohesion: 0.23
Nodes (8): AssignClass, PlayerType, LabelledContainer, styles, MapStateOptions, mapStateToData(), state$, toggleHUD

### Community 24 - "Save.tsx"
Cohesion: 0.15
Nodes (17): readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave(), setSaveSlot (+9 more)

### Community 25 - "renderWithProviders.tsx"
Cohesion: 0.14
Nodes (15): gameReducer, GameState, loadGame, RootState, ComponentStack, helm, stacks, sampleItems (+7 more)

### Community 26 - "Resource"
Cohesion: 0.06
Nodes (8): Health, Rage, Resource, ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest, Shield, ResourceStats

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
Cohesion: 0.08
Nodes (27): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+19 more)

### Community 34 - "BiomeScene"
Cohesion: 0.09
Nodes (10): BiomeDefinition, promoteToBoss(), ALL, BiomeScene, FakeTimer, SceneUnderTest, setBossActive, setEnemiesRemaining (+2 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "biomes.ts"
Cohesion: 0.21
Nodes (11): BIOME_IDS, BIOMES, isBiomeId(), setTravelTo, Button(), ButtonProps, Header(), HeaderConfig (+3 more)

### Community 37 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 39 - "UI.tsx"
Cohesion: 0.11
Nodes (18): container, PhaserGame, Title(), TitleProps, CustomDragLayer(), getItemStyles(), Offset, Arcanum() (+10 more)

### Community 41 - "StatusEffects"
Cohesion: 0.21
Nodes (4): Banes, IndexableStats, StatusEffect, StatusEffects

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 45 - "Crafting.ts"
Cohesion: 0.31
Nodes (3): Crafting, CraftingConfig, getRandomVelocity()

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
Nodes (5): BG, icon(), ICON_DIR, root, SOURCE

### Community 52 - "PlayerStats"
Cohesion: 0.08
Nodes (16): PlayerStats, AttributeProps, StatProps, Attributes(), AttributesProps, AttributesStyles, HealthProps, HealthStats (+8 more)

### Community 53 - "Gem"
Cohesion: 0.12
Nodes (4): Coin, Gem, GemUnderTest, addCoins

### Community 54 - "StatBar.tsx"
Cohesion: 0.53
Nodes (3): getResourceColour(), StatBar(), StatBarProps

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.20
Nodes (3): CastBar, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource.ts"
Cohesion: 0.13
Nodes (15): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, HealthOptions, Mana, ManaOptions (+7 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

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

### Community 89 - "CastingController.ts"
Cohesion: 0.33
Nodes (5): ActiveCast, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 90 - "gameReducer.ts"
Cohesion: 0.12
Nodes (23): PlayerName, addComponent, addLoot, buyLoot, initState, Level, selectCharacter, sellComponent (+15 more)

### Community 91 - "keywords"
Cohesion: 0.29
Nodes (5): keywords, phaser3, typescript, vite, COMPONENT_DIRS

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Player.ts"
Cohesion: 0.08
Nodes (13): Hero, HeroConfig, Destination, DrawBarOptions, AssignSpell, Boons, CastBarStart, Weapon (+5 more)

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
- **403 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+398 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `phaser` connect `Enemy.ts` to `Player`, `game.ts`, `Frostbolt.ts`, `PhaserGame.tsx`, `CastBar`, `Resource.ts`, `Crafting.ts`, `TargetReticle`, `Spell.test.ts`, `SnareTrap`, `CastingController`, `BiomeScene.ts`, `CastingController.ts`, `keywords`, `Player.ts`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `Enemy.ts`, `react`, `package.json`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `biomes.ts`, `UI.tsx`, `PhaserGame.tsx`, `armoryClient.ts`, `ItemTooltip.tsx`, `ComponentsGrid.tsx`, `PlayerStats`, `StatBar.tsx`, `Save.tsx`, `renderWithProviders.tsx`, `gameReducer.ts`, `keywords`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _403 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.08367071524966262 - nodes in this community are weakly interconnected._
- **Should `Item` be split into smaller, more focused modules?**
  _Cohesion score 0.0858974358974359 - nodes in this community are weakly interconnected._
- **Should `TownScene` be split into smaller, more focused modules?**
  _Cohesion score 0.07272727272727272 - nodes in this community are weakly interconnected._