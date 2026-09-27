# Graph Report - phasercraft  (2026-09-27)

## Corpus Check
- 277 files · ~428,523 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1951 nodes · 4408 edges · 116 communities (88 shown, 28 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5d5811c5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- Spell
- gameReducer.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- react-redux
- BossRoar.ts
- AssignSpell.ts
- devDependencies
- Stats.tsx
- game.ts
- BiomeScene.ts
- LootItem
- StoredItem
- items/index.ts
- HUD.test.ts
- react
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- EnemyOptions
- Enemy.test.ts
- TownScene.ts
- area.ts
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
- SnareTrap
- PartsShopGrid.tsx
- Armory.tsx
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- AssignClass.ts
- Dialog.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- mapStateToData
- generate
- Attributes.tsx
- Resource
- SpawnDebugOverlay.ts
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
- SiphonSoul
- SpawnHost
- qa-review.md
- log.js
- vite-env.d.ts
- build
- armoryClient.ts
- SpawnDirector
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- .constructor
- UI.tsx
- vitest
- Item
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- SpawnDirector.ts
- generate-biome-maps.mjs
- PhaserGame.tsx
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Boons.ts
- fonts.ts
- Player
- Player.ts
- EarthShield
- Player.test.ts
- SpawnDirector.test.ts
- GameOverScene
- Invocation
- Tilemaps
- GroupedStats.tsx
- Faith
- Whirlwind
- Price.tsx
- BootScene
- SelectScene
- Item.ts
- Character.tsx
- lodash

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `vitest` - 61 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 47 edges
7. `BiomeScene` - 43 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Button()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Reconciling with Step 4a (PR #448)` --references--> `formatStatValue()`  [INFERRED]
  docs/specs/blacksmith-crafting-ui.md → src/lib/statConversion.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts

## Import Cycles
- None detected.

## Communities (116 total, 28 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.09
Nodes (41): Step 3 — Merchant shop, addCoins, addComponent, addXP, buyComponent, buyGear, freshMerchant(), gameReducer (+33 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.13
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "react-redux"
Cohesion: 0.08
Nodes (35): Step 1 — Shop skeletons: open & close every shop (this PR), polished, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, requestTravel (+27 more)

### Community 8 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 9 - "AssignSpell.ts"
Cohesion: 0.12
Nodes (8): Boon, Enrage, EnrageValue, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue, EffectValue

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.15
Nodes (14): src_ui_components_atoms_stat_module, Stat(), StatProps, Health(), HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module (+6 more)

### Community 12 - "game.ts"
Cohesion: 0.06
Nodes (28): EnemyStats, Consecration, AreaEffect, OverlapTarget, AdjustValue, ArcadeCollisionObject, CHARACTER_BASE_STATS, CharacterData (+20 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.43
Nodes (4): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityInput

### Community 14 - "LootItem"
Cohesion: 0.14
Nodes (20): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, helm (+12 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "react"
Cohesion: 0.13
Nodes (22): react-redux, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, stacks, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid() (+14 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (16): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 1 — CI quality gates, Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done) (+8 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+25 more)

### Community 23 - "EnemyOptions"
Cohesion: 0.16
Nodes (6): AssignType, classes, Healer, Melee, Ranged, EnemyOptions

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "TownScene.ts"
Cohesion: 0.11
Nodes (24): lodash, rxjs, AssignClass, classes, PlayerConfig, PlayerName, PlayerType, LabelledContainer (+16 more)

### Community 26 - "area.ts"
Cohesion: 0.17
Nodes (15): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+7 more)

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

### Community 31 - "LoadScene.ts"
Cohesion: 0.19
Nodes (7): Sound (first audio in the game), AnimationConfig, createAnimations(), EnemyConfig, EnemyType, createLogo(), LoadScene

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.09
Nodes (4): Enemy, Monster, MonsterConfig, AssignResource()

### Community 34 - "BiomeScene"
Cohesion: 0.11
Nodes (9): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, BiomeScene, setBossActive, setEnemiesRemaining (+1 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap"
Cohesion: 0.15
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "PartsShopGrid.tsx"
Cohesion: 0.15
Nodes (22): @testing-library/react, vitest, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+14 more)

### Community 39 - "Armory.tsx"
Cohesion: 0.31
Nodes (7): buyLoot, toggleFilter, Stock(), Armory(), src_ui_components_templates_armory_module, SortKey, sampleItems

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "AssignClass.ts"
Cohesion: 0.13
Nodes (11): Cleric, Mage, Occultist, Destination, DrawBarOptions, Ranger, Warrior, AssignResourceName (+3 more)

### Community 45 - "Dialog.tsx"
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

### Community 50 - "mapStateToData"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 52 - "Attributes.tsx"
Cohesion: 0.19
Nodes (11): PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module (+3 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions, Rage (+12 more)

### Community 54 - "SpawnDebugOverlay.ts"
Cohesion: 0.21
Nodes (10): coneEdges(), countdownLabel(), OverlayEnemy, SpawnDebugOverlay, SpawnDebugSource, fakeGraphics(), fakeText(), makeOverlay() (+2 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.19
Nodes (5): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 59 - "SpawnHost"
Cohesion: 0.07
Nodes (18): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+10 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "build"
Cohesion: 0.17
Nodes (14): GameState, loadGame, RootState, Equipment, CoinsProps, src_ui_components_atoms_coins_module, ItemTooltipProps, initialGame (+6 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 65 - "SpawnDirector"
Cohesion: 0.15
Nodes (12): Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown, Reconciling with Step 4a (PR #448) (+4 more)

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

### Community 78 - "UI.tsx"
Cohesion: 0.16
Nodes (17): react, setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle() (+9 more)

### Community 79 - "vitest"
Cohesion: 0.11
Nodes (20): writeSettings(), InstallBanner(), src_ui_components_molecules_installbanner_module, ShareIcon(), autoSpawnRadius(), hintStyle, numberInputStyle, rowStyle (+12 more)

### Community 80 - "Item"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 81 - "Consecration"
Cohesion: 0.31
Nodes (3): CastBarStart, CastBarUnderTest, GraphicsStub

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
Cohesion: 0.16
Nodes (18): Layout — forge (desktop), react-tooltip, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat() (+10 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.10
Nodes (24): BIOMES, BOULDER, buildEntrance(), ENTRANCE, fade(), fence(), FENCE_SOLID, GATE (+16 more)

### Community 92 - "PhaserGame.tsx"
Cohesion: 0.39
Nodes (4): Boons, StatusEffect, setStats, updateStats

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.11
Nodes (14): ref_console, Boss, BOSS_SCALE, WalkabilityGrid, BIOMES, FakeDirector, FakeTimer, makeGridScene() (+6 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "Boons.ts"
Cohesion: 0.24
Nodes (4): Deferred / backlog, Banes, IndexableStats, StatusEffects

### Community 98 - "fonts.ts"
Cohesion: 0.18
Nodes (9): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, phaser, ref_styles_fonts_boldpixels_woff2_url, bannerStyle(), FONT_FAMILY, FONT_URL, CombatTextConfig, LogoOptions (+1 more)

### Community 100 - "Player.ts"
Cohesion: 0.12
Nodes (17): CirclingConfig, EnemyStates, HitParams, MoveOptions, ActiveCast, CasterLike, CastingControllerOptions, CastingState (+9 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 104 - "GameOverScene"
Cohesion: 0.38
Nodes (4): clone(), targetVector(), TargetWithBody, VectorResult

### Community 107 - "GroupedStats.tsx"
Cohesion: 0.67
Nodes (3): Phase 7 — Armory migration to Vercel (non-destructive; issue TBD), PR1 — Legacy contract baseline (pre-step) ✅ this PR, PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)

### Community 108 - "Faith"
Cohesion: 0.08
Nodes (8): classes, Faith, Fireball, Frostbolt, Heal, ManaShield, Smite, SpellOptions

### Community 112 - "SelectScene"
Cohesion: 0.26
Nodes (7): PhaserGame(), SelectScene, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation

### Community 134 - "Item.ts"
Cohesion: 0.17
Nodes (9): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock (+1 more)

### Community 142 - "Character.tsx"
Cohesion: 0.10
Nodes (23): react-dnd, getResourceColour(), LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, Slot(), DetailedLoot() (+15 more)

### Community 149 - "lodash"
Cohesion: 0.09
Nodes (11): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE, GemConfig (+3 more)

## Knowledge Gaps
- **477 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+472 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 765 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `PartsShopGrid.tsx` to `CastingController.test.ts`, `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `react-redux`, `BossRoar.ts`, `BiomeScene.ts`, `Character.tsx`, `LootItem`, `HUD.test.ts`, `react`, `lodash`, `package.json`, `Enemy.test.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `SnareTrap`, `Armory.tsx`, `TownScene.test.ts`, `Dialog.tsx`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `SpawnDebugOverlay.ts`, `Projectile`, `SpawnHost`, `build`, `UI.tsx`, `vitest`, `Item`, `Consecration`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `fonts.ts`, `Player.test.ts`, `GameOverScene`, `Invocation`, `SelectScene`?**
  _High betweenness centrality (0.218) - this node is a cross-community bridge._
- **Why does `phaser` connect `fonts.ts` to `CastingController.test.ts`, `BossRoar.ts`, `AssignSpell.ts`, `game.ts`, `lodash`, `package.json`, `TownScene.ts`, `SpellButton`, `LoadScene.ts`, `Enemy`, `SnareTrap`, `TownScene.test.ts`, `TargetReticle`, `AssignClass.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `SpawnDebugOverlay.ts`, `Projectile`, `.constructor`, `Consecration`, `BiomeScene.test.ts`, `Player.ts`, `Tilemaps`, `SelectScene`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `AssignSpell.ts`, `game.ts`, `CastingController`, `EnemyOptions`, `Enemy.test.ts`, `TownScene.ts`, `area.ts`, `BiomeScene`, `SnareTrap`, `AssignClass.ts`, `Projectile`, `SiphonSoul`, `BiomeScene.test.ts`, `Boons.ts`, `Player`, `Player.ts`, `Tilemaps`, `Faith`, `Whirlwind`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _477 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._