# Abilities UI — design spec

Issue #519. Agreed design from the Abilities design session (2026-10). It **layers on
the scroll-economy epic #384**: this spec is the loadout UI (replaces Track C, #43 +
#19) and refines Tracks A/B/D/E/F where noted in [Changes to #384](#changes-to-384).

Design canvas (mockups, phone landscape 844 × 390, built on the in-game menu chrome):
https://claude.ai/artifact/VxckXN8u7BmWXfUCzzdXq5. Private until shared from its Share menu.

## Summary

A new **Abilities** tab joins **Character | Equipment** in the player menu. It holds
**5 active slots** (the HUD spell bar, in order) and **5 passive slots** (locked,
"Coming soon"). Tapping a slot opens a Blacksmith-style **picker** of learned
abilities with a detail card. Spells are learned by **reading scrolls** from a new
**Scrolls** tab in Equipment. Scrolls are levelled items (L1–L3); reading a scroll
higher than the spell's current level upgrades it. Combining 3 scrolls into the next
level happens at the **Arcanum** (#386).

## Decisions (maintainer-confirmed)

| Topic            | Decision                                                                                                                                              |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relation to #384 | Layer on. Levels (max 3) and the workshop stay.                                                                                                       |
| Nav label        | **Abilities** (class-neutral). Sections: **Active**, **Passive**.                                                                                     |
| Learning         | Manual. Picked-up scrolls go to Equipment → **Scrolls** tab; player taps **Learn** to consume.                                                        |
| Scroll levels    | Scrolls are items with a level (L1/L2/L3). 3 same-spell same-level scrolls → 1 of the next level (3 L1 = L2, 9 L1 = L3).                              |
| Reading          | First read learns the spell at the scroll's level. Reading a **higher** scroll raises the spell to that level. Same/lower: not readable, with a hint. |
| Combining        | **Arcanum only** (town), via the #386 workshop. Not in the Scrolls tab, not on pickup.                                                                |
| Class lock       | Off-class scrolls can't be read ("Warrior only"); sell or recipe fodder.                                                                              |
| Loadout changes  | **Town only.** Tab is read-only in a dungeon, except auto-equip below.                                                                                |
| Auto-equip       | Learning a spell fills the **first empty active slot**, anywhere — usable **immediately**, even mid-run.                                              |
| Mid-run upgrade  | Reading a higher scroll in a dungeon applies the new level **immediately**.                                                                           |
| Slot rules       | Empty slots allowed. A spell occupies at most one slot. Picking a spell already slotted elsewhere **swaps** the two slots. Slot 1–5 = HUD order.      |
| Slots unlocked   | All 5 active + 5 passive open from level 1.                                                                                                           |
| Passives         | 5 slots shown **locked** ("Coming soon"). Store, types and save field plumbed with an empty registry. No effects.                                     |
| Tooltip / card   | Name, level, description + effect text, cost / cooldown / range, next-level preview. **No** scroll-progress readout.                                  |
| Acquisition      | Out of scope here: ship with seeded spells only; drops land via #385. Arcanum may sell scrolls later.                                                 |
| Seed + migration | New characters and existing saves: class kit learned at **L1**, loadout = kit in current order. No visible change in play.                            |

## Screens

**Mobile first, landscape only.** Reference frame: landscape phone **844 × 390** CSS
px; must also fit **667 × 375** without horizontal scroll. No portrait layout.
Desktop is the same screen at a larger size, not a separate design.

**Built from the existing menu chrome, no new visual language.** Mockups were
traced from in-game screenshots of Character, Equipment, Blacksmith and Merchant at
844 × 390:

- Overlay over the game world, `Navigation` pixel tabs (orange `#ffa53d`, active blue
  `#44bff7`, 2em BoldPixels, white), yellow `Button` "X" top right.
- Pale `pixelBackground` panel (`#e4f6f7`). **Abilities drops the character
  column and equipment slots** (Equipment keeps them): slots | **ability card** |
  fixed action column (`--actions-col`), actions at the bottom.
- **Ability slots are the Equipment slots** (`DroppableSlot` look: `pixelEmboss`,
  56 px footprint) holding the bare spell icon — no white face, border or numbers.
  Selected slot = blue-tinted emboss (`pixelEmbossVars`).
- **Ability card** sits right of the slots, always visible: Blacksmith `resultCard`
  (white, 5 px border in the level colour). Scrolls in Equipment keep **tooltips**
  like other inventory items.
- Labels are the Blacksmith `sectionLabel` (0.75rem uppercase `#4d5d66`).
- **Scrolls** are an original 15 × 15 sprite drawn at 3× (45 px, fits the 56 px slot): a top roll and a
  lower roll, each with a curl on its right end, and a page between them. **Level =
  scroll colour**, a full palette swap: L1 parchment, L2 green, L3 blue.
- The page carries a **spell glyph**, not the button: the motif lifted from the spell's
  `atlas-icons` frame at its native 16 px grid (frame and background removed), shrunk to
  at most 5 × 5, corners cleared so it is never a square, ringed with the
  scroll's outline colour. Same 3× pixel size as the scroll, so they never mismatch.
  Glyph colours are not tinted. Generated per spell × level (build step or runtime
  canvas, decided at build).
- Stack count is the Parts-style black `badge` pill, in BoldPixels. Card/tooltip border
  matches the level: L1 `#bbbbbb`, L2 `#00dd00` (fine), L3 `#0077ff` (rare).
- Spell art is the existing `atlas-icons` frame each spell already uses on the HUD.
- Buttons are the `Button` atom; purple `#c9a3ff` for Learn (as Blacksmith "Use
  item"); disabled = grey.

| Screen            | Main area                                                                                  | Action column                                      |
| ----------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Abilities (main)  | ACTIVE row of 5 slots (left→right = HUD order), PASSIVE row of 5 locked; card to the right | Change / Remove (bottom)                           |
| Ability picker    | Grid of learned abilities                                                                  | Equip or Swap / Back (bottom)                      |
| Equipment Scrolls | Grid of scroll stacks (count badge)                                                        | Gear / Parts / Special / **Scrolls**; Learn / Sell |

The picker is a **view inside the Abilities menu** (like the Blacksmith recipe
picker), not a new `UI.tsx` menu.

### Abilities (main)

1. **ACTIVE** label, then **5 slots**, left → right = HUD order / hotkey.
    - Filled: the bare spell icon.
    - Empty: emboss slot with `+`.
    - Tap selects (blue emboss); the [ability card](#ability-card) shows it.
2. **PASSIVE · COMING SOON** label, then **5 locked slots** (faded, padlock). Not
   tappable.
3. Action column: **Change** (empty slot: **Choose**) opens the picker; **Remove**
   empties the slot.
4. **In a dungeon**: muted "Change in town" above the buttons; Change/Remove
   disabled. The card still works.

### Ability picker

- Label "CHOOSE FOR SLOT N", then a grid of **learned, on-class** ability icons. A
  purple **New** pill top-left until first tapped.
- Tap selects; the card adds "Equipped in slot N" when it is slotted.
- Action column: **Equip** (or **Swap** when the ability sits in another slot — the
  two slots trade places), **Back**.
- Empty state: "Read scrolls to learn new abilities."

### Equipment → Scrolls tab

- New toggle after **Special** in the filter column: Gear | Parts | Special |
  **Scrolls** (active = lime, as today).
- Grid of scrolls, one tile per spell + level: coloured scroll sprite + small spell
  icon, count badge.
- Tap → tooltip: "Fireball Scroll", "Level 1 · Mage, Occultist", effect, then a hint
  line (purple when readable, red when not):

| State                                | Learn button | Hint line                                         |
| ------------------------------------ | ------------ | ------------------------------------------------- |
| On-class, not learned                | **Learn**    | "Learns Fireball at L1 and fills…empty slot."     |
| On-class, scroll level > spell level | **Learn**    | "Upgrades Fireball L1 → L2."                      |
| On-class, scroll level ≤ spell level | disabled     | "Merge 3 at the Arcanum to make L2."              |
| On-class, spell at L3, L3 scroll     | disabled     | "Max level — sell or keep for recipes."           |
| Off-class                            | disabled     | "Warrior only. Sell it or use it at the Arcanum." |

- Action column: **Learn** (purple; disabled with the hint when not learnable), **Sell** (one at a time).
- **Sell value moves into a tooltip-style popup** (white card, coin + gold `+N`) in the
  lower-right corner of the inventory box, for Parts and Scrolls alike. The gold line
  in the action column goes, which frees the row the 4th filter (Scrolls) needs. The Arcanum's equivalent action is **Merge**.
- Learn result: toast "Learned Fireball (L1) — equipped in slot 4" or "… — open
  Abilities to equip" when no slot is empty.

### Ability card

Panel right of the slots on Abilities and the picker; the same content is the Scrolls
tab tooltip. White, 5 px border in the level colour (grey / green / blue).

- **Name**; "Level 2 · Mage, Occultist" (muted).
- **Description** (italic `#444`, like part lore) and **effect** text.
- **Cost** (player's resource) / **Cooldown** / **Range** rows ("Self" for
  self-target).
- **Next: L3 · 180% power** in purple (Track D table). Hidden at L3.

## Data model (mechanics — open to override)

- `SPELL_DEFS: Record<SpellType, SpellDef>` in `src/types/game.ts` — static,
  Phaser-free metadata: `name`, `description`, `effect`, `classes: PlayerName[]`,
  `icon_name`, `cooldown`, `cost`, `castRange`, `targetKind`. Today cost/range live
  inside each spell's constructor defaults, so the UI can't read them without
  instantiating a Phaser object; the spell classes read from `SPELL_DEFS` instead
  (single source of truth). `classes` is a list because Fireball is shared by Mage and
  Occultist.
- **Level scaling (#387)** — `SpellDef.scaling` (required): aspect → `{1,2,3}` multiplier
  curve; `SPELL_ASPECTS[spell]` lists the aspects a spell can scale (`power` for
  `setValue()` damage/healing, `duration`, buff/bane stat keys, per-tick amounts, trap
  damage). Unlisted aspects keep their L1 value; cost and cooldown never scale. **Every
  new ability must define its scaling** as part of its spec (maintainer picks aspects +
  curve). The ability card's "Next" line lists the scaled aspects.
- **Spell recipes (#580)** — `SPELL_RECIPES: Record<SpellType, SpellRecipe>` (required;
  `{ materials, coins, special }`). At the Arcanum (town only, any class):
    - **Trade** 1 scroll (any level, consumed) → learn that spell's recipe
      (`spellRecipes`).
    - **Craft** a learnt recipe → 1 **L1** scroll; costs its components, coins and its
      one **mandatory** special item. Scrolls are never craft inputs.
    - **Deconstruct** a scroll of a learnt spell → its components + special ×3 per
      level above L1 (L1 ×1, L2 ×3, L3 ×9) for a flat `SCROLL_DECONSTRUCT_COST`; the
      recipe's coins are not refunded.
    - Guards and hints: `src/lib/spellCraft.ts`. **Every new ability must define its
      recipe.** Later: a **Fuse** tab (2 spells + 1 legendary, #583).
- `PASSIVE_DEFS: Record<PassiveType, PassiveDef>` — empty registry; `PassiveType` a
  string-literal union to be filled later.
- Store (`GameState`, persisted):
    - `learnedSpells: Partial<Record<SpellType, SpellLevel>>` (`SpellLevel = 1 | 2 | 3`).
    - `scrolls: Partial<Record<SpellType, Partial<Record<SpellLevel, number>>>>` —
      unread scroll items; a 0 count is removed (like `specials`).
    - `abilityLoadout: (SpellType | null)[]` — length 5.
    - `passiveLoadout: (PassiveType | null)[]` — length 5, all `null`.
    - `spellRecipes: SpellType[]` — Arcanum recipes learnt by Trade (#580); new
      characters and older saves know none.
- Actions: `readScroll(spell, level)` (learn/upgrade + auto-equip), `equipAbility(slot,
spell | null)` (swap semantics; refused outside town), `sellScroll(spell, level,
count)`. Combining is #386's `combineScrolls`; crafting is `tradeScroll`,
  `craftSpell`, `deconstructScroll` (#580).
- Runtime: `Player` builds spells from `abilityLoadout` + `learnedSpells` instead of
  the class `abilities` array (which becomes the seed source only). Mid-run
  auto-equip/upgrade: the scene listens for the change and spawns/updates the one
  affected spell, following the `cleanup()` lifecycle rules.

## Changes to #384

- **Track A (#385)**: scrolls drop as levelled items into `scrolls`, not straight
  into owned spells. Confirmed: `scroll` loot entry at 5% per mob, exactly 1 per
  boss; always L1; every spell (off-class too) equally weighted in
  `SCROLL_DROP_WEIGHTS` (`src/lib/scrollDrops.ts`). On the ground every scroll
  shows one generic 16 × 16 sealed scroll (`scroll-drop.png`); the spell shows in
  the Scrolls tab.
- **Track B (#386)**: workshop lives in the **Arcanum**; combine is 3 scrolls → 1
  scroll of the next level (not "level the spell up" directly).
- **Track C (#43, #19)**: superseded by this spec.
- **Track D (#387)**: level comes from `learnedSpells`; must support a live level
  change mid-run.
- **Track E (#388)**: slice shapes above replace `spellScrolls` / `spellLoadout`.
- **Track F (#389)**: seeds `learnedSpells` (L1) + `abilityLoadout`; same defaults for
  legacy-save migration.

## Edge cases

- Warrior seeds 3 abilities, Ranger/Occultist 4 → remaining slots empty.
- Empty loadout is allowed; the player can enter a dungeon with no abilities.
- A learned spell removed from the game later: dropped from loadout/learned on load.
- Town spawns the player with no abilities (`TownScene`): unchanged; the tab still
  edits the loadout used in the next dungeon.
- Auto-equip mid-run with the HUD mid-cooldown on other spells: other spells
  unaffected.

## Open questions

1. Scroll **sell value** per level (balance).
2. Show spell **level on HUD buttons** (pips / roman numeral)?
3. Should HUD buttons get the ability card as a long-press tooltip?
4. Picker **sort order**: equipped first, then by name? Or by level?
5. Effect text: hand-written per spell, or templated from `setValue` base numbers so
   it tracks balance changes?
6. Weak glyphs on parchment: Consecration and Smite lose contrast when shrunk; may need a hand touch-up.
