# Graph Report - phasercraft  (2026-09-23)

## Corpus Check
- 264 files · ~406,531 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1779 nodes · 3575 edges · 143 communities (87 shown, 56 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37e19a60`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- gameReducer.ts
- Item.ts
- TownScene.ts
- generateItem.ts
- compilerOptions
- Spell.ts
- CharacterCard.tsx
- Frostbolt.ts
- devDependencies
- Stats.tsx
- Enemy.ts
- LootItem
- PhaserGame.tsx
- StoredItem
- items/index.ts
- Consecration
- react
- CastingController.test.ts
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- AssignClass.ts
- Save.tsx
- store/index.ts
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- SnareTrap.ts
- dependencies
- game.ts
- BiomeScene
- classes.ts
- Hero
- readSettings
- CastingController
- UI.tsx
- Spell
- paths
- .prettierrc.json
- e2e/helpers.ts
- BiomeScene.ts
- CasterLike
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- EnemyOptions
- CLAUDE.md — Working agreement and project conventions
- Player.ts
- Attributes.tsx
- TownScene.test.ts
- MerchantModeToggle.tsx
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
- biomes.ts
- Boons.ts
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource
- graphify reference: query, path, explain
- Item
- TargetReticle
- SpellButton.test.ts
- ControllerUnderTest
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- ReticleUnderTest
- Character.tsx
- generate-biome-maps.mjs
- HudUnderTest
- SceneUnderTest
- lint-staged
- Bug-Fix Agent — Instructions
- Armory.tsx
- EarthShield
- Tilemaps
- Healer
- Monster.ts
- Armory API (`/api/armory`)
- PlayerUnderTest
- @components/*
- Boss.ts
- eslint-plugin-react
- Multishot.ts
- lib
- tsconfig.json
- LootTable
- eslint
- eslint.config.mjs
- eslint-plugin-react-hooks
- gh-pages
- jsdom
- lint-staged
- number-to-words
- phaser
- react
- react-dom
- react-redux
- uuid
- @playwright/test
- prettier
- react-dnd-test-backend
- serve
- sharp
- simple-git-hooks
- @testing-library/dom
- @testing-library/jest-dom
- Item.test.ts
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
- playwright.config.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 71 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 56 edges
5. `phaser` - 41 edges
6. `SpellOptions` - 36 edges
7. `BiomeScene` - 32 edges
8. `Resource` - 29 edges
9. `CastingController` - 29 edges
10. `LootItem` - 27 edges

## Surprising Connections (you probably didn't know these)
- `LootListDrag()` --indirect_call--> `icon()`  [INFERRED]
  src/ui/components/molecules/LootListDrag.tsx → scripts/generate-pwa-icons.mjs
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `Attributes()` --calls--> `formatStatValue()`  [EXTRACTED]
  src/ui/components/molecules/Attributes.tsx → src/lib/statConversion.ts
- `DetailedLootProps` --references--> `LootItem`  [EXTRACTED]
  src/ui/components/molecules/DetailedLoot.tsx → src/types/game.ts
- `UI()` --indirect_call--> `MerchantModeToggle()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/molecules/MerchantModeToggle.tsx

## Import Cycles
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Occultist.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Occultist.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/Spells/CastingController.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/UI/Boons.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/index.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`

## Communities (143 total, 56 thin omitted)

### Community 1 - "AssignSpell.ts"
Cohesion: 0.10
Nodes (7): classes, Faith, Fireball, Frostbolt, ManaShield, Smite, SpellOptions

### Community 2 - "gameReducer.ts"
Cohesion: 0.09
Nodes (39): addComponent, addXP, buyComponent, buyGear, freshMerchant(), initState, Level, MerchantMode (+31 more)

### Community 3 - "Item.ts"
Cohesion: 0.12
Nodes (11): Common, Epic, Fine, AdjustedStat, ItemConfig, StatInfo, StatIterator, Legendary (+3 more)

### Community 4 - "TownScene.ts"
Cohesion: 0.15
Nodes (6): PlayerType, BiomeId, GameSceneConfig, TownScene, setCurrentArea, setPlayerPosition

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (28): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "Spell.ts"
Cohesion: 0.17
Nodes (7): SpellValue, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, SpellProjectileConfig, TargetKind

### Community 8 - "CharacterCard.tsx"
Cohesion: 0.43
Nodes (6): PlayerName, selectCharacter, setCoins, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module

### Community 9 - "Frostbolt.ts"
Cohesion: 0.08
Nodes (10): Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion (+2 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint-config-prettier, devDependencies, eslint-config-prettier, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.13
Nodes (9): src_ui_components_atoms_stat_module, StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem, StatsProps (+1 more)

### Community 12 - "Enemy.ts"
Cohesion: 0.07
Nodes (23): phaser, CirclingConfig, EnemyStates, HitParams, Coin, CoinConfig, Crafting, CraftingConfig (+15 more)

### Community 13 - "LootItem"
Cohesion: 0.11
Nodes (21): icon(), equipLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, helm (+13 more)

### Community 14 - "PhaserGame.tsx"
Cohesion: 0.10
Nodes (10): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, BootScene, createLogo(), LogoOptions (+2 more)

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "Consecration"
Cohesion: 0.17
Nodes (3): Consecration, AreaEffect, ArcadeCollisionObject

### Community 18 - "react"
Cohesion: 0.15
Nodes (17): react, selectLoot, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid() (+9 more)

### Community 19 - "CastingController.test.ts"
Cohesion: 0.22
Nodes (6): makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.06
Nodes (32): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Decisions update (2026-07-30) — Town shops, Deferred / backlog, Later — presentation (+24 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "AssignClass.ts"
Cohesion: 0.18
Nodes (9): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, SpellType (+1 more)

### Community 24 - "Save.tsx"
Cohesion: 0.14
Nodes (22): readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave(), setSaveSlot (+14 more)

### Community 25 - "store/index.ts"
Cohesion: 0.13
Nodes (17): gameReducer, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, stacks (+9 more)

### Community 26 - "operations/helpers.ts"
Cohesion: 0.29
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

### Community 28 - "handlers.test.ts"
Cohesion: 0.10
Nodes (19): Captured, Handler, mockReq(), mockRes(), run(), categories, qualities, statNames (+11 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (19): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+11 more)

### Community 30 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "SnareTrap.ts"
Cohesion: 0.13
Nodes (6): SnareTrap, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 32 - "dependencies"
Cohesion: 0.10
Nodes (21): fantasy-content-generator, ioredis, lodash, dependencies, fantasy-content-generator, ioredis, lodash, polished (+13 more)

### Community 33 - "game.ts"
Cohesion: 0.11
Nodes (17): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, ComponentDef, EQUIPMENT_SLOTS, GAME_BALANCE, GameState (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.15
Nodes (6): BiomeDefinition, BiomeScene, clearTravelRequest, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "readSettings"
Cohesion: 0.12
Nodes (16): PhaserGame(), SelectScene, DEFAULT_SETTINGS, readSettings(), Settings, StartLocation, writeSettings(), InstallBanner() (+8 more)

### Community 39 - "UI.tsx"
Cohesion: 0.08
Nodes (22): container, PhaserGame, src_styles_globals, src_ui_components_atoms_price_module, Price(), PriceProps, Alchemist(), src_ui_components_templates_alchemist_module (+14 more)

### Community 40 - "Spell"
Cohesion: 0.11
Nodes (4): MoveOptions, Heal, Spell, TargetType

### Community 41 - "paths"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 44 - "BiomeScene.ts"
Cohesion: 0.16
Nodes (15): BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies, AssignClass, LabelledContainer, styles (+7 more)

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 48 - "Spell.test.ts"
Cohesion: 0.18
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "EnemyOptions"
Cohesion: 0.23
Nodes (5): AssignType, classes, Melee, Ranged, EnemyOptions

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "Player.ts"
Cohesion: 0.17
Nodes (6): Destination, DrawBarOptions, AssignSpell, Weapon, WeaponConfig, CombatType

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "TownScene.test.ts"
Cohesion: 0.18
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 54 - "MerchantModeToggle.tsx"
Cohesion: 0.14
Nodes (14): setMerchantMode, Title(), TitleProps, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation(), HeaderConfig (+6 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - ".constructor"
Cohesion: 0.29
Nodes (3): EnemyStats, AssignResource(), EnemyAttributes

### Community 59 - "UI"
Cohesion: 0.21
Nodes (3): UI, loadGame, toggleUi

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

### Community 65 - "biomes.ts"
Cohesion: 0.22
Nodes (11): BIOME_IDS, BiomeMap, BIOMES, resolveBiome(), FakeTimer, makeScene(), makeSpawnScene(), requestTravel (+3 more)

### Community 66 - "Boons.ts"
Cohesion: 0.18
Nodes (7): Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.18
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource"
Cohesion: 0.05
Nodes (22): AssignResourceName, AssignResourceType, classes, Energy, EnergyOptions, Health, HealthOptions, Mana (+14 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 80 - "SpellButton.test.ts"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

### Community 81 - "ControllerUnderTest"
Cohesion: 0.14
Nodes (3): CastableSpell, ControllerUnderTest, SpellStub

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
Nodes (15): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+7 more)

### Community 90 - "Character.tsx"
Cohesion: 0.08
Nodes (22): getResourceColour(), PlayerStats, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, Slot(), DetailedLoot() (+14 more)

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.07
Nodes (38): keywords, ref_node_fs, ref_node_path, ref_node_url, phaser3, typescript, vite, BIOMES (+30 more)

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 96 - "Armory.tsx"
Cohesion: 0.47
Nodes (5): buyLoot, toggleFilter, Armory(), src_ui_components_templates_armory_module, SortKey

### Community 98 - "Tilemaps"
Cohesion: 0.29
Nodes (6): Autotiling, Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 101 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 102 - "PlayerUnderTest"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 109 - "Multishot.ts"
Cohesion: 0.16
Nodes (6): Multishot, Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 110 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 111 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 134 - "Item.test.ts"
Cohesion: 0.40
Nodes (3): baseConfig, randomMock, sampleMock

## Knowledge Gaps
- **434 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+429 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `generate-biome-maps.mjs` to `react`, `Enemy.ts`, `package.json`?**
  _High betweenness centrality (0.140) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `game.ts`, `Monster.ts`, `Hero`, `TownScene.ts`, `Spell.ts`, `Frostbolt.ts`, `CastBar`, `Resource`, `BiomeScene.ts`, `PhaserGame.tsx`, `TargetReticle`, `Spell.test.ts`, `Player.ts`, `CastingController.test.ts`, `TownScene.test.ts`, `AssignClass.ts`, `generate-biome-maps.mjs`, `SnareTrap.ts`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Armory.tsx`, `biomes.ts`, `gameReducer.ts`, `armoryClient.ts`, `readSettings`, `UI.tsx`, `CharacterCard.tsx`, `ItemTooltip.tsx`, `Stats.tsx`, `LootItem`, `PhaserGame.tsx`, `Attributes.tsx`, `MerchantModeToggle.tsx`, `Save.tsx`, `store/index.ts`, `Character.tsx`, `generate-biome-maps.mjs`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _434 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.12433862433862433 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09655172413793103 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08780841799709724 - nodes in this community are weakly interconnected._