# Graph Report - phasercraft  (2026-07-30)

## Corpus Check
- 245 files · ~391,212 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1607 nodes · 3249 edges · 134 communities (76 shown, 58 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 23 edges (avg confidence: 0.64)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `20c57b3e`
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
- Enemy.ts
- devDependencies
- ItemTooltip.tsx
- AssignClass.ts
- LootItem
- EnemyOptions
- StoredItem
- items/index.ts
- Item.ts
- ComponentsGrid.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- BiomeScene.ts
- HUD.ts
- store/index.ts
- phaser
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
- settingsStorage.ts
- Projectile.ts
- react
- UI
- StatusEffects
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
- Crafting.ts
- Consecration
- vercel.json
- Vercel deployment (Phase 6)
- operations/helpers.ts
- SiphonSoul
- CastBar
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
- CastBar.test.ts
- Resource
- graphify reference: query, path, explain
- Faith.ts
- animations.ts
- ReticleUnderTest
- exclude
- Item.test.ts
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
- HudUnderTest
- CombatType
- lint-staged
- Bug-Fix Agent — Instructions
- eslint-plugin-react-hooks
- @components/*
- prettier
- GameOverScene
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
- BootScene
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
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts
- `ItemTooltip()` --calls--> `appliedStatValue()`  [EXTRACTED]
  src/ui/components/molecules/ItemTooltip.tsx → src/lib/statConversion.ts
- `Header()` --calls--> `toggleUi`  [INFERRED]
  src/ui/components/organisms/Header.tsx → src/store/gameReducer.ts
- `UI()` --indirect_call--> `Armory()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Armory.tsx

## Import Cycles
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Fireball.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Frostbolt.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Smite.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SnareTrap.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (134 total, 58 thin omitted)

### Community 1 - "Frostbolt.ts"
Cohesion: 0.10
Nodes (9): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 3 - "Item"
Cohesion: 0.14
Nodes (7): Common, Epic, Fine, Item, Legendary, LootItem, Rare

### Community 4 - "TownScene"
Cohesion: 0.07
Nodes (9): EarthShield, AreaEffect, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions, TownScene (+1 more)

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
Cohesion: 0.22
Nodes (9): Title(), TitleProps, Navigation(), Header(), HeaderConfig, HeaderProps, PixelBackgroundOptions, pixelBackgroundVars() (+1 more)

### Community 9 - "Enemy.ts"
Cohesion: 0.10
Nodes (17): CirclingConfig, EnemyStates, HitParams, MoveOptions, PlayerType, classes, Fireball, Heal (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "ItemTooltip.tsx"
Cohesion: 0.24
Nodes (7): Equipment, LootStat, Price(), PriceProps, ItemTooltip(), ItemTooltipProps, MenuContext

### Community 12 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 13 - "LootItem"
Cohesion: 0.06
Nodes (43): getResourceColour(), ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem() (+35 more)

### Community 14 - "EnemyOptions"
Cohesion: 0.14
Nodes (7): AssignType, classes, Boss, Healer, Melee, Ranged, EnemyOptions

### Community 15 - "StoredItem"
Cohesion: 0.15
Nodes (9): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+1 more)

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "Item.ts"
Cohesion: 0.22
Nodes (11): AdjustedStat, ItemConfig, StatInfo, StatIterator, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION (+3 more)

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.16
Nodes (12): ComponentStack, ComponentsGrid(), ComponentsGridProps, stacks, GearGrid(), PaginationControls(), PaginationControlsProps, GridDims (+4 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (10): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.08
Nodes (23): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Deferred / backlog, Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312) (+15 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "BiomeScene.ts"
Cohesion: 0.11
Nodes (19): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), AssignClass, MapStateOptions, mapStateToData(), state$ (+11 more)

### Community 24 - "HUD.ts"
Cohesion: 0.20
Nodes (15): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+7 more)

### Community 25 - "store/index.ts"
Cohesion: 0.14
Nodes (18): buyLoot, gameReducer, GameState, loadGame, toggleFilter, RootState, Armory(), SortKey (+10 more)

### Community 26 - "phaser"
Cohesion: 0.26
Nodes (5): phaser, fontConfig, createLogo(), LogoOptions, LoadScene

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
Nodes (22): EnemyStats, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, ComponentDef, EnemyAttributes, EnemyConfig (+14 more)

### Community 34 - "BiomeScene"
Cohesion: 0.18
Nodes (5): BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "settingsStorage.ts"
Cohesion: 0.14
Nodes (15): PhaserGame(), SelectScene, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings() (+7 more)

### Community 38 - "Projectile.ts"
Cohesion: 0.25
Nodes (4): Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 39 - "react"
Cohesion: 0.12
Nodes (22): react, container, PhaserGame, BIOME_IDS, requestTravel, toggleUi, Button(), ButtonProps (+14 more)

### Community 41 - "StatusEffects"
Cohesion: 0.22
Nodes (3): Banes, IndexableStats, StatusEffects

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 45 - "Stats.tsx"
Cohesion: 0.22
Nodes (7): Stat(), StatProps, HealthProps, HealthStats, StatItem, StatsProps, StatsStyles

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
Nodes (11): PlayerStats, Attribute(), AttributeProps, Attributes(), AttributesProps, AttributesStyles, Stats(), GroupedAttributesProps (+3 more)

### Community 53 - "Crafting.ts"
Cohesion: 0.09
Nodes (10): Coin, CoinConfig, Crafting, CraftingConfig, Gem, GemConfig, GemUnderTest, getRandomVelocity() (+2 more)

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
Cohesion: 0.10
Nodes (3): Enemy, Monster, AssignResource()

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar.test.ts"
Cohesion: 0.22
Nodes (3): CastBarStart, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource"
Cohesion: 0.05
Nodes (21): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+13 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "animations.ts"
Cohesion: 0.33
Nodes (4): AnimationConfig, createAnimations(), EnemyConfig, EnemyType

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

### Community 89 - "CastingController.ts"
Cohesion: 0.22
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, TargetKind

### Community 90 - "gameReducer.ts"
Cohesion: 0.12
Nodes (22): PlayerName, Boons, StatusEffect, addComponent, addXP, initState, Level, selectCharacter (+14 more)

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

### Community 132 - "Player.ts"
Cohesion: 0.15
Nodes (8): MonsterConfig, Destination, DrawBarOptions, AssignResourceType, AssignSpell, Weapon, WeaponConfig, SpellProjectileConfig

## Knowledge Gaps
- **409 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+404 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **58 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `phaser` connect `phaser` to `Frostbolt.ts`, `Player.ts`, `TownScene`, `Enemy.ts`, `AssignClass.ts`, `CastingController`, `BiomeScene.ts`, `HUD.ts`, `game.ts`, `Hero`, `Projectile.ts`, `Spell.test.ts`, `Crafting.ts`, `CastBar.test.ts`, `Resource`, `animations.ts`, `CastingController.ts`, `keywords`, `TargetReticle`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `keywords` connect `keywords` to `phaser`, `package.json`, `react`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `gameReducer.ts`, `settingsStorage.ts`, `Header.tsx`, `ItemTooltip.tsx`, `LootItem`, `Stats.tsx`, `ComponentsGrid.tsx`, `PlayerStats`, `HUD.ts`, `store/index.ts`, `phaser`, `keywords`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _409 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `Frostbolt.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0960591133004926 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.10967741935483871 - nodes in this community are weakly interconnected._