# Graph Report - phasercraft  (2026-09-29)

## Corpus Check
- 292 files · ~444,541 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 2069 nodes · 4861 edges · 127 communities (98 shown, 29 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 113 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63d1a053`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AssignSpell.ts
- TownScene
- gameReducer.ts
- Item
- LoadScene
- generateItem.ts
- compilerOptions
- Resource
- phaser
- Frostbolt.ts
- devDependencies
- CastingController.test.ts
- game.ts
- EnemyOptions
- HUD.ts
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
- SnareTrap.ts
- AssignClass.ts
- Blacksmith.tsx
- Spell.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- Player.ts
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Phase 13 — Town shops system (issue TBD)
- CLAUDE.md — Working agreement and project conventions
- generate
- BossRoar.ts
- AssignResource.ts
- react
- vercel.json
- Vercel deployment (Phase 6)
- UI
- SiphonSoul
- SpawnDebugOverlay.ts
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
- UI.tsx
- graphify reference: query, path, explain
- SpawnDirector
- CastBar
- settingsStorage.ts
- TownScene.ts
- EarthShield.ts
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
- Settings.tsx
- StatusEffects
- Stats.tsx
- Player
- Stat.tsx
- Resource.test.ts
- Player.test.ts
- build
- BiomeScene.ts
- Hero
- Invocation
- ItemTooltip.tsx
- SpawnDirector.ts
- vitest
- SpawnDirector.test.ts
- Special
- TargetReticle.test.ts
- Gem
- sfx.ts
- Crafting
- HUD.test.ts
- walkability.ts
- Healer
- useInstallPrompt.ts
- Boss.ts
- Shield
- EnemyAttributes
- SelectScene
- CasterLike
- Special.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `vitest` - 69 edges
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

## Communities (127 total, 29 thin omitted)

### Community 0 - "AssignSpell.ts"
Cohesion: 0.09
Nodes (7): classes, Faith, Fireball, Frostbolt, ManaShield, Smite, SpellOptions

### Community 2 - "gameReducer.ts"
Cohesion: 0.06
Nodes (55): Step 3 — Merchant shop, DrawBarOptions, addComponent, addSpecial, buyComponent, buyGear, buyLoot, clearTravelRequest (+47 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (17): uuid, Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo (+9 more)

### Community 4 - "LoadScene"
Cohesion: 0.17
Nodes (7): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, Sound (first audio in the game), LoadScene

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 8 - "phaser"
Cohesion: 0.10
Nodes (15): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, phaser, ref_styles_fonts_boldpixels_woff2_url, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, bannerStyle() (+7 more)

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
Cohesion: 0.09
Nodes (25): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_TYPES, ComponentDef, EntityWithVector (+17 more)

### Community 13 - "EnemyOptions"
Cohesion: 0.23
Nodes (5): AssignType, classes, Melee, Ranged, EnemyOptions

### Community 14 - "HUD.ts"
Cohesion: 0.15
Nodes (21): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+13 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "SpellButton"
Cohesion: 0.09
Nodes (6): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), HUD_LAYOUT, SpellButton, SpellButtonOptions, ButtonUnderTest

### Community 18 - "Spell"
Cohesion: 0.11
Nodes (4): MoveOptions, Heal, Spell, TargetType

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "MerchantModeToggle.tsx"
Cohesion: 0.18
Nodes (14): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+6 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.17
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "Enemy.ts"
Cohesion: 0.19
Nodes (12): CirclingConfig, EnemyStates, HitParams, CraftingConfig, PlayerType, ActiveCast, CastingControllerOptions, CastingState (+4 more)

### Community 26 - "area.ts"
Cohesion: 0.16
Nodes (16): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+8 more)

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
Cohesion: 0.14
Nodes (19): polished, getResourceColour(), sellComponent, sellComponentStack, sellLoot, Slot(), DetailedLoot(), src_ui_components_molecules_statbar_module (+11 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.13
Nodes (5): BiomeScene, setBossActive, setEnemiesRemaining, toggleHUD, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.13
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 39 - "Blacksmith.tsx"
Cohesion: 0.24
Nodes (12): colorForQuality(), craftItem, Blacksmith(), EMPTY_SPECIAL_TINT, materialEntries(), src_ui_components_templates_blacksmith_module, RARITY_TINT, Slot() (+4 more)

### Community 40 - "Spell.ts"
Cohesion: 0.10
Nodes (12): Multishot, SpellValue, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest (+4 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "Player.ts"
Cohesion: 0.10
Nodes (14): Destination, DrawBarOptions, AssignResource(), AssignResourceName, AssignResourceType, AssignSpell, Boons, CombatText (+6 more)

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
Cohesion: 0.17
Nodes (12): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4b — Schematic drops, Step 4c — Schematic shop, Step 4d — Special items (#481) (+4 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 52 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 53 - "AssignResource.ts"
Cohesion: 0.14
Nodes (11): classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions, Rage (+3 more)

### Community 54 - "react"
Cohesion: 0.09
Nodes (49): react, react-redux, selectLoot, unequipLoot, Equipment, LootItem, DroppableSlot(), DroppableSlotProps (+41 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 59 - "SpawnDebugOverlay.ts"
Cohesion: 0.21
Nodes (10): coneEdges(), countdownLabel(), OverlayEnemy, SpawnDebugOverlay, SpawnDebugSource, fakeGraphics(), fakeText(), makeOverlay() (+2 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

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

### Community 75 - "UI.tsx"
Cohesion: 0.07
Nodes (39): Step 1 — Shop skeletons: open & close every shop (this PR), react-dnd, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, requestTravel (+31 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "SpawnDirector"
Cohesion: 0.19
Nodes (3): Rect, SpawnDirector, killAll()

### Community 78 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 79 - "settingsStorage.ts"
Cohesion: 0.19
Nodes (11): PhaserGame(), DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), setSfxManager() (+3 more)

### Community 80 - "TownScene.ts"
Cohesion: 0.21
Nodes (10): PlayerName, BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig (+2 more)

### Community 81 - "EarthShield.ts"
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

### Community 96 - "Settings.tsx"
Cohesion: 0.20
Nodes (10): autoSpawnRadius(), hintStyle, numberInputStyle, rowStyle, SPAWN_FIELDS, SpawnNumberField, SpawnOverrideRow(), SpawnOverrideRowProps (+2 more)

### Community 97 - "StatusEffects"
Cohesion: 0.21
Nodes (5): Deferred / backlog, Banes, IndexableStats, StatusEffect, StatusEffects

### Community 98 - "Stats.tsx"
Cohesion: 0.19
Nodes (11): PlayerStats, src_ui_components_molecules_stats_module, StatItem, Stats(), StatsProps, StatsStyles, GroupedAttributesProps, NumericStats (+3 more)

### Community 99 - "Player"
Cohesion: 0.13
Nodes (3): MonsterConfig, Player, CombatType

### Community 100 - "Stat.tsx"
Cohesion: 0.14
Nodes (16): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat(), StatProps, Attributes(), AttributesProps (+8 more)

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
Cohesion: 0.19
Nodes (16): rxjs, MapStateOptions, state$, bit(), isShoreBlocked(), NE, NW, SE (+8 more)

### Community 107 - "ItemTooltip.tsx"
Cohesion: 0.25
Nodes (6): LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, src_ui_components_molecules_itemtooltip_module, MenuContext

### Community 108 - "SpawnDirector.ts"
Cohesion: 0.24
Nodes (8): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view, SpawnedEnemy, Tracked

### Community 109 - "vitest"
Cohesion: 0.10
Nodes (21): @reduxjs/toolkit, @testing-library/react, vitest, GameState, RootState, ComponentStack, CoinsProps, src_ui_components_atoms_coins_module (+13 more)

### Community 110 - "SpawnDirector.test.ts"
Cohesion: 0.24
Nodes (5): AreaTuning, DEFAULT_AREA_TUNING, FakeEnemy, makeDirector(), seeded()

### Community 111 - "Special"
Cohesion: 0.21
Nodes (3): Special, specialTextureKey(), SpecialUnderTest

### Community 114 - "sfx.ts"
Cohesion: 0.24
Nodes (6): COIN_BASE_VALUE, CoinConfig, Collectable, playSfx(), SfxKey, addCoins

### Community 117 - "walkability.ts"
Cohesion: 0.36
Nodes (5): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 119 - "useInstallPrompt.ts"
Cohesion: 0.43
Nodes (5): BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 120 - "Boss.ts"
Cohesion: 0.40
Nodes (3): ref_console, Boss, BOSS_SCALE

### Community 122 - "EnemyAttributes"
Cohesion: 0.50
Nodes (3): EnemyStats, EnemyAttributes, EnemyConfig

### Community 149 - "Special.ts"
Cohesion: 0.26
Nodes (6): lodash, GEM_BASE_VALUE, GemConfig, SpecialConfig, coinValue(), getRandomVelocity()

## Knowledge Gaps
- **493 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+488 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 788 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `Item`, `generateItem.ts`, `phaser`, `CastingController.test.ts`, `game.ts`, `HUD.ts`, `SpellButton`, `Special.ts`, `package.json`, `Enemy.test.ts`, `area.ts`, `handlers.test.ts`, `Equipment.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `Spell.ts`, `vite.config.ts`, `Spell.test.ts`, `BossRoar.ts`, `react`, `SpawnDebugOverlay.ts`, `operations/helpers.ts`, `UI.tsx`, `CastBar`, `settingsStorage.ts`, `TownScene.ts`, `statConversion.ts`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Stat.tsx`, `Resource.test.ts`, `Player.test.ts`, `BiomeScene.ts`, `Invocation`, `SpawnDirector.ts`, `SpawnDirector.test.ts`, `Special`, `TargetReticle.test.ts`, `Gem`, `sfx.ts`, `HUD.test.ts`, `walkability.ts`?**
  _High betweenness centrality (0.225) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `gameReducer.ts`, `Frostbolt.ts`, `CastingController.test.ts`, `game.ts`, `HUD.ts`, `SpellButton`, `Special.ts`, `package.json`, `Enemy.ts`, `SnareTrap.ts`, `AssignClass.ts`, `Spell.ts`, `TargetReticle`, `Player.ts`, `Spell.test.ts`, `BossRoar.ts`, `SpawnDebugOverlay.ts`, `CastBar`, `settingsStorage.ts`, `TownScene.ts`, `EarthShield.ts`, `TownScene.test.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Player`, `BiomeScene.ts`, `Hero`, `TargetReticle.test.ts`, `sfx.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `AssignSpell.ts`, `Frostbolt.ts`, `game.ts`, `EnemyOptions`, `Spell`, `CastingController`, `Enemy.test.ts`, `Enemy.ts`, `area.ts`, `BiomeScene`, `SnareTrap.ts`, `Spell.ts`, `Player.ts`, `SiphonSoul`, `EarthShield.ts`, `StatusEffects`, `Player`, `BiomeScene.ts`, `Crafting`, `Healer`, `Boss.ts`, `EnemyAttributes`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _493 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09247311827956989 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06321334503950835 - nodes in this community are weakly interconnected._