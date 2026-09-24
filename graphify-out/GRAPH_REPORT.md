# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 270 files · ~417,107 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1872 nodes · 4134 edges · 104 communities (83 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fcd29ff3`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Faith
- gameReducer.ts
- Item
- TownScene
- generateItem.ts
- compilerOptions
- vitest
- CastBar
- AssignSpell.ts
- devDependencies
- Stats.tsx
- CastingController.ts
- BiomeScene.ts
- react
- StoredItem
- items/index.ts
- HUD.test.ts
- store/index.ts
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
- phaser
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap.ts
- vite.config.ts
- UI.tsx
- TownScene.test.ts
- AreaEffect.ts
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- CharacterCard.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Player.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- lodash
- Resource
- LootItem
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- build
- armoryClient.ts
- Hero
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- Tilemaps
- Boons.ts
- walkability.ts
- Price.tsx
- CombatText
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
- engines
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Invocation
- .constructor
- Player.test.ts
- Healer
- Item.ts
- StatBar.tsx
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 57 edges
6. `phaser` - 42 edges
7. `BiomeScene` - 40 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Resource` - 30 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts

## Import Cycles
- None detected.

## Communities (104 total, 21 thin omitted)

### Community 2 - "gameReducer.ts"
Cohesion: 0.07
Nodes (52): CraftingConfig, addComponent, addXP, buyComponent, buyGear, buyLoot, freshMerchant(), gameReducer (+44 more)

### Community 3 - "Item"
Cohesion: 0.13
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.15
Nodes (5): TownScene, clearTravelRequest, setCurrentArea, setPlayerPosition, toggleHUD

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.09
Nodes (30): @testing-library/react, vitest, LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS (+22 more)

### Community 8 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 9 - "AssignSpell.ts"
Cohesion: 0.07
Nodes (15): classes, Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, ManaShield (+7 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "CastingController.ts"
Cohesion: 0.19
Nodes (9): PlayerType, ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, SpellButtonOptions (+1 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.13
Nodes (16): ref_console, rxjs, AssignType, Boss, BOSS_SCALE, AssignClass, MapStateOptions, mapStateToData() (+8 more)

### Community 14 - "react"
Cohesion: 0.13
Nodes (20): react, setMerchantMode, unequipLoot, DroppableSlot(), src_ui_components_atoms_droppableslot_module, Title(), TitleProps, MERCHANT_ACTIVE_BLUE (+12 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "store/index.ts"
Cohesion: 0.11
Nodes (26): react-redux, @reduxjs/toolkit, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module (+18 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (12): CastableSpell, CastingController, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub (+4 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (32): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+24 more)

### Community 23 - "game.ts"
Cohesion: 0.07
Nodes (28): classes, CirclingConfig, EnemyStates, EnemyStats, HitParams, Melee, Ranged, AdjustValue (+20 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.18
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "Spell"
Cohesion: 0.10
Nodes (6): MoveOptions, Fireball, Heal, Spell, SpellProjectileConfig, TargetType

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.06
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton, ButtonUnderTest, TargetReticle, GraphicsStub, ReticleUnderTest

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
Nodes (31): phaser, react-dnd-touch-backend, react-dom, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig (+23 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.08
Nodes (5): Enemy, Monster, MonsterConfig, AssignResource(), Whirlwind

### Community 34 - "BiomeScene"
Cohesion: 0.15
Nodes (4): BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.13
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "UI.tsx"
Cohesion: 0.09
Nodes (27): Step 1 — Shop skeletons: open & close every shop (this PR), polished, requestTravel, toggleUi, Button(), ButtonProps, src_ui_components_atoms_button_module, InstallBanner() (+19 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 41 - "AreaEffect.ts"
Cohesion: 0.18
Nodes (4): Consecration, AreaEffect, OverlapTarget, ArcadeCollisionObject

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.17
Nodes (15): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK, SPAWN_CONE_HALF_ANGLE_DEG (+7 more)

### Community 45 - "CharacterCard.tsx"
Cohesion: 0.47
Nodes (5): PlayerName, setCoins, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module

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
Cohesion: 0.17
Nodes (11): classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions, Ranger (+3 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.33
Nodes (5): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "lodash"
Cohesion: 0.13
Nodes (16): lodash, PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles (+8 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, Health, HealthOptions, Mana (+12 more)

### Community 54 - "LootItem"
Cohesion: 0.08
Nodes (31): react-dnd, equipLoot, selectLoot, LootItem, DroppableSlotProps, LootIcon(), LootIconProps, LootIconStyles (+23 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.13
Nodes (9): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone(), targetVector(), TargetWithBody (+1 more)

### Community 59 - "SpawnDirector"
Cohesion: 0.06
Nodes (18): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+10 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "build"
Cohesion: 0.22
Nodes (9): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset() (+1 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

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
Cohesion: 0.25
Nodes (8): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 3 — Merchant shop, Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 78 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 79 - "walkability.ts"
Cohesion: 0.43
Nodes (4): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityInput

### Community 80 - "Price.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

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
Nodes (15): react-tooltip, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion (+7 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.15
Nodes (16): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+8 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.16
Nodes (9): WalkabilityGrid, BIOMES, FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest (+1 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 99 - ".constructor"
Cohesion: 0.15
Nodes (4): AssignSpell, Weapon, WeaponConfig, setLevel

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 134 - "Item.ts"
Cohesion: 0.17
Nodes (9): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock (+1 more)

### Community 142 - "StatBar.tsx"
Cohesion: 0.25
Nodes (7): getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 149 - "Gem.ts"
Cohesion: 0.09
Nodes (11): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, Gem, GEM_BASE_VALUE, GemConfig, GemUnderTest (+3 more)

## Knowledge Gaps
- **454 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+449 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 739 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `CastBar`, `StatBar.tsx`, `react`, `HUD.test.ts`, `store/index.ts`, `CastingController`, `Gem.ts`, `package.json`, `Enemy.test.ts`, `operations/helpers.ts`, `SpellButton`, `handlers.test.ts`, `phaser`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `vite.config.ts`, `UI.tsx`, `TownScene.test.ts`, `area.ts`, `Spell.test.ts`, `Resource`, `LootItem`, `Projectile`, `SpawnDirector`, `walkability.ts`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `Invocation`, `Player.test.ts`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `gameReducer.ts`, `vitest`, `CastBar`, `AssignSpell.ts`, `CastingController.ts`, `BiomeScene.ts`, `CastingController`, `Gem.ts`, `package.json`, `game.ts`, `SpellButton`, `Enemy`, `SnareTrap.ts`, `TownScene.test.ts`, `AreaEffect.ts`, `Spell.test.ts`, `Player.ts`, `Resource`, `Projectile`, `Hero`, `CombatText`, `BiomeScene.test.ts`, `.constructor`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `lodash` connect `lodash` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `Stats.tsx`, `BiomeScene.ts`, `Player.ts`, `Gem.ts`, `package.json`, `game.ts`, `Resource`, `operations/helpers.ts`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _454 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06829488919041157 - nodes in this community are weakly interconnected._