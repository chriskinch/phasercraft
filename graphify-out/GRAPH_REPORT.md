# Graph Report - phasercraft  (2026-09-23)

## Corpus Check
- 265 files · ~407,187 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1787 nodes · 3597 edges · 135 communities (84 shown, 51 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4f5b065c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- gameReducer.ts
- Item
- TownScene
- generateItem.ts
- compilerOptions
- Button.tsx
- HUD.ts
- Frostbolt.ts
- devDependencies
- Stats.tsx
- Gem.ts
- Character.tsx
- PhaserGame.tsx
- StoredItem
- items/index.ts
- phaser
- ComponentsGrid.tsx
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- Enemy.ts
- store/index.ts
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- readSettings
- dependencies
- Enemy
- BiomeScene
- classes.ts
- Hero
- Trap
- Spell
- react
- TownScene.test.ts
- EarthShield
- .prettierrc.json
- e2e/helpers.ts
- BiomeScene.ts
- CastingController.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- paths
- CLAUDE.md — Working agreement and project conventions
- Boons.ts
- Attributes.tsx
- Resource.ts
- LootItem
- vercel.json
- Vercel deployment (Phase 6)
- LoadScene.ts
- SiphonSoul
- UI
- qa-review.md
- log.js
- vite-env.d.ts
- Invocation
- armoryClient.ts
- exclude
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource
- graphify reference: query, path, explain
- ItemTooltip.tsx
- Tilemaps
- TargetReticle
- SnareTrap
- Armory.tsx
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- statConversion.ts
- @components/*
- biomes.ts
- generate-biome-maps.mjs
- HUD.test.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- Crafting
- lib
- tsconfig.json
- LootTable
- eslint.config.mjs
- eslint-config-prettier
- PlayerUnderTest
- eslint-plugin-react
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
- Item.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 75 edges
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
- `PhaserGame()` --calls--> `readSettings()`  [EXTRACTED]
  src/PhaserGame.tsx → src/services/settingsStorage.ts
- `MoveOptions` --references--> `TargetType`  [EXTRACTED]
  src/entities/Enemy/Enemy.ts → src/types/game.ts
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts

## Import Cycles
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Cleric.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Occultist.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/entities/UI/Boons.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/index.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Ranger.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Warrior.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (135 total, 51 thin omitted)

### Community 0 - "Player"
Cohesion: 0.08
Nodes (6): MonsterConfig, Player, AssignResource(), Faith, setBaseStats, setLevel

### Community 1 - "AssignSpell.ts"
Cohesion: 0.07
Nodes (16): AssignSpell, classes, Fireball, Heal, ManaShield, Multishot, Smite, SpellValue (+8 more)

### Community 2 - "gameReducer.ts"
Cohesion: 0.09
Nodes (39): addComponent, addLoot, addXP, buyComponent, buyGear, freshMerchant(), initState, Level (+31 more)

### Community 3 - "Item"
Cohesion: 0.13
Nodes (7): Common, Epic, Fine, Item, Legendary, LootItem, Rare

### Community 4 - "TownScene"
Cohesion: 0.19
Nodes (3): TownScene, setCurrentArea, setPlayerPosition

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (28): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "Button.tsx"
Cohesion: 0.10
Nodes (17): PlayerName, requestTravel, selectCharacter, setCoins, Button(), ButtonProps, src_ui_components_atoms_button_module, CharacterCard() (+9 more)

### Community 8 - "HUD.ts"
Cohesion: 0.17
Nodes (15): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+7 more)

### Community 9 - "Frostbolt.ts"
Cohesion: 0.10
Nodes (9): Boon, Enrage, EnrageValue, Frostbolt, FrostboltValue, InvocationValue, PowerInfusion, PowerInfusionValue (+1 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.13
Nodes (9): src_ui_components_atoms_stat_module, StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module, src_ui_components_molecules_stats_module, StatItem, StatsProps (+1 more)

### Community 12 - "Gem.ts"
Cohesion: 0.12
Nodes (8): Coin, CoinConfig, Gem, GemConfig, GemUnderTest, coinValue(), getRandomVelocity(), addCoins

### Community 13 - "Character.tsx"
Cohesion: 0.13
Nodes (13): getResourceColour(), src_ui_components_atoms_slot_module, Slot(), SlotComponentProps, SlotProps, DetailedLoot(), src_ui_components_molecules_statbar_module, StatBar() (+5 more)

### Community 14 - "PhaserGame.tsx"
Cohesion: 0.13
Nodes (5): fontConfig, PhaserGame(), BootScene, GameOverScene, SelectScene

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "phaser"
Cohesion: 0.24
Nodes (8): phaser, CraftingConfig, PlayerType, SpellButtonOptions, AreaEffect, OverlapTarget, ArcadeCollisionObject, GameSceneLike

### Community 18 - "ComponentsGrid.tsx"
Cohesion: 0.19
Nodes (13): ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module, GearGrid(), src_ui_components_molecules_geargrid_module, GearShopGrid(), src_ui_components_molecules_gearshopgrid_module, PaginationControls() (+5 more)

### Community 19 - "CastingController"
Cohesion: 0.07
Nodes (11): CastableSpell, CastingController, ControllerUnderTest, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+3 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.06
Nodes (32): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Decisions update (2026-07-01) — Spell rework, Decisions update (2026-07-30) — Town shops, Deferred / backlog, Later — presentation (+24 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.15
Nodes (12): description, engines, node, homepage, name, private, repository, type (+4 more)

### Community 23 - "game.ts"
Cohesion: 0.07
Nodes (35): AssignClass, classes, PlayerConfig, Cleric, Mage, Occultist, Destination, DrawBarOptions (+27 more)

### Community 24 - "Enemy.ts"
Cohesion: 0.08
Nodes (19): CirclingConfig, EnemyStates, EnemyStats, HitParams, MoveOptions, EnemyUnderTest, makeBurst(), makeEnemy() (+11 more)

### Community 25 - "store/index.ts"
Cohesion: 0.14
Nodes (16): gameReducer, GameState, RootState, ComponentStack, Coins(), CoinsProps, src_ui_components_atoms_coins_module, stacks (+8 more)

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

### Community 31 - "readSettings"
Cohesion: 0.16
Nodes (14): DEFAULT_SETTINGS, readSettings(), Settings, StartLocation, writeSettings(), InstallBanner(), src_ui_components_molecules_installbanner_module, rowStyle (+6 more)

### Community 32 - "dependencies"
Cohesion: 0.10
Nodes (21): fantasy-content-generator, ioredis, lodash, dependencies, fantasy-content-generator, ioredis, lodash, polished (+13 more)

### Community 33 - "Enemy"
Cohesion: 0.05
Nodes (11): ref_console, AssignType, classes, Boss, Enemy, Healer, Melee, Monster (+3 more)

### Community 34 - "BiomeScene"
Cohesion: 0.15
Nodes (6): BiomeDefinition, BiomeScene, clearTravelRequest, setBossActive, setEnemiesRemaining, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 37 - "Trap"
Cohesion: 0.17
Nodes (5): TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions

### Community 39 - "react"
Cohesion: 0.06
Nodes (41): react, container, PhaserGame, setMerchantMode, switchUi, src_styles_globals, Title(), TitleProps (+33 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.18
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 44 - "BiomeScene.ts"
Cohesion: 0.36
Nodes (8): BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies, toggleHUD, EnemyConfig, LootTable

### Community 45 - "CastingController.ts"
Cohesion: 0.25
Nodes (6): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 48 - "Spell.test.ts"
Cohesion: 0.18
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 49 - "paths"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "Boons.ts"
Cohesion: 0.18
Nodes (7): Banes, IndexableStats, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource.ts"
Cohesion: 0.15
Nodes (12): classes, Energy, EnergyOptions, HealthOptions, Mana, ManaOptions, RageOptions, DrawBarOptions (+4 more)

### Community 54 - "LootItem"
Cohesion: 0.11
Nodes (23): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, helm (+15 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "LoadScene.ts"
Cohesion: 0.18
Nodes (7): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, createLogo(), LogoOptions, LoadScene

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 65 - "exclude"
Cohesion: 0.18
Nodes (11): assets/**/*.tmj, assets/**/*.tmx, assets/**/*.tsx, dist/**/*.tmj, dist/**/*.tmx, dist/**/*.tsx, node_modules, public/**/*.tmj (+3 more)

### Community 66 - "Armory API (`/api/armory`)"
Cohesion: 0.33
Nodes (5): Armory API (`/api/armory`), Endpoints, Production (maintainer), Storage, Verifying it standalone (no infra)

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 74 - "CastBar"
Cohesion: 0.18
Nodes (4): CastBar, CastBarStart, CastBarUnderTest, GraphicsStub

### Community 75 - "Resource"
Cohesion: 0.06
Nodes (8): Health, Rage, Resource, ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest, Shield, ResourceStats

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "ItemTooltip.tsx"
Cohesion: 0.22
Nodes (8): Equipment, LootStat, src_ui_components_atoms_price_module, Price(), PriceProps, ItemTooltipProps, src_ui_components_molecules_itemtooltip_module, MenuContext

### Community 78 - "Tilemaps"
Cohesion: 0.29
Nodes (6): Autotiling, Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 79 - "TargetReticle"
Cohesion: 0.12
Nodes (3): TargetReticle, GraphicsStub, ReticleUnderTest

### Community 81 - "Armory.tsx"
Cohesion: 0.38
Nodes (6): buyLoot, toggleFilter, Stock(), Armory(), src_ui_components_templates_armory_module, SortKey

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
Cohesion: 0.24
Nodes (13): appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat(), StatConversion, statPolarity() (+5 more)

### Community 89 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 90 - "biomes.ts"
Cohesion: 0.18
Nodes (11): BIOME_IDS, BiomeId, BiomeMap, BIOMES, resolveBiome(), FakeTimer, makeScene(), makeSpawnScene() (+3 more)

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.07
Nodes (39): keywords, ref_node_fs, ref_node_path, ref_node_url, phaser3, typescript, vite, BIOMES (+31 more)

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 98 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 102 - "PlayerUnderTest"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

## Knowledge Gaps
- **435 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **51 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `generate-biome-maps.mjs` to `phaser`, `package.json`, `react`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `Player`, `AssignSpell.ts`, `HUD.ts`, `Frostbolt.ts`, `Gem.ts`, `PhaserGame.tsx`, `CastingController`, `game.ts`, `Enemy.ts`, `Hero`, `Trap`, `TownScene.test.ts`, `BiomeScene.ts`, `CastingController.ts`, `Spell.test.ts`, `Resource.ts`, `LoadScene.ts`, `CastBar`, `TargetReticle`, `biomes.ts`, `generate-biome-maps.mjs`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `armoryClient.ts`, `gameReducer.ts`, `Button.tsx`, `HUD.ts`, `Stats.tsx`, `ItemTooltip.tsx`, `PhaserGame.tsx`, `Character.tsx`, `Armory.tsx`, `ComponentsGrid.tsx`, `Attributes.tsx`, `LootItem`, `statConversion.ts`, `store/index.ts`, `biomes.ts`, `generate-biome-maps.mjs`, `readSettings`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _435 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.08392603129445235 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07390648567119155 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08708272859216255 - nodes in this community are weakly interconnected._