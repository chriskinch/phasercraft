# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 266 files · ~410,756 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1800 nodes · 3975 edges · 100 communities (82 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1088a84`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Spell
- gameReducer.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- vitest
- react
- Invocation.ts
- devDependencies
- Stats.tsx
- Enemy.ts
- BiomeScene.ts
- MerchantModeToggle.tsx
- StoredItem
- items/index.ts
- Healer
- store/index.ts
- CastingController.test.ts
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- Projectile
- renderWithProviders
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
- CastingController
- vite.config.ts
- UI.tsx
- TownScene.test.ts
- Consecration
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- CastingController.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- CastableSpell
- CLAUDE.md — Working agreement and project conventions
- generate
- GroupedAttributes.tsx
- Resource
- LootItem
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
- build
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- main.tsx
- Tilemaps
- TargetReticle
- Price.tsx
- CharacterCard.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- biomes.ts
- generate-biome-maps.mjs
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Player.test.ts
- Item.ts
- StatBar.tsx
- TargetReticle.test.ts
- Gem.test.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 75 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 55 edges
6. `phaser` - 41 edges
7. `BiomeScene` - 36 edges
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
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts

## Import Cycles
- None detected.

## Communities (100 total, 18 thin omitted)

### Community 0 - "Player"
Cohesion: 0.06
Nodes (15): uuid, Hero, HeroConfig, Destination, DrawBarOptions, Player, AssignSpell, Boons (+7 more)

### Community 1 - "Spell"
Cohesion: 0.06
Nodes (14): MoveOptions, classes, Faith, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield (+6 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.08
Nodes (44): Step 3 — Merchant shop, addComponent, addXP, buyComponent, buyGear, freshMerchant(), gameReducer, initState (+36 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.08
Nodes (5): HudUnderTest, UI, TownScene, addLoot, setCurrentArea

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.10
Nodes (28): @testing-library/react, vitest, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+20 more)

### Community 8 - "react"
Cohesion: 0.09
Nodes (25): react, buyLoot, toggleFilter, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, src_ui_components_atoms_slot_module (+17 more)

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (14): Deferred / backlog, Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+6 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.15
Nodes (11): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+3 more)

### Community 12 - "Enemy.ts"
Cohesion: 0.07
Nodes (24): phaser, CirclingConfig, EnemyStates, HitParams, Coin, COIN_BASE_VALUE, CoinConfig, Crafting (+16 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.11
Nodes (17): ref_console, lodash, rxjs, AssignType, classes, Boss, Melee, Ranged (+9 more)

### Community 14 - "MerchantModeToggle.tsx"
Cohesion: 0.14
Nodes (16): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+8 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "store/index.ts"
Cohesion: 0.12
Nodes (26): react-redux, @reduxjs/toolkit, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module (+18 more)

### Community 19 - "CastingController.test.ts"
Cohesion: 0.14
Nodes (7): ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "game.ts"
Cohesion: 0.08
Nodes (29): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+21 more)

### Community 24 - "Projectile"
Cohesion: 0.16
Nodes (9): EnemyUnderTest, makeBurst(), makeEnemy(), ProjectileMock, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest (+1 more)

### Community 25 - "renderWithProviders"
Cohesion: 0.17
Nodes (7): loadGame, InstallBanner(), src_ui_components_molecules_installbanner_module, initialGame, seed(), seedParts(), renderWithProviders()

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.08
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

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
Cohesion: 0.09
Nodes (6): Enemy, EnemyStats, Monster, MonsterConfig, AssignResource(), EnemyAttributes

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "UI.tsx"
Cohesion: 0.12
Nodes (20): Step 1 — Shop skeletons: open & close every shop (this PR), requestTravel, toggleUi, Alchemist(), src_ui_components_templates_alchemist_module, Arcanum(), src_ui_components_templates_arcanum_module, BiomeSelect() (+12 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 41 - "Consecration"
Cohesion: 0.06
Nodes (10): Consecration, EarthShield, SnareTrap, AreaEffect, TrapUnderTest, Trap, dropIn(), DropInItem (+2 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.27
Nodes (10): BOSS_SCALING, promoteToBoss(), scaleLootTable(), SPAWN_CONE_HALF_ANGLE_DEG, SPAWN_MOVING_SPEED, SPAWN_RADIUS_MARGIN, table, src_config_enemies (+2 more)

### Community 45 - "CastingController.ts"
Cohesion: 0.25
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "CastableSpell"
Cohesion: 0.27
Nodes (3): CastableSpell, SpellStub, TargetKind

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "GroupedAttributes.tsx"
Cohesion: 0.15
Nodes (13): PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module (+5 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 54 - "LootItem"
Cohesion: 0.14
Nodes (20): react-dnd, equipLoot, selectLoot, unequipLoot, Equipment, LootItem, DroppableSlot(), DroppableSlotProps (+12 more)

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

### Community 65 - "build"
Cohesion: 0.25
Nodes (8): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset(), tileLayer()

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
Cohesion: 0.29
Nodes (5): react-dnd-touch-backend, react-dom, container, PhaserGame, src_styles_globals

### Community 78 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 80 - "Price.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

### Community 81 - "CharacterCard.tsx"
Cohesion: 0.47
Nodes (5): PlayerName, setCoins, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module

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
Cohesion: 0.29
Nodes (11): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+3 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "biomes.ts"
Cohesion: 0.22
Nodes (8): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BIOME_IDS, BiomeDefinition, BiomeMap, DEFAULT_BIOME, resolveBiome(), EnemyType

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.16
Nodes (15): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+7 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.15
Nodes (6): BIOMES, FakeTimer, makeOverlayScene(), makeScene(), makeSpawnScene(), SceneUnderTest

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 102 - "Player.test.ts"
Cohesion: 0.13
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 142 - "StatBar.tsx"
Cohesion: 0.23
Nodes (8): polished, getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

## Knowledge Gaps
- **446 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+441 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 710 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `TownScene`, `generateItem.ts`, `Item.ts`, `react`, `Invocation.ts`, `Enemy.ts`, `StatBar.tsx`, `MerchantModeToggle.tsx`, `TargetReticle.test.ts`, `store/index.ts`, `CastingController.test.ts`, `Gem.test.ts`, `package.json`, `Projectile`, `renderWithProviders`, `operations/helpers.ts`, `SpellButton`, `handlers.test.ts`, `PhaserGame.tsx`, `classes.ts`, `generateItem.test.ts`, `vite.config.ts`, `UI.tsx`, `TownScene.test.ts`, `Consecration`, `area.ts`, `Spell.test.ts`, `Resource`, `LootItem`, `Multishot.ts`, `spawnGeometry.ts`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `Player.test.ts`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `Player`, `Enemy`, `Spell`, `TownScene.test.ts`, `Invocation.ts`, `Consecration`, `CastingController.ts`, `BiomeScene.ts`, `TargetReticle`, `Spell.test.ts`, `TargetReticle.test.ts`, `CastingController.test.ts`, `Resource`, `package.json`, `game.ts`, `Projectile`, `SpellButton`, `PhaserGame.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `lodash` connect `BiomeScene.ts` to `Player`, `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `Stats.tsx`, `Enemy.ts`, `GroupedAttributes.tsx`, `Resource`, `package.json`, `operations/helpers.ts`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _446 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.06127946127946128 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.05921325051759834 - nodes in this community are weakly interconnected._