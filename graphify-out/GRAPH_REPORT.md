# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 270 files · ~418,212 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1878 nodes · 4156 edges · 110 communities (88 shown, 22 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d510f1e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- gameReducer.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- HUD.ts
- CastBar
- Frostbolt.ts
- devDependencies
- Stats.tsx
- CastingController.ts
- BiomeScene.ts
- MerchantModeToggle.tsx
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
- LoadScene.ts
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- TargetType
- vite.config.ts
- UI.tsx
- TownScene.test.ts
- Consecration
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- Armory.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- AssignClass.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- Attributes.tsx
- Resource
- react
- vercel.json
- Vercel deployment (Phase 6)
- Spell.ts
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- build
- armoryClient.ts
- vitest
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- phaser
- Boons.ts
- settingsStorage.ts
- Price.tsx
- TownScene.ts
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
- Enemy.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Item
- Invocation
- Player.ts
- targetVector
- GroupedStats.tsx
- Player.test.ts
- Boss.ts
- EnemyOptions
- Crafting
- Trap.test.ts
- Item.ts
- StatBar.tsx
- lodash

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

## Communities (110 total, 22 thin omitted)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.08
Nodes (8): classes, Faith, Frostbolt, Heal, ManaShield, Smite, Whirlwind, SpellOptions

### Community 2 - "gameReducer.ts"
Cohesion: 0.09
Nodes (42): Step 3 — Merchant shop, addComponent, buyComponent, buyGear, freshMerchant(), gameReducer, initState, Level (+34 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.15
Nodes (5): TownScene, clearTravelRequest, setCurrentArea, setPlayerPosition, toggleHUD

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "HUD.ts"
Cohesion: 0.14
Nodes (21): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+13 more)

### Community 8 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 9 - "Frostbolt.ts"
Cohesion: 0.12
Nodes (8): Boon, Enrage, EnrageValue, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue, EffectValue

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "CastingController.ts"
Cohesion: 0.20
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, CombatType

### Community 13 - "BiomeScene.ts"
Cohesion: 0.17
Nodes (10): rxjs, AssignType, AssignClass, MapStateOptions, state$, buildWalkability(), isFootprintSpawnable(), grid() (+2 more)

