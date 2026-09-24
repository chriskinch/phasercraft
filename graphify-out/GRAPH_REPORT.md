# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 268 files · ~414,467 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1825 nodes · 4023 edges · 110 communities (86 shown, 24 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `89aa11cc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- store/index.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- vitest
- GroupedStats.tsx
- Frostbolt.ts
- devDependencies
- Stats.tsx
- CastingController.ts
- BiomeScene.ts
- MerchantModeToggle.tsx
- StoredItem
- items/index.ts
- HUD.test.ts
- RootState
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- Enemy.test.ts
- Spell
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
- generateItem.test.ts
- SnareTrap.ts
- vite.config.ts
- UI.tsx
- TownScene.test.ts
- Consecration
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- gameReducer.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Player.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- lodash
- Resource
- react
- vercel.json
- Vercel deployment (Phase 6)
- Multishot.ts
- SiphonSoul
- spawnGeometry.ts
- qa-review.md
- log.js
- vite-env.d.ts
- Item
- armoryClient.ts
- CastingController.test.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- react-redux
- StatusEffects
- walkability.ts
- ItemTooltip.tsx
- Spell.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- EarthShield.ts
- generate-biome-maps.mjs
- Crafting
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- EnemyOptions
- Invocation
- Enemy.ts
- Gem
- TargetReticle
- Player.test.ts
- eslint.config.mjs
- Healer
- TargetReticle.test.ts
- Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)
- Item.ts
- Character.tsx
- phaser

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 78 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 56 edges
6. `phaser` - 41 edges
7. `BiomeScene` - 38 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Resource` - 30 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts
- `Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts

## Import Cycles
- None detected.

## Communities (110 total, 24 thin omitted)

### Community 0 - "Player"
Cohesion: 0.06
Nodes (6): Hero, Player, AssignSpell, CastBar, CastBarUnderTest, GraphicsStub

### Community 1 - "AssignSpell.ts"
Cohesion: 0.10
Nodes (8): classes, Faith, Fireball, Heal, ManaShield, Smite, SpellOptions, TargetType

### Community 2 - "store/index.ts"
Cohesion: 0.09
Nodes (38): react-tooltip, buyComponent, buyGear, freshMerchant(), gameReducer, MerchantMode, MerchantState, refreshMerchant (+30 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.11
Nodes (27): @testing-library/react, vitest, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+19 more)

### Community 8 - "GroupedStats.tsx"
Cohesion: 0.33
Nodes (6): PlayerStats, Stats(), GroupedAttributesProps, GroupedStats(), GroupedStatsProps, StatItem

### Community 9 - "Frostbolt.ts"
Cohesion: 0.10
Nodes (9): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "CastingController.ts"
Cohesion: 0.22
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 13 - "BiomeScene.ts"
Cohesion: 0.12
Nodes (21): ref_console, lodash, rxjs, AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, Boss, AssignClass, LabelledContainer (+13 more)

