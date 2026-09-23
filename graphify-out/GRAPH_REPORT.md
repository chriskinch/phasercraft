# Graph Report - phasercraft  (2026-09-23)

## Corpus Check
- 262 files · ~399,264 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 65 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1726 nodes · 3849 edges · 103 communities (75 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d805959`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Spell
- gameReducer.ts
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- Multishot.ts
- HUD.ts
- Invocation.ts
- devDependencies
- Stats.tsx
- phaser
- LootItem
- PhaserGame.tsx
- StoredItem
- items/index.ts
- Consecration
- store/index.ts
- CastingController.test.ts
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- AssignClass.ts
- Projectile
- vitest
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- generateItem.test.ts
- dependencies
- game.ts
- BiomeScene
- classes.ts
- Hero
- SnareTrap
- CastingController
- UI.tsx
- TownScene.test.ts
- EarthShield
- .prettierrc.json
- e2e/helpers.ts
- area.ts
- CastingController.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- StatBar.tsx
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- Attributes.tsx
- Player.ts
- react
- vercel.json
- Vercel deployment (Phase 6)
- .constructor
- SiphonSoul
- UI
- qa-review.md
- log.js
- vite-env.d.ts
- Enemy
- armoryClient.ts
- CastBar.test.ts
- Armory API (`/api/armory`)
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
- Faith
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- TargetReticle.test.ts
- BiomeScene.ts
- vite.config.ts
- HUD.test.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Phase 13 — Town shops system (issue TBD)
- GroupedStats.tsx
- PlayerUnderTest
- Phase 7 — Armory migration to Vercel (non-destructive; issue TBD)
- Phase 8 — Frontend → REST, then teardown (issue TBD)
- repository
- Item.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 76 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 54 edges
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

## Communities (103 total, 28 thin omitted)

### Community 1 - "Spell"
Cohesion: 0.07
Nodes (11): classes, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield, Smite, Spell (+3 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.08
Nodes (45): Step 3 — Merchant shop, addComponent, addXP, buyComponent, buyGear, buyLoot, freshMerchant(), gameReducer (+37 more)

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

### Community 7 - "Multishot.ts"
Cohesion: 0.15
Nodes (7): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 8 - "HUD.ts"
Cohesion: 0.16
Nodes (19): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveSlot, writeSave() (+11 more)

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (17): Deferred / backlog, Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+9 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "phaser"
Cohesion: 0.07
Nodes (21): lodash, phaser, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem (+13 more)

### Community 13 - "LootItem"
Cohesion: 0.10
Nodes (21): react-dnd, LootItem, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, src_ui_components_atoms_slot_module, Slot() (+13 more)

### Community 14 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (30): react-dnd-touch-backend, react-dom, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, container (+22 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "store/index.ts"
Cohesion: 0.08
Nodes (38): react-dnd-html5-backend, react-redux, equipLoot, GameState, selectLoot, RootState, ComponentStack, Coins() (+30 more)

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
Nodes (35): eslintConfig, description, engines, node, homepage, keywords, name, private (+27 more)

### Community 23 - "AssignClass.ts"
Cohesion: 0.17
Nodes (10): classes, PlayerConfig, PlayerType, Cleric, Mage, Occultist, Ranger, Warrior (+2 more)

### Community 24 - "Projectile"
Cohesion: 0.18
Nodes (7): EnemyUnderTest, ProjectileMock, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, CombatType

### Community 25 - "vitest"
Cohesion: 0.09
Nodes (17): @testing-library/react, vitest, SaveData, helm, stacks, InstallBanner(), src_ui_components_molecules_installbanner_module, Dialog() (+9 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 27 - "SpellButton"
Cohesion: 0.16
Nodes (3): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), SpellButton

### Community 28 - "handlers.test.ts"
Cohesion: 0.12
Nodes (16): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+8 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+10 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "game.ts"
Cohesion: 0.06
Nodes (28): ref_console, AssignType, classes, Boss, Healer, Melee, Ranged, AdjustValue (+20 more)

### Community 34 - "BiomeScene"
Cohesion: 0.20
Nodes (5): BiomeDefinition, BiomeScene, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "SnareTrap"
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 39 - "UI.tsx"
Cohesion: 0.11
Nodes (27): Step 1 — Shop skeletons: open & close every shop (this PR), requestTravel, switchUi, toggleUi, Button(), ButtonProps, src_ui_components_atoms_button_module, Alchemist() (+19 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.24
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "area.ts"
Cohesion: 0.33
Nodes (8): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies, LootTable

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

### Community 49 - "StatBar.tsx"
Cohesion: 0.23
Nodes (8): polished, getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, HUD(), Level, src_ui_components_templates_hud_module

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate-pwa-icons.mjs"
Cohesion: 0.25
Nodes (6): ref_node_url, sharp, BG, ICON_DIR, root, SOURCE

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Player.ts"
Cohesion: 0.07
Nodes (20): uuid, CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, Monster, HeroConfig (+12 more)

### Community 54 - "react"
Cohesion: 0.12
Nodes (22): react, setMerchantMode, unequipLoot, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, Title(), TitleProps (+14 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 66 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 75 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

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
Cohesion: 0.17
Nodes (17): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+9 more)

### Community 90 - "BiomeScene.ts"
Cohesion: 0.19
Nodes (12): rxjs, AssignClass, PlayerName, MapStateOptions, mapStateToData(), state$, BiomeId, DEFAULT_BIOME (+4 more)

### Community 91 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.19
Nodes (4): BIOME_IDS, BIOMES, FakeTimer, SceneUnderTest

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.29
Nodes (7): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 100 - "GroupedStats.tsx"
Cohesion: 0.33
Nodes (6): PlayerStats, Stats(), GroupedAttributesProps, GroupedStats(), GroupedStatsProps, StatItem

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
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

## Knowledge Gaps
- **432 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+427 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 693 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `Multishot.ts`, `HUD.ts`, `Invocation.ts`, `phaser`, `PhaserGame.tsx`, `CastingController.test.ts`, `package.json`, `Projectile`, `operations/helpers.ts`, `handlers.test.ts`, `generateItem.test.ts`, `classes.ts`, `SnareTrap`, `UI.tsx`, `TownScene.test.ts`, `area.ts`, `Spell.test.ts`, `StatBar.tsx`, `CastBar.test.ts`, `Resource`, `SpellButton.test.ts`, `ItemTooltip.tsx`, `TargetReticle.test.ts`, `vite.config.ts`, `HUD.test.ts`, `BiomeScene.test.ts`, `PlayerUnderTest`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `lodash` connect `phaser` to `game.ts`, `gameReducer.ts`, `operations/helpers.ts`, `GroupedStats.tsx`, `generateItem.ts`, `Item.ts`, `Resource`, `Stats.tsx`, `LootItem`, `Attributes.tsx`, `Player.ts`, `package.json`, `BiomeScene.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Spell`, `CastBar.test.ts`, `game.ts`, `HUD.ts`, `Invocation.ts`, `TownScene.test.ts`, `Resource`, `CastingController.ts`, `PhaserGame.tsx`, `TargetReticle`, `Spell.test.ts`, `CastingController.test.ts`, `Player.ts`, `package.json`, `AssignClass.ts`, `Projectile`, `TargetReticle.test.ts`, `BiomeScene.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _432 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.06927551560021153 - nodes in this community are weakly interconnected._