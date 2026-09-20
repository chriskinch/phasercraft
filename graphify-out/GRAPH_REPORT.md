# Graph Report - phasercraft  (2026-09-25)

## Corpus Check
- 274 files · ~426,420 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1933 nodes · 4323 edges · 112 communities (85 shown, 27 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7ee7243a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- Spell
- game.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- HUD.ts
- BossRoar.test.ts
- AssignSpell.ts
- devDependencies
- Stats.tsx
- CastingController.ts
- BiomeScene.ts
- react
- StoredItem
- items/index.ts
- HUD.test.ts
- store/index.ts
- CastingController
- gameReducer.test.ts
- Phasercraft
- package.json
- EnemyOptions
- Enemy.test.ts
- gameReducer.ts
- area.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- PhaserGame.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap.ts
- Character.tsx
- UI.tsx
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- PlayerOptions
- System.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- AreaEffect.ts
- Button.tsx
- GroupedAttributes.tsx
- Resource
- InstallBanner.test.tsx
- vercel.json
- Vercel deployment (Phase 6)
- Player.ts
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- operations/helpers.ts
- Armory.tsx
- vitest
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- GameState
- MerchantModeToggle.tsx
- Settings.tsx
- Item
- .constructor
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- engines
- generate-biome-maps.mjs
- main.tsx
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Invocation.ts
- CastBar
- Player
- Projectile
- EarthShield
- Player.test.ts
- Tilemaps
- CastBar.test.ts
- Whirlwind
- Price.tsx
- .setExperience
- SelectScene
- Item.ts
- Equipment.tsx
- lodash

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `vitest` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 47 edges
7. `BiomeScene` - 42 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Resource` - 30 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts

## Import Cycles
- None detected.

## Communities (112 total, 27 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (12): MoveOptions, CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub (+4 more)

### Community 2 - "game.ts"
Cohesion: 0.07
Nodes (46): react-tooltip, buyComponent, buyGear, MerchantMode, MerchantState, refreshMerchant, AdjustValue, CHARACTER_BASE_STATS (+38 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.19
Nodes (3): TownScene, setCurrentArea, setPlayerPosition

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "HUD.ts"
Cohesion: 0.19
Nodes (14): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+6 more)

### Community 8 - "BossRoar.test.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 9 - "AssignSpell.ts"
Cohesion: 0.07
Nodes (12): AssignSpell, classes, Faith, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield (+4 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.13
Nodes (13): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+5 more)

### Community 12 - "CastingController.ts"
Cohesion: 0.22
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, TargetKind

### Community 13 - "BiomeScene.ts"
Cohesion: 0.16
Nodes (11): rxjs, AssignType, Boss, MapStateOptions, mapStateToData(), state$, buildWalkability(), isFootprintSpawnable() (+3 more)

### Community 14 - "react"
Cohesion: 0.15
Nodes (22): react, react-dnd, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps (+14 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "store/index.ts"
Cohesion: 0.12
Nodes (20): react-redux, RootState, Coins(), CoinsProps, src_ui_components_atoms_coins_module, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module (+12 more)

### Community 20 - "gameReducer.test.ts"
Cohesion: 0.16
Nodes (16): colorForQuality(), componentTotal(), craftedItem(), craftItem, freshMerchant(), gameReducer, missingMaterials(), syncStats() (+8 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+25 more)

### Community 23 - "EnemyOptions"
Cohesion: 0.18
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 24 - "Enemy.test.ts"
Cohesion: 0.16
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "gameReducer.ts"
Cohesion: 0.14
Nodes (18): AssignClass, classes, PlayerConfig, PlayerName, PlayerType, BiomeId, resolveBiome(), GameSceneConfig (+10 more)

### Community 26 - "area.ts"
Cohesion: 0.13
Nodes (19): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DEFAULT_AREA_TUNING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable() (+11 more)

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

### Community 31 - "PhaserGame.tsx"
Cohesion: 0.10
Nodes (10): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, BootScene, createLogo(), LogoOptions (+2 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.10
Nodes (3): Enemy, Monster, AssignResource()

### Community 34 - "BiomeScene"
Cohesion: 0.14
Nodes (6): BiomeDefinition, BiomeScene, clearTravelRequest, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.20
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "Character.tsx"
Cohesion: 0.12
Nodes (17): PlayerStats, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, DetailedLoot(), DetailedLootProps, src_ui_components_molecules_detailedloot_module (+9 more)

### Community 39 - "UI.tsx"
Cohesion: 0.11
Nodes (22): Step 1 — Shop skeletons: open & close every shop (this PR), switchUi, Navigation(), Header(), HeaderConfig, HeaderProps, src_ui_components_organisms_header_module, Alchemist() (+14 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "PlayerOptions"
Cohesion: 0.15
Nodes (7): Cleric, Mage, Occultist, Ranger, Warrior, SpellType, PlayerOptions

### Community 45 - "System.tsx"
Cohesion: 0.46
Nodes (4): Dialog(), DIALOG_ROOT_ID, DialogProps, getDialogRoot()

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 50 - "AreaEffect.ts"
Cohesion: 0.17
Nodes (4): Consecration, AreaEffect, OverlapTarget, ArcadeCollisionObject

### Community 51 - "Button.tsx"
Cohesion: 0.20
Nodes (12): BIOME_IDS, BiomeMap, BIOMES, DEFAULT_BIOME, requestTravel, Button(), ButtonProps, src_ui_components_atoms_button_module (+4 more)

### Community 52 - "GroupedAttributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 54 - "InstallBanner.test.tsx"
Cohesion: 0.19
Nodes (7): InstallBanner(), src_ui_components_molecules_installbanner_module, BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Player.ts"
Cohesion: 0.08
Nodes (26): phaser, uuid, CirclingConfig, EnemyStates, HitParams, GEM_BASE_VALUE, GemConfig, HeroConfig (+18 more)

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (28): AreaTuning, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view (+20 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 64 - "Armory.tsx"
Cohesion: 0.18
Nodes (18): ApiItem, baseUrl(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock(), StoreItem (+10 more)

### Community 65 - "vitest"
Cohesion: 0.20
Nodes (11): @testing-library/react, vitest, loadGame, helm, stacks, sampleItems, initialGame, seed() (+3 more)

### Community 66 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "generate-pwa-icons.mjs"
Cohesion: 0.12
Nodes (13): ref_node_fs, ref_node_path, ref_node_url, sharp, vite, vite-plugin-pwa, @vitejs/plugin-react, BG (+5 more)

### Community 75 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.14
Nodes (15): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 3 — Merchant shop, Step 4 — Blacksmith crafting, Step 4a — Crafting core (this PR), Step 4b — Schematic drops (+7 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "GameState"
Cohesion: 0.40
Nodes (5): GameState, ComponentStack, Equipment, ItemTooltipProps, ProviderOptions

### Community 78 - "MerchantModeToggle.tsx"
Cohesion: 0.22
Nodes (11): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), src_ui_themes_module (+3 more)

### Community 79 - "Settings.tsx"
Cohesion: 0.18
Nodes (17): PhaserGame(), DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), hintStyle (+9 more)

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
Cohesion: 0.29
Nodes (11): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+3 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.05
Nodes (52): Autotiling, CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules, Agentic Readiness Roadmap (+44 more)

### Community 92 - "main.tsx"
Cohesion: 0.29
Nodes (5): react-dnd-touch-backend, react-dom, container, PhaserGame, src_styles_globals

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.14
Nodes (9): ref_console, BOSS_SCALE, FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest (+1 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "Invocation.ts"
Cohesion: 0.06
Nodes (17): Deferred / backlog, Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+9 more)

### Community 100 - "Projectile"
Cohesion: 0.19
Nodes (5): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "Tilemaps"
Cohesion: 0.29
Nodes (5): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 106 - "Price.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 142 - "Equipment.tsx"
Cohesion: 0.15
Nodes (14): polished, getResourceColour(), sellComponent, sellComponentStack, sellLoot, src_ui_components_molecules_statbar_module, StatBar(), StatBarProps (+6 more)

### Community 149 - "lodash"
Cohesion: 0.08
Nodes (12): lodash, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GemUnderTest (+4 more)

## Knowledge Gaps
- **464 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+459 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 754 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `game.ts`, `generateItem.ts`, `Item.ts`, `HUD.ts`, `BossRoar.test.ts`, `BiomeScene.ts`, `Equipment.tsx`, `HUD.test.ts`, `store/index.ts`, `gameReducer.test.ts`, `lodash`, `package.json`, `Enemy.test.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `UI.tsx`, `TownScene.test.ts`, `System.tsx`, `Spell.test.ts`, `TargetReticle.test.ts`, `Button.tsx`, `Resource`, `InstallBanner.test.tsx`, `Player.ts`, `SpawnDirector`, `operations/helpers.ts`, `generate-pwa-icons.mjs`, `Settings.tsx`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `Invocation.ts`, `Projectile`, `Player.test.ts`, `CastBar.test.ts`?**
  _High betweenness centrality (0.199) - this node is a cross-community bridge._
- **Why does `phaser` connect `Player.ts` to `CastingController.test.ts`, `game.ts`, `HUD.ts`, `BossRoar.test.ts`, `AssignSpell.ts`, `CastingController.ts`, `BiomeScene.ts`, `lodash`, `package.json`, `gameReducer.ts`, `SpellButton`, `PhaserGame.tsx`, `Enemy`, `TownScene.test.ts`, `TargetReticle`, `Spell.test.ts`, `TargetReticle.test.ts`, `AreaEffect.ts`, `Resource`, `SpawnDirector`, `BiomeScene.test.ts`, `Invocation.ts`, `Projectile`, `CastBar.test.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `Player` connect `Player` to `Spell`, `game.ts`, `TownScene`, `AssignSpell.ts`, `BiomeScene.ts`, `CastingController`, `EnemyOptions`, `Enemy.test.ts`, `gameReducer.ts`, `Enemy`, `Character.tsx`, `PlayerOptions`, `AreaEffect.ts`, `Resource`, `Player.ts`, `.constructor`, `Invocation.ts`, `CastBar`, `Player.test.ts`, `.setExperience`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _464 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11083743842364532 - nodes in this community are weakly interconnected._
- **Should `game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06918238993710692 - nodes in this community are weakly interconnected._