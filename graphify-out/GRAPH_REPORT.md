# Graph Report - phasercraft  (2026-09-28)

## Corpus Check
- 280 files · ~434,158 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1989 nodes · 4575 edges · 118 communities (89 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2abefc63`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- TownScene
- gameReducer.test.ts
- Item
- UI
- generateItem.ts
- compilerOptions
- vitest
- PhaserGame.tsx
- Frostbolt.ts
- devDependencies
- react
- game.ts
- Boss.ts
- Save.tsx
- StoredItem
- items/index.ts
- gameReducer.ts
- react-redux
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- CastingController.ts
- Enemy.test.ts
- BiomeScene.ts
- area.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- Character.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- phaser
- .constructor
- Blacksmith crafting UI — design spec
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- Player.ts
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- SpawnDirector.ts
- Resource
- Spell
- vercel.json
- Vercel deployment (Phase 6)
- Spell.ts
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- SpawnHost
- armoryClient.ts
- operations/helpers.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- CastBar.test.ts
- UI.tsx
- Settings.tsx
- EnemyOptions
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- Enemy.ts
- generate-biome-maps.mjs
- main.tsx
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- HUD.test.ts
- Boons.ts
- Stats.tsx
- Player
- Blacksmith.tsx
- EarthShield
- Player.test.ts
- build
- Multishot.ts
- Invocation
- GroupedAttributes.tsx
- SpawnDirector.test.ts
- AssignSpell.ts
- walkability.ts
- shoreCollision.ts
- Hero
- CastBar
- Faith.ts
- SnareTrap
- engines
- LootItem
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `vitest` - 63 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 47 edges
7. `BiomeScene` - 43 edges
8. `SpellOptions` - 36 edges
9. `Button()` - 34 edges
10. `CastingController` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Step 4e — Craft SFX (first audio in the game) (#482)` --references--> `LoadScene`  [INFERRED]
  docs/ROADMAP.md → src/scenes/LoadScene.ts
- `Decisions update (2026-07-30) — Town shops` --references--> `Recipe`  [INFERRED]
  docs/ROADMAP.md → src/types/game.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts

## Import Cycles
- None detected.

## Communities (118 total, 29 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 2 - "gameReducer.test.ts"
Cohesion: 0.12
Nodes (29): buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, sellComponent, sellComponentStack, sellLoot (+21 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (17): uuid, Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo (+9 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.15
Nodes (12): @testing-library/react, vitest, loadGame, helm, props, stacks, sampleItems, Equipment() (+4 more)

### Community 8 - "PhaserGame.tsx"
Cohesion: 0.05
Nodes (26): Sound (first audio in the game), home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, bannerStyle() (+18 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.10
Nodes (9): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "react"
Cohesion: 0.13
Nodes (22): react, setMerchantMode, AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, StatProps, Title(), TitleProps (+14 more)

### Community 12 - "game.ts"
Cohesion: 0.08
Nodes (27): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_TYPES, ComponentDef, EQUIPMENT_SLOTS (+19 more)

### Community 13 - "Boss.ts"
Cohesion: 0.40
Nodes (3): ref_console, Boss, BOSS_SCALE

### Community 14 - "Save.tsx"
Cohesion: 0.18
Nodes (15): readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, setSaveSlot, Dialog() (+7 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "gameReducer.ts"
Cohesion: 0.15
Nodes (19): Step 3 — Merchant shop, @reduxjs/toolkit, DrawBarOptions, consumeComponent(), craftedItem(), freshMerchant(), gameReducer, GameState (+11 more)

### Community 18 - "react-redux"
Cohesion: 0.12
Nodes (25): react-redux, RootState, CoinsProps, src_ui_components_atoms_coins_module, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid() (+17 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+25 more)

### Community 23 - "CastingController.ts"
Cohesion: 0.20
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, CombatType

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "BiomeScene.ts"
Cohesion: 0.14
Nodes (18): lodash, rxjs, AssignClass, PlayerName, LabelledContainer, styles, MapStateOptions, mapStateToData() (+10 more)

### Community 26 - "area.ts"
Cohesion: 0.13
Nodes (18): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+10 more)

### Community 27 - "SpellButton"
Cohesion: 0.11
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

### Community 31 - "Character.tsx"
Cohesion: 0.12
Nodes (18): polished, getResourceColour(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, Slot(), DetailedLoot(), DetailedLootProps (+10 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.11
Nodes (11): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, WalkabilityGrid, BiomeDefinition, BiomeScene (+3 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "phaser"
Cohesion: 0.12
Nodes (12): phaser, PlayerType, SpellButtonOptions, AreaEffect, OverlapTarget, TrapUnderTest, Trap, dropIn() (+4 more)

### Community 38 - ".constructor"
Cohesion: 0.18
Nodes (3): AssignSpell, Weapon, setLevel

### Community 39 - "Blacksmith crafting UI — design spec"
Cohesion: 0.21
Nodes (16): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+8 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.22
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "Player.ts"
Cohesion: 0.17
Nodes (11): classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions, Ranger (+3 more)

### Community 45 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "SpawnDirector.ts"
Cohesion: 0.14
Nodes (16): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), SpawnRadiusOptions, view, coneEdges(), countdownLabel(), OverlayEnemy (+8 more)

### Community 53 - "Resource"
Cohesion: 0.05
Nodes (19): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, Health, HealthOptions, Mana (+11 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Spell.ts"
Cohesion: 0.20
Nodes (7): SpellValue, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, SpellProjectileConfig, TargetKind

### Community 59 - "SpawnDirector"
Cohesion: 0.13
Nodes (6): spawnRadius(), Rect, SpawnDirector, SpawnedEnemy, killAll(), autoSpawnRadius()

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.36
Nodes (10): ApiItem, baseUrl(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock(), StoreItem (+2 more)

### Community 65 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

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
Cohesion: 0.20
Nodes (10): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4c — Schematic shop, Step 4d — Special items (#481), Step 4e — Craft SFX (first audio in the game) (#482) (+2 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "CastBar.test.ts"
Cohesion: 0.31
Nodes (3): CastBarStart, CastBarUnderTest, GraphicsStub

### Community 78 - "UI.tsx"
Cohesion: 0.07
Nodes (44): Step 1 — Shop skeletons: open & close every shop (this PR), BIOME_IDS, writeSave(), buyLoot, requestTravel, selectCharacter, setCoins, switchUi (+36 more)

### Community 79 - "Settings.tsx"
Cohesion: 0.12
Nodes (21): DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), hintStyle, numberInputStyle (+13 more)

### Community 80 - "EnemyOptions"
Cohesion: 0.16
Nodes (6): AssignType, classes, Healer, Melee, Ranged, EnemyOptions

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
Cohesion: 0.17
Nodes (18): Layout — forge (desktop), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion (+10 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "Enemy.ts"
Cohesion: 0.14
Nodes (8): CirclingConfig, EnemyStates, HitParams, MoveOptions, Monster, MonsterConfig, WeaponConfig, EntityWithVector

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.14
Nodes (17): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+9 more)

### Community 92 - "main.tsx"
Cohesion: 0.29
Nodes (7): react-dnd, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, src_styles_globals

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.16
Nodes (8): BIOMES, FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 98 - "Stats.tsx"
Cohesion: 0.17
Nodes (12): Stat(), Health(), HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem, Stats() (+4 more)

### Community 100 - "Blacksmith.tsx"
Cohesion: 0.23
Nodes (13): Slots, colorForQuality(), toStoreItem(), craftItem, LootIcon(), Blacksmith(), materialEntries(), src_ui_components_templates_blacksmith_module (+5 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.22
Nodes (9): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset() (+1 more)

### Community 104 - "Multishot.ts"
Cohesion: 0.15
Nodes (7): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 106 - "GroupedAttributes.tsx"
Cohesion: 0.24
Nodes (9): PlayerStats, Attribute(), Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module, GroupedAttributesProps, NumericStats (+1 more)

### Community 107 - "SpawnDirector.test.ts"
Cohesion: 0.24
Nodes (5): AreaTuning, DEFAULT_AREA_TUNING, FakeEnemy, makeDirector(), seeded()

### Community 108 - "AssignSpell.ts"
Cohesion: 0.13
Nodes (7): classes, Fireball, Heal, ManaShield, Smite, SpellOptions, TargetType

### Community 109 - "walkability.ts"
Cohesion: 0.43
Nodes (4): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityInput

### Community 110 - "shoreCollision.ts"
Cohesion: 0.27
Nodes (12): bit(), isShoreBlocked(), NE, NW, SE, SHORE_ART_SIZE, SHORE_CELL, SHORE_EDGE (+4 more)

### Community 142 - "LootItem"
Cohesion: 0.15
Nodes (20): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, src_ui_components_atoms_slot_module (+12 more)

### Community 149 - "Gem.ts"
Cohesion: 0.08
Nodes (14): Step 4b — Schematic drops, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE (+6 more)

## Knowledge Gaps
- **477 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+472 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 764 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `gameReducer.test.ts`, `Item`, `generateItem.ts`, `PhaserGame.tsx`, `react`, `game.ts`, `Save.tsx`, `react-redux`, `Gem.ts`, `package.json`, `Enemy.test.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `Character.tsx`, `classes.ts`, `generateItem.test.ts`, `phaser`, `TownScene.test.ts`, `vite.config.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `SpawnDirector.ts`, `Resource`, `Spell.ts`, `operations/helpers.ts`, `CastBar.test.ts`, `UI.tsx`, `Settings.tsx`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `HUD.test.ts`, `Player.test.ts`, `Multishot.ts`, `Invocation`, `SpawnDirector.test.ts`, `walkability.ts`, `shoreCollision.ts`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `CastingController.test.ts`, `PhaserGame.tsx`, `Frostbolt.ts`, `game.ts`, `gameReducer.ts`, `Gem.ts`, `package.json`, `CastingController.ts`, `BiomeScene.ts`, `SpellButton`, `TownScene.test.ts`, `Player.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `SpawnDirector.ts`, `Spell.ts`, `CastBar.test.ts`, `Enemy.ts`, `BiomeScene.test.ts`, `Hero`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Frostbolt.ts`, `game.ts`, `Boss.ts`, `CastingController`, `Gem.ts`, `CastingController.ts`, `Enemy.test.ts`, `BiomeScene.ts`, `area.ts`, `BiomeScene`, `phaser`, `.constructor`, `Player.ts`, `Resource`, `SiphonSoul`, `EnemyOptions`, `Consecration`, `Enemy.ts`, `Boons.ts`, `Player`, `Multishot.ts`, `AssignSpell.ts`, `SnareTrap`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _477 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `gameReducer.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11522048364153627 - nodes in this community are weakly interconnected._