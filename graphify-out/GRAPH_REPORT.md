# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 270 files · ~416,140 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1865 nodes · 4122 edges · 104 communities (80 shown, 24 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6ec6359c`
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
- MerchantModeToggle.tsx
- StoredItem
- items/index.ts
- CastingController
- ComponentsGrid.tsx
- CastingController.test.ts
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- SpawnHost
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
- react
- Projectile
- Consecration
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- Player.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- AssignClass.ts
- CLAUDE.md — Working agreement and project conventions
- CastableSpell
- lodash
- Resource
- TargetReticle
- vercel.json
- Vercel deployment (Phase 6)
- Multishot.ts
- SiphonSoul
- SpawnDirector.ts
- qa-review.md
- log.js
- vite-env.d.ts
- HUD.test.ts
- LootItem
- SpellButton.test.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- main.tsx
- Boons.ts
- BiomeScene.ts
- CastingController.ts
- CastBar
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- EarthShield
- generate-biome-maps.mjs
- TargetReticle.test.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Frostbolt
- Invocation
- Hero
- Player.test.ts
- Item.ts
- Character.tsx
- Coin.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 82 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 57 edges
6. `phaser` - 41 edges
7. `BiomeScene` - 40 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 31 edges
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

## Communities (104 total, 24 thin omitted)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.10
Nodes (9): classes, Faith, Fireball, Heal, ManaShield, Smite, SpellValue, SpellOptions (+1 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.06
Nodes (61): Step 3 — Merchant shop, @reduxjs/toolkit, CraftingConfig, addCoins, addComponent, addXP, buyComponent, buyGear (+53 more)

### Community 3 - "Item"
Cohesion: 0.13
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.11
Nodes (5): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest, TownScene

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.10
Nodes (25): @testing-library/react, vitest, LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS (+17 more)

### Community 8 - "SpawnDirector"
Cohesion: 0.13
Nodes (7): AreaTuning, DEFAULT_AREA_TUNING, SpawnDirector, FakeEnemy, killAll(), makeDirector(), seeded()

### Community 9 - "Frostbolt.ts"
Cohesion: 0.12
Nodes (8): Boon, Enrage, EnrageValue, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue, EffectValue

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "Enemy.ts"
Cohesion: 0.12
Nodes (19): phaser, CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, GEM_BASE_VALUE, GemConfig (+11 more)

### Community 13 - "TownScene.ts"
Cohesion: 0.13
Nodes (17): rxjs, AssignClass, PlayerName, MapStateOptions, mapStateToData(), state$, BIOME_IDS, BiomeId (+9 more)

### Community 14 - "MerchantModeToggle.tsx"
Cohesion: 0.16
Nodes (14): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+6 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.12
Nodes (22): react-dnd-html5-backend, equipLoot, selectLoot, unequipLoot, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid() (+14 more)

### Community 19 - "CastingController.test.ts"
Cohesion: 0.14
Nodes (7): ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.11
Nodes (19): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 1 — CI quality gates, Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done) (+11 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (34): eslintConfig, description, engines, node, homepage, keywords, name, private (+26 more)

### Community 23 - "game.ts"
Cohesion: 0.10
Nodes (20): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, ComponentDef, EQUIPMENT_SLOTS, GAME_BALANCE (+12 more)

### Community 24 - "SpawnHost"
Cohesion: 0.16
Nodes (3): Point, Rect, SpawnHost

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.16
Nodes (3): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton

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
Cohesion: 0.06
Nodes (25): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+17 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.05
Nodes (14): classes, Enemy, EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, Healer (+6 more)

### Community 34 - "BiomeScene"
Cohesion: 0.13
Nodes (6): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, BiomeScene

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "react"
Cohesion: 0.08
Nodes (40): Step 1 — Shop skeletons: open & close every shop (this PR), react, react-redux, buyLoot, requestTravel, switchUi, toggleFilter, toggleUi (+32 more)

### Community 40 - "Projectile"
Cohesion: 0.27
Nodes (4): Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.17
Nodes (15): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK, SPAWN_CONE_HALF_ANGLE_DEG (+7 more)

### Community 45 - "Player.ts"
Cohesion: 0.13
Nodes (9): Destination, DrawBarOptions, AssignResource(), AssignResourceType, AssignSpell, CombatText, CombatTextConfig, setLevel (+1 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "CastableSpell"
Cohesion: 0.27
Nodes (3): CastableSpell, SpellStub, TargetKind

### Community 52 - "lodash"
Cohesion: 0.15
Nodes (14): lodash, PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles (+6 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (19): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+11 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Multishot.ts"
Cohesion: 0.15
Nodes (7): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 59 - "SpawnDirector.ts"
Cohesion: 0.29
Nodes (8): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view, SpawnedEnemy, Tracked

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "LootItem"
Cohesion: 0.09
Nodes (30): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+22 more)

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

### Community 77 - "main.tsx"
Cohesion: 0.12
Nodes (14): react-dnd, react-dnd-touch-backend, react-dom, container, PhaserGame, src_styles_globals, LootIcon(), LootIconProps (+6 more)

### Community 78 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 79 - "BiomeScene.ts"
Cohesion: 0.12
Nodes (14): ref_console, AssignType, Boss, BOSS_SCALE, buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid (+6 more)

### Community 80 - "CastingController.ts"
Cohesion: 0.25
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 81 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

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
Cohesion: 0.19
Nodes (15): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+7 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.11
Nodes (27): Autotiling, BIOMES, BOULDER, buildPathCorners(), buildWaterCorners(), cornerAt(), fade(), generate() (+19 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.17
Nodes (7): FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

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
Cohesion: 0.17
Nodes (9): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock (+1 more)

### Community 142 - "Character.tsx"
Cohesion: 0.14
Nodes (13): polished, getResourceColour(), Slot(), DetailedLoot(), DetailedLootProps, src_ui_components_molecules_detailedloot_module, src_ui_components_molecules_statbar_module, StatBar() (+5 more)

### Community 149 - "Coin.ts"
Cohesion: 0.09
Nodes (8): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, Gem, GemUnderTest, coinValue(), getRandomVelocity()

## Knowledge Gaps
- **453 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+448 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 733 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **24 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `TownScene`, `generateItem.ts`, `Item.ts`, `SpawnDirector`, `TownScene.ts`, `Character.tsx`, `ComponentsGrid.tsx`, `CastingController.test.ts`, `Coin.ts`, `package.json`, `operations/helpers.ts`, `handlers.test.ts`, `PhaserGame.tsx`, `Enemy`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `vite.config.ts`, `react`, `Projectile`, `area.ts`, `Spell.test.ts`, `Resource`, `Multishot.ts`, `SpawnDirector.ts`, `HUD.test.ts`, `SpellButton.test.ts`, `BiomeScene.ts`, `CastBar`, `ItemTooltip.tsx`, `TargetReticle.test.ts`, `BiomeScene.test.ts`, `Invocation`, `Player.test.ts`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `Player`, `AssignSpell.ts`, `gameReducer.ts`, `TownScene`, `vitest`, `Frostbolt.ts`, `TownScene.ts`, `CastingController.test.ts`, `Coin.ts`, `package.json`, `game.ts`, `PhaserGame.tsx`, `Projectile`, `Player.ts`, `Spell.test.ts`, `AssignClass.ts`, `Resource`, `TargetReticle`, `BiomeScene.ts`, `CastingController.ts`, `CastBar`, `TargetReticle.test.ts`, `Hero`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `LootItem`, `gameReducer.ts`, `vitest`, `Stats.tsx`, `main.tsx`, `MerchantModeToggle.tsx`, `Character.tsx`, `ComponentsGrid.tsx`, `lodash`, `package.json`, `ItemTooltip.tsx`, `PhaserGame.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _453 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.12923076923076923 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10084033613445378 - nodes in this community are weakly interconnected._