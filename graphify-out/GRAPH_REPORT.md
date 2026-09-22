# Graph Report - phasercraft  (2026-09-22)

## Corpus Check
- 263 files · ~402,184 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 65 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1751 nodes · 3903 edges · 100 communities (78 shown, 22 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 54 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8d805959`
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
- testHook.ts
- Frostbolt.ts
- devDependencies
- Stats.tsx
- lodash
- LootItem
- PhaserGame.tsx
- StoredItem
- items/index.ts
- Consecration
- react
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- AssignClass.ts
- HUD.ts
- store/index.ts
- Merchant.tsx
- SnareTrap
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- Categories
- dependencies
- game.ts
- BiomeScene
- classes.ts
- .constructor
- DetailedLoot.tsx
- toggleUi
- UI.tsx
- Spell
- Boons.ts
- .prettierrc.json
- e2e/helpers.ts
- BiomeScene.ts
- Player.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Character.tsx
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- Attributes.tsx
- TownScene.test.ts
- Stats
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
- EarthShield
- eslint.config.mjs
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- SpellButton
- Resource
- graphify reference: query, path, explain
- Item
- Merchant.test.tsx
- Armory API (`/api/armory`)
- Crafting
- .setExperience
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- vite.config.ts
- HUD.test.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- react-redux
- EnemyOptions
- PlayerUnderTest
- vitest
- repository
- Item.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 73 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 58 edges
5. `vitest` - 54 edges
6. `phaser` - 41 edges
7. `SpellOptions` - 36 edges
8. `CastingController` - 31 edges
9. `Resource` - 30 edges
10. `RootState` - 29 edges

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

## Communities (100 total, 22 thin omitted)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.10
Nodes (10): MoveOptions, classes, Faith, Fireball, Heal, ManaShield, Smite, SpellValue (+2 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.14
Nodes (20): Step 3 — Merchant shop, BiomeId, freshState(), addComponent, addXP, clearTravelRequest, freshMerchant(), gameReducer (+12 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.16
Nodes (7): Common, Epic, Fine, Legendary, LootItem, LootTable, Rare

### Community 5 - "generateItem.ts"
Cohesion: 0.12
Nodes (25): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+17 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "Multishot.ts"
Cohesion: 0.11
Nodes (10): Multishot, Whirlwind, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone(), targetVector() (+2 more)

### Community 8 - "testHook.ts"
Cohesion: 0.13
Nodes (22): PlayerName, ActionOption, buildActionSpace(), CATALOG, createTestHook(), describe(), GameStore, installTestHook() (+14 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.07
Nodes (11): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, Invocation, InvocationValue, InvocationUnderTest (+3 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.16
Nodes (10): src_ui_components_atoms_stat_module, Stat(), StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem (+2 more)

### Community 12 - "lodash"
Cohesion: 0.08
Nodes (22): lodash, Coin, COIN_BASE_VALUE, CoinConfig, Gem, GEM_BASE_VALUE, GemConfig, GemUnderTest (+14 more)

### Community 13 - "LootItem"
Cohesion: 0.14
Nodes (21): react-dnd-html5-backend, equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module (+13 more)

### Community 14 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (27): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+19 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 18 - "react"
Cohesion: 0.17
Nodes (16): react, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid(), src_ui_components_molecules_gearshopgrid_module (+8 more)

### Community 19 - "CastingController"
Cohesion: 0.05
Nodes (14): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+6 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.06
Nodes (30): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-30) — Town shops, Explicitly out of scope, Later — presentation, Open questions for after the spike, Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312) (+22 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (29): description, engines, node, homepage, keywords, name, private, simple-git-hooks (+21 more)

### Community 23 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 24 - "HUD.ts"
Cohesion: 0.16
Nodes (17): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+9 more)

### Community 25 - "store/index.ts"
Cohesion: 0.12
Nodes (19): @reduxjs/toolkit, PhasercraftTestHook, TestActionSpec, buyLoot, GameState, toggleFilter, RootState, ComponentStack (+11 more)

### Community 26 - "Merchant.tsx"
Cohesion: 0.20
Nodes (17): buyComponent, buyGear, refreshMerchant, sellComponent, sellComponentStack, sellLoot, merchantPartsBase(), merchantRestockRemaining() (+9 more)

### Community 27 - "SnareTrap"
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 28 - "handlers.test.ts"
Cohesion: 0.10
Nodes (19): Captured, Handler, mockReq(), mockRes(), run(), categories, qualities, statNames (+11 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build:e2e, build-nolog, dev, dev-nolog, format (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "Categories"
Cohesion: 0.14
Nodes (13): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+5 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "game.ts"
Cohesion: 0.09
Nodes (29): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_DEFS, COMPONENT_TYPES, componentBuyPrice() (+21 more)

### Community 34 - "BiomeScene"
Cohesion: 0.18
Nodes (5): AssignType, BiomeScene, setBossActive, setEnemiesRemaining, toggleHUD

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - ".constructor"
Cohesion: 0.14
Nodes (3): Hero, AssignSpell, Weapon

### Community 37 - "DetailedLoot.tsx"
Cohesion: 0.18
Nodes (11): LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, DetailedLoot(), DetailedLootProps, src_ui_components_molecules_detailedloot_module, CustomDragLayer() (+3 more)

### Community 38 - "toggleUi"
Cohesion: 0.29
Nodes (7): BIOME_IDS, requestTravel, toggleUi, BiomeSelect(), src_ui_components_templates_biomeselect_module, ConfirmReturn(), src_ui_components_templates_confirmreturn_module

### Community 39 - "UI.tsx"
Cohesion: 0.08
Nodes (33): Step 1 — Shop skeletons: open & close every shop (this PR), polished, setMerchantMode, switchUi, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle() (+25 more)

### Community 41 - "Boons.ts"
Cohesion: 0.18
Nodes (8): Deferred / backlog, Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.18
Nodes (14): actionSpace(), Character, CHARACTERS, expectGameCanvas(), gameState(), makeSave(), runAction(), SAVE_SLOTS (+6 more)

### Community 44 - "BiomeScene.ts"
Cohesion: 0.15
Nodes (18): rxjs, AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies (+10 more)

### Community 45 - "Player.ts"
Cohesion: 0.07
Nodes (30): phaser, uuid, CirclingConfig, EnemyStates, HitParams, CraftingConfig, PlayerType, HeroConfig (+22 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Character.tsx"
Cohesion: 0.16
Nodes (12): getResourceColour(), PlayerStats, Slot(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps, GroupedAttributes(), GroupedAttributesProps (+4 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate-pwa-icons.mjs"
Cohesion: 0.25
Nodes (6): ref_node_url, sharp, BG, ICON_DIR, root, SOURCE

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "TownScene.test.ts"
Cohesion: 0.24
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 54 - "Stats"
Cohesion: 0.20
Nodes (10): Stats, attack_power, attack_speed, critical_chance, defence, health_max, health_regen_rate, health_regen_value (+2 more)

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
Cohesion: 0.09
Nodes (7): Enemy, EnemyStats, Monster, MonsterConfig, AssignResource(), EnemyAttributes, EntityWithVector

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 66 - "eslint.config.mjs"
Cohesion: 0.29
Nodes (6): eslintConfig, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, @typescript-eslint/eslint-plugin, @typescript-eslint/parser

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "SpellButton"
Cohesion: 0.08
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

### Community 75 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "Merchant.test.tsx"
Cohesion: 0.38
Nodes (5): MerchantMode, MerchantState, merchantWindow(), render(), stockedMerchant()

### Community 79 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

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
Cohesion: 0.19
Nodes (16): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+8 more)

### Community 91 - "vite.config.ts"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.21
Nodes (3): BIOMES, FakeTimer, SceneUnderTest

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 98 - "react-redux"
Cohesion: 0.12
Nodes (13): react-dnd, react-dnd-touch-backend, react-dom, react-redux, container, PhaserGame, src_styles_globals, Coins() (+5 more)

### Community 99 - "EnemyOptions"
Cohesion: 0.14
Nodes (7): ref_console, classes, Boss, Healer, Melee, Ranged, EnemyOptions

### Community 103 - "vitest"
Cohesion: 0.24
Nodes (7): @testing-library/react, vitest, helm, Dialog(), DIALOG_ROOT_ID, DialogProps, getDialogRoot()

### Community 108 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

## Knowledge Gaps
- **441 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+436 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 700 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **22 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `Multishot.ts`, `testHook.ts`, `Frostbolt.ts`, `lodash`, `PhaserGame.tsx`, `react`, `CastingController`, `package.json`, `HUD.ts`, `store/index.ts`, `SnareTrap`, `handlers.test.ts`, `game.ts`, `classes.ts`, `toggleUi`, `UI.tsx`, `BiomeScene.ts`, `Spell.test.ts`, `Character.tsx`, `TownScene.test.ts`, `SpellButton`, `Resource`, `Merchant.test.tsx`, `ItemTooltip.tsx`, `vite.config.ts`, `HUD.test.ts`, `BiomeScene.test.ts`, `PlayerUnderTest`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `phaser` connect `Player.ts` to `AssignSpell.ts`, `gameReducer.ts`, `game.ts`, `Multishot.ts`, `Frostbolt.ts`, `SpellButton`, `Resource`, `lodash`, `BiomeScene.ts`, `PhaserGame.tsx`, `Spell.test.ts`, `CastingController`, `TownScene.test.ts`, `package.json`, `AssignClass.ts`, `HUD.ts`, `Enemy`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **Why does `lodash` connect `lodash` to `gameReducer.ts`, `EnemyOptions`, `generateItem.ts`, `Item.ts`, `Resource`, `BiomeScene.ts`, `Player.ts`, `Stats.tsx`, `Character.tsx`, `Attributes.tsx`, `package.json`, `ItemTooltip.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _441 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09672830725462304 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13846153846153847 - nodes in this community are weakly interconnected._