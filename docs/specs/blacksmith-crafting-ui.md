# Blacksmith crafting UI — design spec

Phase 13, Step 4 (Blacksmith crafting). This spec is the agreed **interface** design
from the Blacksmith design session. It sits on top of the data model and reducer
built in Step 4a (PR #448: `Recipe`/`RECIPES`, the `recipes` save slice,
`craftItem`, `componentTotal`/`missingMaterials`). Where this spec and #448 differ,
the section [Reconciling with Step 4a](#reconciling-with-step-4a-pr-448) says which
one wins and what still needs a maintainer decision.

Design canvas (interactive mockups, desktop + phone):
https://claude.ai/artifact/SbLK2vE7y5CZPFS8G1q5sw. The link is private until it is
shared from its Share menu.

## Summary

The Blacksmith uses a **forge line**. The player slots a recipe, the recipe fills up
to four component slots, and they can add one optional special item. A card beside
the line shows the finished item and its fixed stats. **Craft** is greyed out until
everything required is in. A successful craft plays a pixel hammer-on-anvil
animation with a clang.

The look is the existing in-game shop UI: the pale pixel panel, the blue title chip,
the yellow `Button` atom and real loot sprites. The mockups' dark theme was an early
exploration and is not used.

## Screens

| Screen              | Desktop                                                                 | Phone (390 px wide)                                                                                            |
| ------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Forge (main)        | Two columns: forge line on the left, "You will craft" card on the right | One column: recipe card, components row, special row, "You will craft" card, Craft button pinned to the bottom |
| Recipe picker       | 4-column tile grid + details panel on the right                         | List of rows + a details summary + **Use recipe**                                                              |
| Special item picker | 4-column tile grid + details panel on the right                         | List of rows + details summary + **Use item**                                                                  |
| Craft success       | Overlay over the forge                                                  | Same overlay                                                                                                   |

Pickers are views inside the Blacksmith menu, not new `UI.tsx` menus. The header
**Back** button returns to the forge. The menu's X still closes the shop.

## Layout — forge (desktop)

Header (standard shop chrome): the blue `Title` chip reading "Blacksmith" on the
left. `Coins` and the yellow close X on the right.

Panel (`theme.pixelBackground`, default `#e4f6f7`):

1. **Recipe card**: a full-width tappable card (a slightly darker panel tone) holding:
    - The recipe slot (square, larger than the component slots).
    - The label "RECIPE", the recipe name, and a hint line.
    - Empty: a `+` in the slot, "No recipe", "Tap to choose from your recipes" and a
      right-chevron. Tap opens the recipe picker.
    - Filled: the recipe sprite, the recipe name, "Tap to remove" and a red ✕ badge on
      the slot's corner. Tap clears the recipe, which also empties the component
      slots.
2. **Components + special row**:
    - Label "COMPONENTS" over **4 square component slots**. Each slot has the
      component **name** below it, then **have/need** (e.g. `33/3`).
    - have/need is **green** when have ≥ need and **red** when short. A slot the
      recipe doesn't use is empty, with a muted "Not needed" (desktop) or "—"
      (phone).
    - With no recipe, all four slots are empty.
    - Then a `+` separator and **SPECIAL**: one square slot.
        - Empty: a faint purple slot with `+`, "Optional" and "Tap to add". Tap opens
          the special picker.
        - Filled: the item sprite, its name, "Tap to remove" and a ✕ badge. Tap
          clears it.
3. **Craft button**: full width, the `Button` atom, with states per the
   [Craft button](#craft-button) section below.

**"You will craft" card** (right column, 280 px): styled like `ItemTooltip`, with a
white face and a 5 px border in the crafted item's rarity colour
(`colorForQuality`).

- No recipe: "Choose a recipe to see the item and its stats."
- Recipe slotted:
    - The result slot (rarity-tinted, sprite), the item name, and "Rarity · Type"
      (e.g. "Common · Weapon").
    - Stat rows, "Label:" left and the value right in green. Values use
      `formatStatValue` so units match the Character screen (`0.98s`, `13%`).
    - With a special item slotted: a "FROM <ITEM NAME>" section in purple with its
      bonus row(s).
    - When short on parts or coins, a red line at the bottom, e.g. "Need 1 more Bone
      to craft" or "Need 12 more coins".

Stats are **fixed**, not ranges. This matches #448's hand-authored statlines.

## Layout — forge (phone)

Same content in one column, top to bottom:

- Header: chip, coins, X.
- Recipe card.
- Components: 4 across in a grid, name + have/need under each.
- Special row: slot, then the name and bonus text, e.g. "+5% Critical chance · tap
  to remove".
- The "You will craft" card, compact.
- The shortfall line and the Craft button at the bottom.

Touch targets are at least 44 px.

## Slots

- **Square.** The slot is the existing `pixelEmboss` (6 px ears, 6 px top lip).
  Size it so its full visual footprint is square: a box of W × (W + 6) renders as a
  (W + 12) square.
    - Component and special slots should reuse the `ICON_TILE` (56 px) footprint
      from #477, or an integer multiple of it, so they line up with every other item
      grid.
    - Sprites draw at native 32 px, or integer-scaled with
      `image-rendering: pixelated`.
- **Filled slot = rarity tint, no outline.** The item sprite sits bare on the slot:
  no white `LootIcon` face, no border, no notch clip. The slot's emboss fill and lip
  take a **light tint of the item's rarity colour**:

    | Rarity    | Colour (`colorForQuality`) | Emboss fill             | Emboss lip              |
    | --------- | -------------------------- | ----------------------- | ----------------------- |
    | common    | `#bbbbbb`                  | `rgba(187,187,187,.35)` | `rgba(120,120,120,.55)` |
    | fine      | `#00dd00`                  | `rgba(0,221,0,.18)`     | `rgba(0,150,0,.45)`     |
    | rare      | `#0077ff`                  | `rgba(0,119,255,.16)`   | `rgba(0,80,190,.45)`    |
    | epic      | `#9900ff`                  | `rgba(153,0,255,.16)`   | `rgba(110,0,190,.45)`   |
    | legendary | `#ff9900`                  | `rgba(255,153,0,.20)`   | `rgba(200,110,0,.50)`   |
    - Pass these through the existing `pixelEmbossVars({ rgb, a })` seam, or an
      equivalent pair of CSS vars.
    - Components are common. The recipe slot uses the rarity of the item the recipe
      makes. The special slot uses the special item's rarity.
    - Implement this as a `LootIcon` variant (e.g. `bare`) plus a slot wrapper, not a
      new icon component.

- **Empty slot**: the default emboss. The empty special slot uses a faint purple
  (`rgba(153,0,255,.08)`) so it reads as a distinct, optional slot.
- **Remove badge**: a 22 px red (`#ef4444`) square with a white pixel ✕, on the top
  right of a filled recipe or special slot. Tapping anywhere on the filled card or
  slot removes the item, the same as tap-to-unequip in `DroppableSlot`.

## Craft button

The `Button` atom (yellow `#ffc93e`). It uses the atom's own disabled style (grey,
`#444` text) whenever crafting isn't possible.

| State           | Label                        | Enabled |
| --------------- | ---------------------------- | ------- |
| No recipe       | "Choose a recipe"            | no      |
| Materials short | "Missing parts · N coins"    | no      |
| Coins short     | "Not enough coins · N coins" | no      |
| Ready           | "Craft · N coins"            | yes     |

- When materials and coins are both short, the button says "Missing parts · N coins".
- The "· N coins" suffix is the recipe's coin cost. It shows whenever a recipe is
  slotted, and is dimmed when the button is disabled.
- The state comes from the same `missingMaterials` / `coins` check the reducer uses.
  #448 already does this, so the UI can't disagree with `craftItem`.

## Pickers

**Recipe picker**

- Lists the player's **known recipes** (`state.game.recipes`). Each tile or row shows:
    - the recipe sprite in a slot tinted by the result's rarity;
    - the name, rarity and type;
    - a status: "Ready" (green) or "Missing parts" (red), computed with
      `missingMaterials`.
- Selecting an entry shows its details:
    - desktop: a right panel styled as an item tooltip, with its border in the
      result's rarity colour;
    - phone: a summary card.
- The details list **NEEDS** (have/need rows, green or red), **STATS** (fixed values)
  and the coin cost.
- **Use recipe** slots it into the forge and returns there.
- Locked recipes: see [Reconciling](#reconciling-with-step-4a-pr-448), point 1.

**Special item picker**

- Lists owned special items. Each shows a rarity-tinted slot, the name, the quantity
  owned, and on phone the bonus inline (e.g. "+5% Critical chance").
- The details panel shows the name, rarity, a one-line description and **ADDS TO
  ITEM** (the bonus rows, in purple).
- **Use item** is a purple (`#c9a3ff`) `Button` and returns to the forge.
- There is no "None" entry: clearing is done by tapping the filled special slot.

## Craft success

A full-panel overlay: black at 90% with white text, the same treatment as
`.dialogOverlay`. It has `role="status"`.

- **Animation** (CSS keyframes, pixel-stepped with `steps()`):
    - A pixel anvil with a glowing, hot blade on it.
    - A hammer swings down and strikes. On impact there's a short star-shaped flash
      and ~14 square sparks (4–6 px; `#fff3b0`, `#ffc93e`, `#ff9900`) fly out and
      fade.
    - The hot part of the blade pulses.
    - Plays **once** per craft; the mockup loops it for review.
- **Sound**: an anvil **clang** on the hammer's impact frame. See
  [Sound](#sound-first-audio-in-the-game).
- **Copy**:
    - "Crafted!"
    - the item's slot and name, then its stat line in green;
    - the special bonus in purple, e.g. "Critical chance +5% (Void Pearl)";
    - "Added to your inventory".
- **Buttons**:
    - **Craft another** (yellow) clears the recipe, the special item and the
      components, and returns to an empty forge.
    - **Done** (blue `#44bff7`) dismisses the overlay.
- **Reduced motion**: under `prefers-reduced-motion: reduce`, the sparks, flash and
  swing don't play; the hammer is drawn resting on the blade. The clang still plays
  unless sound is muted.

## Sound (first audio in the game)

The game has **no audio** today: no audio assets and no sound code. The clang is
its first sound effect, so it needs a small foundation built as its own PR:

- **SFX service**: play a named effect from React.
    - Recommended: route through Phaser's global `game.sound`. It keeps working while
      the town scene is paused behind the overlay, and a later in-world SFX would
      reuse it.
    - It honours a mute or volume setting.
- **Asset**: a short CC0/owned anvil hit, preloaded in `LoadScene`, with the licence
  noted beside the asset (as for the BoldPixels font).
- **Setting**: an SFX volume or mute toggle, added through the typed settings service
  (`settingsStorage`).
- **Autoplay**: the first craft always follows a user gesture (the Craft tap), so
  autoplay rules don't block it.

## Colours and type

- **Font**: BoldPixels (already global).
- **Panel**: `#e4f6f7` with its derived dark shadow. Text `#222`. Muted text is
  `#4d5d66`.
- **Title chip**: `#44bff7`, white text.
- **Primary button**: `#ffc93e`. Secondary (Done) `#44bff7`. The special item's
  **Use item** button is purple `#c9a3ff`.
- **Have/need and stat values**: green `#047857`, red `#b91c1c`.
    - These are darker than the Stat atom's `#10b981`/`#ef4444`, which don't reach
      4.5:1 contrast on the pale panel.
    - Changing the Stat atom globally is a separate decision; this screen uses the
      darker pair.
- **Special item accents** (labels, bonus rows): purple `#6a22b0` on the panel.

## Reconciling with Step 4a (PR #448)

**Kept from #448, unchanged by the Step 4a UI rework** (Step 4d would extend `craftItem`
if decision 2 below adds special items):

- the `Recipe`/`RecipeResult` types, the `RECIPES` catalog and `INITIAL_RECIPES`;
- the `recipes: string[]` save slice with its `loadGame` seeding;
- `craftItem` (all-or-nothing guard, smallest-stack-first consumption, fresh uuid);
- `componentTotal` / `missingMaterials` as the single source for have/need;
- the fixed statlines at the top of each quality band;
- the schematic unlock model and Steps 4b/4c (drops, shop).

**Changed by this spec** (the `Blacksmith.tsx` template and its CSS/tests):

- The recipe list plus details layout becomes the **forge line** plus the recipe
  picker.
- The component rows become **4 square slots** with name + have/need.
- The stats move into the "You will craft" card, formatted with `formatStatValue`.
  #448 prints the raw `+value`.
- The disabled reason moves onto the Craft button label and the card's shortfall
  line.
- The success overlay is new, and so is **Craft another**.

**Needs a maintainer decision before building**:

1. **Recipe quantity vs learnt recipes.**
    - The mockups showed recipe counts (e.g. "x2"), as if recipes were consumable
      items. #448's agreed model is learnt schematics: permanent and never consumed.
    - **Proposal**: keep the #448 model and drop the counts. The picker lists known
      recipes first, then locked ones as greyed "???" silhouettes that can't be
      selected. That keeps #448's "catalog reads as a collection".
2. **Special items: new system, not in #448.** They need:
    - an item type and catalog (id, name, sprite, rarity, bonus stat/value);
    - an owned-specials save slice (a save-format change);
    - a source: drops, Merchant stock or schematic-style rotation;
    - consumption on craft;
    - bonus rules: the bonus is appended to the crafted item's `stats`, or added to an
      existing stat of the same name.
    - **Proposal**: build as its own sub-step. Until then, the special slot is
      **hidden**, not shown disabled, so the forge ships complete without it.
3. **At most 4 materials per recipe.** The UI has 4 component slots. Every current
   recipe uses ≤ 3. Proposal: add a catalog test asserting
   `Object.keys(materials).length <= 4`.
4. **Sound foundation**: a new settings field and a new asset pipeline (see
   [Sound](#sound-first-audio-in-the-game)).
5. **Contrast colours**: the darker green/red pair on this screen only, or change the
   Stat atom everywhere.

## Proposed PR breakdown

| Step | PR                                                                                                                                                                          | Depends on        |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| 4a   | #448 (open), reworked to this layout: forge line, recipe picker, square rarity-tinted slots, button states, success overlay (no sound), Craft another. Special slot hidden. | decisions 1, 3, 5 |
| 4b   | Schematic drops (unchanged)                                                                                                                                                 | 4a                |
| 4c   | Schematic shop (unchanged)                                                                                                                                                  | 4a                |
| 4d   | Special items: catalog, save slice, source, special picker, bonus applied by `craftItem`, special slot shown                                                                | decision 2        |
| 4e   | SFX foundation + anvil clang on the craft impact frame                                                                                                                      | decision 4        |

## Test plan (UI)

- **Craft button**: its label and enabled state for every row of the
  [Craft button](#craft-button) table, including coins-short while materials are
  fine.
- **Slots**:
    - A recipe fills its component slots in catalog order, with names and have/need.
    - Unused slots render empty.
    - Clearing the recipe empties them.
- **have/need colour**: green at have ≥ need, red when short.
- **Tap to remove**: clears the recipe (and so the components); clears the special
  item.
- **Recipe picker**:
    - Lists only known recipes as selectable; "Use recipe" slots the selected one.
    - Ready/Missing status matches `missingMaterials`.
- **Success overlay**:
    - Appears after a successful `craftItem` and not on a refused one.
    - Craft another clears the forge; Done dismisses.
    - The overlay has `role="status"`.
- **Reduced motion**: the animation classes are inert under the media query
  (snapshot the computed `animation-name`, or assert the class toggle).
- **Lifecycle**: the success overlay's timers or audio are released on unmount. There
  are no Phaser listeners on this screen; if the SFX service subscribes to settings,
  it follows the `cleanup()` rules.
