# Graph Report - phasercraft  (2026-09-26)

## Corpus Check
- 275 files · ~426,472 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1938 nodes · 4342 edges · 115 communities (88 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a15cd7b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- Spell
- Merchant.tsx
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- vitest
- BossRoar.ts
- Frostbolt.ts
- devDependencies
- Stats.tsx
- game.ts
- BiomeScene.ts
- Resource.test.ts
- StoredItem
- items/index.ts
- operations/helpers.ts
- react-redux
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
- SnareTrap.ts
- store/index.ts
- gameReducer.ts
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- Spell.ts
- Dialog.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- Attributes.tsx
- Resource
- Monster
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- Shield
- armoryClient.ts
- Multishot
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- .constructor
- react
- Settings.tsx
- Item
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- repository
- Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)
- generate-biome-maps.mjs
- PhaserGame.tsx
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- CasterLike
- Boons.ts
- fonts.ts
- Player
- Player.ts
- EarthShield
- Player.test.ts
- bannerStyle
- Invocation
- Tilemaps
- GroupedStats.tsx
- AssignSpell.ts
- Whirlwind
- ItemTooltip.tsx
- BootScene
- SelectScene
- Item.ts
- LootItem
- lodash

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `vitest` - 60 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 47 edges
7. `BiomeScene` - 42 edges
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
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts

## Import Cycles
- None detected.

