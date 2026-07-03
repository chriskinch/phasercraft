# Graph Report - phasercraft  (2026-07-02)

## Corpus Check
- 204 files · ~337,238 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1256 nodes · 2352 edges · 88 communities (65 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.63)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `48741fb9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Player|Player]]
- [[_COMMUNITY_Frostbolt.ts|Frostbolt.ts]]
- [[_COMMUNITY_Spell|Spell]]
- [[_COMMUNITY_Item|Item]]
- [[_COMMUNITY_Consecration|Consecration]]
- [[_COMMUNITY_generateItem.ts|generateItem.ts]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_Player.ts|Player.ts]]
- [[_COMMUNITY_Gem.ts|Gem.ts]]
- [[_COMMUNITY_AssignSpell.ts|AssignSpell.ts]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_Armory.tsx|Armory.tsx]]
- [[_COMMUNITY_Enemy|Enemy]]
- [[_COMMUNITY_LootItem|LootItem]]
- [[_COMMUNITY_PlayerStats|PlayerStats]]
- [[_COMMUNITY_StoredItem|StoredItem]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_EnemyOptions|EnemyOptions]]
- [[_COMMUNITY_UI.tsx|UI.tsx]]
- [[_COMMUNITY_System.tsx|System.tsx]]
- [[_COMMUNITY_Agentic Readiness Roadmap|Agentic Readiness Roadmap]]
- [[_COMMUNITY_Phasercraft|Phasercraft]]
- [[_COMMUNITY_game.ts|game.ts]]
- [[_COMMUNITY_gameReducer.ts|gameReducer.ts]]
- [[_COMMUNITY_HUD.ts|HUD.ts]]
- [[_COMMUNITY_index.ts|index.ts]]
- [[_COMMUNITY_AssignResource.ts|AssignResource.ts]]
- [[_COMMUNITY_TownScene|TownScene]]
- [[_COMMUNITY_handlers.test.ts|handlers.test.ts]]
- [[_COMMUNITY_scripts|scripts]]
- [[_COMMUNITY_GameScene.ts|GameScene.ts]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_Resource|Resource]]
- [[_COMMUNITY_GameScene|GameScene]]
- [[_COMMUNITY_classes.ts|classes.ts]]
- [[_COMMUNITY_Resource.test.ts|Resource.test.ts]]
- [[_COMMUNITY_LoadScene.ts|LoadScene.ts]]
- [[_COMMUNITY_SceneUnderTest|SceneUnderTest]]
- [[_COMMUNITY_Health.ts|Health.ts]]
- [[_COMMUNITY_UI|UI]]
- [[_COMMUNITY_ItemTooltip.tsx|ItemTooltip.tsx]]
- [[_COMMUNITY_.prettierrc.json|.prettierrc.json]]
- [[_COMMUNITY_helpers.ts|helpers.ts]]
- [[_COMMUNITY_Hero|Hero]]
- [[_COMMUNITY_SnareTrap|SnareTrap]]
- [[_COMMUNITY_armory-smoke.ts|armory-smoke.ts]]
- [[_COMMUNITY_tsconfig.json|tsconfig.json]]
- [[_COMMUNITY_Resource.ts|Resource.ts]]
- [[_COMMUNITY_Armory API (`apiarmory`)|Armory API (`/api/armory`)]]
- [[_COMMUNITY_CLAUDE.md — Working agreement and project conventions|CLAUDE.md — Working agreement and project conventions]]
- [[_COMMUNITY_generate-pwa-icons.mjs|generate-pwa-icons.mjs]]
- [[_COMMUNITY_Multishot|Multishot]]
- [[_COMMUNITY_Whirlwind|Whirlwind]]
- [[_COMMUNITY_StatBar.tsx|StatBar.tsx]]
- [[_COMMUNITY_vercel.json|vercel.json]]
- [[_COMMUNITY_Vercel deployment (Phase 6)|Vercel deployment (Phase 6)]]
- [[_COMMUNITY_Shield|Shield]]
- [[_COMMUNITY_HudUnderTest|HudUnderTest]]
- [[_COMMUNITY_GameOverScene|GameOverScene]]
- [[_COMMUNITY_qa-review|qa-review.md]]
- [[_COMMUNITY_log.js|log.js]]
- [[_COMMUNITY_vite-env.d.ts|vite-env.d.ts]]
- [[_COMMUNITY_vite.config.ts|vite.config.ts]]
- [[_COMMUNITY_vitest.config.ts|vitest.config.ts]]
- [[_COMMUNITY_eslint.config.mjs|eslint.config.mjs]]
- [[_COMMUNITY_playwright.config.ts|playwright.config.ts]]
- [[_COMMUNITY_vitest.setup.ts|vitest.setup.ts]]
- [[_COMMUNITY_graphify reference extra exports and benchmark|graphify reference: extra exports and benchmark]]
- [[_COMMUNITY_Healer|Healer]]
- [[_COMMUNITY_Faith|Faith]]
- [[_COMMUNITY_graphify reference query, path, explain|graphify reference: query, path, explain]]
- [[_COMMUNITY_Frostbolt|Frostbolt]]
- [[_COMMUNITY_ManaShield|ManaShield]]
- [[_COMMUNITY_PlayerStats|PlayerStats]]
- [[_COMMUNITY_Monster|Monster]]
- [[_COMMUNITY_Smite|Smite]]
- [[_COMMUNITY_graphify reference add a URL and watch a folder|graphify reference: add a URL and watch a folder]]
- [[_COMMUNITY_graphify reference commit hook and native CLAUDE.md integration|graphify reference: commit hook and native CLAUDE.md integration]]
- [[_COMMUNITY_graphify reference incremental update and cluster-only|graphify reference: incremental update and cluster-only]]
- [[_COMMUNITY_graphify reference GitHub clone and cross-repo merge|graphify reference: GitHub clone and cross-repo merge]]
- [[_COMMUNITY_graphify reference transcribe video and audio|graphify reference: transcribe video and audio]]
- [[_COMMUNITY_extraction-spec|extraction-spec.md]]

## God Nodes (most connected - your core abstractions)
1. `Enemy` - 73 edges
2. `Player` - 62 edges
3. `Spell` - 57 edges
4. `SpellOptions` - 36 edges
5. `Resource` - 29 edges
6. `LootItem` - 25 edges
7. `GameScene` - 23 edges
8. `StoredItem` - 22 edges
9. `TownScene` - 22 edges
10. `Item` - 21 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `setItemStore()`  [EXTRACTED]
  scripts/armory-smoke.ts → api/armory/_lib/itemStore.ts
- `SystemProps` --references--> `RootState`  [EXTRACTED]
  src/ui/components/templates/System.tsx → src/store/index.ts
- `DetailedLootProps` --references--> `LootItem`  [EXTRACTED]
  src/ui/components/molecules/DetailedLoot.tsx → src/types/game.ts
- `LootProps` --references--> `LootItem`  [EXTRACTED]
  src/ui/components/molecules/Loot.tsx → src/types/game.ts
- `UI()` --indirect_call--> `Armory()`  [INFERRED]
  src/ui/UI.tsx → src/ui/components/templates/Armory.tsx

## Import Cycles
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Enemy/Monster.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 3-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Player/Player.ts`
- 3-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/store/gameReducer.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Player/AssignClass.ts -> src/entities/Player/Mage.ts -> src/entities/Player/Player.ts -> src/types/scene.ts -> src/entities/Player/AssignClass.ts`
- 4-file cycle: `src/entities/Enemy/Enemy.ts -> src/entities/Resources/AssignResource.ts -> src/entities/Resources/Rage.ts -> src/entities/Player/Player.ts -> src/entities/Enemy/Enemy.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Consecration.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/EarthShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Faith.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Fireball.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Frostbolt.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Heal.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/ManaShield.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Multishot.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SiphonSoul.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/Smite.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`
- 4-file cycle: `src/entities/Player/Player.ts -> src/entities/Spells/AssignSpell.ts -> src/entities/Spells/SnareTrap.ts -> src/entities/Spells/Spell.ts -> src/entities/Player/Player.ts`

## Communities (88 total, 23 thin omitted)

### Community 0 - "Player"
Cohesion: 0.11
Nodes (4): MonsterConfig, Player, setBaseStats, setLevel

### Community 1 - "Frostbolt.ts"
Cohesion: 0.08
Nodes (10): Boon, Enrage, EnrageValue, FrostboltValue, Invocation, InvocationValue, PowerInfusion, PowerInfusionValue (+2 more)

### Community 3 - "Item"
Cohesion: 0.08
Nodes (15): Common, Epic, Fine, AdjustedStat, Item, ItemConfig, StatInfo, StatIterator (+7 more)

### Community 4 - "Consecration"
Cohesion: 0.06
Nodes (10): Consecration, EarthShield, SnareTrap, AreaEffect, TrapUnderTest, Trap, dropIn(), DropInItem (+2 more)

### Community 5 - "generateItem.ts"
Cohesion: 0.10
Nodes (31): Categories, itemCategories, Qualities, statNames, Stats, addStatIds(), allocateStatIterator(), generateItem() (+23 more)

### Community 6 - "compilerOptions"
Cohesion: 0.06
Nodes (31): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+23 more)

### Community 7 - "Player.ts"
Cohesion: 0.32
Nodes (4): clone(), targetVector(), TargetWithBody, VectorResult

### Community 8 - "Gem.ts"
Cohesion: 0.08
Nodes (18): CirclingConfig, EnemyStates, HitParams, Coin, CoinConfig, Crafting, CraftingConfig, Gem (+10 more)

### Community 9 - "AssignSpell.ts"
Cohesion: 0.16
Nodes (7): MoveOptions, classes, Fireball, Heal, SpellValue, SpellOptions, TargetType

### Community 10 - "devDependencies"
Cohesion: 0.07
Nodes (30): devDependencies, eslint, eslint-config-prettier, eslint-plugin-react, eslint-plugin-react-hooks, gh-pages, jsdom, lint-staged (+22 more)

### Community 11 - "Armory.tsx"
Cohesion: 0.11
Nodes (25): ApiItem, baseUrl(), colorForQuality(), isArmoryConfigured(), listItems(), qualityColors, removeItem(), restock() (+17 more)

### Community 13 - "LootItem"
Cohesion: 0.14
Nodes (14): equipLoot, selectLoot, unequipLoot, LootItem, DroppableSlot(), DroppableSlotProps, helm, SlotComponentProps (+6 more)

### Community 14 - "PlayerStats"
Cohesion: 0.17
Nodes (6): StatProps, HealthProps, HealthStats, StatItem, StatsProps, StatsStyles

### Community 15 - "StoredItem"
Cohesion: 0.16
Nodes (8): client(), clone(), createItemStore(), ItemStore, MemoryItemStore, parse(), RedisItemStore, StoredItem

### Community 16 - "index.ts"
Cohesion: 0.29
Nodes (15): handler(), handler(), ApiRequest, ApiResponse, applyCors(), firstQueryValue(), handlePreflight(), methodNotAllowed() (+7 more)

### Community 17 - "EnemyOptions"
Cohesion: 0.18
Nodes (6): AssignType, classes, Boss, Melee, Ranged, EnemyOptions

### Community 18 - "UI.tsx"
Cohesion: 0.13
Nodes (14): container, PhaserGame, Arcanum(), Character(), CharacterSelect(), Equipment(), HUD(), Level (+6 more)

### Community 19 - "System.tsx"
Cohesion: 0.22
Nodes (7): Title(), TitleProps, HeaderConfig, HeaderProps, PixelBackgroundOptions, pixelBackgroundVars(), PixelEmbossOptions

### Community 20 - "Agentic Readiness Roadmap"
Cohesion: 0.09
Nodes (21): Agentic Readiness Roadmap, Decisions log (agreed 2026-06-17), Decisions update (2026-06-21) — Phases 7–8 reworked (non-destructive), Decisions update (2026-06-23) — PWA installability (Phase 11), Deferred / backlog, Phase 0 — Baseline (done, PR #305), Phase 10 — Phaser 4 migration (last, issue #312), Phase 11 — PWA installability & offline play (issue TBD) (+13 more)

### Community 21 - "Phasercraft"
Cohesion: 0.09
Nodes (21): Advanced Magic System, Available Commands, Code Quality, Combat Tips, 🎮 Controls, Deep Loot & Progression, 🛠️ Development, Development Setup (+13 more)

### Community 22 - "game.ts"
Cohesion: 0.10
Nodes (20): EnemyStats, SpellType, AdjustValue, CHARACTER_BASE_STATS, CharacterData, COMBAT_TYPES, CombatType, EnemyAttributes (+12 more)

### Community 23 - "gameReducer.ts"
Cohesion: 0.16
Nodes (11): addXP, buyLoot, initState, Level, nextWave, sellLoot, setPlayerPosition, setSaveSlot (+3 more)

### Community 24 - "HUD.ts"
Cohesion: 0.24
Nodes (11): LabelledContainer, styles, readAllSaves(), readSave(), removeSave(), SAVE_SLOTS, SaveData, SaveSlot (+3 more)

### Community 25 - "index.ts"
Cohesion: 0.17
Nodes (12): gameReducer, GameState, loadGame, RootState, Inventory(), sampleItems, initialGame, seed() (+4 more)

### Community 26 - "AssignResource.ts"
Cohesion: 0.05
Nodes (21): AssignResourceName, classes, Energy, EnergyOptions, Health, HealthOptions, Mana, ManaOptions (+13 more)

### Community 27 - "TownScene"
Cohesion: 0.13
Nodes (5): AssignClass, GameSceneConfig, TownScene, setCurrentArea, toggleHUD

### Community 28 - "handlers.test.ts"
Cohesion: 0.16
Nodes (11): Captured, Handler, mockReq(), mockRes(), run(), describe(), itemContract, itemListContract (+3 more)

### Community 29 - "scripts"
Cohesion: 0.11
Nodes (18): scripts, armory:smoke, build, build-nolog, dev, dev-nolog, format, format:check (+10 more)

### Community 30 - "GameScene.ts"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 31 - "package.json"
Cohesion: 0.12
Nodes (16): description, engines, node, homepage, keywords, lint-staged, *.{json,md,css,yml,yaml}, *.{ts,tsx,js,jsx,mjs} (+8 more)

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, fantasy-content-generator, ioredis, lodash, number-to-words, phaser, polished, react (+9 more)

### Community 33 - "Resource"
Cohesion: 0.19
Nodes (8): classes, PlayerConfig, Cleric, Mage, Occultist, Ranger, Warrior, PlayerOptions

### Community 34 - "GameScene"
Cohesion: 0.10
Nodes (4): GameScene, FakeTimer, SceneUnderTest, EnemyType

### Community 35 - "classes.ts"
Cohesion: 0.20
Nodes (13): ascended_classes, ascended_schools, AscendedClassType, AscendedSchoolType, class_schools, ClassType, CombatType, getAscendedClass() (+5 more)

### Community 36 - "Resource.test.ts"
Cohesion: 0.19
Nodes (6): Banes, Boons, StatusEffect, StatusEffects, setStats, updateStats

### Community 37 - "LoadScene.ts"
Cohesion: 0.10
Nodes (9): AnimationConfig, createAnimations(), EnemyConfig, EnemyType, fontConfig, GameOverScene, LoadScene, SelectScene (+1 more)

### Community 38 - "SceneUnderTest"
Cohesion: 0.16
Nodes (9): AttributeProps, Slot(), Attributes(), AttributesProps, AttributesStyles, DetailedLoot(), DetailedLootProps, GroupedAttributes() (+1 more)

### Community 39 - "Health.ts"
Cohesion: 0.21
Nodes (8): PlayerName, selectCharacter, Button(), ButtonProps, CharacterCardProps, Dialog(), DialogProps, SystemProps

### Community 40 - "UI"
Cohesion: 0.20
Nodes (4): UI, MapStateOptions, mapStateToData(), state$

### Community 41 - "ItemTooltip.tsx"
Cohesion: 0.24
Nodes (6): Equipment, LootStat, Price(), PriceProps, ItemTooltipProps, MenuContext

### Community 42 - ".prettierrc.json"
Cohesion: 0.22
Nodes (8): arrowParens, endOfLine, printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 43 - "helpers.ts"
Cohesion: 0.39
Nodes (6): Character, CHARACTERS, expectGameCanvas(), makeSave(), SAVE_SLOTS, seedSave()

### Community 45 - "SnareTrap"
Cohesion: 0.20
Nodes (6): Destination, DrawBarOptions, AssignResourceType, AssignSpell, Weapon, WeaponConfig

### Community 46 - "armory-smoke.ts"
Cohesion: 0.43
Nodes (6): setItemStore(), call(), Handler, log(), main(), Result

### Community 47 - "tsconfig.json"
Cohesion: 0.29
Nodes (6): compilerOptions, module, moduleResolution, exclude, extends, include

### Community 48 - "Resource.ts"
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

### Community 54 - "StatBar.tsx"
Cohesion: 0.53
Nodes (3): getResourceColour(), StatBar(), StatBarProps

### Community 55 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, headers, outputDirectory, $schema

### Community 56 - "Vercel deployment (Phase 6)"
Cohesion: 0.40
Nodes (4): Notes, One-time maintainer steps (Vercel dashboard), Vercel deployment (Phase 6), What's config-as-code (already in the repo)

### Community 59 - "GameOverScene"
Cohesion: 0.27
Nodes (7): LootIcon(), LootIconProps, LootIconStyles, LootProps, CustomDragLayer(), getItemStyles(), Offset

### Community 60 - "qa-review.md"
Cohesion: 0.50
Nodes (3): Comment style rules, Context restriction (CRITICAL — do not skip), Step-by-step process

### Community 73 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 76 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 79 - "PlayerStats"
Cohesion: 0.40
Nodes (4): PlayerStats, GroupedAttributesProps, GroupedStatsProps, StatItem

### Community 82 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 83 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 84 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **356 isolated node(s):** `semi`, `singleQuote`, `trailingComma`, `tabWidth`, `useTabs` (+351 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Player` connect `Player` to `Resource`, `Spell`, `Resource.test.ts`, `LoadScene.ts`, `Player.ts`, `Gem.ts`, `AssignSpell.ts`, `Faith`, `Hero`, `SnareTrap`, `ManaShield`, `PlayerStats`, `EnemyOptions`, `game.ts`, `AssignResource.ts`, `TownScene`?**
  _High betweenness centrality (0.051) - this node is a cross-community bridge._
- **Why does `Spell` connect `Spell` to `Player`, `Frostbolt.ts`, `Consecration`, `Gem.ts`, `AssignSpell.ts`, `Faith`, `Frostbolt`, `ManaShield`, `Resource.ts`, `Smite`, `Multishot`, `Whirlwind`, `Shield`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Why does `Enemy` connect `Enemy` to `Player`, `Frostbolt.ts`, `Resource.test.ts`, `Consecration`, `Player.ts`, `Gem.ts`, `AssignSpell.ts`, `Healer`, `SnareTrap`, `Frostbolt`, `Monster`, `EnemyOptions`, `Smite`, `Multishot`, `Whirlwind`, `game.ts`, `Shield`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **What connects `semi`, `singleQuote`, `trailingComma` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Player` be split into smaller, more focused modules?**
  _Cohesion score 0.1103448275862069 - nodes in this community are weakly interconnected._
- **Should `Frostbolt.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08021390374331551 - nodes in this community are weakly interconnected._
- **Should `Spell` be split into smaller, more focused modules?**
  _Cohesion score 0.1402116402116402 - nodes in this community are weakly interconnected._