### Community 14 - "MerchantModeToggle.tsx"
Cohesion: 0.14
Nodes (17): polished, setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle() (+9 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "HUD.test.ts"
Cohesion: 0.08
Nodes (23): HudUnderTest, PhaserGame(), SelectScene, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation (+15 more)

### Community 18 - "RootState"
Cohesion: 0.13
Nodes (20): selectLoot, RootState, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, stacks, GearGrid(), src_ui_components_molecules_geargrid_module (+12 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (16): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 1 — CI quality gates, Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done) (+8 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (29): description, engines, node, homepage, keywords, name, private, simple-git-hooks (+21 more)

### Community 23 - "game.ts"
Cohesion: 0.11
Nodes (18): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, ComponentDef, EQUIPMENT_SLOTS, GAME_BALANCE (+10 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.24
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.12
Nodes (4): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton, ButtonUnderTest

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (16): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+8 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "PhaserGame.tsx"
Cohesion: 0.10
Nodes (10): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, BootScene, createLogo(), LogoOptions (+2 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.11
Nodes (10): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, BiomeDefinition, BiomeScene, setBossActive (+2 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.14
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "UI.tsx"
Cohesion: 0.08
Nodes (32): Step 1 — Shop skeletons: open & close every shop (this PR), BIOME_IDS, BIOMES, buyLoot, requestTravel, toggleFilter, toggleUi, Button() (+24 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 41 - "Consecration"
Cohesion: 0.21
Nodes (3): Deferred / backlog, Consecration, AreaEffect

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.27
Nodes (10): BOSS_SCALING, promoteToBoss(), scaleLootTable(), SPAWN_CONE_HALF_ANGLE_DEG, SPAWN_MOVING_SPEED, SPAWN_RADIUS_MARGIN, table, src_config_enemies (+2 more)

### Community 45 - "gameReducer.ts"
Cohesion: 0.16
Nodes (15): PlayerName, Boons, addComponent, addXP, GameState, initState, Level, setBaseStats (+7 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Player.ts"
Cohesion: 0.11
Nodes (15): classes, PlayerConfig, Cleric, HeroConfig, Mage, Occultist, Destination, DrawBarOptions (+7 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "lodash"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 54 - "react"
Cohesion: 0.08
Nodes (37): react, react-dnd, equipLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+29 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Multishot.ts"
Cohesion: 0.15
Nodes (7): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 59 - "spawnGeometry.ts"
Cohesion: 0.33
Nodes (7): isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 65 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (11): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 66 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "generate-pwa-icons.mjs"
Cohesion: 0.25
Nodes (6): ref_node_url, sharp, BG, ICON_DIR, root, SOURCE

### Community 75 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.22
Nodes (9): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 3 — Merchant shop, Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist (+1 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "react-redux"
Cohesion: 0.17
Nodes (9): react-dnd-touch-backend, react-dom, react-redux, container, PhaserGame, src_styles_globals, Coins(), CoinsProps (+1 more)

### Community 78 - "StatusEffects"
Cohesion: 0.21
Nodes (4): Banes, IndexableStats, StatusEffect, StatusEffects

### Community 79 - "walkability.ts"
Cohesion: 0.31
Nodes (6): buildWalkability(), isFootprintSpawnable(), Rect, grid(), WalkabilityGrid, WalkabilityInput

### Community 80 - "ItemTooltip.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

### Community 81 - "Spell.ts"
Cohesion: 0.22
Nodes (6): SpellValue, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, SpellProjectileConfig

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
Cohesion: 0.26
Nodes (12): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, StatFormat (+4 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.13
Nodes (18): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), offset(), PATH_BY_MASK (+10 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.14
Nodes (7): FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), makeSpawnScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "EnemyOptions"
Cohesion: 0.19
Nodes (5): AssignType, classes, Melee, Ranged, EnemyOptions

### Community 99 - "Enemy.ts"
Cohesion: 0.10
Nodes (12): CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, Monster, MonsterConfig, AssignResource() (+4 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): eslintConfig, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, @typescript-eslint/eslint-plugin, @typescript-eslint/parser

### Community 106 - "Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)"
Cohesion: 0.67
Nodes (3): Phase 7 — Armory migration to Vercel (non-destructive; issue TBD), PR1 — Legacy contract baseline (pre-step) ✅ this PR, PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock

### Community 142 - "Character.tsx"
Cohesion: 0.25
Nodes (7): getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 149 - "phaser"
Cohesion: 0.13
Nodes (14): phaser, Coin, COIN_BASE_VALUE, CoinConfig, CraftingConfig, GEM_BASE_VALUE, GemConfig, PlayerType (+6 more)

## Knowledge Gaps
- **451 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+446 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 719 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Player`, `store/index.ts`, `generateItem.ts`, `Item.ts`, `Character.tsx`, `HUD.test.ts`, `RootState`, `phaser`, `package.json`, `Enemy.test.ts`, `operations/helpers.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `vite.config.ts`, `UI.tsx`, `TownScene.test.ts`, `area.ts`, `Spell.test.ts`, `Resource`, `Multishot.ts`, `spawnGeometry.ts`, `CastingController.test.ts`, `walkability.ts`, `Spell.ts`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `Invocation`, `Gem`, `Player.test.ts`, `TargetReticle.test.ts`?**
  _High betweenness centrality (0.189) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player`, `CastingController.test.ts`, `Enemy.ts`, `SnareTrap.ts`, `TownScene.test.ts`, `Frostbolt.ts`, `TargetReticle.test.ts`, `CastingController.ts`, `BiomeScene.ts`, `Spell.test.ts`, `Player.ts`, `Spell.ts`, `Resource`, `package.json`, `game.ts`, `EarthShield.ts`, `PhaserGame.tsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `lodash` connect `BiomeScene.ts` to `EnemyOptions`, `generateItem.ts`, `Item.ts`, `GroupedStats.tsx`, `Stats.tsx`, `gameReducer.ts`, `Player.ts`, `lodash`, `phaser`, `package.json`, `Resource`, `react`, `operations/helpers.ts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _451 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.06485671191553545 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09879032258064516 - nodes in this community are weakly interconnected._