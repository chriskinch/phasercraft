# Graph Report - phasercraft  (2026-09-29)

## Corpus Check
- 293 files · ~444,995 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 69 file(s) not represented in the graph (top: .css 44, (none) 8, .psd 5)

## Summary
- 2072 nodes · 4885 edges · 134 communities (101 shown, 33 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `84c64772`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AssignSpell.ts
- TownScene
- Merchant.tsx
- Item
- Tilemaps
- generateItem.ts
- compilerOptions
- Resource
- phaser
- Frostbolt.ts
- devDependencies
- CastingController.test.ts
- game.ts
- EnemyOptions
- Save.tsx
- StoredItem
- items/index.ts
- SpellButton
- Spell
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- MerchantModeToggle.tsx
- Enemy.test.ts
- Enemy.ts
- area.ts
- Blacksmith.tsx
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- StatBar.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap.ts
- Player.ts
- react
- Spell.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- .constructor
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Phase 13 — Town shops system (issue TBD)
- CLAUDE.md — Working agreement and project conventions
- generate
- BossRoar.ts
- Resource.ts
- store/index.ts
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
- LootIcon
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- UI.tsx
- graphify reference: query, path, explain
- sfx.ts
- CastBar
- Settings.tsx
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
- SpellButton.test.ts
- StatusEffects
- themes.ts
- Player
- lodash
- Resource.test.ts
- Player.test.ts
- build
- BiomeScene.ts
- Hero
- Invocation
- Dialog.tsx
- .constructor
- vitest
- CombatText
- Special.ts
- TargetReticle.test.ts
- Gem.test.ts
- playSfx
- Crafting
- HUD.test.ts
- walkability.ts
- Healer
- useInstallPrompt.ts
- Boss.ts
- Shield
- HUD.ts
- SelectScene
- main.tsx
- mapStateToData
- Whirlwind
- Weapon
- CharacterCard.tsx
- Equipment.test.tsx
- Multishot

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `vitest` - 70 edges
3. `Player` - 68 edges
4. `react` - 60 edges
5. `Spell` - 58 edges
6. `phaser` - 52 edges
7. `BiomeScene` - 46 edges
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

## Communities (134 total, 33 thin omitted)

### Community 0 - "AssignSpell.ts"
Cohesion: 0.09
Nodes (7): classes, Faith, Frostbolt, Heal, ManaShield, Smite, SpellOptions

### Community 1 - "TownScene"
Cohesion: 0.16
Nodes (3): AssignClass, TownScene, setCurrentArea

### Community 2 - "Merchant.tsx"
Cohesion: 0.11
Nodes (29): react-tooltip, buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, sellComponent, sellComponentStack (+21 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (17): uuid, Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo (+9 more)

### Community 4 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 8 - "phaser"
Cohesion: 0.18
Nodes (9): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, phaser, ref_styles_fonts_boldpixels_woff2_url, bannerStyle(), FONT_FAMILY, FONT_URL, CombatTextConfig, LogoOptions (+1 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.12
Nodes (8): Boon, Enrage, EnrageValue, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue, EffectValue

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (11): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 12 - "game.ts"
Cohesion: 0.08
Nodes (29): GameState, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_DEFS, COMPONENT_TYPES (+21 more)

### Community 13 - "EnemyOptions"
Cohesion: 0.27
Nodes (4): classes, Melee, Ranged, EnemyOptions

### Community 14 - "Save.tsx"
Cohesion: 0.24
Nodes (13): readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave(), loadGame (+5 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "SpellButton"
Cohesion: 0.16
Nodes (3): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton

### Community 18 - "Spell"
Cohesion: 0.11
Nodes (4): MoveOptions, Fireball, Spell, TargetType

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (36): eslintConfig, description, engines, node, homepage, keywords, name, private (+28 more)

### Community 23 - "MerchantModeToggle.tsx"
Cohesion: 0.20
Nodes (12): Title(), TitleProps, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation(), Header(), HeaderConfig (+4 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.17
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "Enemy.ts"
Cohesion: 0.11
Nodes (18): CirclingConfig, EnemyStates, HitParams, CraftingConfig, PlayerType, ActiveCast, CasterLike, CastingControllerOptions (+10 more)

### Community 26 - "area.ts"
Cohesion: 0.13
Nodes (19): Step 4d — Special items (#481), AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+11 more)

### Community 27 - "Blacksmith.tsx"
Cohesion: 0.13
Nodes (26): Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown, Reconciling with Step 4a (PR #448) (+18 more)

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
Cohesion: 0.24
Nodes (8): polished, getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.12
Nodes (7): resolveAreaTuning(), BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, toggleHUD, EnemyType

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
Cohesion: 0.17
Nodes (11): classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions, Ranger (+3 more)

### Community 39 - "react"
Cohesion: 0.17
Nodes (20): Slots, react, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+12 more)

### Community 40 - "Spell.ts"
Cohesion: 0.22
Nodes (6): SpellValue, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, SpellProjectileConfig

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - ".constructor"
Cohesion: 0.27
Nodes (5): AssignResource(), AssignSpell, Boons, setStats, updateStats

### Community 45 - "vite.config.ts"
Cohesion: 0.22
Nodes (6): ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

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
Cohesion: 0.33
Nodes (6): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 52 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 53 - "Resource.ts"
Cohesion: 0.14
Nodes (15): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, HealthOptions, Mana, ManaOptions (+7 more)

### Community 54 - "store/index.ts"
Cohesion: 0.16
Nodes (24): react-redux, RootState, CoinsProps, src_ui_components_atoms_coins_module, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid() (+16 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (28): AreaTuning, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view (+20 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "gameReducer.ts"
Cohesion: 0.14
Nodes (21): Step 3 — Merchant shop, addComponent, addSpecial, clearTravelRequest, consumeComponent(), craftedItem(), craftedStats(), equipLoot (+13 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.33
Nodes (11): ApiItem, baseUrl(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock(), StoreItem (+3 more)

### Community 65 - "LootIcon"
Cohesion: 0.20
Nodes (12): LootIcon(), Slot(), DetailedLoot(), DetailedLootProps, src_ui_components_molecules_detailedloot_module, GroupedAttributes(), CustomDragLayer(), getItemStyles() (+4 more)

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
Cohesion: 0.10
Nodes (30): Step 1 — Shop skeletons: open & close every shop (this PR), buyLoot, switchUi, toggleFilter, Button(), ButtonProps, src_ui_components_atoms_button_module, InstallBanner() (+22 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "sfx.ts"
Cohesion: 0.22
Nodes (6): PhaserGame(), BootScene, setSfxManager(), SFX, sfxGain(), SfxKey

### Community 78 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 79 - "Settings.tsx"
Cohesion: 0.19
Nodes (16): DEFAULT_AREA_TUNING, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, withGodModeGate(), writeSettings() (+8 more)

### Community 80 - "TownScene.ts"
Cohesion: 0.20
Nodes (12): PlayerName, BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig (+4 more)

### Community 81 - "Consecration"
Cohesion: 0.12
Nodes (4): Consecration, EarthShield, AreaEffect, ArcadeCollisionObject

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
Cohesion: 0.14
Nodes (22): Step 4a — Crafting core (this PR), Layout — forge (desktop), specialBonusRow(), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue() (+14 more)

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

### Community 97 - "StatusEffects"
Cohesion: 0.21
Nodes (5): Deferred / backlog, Banes, IndexableStats, StatusEffect, StatusEffects

### Community 98 - "themes.ts"
Cohesion: 0.27
Nodes (7): LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, props, ICON_TILE, PixelBackgroundOptions, PixelEmbossOptions

### Community 99 - "Player"
Cohesion: 0.11
Nodes (4): MonsterConfig, Player, addXP, setLevel

### Community 100 - "lodash"
Cohesion: 0.07
Nodes (39): lodash, PlayerStats, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat(), StatProps (+31 more)

### Community 101 - "Resource.test.ts"
Cohesion: 0.24
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.22
Nodes (9): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset() (+1 more)

### Community 104 - "BiomeScene.ts"
Cohesion: 0.24
Nodes (13): AssignType, bit(), isShoreBlocked(), NE, NW, SE, SHORE_ART_SIZE, SHORE_CELL (+5 more)

### Community 107 - "Dialog.tsx"
Cohesion: 0.36
Nodes (6): ref_node_fs, react-dom, Dialog(), DIALOG_ROOT_ID, DialogProps, getDialogRoot()

### Community 109 - "vitest"
Cohesion: 0.17
Nodes (9): @testing-library/react, vitest, helm, stacks, sampleItems, makeTestStore(), ProviderOptions, renderWithProviders() (+1 more)

### Community 111 - "Special.ts"
Cohesion: 0.10
Nodes (12): Sound (first audio in the game), AnimationConfig, createAnimations(), EnemyConfig, EnemyType, Special, SpecialConfig, specialTextureKey() (+4 more)

### Community 114 - "playSfx"
Cohesion: 0.13
Nodes (11): Coin, COIN_BASE_VALUE, CoinConfig, Gem, GEM_BASE_VALUE, GemConfig, Collectable, coinValue() (+3 more)

### Community 115 - "Crafting"
Cohesion: 0.22
Nodes (5): Step 4 — Blacksmith crafting, Step 4b — Schematic drops, Step 4c — Schematic shop, Step 4e — Craft SFX (first audio in the game) (#482), Crafting

### Community 117 - "walkability.ts"
Cohesion: 0.36
Nodes (5): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 119 - "useInstallPrompt.ts"
Cohesion: 0.43
Nodes (5): BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 120 - "Boss.ts"
Cohesion: 0.33
Nodes (3): ref_console, Boss, BOSS_SCALE

### Community 122 - "HUD.ts"
Cohesion: 0.33
Nodes (5): HUD_LAYOUT, LabelledContainer, styles, SpellButtonOptions, addLoot

### Community 124 - "main.tsx"
Cohesion: 0.40
Nodes (5): react-dnd, App(), container, PhaserGame, src_styles_globals

### Community 126 - "mapStateToData"
Cohesion: 0.40
Nodes (4): rxjs, MapStateOptions, mapStateToData(), state$

### Community 129 - "CharacterCard.tsx"
Cohesion: 0.60
Nodes (4): grantStarterItems, setCoins, CharacterCard(), src_ui_components_molecules_charactercard_module

### Community 130 - "Equipment.test.tsx"
Cohesion: 0.50
Nodes (3): initialGame, seed(), seedParts()

## Knowledge Gaps
- **489 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+484 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 787 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **33 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `Equipment.test.tsx`, `Item`, `InstallBanner.test.tsx`, `generateItem.ts`, `Merchant.tsx`, `phaser`, `CastingController.test.ts`, `game.ts`, `Save.tsx`, `package.json`, `Enemy.test.ts`, `Enemy.ts`, `area.ts`, `handlers.test.ts`, `StatBar.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `Spell.ts`, `vite.config.ts`, `Spell.test.ts`, `BossRoar.ts`, `SpawnDirector`, `gameReducer.ts`, `UI.tsx`, `sfx.ts`, `CastBar`, `Settings.tsx`, `TownScene.ts`, `ItemTooltip.tsx`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `SpellButton.test.ts`, `themes.ts`, `lodash`, `Resource.test.ts`, `Player.test.ts`, `BiomeScene.ts`, `Invocation`, `Dialog.tsx`, `Special.ts`, `TargetReticle.test.ts`, `Gem.test.ts`, `playSfx`, `HUD.test.ts`, `walkability.ts`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Weapon`, `Frostbolt.ts`, `CastingController.test.ts`, `game.ts`, `package.json`, `Enemy.ts`, `SnareTrap.ts`, `Player.ts`, `Spell.ts`, `TargetReticle`, `Spell.test.ts`, `BossRoar.ts`, `Resource.ts`, `SpawnDirector`, `sfx.ts`, `CastBar`, `TownScene.ts`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `SpellButton.test.ts`, `Player`, `BiomeScene.ts`, `Hero`, `Special.ts`, `TargetReticle.test.ts`, `playSfx`, `HUD.ts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Weapon`, `AssignSpell.ts`, `Multishot`, `.setCircling`, `Frostbolt.ts`, `game.ts`, `EnemyOptions`, `Spell`, `CastingController`, `Enemy.test.ts`, `Enemy.ts`, `area.ts`, `BiomeScene`, `SnareTrap.ts`, `Player.ts`, `Resource.ts`, `SiphonSoul`, `Consecration`, `StatusEffects`, `Player`, `BiomeScene.ts`, `.constructor`, `Healer`, `Boss.ts`, `Whirlwind`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _489 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09247311827956989 - nodes in this community are weakly interconnected._
- **Should `Merchant.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._