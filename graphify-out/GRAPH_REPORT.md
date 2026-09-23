# Graph Report - phasercraft  (2026-09-23)

## Corpus Check
- 265 files · ~408,584 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1791 nodes · 3603 edges · 150 communities (87 shown, 63 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.67)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cad7585c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Player
- AssignSpell.ts
- Merchant.tsx
- LootTable.ts
- TownScene
- generateItem.ts
- compilerOptions
- Button.tsx
- HUD.ts
- Invocation.ts
- devDependencies
- Stat.tsx
- Enemy.ts
- Character.tsx
- DroppableSlot.tsx
- StoredItem
- items/index.ts
- BiomeScene.ts
- react
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- game.ts
- Projectile.ts
- store/index.ts
- operations/helpers.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- PhaserGame.tsx
- dependencies
- Enemy
- BiomeScene
- classes.ts
- Player.ts
- Trap.ts
- Spell
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
- paths
- CLAUDE.md — Working agreement and project conventions
- PlayerOptions
- Attributes.tsx
- Resource.ts
- LootItem
- vercel.json
- Vercel deployment (Phase 6)
- targetVector
- SiphonSoul
- UI
- qa-review.md
- log.js
- vite-env.d.ts
- Item
- armoryClient.ts
- exclude
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- CastBar
- Resource
- graphify reference: query, path, explain
- Price.tsx
- Tilemaps
- TargetReticle
- SnareTrap
- gameReducer.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- @components/*
- biomes.ts
- generate-biome-maps.mjs
- HUD.test.ts
- SceneUnderTest
- lint-staged
- Bug-Fix Agent — Instructions
- Resource.test.ts
- lib
- tsconfig.json
- Save.tsx
- eslint.config.mjs
- eslint-config-prettier
- Player.test.ts
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
- PlayerStats
- CastingController.test.ts
- ControllerUnderTest
- CastableSpell
- Enemy.test.ts
- PlayerUnderTest
- Consecration
- StatBar.tsx
- System.tsx
- Faith
- ReticleUnderTest
- Shield
- SpellCheckUnderTest
- main.tsx
- Gem.test.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 75 edges
2. `Player` - 67 edges
3. `react` - 59 edges
4. `Spell` - 56 edges
5. `phaser` - 41 edges
6. `SpellOptions` - 36 edges
7. `BiomeScene` - 33 edges
8. `Resource` - 29 edges
9. `CastingController` - 29 edges
10. `LootItem` - 27 edges

## Surprising Connections (you probably didn't know these)
- `LootListDrag()` --indirect_call--> `icon()`  [INFERRED]
  src/ui/components/molecules/LootListDrag.tsx → scripts/generate-pwa-icons.mjs
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `CharacterCardProps` --references--> `PlayerName`  [EXTRACTED]
  src/ui/components/molecules/CharacterCard.tsx → src/entities/Player/AssignClass.ts
- `CastingControllerOptions` --references--> `GameSceneLike`  [EXTRACTED]
  src/entities/Spells/CastingController.ts → src/types/scene.ts
- `Attributes()` --calls--> `formatStatValue()`  [EXTRACTED]
  src/ui/components/molecules/Attributes.tsx → src/lib/statConversion.ts

## Import Cycles
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Weapons/AreaEffect.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Fireball.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Frostbolt.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Smite.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (150 total, 63 thin omitted)

### Community 0 - "Player"
Cohesion: 0.10
Nodes (5): MonsterConfig, Player, AssignResource(), setBaseStats, setLevel

### Community 1 - "AssignSpell.ts"
Cohesion: 0.09
Nodes (12): MoveOptions, classes, Fireball, Frostbolt, FrostboltValue, Heal, ManaShield, Smite (+4 more)

### Community 2 - "Merchant.tsx"
Cohesion: 0.12
Nodes (28): buyComponent, buyGear, MerchantState, refreshMerchant, sellComponent, sellComponentStack, sellLoot, COMPONENT_DEFS (+20 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.15
Nodes (6): Common, Epic, Legendary, LootItem, LootTable, Rare

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (28): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+20 more)

### Community 6 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 7 - "Button.tsx"
Cohesion: 0.18
Nodes (9): requestTravel, Button(), ButtonProps, src_ui_components_atoms_button_module, HeaderConfig, HeaderProps, src_ui_components_organisms_header_module, ConfirmReturn() (+1 more)

### Community 8 - "HUD.ts"
Cohesion: 0.22
Nodes (10): LabelledContainer, styles, readAllSaves(), readSave(), SAVE_SLOTS, SaveData, SaveSlot, writeSave() (+2 more)

### Community 9 - "Invocation.ts"
Cohesion: 0.06
Nodes (13): Boon, Enrage, EnrageValue, Invocation, InvocationValue, InvocationUnderTest, PowerInfusion, PowerInfusionValue (+5 more)

### Community 10 - "devDependencies"
Cohesion: 0.22
Nodes (9): eslint, devDependencies, eslint, vite, vite-plugin-pwa, vitest, vite, vite-plugin-pwa (+1 more)

### Community 11 - "Stat.tsx"
Cohesion: 0.22
Nodes (5): src_ui_components_atoms_stat_module, StatProps, HealthProps, HealthStats, src_ui_components_molecules_health_module

### Community 12 - "Enemy.ts"
Cohesion: 0.09
Nodes (17): phaser, CirclingConfig, EnemyStates, HitParams, Coin, CoinConfig, Crafting, CraftingConfig (+9 more)

### Community 13 - "Character.tsx"
Cohesion: 0.20
Nodes (8): Slot(), DetailedLoot(), DetailedLootProps, src_ui_components_molecules_detailedloot_module, GroupedAttributes(), GroupedAttributesProps, NumericStats, src_ui_components_templates_character_module

### Community 14 - "DroppableSlot.tsx"
Cohesion: 0.16
Nodes (15): setMerchantMode, DroppableSlot(), DroppableSlotProps, src_ui_components_atoms_droppableslot_module, Title(), TitleProps, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module (+7 more)

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "items/index.ts"
Cohesion: 0.29
Nodes (16): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+8 more)

### Community 17 - "BiomeScene.ts"
Cohesion: 0.20
Nodes (13): AssignClass, classes, PlayerConfig, PlayerName, PlayerType, MapStateOptions, mapStateToData(), state$ (+5 more)

### Community 18 - "react"
Cohesion: 0.10
Nodes (24): react, LootIcon(), LootIconProps, LootIconStyles, src_ui_components_atoms_looticon_module, ComponentsGrid(), ComponentsGridProps, src_ui_components_molecules_componentsgrid_module (+16 more)

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
Cohesion: 0.09
Nodes (21): AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, ComponentDef, ComponentStack, Equipment, EQUIPMENT_SLOTS (+13 more)

### Community 24 - "Projectile.ts"
Cohesion: 0.25
Nodes (4): Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest

### Community 25 - "store/index.ts"
Cohesion: 0.11
Nodes (18): gameReducer, GameState, loadGame, RootState, Coins(), CoinsProps, src_ui_components_atoms_coins_module, helm (+10 more)

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

### Community 31 - "PhaserGame.tsx"
Cohesion: 0.06
Nodes (26): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, PhaserGame(), BootScene, createLogo() (+18 more)

### Community 32 - "dependencies"
Cohesion: 0.10
Nodes (21): fantasy-content-generator, ioredis, lodash, dependencies, fantasy-content-generator, ioredis, lodash, polished (+13 more)

### Community 33 - "Enemy"
Cohesion: 0.06
Nodes (13): ref_console, AssignType, classes, Boss, Enemy, EnemyStats, Healer, Melee (+5 more)

### Community 34 - "BiomeScene"
Cohesion: 0.18
Nodes (3): BiomeDefinition, BiomeScene, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "Player.ts"
Cohesion: 0.09
Nodes (13): Hero, HeroConfig, Destination, DrawBarOptions, AssignResourceName, AssignResourceType, AssignSpell, Boons (+5 more)

### Community 37 - "Trap.ts"
Cohesion: 0.15
Nodes (7): AreaEffect, TrapUnderTest, Trap, dropIn(), DropInItem, DropInOptions, ArcadeCollisionObject

### Community 39 - "UI.tsx"
Cohesion: 0.11
Nodes (19): switchUi, Alchemist(), src_ui_components_templates_alchemist_module, Arcanum(), src_ui_components_templates_arcanum_module, Blacksmith(), src_ui_components_templates_blacksmith_module, CharacterSelect() (+11 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.18
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.33
Nodes (7): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave()

### Community 44 - "area.ts"
Cohesion: 0.42
Nodes (7): BOSS_SCALING, promoteToBoss(), scaleLootTable(), table, src_config_enemies, EnemyConfig, LootTable

### Community 45 - "CastingController.ts"
Cohesion: 0.22
Nodes (7): ActiveCast, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast, TargetKind

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.20
Nodes (9): compilerOptions, module, moduleResolution, exclude, extends, include, **/*.ts, **/*.test.ts (+1 more)

### Community 49 - "paths"
Cohesion: 0.10
Nodes (21): ./src/config/*, ./src/entities/*, ./src/helpers/*, ./src/scenes/*, ./src/services/*, ./src/store/*, ./src/types/*, ./src/ui/* (+13 more)

### Community 50 - "CLAUDE.md — Working agreement and project conventions"
Cohesion: 0.29
Nodes (6): CLAUDE.md — Working agreement and project conventions, Code conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules

### Community 51 - "PlayerOptions"
Cohesion: 0.15
Nodes (7): Cleric, Mage, Occultist, Ranger, Warrior, SpellType, PlayerOptions

### Community 52 - "Attributes.tsx"
Cohesion: 0.25
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource.ts"
Cohesion: 0.15
Nodes (12): classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions, Rage (+4 more)

### Community 54 - "LootItem"
Cohesion: 0.17
Nodes (16): equipLoot, selectLoot, unequipLoot, LootItem, src_ui_components_atoms_slot_module, SlotComponentProps, SlotProps, Loot() (+8 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "targetVector"
Cohesion: 0.16
Nodes (6): Multishot, Whirlwind, clone(), targetVector(), TargetWithBody, VectorResult

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 64 - "armoryClient.ts"
Cohesion: 0.28
Nodes (13): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+5 more)

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

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Price.tsx"
Cohesion: 0.40
Nodes (4): src_ui_components_atoms_price_module, Price(), PriceProps, MenuContext

### Community 78 - "Tilemaps"
Cohesion: 0.29
Nodes (6): Autotiling, Collision, Layers, Loading, Regenerating the biome maps, Tilemaps

### Community 81 - "gameReducer.ts"
Cohesion: 0.10
Nodes (17): addComponent, addXP, buyLoot, freshMerchant(), initState, Level, MerchantMode, setBossActive (+9 more)

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

### Community 89 - "@components/*"
Cohesion: 0.33
Nodes (6): ./src/ui/components/atoms/*, ./src/ui/components/molecules/*, ./src/ui/components/organisms/*, ./src/ui/components/protons/*, ./src/ui/components/templates/*, @components/*

### Community 90 - "biomes.ts"
Cohesion: 0.22
Nodes (10): BIOME_IDS, BiomeMap, BIOMES, resolveBiome(), FakeTimer, makeOverlayScene(), makeScene(), makeSpawnScene() (+2 more)

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.07
Nodes (39): keywords, ref_node_fs, ref_node_path, ref_node_url, phaser3, typescript, vite, BIOMES (+31 more)

### Community 94 - "lint-staged"
Cohesion: 0.50
Nodes (5): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}, eslint --fix, prettier --write

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 96 - "Resource.test.ts"
Cohesion: 0.15
Nodes (3): ResourceFlowUnderTest, ResourceStatsUnderTest, ResourceUnderTest

### Community 97 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

### Community 98 - "tsconfig.json"
Cohesion: 0.50
Nodes (3): **/*.tsx, include, **/*.ts

### Community 99 - "Save.tsx"
Cohesion: 0.25
Nodes (9): removeSave(), selectCharacter, setSaveSlot, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module, src_ui_components_templates_save_module, Save() (+1 more)

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 135 - "PlayerStats"
Cohesion: 0.20
Nodes (8): PlayerStats, src_ui_components_molecules_stats_module, StatItem, StatsProps, StatsStyles, GroupedStats(), GroupedStatsProps, StatItem

### Community 136 - "CastingController.test.ts"
Cohesion: 0.22
Nodes (6): makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 139 - "Enemy.test.ts"
Cohesion: 0.32
Nodes (5): EnemyUnderTest, makeBurst(), makeEnemy(), ProjectileMock, CombatType

### Community 142 - "StatBar.tsx"
Cohesion: 0.43
Nodes (4): getResourceColour(), src_ui_components_molecules_statbar_module, StatBar(), StatBarProps

### Community 143 - "System.tsx"
Cohesion: 0.48
Nodes (3): Dialog(), DialogProps, getDialogRoot()

### Community 148 - "main.tsx"
Cohesion: 0.40
Nodes (3): container, PhaserGame, src_styles_globals

## Knowledge Gaps
- **435 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+430 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **63 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `keywords` connect `generate-biome-maps.mjs` to `react`, `Enemy.ts`, `package.json`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Why does `phaser` connect `Enemy.ts` to `Player`, `AssignSpell.ts`, `Player.ts`, `Trap.ts`, `CastingController.test.ts`, `HUD.ts`, `CastBar`, `Invocation.ts`, `TownScene.test.ts`, `CastingController.ts`, `TargetReticle`, `Spell.test.ts`, `BiomeScene.ts`, `Resource.ts`, `game.ts`, `Projectile.ts`, `generate-biome-maps.mjs`, `PhaserGame.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `Merchant.tsx`, `Button.tsx`, `PlayerStats`, `HUD.ts`, `Stat.tsx`, `Character.tsx`, `DroppableSlot.tsx`, `StatBar.tsx`, `System.tsx`, `main.tsx`, `store/index.ts`, `PhaserGame.tsx`, `UI.tsx`, `Attributes.tsx`, `LootItem`, `armoryClient.ts`, `Price.tsx`, `gameReducer.ts`, `ItemTooltip.tsx`, `biomes.ts`, `generate-biome-maps.mjs`, `Save.tsx`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _435 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.10227272727272728 - nodes in this community are weakly interconnected._
- **Should `AssignSpell.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08826945412311266 - nodes in this community are weakly interconnected._
- **Should `Merchant.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._