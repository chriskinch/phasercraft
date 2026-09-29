# Graph Report - phasercraft  (2026-09-29)

## Corpus Check
- 290 files · ~444,468 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 2072 nodes · 4844 edges · 112 communities (89 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0c6e765d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player.ts
- UI
- game.ts
- Item
- LoadScene
- generateItem.ts
- compilerOptions
- HUD.test.ts
- fonts.ts
- Invocation.ts
- devDependencies
- CastingController.test.ts
- ItemTooltip.tsx
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
- Stats.tsx
- Enemy.test.ts
- Settings.tsx
- area.ts
- Blacksmith crafting UI — design spec
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- Character.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap.ts
- AssignClass.ts
- Blacksmith.tsx
- Projectile
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- CastingController.ts
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Phase 13 — Town shops system (issue TBD)
- CLAUDE.md — Working agreement and project conventions
- generate
- BossRoar.ts
- Resource
- react-redux
- vercel.json
- Vercel deployment (Phase 6)
- main.tsx
- InstallBanner.tsx
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- walkability.ts
- armoryClient.ts
- operations/helpers.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- react
- graphify reference: query, path, explain
- Item.ts
- CastBar
- settingsStorage.ts
- TownScene.ts
- AreaEffect.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- repository
- LootItem
- generate-biome-maps.mjs
- safeArea.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Special
- Faith
- BootScene
- Player
- Gem.test.ts
- EarthShield
- Player.test.ts
- build
- BiomeScene.ts
- Hero
- PhaserGame.tsx
- vitest
- gameReducer.ts
- TargetReticle.test.ts
- CastBar.test.ts
- phaser

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `vitest` - 69 edges
3. `Player` - 68 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 52 edges
7. `BiomeScene` - 46 edges
8. `SpellOptions` - 36 edges
9. `Button()` - 34 edges
10. `CastingController` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Step 4b — Schematic drops` --references--> `Crafting`  [INFERRED]
  docs/ROADMAP.md → src/entities/Loot/Crafting.ts
- `Step 4e — Craft SFX (first audio in the game) (#482)` --references--> `LoadScene`  [INFERRED]
  docs/ROADMAP.md → src/scenes/LoadScene.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts

## Import Cycles
- None detected.

## Communities (112 total, 23 thin omitted)

### Community 0 - "Player.ts"
Cohesion: 0.07
Nodes (17): MoveOptions, HeroConfig, Destination, DrawBarOptions, AssignSpell, classes, Fireball, Frostbolt (+9 more)

### Community 1 - "UI"
Cohesion: 0.07
Nodes (9): Code conventions, UI, mapStateToData(), FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest, TownScene (+1 more)

### Community 2 - "game.ts"
Cohesion: 0.07
Nodes (45): buyComponent, buyGear, MerchantState, refreshMerchant, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES (+37 more)

### Community 3 - "Item"
Cohesion: 0.14
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 4 - "LoadScene"
Cohesion: 0.33
Nodes (3): Sound (first audio in the game), createLogo(), LoadScene

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "HUD.test.ts"
Cohesion: 0.12
Nodes (8): AssignType, Boss, HUD_LAYOUT, HudUnderTest, BiomeDefinition, setBossActive, setEnemiesRemaining, EnemyType

### Community 8 - "fonts.ts"
Cohesion: 0.16
Nodes (8): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, bannerStyle(), FONT_FAMILY, FONT_URL, CombatTextConfig, LogoOptions, GameOverScene

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (17): Deferred / backlog, Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (11): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 12 - "ItemTooltip.tsx"
Cohesion: 0.20
Nodes (9): react-tooltip, Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module (+1 more)

### Community 13 - "EnemyOptions"
Cohesion: 0.18
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 14 - "Button"
Cohesion: 0.14
Nodes (24): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+16 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "SpellButton"
Cohesion: 0.07
Nodes (5): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SiphonSoul, SpellButton, ButtonUnderTest

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "Stats.tsx"
Cohesion: 0.17
Nodes (12): Stat(), Health(), HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem, Stats() (+4 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.17
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "Settings.tsx"
Cohesion: 0.19
Nodes (13): withGodModeGate(), autoSpawnRadius(), hintStyle, numberInputStyle, rowStyle, sectionStyle, Settings(), SPAWN_FIELDS (+5 more)

### Community 26 - "area.ts"
Cohesion: 0.13
Nodes (18): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+10 more)

### Community 27 - "Blacksmith crafting UI — design spec"
Cohesion: 0.16
Nodes (18): Decisions update (2026-07-30) — Town shops, Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+10 more)

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
Cohesion: 0.11
Nodes (22): polished, getResourceColour(), PlayerStats, Attribute(), Slot(), Attributes(), AttributesProps, AttributesStyles (+14 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.07
Nodes (13): uuid, CirclingConfig, Enemy, EnemyStates, HitParams, Monster, MonsterConfig, AssignResource() (+5 more)

### Community 34 - "BiomeScene"
Cohesion: 0.12
Nodes (6): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, BiomeScene

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.15
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 39 - "Blacksmith.tsx"
Cohesion: 0.11
Nodes (21): Step 4d — Special items (#481), Slots, colorForQuality(), SpecialItem, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module (+13 more)

### Community 40 - "Projectile"
Cohesion: 0.09
Nodes (11): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone() (+3 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "CastingController.ts"
Cohesion: 0.22
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

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
Cohesion: 0.24
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.22
Nodes (9): Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4b — Schematic drops, Step 4c — Schematic shop, Step 4e — Craft SFX (first audio in the game) (#482), Step 5 — Arcanum spell shop (scrolls) (+1 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 52 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 54 - "react-redux"
Cohesion: 0.12
Nodes (24): react-redux, sellComponent, sellComponentStack, sellLoot, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid() (+16 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "main.tsx"
Cohesion: 0.29
Nodes (7): react-dnd, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, src_styles_globals

### Community 58 - "InstallBanner.tsx"
Cohesion: 0.29
Nodes (8): InstallBanner(), src_ui_components_molecules_installbanner_module, ShareIcon(), BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (28): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+20 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "walkability.ts"
Cohesion: 0.36
Nodes (5): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 64 - "armoryClient.ts"
Cohesion: 0.33
Nodes (11): ApiItem, baseUrl(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock(), StoreItem (+3 more)

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

### Community 75 - "react"
Cohesion: 0.08
Nodes (38): Step 1 — Shop skeletons: open & close every shop (this PR), react, setMerchantMode, toggleUi, AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, StatProps (+30 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Item.ts"
Cohesion: 0.20
Nodes (7): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock

### Community 79 - "settingsStorage.ts"
Cohesion: 0.22
Nodes (5): DEFAULT_SETTINGS, Settings, SETTINGS_KEY, StartLocation, writeSettings()

### Community 80 - "TownScene.ts"
Cohesion: 0.19
Nodes (12): AssignClass, BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig (+4 more)

### Community 81 - "AreaEffect.ts"
Cohesion: 0.17
Nodes (4): Consecration, AreaEffect, OverlapTarget, ArcadeCollisionObject

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
Cohesion: 0.24
Nodes (15): Step 4a — Crafting core (this PR), Layout — forge (desktop), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat() (+7 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "LootItem"
Cohesion: 0.12
Nodes (25): buyLoot, equipLoot, selectLoot, toggleFilter, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps (+17 more)

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.10
Nodes (23): BIOMES, BOULDER, buildEntrance(), ENTRANCE, fade(), fence(), FENCE_SOLID, GATE (+15 more)

### Community 92 - "safeArea.ts"
Cohesion: 0.19
Nodes (16): ensureWatching(), getHudInsets(), hudInsets(), listeners, makeProbe(), NO_INSETS, readRawInsets(), refresh() (+8 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.11
Nodes (14): ref_console, BOSS_SCALE, FakeDirector, FakeTimer, makeExitScene(), makeGridScene(), makeOverlayScene(), makeScene() (+6 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.25
Nodes (8): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset(), tileLayer()

### Community 104 - "BiomeScene.ts"
Cohesion: 0.20
Nodes (15): rxjs, MapStateOptions, state$, bit(), isShoreBlocked(), NE, NW, SE (+7 more)

### Community 106 - "PhaserGame.tsx"
Cohesion: 0.33
Nodes (5): PhaserGame(), SelectScene, readSettings(), setSfxManager(), sfxGain()

### Community 109 - "vitest"
Cohesion: 0.12
Nodes (21): @testing-library/react, vitest, GameState, RootState, ComponentStack, RECIPES, CoinsProps, src_ui_components_atoms_coins_module (+13 more)

### Community 111 - "gameReducer.ts"
Cohesion: 0.09
Nodes (35): Step 3 — Merchant shop, PlayerName, addComponent, addSpecial, addXP, clearTravelRequest, consumeComponent(), craftedItem() (+27 more)

### Community 149 - "phaser"
Cohesion: 0.07
Nodes (26): lodash, phaser, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, Coin, COIN_BASE_VALUE (+18 more)

## Knowledge Gaps
- **494 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+489 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 792 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `UI`, `game.ts`, `generateItem.ts`, `HUD.test.ts`, `fonts.ts`, `Invocation.ts`, `CastingController.test.ts`, `Button`, `SpellButton`, `phaser`, `package.json`, `Enemy.test.ts`, `area.ts`, `handlers.test.ts`, `Character.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `Projectile`, `vite.config.ts`, `Spell.test.ts`, `BossRoar.ts`, `Resource`, `react-redux`, `SpawnDirector`, `walkability.ts`, `operations/helpers.ts`, `react`, `Item.ts`, `settingsStorage.ts`, `TownScene.ts`, `statConversion.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Special`, `Gem.test.ts`, `Player.test.ts`, `BiomeScene.ts`, `gameReducer.ts`, `TargetReticle.test.ts`, `CastBar.test.ts`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player.ts`, `UI`, `game.ts`, `fonts.ts`, `Invocation.ts`, `CastingController.test.ts`, `Button`, `SpellButton`, `package.json`, `Enemy`, `SnareTrap.ts`, `AssignClass.ts`, `Projectile`, `CastingController.ts`, `Spell.test.ts`, `BossRoar.ts`, `Resource`, `SpawnDirector`, `settingsStorage.ts`, `TownScene.ts`, `AreaEffect.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `BiomeScene.ts`, `PhaserGame.tsx`, `TargetReticle.test.ts`, `CastBar.test.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Player.ts`, `BiomeScene`, `Player`, `game.ts`, `SnareTrap.ts`, `HUD.test.ts`, `Projectile`, `Invocation.ts`, `BiomeScene.ts`, `CastingController.ts`, `EnemyOptions`, `AreaEffect.ts`, `SpellButton`, `CastingController`, `phaser`, `Enemy.test.ts`, `area.ts`, `BiomeScene.test.ts`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _494 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07180851063829788 - nodes in this community are weakly interconnected._
- **Should `UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06787330316742081 - nodes in this community are weakly interconnected._