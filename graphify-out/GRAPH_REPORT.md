# Graph Report - phasercraft  (2026-09-25)

## Corpus Check
- 274 files · ~422,354 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1912 nodes · 4234 edges · 111 communities (89 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7f73a1a2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- Spell
- Merchant.tsx
- Item
- TownScene
- generateItem.ts
- compilerOptions
- HUD.ts
- BossRoar.test.ts
- Frostbolt.ts
- devDependencies
- Stats.tsx
- CastingController.ts
- BiomeScene.ts
- react
- StoredItem
- items/index.ts
- HUD.test.ts
- RootState
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- Enemy.ts
- Enemy.test.ts
- TownScene.ts
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- LoadScene
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap
- vite.config.ts
- UI.tsx
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- game.ts
- gameReducer.test.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- GroupedAttributes.tsx
- Resource
- LootItem
- vercel.json
- Vercel deployment (Phase 6)
- targetVector
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
- gameReducer.ts
- MerchantModeToggle.tsx
- area.ts
- phaser
- GameOverScene
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- repository
- Consecration
- generate-biome-maps.mjs
- SelectScene
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- StatusEffects
- ItemTooltip.tsx
- Player
- Projectile
- EarthShield
- Player.test.ts
- CharacterCard.tsx
- Frostbolt
- Invocation.test.ts
- spawnStyle.ts
- BootScene
- Item.ts
- StatBar.tsx
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `vitest` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 46 edges
7. `BiomeScene` - 42 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Resource` - 30 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts
- `Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Autotiling` --references--> `removeDiagonals()`  [INFERRED]
  assets/tilesets/README.md → scripts/generate-biome-maps.mjs

## Import Cycles
- None detected.

## Communities (111 total, 22 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 1 - "Spell"
Cohesion: 0.10
Nodes (4): Fireball, Heal, Spell, TargetType

### Community 2 - "Merchant.tsx"
Cohesion: 0.10
Nodes (30): buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, COMPONENT_DEFS, COMPONENT_TYPES, componentBuyPrice() (+22 more)

### Community 3 - "Item"
Cohesion: 0.14
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.16
Nodes (3): AssignClass, TownScene, toggleHUD

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "HUD.ts"
Cohesion: 0.16
Nodes (18): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+10 more)

### Community 8 - "BossRoar.test.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 9 - "Frostbolt.ts"
Cohesion: 0.09
Nodes (9): Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.12
Nodes (14): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+6 more)

### Community 12 - "CastingController.ts"
Cohesion: 0.13
Nodes (11): PlayerType, ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, SpellButtonOptions (+3 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.14
Nodes (13): ref_console, AssignType, Boss, BOSS_SCALE, buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid (+5 more)

### Community 14 - "react"
Cohesion: 0.08
Nodes (25): react, react-dnd, react-dnd-touch-backend, react-dom, container, PhaserGame, src_styles_globals, LootIcon() (+17 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "RootState"
Cohesion: 0.17
Nodes (16): RootState, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid(), src_ui_components_molecules_gearshopgrid_module (+8 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, description, engines, node, homepage, keywords, name, private (+25 more)

### Community 23 - "Enemy.ts"
Cohesion: 0.11
Nodes (13): classes, CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, Healer, Melee (+5 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.18
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "TownScene.ts"
Cohesion: 0.24
Nodes (10): BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig, clearTravelRequest (+2 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.07
Nodes (8): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarStart, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (16): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+8 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "LoadScene"
Cohesion: 0.20
Nodes (5): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, LoadScene

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.10
Nodes (4): Enemy, Monster, MonsterConfig, AssignResource()

### Community 34 - "BiomeScene"
Cohesion: 0.13
Nodes (6): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, BiomeScene

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "UI.tsx"
Cohesion: 0.11
Nodes (29): Step 1 — Shop skeletons: open & close every shop (this PR), polished, react-redux, requestTravel, switchUi, toggleUi, Button(), ButtonProps (+21 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "game.ts"
Cohesion: 0.08
Nodes (26): classes, ManaShield, Smite, SpellValue, TODO: Abstract this capping functionality out as many spells might use., AdjustValue, CHARACTER_BASE_STATS, CharacterData (+18 more)

### Community 45 - "gameReducer.test.ts"
Cohesion: 0.18
Nodes (12): buyLoot, sellComponent, sellComponentStack, sellLoot, toggleFilter, Stock(), Armory(), src_ui_components_templates_armory_module (+4 more)

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
Cohesion: 0.33
Nodes (5): CLAUDE.md — Working agreement and project conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "GroupedAttributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.05
Nodes (21): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+13 more)

### Community 54 - "LootItem"
Cohesion: 0.17
Nodes (18): react-dnd-html5-backend, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+10 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "targetVector"
Cohesion: 0.16
Nodes (6): Multishot, Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (28): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+20 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "build"
Cohesion: 0.33
Nodes (6): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build()

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 65 - "vitest"
Cohesion: 0.17
Nodes (11): @testing-library/react, vitest, loadGame, helm, stacks, sampleItems, initialGame, seed() (+3 more)

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

### Community 77 - "gameReducer.ts"
Cohesion: 0.10
Nodes (28): Step 3 — Merchant shop, lodash, @reduxjs/toolkit, rxjs, Destination, DrawBarOptions, Boons, MapStateOptions (+20 more)

### Community 78 - "MerchantModeToggle.tsx"
Cohesion: 0.15
Nodes (16): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+8 more)

### Community 79 - "area.ts"
Cohesion: 0.07
Nodes (36): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+28 more)

### Community 80 - "phaser"
Cohesion: 0.24
Nodes (6): phaser, fontConfig, HeroConfig, WeaponConfig, createLogo(), LogoOptions

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
Cohesion: 0.27
Nodes (11): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, StatFormat (+3 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "Consecration"
Cohesion: 0.21
Nodes (3): Consecration, AreaEffect, ArcadeCollisionObject

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.13
Nodes (18): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), offset(), PATH_BY_MASK (+10 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.16
Nodes (7): FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 96 - "UI"
Cohesion: 0.20
Nodes (4): Code conventions, UI, mapStateToData(), addLoot

### Community 97 - "StatusEffects"
Cohesion: 0.21
Nodes (5): Deferred / backlog, Banes, IndexableStats, StatusEffect, StatusEffects

### Community 98 - "ItemTooltip.tsx"
Cohesion: 0.20
Nodes (9): react-tooltip, Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module (+1 more)

### Community 99 - "Player"
Cohesion: 0.05
Nodes (15): classes, PlayerConfig, Cleric, Hero, Mage, Occultist, Player, Ranger (+7 more)

### Community 100 - "Projectile"
Cohesion: 0.27
Nodes (4): Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "CharacterCard.tsx"
Cohesion: 0.47
Nodes (5): PlayerName, setCoins, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module

### Community 106 - "spawnStyle.ts"
Cohesion: 0.40
Nodes (3): dropIn(), DropInItem, DropInOptions

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock

### Community 142 - "StatBar.tsx"
Cohesion: 0.25
Nodes (7): getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 149 - "Gem.ts"
Cohesion: 0.09
Nodes (13): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE, GemConfig (+5 more)

## Knowledge Gaps
- **463 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+458 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 751 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `Merchant.tsx`, `generateItem.ts`, `Item.ts`, `HUD.ts`, `BossRoar.test.ts`, `CastingController.ts`, `BiomeScene.ts`, `StatBar.tsx`, `HUD.test.ts`, `RootState`, `Gem.ts`, `package.json`, `Enemy.test.ts`, `operations/helpers.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `vite.config.ts`, `UI.tsx`, `TownScene.test.ts`, `gameReducer.test.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `targetVector`, `SpawnDirector`, `area.ts`, `statConversion.ts`, `BiomeScene.test.ts`, `Projectile`, `Player.test.ts`, `Invocation.test.ts`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `CastingController.test.ts`, `HUD.ts`, `BossRoar.test.ts`, `Frostbolt.ts`, `CastingController.ts`, `BiomeScene.ts`, `Gem.ts`, `package.json`, `Enemy.ts`, `TownScene.ts`, `SpellButton`, `LoadScene`, `Enemy`, `TownScene.test.ts`, `TargetReticle`, `game.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `SpawnDirector`, `gameReducer.ts`, `BiomeScene.test.ts`, `Player`, `Projectile`, `spawnStyle.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Why does `Player` connect `Player` to `Enemy`, `Spell`, `TownScene`, `Player.test.ts`, `game.ts`, `gameReducer.ts`, `CastingController.ts`, `BiomeScene.ts`, `CastingController`, `Resource`, `Enemy.ts`, `TownScene.ts`, `SpellButton`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _463 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.10416666666666667 - nodes in this community are weakly interconnected._