# Graph Report - phasercraft  (2026-09-29)

## Corpus Check
- 295 files · ~446,021 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 69 file(s) not represented in the graph (top: .css 44, (none) 8, .psd 5)

## Summary
- 2080 nodes · 4904 edges · 120 communities (97 shown, 23 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2bbe3012`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- TownScene
- Merchant.tsx
- Item
- Tilemaps
- generateItem.ts
- compilerOptions
- Resource
- fonts.ts
- Invocation.ts
- devDependencies
- CastingController.test.ts
- Blacksmith.tsx
- EnemyOptions
- vitest
- StoredItem
- items/index.ts
- SpellButton
- Spell
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- SpawnDebugOverlay.ts
- Enemy.test.ts
- Enemy.ts
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
- game.ts
- LootItem
- Projectile
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- SpawnHost
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Phase 13 — Town shops system (issue TBD)
- CLAUDE.md — Working agreement and project conventions
- generate
- BossRoar.ts
- BiomeScene.ts
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
- operations/helpers.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- UI.tsx
- graphify reference: query, path, explain
- PhaserGame.tsx
- ItemTooltip.tsx
- Settings.tsx
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
- TownScene.test.ts
- generate-biome-maps.mjs
- safeArea.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Special
- Stats.tsx
- .spawnHost
- Player
- Stat.tsx
- SpawnDirector.ts
- Player.test.ts
- build
- shoreCollision.ts
- SpawnDirector.test.ts
- EarthShield
- spawnStyle.test.ts
- sfx.ts
- store/index.ts
- .startArea
- LoadScene.ts
- TargetReticle.test.ts
- Gem
- Coin.ts
- pickupSound.test.ts
- HUD.test.ts
- walkability.ts
- Trap.test.ts
- settingsStorage.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 86 edges
2. `vitest` - 72 edges
3. `Player` - 68 edges
4. `react` - 60 edges
5. `Spell` - 58 edges
6. `phaser` - 53 edges
7. `BiomeScene` - 46 edges
8. `SpellOptions` - 36 edges
9. `Button()` - 34 edges
10. `CastingController` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Step 4b — Schematic drops` --references--> `Crafting`  [INFERRED]
  docs/ROADMAP.md → src/entities/Loot/Crafting.ts
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Step 4e — Craft SFX (first audio in the game) (#482)` --references--> `LoadScene`  [INFERRED]
  docs/ROADMAP.md → src/scenes/LoadScene.ts
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts

## Import Cycles
- None detected.

## Communities (120 total, 23 thin omitted)

### Community 0 - "Button"
Cohesion: 0.13
Nodes (19): buyLoot, requestTravel, toggleFilter, toggleUi, Button(), ButtonProps, src_ui_components_atoms_button_module, InstallBanner() (+11 more)

### Community 2 - "Merchant.tsx"
Cohesion: 0.10
Nodes (30): Step 3 — Merchant shop, buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, COMPONENT_DEFS, COMPONENT_TYPES (+22 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (16): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+8 more)

### Community 4 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "Resource"
Cohesion: 0.08
Nodes (6): Rage, Resource, ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest, Shield

### Community 8 - "fonts.ts"
Cohesion: 0.19
Nodes (6): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, bannerStyle(), FONT_FAMILY, FONT_URL, GameOverScene

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (17): Deferred / backlog, Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 12 - "Blacksmith.tsx"
Cohesion: 0.21
Nodes (12): craftItem, RECIPES, SpecialItem, Blacksmith(), EMPTY_SPECIAL_TINT, materialEntries(), src_ui_components_templates_blacksmith_module, RARITY_TINT (+4 more)

### Community 13 - "EnemyOptions"
Cohesion: 0.18
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 14 - "vitest"
Cohesion: 0.16
Nodes (20): vitest, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave() (+12 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "SpellButton"
Cohesion: 0.07
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

### Community 18 - "Spell"
Cohesion: 0.06
Nodes (12): classes, Faith, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield, Smite (+4 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (34): eslintConfig, description, engines, node, homepage, keywords, name, private (+26 more)

### Community 23 - "SpawnDebugOverlay.ts"
Cohesion: 0.21
Nodes (10): coneEdges(), countdownLabel(), OverlayEnemy, SpawnDebugOverlay, SpawnDebugSource, fakeGraphics(), fakeText(), makeOverlay() (+2 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.17
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "Enemy.ts"
Cohesion: 0.07
Nodes (33): phaser, CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, GEM_BASE_VALUE, GemConfig (+25 more)

### Community 26 - "area.ts"
Cohesion: 0.16
Nodes (15): Step 4d — Special items (#481), AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+7 more)

### Community 27 - "Blacksmith crafting UI — design spec"
Cohesion: 0.19
Nodes (17): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+9 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (16): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+8 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "Equipment.tsx"
Cohesion: 0.12
Nodes (21): polished, getResourceColour(), sellComponent, sellComponentStack, sellLoot, Slot(), DetailedLoot(), src_ui_components_molecules_detailedloot_module (+13 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.09
Nodes (5): Enemy, Monster, MonsterConfig, AssignResource(), Whirlwind

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap"
Cohesion: 0.16
Nodes (3): SnareTrap, FakeEnemy, Trap

### Community 38 - "game.ts"
Cohesion: 0.07
Nodes (32): uuid, classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions (+24 more)

### Community 39 - "LootItem"
Cohesion: 0.17
Nodes (14): unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, helm, src_ui_components_atoms_slot_module, SlotComponentProps (+6 more)

### Community 40 - "Projectile"
Cohesion: 0.21
Nodes (4): Multishot, Projectile, ProjectileTarget, ProjectileUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

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
Cohesion: 0.20
Nodes (10): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4b — Schematic drops, Step 4c — Schematic shop, Step 4e — Craft SFX (first audio in the game) (#482) (+2 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 52 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 53 - "BiomeScene.ts"
Cohesion: 0.07
Nodes (25): ref_console, lodash, rxjs, Boss, BOSS_SCALE, AssignResourceName, AssignResourceType, classes (+17 more)

### Community 54 - "react"
Cohesion: 0.12
Nodes (35): react, react-redux, equipLoot, selectLoot, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module (+27 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 59 - "SpawnDirector"
Cohesion: 0.15
Nodes (4): Rect, SpawnDirector, SpawnedEnemy, killAll()

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "gameReducer.ts"
Cohesion: 0.10
Nodes (29): PlayerName, addCoins, addComponent, addSpecial, addXP, clearTravelRequest, consumeComponent(), craftedItem() (+21 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

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

### Community 75 - "UI.tsx"
Cohesion: 0.07
Nodes (38): Step 1 — Shop skeletons: open & close every shop (this PR), react-dnd, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, setMerchantMode (+30 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "PhaserGame.tsx"
Cohesion: 0.22
Nodes (4): PhaserGame(), BootScene, SelectScene, setSfxManager()

### Community 78 - "ItemTooltip.tsx"
Cohesion: 0.20
Nodes (9): react-tooltip, Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module (+1 more)

### Community 79 - "Settings.tsx"
Cohesion: 0.33
Nodes (8): withGodModeGate(), src_ui_components_templates_settings_module, Settings(), SPAWN_FIELDS, SpawnNumberField, SpawnOverrideRow(), SpawnOverrideRowProps, toNonNegativeInt()

### Community 80 - "TownScene.ts"
Cohesion: 0.23
Nodes (8): AssignClass, BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig

### Community 81 - "AreaEffect.ts"
Cohesion: 0.18
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
Cohesion: 0.30
Nodes (13): Layout — forge (desktop), specialBonusRow(), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat() (+5 more)

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
Cohesion: 0.13
Nodes (12): FakeDirector, FakeTimer, makeExitScene(), makeGridScene(), makeOverlayScene(), makeScene(), makeStartScene(), Marker (+4 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 96 - "Special"
Cohesion: 0.21
Nodes (3): Special, specialTextureKey(), SpecialUnderTest

### Community 97 - "Stats.tsx"
Cohesion: 0.21
Nodes (10): PlayerStats, src_ui_components_molecules_stats_module, StatItem, Stats(), StatsProps, StatsStyles, GroupedAttributesProps, GroupedStats() (+2 more)

### Community 98 - ".spawnHost"
Cohesion: 0.27
Nodes (5): AssignType, BiomeDefinition, setBossActive, setEnemiesRemaining, EnemyType

### Community 99 - "Player"
Cohesion: 0.07
Nodes (7): Hero, HeroConfig, Player, AssignSpell, Weapon, setLevel, CombatType

### Community 100 - "Stat.tsx"
Cohesion: 0.14
Nodes (16): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat(), StatProps, Attributes(), AttributesProps (+8 more)

### Community 101 - "SpawnDirector.ts"
Cohesion: 0.33
Nodes (8): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view, Tracked, autoSpawnRadius()

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.22
Nodes (9): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset() (+1 more)

### Community 104 - "shoreCollision.ts"
Cohesion: 0.27
Nodes (12): bit(), isShoreBlocked(), NE, NW, SE, SHORE_ART_SIZE, SHORE_CELL, SHORE_EDGE (+4 more)

### Community 105 - "SpawnDirector.test.ts"
Cohesion: 0.24
Nodes (5): AreaTuning, DEFAULT_AREA_TUNING, FakeEnemy, makeDirector(), seeded()

### Community 107 - "spawnStyle.test.ts"
Cohesion: 0.36
Nodes (6): dropIn(), DropInItem, DropInOptions, FakeBody, makeBody(), setup()

### Community 108 - "sfx.ts"
Cohesion: 0.48
Nodes (4): playSfx(), SFX, sfxGain(), SfxKey

### Community 109 - "store/index.ts"
Cohesion: 0.10
Nodes (20): @reduxjs/toolkit, @testing-library/react, DEFAULT_SETTINGS, writeSettings(), GameState, loadGame, STARTER_ITEMS, RootState (+12 more)

### Community 111 - "LoadScene.ts"
Cohesion: 0.17
Nodes (8): Sound (first audio in the game), AnimationConfig, createAnimations(), EnemyConfig, EnemyType, createLogo(), LogoOptions, LoadScene

### Community 114 - "Coin.ts"
Cohesion: 0.26
Nodes (5): COIN_BASE_VALUE, CoinConfig, CraftingConfig, coinValue(), getRandomVelocity()

### Community 115 - "pickupSound.test.ts"
Cohesion: 0.14
Nodes (3): Coin, Crafting, Collectable

### Community 117 - "walkability.ts"
Cohesion: 0.43
Nodes (4): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityInput

### Community 119 - "settingsStorage.ts"
Cohesion: 0.26
Nodes (9): readSettings(), Settings, SETTINGS_KEY, StartLocation, BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone() (+1 more)

## Knowledge Gaps
- **491 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+486 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 791 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Button`, `Merchant.tsx`, `Item`, `generateItem.ts`, `Resource`, `fonts.ts`, `Invocation.ts`, `CastingController.test.ts`, `SpellButton`, `package.json`, `SpawnDebugOverlay.ts`, `Enemy.test.ts`, `Enemy.ts`, `area.ts`, `handlers.test.ts`, `Equipment.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap`, `LootItem`, `Projectile`, `vite.config.ts`, `Spell.test.ts`, `BossRoar.ts`, `react`, `gameReducer.ts`, `operations/helpers.ts`, `UI.tsx`, `statConversion.ts`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Special`, `Stat.tsx`, `SpawnDirector.ts`, `Player.test.ts`, `shoreCollision.ts`, `SpawnDirector.test.ts`, `spawnStyle.test.ts`, `sfx.ts`, `store/index.ts`, `TargetReticle.test.ts`, `Gem`, `Coin.ts`, `pickupSound.test.ts`, `HUD.test.ts`, `walkability.ts`, `Trap.test.ts`, `settingsStorage.ts`?**
  _High betweenness centrality (0.230) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `fonts.ts`, `Invocation.ts`, `CastingController.test.ts`, `SpellButton`, `Spell`, `package.json`, `SpawnDebugOverlay.ts`, `Enemy`, `game.ts`, `Spell.test.ts`, `BossRoar.ts`, `BiomeScene.ts`, `PhaserGame.tsx`, `TownScene.ts`, `AreaEffect.ts`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Player`, `spawnStyle.test.ts`, `sfx.ts`, `LoadScene.ts`, `TargetReticle.test.ts`, `Coin.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `BiomeScene`, `Player`, `.spawnHost`, `SnareTrap`, `game.ts`, `Projectile`, `Invocation.ts`, `EnemyOptions`, `AreaEffect.ts`, `Spell`, `pickupSound.test.ts`, `CastingController`, `BiomeScene.ts`, `Enemy.test.ts`, `Enemy.ts`, `SiphonSoul`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _491 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.1339031339031339 - nodes in this community are weakly interconnected._
- **Should `Merchant.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0990990990990991 - nodes in this community are weakly interconnected._