# Abilities UI — design spec

Issue #519. Agreed design from the Abilities design session (2026-10). It **layers on
the scroll-economy epic #384**: this spec is the loadout UI (replaces Track C, #43 +
#19) and refines Tracks A/B/D/E/F where noted in [Changes to #384](#changes-to-384).

Design canvas (mockups, phone landscape primary, desktop secondary):
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
| Learning         | Manual. Picked-up scrolls go to Equipment → **Scrolls** tab; player taps **Read** to consume.                                                         |
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

**Mobile first, landscape only.** The reference frame is a landscape phone,
**844 × 390** CSS px; layouts must also fit **667 × 375** (smallest supported) without
horizontal scroll. No portrait layout. Desktop is the same two-column layout scaled
up, not a separate design.

Landscape rules:

- Horizontal padding clears the notch: use the `--hud-inset-*` safe-area values
  (`src/helpers/safeArea.ts`), ~44 px each side on notched phones.
- Vertical space is the constraint (~290 px of panel). Every screen is **two
  columns side by side**, never stacked: controls left, detail card right.
- Only the detail card and long lists scroll (inside their own column); the nav row,
  slots and action buttons never scroll off.
- Touch targets ≥ 44 px (nav tabs, close, list rows, action buttons). Active slots
  64 px, passive slots 64 × 52 px.
- Nav tabs shrink to 16 px text / 44 px tall; the dungeon banner sits in the nav row
  rather than taking a row of its own.

| Screen           | Left column (fixed ~368 px)                                                                 | Right column (fills)                                   |
| ---------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Abilities (main) | ACTIVE row (5), PASSIVE row (5 locked), hint line                                           | Ability card for the selected slot                     |
| Ability picker   | Scrolling list of learned abilities                                                         | Ability card, then Equip / Remove / Back row (44 px)   |
| Scrolls tab      | Existing character/gear column, then scroll grid (4 cols) + Gear/Parts/Special/Scrolls tabs | Scroll card, Read button, then − / + / Sell / Sell All |

The picker is a **view inside the Abilities menu** (like the Blacksmith recipe
picker), not a new `UI.tsx` menu.

### Abilities (main)

1. **ACTIVE** label, then **5 square slots** numbered 1–5 (HUD order / hotkey).
    - Filled: spell icon + level pips (●○○). Tap → picker for that slot.
    - Empty: `+`. Tap → picker for that slot.
    - Selected slot is outlined; the detail card shows its spell.
2. **PASSIVE** label, then **5 locked slots** (greyed, padlock), caption "Coming
   soon". Not tappable.