### Community 14 - "MerchantModeToggle.tsx"
Cohesion: 0.15
Nodes (15): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+7 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "store/index.ts"
Cohesion: 0.11
Nodes (24): @reduxjs/toolkit, GameState, RootState, ComponentStack, Equipment, Coins(), CoinsProps, src_ui_components_atoms_coins_module (+16 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (11): CastableSpell, CastingController, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub (+3 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (36): eslintConfig, description, engines, node, homepage, keywords, name, private (+28 more)

### Community 23 - "game.ts"
Cohesion: 0.10
Nodes (20): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, ComponentDef, EQUIPMENT_SLOTS, GAME_BALANCE (+12 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.07
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

### Community 31 - "LoadScene.ts"
Cohesion: 0.11
Nodes (9): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, createLogo(), LogoOptions, GameOverScene (+1 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.11
Nodes (9): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, BiomeScene, setBossActive, setEnemiesRemaining (+1 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "TargetType"
Cohesion: 0.14
Nodes (4): Fireball, SnareTrap, Trap, TargetType

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "UI.tsx"
Cohesion: 0.09
Nodes (28): Step 1 — Shop skeletons: open & close every shop (this PR), react-dnd-touch-backend, react-dom, react-redux, container, PhaserGame, requestTravel, toggleUi (+20 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.16
Nodes (16): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+8 more)

### Community 45 - "Armory.tsx"
Cohesion: 0.12
Nodes (17): buyLoot, selectCharacter, setCoins, toggleFilter, Button(), ButtonProps, src_ui_components_atoms_button_module, CharacterCard() (+9 more)

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

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.05
Nodes (21): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+13 more)

### Community 54 - "react"
Cohesion: 0.08
Nodes (37): react, react-dnd, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps (+29 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Spell.ts"
Cohesion: 0.16
Nodes (8): Multishot, SpellValue, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, SpellProjectileConfig, TargetKind

### Community 59 - "SpawnDirector"
Cohesion: 0.07
Nodes (17): AreaTuning, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view (+9 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "build"
Cohesion: 0.25
Nodes (8): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset(), tileLayer()

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 65 - "vitest"
Cohesion: 0.16
Nodes (9): @testing-library/react, vitest, helm, stacks, sampleItems, initialGame, seed(), seedParts() (+1 more)

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

### Community 77 - "phaser"
Cohesion: 0.15
Nodes (12): phaser, CraftingConfig, PlayerType, TODO: Abstract this capping functionality out as many spells might use., SpellButtonOptions, AreaEffect, OverlapTarget, dropIn() (+4 more)

### Community 78 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 79 - "settingsStorage.ts"
Cohesion: 0.14
Nodes (18): DEFAULT_AREA_TUNING, DEFAULT_SETTINGS, Settings, SETTINGS_KEY, StartLocation, writeSettings(), hintStyle, rowStyle (+10 more)

### Community 80 - "Price.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

### Community 81 - "TownScene.ts"
Cohesion: 0.18
Nodes (8): PlayerName, PhaserGame(), BiomeId, BootScene, GameSceneConfig, SelectScene, readSettings(), CharacterCardProps

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

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.15
Nodes (16): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+8 more)

### Community 92 - "Enemy.ts"
Cohesion: 0.13
Nodes (9): CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, Monster, WeaponConfig, EnemyAttributes (+1 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.12
Nodes (13): BIOME_IDS, BiomeDefinition, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), FakeDirector, FakeTimer (+5 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 99 - "Player.ts"
Cohesion: 0.10
Nodes (12): Hero, HeroConfig, Destination, DrawBarOptions, AssignResource(), AssignResourceType, AssignSpell, Weapon (+4 more)

### Community 100 - "targetVector"
Cohesion: 0.32
Nodes (4): clone(), targetVector(), TargetWithBody, VectorResult

### Community 101 - "GroupedStats.tsx"
Cohesion: 0.33
Nodes (6): PlayerStats, Stats(), GroupedAttributesProps, GroupedStats(), GroupedStatsProps, StatItem

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "Boss.ts"
Cohesion: 0.33
Nodes (3): ref_console, Boss, BOSS_SCALE

### Community 104 - "EnemyOptions"
Cohesion: 0.18
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 142 - "StatBar.tsx"
Cohesion: 0.23
Nodes (8): polished, getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 149 - "lodash"
Cohesion: 0.11
Nodes (11): lodash, Coin, COIN_BASE_VALUE, CoinConfig, Gem, GEM_BASE_VALUE, GemConfig, GemUnderTest (+3 more)

## Knowledge Gaps
- **458 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+453 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 743 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `HUD.ts`, `CastBar`, `BiomeScene.ts`, `StatBar.tsx`, `HUD.test.ts`, `store/index.ts`, `CastingController`, `lodash`, `package.json`, `Enemy.test.ts`, `operations/helpers.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `vite.config.ts`, `UI.tsx`, `TownScene.test.ts`, `area.ts`, `Spell.test.ts`, `Resource`, `Spell.ts`, `SpawnDirector`, `settingsStorage.ts`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `Invocation`, `targetVector`, `Player.test.ts`, `Trap.test.ts`?**
  _High betweenness centrality (0.214) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player`, `HUD.ts`, `CastBar`, `Frostbolt.ts`, `CastingController.ts`, `BiomeScene.ts`, `CastingController`, `lodash`, `package.json`, `game.ts`, `SpellButton`, `LoadScene.ts`, `TownScene.test.ts`, `Spell.test.ts`, `AssignClass.ts`, `Resource`, `Spell.ts`, `TownScene.ts`, `Enemy.ts`, `BiomeScene.test.ts`, `Player.ts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `Player` connect `Player` to `AssignSpell.ts`, `Player.ts`, `targetVector`, `GroupedStats.tsx`, `Player.test.ts`, `TownScene`, `CastBar`, `EnemyOptions`, `phaser`, `Boons.ts`, `BiomeScene.ts`, `AssignClass.ts`, `TownScene.ts`, `CastingController`, `Resource`, `game.ts`, `Spell.ts`, `Spell`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _458 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.13768115942028986 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08377896613190731 - nodes in this community are weakly interconnected._