# Graph Report - phasercraft  (2026-09-28)

## Corpus Check
- 281 files · ~433,310 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1992 nodes · 4592 edges · 115 communities (89 shown, 26 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 105 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `215df9d1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- TownScene
- gameReducer.ts
- Item.ts
- UI
- generateItem.ts
- compilerOptions
- store/index.ts
- fonts.ts
- Frostbolt.ts
- devDependencies
- lodash
- game.ts
- BiomeScene.ts
- vitest
- StoredItem
- items/index.ts
- MerchantModeToggle.tsx
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
- StatBar.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap
- Player.ts
- Blacksmith.tsx
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- AssignClass.ts
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- SpawnDebugOverlay.ts
- Resource
- BossRoar.ts
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
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
- Hero
- UI.tsx
- settingsStorage.ts
- Settings.tsx
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- Item
- generate-biome-maps.mjs
- main.tsx
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- HUD.test.ts
- StatusEffects
- SpawnDirector.ts
- Player
- GroupedAttributes.tsx
- EarthShield
- Player.test.ts
- build
- targetVector
- Invocation
- LoadScene.ts
- Stats.tsx
- Spell
- Item.test.ts
- Price.tsx
- Gem.test.ts
- .setExperience
- Boss.ts
- Enemy.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `vitest` - 63 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 48 edges
7. `BiomeScene` - 42 edges
8. `SpellOptions` - 36 edges
9. `Button()` - 34 edges
10. `CastingController` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Step 4e — Craft SFX (first audio in the game) (#482)` --references--> `LoadScene`  [INFERRED]
  docs/ROADMAP.md → src/scenes/LoadScene.ts
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts

## Import Cycles
- None detected.

## Communities (115 total, 26 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.09
Nodes (38): Step 3 — Merchant shop, buyComponent, buyGear, freshMerchant(), initState, Level, MerchantMode, MerchantState (+30 more)

### Community 3 - "Item.ts"
Cohesion: 0.09
Nodes (17): uuid, Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo (+9 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "store/index.ts"
Cohesion: 0.11
Nodes (24): @reduxjs/toolkit, @testing-library/react, consumeComponent(), craftedItem(), gameReducer, GameState, loadGame, syncStats() (+16 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.10
Nodes (9): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "lodash"
Cohesion: 0.12
Nodes (19): lodash, AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat(), StatProps, Health(), HealthProps (+11 more)

### Community 12 - "game.ts"
Cohesion: 0.07
Nodes (30): CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, WeaponConfig, AdjustValue, CHARACTER_BASE_STATS (+22 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.36
Nodes (5): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 14 - "vitest"
Cohesion: 0.16
Nodes (19): vitest, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave() (+11 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "MerchantModeToggle.tsx"
Cohesion: 0.08
Nodes (32): react-dnd-touch-backend, react-dom, App(), container, PhaserGame, setMerchantMode, switchUi, src_styles_globals (+24 more)

### Community 18 - "react"
Cohesion: 0.08
Nodes (43): Slots, react, react-dnd, equipLoot, selectLoot, unequipLoot, COMPONENT_TYPES, Equipment (+35 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "EnemyOptions"
Cohesion: 0.18
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 24 - "Enemy.test.ts"
Cohesion: 0.18
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "TownScene.ts"
Cohesion: 0.14
Nodes (16): rxjs, AssignClass, PlayerType, MapStateOptions, mapStateToData(), state$, PhaserGame(), BiomeId (+8 more)

### Community 26 - "area.ts"
Cohesion: 0.11
Nodes (20): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, AreaTuning, BOSS_SCALING, DEFAULT_AREA_TUNING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning() (+12 more)

### Community 27 - "SpellButton"
Cohesion: 0.10
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

### Community 31 - "StatBar.tsx"
Cohesion: 0.18
Nodes (13): polished, getResourceColour(), Slot(), DetailedLoot(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, GroupedAttributes() (+5 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.14
Nodes (6): AssignType, BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap"
Cohesion: 0.16
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "Player.ts"
Cohesion: 0.14
Nodes (10): Destination, DrawBarOptions, AssignResource(), AssignResourceType, AssignSpell, Weapon, addXP, setBaseStats (+2 more)

### Community 39 - "Blacksmith.tsx"
Cohesion: 0.21
Nodes (16): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+8 more)

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
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

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
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "SpawnDebugOverlay.ts"
Cohesion: 0.21
Nodes (10): coneEdges(), countdownLabel(), OverlayEnemy, SpawnDebugOverlay, SpawnDebugSource, fakeGraphics(), fakeText(), makeOverlay() (+2 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 54 - "BossRoar.ts"
Cohesion: 0.15
Nodes (17): react-redux, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, stacks, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid() (+9 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.19
Nodes (5): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 59 - "SpawnDirector"
Cohesion: 0.15
Nodes (4): Rect, SpawnDirector, SpawnedEnemy, killAll()

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.32
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

### Community 75 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.18
Nodes (11): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 1 — Shop skeletons: open & close every shop (this PR), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4c — Schematic shop, Step 4d — Special items (#481) (+3 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "UI.tsx"
Cohesion: 0.36
Nodes (6): buyLoot, toggleFilter, Armory(), src_ui_components_templates_armory_module, SortKey, sampleItems

### Community 79 - "settingsStorage.ts"
Cohesion: 0.12
Nodes (19): DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), autoSpawnRadius(), hintStyle (+11 more)

### Community 80 - "Settings.tsx"
Cohesion: 0.13
Nodes (22): PlayerName, BIOME_IDS, requestTravel, selectCharacter, setCoins, toggleUi, Button(), ButtonProps (+14 more)

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
Cohesion: 0.18
Nodes (17): Layout — forge (desktop), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion (+9 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.15
Nodes (16): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+8 more)

### Community 92 - "main.tsx"
Cohesion: 0.22
Nodes (15): ensureWatching(), getHudInsets(), hudInsets(), listeners, makeProbe(), NO_INSETS, readRawInsets(), refresh() (+7 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.16
Nodes (8): BIOMES, FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 96 - "HUD.test.ts"
Cohesion: 0.20
Nodes (5): HUD_LAYOUT, LabelledContainer, styles, HudUnderTest, addLoot

### Community 97 - "StatusEffects"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 98 - "SpawnDirector.ts"
Cohesion: 0.38
Nodes (7): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view, Tracked

### Community 100 - "GroupedAttributes.tsx"
Cohesion: 0.24
Nodes (9): PlayerStats, Attribute(), Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module, GroupedAttributesProps, NumericStats (+1 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.25
Nodes (8): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset(), tileLayer()

### Community 104 - "targetVector"
Cohesion: 0.38
Nodes (4): clone(), targetVector(), TargetWithBody, VectorResult

### Community 106 - "LoadScene.ts"
Cohesion: 0.06
Nodes (22): Sound (first audio in the game), home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, FONT_FAMILY (+14 more)

### Community 107 - "Stats.tsx"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 108 - "Spell"
Cohesion: 0.08
Nodes (10): classes, Faith, Fireball, Heal, ManaShield, Smite, SpellValue, TODO: Abstract this capping functionality out as many spells might use. (+2 more)

### Community 109 - "Item.test.ts"
Cohesion: 0.26
Nodes (11): colorForQuality(), toStoreItem(), craftItem, Blacksmith(), materialEntries(), src_ui_components_templates_blacksmith_module, RARITY_TINT, Slot() (+3 more)

### Community 111 - "Gem.test.ts"
Cohesion: 0.22
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, TargetKind

### Community 112 - ".setExperience"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 113 - "Boss.ts"
Cohesion: 0.33
Nodes (3): ref_console, Boss, BOSS_SCALE

### Community 149 - "Enemy.ts"
Cohesion: 0.07
Nodes (22): Step 4b — Schematic drops, phaser, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem (+14 more)

## Knowledge Gaps
- **480 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+475 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 767 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **26 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `gameReducer.ts`, `Item.ts`, `generateItem.ts`, `store/index.ts`, `lodash`, `BiomeScene.ts`, `MerchantModeToggle.tsx`, `react`, `Enemy.ts`, `package.json`, `Enemy.test.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `StatBar.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap`, `TownScene.test.ts`, `vite.config.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `SpawnDebugOverlay.ts`, `Resource`, `BossRoar.ts`, `Projectile`, `operations/helpers.ts`, `UI.tsx`, `settingsStorage.ts`, `Settings.tsx`, `ItemTooltip.tsx`, `main.tsx`, `BiomeScene.test.ts`, `HUD.test.ts`, `SpawnDirector.ts`, `Player.test.ts`, `targetVector`, `Invocation`, `LoadScene.ts`, `Stats.tsx`?**
  _High betweenness centrality (0.206) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `CastingController.test.ts`, `fonts.ts`, `Frostbolt.ts`, `game.ts`, `package.json`, `TownScene.ts`, `SpellButton`, `Player.ts`, `TownScene.test.ts`, `TargetReticle`, `AssignClass.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `SpawnDebugOverlay.ts`, `Resource`, `Projectile`, `Hero`, `main.tsx`, `BiomeScene.test.ts`, `HUD.test.ts`, `LoadScene.ts`, `Stats.tsx`, `Spell`, `Price.tsx`, `Gem.test.ts`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Frostbolt.ts`, `game.ts`, `CastingController`, `Enemy.ts`, `EnemyOptions`, `Enemy.test.ts`, `TownScene.ts`, `area.ts`, `BiomeScene`, `SnareTrap`, `Player.ts`, `Projectile`, `SiphonSoul`, `Consecration`, `StatusEffects`, `Player`, `Spell`, `Price.tsx`, `Gem.test.ts`, `Boss.ts`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _480 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09306122448979592 - nodes in this community are weakly interconnected._