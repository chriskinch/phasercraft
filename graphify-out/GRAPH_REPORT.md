# Graph Report - phasercraft  (2026-09-28)

## Corpus Check
- 282 files · ~433,919 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1985 nodes · 4620 edges · 115 communities (90 shown, 25 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 111 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `046e5611`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- TownScene
- Player.ts
- Item
- store/index.ts
- generateItem.ts
- compilerOptions
- Blacksmith.tsx
- phaser
- AssignSpell.ts
- devDependencies
- lodash
- game.ts
- BiomeScene.ts
- Button
- StoredItem
- items/index.ts
- gameReducer.ts
- Merchant.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- EnemyOptions
- Enemy.test.ts
- Button.tsx
- area.ts
- SpellButton
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
- MerchantModeToggle.tsx
- Blacksmith crafting UI — design spec
- Resource
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- TownScene.ts
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- sfx.ts
- Resource.ts
- BossRoar.ts
- vercel.json
- Vercel deployment (Phase 6)
- GroupedAttributes.tsx
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- CastingController.ts
- armoryClient.ts
- operations/helpers.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- Tilemaps
- UI.tsx
- vitest
- Hero
- Consecration
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- repository
- CombatText
- generate-biome-maps.mjs
- Shield
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Boons.ts
- Resource.test.ts
- Player
- SelectScene
- EarthShield
- Player.test.ts
- build
- Enemy.ts
- Invocation.test.ts
- LoadScene
- Stats.tsx
- Spell
- engines
- ItemTooltip.tsx
- useInstallPrompt.ts
- Whirlwind
- react
- Gem.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `vitest` - 65 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 49 edges
7. `BiomeScene` - 42 edges
8. `SpellOptions` - 36 edges
9. `Button()` - 34 edges
10. `CastingController` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Autotiling` --references--> `removeDiagonals()`  [INFERRED]
  assets/tilesets/README.md → scripts/generate-biome-maps.mjs
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Collision` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts
- `Layers` --references--> `BiomeScene`  [INFERRED]
  assets/tilesets/README.md → src/scenes/biomes/BiomeScene.ts

## Import Cycles
- None detected.

## Communities (115 total, 25 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.11
Nodes (11): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 1 - "TownScene"
Cohesion: 0.06
Nodes (9): HudUnderTest, UI, FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest, TownScene, addLoot (+1 more)

### Community 2 - "Player.ts"
Cohesion: 0.17
Nodes (11): classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions, Ranger (+3 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (17): uuid, Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo (+9 more)

### Community 4 - "store/index.ts"
Cohesion: 0.16
Nodes (15): react-redux, @reduxjs/toolkit, GameState, loadGame, RootState, ComponentStack, CoinsProps, src_ui_components_atoms_coins_module (+7 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "Blacksmith.tsx"
Cohesion: 0.19
Nodes (13): craftItem, RECIPES, Blacksmith(), materialEntries(), src_ui_components_templates_blacksmith_module, RARITY_TINT, Slot(), SlotProps (+5 more)

### Community 8 - "phaser"
Cohesion: 0.12
Nodes (13): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, phaser, ref_styles_fonts_boldpixels_woff2_url, bannerStyle(), FONT_FAMILY, FONT_URL, CombatTextConfig, PhaserGame() (+5 more)

### Community 9 - "AssignSpell.ts"
Cohesion: 0.05
Nodes (16): classes, Boon, Enrage, EnrageValue, Faith, Frostbolt, FrostboltValue, Heal (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "lodash"
Cohesion: 0.19
Nodes (12): lodash, AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat(), StatProps, Health(), HealthProps (+4 more)

### Community 12 - "game.ts"
Cohesion: 0.10
Nodes (20): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, ComponentDef, EQUIPMENT_SLOTS, GAME_BALANCE (+12 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.18
Nodes (11): ref_console, rxjs, Boss, BOSS_SCALE, MapStateOptions, state$, buildWalkability(), isFootprintSpawnable() (+3 more)

### Community 14 - "Button"
Cohesion: 0.14
Nodes (25): @testing-library/react, LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData (+17 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "gameReducer.ts"
Cohesion: 0.09
Nodes (31): Step 3 — Merchant shop, PlayerName, addComponent, addXP, buyComponent, buyGear, clearTravelRequest, consumeComponent() (+23 more)

### Community 18 - "Merchant.tsx"
Cohesion: 0.07
Nodes (47): MerchantMode, MerchantState, COMPONENT_DEFS, COMPONENT_TYPES, componentBuyPrice(), ComponentType, merchantPartsBase(), merchantRestockRemaining() (+39 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.13
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (33): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+25 more)

### Community 23 - "EnemyOptions"
Cohesion: 0.15
Nodes (6): AssignType, classes, Healer, Melee, Ranged, EnemyOptions

### Community 24 - "Enemy.test.ts"
Cohesion: 0.16
Nodes (6): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 25 - "Button.tsx"
Cohesion: 0.20
Nodes (10): polished, BIOME_IDS, requestTravel, toggleUi, ButtonProps, src_ui_components_atoms_button_module, BiomeSelect(), src_ui_components_templates_biomeselect_module (+2 more)

### Community 26 - "area.ts"
Cohesion: 0.17
Nodes (15): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), resolveAreaTuning(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+7 more)

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

### Community 31 - "Equipment.tsx"
Cohesion: 0.14
Nodes (18): getResourceColour(), sellComponent, sellComponentStack, sellLoot, Slot(), DetailedLoot(), src_ui_components_molecules_statbar_module, StatBar() (+10 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.15
Nodes (5): BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap.ts"
Cohesion: 0.14
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 38 - "MerchantModeToggle.tsx"
Cohesion: 0.18
Nodes (14): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+6 more)

### Community 39 - "Blacksmith crafting UI — design spec"
Cohesion: 0.19
Nodes (17): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+9 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "TownScene.ts"
Cohesion: 0.29
Nodes (7): AssignClass, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig

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

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs

### Community 51 - "generate"
Cohesion: 0.36
Nodes (8): buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng(), valueNoise()

### Community 52 - "sfx.ts"
Cohesion: 0.27
Nodes (6): WeaponConfig, playSfx(), SFX, sfxGain(), SfxKey, addCoins

### Community 53 - "Resource.ts"
Cohesion: 0.13
Nodes (16): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, HealthOptions, Mana, ManaOptions (+8 more)

### Community 54 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "GroupedAttributes.tsx"
Cohesion: 0.27
Nodes (8): PlayerStats, Attribute(), Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module, GroupedAttributesProps, NumericStats

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (28): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+20 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "CastingController.ts"
Cohesion: 0.25
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

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

### Community 75 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.22
Nodes (9): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4c — Schematic shop, Step 4d — Special items (#481), Step 5 — Arcanum spell shop (scrolls) (+1 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Tilemaps"
Cohesion: 0.25
Nodes (6): Autotiling, Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 78 - "UI.tsx"
Cohesion: 0.07
Nodes (33): Step 1 — Shop skeletons: open & close every shop (this PR), react-dnd, react-dnd-touch-backend, react-dom, App(), container, PhaserGame, buyLoot (+25 more)

### Community 79 - "vitest"
Cohesion: 0.14
Nodes (18): vitest, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), autoSpawnRadius() (+10 more)

### Community 81 - "Consecration"
Cohesion: 0.11
Nodes (7): Deferred / backlog, Consecration, Banes, IndexableStats, StatusEffects, AreaEffect, ArcadeCollisionObject

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
Cohesion: 0.31
Nodes (12): Layout — forge (desktop), appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion (+4 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

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

### Community 97 - "Boons.ts"
Cohesion: 0.33
Nodes (4): Boons, StatusEffect, setStats, updateStats

### Community 98 - "Resource.test.ts"
Cohesion: 0.24
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 99 - "Player"
Cohesion: 0.10
Nodes (6): MonsterConfig, Player, AssignResource(), AssignSpell, Weapon, setLevel

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.29
Nodes (7): Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build()

### Community 104 - "Enemy.ts"
Cohesion: 0.08
Nodes (22): CirclingConfig, EnemyStates, EnemyStats, HitParams, PlayerType, Multishot, SpellValue, TODO: Abstract this capping functionality out as many spells might use. (+14 more)

### Community 106 - "LoadScene"
Cohesion: 0.15
Nodes (7): Step 4e — Craft SFX (first audio in the game) (#482), Sound (first audio in the game), AnimationConfig, createAnimations(), EnemyConfig, EnemyType, LoadScene

### Community 107 - "Stats.tsx"
Cohesion: 0.24
Nodes (8): src_ui_components_molecules_stats_module, StatItem, Stats(), StatsProps, StatsStyles, GroupedStats(), GroupedStatsProps, StatItem

### Community 108 - "Spell"
Cohesion: 0.11
Nodes (5): MoveOptions, Fireball, Spell, SpellProjectileConfig, TargetType

### Community 110 - "ItemTooltip.tsx"
Cohesion: 0.22
Nodes (8): Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module, MenuContext

### Community 113 - "useInstallPrompt.ts"
Cohesion: 0.43
Nodes (5): BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 142 - "react"
Cohesion: 0.15
Nodes (18): react, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, helm, src_ui_components_atoms_slot_module, SlotComponentProps (+10 more)

### Community 149 - "Gem.ts"
Cohesion: 0.09
Nodes (13): Step 4b — Schematic drops, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE (+5 more)

## Knowledge Gaps
- **478 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+473 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 767 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **25 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `TownScene`, `Item`, `store/index.ts`, `generateItem.ts`, `Blacksmith.tsx`, `phaser`, `lodash`, `BiomeScene.ts`, `Button`, `react`, `gameReducer.ts`, `Merchant.tsx`, `Gem.ts`, `package.json`, `Enemy.test.ts`, `Button.tsx`, `area.ts`, `SpellButton`, `handlers.test.ts`, `Equipment.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `MerchantModeToggle.tsx`, `vite.config.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `sfx.ts`, `BossRoar.ts`, `SpawnDirector`, `operations/helpers.ts`, `UI.tsx`, `statConversion.ts`, `BiomeScene.test.ts`, `Resource.test.ts`, `Player.test.ts`, `Enemy.ts`, `Invocation.test.ts`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `CastingController.test.ts`, `TownScene`, `Player.ts`, `AssignSpell.ts`, `game.ts`, `BiomeScene.ts`, `Button`, `Gem.ts`, `package.json`, `SpellButton`, `SnareTrap.ts`, `TargetReticle`, `TownScene.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `sfx.ts`, `Resource.ts`, `BossRoar.ts`, `SpawnDirector`, `CastingController.ts`, `vitest`, `Hero`, `BiomeScene.test.ts`, `Player`, `Enemy.ts`, `LoadScene`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Player.ts`, `AssignSpell.ts`, `game.ts`, `BiomeScene.ts`, `CastingController`, `Gem.ts`, `EnemyOptions`, `Enemy.test.ts`, `area.ts`, `BiomeScene`, `SnareTrap.ts`, `Resource.ts`, `SiphonSoul`, `CastingController.ts`, `Consecration`, `Player`, `Enemy.ts`, `Spell`, `Whirlwind`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _478 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11375661375661375 - nodes in this community are weakly interconnected._
- **Should `TownScene` be split into smaller, more focused modules?**
  _Cohesion score 0.06077694235588972 - nodes in this community are weakly interconnected._