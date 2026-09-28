# Graph Report - phasercraft  (2026-09-28)

## Corpus Check
- 280 files · ~433,200 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1982 nodes · 4558 edges · 114 communities (93 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 104 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d0a8b29f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- TownScene
- gameReducer.ts
- Item
- UI
- generateItem.ts
- compilerOptions
- store/index.ts
- PhaserGame.tsx
- Frostbolt.ts
- devDependencies
- react
- game.ts
- BiomeScene.ts
- HUD.ts
- StoredItem
- items/index.ts
- switchUi
- Button
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- Enemy.ts
- Enemy.test.ts
- TownScene.ts
- area.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- LootIcon
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap.ts
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
- Spell
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
- CastBar
- UI.tsx
- Settings.tsx
- Button.tsx
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- InstallBanner.tsx
- generate-biome-maps.mjs
- main.tsx
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- HUD.test.ts
- Boons.ts
- SpawnDirector.ts
- Player
- @testing-library/react
- EarthShield
- Player.test.ts
- build
- Whirlwind.ts
- vitest
- Tilemaps
- SpawnDirector.test.ts
- AssignSpell.ts
- walkability.ts
- shoreCollision.ts
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
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts

## Import Cycles
- None detected.

## Communities (114 total, 21 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (11): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 1 - "TownScene"
Cohesion: 0.15
Nodes (4): TownScene, clearTravelRequest, setPlayerPosition, toggleHUD

### Community 2 - "gameReducer.ts"
Cohesion: 0.08
Nodes (48): Step 3 — Merchant shop, react-tooltip, addComponent, buyComponent, buyGear, buyLoot, freshMerchant(), gameReducer (+40 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (17): uuid, Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo (+9 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "store/index.ts"
Cohesion: 0.14
Nodes (18): @reduxjs/toolkit, GameState, setMerchantMode, RootState, ComponentStack, CoinsProps, src_ui_components_atoms_coins_module, stacks (+10 more)

### Community 8 - "PhaserGame.tsx"
Cohesion: 0.05
Nodes (26): Sound (first audio in the game), home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, bannerStyle() (+18 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.09
Nodes (9): Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "react"
Cohesion: 0.10
Nodes (27): lodash, react, PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat() (+19 more)

### Community 12 - "game.ts"
Cohesion: 0.09
Nodes (21): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, ComponentDef, EQUIPMENT_SLOTS, GAME_BALANCE (+13 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.19
Nodes (9): ref_console, rxjs, Boss, BOSS_SCALE, AssignClass, PlayerType, MapStateOptions, mapStateToData() (+1 more)

### Community 14 - "HUD.ts"
Cohesion: 0.17
Nodes (17): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+9 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "switchUi"
Cohesion: 0.24
Nodes (10): switchUi, Title(), TitleProps, Navigation(), Header(), HeaderConfig, HeaderProps, src_ui_components_organisms_header_module (+2 more)

### Community 18 - "Button"
Cohesion: 0.14
Nodes (22): react-redux, Button(), ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid() (+14 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (34): eslintConfig, description, engines, node, homepage, keywords, name, private (+26 more)

### Community 23 - "Enemy.ts"
Cohesion: 0.11
Nodes (18): phaser, CirclingConfig, EnemyStates, HitParams, COIN_BASE_VALUE, CoinConfig, CraftingConfig, ActiveCast (+10 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "TownScene.ts"
Cohesion: 0.27
Nodes (9): BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig, BiomeSelect() (+1 more)

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

### Community 31 - "LootIcon"
Cohesion: 0.12
Nodes (18): getResourceColour(), LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, props, Slot(), DetailedLoot() (+10 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.07
Nodes (10): AssignType, classes, Enemy, Healer, Melee, Monster, MonsterConfig, Ranged (+2 more)

### Community 34 - "BiomeScene"
Cohesion: 0.14
Nodes (6): BiomeDefinition, BiomeScene, setBossActive, setCurrentArea, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.14
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "Player.ts"
Cohesion: 0.09
Nodes (13): Hero, HeroConfig, Destination, DrawBarOptions, AssignResource(), AssignResourceType, AssignSpell, Weapon (+5 more)

### Community 39 - "Blacksmith.tsx"
Cohesion: 0.11
Nodes (30): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+22 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.22
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
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "SpawnDebugOverlay.ts"
Cohesion: 0.21
Nodes (10): coneEdges(), countdownLabel(), OverlayEnemy, SpawnDebugOverlay, SpawnDebugSource, fakeGraphics(), fakeText(), makeOverlay() (+2 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.19
Nodes (5): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "SpawnHost"
Cohesion: 0.15
Nodes (3): Point, Rect, SpawnHost

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

### Community 75 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.20
Nodes (10): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4c — Schematic shop, Step 4d — Special items (#481), Step 4e — Craft SFX (first audio in the game) (#482) (+2 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 78 - "UI.tsx"
Cohesion: 0.12
Nodes (19): Step 1 — Shop skeletons: open & close every shop (this PR), requestTravel, CustomDragLayer(), getItemStyles(), src_ui_components_protons_customdraglayer_module, Offset, Alchemist(), src_ui_components_templates_alchemist_module (+11 more)

### Community 79 - "Settings.tsx"
Cohesion: 0.15
Nodes (17): DEFAULT_AREA_TUNING, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), hintStyle (+9 more)

### Community 80 - "Button.tsx"
Cohesion: 0.24
Nodes (9): polished, PlayerName, selectCharacter, setCoins, ButtonProps, src_ui_components_atoms_button_module, CharacterCard(), CharacterCardProps (+1 more)

### Community 81 - "Consecration"
Cohesion: 0.19
Nodes (3): Consecration, AreaEffect, ArcadeCollisionObject

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
Cohesion: 0.11
Nodes (27): Layout — forge (desktop), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion (+19 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "InstallBanner.tsx"
Cohesion: 0.29
Nodes (8): InstallBanner(), src_ui_components_molecules_installbanner_module, ShareIcon(), BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.13
Nodes (19): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), offset(), PATH_BY_MASK (+11 more)

### Community 92 - "main.tsx"
Cohesion: 0.33
Nodes (6): react-dnd-touch-backend, react-dom, App(), container, PhaserGame, src_styles_globals

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.16
Nodes (7): FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 98 - "SpawnDirector.ts"
Cohesion: 0.26
Nodes (9): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view, SpawnedEnemy, Tracked (+1 more)

### Community 100 - "@testing-library/react"
Cohesion: 0.40
Nodes (6): @testing-library/react, Dialog(), DIALOG_ROOT_ID, DialogProps, getDialogRoot(), System()

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.29
Nodes (7): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build()

### Community 104 - "Whirlwind.ts"
Cohesion: 0.20
Nodes (6): TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 105 - "vitest"
Cohesion: 0.27
Nodes (3): vitest, GemUnderTest, InvocationUnderTest

### Community 106 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 107 - "SpawnDirector.test.ts"
Cohesion: 0.24
Nodes (5): AreaTuning, FakeEnemy, killAll(), makeDirector(), seeded()

### Community 108 - "AssignSpell.ts"
Cohesion: 0.08
Nodes (10): MoveOptions, classes, Faith, Fireball, Frostbolt, Heal, ManaShield, Smite (+2 more)

### Community 109 - "walkability.ts"
Cohesion: 0.36
Nodes (5): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 110 - "shoreCollision.ts"
Cohesion: 0.52
Nodes (5): NE, NW, SE, shoreCells(), SW

### Community 142 - "LootItem"
Cohesion: 0.12
Nodes (23): react-dnd, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+15 more)

### Community 149 - "Gem.ts"
Cohesion: 0.10
Nodes (9): Step 4b — Schematic drops, Coin, Crafting, Gem, GEM_BASE_VALUE, GemConfig, coinValue(), getRandomVelocity() (+1 more)

## Knowledge Gaps
- **477 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+472 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 764 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `gameReducer.ts`, `Item`, `generateItem.ts`, `store/index.ts`, `PhaserGame.tsx`, `react`, `HUD.ts`, `LootItem`, `Button`, `Gem.ts`, `package.json`, `Enemy.test.ts`, `TownScene.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `LootIcon`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `TownScene.test.ts`, `vite.config.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `SpawnDebugOverlay.ts`, `Resource`, `Projectile`, `operations/helpers.ts`, `CastBar`, `UI.tsx`, `Settings.tsx`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `HUD.test.ts`, `SpawnDirector.ts`, `@testing-library/react`, `Player.test.ts`, `Whirlwind.ts`, `SpawnDirector.test.ts`, `walkability.ts`, `shoreCollision.ts`?**
  _High betweenness centrality (0.196) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `CastingController.test.ts`, `PhaserGame.tsx`, `Frostbolt.ts`, `game.ts`, `BiomeScene.ts`, `HUD.ts`, `Gem.ts`, `package.json`, `TownScene.ts`, `SpellButton`, `Enemy`, `SnareTrap.ts`, `Player.ts`, `TownScene.test.ts`, `TargetReticle`, `AssignClass.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `SpawnDebugOverlay.ts`, `Resource`, `Projectile`, `CastBar`, `BiomeScene.test.ts`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Boons.ts`, `BiomeScene`, `Player`, `SiphonSoul`, `SnareTrap.ts`, `Player.ts`, `Whirlwind.ts`, `Frostbolt.ts`, `AssignSpell.ts`, `BiomeScene.ts`, `game.ts`, `Consecration`, `CastingController`, `Gem.ts`, `Enemy.ts`, `Enemy.test.ts`, `Projectile`, `area.ts`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _477 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11375661375661375 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07704918032786885 - nodes in this community are weakly interconnected._