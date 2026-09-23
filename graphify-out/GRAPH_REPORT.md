# Graph Report - phasercraft  (2026-09-23)

## Corpus Check
- 265 files · ~409,052 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1794 nodes · 3609 edges · 134 communities (82 shown, 52 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f65d67f6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Spell
- Merchant.tsx
- LootTable.ts
- TownScene.ts
- generateItem.ts
- compilerOptions
- phaser
- LootIcon.tsx
- Invocation.ts
- devDependencies
- Stats.tsx
- Coin.ts
- setBossActive
- MerchantModeToggle.tsx
- StoredItem
- items/index.ts
- Healer
- ComponentsGrid.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- Enemy.test.ts
- store/index.ts
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- PhaserGame.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- Player.ts
- Trap
- BiomeScene.test.ts
- react
- TownScene.test.ts
- EarthShield
- .prettierrc.json
- e2e/helpers.ts
- BiomeScene.ts
- CastingController.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- paths
- CLAUDE.md — Working agreement and project conventions
- ArcadeCollisionObject
- Attributes.tsx
- Resource
- LootItem
- vercel.json
- Vercel deployment (Phase 6)
- Multishot.ts
- SiphonSoul
- qa-review.md
- log.js
- vite-env.d.ts
- Item
- armoryClient.ts
- exclude
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- graphify reference: query, path, explain
- Tilemaps
- TargetReticle
- SnareTrap
- gameReducer.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- @components/*
- biomes.ts
- generate-biome-maps.mjs
- SceneUnderTest
- lint-staged
- Bug-Fix Agent — Instructions
- lib
- tsconfig.json
- eslint.config.mjs
- eslint-config-prettier
- PlayerUnderTest
- eslint-plugin-react
- eslint-plugin-react-hooks
- gh-pages
- jsdom
- lint-staged
- number-to-words
- phaser
- react
- react-dom
- react-redux
- uuid
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
- playwright.config.ts
- Item.ts
- PlayerStats
- Consecration
- StatBar.tsx
- ReticleUnderTest
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 75 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 56 edges
5. `phaser` - 41 edges
6. `SpellOptions` - 36 edges
7. `BiomeScene` - 34 edges
8. `Resource` - 29 edges
9. `CastingController` - 29 edges
10. `LootItem` - 27 edges

## Surprising Connections (you probably didn't know these)
- `LootListDrag()` --indirect_call--> `icon()`  [INFERRED]
  src/ui/components/molecules/LootListDrag.tsx → scripts/generate-pwa-icons.mjs
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts
- `Attributes()` --calls--> `formatStatValue()`  [EXTRACTED]
  src/ui/components/molecules/Attributes.tsx → src/lib/statConversion.ts
- `GroupedStats()` --calls--> `formatStatValue()`  [EXTRACTED]
  src/ui/components/organisms/GroupedStats.tsx → src/lib/statConversion.ts

## Import Cycles
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Whirlwind.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/index.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (134 total, 52 thin omitted)

### Community 0 - "Player"
Cohesion: 0.06
Nodes (14): classes, PlayerConfig, Cleric, Hero, HeroConfig, Mage, Occultist, Player (+6 more)

### Community 1 - "Spell"
Cohesion: 0.07
Nodes (13): MoveOptions, classes, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield, Smite (+5 more)

### Community 2 - "Merchant.tsx"
Cohesion: 0.12
Nodes (24): buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, COMPONENT_DEFS, COMPONENT_TYPES, componentBuyPrice() (+16 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.15
Nodes (6): Common, Fine, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene.ts"
Cohesion: 0.05
Nodes (30): LabelledContainer, styles, HudUnderTest, UI, MapStateOptions, mapStateToData(), state$, TownScene (+22 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (28): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "phaser"
Cohesion: 0.30
Nodes (7): phaser, SpellButtonOptions, OverlapTarget, dropIn(), DropInItem, DropInOptions, GameSceneLike

### Community 8 - "LootIcon.tsx"
Cohesion: 0.24
Nodes (8): LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, CustomDragLayer(), getItemStyles(), src_ui_components_protons_customdraglayer_module, Offset

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (16): Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion, PowerInfusionValue (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.13
Nodes (9): src_ui_components_atoms_stat_module, StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem, StatsProps (+1 more)

### Community 12 - "Coin.ts"
Cohesion: 0.17
Nodes (5): Coin, CoinConfig, Crafting, CraftingConfig, getRandomVelocity()

### Community 14 - "MerchantModeToggle.tsx"
Cohesion: 0.21
Nodes (11): setMerchantMode, Title(), TitleProps, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation(), src_ui_themes_module (+3 more)

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.18
Nodes (11): ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid(), src_ui_components_molecules_geargrid_module, PaginationControls(), GridDims, MeasuredPageSize (+3 more)

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

### Community 23 - "game.ts"
Cohesion: 0.08
Nodes (24): ref_console, AssignType, classes, Boss, Melee, Ranged, AdjustValue, CHARACTER_BASE_STATS (+16 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.16
Nodes (9): EnemyUnderTest, makeBurst(), makeEnemy(), ProjectileMock, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest (+1 more)

### Community 25 - "store/index.ts"
Cohesion: 0.11
Nodes (17): gameReducer, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, helm (+9 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.10
Nodes (19): Captured, Handler, mockReq(), mockRes(), run(), categories, qualities, statNames (+11 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (26): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+18 more)

### Community 32 - "dependencies"
Cohesion: 0.10
Nodes (21): fantasy-content-generator, ioredis, lodash, dependencies, fantasy-content-generator, ioredis, lodash, polished (+13 more)

### Community 33 - "Enemy"
Cohesion: 0.10
Nodes (3): Enemy, Monster, MonsterConfig

### Community 34 - "BiomeScene"
Cohesion: 0.16
Nodes (4): PlayerType, BiomeDefinition, BiomeScene, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "Player.ts"
Cohesion: 0.11
Nodes (14): CirclingConfig, EnemyStates, EnemyStats, HitParams, Destination, DrawBarOptions, AssignResource(), AssignResourceType (+6 more)

### Community 38 - "BiomeScene.test.ts"
Cohesion: 0.38
Nodes (5): character(), FakeTimer, makeOverlayScene(), makeScene(), makeSpawnScene()

### Community 39 - "react"
Cohesion: 0.06
Nodes (33): react, container, PhaserGame, src_styles_globals, Button(), ButtonProps, src_ui_components_atoms_button_module, src_ui_components_atoms_price_module (+25 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.18
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 44 - "BiomeScene.ts"
Cohesion: 0.32
Nodes (8): BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies, AssignClass, EnemyConfig, LootTable

### Community 45 - "CastingController.ts"
Cohesion: 0.25
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 48 - "Spell.test.ts"
Cohesion: 0.18
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "paths"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.05
Nodes (21): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+13 more)

### Community 54 - "LootItem"
Cohesion: 0.10
Nodes (27): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, src_ui_components_atoms_slot_module (+19 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Multishot.ts"
Cohesion: 0.15
Nodes (7): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 65 - "exclude"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

### Community 66 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.18
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "Tilemaps"
Cohesion: 0.29
Nodes (6): Autotiling, Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 81 - "gameReducer.ts"
Cohesion: 0.09
Nodes (30): PlayerName, addComponent, addXP, buyLoot, clearTravelRequest, freshMerchant(), initState, Level (+22 more)

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
Cohesion: 0.24
Nodes (13): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+5 more)

### Community 89 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 90 - "biomes.ts"
Cohesion: 0.23
Nodes (9): BIOME_IDS, BiomeId, BiomeMap, BIOMES, resolveBiome(), GameSceneConfig, requestTravel, BiomeSelect() (+1 more)

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.07
Nodes (39): keywords, ref_node_fs, ref_node_path, ref_node_url, phaser3, typescript, vite, BIOMES (+31 more)

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 98 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 102 - "PlayerUnderTest"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 135 - "PlayerStats"
Cohesion: 0.28
Nodes (7): PlayerStats, GroupedAttributes(), GroupedAttributesProps, NumericStats, GroupedStats(), GroupedStatsProps, StatItem

### Community 142 - "StatBar.tsx"
Cohesion: 0.43
Nodes (4): getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps

### Community 149 - "Gem.ts"
Cohesion: 0.15
Nodes (5): Gem, GemConfig, GemUnderTest, coinValue(), addCoins

## Knowledge Gaps
- **435 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `generate-biome-maps.mjs` to `react`, `package.json`, `phaser`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player`, `Spell`, `TownScene.ts`, `Invocation.ts`, `Coin.ts`, `CastingController`, `Gem.ts`, `game.ts`, `Enemy.test.ts`, `PhaserGame.tsx`, `Enemy`, `Player.ts`, `TownScene.test.ts`, `BiomeScene.ts`, `CastingController.ts`, `Spell.test.ts`, `Resource`, `CastBar`, `TargetReticle`, `biomes.ts`, `generate-biome-maps.mjs`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `armoryClient.ts`, `Merchant.tsx`, `TownScene.ts`, `PlayerStats`, `LootIcon.tsx`, `Stats.tsx`, `MerchantModeToggle.tsx`, `StatBar.tsx`, `gameReducer.ts`, `ComponentsGrid.tsx`, `Attributes.tsx`, `LootItem`, `ItemTooltip.tsx`, `store/index.ts`, `biomes.ts`, `generate-biome-maps.mjs`, `PhaserGame.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _435 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.05683563748079877 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.0679563492063492 - nodes in this community are weakly interconnected._
- **Should `Merchant.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._