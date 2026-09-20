# Graph Report - phasercraft  (2026-09-20)

## Corpus Check
- 261 files · ~398,749 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 65 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1720 nodes · 3831 edges · 111 communities (83 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 57 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74f7ab0f`
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
- Multishot.ts
- react
- Frostbolt.ts
- devDependencies
- Stats.tsx
- GameSceneLike
- LootItem
- phaser
- StoredItem
- items/index.ts
- EarthShield.ts
- store/index.ts
- CastingController.test.ts
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- AssignClass.ts
- HUD.ts
- vitest
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- Categories
- dependencies
- game.ts
- BiomeScene
- classes.ts
- Hero
- settingsStorage.ts
- CastingController
- UI.tsx
- Spell
- StatusEffects
- .prettierrc.json
- e2e/helpers.ts
- BiomeScene.ts
- CastingController.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Equipment.tsx
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- Attributes.tsx
- .constructor
- MerchantModeToggle.tsx
- vercel.json
- Vercel deployment (Phase 6)
- Price.tsx
- SiphonSoul
- UI
- qa-review.md
- log.js
- vite-env.d.ts
- Enemy
- armoryClient.ts
- Resource.test.ts
- Health.ts
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource
- graphify reference: query, path, explain
- Item
- CastableSpell
- TargetReticle
- SpellButton.test.ts
- SelectScene
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- TargetReticle.test.ts
- Player.ts
- vite.config.ts
- HUD.test.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Armory.tsx
- Phase 13 — Town shops system (issue TBD)
- main.tsx
- Healer
- GroupedStats.tsx
- Equipment.test.tsx
- PlayerUnderTest
- Dialog.tsx
- Shield
- Invocation.test.ts
- Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)
- Phase 8 — Frontend → REST, then teardown (issue TBD)
- repository
- simple-git-hooks
- Item.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 73 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 53 edges
6. `phaser` - 41 edges
7. `SpellOptions` - 36 edges
8. `CastingController` - 31 edges
9. `Resource` - 30 edges
10. `LootItem` - 27 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Code conventions` --references--> `mapStateToData()`  [INFERRED]
  CLAUDE.md → src/helpers/mapStateToData.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts
- `Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Phase 4 — Test buildout (done)` --references--> `Resource`  [INFERRED]
  docs/ROADMAP.md → src/entities/Resources/Resource.ts

## Import Cycles
- None detected.

## Communities (111 total, 28 thin omitted)

### Community 0 - "Player"
Cohesion: 0.13
Nodes (3): Player, setLevel, CombatType

### Community 1 - "AssignSpell.ts"
Cohesion: 0.08
Nodes (13): MoveOptions, AssignSpell, classes, Faith, Fireball, Heal, ManaShield, Smite (+5 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.07
Nodes (49): Step 3 — Merchant shop, AssignClass, addCoins, addComponent, addXP, buyComponent, buyGear, clearTravelRequest (+41 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene"
Cohesion: 0.11
Nodes (5): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest, TownScene

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "Multishot.ts"
Cohesion: 0.10
Nodes (11): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone() (+3 more)

### Community 8 - "react"
Cohesion: 0.15
Nodes (18): react, PlayerName, readAllSaves(), selectCharacter, setCoins, switchUi, Button(), ButtonProps (+10 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.08
Nodes (10): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, Invocation, InvocationValue, PowerInfusion (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "GameSceneLike"
Cohesion: 0.05
Nodes (19): Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem, GEM_BASE_VALUE, GemConfig (+11 more)

### Community 13 - "LootItem"
Cohesion: 0.09
Nodes (31): react-dnd, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+23 more)

### Community 14 - "phaser"
Cohesion: 0.11
Nodes (11): phaser, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, BootScene, createLogo() (+3 more)

### Community 15 - "StoredItem"
Cohesion: 0.11
Nodes (15): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+7 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "EarthShield.ts"
Cohesion: 0.12
Nodes (4): Consecration, EarthShield, AreaEffect, ArcadeCollisionObject

### Community 18 - "store/index.ts"
Cohesion: 0.12
Nodes (22): react-redux, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, ComponentsGrid() (+14 more)

### Community 19 - "CastingController.test.ts"
Cohesion: 0.14
Nodes (7): ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.15
Nodes (12): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 1 — CI quality gates, Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done) (+4 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.06
Nodes (34): eslintConfig, description, engines, node, homepage, keywords, name, private (+26 more)

### Community 23 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 24 - "HUD.ts"
Cohesion: 0.27
Nodes (8): LabelledContainer, styles, readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave()

### Community 25 - "vitest"
Cohesion: 0.20
Nodes (10): @testing-library/react, vitest, icon(), helm, stacks, sampleItems, makeTestStore(), ProviderOptions (+2 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.16
Nodes (3): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton

### Community 28 - "handlers.test.ts"
Cohesion: 0.10
Nodes (20): Captured, Handler, mockReq(), mockRes(), run(), categories, qualities, statNames (+12 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+10 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "Categories"
Cohesion: 0.08
Nodes (23): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+15 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "game.ts"
Cohesion: 0.06
Nodes (34): ref_console, classes, Boss, CirclingConfig, EnemyStates, EnemyStats, HitParams, Melee (+26 more)

### Community 34 - "BiomeScene"
Cohesion: 0.19
Nodes (4): AssignType, BiomeScene, setBossActive, setEnemiesRemaining

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "settingsStorage.ts"
Cohesion: 0.18
Nodes (14): PhaserGame(), DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings(), rowStyle (+6 more)

### Community 39 - "UI.tsx"
Cohesion: 0.09
Nodes (28): Step 1 — Shop skeletons: open & close every shop (this PR), BIOME_IDS, BIOMES, requestTravel, toggleUi, InstallBanner(), Header(), Alchemist() (+20 more)

### Community 41 - "StatusEffects"
Cohesion: 0.21
Nodes (5): Deferred / backlog, Banes, IndexableStats, StatusEffect, StatusEffects

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "BiomeScene.ts"
Cohesion: 0.22
Nodes (14): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies, BiomeDefinition (+6 more)

### Community 45 - "CastingController.ts"
Cohesion: 0.25
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Equipment.tsx"
Cohesion: 0.16
Nodes (12): polished, getResourceColour(), Slot(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, GroupedAttributes(), NumericStats (+4 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate-pwa-icons.mjs"
Cohesion: 0.29
Nodes (6): ref_node_url, sharp, BG, ICON_DIR, root, SOURCE

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - ".constructor"
Cohesion: 0.18
Nodes (6): Boons, Weapon, WeaponConfig, setBaseStats, setStats, updateStats

### Community 54 - "MerchantModeToggle.tsx"
Cohesion: 0.16
Nodes (15): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+7 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Price.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "Enemy"
Cohesion: 0.12
Nodes (3): Enemy, Monster, MonsterConfig

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 65 - "Resource.test.ts"
Cohesion: 0.24
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 66 - "Health.ts"
Cohesion: 0.22
Nodes (4): Health, HealthOptions, CombatText, CombatTextConfig

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.20
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "CastableSpell"
Cohesion: 0.27
Nodes (3): CastableSpell, SpellStub, TargetKind

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
Cohesion: 0.24
Nodes (13): react-tooltip, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion (+5 more)

### Community 90 - "Player.ts"
Cohesion: 0.13
Nodes (19): lodash, Destination, DrawBarOptions, AssignResource(), AssignResourceName, AssignResourceType, classes, Energy (+11 more)

### Community 91 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 96 - "Armory.tsx"
Cohesion: 0.36
Nodes (6): buyLoot, toggleFilter, Stock(), Armory(), src_ui_components_templates_armory_module, SortKey

### Community 97 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.29
Nodes (7): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 98 - "main.tsx"
Cohesion: 0.29
Nodes (5): react-dnd-touch-backend, react-dom, container, PhaserGame, src_styles_globals

### Community 100 - "GroupedStats.tsx"
Cohesion: 0.33
Nodes (6): PlayerStats, Stats(), GroupedAttributesProps, GroupedStats(), GroupedStatsProps, StatItem

### Community 101 - "Equipment.test.tsx"
Cohesion: 0.47
Nodes (4): loadGame, initialGame, seed(), seedParts()

### Community 103 - "Dialog.tsx"
Cohesion: 0.53
Nodes (4): Dialog(), DIALOG_ROOT_ID, DialogProps, getDialogRoot()

### Community 106 - "Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)"
Cohesion: 0.67
Nodes (3): Phase 7 — Armory migration to Vercel (non-destructive; issue TBD), PR1 — Legacy contract baseline (pre-step) ✅ this PR, PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)

### Community 107 - "Phase 8 — Frontend → REST, then teardown (issue TBD)"
Cohesion: 0.67
Nodes (3): Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified)

### Community 108 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): uuid, AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock

## Knowledge Gaps
- **431 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+426 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 689 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `TownScene`, `generateItem.ts`, `Item.ts`, `Multishot.ts`, `GameSceneLike`, `store/index.ts`, `CastingController.test.ts`, `package.json`, `HUD.ts`, `operations/helpers.ts`, `handlers.test.ts`, `classes.ts`, `settingsStorage.ts`, `UI.tsx`, `BiomeScene.ts`, `Spell.test.ts`, `Equipment.tsx`, `Resource.test.ts`, `CastBar`, `SpellButton.test.ts`, `ItemTooltip.tsx`, `TargetReticle.test.ts`, `vite.config.ts`, `HUD.test.ts`, `BiomeScene.test.ts`, `Equipment.test.tsx`, `PlayerUnderTest`, `Dialog.tsx`, `Invocation.test.ts`?**
  _High betweenness centrality (0.216) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `AssignSpell.ts`, `gameReducer.ts`, `TownScene`, `Multishot.ts`, `Frostbolt.ts`, `GameSceneLike`, `EarthShield.ts`, `CastingController.test.ts`, `package.json`, `AssignClass.ts`, `HUD.ts`, `game.ts`, `Hero`, `BiomeScene.ts`, `CastingController.ts`, `Spell.test.ts`, `.constructor`, `Enemy`, `Health.ts`, `CastBar`, `TargetReticle`, `TargetReticle.test.ts`, `Player.ts`?**
  _High betweenness centrality (0.082) - this node is a cross-community bridge._
- **Why does `lodash` connect `Player.ts` to `game.ts`, `gameReducer.ts`, `GroupedStats.tsx`, `generateItem.ts`, `Item.ts`, `Stats.tsx`, `GameSceneLike`, `BiomeScene.ts`, `Equipment.tsx`, `Attributes.tsx`, `package.json`, `operations/helpers.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _431 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07536231884057971 - nodes in this community are weakly interconnected._