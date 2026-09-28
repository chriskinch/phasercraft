# Graph Report - phasercraft  (2026-09-28)

## Corpus Check
- 288 files · ~438,212 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 2028 nodes · 4723 edges · 109 communities (88 shown, 21 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f1240ce9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- TownScene
- game.ts
- Item
- UI
- generateItem.ts
- compilerOptions
- BossRoar.ts
- fonts.ts
- AssignSpell.ts
- devDependencies
- Stats.tsx
- Player.ts
- walkability.ts
- vitest
- StoredItem
- items/index.ts
- .spawnHost
- Spell
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- EnemyOptions
- Enemy.test.ts
- TownScene.ts
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
- sfx.ts
- Blacksmith crafting UI — design spec
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- LoadScene
- vite.config.ts
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- CLAUDE.md — Working agreement and project conventions
- generate
- Invocation
- Resource
- store/index.ts
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- Phase 13 — Town shops system (issue TBD)
- armoryClient.ts
- operations/helpers.ts
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- react
- graphify reference: query, path, explain
- Armory.tsx
- Settings.tsx
- settingsStorage.ts
- gameReducer.ts
- AreaEffect.ts
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- GroupedAttributes.tsx
- generate-biome-maps.mjs
- safeArea.ts
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- HUD.test.ts
- useInstallPrompt.ts
- Whirlwind
- Player
- themes.ts
- EarthShield
- Player.test.ts
- build
- BiomeScene.ts
- BootScene
- engines
- Blacksmith.tsx
- Coin.ts

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `vitest` - 68 edges
3. `Player` - 68 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 51 edges
7. `BiomeScene` - 43 edges
8. `SpellOptions` - 36 edges
9. `Button()` - 34 edges
10. `CastingController` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Workflow rules` --references--> `build()`  [INFERRED]
  CLAUDE.md → scripts/generate-biome-maps.mjs
- `Decisions update (2026-07-30) — Town shops` --references--> `Recipe`  [INFERRED]
  docs/ROADMAP.md → src/types/game.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts
- `Summary` --references--> `Button()`  [INFERRED]
  docs/specs/blacksmith-crafting-ui.md → src/ui/components/atoms/Button.tsx

## Import Cycles
- None detected.

## Communities (109 total, 21 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.12
Nodes (10): CastableSpell, ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub (+2 more)

### Community 1 - "TownScene"
Cohesion: 0.16
Nodes (4): TownScene, clearTravelRequest, setCurrentArea, setPlayerPosition

### Community 2 - "game.ts"
Cohesion: 0.08
Nodes (42): MerchantState, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, COMPONENT_BUY_MULTIPLIER, COMPONENT_DEFS, COMPONENT_TYPES (+34 more)

### Community 3 - "Item"
Cohesion: 0.09
Nodes (16): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+8 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "BossRoar.ts"
Cohesion: 0.20
Nodes (8): BossRoar, ROAR_ABOVE_BOSS, ROAR_EDGE_MARGIN, roarPosition(), ScreenPoint, pad, player, view

### Community 8 - "fonts.ts"
Cohesion: 0.16
Nodes (8): home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, bannerStyle(), FONT_FAMILY, FONT_URL, CombatTextConfig, LogoOptions, GameOverScene

### Community 9 - "AssignSpell.ts"
Cohesion: 0.06
Nodes (16): AssignSpell, classes, Boon, Enrage, EnrageValue, Faith, Frostbolt, FrostboltValue (+8 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.24
Nodes (9): PlayerStats, src_ui_components_molecules_stats_module, StatItem, Stats(), StatsProps, StatsStyles, GroupedStats(), GroupedStatsProps (+1 more)

### Community 12 - "Player.ts"
Cohesion: 0.06
Nodes (39): phaser, uuid, CirclingConfig, EnemyStates, HitParams, CraftingConfig, GEM_BASE_VALUE, GemConfig (+31 more)

### Community 13 - "walkability.ts"
Cohesion: 0.36
Nodes (5): buildWalkability(), isFootprintSpawnable(), grid(), WalkabilityGrid, WalkabilityInput

### Community 14 - "vitest"
Cohesion: 0.09
Nodes (31): @testing-library/react, vitest, LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS (+23 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - ".spawnHost"
Cohesion: 0.21
Nodes (6): AssignType, Boss, BiomeDefinition, setBossActive, setEnemiesRemaining, EnemyType

### Community 18 - "Spell"
Cohesion: 0.11
Nodes (4): MoveOptions, Fireball, Spell, TargetType

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
Cohesion: 0.18
Nodes (5): classes, Healer, Melee, Ranged, EnemyOptions

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "TownScene.ts"
Cohesion: 0.24
Nodes (9): AssignClass, PlayerName, BiomeId, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), GameSceneConfig (+1 more)

### Community 26 - "area.ts"
Cohesion: 0.14
Nodes (17): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DEFAULT_AREA_TUNING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK (+9 more)

### Community 27 - "SpellButton"
Cohesion: 0.07
Nodes (7): Decisions update (2026-07-01) — Spell rework, Phase 12 — Spell system rework (casting, targeting, auto attack), CastBar, CastBarUnderTest, GraphicsStub, SpellButton, ButtonUnderTest

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
Cohesion: 0.13
Nodes (20): getResourceColour(), sellComponent, sellComponentStack, sellLoot, Slot(), DetailedLoot(), DetailedLootProps, src_ui_components_molecules_detailedloot_module (+12 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Enemy"
Cohesion: 0.10
Nodes (4): Enemy, Monster, MonsterConfig, AssignResource()

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
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "sfx.ts"
Cohesion: 0.25
Nodes (8): PhaserGame(), SelectScene, readSettings(), playSfx(), setSfxManager(), SFX, sfxGain(), SfxKey

### Community 39 - "Blacksmith crafting UI — design spec"
Cohesion: 0.21
Nodes (16): Step 4a — Crafting core (this PR), Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown (+8 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.22
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 44 - "LoadScene"
Cohesion: 0.14
Nodes (8): Step 4e — Craft SFX (first audio in the game) (#482), Sound (first audio in the game), AnimationConfig, createAnimations(), EnemyConfig, EnemyType, createLogo(), LoadScene

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
Nodes (6): CLAUDE.md — Working agreement and project conventions, Commands, graphify (codebase knowledge graph), Reply style, Versions and docs, Workflow rules

### Community 51 - "generate"
Cohesion: 0.31
Nodes (9): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), maskAt(), removeDiagonals(), rng() (+1 more)

### Community 53 - "Resource"
Cohesion: 0.06
Nodes (20): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+12 more)

### Community 54 - "store/index.ts"
Cohesion: 0.07
Nodes (46): react-redux, @reduxjs/toolkit, GameState, selectLoot, RootState, ComponentStack, Equipment, LootItem (+38 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.21
Nodes (4): Multishot, Projectile, ProjectileTarget, ProjectileUnderTest

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (27): AreaTuning, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions, view (+19 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "Phase 13 — Town shops system (issue TBD)"
Cohesion: 0.22
Nodes (9): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 4c — Schematic shop, Step 4d — Special items (#481), Step 5 — Arcanum spell shop (scrolls) (+1 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.30
Nodes (12): ApiItem, baseUrl(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock(), StoreItem (+4 more)

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

### Community 75 - "react"
Cohesion: 0.07
Nodes (49): Step 1 — Shop skeletons: open & close every shop (this PR), polished, react, react-dom, App(), container, PhaserGame, BIOME_IDS (+41 more)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 77 - "Armory.tsx"
Cohesion: 0.36
Nodes (7): buyLoot, toggleFilter, LootList(), Stock(), Armory(), src_ui_components_templates_armory_module, SortKey

### Community 78 - "Settings.tsx"
Cohesion: 0.22
Nodes (8): autoSpawnRadius(), hintStyle, numberInputStyle, rowStyle, SPAWN_FIELDS, SpawnNumberField, SpawnOverrideRowProps, subsectionStyle

### Community 79 - "settingsStorage.ts"
Cohesion: 0.26
Nodes (5): DEFAULT_SETTINGS, Settings, SETTINGS_KEY, StartLocation, writeSettings()

### Community 80 - "gameReducer.ts"
Cohesion: 0.10
Nodes (28): Step 3 — Merchant shop, addCoins, addComponent, addXP, buyComponent, buyGear, consumeComponent(), craftedItem() (+20 more)

### Community 81 - "AreaEffect.ts"
Cohesion: 0.18
Nodes (4): Consecration, AreaEffect, OverlapTarget, ArcadeCollisionObject

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
Nodes (18): Layout — forge (desktop), react-tooltip, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat() (+10 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 90 - "GroupedAttributes.tsx"
Cohesion: 0.29
Nodes (6): Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module, GroupedAttributesProps, NumericStats

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.14
Nodes (17): BIOMES, BOULDER, fade(), GROUND_DECO, lerp(), octave(), PATH_BY_MASK, PATH_DECO (+9 more)

### Community 92 - "safeArea.ts"
Cohesion: 0.19
Nodes (16): ensureWatching(), getHudInsets(), hudInsets(), listeners, makeProbe(), NO_INSETS, readRawInsets(), refresh() (+8 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.16
Nodes (7): FakeDirector, FakeTimer, makeGridScene(), makeOverlayScene(), makeScene(), SceneUnderTest, TileLike

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 97 - "useInstallPrompt.ts"
Cohesion: 0.43
Nodes (5): BeforeInstallPromptEvent, InstallPromptMode, isIosSafari(), isStandalone(), useInstallPrompt

### Community 99 - "Player"
Cohesion: 0.05
Nodes (20): Deferred / backlog, classes, PlayerConfig, Cleric, Hero, Mage, Occultist, Player (+12 more)

### Community 100 - "themes.ts"
Cohesion: 0.17
Nodes (15): lodash, Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, src_ui_components_atoms_stat_module, Stat(), StatProps, Health() (+7 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 103 - "build"
Cohesion: 0.25
Nodes (8): Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD), PR3 — Swap the frontend to the REST API (gate: merchant UI identical), PR4 — Teardown (gate: only after PR2 + PR3 verified), build(), offset(), tileLayer()

### Community 104 - "BiomeScene.ts"
Cohesion: 0.15
Nodes (19): Code conventions, ref_console, rxjs, BOSS_SCALE, MapStateOptions, mapStateToData(), state$, bit() (+11 more)

### Community 109 - "Blacksmith.tsx"
Cohesion: 0.12
Nodes (23): Slots, react-dnd, colorForQuality(), craftItem, RECIPES, DroppableSlot(), LootIcon(), CustomDragLayer() (+15 more)

### Community 149 - "Coin.ts"
Cohesion: 0.08
Nodes (10): Step 4b — Schematic drops, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, Gem, GemUnderTest, Collectable (+2 more)

## Knowledge Gaps
- **485 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+480 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 775 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `game.ts`, `Item`, `generateItem.ts`, `BossRoar.ts`, `fonts.ts`, `Player.ts`, `walkability.ts`, `Coin.ts`, `package.json`, `Enemy.test.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `Equipment.tsx`, `classes.ts`, `generateItem.test.ts`, `SnareTrap.ts`, `TownScene.test.ts`, `vite.config.ts`, `Spell.test.ts`, `TargetReticle.test.ts`, `Invocation`, `Resource`, `store/index.ts`, `Projectile`, `SpawnDirector`, `operations/helpers.ts`, `react`, `settingsStorage.ts`, `gameReducer.ts`, `ItemTooltip.tsx`, `safeArea.ts`, `BiomeScene.test.ts`, `HUD.test.ts`, `themes.ts`, `Player.test.ts`, `BiomeScene.ts`, `Blacksmith.tsx`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **Why does `phaser` connect `Player.ts` to `CastingController.test.ts`, `game.ts`, `BossRoar.ts`, `fonts.ts`, `AssignSpell.ts`, `vitest`, `Coin.ts`, `package.json`, `TownScene.ts`, `SpellButton`, `Enemy`, `sfx.ts`, `TownScene.test.ts`, `LoadScene`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `SpawnDirector`, `settingsStorage.ts`, `AreaEffect.ts`, `safeArea.ts`, `BiomeScene.test.ts`, `Player`, `BiomeScene.ts`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Whirlwind`, `Player`, `SiphonSoul`, `SnareTrap.ts`, `BiomeScene`, `game.ts`, `BiomeScene.ts`, `AssignSpell.ts`, `Player.ts`, `.spawnHost`, `Spell`, `CastingController`, `AreaEffect.ts`, `Coin.ts`, `EnemyOptions`, `Enemy.test.ts`, `Projectile`, `area.ts`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _485 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1168091168091168 - nodes in this community are weakly interconnected._
- **Should `game.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0783673469387755 - nodes in this community are weakly interconnected._