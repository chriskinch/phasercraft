# Graph Report - phasercraft  (2026-09-27)

## Corpus Check
- 277 files · ~429,367 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 68 file(s) not represented in the graph (top: .css 43, (none) 8, .psd 5)

## Summary
- 1956 nodes · 4418 edges · 97 communities (77 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b02ef4b7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- CastingController.test.ts
- Consecration
- gameReducer.ts
- LootTable.ts
- TownScene.ts
- generateItem.ts
- compilerOptions
- vitest
- main.tsx
- Frostbolt.ts
- devDependencies
- Stats.tsx
- game.ts
- BiomeScene.ts
- StoredItem
- items/index.ts
- HUD.test.ts
- react
- CastingController
- Agentic Readiness Roadmap
- Phasercraft
- package.json
- Enemy.test.ts
- CharacterCard.tsx
- area.ts
- SpellButton
- handlers.test.ts
- scripts
- What You Must Do When Invoked
- dependencies
- Enemy
- BiomeScene
- classes.ts
- generateItem.test.ts
- SnareTrap
- UI.tsx
- TownScene.test.ts
- TargetReticle
- .prettierrc.json
- e2e/helpers.ts
- Dialog.tsx
- armory-smoke.ts
- api/tsconfig.json
- Spell.test.ts
- TargetReticle.test.ts
- build
- generate
- Attributes.tsx
- Resource
- vercel.json
- Vercel deployment (Phase 6)
- Projectile
- SiphonSoul
- SpawnDirector
- qa-review.md
- log.js
- vite-env.d.ts
- store/index.ts
- armoryClient.ts
- Blacksmith crafting UI — design spec
- Armory API (`/api/armory`)
- @testing-library/jest-dom
- number-to-words.d.ts
- graphify reference: extra exports and benchmark
- generate-pwa-icons.mjs
- Phase 13 — Town shops system (issue TBD)
- graphify reference: query, path, explain
- MerchantModeToggle.tsx
- Settings.tsx
- Item
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- extraction-spec.md
- ItemTooltip.tsx
- repository
- generate-biome-maps.mjs
- BiomeScene.test.ts
- lint-staged
- Bug-Fix Agent — Instructions
- UI
- fonts.ts
- Player
- CastingController.ts
- EarthShield
- Player.test.ts
- Spell
- Price.tsx
- Item.ts
- LootItem
- phaser

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 84 edges
2. `Player` - 68 edges
3. `vitest` - 61 edges
4. `react` - 59 edges
5. `Spell` - 58 edges
6. `phaser` - 47 edges
7. `BiomeScene` - 45 edges
8. `SpellOptions` - 36 edges
9. `CastingController` - 32 edges
10. `Button()` - 32 edges

## Surprising Connections (you probably didn't know these)
- `PR2 — New `/api/armory/*` on Vercel KV (gate: standalone verified)` --references--> `generateItem()`  [INFERRED]
  docs/ROADMAP.md → api/armory/_lib/generateItem.ts
- `Reconciling with Step 4a (PR #448)` --references--> `formatStatValue()`  [INFERRED]
  docs/specs/blacksmith-crafting-ui.md → src/lib/statConversion.ts
- `Phase 3 — TypeScript completion (done)` --references--> `GameSceneLike`  [INFERRED]
  docs/ROADMAP.md → src/types/scene.ts
- `Craft button` --references--> `Button()`  [INFERRED]
  docs/specs/blacksmith-crafting-ui.md → src/ui/components/atoms/Button.tsx
- `Pickers` --references--> `Button()`  [INFERRED]
  docs/specs/blacksmith-crafting-ui.md → src/ui/components/atoms/Button.tsx

## Import Cycles
- None detected.

## Communities (97 total, 20 thin omitted)

### Community 0 - "CastingController.test.ts"
Cohesion: 0.13
Nodes (8): ControllerUnderTest, EnemyStub, makeController(), makeTimer(), PlayerStub, ReticleStub, SceneStub, TimerStub

### Community 2 - "gameReducer.ts"
Cohesion: 0.08
Nodes (48): Step 3 — Merchant shop, addComponent, addXP, buyComponent, buyGear, equipLoot, freshMerchant(), gameReducer (+40 more)

### Community 3 - "LootTable.ts"
Cohesion: 0.13
Nodes (8): Common, Epic, Fine, Item, Legendary, LootItem, LootTable, Rare

### Community 4 - "TownScene.ts"
Cohesion: 0.15
Nodes (7): AssignClass, BiomeId, GameSceneConfig, TownScene, clearTravelRequest, setCurrentArea, toggleHUD

### Community 5 - "generateItem.ts"
Cohesion: 0.11
Nodes (27): addStatIds(), allocateStatIterator(), generateItem(), getIcon(), getQuality(), getQualityMap(), getRandomCategory(), getRandomStatNames() (+19 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 7 - "vitest"
Cohesion: 0.11
Nodes (14): Step 1 — Shop skeletons: open & close every shop (this PR), @testing-library/react, vitest, helm, stacks, Alchemist(), src_ui_components_templates_alchemist_module, sampleItems (+6 more)

### Community 8 - "main.tsx"
Cohesion: 0.33
Nodes (6): react-dnd-touch-backend, react-dom, App(), container, PhaserGame, src_styles_globals

### Community 9 - "Frostbolt.ts"
Cohesion: 0.06
Nodes (18): Deferred / backlog, Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, InvocationUnderTest (+10 more)

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Stats.tsx"
Cohesion: 0.12
Nodes (18): PlayerStats, src_ui_components_atoms_stat_module, Stat(), StatProps, Health(), HealthProps, HealthStats, src_ui_components_molecules_health_module (+10 more)

### Community 12 - "game.ts"
Cohesion: 0.06
Nodes (32): uuid, classes, CirclingConfig, EnemyStates, EnemyStats, HitParams, Healer, Melee (+24 more)

### Community 13 - "BiomeScene.ts"
Cohesion: 0.13
Nodes (14): Code conventions, ref_console, rxjs, AssignType, Boss, BOSS_SCALE, MapStateOptions, mapStateToData() (+6 more)

### Community 15 - "StoredItem"
Cohesion: 0.14
Nodes (10): client(), clone(), createItemStore(), ITEMS_KEY, ItemStore, MemoryItemStore, parse(), RedisItemStore (+2 more)

### Community 16 - "items/index.ts"
Cohesion: 0.30
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 18 - "react"
Cohesion: 0.10
Nodes (41): Slots, react, react-dnd, react-redux, selectLoot, unequipLoot, DroppableSlot(), src_ui_components_atoms_droppableslot_module (+33 more)

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.14
Nodes (13): Agentic Readiness Roadmap, Decisions update (2026-06-23) — PWA installability (Phase 11), Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD), Phase 2 — Stability fixes (known bugs), Phase 3 — TypeScript completion (done), Phase 4 — Test buildout (done) (+5 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "package.json"
Cohesion: 0.07
Nodes (32): eslintConfig, description, homepage, keywords, name, private, simple-git-hooks, pre-commit (+24 more)

### Community 24 - "Enemy.test.ts"
Cohesion: 0.19
Nodes (5): EnemyUnderTest, LifecycleEnemy, makeBurst(), makeEnemy(), ProjectileMock

### Community 25 - "CharacterCard.tsx"
Cohesion: 0.31
Nodes (7): PlayerName, selectCharacter, setCoins, CharacterCard(), CharacterCardProps, src_ui_components_molecules_charactercard_module, src_ui_components_templates_characterselect_module

### Community 26 - "area.ts"
Cohesion: 0.18
Nodes (13): AREA_KILLS_TO_BOSS, AREA_LIVE_CAP, BOSS_SCALING, DESPAWN_DELAY_MS, promoteToBoss(), scaleLootTable(), SPAWN_ATTEMPTS_PER_TICK, SPAWN_CONE_HALF_ANGLE_DEG (+5 more)

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

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 34 - "BiomeScene"
Cohesion: 0.10
Nodes (10): Collision, Layers, Loading, Regenerating the biome maps, Tilemaps, resolveAreaTuning(), BiomeScene, setBossActive (+2 more)

### Community 35 - "classes.ts"
Cohesion: 0.21
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "generateItem.test.ts"
Cohesion: 0.08
Nodes (26): Categories, Amulet, Armor, Axe, Bow, Gem, Helmet, Misc (+18 more)

### Community 37 - "SnareTrap"
Cohesion: 0.17
Nodes (3): SnareTrap, TrapUnderTest, Trap

### Community 38 - "UI.tsx"
Cohesion: 0.08
Nodes (43): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+35 more)

### Community 40 - "TownScene.test.ts"
Cohesion: 0.23
Nodes (4): FakeZone, makeScene(), sceneStandingOn(), SceneUnderTest

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "e2e/helpers.ts"
Cohesion: 0.24
Nodes (9): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, SavedComponentStack, seedSave(), PORT (+1 more)

### Community 45 - "Dialog.tsx"
Cohesion: 0.22
Nodes (7): ref_node_fs, ref_node_path, vite, vite-plugin-pwa, @vitejs/plugin-react, COMPONENT_DIRS, COMPONENT_DIRS

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "api/tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, module, moduleResolution, exclude, extends, include, ../tsconfig.json

### Community 48 - "Spell.test.ts"
Cohesion: 0.27
Nodes (3): CooldownTimerStub, SpellCheckUnderTest, SpellUnderTest

### Community 50 - "build"
Cohesion: 0.14
Nodes (13): CLAUDE.md — Working agreement and project conventions, Commands, graphify (codebase knowledge graph), Versions and docs, Workflow rules, Phase 1 — CI quality gates, Phase 5 — Vite migration (issue TBD), Phase 8 — Frontend → REST, then teardown (issue TBD) (+5 more)

### Community 51 - "generate"
Cohesion: 0.27
Nodes (10): Autotiling, buildPathCorners(), buildWaterCorners(), cornerAt(), generate(), inEntrance(), maskAt(), removeDiagonals() (+2 more)

### Community 52 - "Attributes.tsx"
Cohesion: 0.28
Nodes (7): Attribute(), AttributeProps, src_ui_components_atoms_attribute_module, Attributes(), AttributesProps, AttributesStyles, src_ui_components_molecules_attributes_module

### Community 53 - "Resource"
Cohesion: 0.05
Nodes (19): Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions, Rage, RageOptions (+11 more)

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 57 - "Projectile"
Cohesion: 0.13
Nodes (9): Multishot, Projectile, ProjectileOptions, ProjectileTarget, ProjectileUnderTest, clone(), targetVector(), TargetWithBody (+1 more)

### Community 59 - "SpawnDirector"
Cohesion: 0.05
Nodes (28): AreaTuning, DEFAULT_AREA_TUNING, isBeyondRadius(), Point, sampleSpawnPoint(), spawnDirection(), spawnRadius(), SpawnRadiusOptions (+20 more)

### Community 60 - "qa-review.md"
Cohesion: 0.40
Nodes (4): Comment style rules, Context restriction (CRITICAL — do not skip), Identity note (why this posts a comment-style review), Step-by-step process

### Community 61 - "log.js"
Cohesion: 0.33
Nodes (4): fs, https, ref_fs, ref_https

### Community 63 - "store/index.ts"
Cohesion: 0.17
Nodes (14): @reduxjs/toolkit, buyLoot, GameState, toggleFilter, RootState, ComponentStack, CoinsProps, src_ui_components_atoms_coins_module (+6 more)

### Community 64 - "armoryClient.ts"
Cohesion: 0.31
Nodes (12): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+4 more)

### Community 65 - "Blacksmith crafting UI — design spec"
Cohesion: 0.17
Nodes (11): Blacksmith crafting UI — design spec, Colours and type, Craft button, Craft success, Layout — forge (phone), Pickers, Proposed PR breakdown, Reconciling with Step 4a (PR #448) (+3 more)

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
Cohesion: 0.29
Nodes (7): Decisions update (2026-07-30) — Town shops, Later — presentation, Phase 13 — Town shops system (issue TBD), Step 2 — Armory on its POI (verify migration), Step 4 — Blacksmith crafting, Step 5 — Arcanum spell shop (scrolls), Step 6 — Alchemist

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 78 - "MerchantModeToggle.tsx"
Cohesion: 0.18
Nodes (14): setMerchantMode, Title(), TitleProps, MERCHANT_ACTIVE_BLUE, MerchantModeToggle(), src_ui_components_molecules_merchantmodetoggle_module, tabStyle(), Navigation() (+6 more)

### Community 79 - "Settings.tsx"
Cohesion: 0.11
Nodes (24): PhaserGame(), SelectScene, DEFAULT_SETTINGS, readSettings(), Settings, SETTINGS_KEY, StartLocation, writeSettings() (+16 more)

### Community 80 - "Item"
Cohesion: 0.28
Nodes (11): addStats(), Comparable, readKey(), removeStats(), sortAscending(), sortBy(), sortDescending(), SortOptions (+3 more)

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
Cohesion: 0.15
Nodes (20): Layout — forge (desktop), react-tooltip, appliedStatValue(), conversionFor(), CONVERSIONS, DEFAULT_CONVERSION, formatStatValue(), roundStat() (+12 more)

### Community 89 - "repository"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 91 - "generate-biome-maps.mjs"
Cohesion: 0.11
Nodes (22): BIOMES, BOULDER, buildEntrance(), ENTRANCE, fade(), fence(), FENCE_SOLID, GATE (+14 more)

### Community 93 - "BiomeScene.test.ts"
Cohesion: 0.10
Nodes (18): BIOME_IDS, BiomeDefinition, BiomeMap, BIOMES, DEFAULT_BIOME, resolveBiome(), FakeDirector, FakeTimer (+10 more)

### Community 94 - "lint-staged"
Cohesion: 0.67
Nodes (3): lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs}

### Community 95 - "Bug-Fix Agent — Instructions"
Cohesion: 0.25
Nodes (7): Bug-Fix Agent — Instructions, Hard stops — always ask the maintainer instead of proceeding, Step 1 — Understand the issue, Step 2 — Confidence assessment, Step 3 — Implement the fix, Step 4 — Verify locally, Step 5 — Open a PR

### Community 98 - "fonts.ts"
Cohesion: 0.06
Nodes (24): Sound (first audio in the game), home_user_phasercraft_src_styles_fonts_boldpixels_woff2_url, ref_styles_fonts_boldpixels_woff2_url, AnimationConfig, createAnimations(), EnemyConfig, EnemyType, bannerStyle() (+16 more)

### Community 99 - "Player"
Cohesion: 0.05
Nodes (24): MonsterConfig, classes, PlayerConfig, Cleric, Hero, HeroConfig, Mage, Occultist (+16 more)

### Community 100 - "CastingController.ts"
Cohesion: 0.14
Nodes (11): MoveOptions, ActiveCast, CastableSpell, CasterLike, CastingControllerOptions, CastingState, CastTarget, PendingCast (+3 more)

### Community 102 - "Player.test.ts"
Cohesion: 0.12
Nodes (3): PlayerUnderTest, RangedPlayerUnderTest, SCENE_EVENTS

### Community 108 - "Spell"
Cohesion: 0.05
Nodes (13): AssignSpell, classes, Faith, Fireball, Frostbolt, Heal, ManaShield, Smite (+5 more)

### Community 134 - "Item.ts"
Cohesion: 0.18
Nodes (8): AdjustedStat, ItemConfig, StatInfo, StatIterator, baseConfig, randomMock, sampleMock, StatFormat

### Community 142 - "LootItem"
Cohesion: 0.10
Nodes (23): polished, getResourceColour(), LootItem, DroppableSlotProps, src_ui_components_atoms_slot_module, Slot(), SlotComponentProps, SlotProps (+15 more)

### Community 149 - "phaser"
Cohesion: 0.06
Nodes (23): lodash, phaser, Coin, COIN_BASE_VALUE, CoinConfig, Crafting, CraftingConfig, Gem (+15 more)

## Knowledge Gaps
- **479 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+474 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 767 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `CastingController.test.ts`, `gameReducer.ts`, `generateItem.ts`, `Item.ts`, `Frostbolt.ts`, `BiomeScene.ts`, `LootItem`, `HUD.test.ts`, `react`, `phaser`, `package.json`, `Enemy.test.ts`, `area.ts`, `SpellButton`, `handlers.test.ts`, `classes.ts`, `generateItem.test.ts`, `SnareTrap`, `UI.tsx`, `TownScene.test.ts`, `Dialog.tsx`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `Projectile`, `SpawnDirector`, `Settings.tsx`, `Item`, `ItemTooltip.tsx`, `BiomeScene.test.ts`, `fonts.ts`, `Player.test.ts`?**
  _High betweenness centrality (0.212) - this node is a cross-community bridge._
- **Why does `phaser` connect `phaser` to `CastingController.test.ts`, `TownScene.ts`, `Frostbolt.ts`, `game.ts`, `BiomeScene.ts`, `package.json`, `SpellButton`, `UI.tsx`, `TownScene.test.ts`, `TargetReticle`, `Spell.test.ts`, `TargetReticle.test.ts`, `Resource`, `Projectile`, `SpawnDirector`, `Settings.tsx`, `BiomeScene.test.ts`, `fonts.ts`, `Player`, `CastingController.ts`, `Spell`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Consecration`, `BiomeScene`, `Player`, `CastingController.ts`, `SnareTrap`, `Frostbolt.ts`, `game.ts`, `BiomeScene.ts`, `Spell`, `CastingController`, `phaser`, `Enemy.test.ts`, `Projectile`, `SiphonSoul`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Spell` (e.g. with `Phase 12 — Spell system rework (casting, targeting, auto attack)` and `Phase 4 — Test buildout (done)`) actually correct?**
  _`Spell` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _479 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `CastingController.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12648221343873517 - nodes in this community are weakly interconnected._
- **Should `gameReducer.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0777323202805377 - nodes in this community are weakly interconnected._