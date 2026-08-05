# Graph Report - phasercraft  (2026-08-05)

## Corpus Check
- 258 files · ~398,692 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1675 nodes · 3463 edges · 131 communities (79 shown, 52 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ccef2274`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- Spell
- PartsShopGrid.tsx
- Item
- TownScene
- generateItem.ts
- compilerOptions
- Multishot.ts
- Button.tsx
- Invocation.ts
- devDependencies
- DetailedLoot.tsx
- Gem
- LootItem
- armoryClient.ts
- StoredItem
- items/index.ts
- SnareTrap
- Equipment.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- TownScene.ts
- HUD.ts
- store/index.ts
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- paths
- dependencies
- game.ts
- BiomeScene
- classes.ts
- Hero
- PhaserGame.tsx
- TownScene.test.ts
- UI.tsx
- UI
- CombatText.ts
- .prettierrc.json
- e2e/helpers.ts
- BiomeScene.ts
- phaser
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- Armory API (`/api/armory`)
- CLAUDE.md — Working agreement and project conventions
- generate-pwa-icons.mjs
- PlayerStats
- Merchant.test.tsx
- react
- vercel.json
- Vercel deployment (Phase 6)
- ItemTooltip.tsx
- SiphonSoul
- Consecration
- qa-review.md
- log.js
- vite-env.d.ts
- Enemy
- vitest.config.ts
- eslint.config.mjs
- playwright.config.ts
- vitest.setup.ts
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource
- graphify reference: query, path, explain
- EarthShield
- LootIcon.tsx
- TargetReticle
- exclude
- LootTable
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- CasterLike
- gameReducer.ts
- keywords
- HudUnderTest
- SceneUnderTest
- lint-staged
- Bug-Fix Agent — Instructions
- eslint-plugin-react-hooks
- @components/*
- prettier
- Character.tsx
- lib
- tsconfig.json
- PlayerUnderTest
- lodash
- eslint
- gh-pages
- jsdom
- lint-staged
- @playwright/test
- react-dnd-test-backend
- serve
- simple-git-hooks
- @testing-library/dom
- @testing-library/jest-dom
- @testing-library/react
- @types/lodash
- @types/node
- @types/react
- @types/react-dom
- typescript
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- @vitejs/plugin-react
- @vitest/coverage-v8
- @vitest/ui
- react-dnd
- react-tooltip
- @reduxjs/toolkit
- sharp
- Item.ts
- eslint-config-prettier

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 73 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 56 edges
5. `phaser` - 41 edges
6. `SpellOptions` - 36 edges
7. `Resource` - 29 edges
8. `CastingController` - 29 edges
9. `LootItem` - 27 edges
10. `BiomeScene` - 25 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `GroupedStats()` --calls--> `formatStatValue()`  [EXTRACTED]
  src/ui/components/organisms/GroupedStats.tsx → src/lib/statConversion.ts
- `DetailedLootProps` --references--> `LootItem`  [EXTRACTED]
  src/ui/components/molecules/DetailedLoot.tsx → src/types/game.ts
- `UI()` --indirect_call--> `MerchantModeToggle()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/molecules/MerchantModeToggle.tsx
- `UI()` --indirect_call--> `Armory()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Armory.tsx

## Import Cycles
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Fireball.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Frostbolt.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Smite.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SnareTrap.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (131 total, 52 thin omitted)

### Community 0 - "Player"
Cohesion: 0.07
Nodes (19): classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions, Player (+11 more)

### Community 1 - "Spell"
Cohesion: 0.06
Nodes (15): MoveOptions, classes, Faith, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield (+7 more)

### Community 2 - "PartsShopGrid.tsx"
Cohesion: 0.33
Nodes (8): MerchantState, COMPONENT_DEFS, ComponentType, merchantPartsBase(), PartsShopGrid(), PartsShopGridProps, PartTooltip(), PartTooltipProps

### Community 3 - "Item"
Cohesion: 0.13
Nodes (7): Common, Epic, Fine, Item, Legendary, LootItem, Rare

### Community 4 - "TownScene"
Cohesion: 0.18
Nodes (3): TownScene, setCurrentArea, setPlayerPosition

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (30): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+22 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "Multishot.ts"
Cohesion: 0.10
Nodes (11): Multishot, TODO: Abstract this capping functionality out as many spells might use., Whirlwind, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone() (+3 more)

### Community 8 - "Button.tsx"
Cohesion: 0.25
Nodes (6): setMerchantMode, Button(), ButtonProps, InstallBanner(), MERCHANT_ACTIVE_BLUE, MerchantModeToggle()

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (14): Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion, PowerInfusionValue (+6 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint-plugin-react, devDependencies, eslint-plugin-react, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "DetailedLoot.tsx"
Cohesion: 0.18
Nodes (9): Stat(), StatProps, DetailedLootProps, HealthProps, HealthStats, StatItem, Stats(), StatsProps (+1 more)

### Community 13 - "LootItem"
Cohesion: 0.14
Nodes (17): equipLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, helm, Slot(), SlotComponentProps (+9 more)

### Community 14 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 15 - "StoredItem"
Cohesion: 0.15
Nodes (9): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+1 more)

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "SnareTrap"
Cohesion: 0.14
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 18 - "Equipment.tsx"
Cohesion: 0.16
Nodes (14): selectLoot, ComponentsGrid(), ComponentsGridProps, stacks, GearGrid(), GearShopGrid(), PaginationControls(), PaginationControlsProps (+6 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (10): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.06
Nodes (32): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Decisions update (2026-07-30) — Town shops, Deferred / backlog, Later — presentation (+24 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "TownScene.ts"
Cohesion: 0.29
Nodes (5): AssignClass, MapStateOptions, mapStateToData(), state$, toggleHUD

### Community 24 - "HUD.ts"
Cohesion: 0.16
Nodes (19): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+11 more)

### Community 25 - "store/index.ts"
Cohesion: 0.15
Nodes (18): buyLoot, gameReducer, GameState, loadGame, toggleFilter, RootState, Coins(), CoinsProps (+10 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.16
Nodes (11): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+3 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+10 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "paths"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 32 - "dependencies"
Cohesion: 0.08
Nodes (25): fantasy-content-generator, ioredis, number-to-words, dependencies, fantasy-content-generator, ioredis, number-to-words, phaser (+17 more)

### Community 33 - "game.ts"
Cohesion: 0.09
Nodes (22): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_TYPES, ComponentDef, EQUIPMENT_SLOTS (+14 more)

### Community 34 - "BiomeScene"
Cohesion: 0.18
Nodes (4): BiomeScene, clearTravelRequest, setBossActive, setEnemiesRemaining

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (25): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+17 more)

### Community 38 - "TownScene.test.ts"
Cohesion: 0.18
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 39 - "UI.tsx"
Cohesion: 0.13
Nodes (17): container, PhaserGame, BIOME_IDS, BIOMES, requestTravel, toggleUi, Header(), Alchemist() (+9 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 44 - "BiomeScene.ts"
Cohesion: 0.18
Nodes (14): AREA_LIVE_CAP, AREA_TOTAL_ENEMIES, BOSS_SCALING, promoteToBoss(), PlayerName, BiomeDefinition, BiomeId, DEFAULT_BIOME (+6 more)

### Community 45 - "phaser"
Cohesion: 0.08
Nodes (23): phaser, Coin, CoinConfig, Crafting, CraftingConfig, GemConfig, PlayerType, ActiveCast (+15 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 48 - "Spell.test.ts"
Cohesion: 0.18
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "generate-pwa-icons.mjs"
Cohesion: 0.33
Nodes (4): BG, ICON_DIR, root, SOURCE

### Community 52 - "PlayerStats"
Cohesion: 0.17
Nodes (11): PlayerStats, Attribute(), AttributeProps, Attributes(), AttributesProps, AttributesStyles, GroupedAttributesProps, NumericStats (+3 more)

### Community 53 - "Merchant.test.tsx"
Cohesion: 0.32
Nodes (5): freshMerchant(), MerchantMode, merchantWindow(), render(), stockedMerchant()

### Community 54 - "react"
Cohesion: 0.25
Nodes (9): react, Title(), TitleProps, Navigation(), HeaderConfig, HeaderProps, PixelBackgroundOptions, pixelBackgroundVars() (+1 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "ItemTooltip.tsx"
Cohesion: 0.32
Nodes (5): Equipment, Price(), PriceProps, ItemTooltipProps, MenuContext

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 63 - "Enemy"
Cohesion: 0.05
Nodes (21): AssignType, classes, Boss, CirclingConfig, Enemy, EnemyStates, EnemyStats, HitParams (+13 more)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.20
Nodes (3): CastBar, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource"
Cohesion: 0.06
Nodes (19): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+11 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "LootIcon.tsx"
Cohesion: 0.32
Nodes (6): LootIcon(), LootIconProps, LootIconStyles, CustomDragLayer(), getItemStyles(), Offset

### Community 79 - "TargetReticle"
Cohesion: 0.12
Nodes (3): TargetReticle, GraphicsStub, ReticleUnderTest

### Community 80 - "exclude"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

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

### Community 90 - "gameReducer.ts"
Cohesion: 0.13
Nodes (22): addCoins, buyComponent, buyGear, initState, Level, refreshMerchant, selectCharacter, sellComponent (+14 more)

### Community 91 - "keywords"
Cohesion: 0.29
Nodes (5): keywords, phaser3, typescript, vite, COMPONENT_DIRS

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 99 - "Character.tsx"
Cohesion: 0.22
Nodes (8): getResourceColour(), DetailedLoot(), StatBar(), StatBarProps, GroupedAttributes(), Character(), HUD(), Level

### Community 100 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 101 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

## Knowledge Gaps
- **421 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+416 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **52 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `keywords` to `react`, `phaser`, `package.json`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player`, `Spell`, `Multishot.ts`, `Invocation.ts`, `CastingController`, `TownScene.ts`, `HUD.ts`, `game.ts`, `Hero`, `PhaserGame.tsx`, `TownScene.test.ts`, `CombatText.ts`, `BiomeScene.ts`, `Spell.test.ts`, `Enemy`, `CastBar`, `Resource`, `TargetReticle`, `keywords`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `PartsShopGrid.tsx`, `Character.tsx`, `PhaserGame.tsx`, `UI.tsx`, `Button.tsx`, `DetailedLoot.tsx`, `LootItem`, `LootIcon.tsx`, `armoryClient.ts`, `Equipment.tsx`, `PlayerStats`, `HUD.ts`, `store/index.ts`, `gameReducer.ts`, `keywords`, `ItemTooltip.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _421 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.06557377049180328 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.05835010060362173 - nodes in this community are weakly interconnected._
- **Should `Item` be split into smaller, more focused modules?**
  _Cohesion score 0.1339031339031339 - nodes in this community are weakly interconnected._