3. **Detail card**: the [ability card](#ability-card) for the selected slot, or "Tap a
   slot to choose an ability."
4. **In a dungeon**: a banner "Change abilities in town". Slots still open the
   picker in read-only mode (browse + card, no Equip/Remove).

### Ability picker

- List of **learned, on-class** abilities: icon, name, level pips, tag "Slot 3" if
  equipped, "New" badge until first viewed.
- Detail card for the highlighted ability.
- Actions:
    - **Equip** — into the target slot. If the ability is in another slot, the two
      slots swap (target's previous ability moves to the source slot, or source
      becomes empty).
    - **Remove** — only when the target slot is filled; empties it.
    - **Back**.
- Empty state (none learned besides equipped): "Read scrolls to learn new abilities."

### Equipment → Scrolls tab

- New tab after **Special**: Gear | Parts | Special | **Scrolls**.
- Grid of scroll stacks, one per spell+level: scroll sprite tinted by spell school,
  level badge (`L2`), count badge (`×3`).
- Tap → tooltip ([ability card](#ability-card) + scroll state line) and the actions
  column shows:

| State                                | Read button         | Hint line                                   |
| ------------------------------------ | ------------------- | ------------------------------------------- |
| On-class, not learned                | **Learn** (enabled) | "Learns Fireball at L1"                     |
| On-class, scroll level > spell level | **Read** (enabled)  | "Upgrades Fireball L1 → L2"                 |
| On-class, scroll level ≤ spell level | disabled            | "Combine 3 at the Arcanum to make L2"       |
| On-class, spell at L3, L3 scroll     | disabled            | "Max level — sell or keep for recipes"      |
| Off-class                            | disabled            | "Warrior only — sell or use at the Arcanum" |

- **Sell** reuses the Parts stepper (Sell 1 / Sell N / Sell All). Sell value per level
  is balance (see open questions).
- Learn result: toast "Learned Fireball (L1) — equipped in slot 4" or "… — open
  Abilities to equip" when no slot is empty.

### Ability card

Shared by the Abilities detail, the picker and the Scrolls tooltip.

- Icon, **name**, level pips + "Level 2", class tag.
- **Description** (flavour) and **effect** text (plain language, e.g. "Hurls a
  fireball dealing 45 magic damage").
- **Cost** (in the player's resource), **cooldown**, **range** (cast range; "Self" for
  self-target).
- **Next level**: "L3: 180% power" (from the Track D multiplier table). Hidden at L3.

## Data model (mechanics — open to override)

- `SPELL_DEFS: Record<SpellType, SpellDef>` in `src/types/game.ts` — static,
  Phaser-free metadata: `name`, `description`, `effect`, `classes: PlayerName[]`,
  `icon_name`, `cooldown`, `cost`, `castRange`, `targetKind`. Today cost/range live
  inside each spell's constructor defaults, so the UI can't read them without
  instantiating a Phaser object; the spell classes read from `SPELL_DEFS` instead
  (single source of truth). `classes` is a list because Fireball is shared by Mage and
  Occultist.
- `PASSIVE_DEFS: Record<PassiveType, PassiveDef>` — empty registry; `PassiveType` a
  string-literal union to be filled later.
- Store (`GameState`, persisted):
    - `learnedSpells: Partial<Record<SpellType, SpellLevel>>` (`SpellLevel = 1 | 2 | 3`).
    - `scrolls: Partial<Record<SpellType, Partial<Record<SpellLevel, number>>>>` —
      unread scroll items; a 0 count is removed (like `specials`).
    - `abilityLoadout: (SpellType | null)[]` — length 5.
    - `passiveLoadout: (PassiveType | null)[]` — length 5, all `null`.
- Actions: `readScroll(spell, level)` (learn/upgrade + auto-equip), `equipAbility(slot,
spell | null)` (swap semantics; refused outside town), `sellScroll(spell, level,
count)`. Combining is #386's `combineScrolls`.
- Runtime: `Player` builds spells from `abilityLoadout` + `learnedSpells` instead of
  the class `abilities` array (which becomes the seed source only). Mid-run
  auto-equip/upgrade: the scene listens for the change and spawns/updates the one
  affected spell, following the `cleanup()` lifecycle rules.

## Changes to #384

- **Track A (#385)**: scrolls drop as levelled items into `scrolls`, not straight
  into owned spells.
- **Track B (#386)**: workshop lives in the **Arcanum**; combine is 3 scrolls → 1
  scroll of the next level (not "level the spell up" directly).
- **Track C (#43, #19)**: superseded by this spec.
- **Track D (#387)**: level comes from `learnedSpells`; must support a live level
  change mid-run.
- **Track E (#388)**: slice shapes above replace `spellScrolls` / `spellLoadout`.
- **Track F (#389)**: seeds `learnedSpells` (L1) + `abilityLoadout`; same defaults for
  legacy-save migration.

## Edge cases

- Warrior seeds 2 abilities, Ranger/Occultist 4 → remaining slots empty.
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
6. Scroll sprite: one sprite tinted per school, or per-spell icon on a scroll frame?
7. Equipment's current landscape-phone layout: does a 4th inventory tab fit beside the character/gear column at 667 px, or does the gear column need collapsing?
