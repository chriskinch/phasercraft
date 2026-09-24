# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 270 files · ~416,591 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1869 nodes · 4127 edges · 96 communities (79 shown, 17 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `30f5a86b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- gameReducer.ts
- Item
- TownScene
- generateItem.ts
- compilerOptions
- vitest
- SpawnDirector
- Frostbolt.ts
- devDependencies
- Stats.tsx
- Enemy.ts
- TownScene.ts
- HUD.ts
- StoredItem
- items/index.ts
- Enemy.test.ts
- store/index.ts
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- armoryClient.ts
- Spell
- operations/helpers.ts
- TownScene.test.ts
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- phaser
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- ItemTooltip.tsx
- vite.config.ts
- react
- Player.ts
- AreaEffect.ts
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- generate
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Tilemaps
- CLAUDE.md — Working agreement and project conventions
- build
- lodash
- Resource
- engines
- vercel.json
- Vercel deployment (Phase 6)
- GameSceneLike
- SiphonSoul
- qa-review.md
- log.js
- vite-env.d.ts
- HUD.test.ts
- LootItem
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- Character.tsx
- EarthShield
- BiomeScene.ts
- SpellButton
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- repository
- generate-biome-maps.mjs
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Player.test.ts
- Item.ts
- StatBar.tsx
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 82 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 57 edges
6. `phaser` - 42 edges
7. `BiomeScene` - 40 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 31 edges
10. `Resource` - 30 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts

## Import Cycles
- None detected.

## Communities (96 total, 17 thin omitted)

### Community 0 - "Player"
Cohesion: 0.05
Nodes (14): classes, PlayerConfig, Cleric, Hero, Mage, Occultist, Player, Ranger (+6 more)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.10
Nodes (9): classes, Fireball, Frostbolt, Heal, ManaShield, Smite, SpellValue, SpellOptions (+1 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.08
Nodes (45): Step 3 — Merchant shop, buyComponent, buyGear, buyLoot, freshMerchant(), gameReducer, initState, Level (+37 more)

### Community 3 - "Item"
Cohesion: 0.14
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.13
Nodes (14): @testing-library/react, vitest, SaveData, helm, stacks, Dialog(), DIALOG_ROOT_ID, DialogProps (+6 more)

### Community 8 - "SpawnDirector"
Cohesion: 0.06
Nodes (18): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+10 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.08
Nodes (10): Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.13
Nodes (13): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+5 more)

### Community 12 - "Enemy.ts"
Cohesion: 0.15
Nodes (9): CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, SnareTrap, EnemyAttributes, EntityWithVector (+1 more)

### Community 13 - "TownScene.ts"
Cohesion: 0.23
Nodes (11): PlayerName, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig, clearTravelRequest (+3 more)

### Community 14 - "HUD.ts"
Cohesion: 0.12
Nodes (23): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveSlot, writeSave() (+15 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "Enemy.test.ts"
Cohesion: 0.18
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 18 - "store/index.ts"
Cohesion: 0.11
Nodes (23): GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, ComponentsGrid(), ComponentsGridProps (+15 more)

### Community 19 - "CastingController"
Cohesion: 0.05
Nodes (14): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+6 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+25 more)

### Community 23 - "game.ts"
Cohesion: 0.07
Nodes (25): classes, Healer, Melee, Ranged, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES (+17 more)

