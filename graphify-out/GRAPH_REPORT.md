# Graph Report - phasercraft  (2026-09-24)

## Corpus Check
- 272 files · ~420,039 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1896 nodes · 4203 edges · 118 communities (91 shown, 27 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 63 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `49c6a97e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- gameReducer.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- HUD.ts
- CastBar
- SpellOptions
- devDependencies
- Stats.tsx
- Resource
- BiomeScene.ts
- MerchantModeToggle.tsx
- StoredItem
- items/index.ts
- HUD.test.ts
- store/index.ts
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- Enemy.test.ts
- Spell
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- phaser
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap.ts
- vite.config.ts
- UI.tsx
- TownScene.test.ts
- Consecration
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- CharacterCard.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- AssignClass.ts
- mapStateToData
- generate
- lodash
- Resource.ts
- react
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
- SpawnDebugOverlay.test.ts
- SpawnHost
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
- Dialog.tsx
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- Enemy.ts
- Boons.ts
- settingsStorage.ts
- ItemTooltip.tsx
- TownScene.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- repository
- EarthShield
- generate-biome-maps.mjs
- SpawnDirector
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- Item
- Invocation
- Player.ts
- Resource.test.ts
- SpawnDirector.ts
- Player.test.ts
- InstallBanner.tsx
- SpawnDirector.test.ts
- Hero
- .constructor
- main.tsx
- Equipment.test.tsx
- Shield
- Whirlwind
- Health
- Rage
- engines
- simple-git-hooks
- Item.ts
- Character.tsx
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `react` - 59 edges
4. `vitest` - 58 edges
5. `Spell` - 58 edges
6. `phaser` - 44 edges
7. `BiomeScene` - 41 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Resource` - 30 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts
- `Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Autotiling` --references--> `removeDiagonals()`  [INFERRED]
  assets/tilesets/README.md → scripts/generate-biome-maps.mjs
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs

## Import Cycles
- None detected.

## Communities (118 total, 27 thin omitted)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.08
Nodes (10): MoveOptions, classes, Faith, Fireball, Heal, ManaShield, Smite, SpellValue (+2 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.07
Nodes (51): Step 3 — Merchant shop, CraftingConfig, addComponent, addXP, buyComponent, buyGear, buyLoot, clearTravelRequest (+43 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "HUD.ts"
Cohesion: 0.21
Nodes (13): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+5 more)

### Community 8 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 9 - "SpellOptions"
Cohesion: 0.11
Nodes (10): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.21
Nodes (8): ref_console, Boss, BOSS_SCALE, buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 14 - "MerchantModeToggle.tsx"
Cohesion: 0.15
Nodes (16): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+8 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "HUD.test.ts"
Cohesion: 0.15
Nodes (6): AssignType, HudUnderTest, BiomeDefinition, setBossActive, setEnemiesRemaining, EnemyType

### Community 18 - "store/index.ts"
Cohesion: 0.12
Nodes (23): @reduxjs/toolkit, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, ComponentsGrid() (+15 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (11): CastableSpell, CastingController, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub (+3 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (29): eslintConfig, description, homepage, keywords, name, private, version, eslint (+21 more)

### Community 23 - "game.ts"
Cohesion: 0.08
Nodes (23): EnemyStats, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, ComponentDef, EnemyAttributes (+15 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.17
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.06
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton, ButtonUnderTest, TargetReticle, GraphicsStub, ReticleUnderTest

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (16): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+8 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "phaser"
Cohesion: 0.10
Nodes (12): phaser, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene (+4 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.05
Nodes (11): classes, Enemy, Healer, Melee, Monster, MonsterConfig, Ranged, AssignResource() (+3 more)

### Community 34 - "BiomeScene"
Cohesion: 0.12
Nodes (8): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, resolveAreaTuning(), BiomeScene, toggleHUD

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.14
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "vite.config.ts"
Cohesion: 0.22
Nodes (6): ref_node_fs, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 39 - "UI.tsx"
Cohesion: 0.11
Nodes (28): Step 1 — Shop skeletons: open & close every shop (this PR), react-redux, requestTravel, switchUi, toggleUi, Button(), ButtonProps, src_ui_components_atoms_button_module (+20 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 41 - "Consecration"
Cohesion: 0.17
Nodes (4): Deferred / backlog, Consecration, AreaEffect, ArcadeCollisionObject

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.17
Nodes (15): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DEFAULT_AREA_TUNING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+7 more)

### Community 45 - "CharacterCard.tsx"
Cohesion: 0.43
Nodes (6): PlayerName, selectCharacter, setCoins, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 50 - "mapStateToData"
Cohesion: 0.18
Nodes (9): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, rxjs, MapStateOptions, mapStateToData() (+1 more)

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 52 - "lodash"
Cohesion: 0.22
Nodes (8): lodash, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource.ts"
Cohesion: 0.21
Nodes (10): classes, Energy, EnergyOptions, HealthOptions, Mana, ManaOptions, RageOptions, DrawBarOptions (+2 more)

### Community 54 - "react"
Cohesion: 0.10
Nodes (30): react, react-dnd, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps (+22 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.19
Nodes (5): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 58 - "SpawnDebugOverlay.test.ts"
Cohesion: 0.21
Nodes (10): coneEdges(), countdownLabel(), OverlayEnemy, SpawnDebugOverlay, SpawnDebugSource, fakeGraphics(), fakeText(), makeOverlay() (+2 more)

### Community 59 - "SpawnHost"
Cohesion: 0.15
Nodes (3): Point, Rect, SpawnHost

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "build"
Cohesion: 0.22
Nodes (9): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset() (+1 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 65 - "vitest"
Cohesion: 0.18
Nodes (8): @testing-library/react, vitest, helm, stacks, sampleItems, makeTestStore(), renderWithProviders(), RenderWithProvidersResult

### Community 66 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "Dialog.tsx"
Cohesion: 0.15
Nodes (12): ref_node_path, ref_node_url, react-dom, sharp, BG, ICON_DIR, root, SOURCE (+4 more)

### Community 75 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.29
Nodes (7): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Enemy.ts"
Cohesion: 0.10
Nodes (19): CirclingConfig, EnemyStates, HitParams, PlayerType, ActiveCast, CasterLike, CastingControllerOptions, CastingState (+11 more)

### Community 78 - "Boons.ts"
Cohesion: 0.18
Nodes (7): Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 79 - "settingsStorage.ts"
Cohesion: 0.19
Nodes (13): DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), hintStyle, rowStyle (+5 more)

### Community 80 - "ItemTooltip.tsx"
Cohesion: 0.20
Nodes (9): react-tooltip, Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module (+1 more)

### Community 81 - "TownScene.ts"
Cohesion: 0.20
Nodes (8): BIOME_IDS, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig, SelectScene

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
Cohesion: 0.19
Nodes (16): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+8 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.15
Nodes (16): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+8 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.17
Nodes (7): FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 99 - "Player.ts"
Cohesion: 0.13
Nodes (9): number-to-words, Destination, DrawBarOptions, AssignResourceName, AssignResourceType, CombatText, CombatTextConfig, Weapon (+1 more)

### Community 100 - "Resource.test.ts"
Cohesion: 0.24
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 101 - "SpawnDirector.ts"
Cohesion: 0.29
Nodes (8): isBeyondRadius(), sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view, SpawnedEnemy, Tracked

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "InstallBanner.tsx"
Cohesion: 0.27
Nodes (7): InstallBanner(), src_ui_components_molecules_installbanner_module, BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 104 - "SpawnDirector.test.ts"
Cohesion: 0.24
Nodes (5): AreaTuning, FakeEnemy, killAll(), makeDirector(), seeded()

### Community 107 - "main.tsx"
Cohesion: 0.33
Nodes (4): react-dnd-touch-backend, container, PhaserGame, src_styles_globals

### Community 108 - "Equipment.test.tsx"
Cohesion: 0.47
Nodes (4): loadGame, initialGame, seed(), seedParts()

### Community 134 - "Item.ts"
Cohesion: 0.17
Nodes (9): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock (+1 more)

### Community 142 - "Character.tsx"
Cohesion: 0.11
Nodes (17): polished, getResourceColour(), src_ui_components_atoms_slot_module, Slot(), SlotComponentProps, SlotProps, DetailedLoot(), src_ui_components_molecules_statbar_module (+9 more)

### Community 149 - "Gem.ts"
Cohesion: 0.09
Nodes (11): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, Gem, GEM_BASE_VALUE, GemConfig, GemUnderTest (+3 more)

## Knowledge Gaps
- **459 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+454 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 746 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **27 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `HUD.ts`, `CastBar`, `BiomeScene.ts`, `Character.tsx`, `HUD.test.ts`, `CastingController`, `Gem.ts`, `package.json`, `Enemy.test.ts`, `operations/helpers.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `vite.config.ts`, `TownScene.test.ts`, `area.ts`, `Spell.test.ts`, `Projectile`, `SpawnDebugOverlay.test.ts`, `Dialog.tsx`, `Enemy.ts`, `settingsStorage.ts`, `statConversion.ts`, `BiomeScene.test.ts`, `Invocation`, `Resource.test.ts`, `SpawnDirector.ts`, `Player.test.ts`, `SpawnDirector.test.ts`, `Equipment.test.tsx`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `AssignSpell.ts`, `gameReducer.ts`, `HUD.ts`, `CastBar`, `SpellOptions`, `BiomeScene.ts`, `CastingController`, `Gem.ts`, `package.json`, `game.ts`, `SpellButton`, `Enemy`, `SnareTrap.ts`, `TownScene.test.ts`, `Spell.test.ts`, `AssignClass.ts`, `Resource.ts`, `Projectile`, `SpawnDebugOverlay.test.ts`, `Enemy.ts`, `TownScene.ts`, `BiomeScene.test.ts`, `Player.ts`, `Hero`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Player` connect `Player` to `AssignSpell.ts`, `TownScene`, `CastBar`, `SpellOptions`, `BiomeScene.ts`, `CastingController`, `game.ts`, `Enemy.test.ts`, `Spell`, `Enemy`, `AssignClass.ts`, `Resource.ts`, `Enemy.ts`, `Boons.ts`, `TownScene.ts`, `statConversion.ts`, `Player.ts`, `Player.test.ts`, `Hero`, `.constructor`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _459 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.14624505928853754 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._