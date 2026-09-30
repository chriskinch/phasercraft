# Graph Report - phasercraft  (2026-09-30)

## Corpus Check
- 297 files · ~446,282 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 69 file(s) not represented in the graph (top: .css 44, (none) 8, .psd 5)

## Summary
- 2095 nodes · 4946 edges · 107 communities (81 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `00b42f92`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- game.ts
- TownScene
- Merchant.tsx
- Item
- AimedShot.test.ts
- generateItem.ts
- compilerOptions
- Resource
- PhaserGame.tsx
- Invocation.ts
- devDependencies
- CastingController.test.ts
- Blacksmith.tsx
- EnemyOptions
- Button
- StoredItem
- items/index.ts
- SpellButton
- Spell
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- operations/helpers.ts
- Enemy.test.ts
- phaser
- area.ts
- Blacksmith crafting UI — design spec
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- Equipment.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap
- AssignClass.ts
- Stats.tsx
- Projectile
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- EarthShield
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Phase 13 — Town shops system (issue TBD)
- CLAUDE.md — Working agreement and project conventions
- generate
- CastBar.test.ts
- Player.ts
- react
- vercel.json
- Vercel deployment (Phase 6)
- UI
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- gameReducer.ts
- armoryClient.ts
- Faith
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- UI.tsx
- graphify reference: query, path, explain
- CastBar
- TownScene.ts
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- TownScene.test.ts
- generate-biome-maps.mjs
- safeArea.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Player
- Stat.tsx
- Player.test.ts
- build
- shoreCollision.ts
- .constructor
- vitest
- TargetReticle.test.ts
- sfx.ts
- BiomeScene.ts
- InstallBanner.tsx
- .spawnHost

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `vitest` - 73 edges
3. `Player` - 68 edges
4. `react` - 60 edges
5. `Spell` - 60 edges
6. `phaser` - 54 edges
7. `BiomeScene` - 46 edges
8. `SpellOptions` - 39 edges
9. `Button()` - 34 edges
10. `CastingController` - 33 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Step 4b — Schematic drops` --references--> `Crafting`  [INFERRED]
  docs/ROADMAP.md → src/entities/Loot/Crafting.ts
- `Step 4e — Craft SFX (first audio in the game) (#482)` --references--> `LoadScene`  [INFERRED]
  docs/ROADMAP.md → src/scenes/LoadScene.ts
- `Decisions update (2026-07-30) — Town shops` --references--> `Recipe`  [INFERRED]
  docs/ROADMAP.md → src/types/game.ts

## Import Cycles
- None detected.

## Communities (107 total, 26 thin omitted)

### Community 0 - "game.ts"
Cohesion: 0.06
Nodes (30): AimedShot, AssignSpell, classes, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield (+22 more)

### Community 2 - "Merchant.tsx"
Cohesion: 0.10
Nodes (26): react-tooltip, buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, COMPONENT_TYPES, componentBuyPrice() (+18 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (16): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+8 more)

### Community 4 - "AimedShot.test.ts"
Cohesion: 0.17
Nodes (5): AimedShotStub, ControllerStub, TargetStub, ProjectileTarget, ProjectileUnderTest

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (26): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+18 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "Resource"
Cohesion: 0.06
Nodes (15): Energy, EnergyOptions, Health, HealthOptions, ManaOptions, Rage, RageOptions, Resource (+7 more)

### Community 8 - "PhaserGame.tsx"
Cohesion: 0.05
Nodes (24): Sound (first audio in the game), AnimationConfig, createAnimations(), EnemyConfig, EnemyType, bannerStyle(), FONT_FAMILY, FONT_URL (+16 more)

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (16): Deferred / backlog, Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 12 - "Blacksmith.tsx"
Cohesion: 0.21
Nodes (11): craftItem, RECIPES, SpecialItem, Blacksmith(), EMPTY_SPECIAL_TINT, materialEntries(), RARITY_TINT, Slot() (+3 more)

### Community 13 - "EnemyOptions"
Cohesion: 0.16
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 14 - "Button"
Cohesion: 0.11
Nodes (26): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+18 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "SpellButton"
Cohesion: 0.08
Nodes (6): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), HUD_LAYOUT, HudUnderTest, SpellButton, ButtonUnderTest

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.17
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "phaser"
Cohesion: 0.10
Nodes (18): phaser, COIN_BASE_VALUE, CoinConfig, PlayerType, ActiveCast, CasterLike, CastingControllerOptions, CastingState (+10 more)

### Community 26 - "area.ts"
Cohesion: 0.16
Nodes (14): Step 4d — Special items (#481), AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+6 more)

### Community 27 - "Blacksmith crafting UI — design spec"
Cohesion: 0.19
Nodes (17): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+9 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (11): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+3 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "Equipment.tsx"
Cohesion: 0.13
Nodes (16): polished, getResourceColour(), sellComponent, sellComponentStack, sellLoot, Slot(), DetailedLoot(), StatBar() (+8 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.09
Nodes (6): Enemy, EnemyStats, Monster, MonsterConfig, EnemyAttributes, EnemyConfig

### Community 34 - "BiomeScene"
Cohesion: 0.11
Nodes (8): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, resolveAreaTuning(), BiomeScene, setCurrentArea

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap"
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 39 - "Stats.tsx"
Cohesion: 0.21
Nodes (9): PlayerStats, StatItem, Stats(), StatsProps, StatsStyles, GroupedAttributesProps, GroupedStats(), GroupedStatsProps (+1 more)

### Community 40 - "Projectile"
Cohesion: 0.12
Nodes (8): Multishot, Whirlwind, Projectile, ProjectileOptions, clone(), targetVector(), TargetWithBody, VectorResult

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 45 - "vite.config.ts"
Cohesion: 0.22
Nodes (5): vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.24
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.18
Nodes (11): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 3 — Merchant shop, Step 4 — Blacksmith crafting, Step 4b — Schematic drops, Step 4c — Schematic shop (+3 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 53 - "Player.ts"
Cohesion: 0.08
Nodes (23): lodash, uuid, CirclingConfig, EnemyStates, HitParams, MoveOptions, HeroConfig, Destination (+15 more)

### Community 54 - "react"
Cohesion: 0.09
Nodes (38): react, react-redux, selectLoot, unequipLoot, RootState, LootItem, DroppableSlot(), DroppableSlotProps (+30 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (29): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+21 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 63 - "gameReducer.ts"
Cohesion: 0.09
Nodes (36): PlayerName, addCoins, addComponent, addSpecial, addXP, buyLoot, clearTravelRequest, consumeComponent() (+28 more)

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
Nodes (5): sharp, BG, ICON_DIR, root, SOURCE

### Community 75 - "UI.tsx"
Cohesion: 0.07
Nodes (30): Step 1 — Shop skeletons: open & close every shop (this PR), react-dnd, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, setMerchantMode (+22 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 80 - "TownScene.ts"
Cohesion: 0.18
Nodes (9): AssignClass, BIOME_IDS, BiomeDefinition, BiomeId, BiomeMap, DEFAULT_BIOME, resolveBiome(), GameSceneConfig (+1 more)

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
Nodes (17): Layout — forge (desktop), specialBonusRow(), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat() (+9 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "TownScene.test.ts"
Cohesion: 0.22
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.10
Nodes (23): BIOMES, BOULDER, buildEntrance(), ENTRANCE, fade(), fence(), FENCE_SOLID, GATE (+15 more)

### Community 92 - "safeArea.ts"
Cohesion: 0.19
Nodes (16): ensureWatching(), getHudInsets(), hudInsets(), listeners, makeProbe(), NO_INSETS, readRawInsets(), refresh() (+8 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.12
Nodes (13): BIOMES, FakeDirector, FakeTimer, makeExitScene(), makeGridScene(), makeOverlayScene(), makeScene(), makeStartScene() (+5 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 100 - "Stat.tsx"
Cohesion: 0.14
Nodes (12): Attribute(), AttributeProps, Stat(), StatProps, Attributes(), AttributesProps, AttributesStyles, Health() (+4 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.25
Nodes (8): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset(), tileLayer()

### Community 104 - "shoreCollision.ts"
Cohesion: 0.27
Nodes (12): bit(), isShoreBlocked(), NE, NW, SE, SHORE_ART_SIZE, SHORE_CELL, SHORE_EDGE (+4 more)

### Community 109 - "vitest"
Cohesion: 0.07
Nodes (30): @testing-library/react, vitest, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, withGodModeGate() (+22 more)

### Community 114 - "sfx.ts"
Cohesion: 0.06
Nodes (19): Coin, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE, GemConfig, GemUnderTest, Collectable (+11 more)

### Community 117 - "BiomeScene.ts"
Cohesion: 0.19
Nodes (11): Code conventions, rxjs, BOSS_SCALE, MapStateOptions, mapStateToData(), state$, buildWalkability(), isFootprintSpawnable() (+3 more)

### Community 119 - "InstallBanner.tsx"
Cohesion: 0.29
Nodes (7): InstallBanner(), ShareIcon(), BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 120 - ".spawnHost"
Cohesion: 0.23
Nodes (5): AssignType, Boss, setBossActive, setEnemiesRemaining, EnemyType

## Knowledge Gaps
- **490 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+485 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 797 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `game.ts`, `Merchant.tsx`, `Item`, `AimedShot.test.ts`, `generateItem.ts`, `Resource`, `PhaserGame.tsx`, `Invocation.ts`, `CastingController.test.ts`, `Button`, `SpellButton`, `package.json`, `operations/helpers.ts`, `Enemy.test.ts`, `area.ts`, `handlers.test.ts`, `Equipment.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap`, `Projectile`, `vite.config.ts`, `Spell.test.ts`, `CastBar.test.ts`, `react`, `SpawnDirector`, `gameReducer.ts`, `UI.tsx`, `ItemTooltip.tsx`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Stat.tsx`, `Player.test.ts`, `shoreCollision.ts`, `TargetReticle.test.ts`, `sfx.ts`, `BiomeScene.ts`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `game.ts`, `PhaserGame.tsx`, `Invocation.ts`, `CastingController.test.ts`, `Button`, `SpellButton`, `package.json`, `Enemy`, `AssignClass.ts`, `Projectile`, `Spell.test.ts`, `CastBar.test.ts`, `Player.ts`, `SpawnDirector`, `TownScene.ts`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `TargetReticle.test.ts`, `sfx.ts`, `BiomeScene.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `game.ts`, `BiomeScene`, `Player`, `SnareTrap`, `Projectile`, `Invocation.ts`, `EnemyOptions`, `Consecration`, `CastingController`, `Player.ts`, `BiomeScene.ts`, `.spawnHost`, `Enemy.test.ts`, `SiphonSoul`, `phaser`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _490 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05721153846153846 - nodes in this community are weakly interconnected._
- **Should `Merchant.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._