### Community 24 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (16): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+8 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "phaser"
Cohesion: 0.06
Nodes (28): phaser, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, HeroConfig, CombatTextConfig (+20 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.10
Nodes (4): Enemy, Monster, MonsterConfig, AssignResource()

### Community 34 - "BiomeScene"
Cohesion: 0.12
Nodes (7): AssignType, Boss, BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "ItemTooltip.tsx"
Cohesion: 0.24
Nodes (7): Equipment, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module, MenuContext

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "react"
Cohesion: 0.09
Nodes (38): Step 1 — Shop skeletons: open & close every shop (this PR), react, react-redux, requestTravel, setMerchantMode, switchUi, toggleUi, Title() (+30 more)

### Community 40 - "Player.ts"
Cohesion: 0.11
Nodes (13): number-to-words, Destination, DrawBarOptions, AssignResourceName, AssignResourceType, Weapon, WeaponConfig, Projectile (+5 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.17
Nodes (15): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK, SPAWN_CONE_HALF_ANGLE_DEG (+7 more)

### Community 45 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.33
Nodes (5): CLAUDE.md — Working agreement and project conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "build"
Cohesion: 0.33
Nodes (6): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build()

### Community 52 - "lodash"
Cohesion: 0.17
Nodes (12): lodash, PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles (+4 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (19): classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions, Rage (+11 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "GameSceneLike"
Cohesion: 0.09
Nodes (16): PlayerType, ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, Multishot (+8 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "LootItem"
Cohesion: 0.11
Nodes (24): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, src_ui_components_atoms_slot_module (+16 more)

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
Cohesion: 0.29
Nodes (7): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Character.tsx"
Cohesion: 0.09
Nodes (21): react-dnd, react-dnd-touch-backend, react-dom, container, PhaserGame, src_styles_globals, LootIcon(), LootIconProps (+13 more)

### Community 78 - "EarthShield"
Cohesion: 0.06
Nodes (16): Deferred / backlog, EarthShield, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, AreaEffect (+8 more)

### Community 79 - "BiomeScene.ts"
Cohesion: 0.20
Nodes (11): Code conventions, rxjs, MapStateOptions, mapStateToData(), state$, buildWalkability(), isFootprintSpawnable(), grid() (+3 more)

### Community 81 - "SpellButton"
Cohesion: 0.07
Nodes (8): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarStart, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

### Community 82 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 83 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 84 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 88 - "statConversion.ts"
Cohesion: 0.27
Nodes (11): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, StatFormat (+3 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.13
Nodes (18): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), offset(), PATH_BY_MASK (+10 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.13
Nodes (10): ref_console, BOSS_SCALE, BIOME_IDS, FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene() (+2 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock

### Community 142 - "StatBar.tsx"
Cohesion: 0.23
Nodes (8): polished, getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 149 - "Gem.ts"
Cohesion: 0.09
Nodes (13): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE, GemConfig (+5 more)

## Knowledge Gaps
- **453 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+448 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 737 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `SpawnDirector`, `Frostbolt.ts`, `StatBar.tsx`, `HUD.ts`, `Enemy.test.ts`, `store/index.ts`, `CastingController`, `Gem.ts`, `package.json`, `operations/helpers.ts`, `TownScene.test.ts`, `handlers.test.ts`, `phaser`, `classes.ts`, `generateItem.test.ts`, `vite.config.ts`, `Player.ts`, `area.ts`, `Spell.test.ts`, `Resource`, `GameSceneLike`, `HUD.test.ts`, `EarthShield`, `BiomeScene.ts`, `SpellButton`, `statConversion.ts`, `BiomeScene.test.ts`, `Player.test.ts`?**
  _High betweenness centrality (0.232) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player`, `AssignSpell.ts`, `Frostbolt.ts`, `Enemy.ts`, `TownScene.ts`, `HUD.ts`, `CastingController`, `Gem.ts`, `package.json`, `game.ts`, `TownScene.test.ts`, `Enemy`, `Player.ts`, `AreaEffect.ts`, `Spell.test.ts`, `Resource`, `GameSceneLike`, `EarthShield`, `BiomeScene.ts`, `SpellButton`, `BiomeScene.test.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `lodash` connect `lodash` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `Player.ts`, `Stats.tsx`, `BiomeScene.ts`, `Gem.ts`, `package.json`, `game.ts`, `Resource`, `operations/helpers.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _453 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.05336951605608322 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0962566844919786 - nodes in this community are weakly interconnected._