## Communities (115 total, 27 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (11): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 2 - "Merchant.tsx"
Cohesion: 0.11
Nodes (30): react-tooltip, buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, sellComponent, sellComponentStack (+22 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.08
Nodes (5): HudUnderTest, UI, TownScene, addLoot, toggleUi

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.11
Nodes (23): @testing-library/react, vitest, LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS (+15 more)

### Community 8 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 9 - "Frostbolt.ts"
Cohesion: 0.12
Nodes (8): Boon, Enrage, EnrageValue, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue, EffectValue

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "game.ts"
Cohesion: 0.09
Nodes (24): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_TYPES, ComponentDef, EQUIPMENT_SLOTS (+16 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.18
Nodes (11): ref_console, Boss, BOSS_SCALE, AssignClass, PlayerType, buildWalkability(), isFootprintSpawnable(), grid() (+3 more)

### Community 14 - "Resource.test.ts"
Cohesion: 0.24
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 18 - "react-redux"
Cohesion: 0.09
Nodes (35): react-dnd, react-redux, equipLoot, selectLoot, unequipLoot, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+27 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (16): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 1 — CI quality gates, Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done) (+8 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "EnemyOptions"
Cohesion: 0.15
Nodes (6): AssignType, classes, Healer, Melee, Ranged, EnemyOptions

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "TownScene.ts"
Cohesion: 0.18
Nodes (15): PlayerName, BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, GameSceneConfig, requestTravel (+7 more)

### Community 26 - "area.ts"
Cohesion: 0.13
Nodes (18): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+10 more)

### Community 27 - "SpellButton"
Cohesion: 0.07
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

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
Cohesion: 0.21
Nodes (6): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, createLogo(), LoadScene

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.11
Nodes (3): Enemy, MonsterConfig, EntityWithVector

### Community 34 - "BiomeScene"
Cohesion: 0.14
Nodes (6): BiomeDefinition, BiomeScene, SpawnDebugOverlay, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "store/index.ts"
Cohesion: 0.24
Nodes (9): @reduxjs/toolkit, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, ProviderOptions (+1 more)

### Community 39 - "gameReducer.ts"
Cohesion: 0.11
Nodes (29): Step 3 — Merchant shop, Step 4a — Crafting core (this PR), colorForQuality(), addComponent, addXP, clearTravelRequest, componentTotal(), consumeComponent() (+21 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "Spell.ts"
Cohesion: 0.22
Nodes (5): MoveOptions, Fireball, SpellValue, SpellProjectileConfig, TargetType

### Community 45 - "Dialog.tsx"
Cohesion: 0.15
Nodes (12): ref_node_fs, ref_node_path, react-dom, vite, vite-plugin-pwa, @vitejs/plugin-react, Dialog(), DIALOG_ROOT_ID (+4 more)

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
Cohesion: 0.38
Nodes (7): Autotiling, buildPathCorners(), buildWaterCorners(), generate(), removeDiagonals(), rng(), valueNoise()

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.09
Nodes (14): classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions, Rage (+6 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.14
Nodes (9): TODO: Abstract this capping functionality out as many spells might use., Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone(), targetVector(), TargetWithBody (+1 more)

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (27): AreaTuning, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view (+19 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.33
Nodes (11): ApiItem, baseUrl(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock(), StoreItem (+3 more)

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
Cohesion: 0.22
Nodes (9): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4b — Schematic drops, Step 4c — Schematic shop, Step 5 — Arcanum spell shop (scrolls) (+1 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - ".constructor"
Cohesion: 0.11
Nodes (8): Hero, HeroConfig, AssignResource(), CombatText, MapStateOptions, mapStateToData(), state$, setBaseStats

### Community 78 - "react"
Cohesion: 0.07
Nodes (46): Step 1 — Shop skeletons: open & close every shop (this PR), react, buyLoot, setMerchantMode, switchUi, toggleFilter, Button(), ButtonProps (+38 more)

### Community 79 - "Settings.tsx"
Cohesion: 0.11
Nodes (24): DEFAULT_AREA_TUNING, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), InstallBanner() (+16 more)

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
Cohesion: 0.35
Nodes (10): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+2 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)"
Cohesion: 0.67
Nodes (3): Phase 7 — Armory migration to Vercel (non-destructive; issue TBD), PR1 — Legacy contract baseline (pre-step) ✅ this PR, PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.12
Nodes (20): BIOMES, BOULDER, cornerAt(), fade(), GROUND_DECO, lerp(), maskAt(), octave() (+12 more)

### Community 92 - "PhaserGame.tsx"
Cohesion: 0.29
Nodes (5): react-dnd-touch-backend, container, PhaserGame, PhaserGame(), src_styles_globals

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.14
Nodes (8): resolveBiome(), FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 98 - "fonts.ts"
Cohesion: 0.27
Nodes (6): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, FONT_FAMILY, FONT_URL, CombatTextConfig, LogoOptions

### Community 99 - "Player"
Cohesion: 0.08
Nodes (11): classes, PlayerConfig, Cleric, Mage, Occultist, Player, Ranger, Warrior (+3 more)

### Community 100 - "Player.ts"
Cohesion: 0.10
Nodes (25): phaser, uuid, CirclingConfig, EnemyStates, HitParams, Destination, DrawBarOptions, AssignResourceName (+17 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 106 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 107 - "GroupedStats.tsx"
Cohesion: 0.33
Nodes (6): PlayerStats, Stats(), GroupedAttributesProps, GroupedStats(), GroupedStatsProps, StatItem

### Community 108 - "AssignSpell.ts"
Cohesion: 0.09
Nodes (8): AssignSpell, classes, Faith, Frostbolt, Heal, ManaShield, Smite, SpellOptions

### Community 110 - "ItemTooltip.tsx"
Cohesion: 0.22
Nodes (8): Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module, MenuContext

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 142 - "LootItem"
Cohesion: 0.09
Nodes (23): polished, getResourceColour(), LootItem, src_ui_components_atoms_slot_module, Slot(), SlotComponentProps, SlotProps, DetailedLoot() (+15 more)

### Community 149 - "lodash"
Cohesion: 0.09
Nodes (13): lodash, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE (+5 more)

## Knowledge Gaps
- **464 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+459 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 755 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `Merchant.tsx`, `TownScene`, `generateItem.ts`, `Item.ts`, `BossRoar.ts`, `game.ts`, `BiomeScene.ts`, `Resource.test.ts`, `LootItem`, `operations/helpers.ts`, `lodash`, `package.json`, `Enemy.test.ts`, `TownScene.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `gameReducer.ts`, `TownScene.test.ts`, `Dialog.tsx`, `Spell.test.ts`, `TargetReticle.test.ts`, `Projectile`, `SpawnDirector`, `react`, `Settings.tsx`, `statConversion.ts`, `BiomeScene.test.ts`, `fonts.ts`, `Player.test.ts`, `Invocation`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **Why does `phaser` connect `Player.ts` to `CastingController.test.ts`, `vitest`, `BossRoar.ts`, `Frostbolt.ts`, `game.ts`, `BiomeScene.ts`, `lodash`, `package.json`, `TownScene.ts`, `SpellButton`, `LoadScene.ts`, `TownScene.test.ts`, `Spell.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `Projectile`, `SpawnDirector`, `.constructor`, `PhaserGame.tsx`, `BiomeScene.test.ts`, `fonts.ts`, `Player`, `bannerStyle`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Frostbolt.ts`, `game.ts`, `BiomeScene.ts`, `CastingController`, `EnemyOptions`, `Enemy.test.ts`, `area.ts`, `BiomeScene`, `SnareTrap.ts`, `Spell.ts`, `Monster`, `Projectile`, `SiphonSoul`, `Multishot`, `Consecration`, `Boons.ts`, `Player`, `Player.ts`, `AssignSpell.ts`, `Whirlwind`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _464 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11375661375661375 - nodes in this community are weakly interconnected._
- **Should `Merchant.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10960960960960961 - nodes in this community are weakly interconnected._