import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import mergeWith from "lodash/mergeWith";
import remove from "lodash/remove";
import pull from "lodash/pull";
import { v4 as uuid } from "uuid";
import type {
    LootItem,
    PlayerStats,
    ResourceStats,
    Equipment as GameEquipment,
    ComponentStack,
    ComponentType,
    Recipe,
    SpecialItem,
    SpellLevel,
    PassiveType,
} from "@/types/game";
import {
    COMPONENT_DEFS,
    INITIAL_RECIPES,
    componentBuyPrice,
    merchantWindow,
    merchantPartsBase,
    recipeById,
    specialById,
    SPECIAL_ITEMS,
    ABILITY_SLOTS,
    SCROLL_SELL_VALUE,
    SCROLL_MERGE_COUNT,
    SCROLL_DISPEL_COST,
    SPELL_LEVELS,
    SPELL_RECIPES,
    SPELL_TYPES,
} from "@/types/game";
import { CLASS_KITS, isKnownClass, isKnownSpell, isOnClass } from "@/lib/classKits";
import { appliedStatValue } from "@/lib/statConversion";
import { componentTotal, missingMaterials } from "@/lib/materials";
import { craftStatus, dispelStatus, dispelYield, tradeStatus } from "@/lib/spellCraft";
import { colorForQuality } from "@/lib/armoryClient";
import type { PlayerName } from "@entities/Player/AssignClass";
import type { SpellType } from "@entities/Spells/AssignSpell";
import type { BiomeId } from "@/scenes/biomes/biomes";

// Where the player has asked to travel. The React overlay writes it, the active
// Phaser scene reads it and clears it — the store is the only bridge between the
// two halves of the app. Temporary shape: the dedicated portal travel screen
// will replace the biome picker that sets it.
export type TravelDestination = BiomeId | "town";

interface Level {
    xpRemaining: number;
    toNextLevel: number;
    currentLevel: number;
}

// Ephemeral Merchant shop stock. Never persisted meaningfully (reset in loadGame,
// like enemiesRemaining/travelRequest) — "forgotten on reset". Two halves:
//  - Parts: a random base roll seeded by the wall-clock window (see
//    merchantPartsBase). `partsDelta` layers the run's net sells (+) and buys (-)
//    on top of that base; when the window rolls over it is wiped, so the sold and
//    bought counts are forgotten and stock returns to the fresh roll. Selling can
//    push a type's stock above MERCHANT_MAX_STOCK.
//  - Gear: `gearStock` is exactly the gear the player has sold this session. It is
//    NOT tied to the restock window — it lasts until the game is closed or reset.
export type MerchantMode = "buy" | "sell";

export interface MerchantState {
    // Which side of the shop is showing. Ephemeral UI state, but lives here because
    // the Buy/Sell toggle renders in the shared overlay header while the shop
    // contents render in the Merchant panel — Redux is the bridge between them.
    mode: MerchantMode;
    partsWindow: number;
    partsDelta: Partial<Record<ComponentType, number>>;
    gearStock: LootItem[];
}

const freshMerchant = (): MerchantState => ({
    mode: "buy",
    partsWindow: merchantWindow(Date.now()),
    partsDelta: {},
    gearStock: [],
});

// The Arcanum's header tabs (#582). Room for a later "fuse" tab (#583).
export const ARCANUM_TABS = ["merge", "craft"] as const;
export type ArcanumTab = (typeof ARCANUM_TABS)[number];

export interface GameState {
    character: PlayerName | null;
    showHUD: boolean;
    showUi: boolean;
    menu: string | undefined;
    previousMenu: string | undefined;
    base_stats: PlayerStats;
    stats: PlayerStats;
    level: Level;
    loot: LootItem[];
    filters: string[];
    inventory: LootItem[];
    components: ComponentStack[];
    // Ids of the Blacksmith recipes the player knows. Persisted: a learnt recipe
    // is permanent progress. Seeded with INITIAL_RECIPES; the rest are learnt
    // from schematics.
    recipes: string[];
    // Special items the player owns (Blacksmith Step 4d), id → count. Persisted.
    // A special at 0 is removed rather than kept as a zero entry.
    specials: Record<string, number>;
    equipment: GameEquipment;
    coins: number;
    selected: LootItem | null;
    saveSlot: string | null;
    // Progress through the current combat area. Both are ephemeral run state
    // (never persisted meaningfully) but live here because the Phaser HUD reads
    // them through `mapStateToData`.
    enemiesRemaining: number;
    bossActive: boolean;
    xp: number;
    currentArea: string;
    travelRequest: TravelDestination | null;
    playerPosition: { x: number; y: number };
    merchant: MerchantState;
    // Which Arcanum tab is showing. Ephemeral UI state (reset on load), in the
    // store for the same reason as `merchant.mode`: the tabs render in the header.
    arcanumTab: ArcanumTab;
    // Abilities (docs/specs/abilities-ui.md → Data model). All persisted.
    // Spells the player has learned, at their current level.
    learnedSpells: Partial<Record<SpellType, SpellLevel>>;
    // Unread scroll items, spell → level → count. A 0 count is removed (like
    // `specials`), and so is a spell with no scrolls left.
    scrolls: Partial<Record<SpellType, Partial<Record<SpellLevel, number>>>>;
    // Active slots, length ABILITY_SLOTS; index = HUD order. null = empty slot.
    abilityLoadout: (SpellType | null)[];
    // Passive slots, length ABILITY_SLOTS. Plumbing only: always all null.
    passiveLoadout: (PassiveType | null)[];
    // Spells whose Arcanum recipe the player has learnt by trading a scroll
    // (#580). Persisted; a new character knows none.
    spellRecipes: SpellType[];
}

export type ScrollStock = GameState["scrolls"];

type AbilitySlices = Pick<
    GameState,
    "learnedSpells" | "scrolls" | "abilityLoadout" | "passiveLoadout" | "spellRecipes"
>;

const emptySlots = (): null[] => Array.from({ length: ABILITY_SLOTS }, () => null);

// The abilities a character starts with: the class kit learned at L1 and slotted
// in kit order, remaining slots empty. Used for new characters and to migrate
// saves written before abilities were stored.
export const seedAbilities = (character: PlayerName | null): AbilitySlices => {
    const kit = isKnownClass(character) ? CLASS_KITS[character] : [];
    const learnedSpells: GameState["learnedSpells"] = {};
    const abilityLoadout: (SpellType | null)[] = emptySlots();
    kit.forEach((spell, i) => {
        learnedSpells[spell] = 1;
        if (i < ABILITY_SLOTS) abilityLoadout[i] = spell;
    });
    return {
        learnedSpells,
        scrolls: {},
        abilityLoadout,
        passiveLoadout: emptySlots(),
        spellRecipes: [],
    };
};

// God-mode starter scrolls for the current class, one of each reading state:
// 3× kit[0] L1 (already known → merge hint), kit[0] L2 (upgrade), kit[1] L3
// (upgrade to max) and 2× the first off-class spell (off-class hint).
export const starterScrolls = (character: PlayerName | null): GameState["scrolls"] => {
    if (!isKnownClass(character)) return {};
    const [first, second] = CLASS_KITS[character];
    const offClass = SPELL_TYPES.find((s) => !isOnClass(character, s));
    const scrolls: GameState["scrolls"] = {};
    if (first) scrolls[first] = { 1: 3, 2: 1 };
    if (second) scrolls[second] = { 3: 1 };
    if (offClass) scrolls[offClass] = { 1: 2 };
    return scrolls;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const isSpellLevel = (value: unknown): value is SpellLevel =>
    SPELL_LEVELS.includes(value as SpellLevel);

// Normalise the abilities slices of a loaded save. A field the save doesn't
// carry falls back to the character's seed; unknown spell ids, bad levels and
// non-positive counts are dropped; loadouts are forced to ABILITY_SLOTS length
// and only hold learned spells, each at most once. Never throws.
export const migrateAbilities = (
    character: PlayerName | null,
    loaded: Record<string, unknown>
): AbilitySlices => {
    const seed = seedAbilities(character);

    const learnedSpells: GameState["learnedSpells"] = {};
    if (isRecord(loaded.learnedSpells)) {
        for (const [spell, level] of Object.entries(loaded.learnedSpells)) {
            if (isKnownSpell(spell) && isSpellLevel(level)) learnedSpells[spell] = level;
        }
    } else {
        Object.assign(learnedSpells, seed.learnedSpells);
    }

    const scrolls: ScrollStock = {};
    if (isRecord(loaded.scrolls)) {
        for (const [spell, byLevel] of Object.entries(loaded.scrolls)) {
            if (!isKnownSpell(spell) || !isRecord(byLevel)) continue;
            const kept: Partial<Record<SpellLevel, number>> = {};
            for (const level of SPELL_LEVELS) {
                const count = byLevel[level];
                if (typeof count === "number" && Number.isInteger(count) && count > 0) {
                    kept[level] = count;
                }
            }
            if (Object.keys(kept).length > 0) scrolls[spell] = kept;
        }
    }

    const source: unknown[] = Array.isArray(loaded.abilityLoadout)
        ? loaded.abilityLoadout
        : seed.abilityLoadout;
    const abilityLoadout: (SpellType | null)[] = emptySlots();
    source.slice(0, ABILITY_SLOTS).forEach((spell, i) => {
        if (isKnownSpell(spell) && learnedSpells[spell] && !abilityLoadout.includes(spell)) {
            abilityLoadout[i] = spell;
        }
    });

    // Saves written before spell recipes (#580) know none; unknown ids and
    // duplicates are dropped.
    const spellRecipes: SpellType[] = [];
    if (Array.isArray(loaded.spellRecipes)) {
        for (const spell of loaded.spellRecipes) {
            if (isKnownSpell(spell) && !spellRecipes.includes(spell)) spellRecipes.push(spell);
        }
    }

    // No passives exist yet (PASSIVE_DEFS is empty), so every slot is empty.
    return { learnedSpells, scrolls, abilityLoadout, passiveLoadout: emptySlots(), spellRecipes };
};

const initState: GameState = {
    character: null,
    showHUD: false,
    showUi: false,
    menu: "save",
    previousMenu: undefined,
    base_stats: {} as PlayerStats,
    stats: {} as PlayerStats,
    level: {
        xpRemaining: 0,
        toNextLevel: 0,
        currentLevel: 1,
    },
    loot: [],
    filters: [],
    inventory: [],
    components: [],
    recipes: [...INITIAL_RECIPES],
    specials: {},
    equipment: {
        amulet: null,
        body: null,
        helm: null,
        weapon: null,
    },
    coins: 999,
    selected: null,
    saveSlot: null,
    enemiesRemaining: 0,
    bossActive: false,
    xp: 0,
    currentArea: "town",
    travelRequest: null,
    playerPosition: { x: 400, y: 300 },
    merchant: freshMerchant(),
    arcanumTab: "merge",
    ...seedAbilities(null),
};

export const addCoins = createAction("ADD_COIN", (value: number) => ({
    payload: { value },
}));

export const setCoins = createAction("SET_COINS", (value: number) => ({
    payload: { value },
}));

// The starter kit a new game gets when the Starter items setting is on: a
// testing aid for shop/craft flows. Replaces the purse, parts and specials.
export const STARTER_ITEMS = { coins: 10000, componentsEach: 100, specialsEach: 10 } as const;

export const grantStarterItems = createAction("GRANT_STARTER_ITEMS");

export const addComponent = createAction("ADD_COMPONENT", (type: ComponentType) => ({
    payload: { type },
}));

export const buyComponent = createAction("BUY_COMPONENT", (type: ComponentType) => ({
    payload: { type },
}));

// The Merchant UI dispatches this on open and whenever its countdown crosses a
// window boundary, passing the current wall-clock window. The reducer rolls the
// parts stock over — wiping the run's sold/bought counts — only when the window
// actually changes, so it is safe to call every tick.
export const refreshMerchant = createAction("REFRESH_MERCHANT", (window: number) => ({
    payload: { window },
}));

// Buy back a piece of gear the player previously sold to the Merchant.
export const buyGear = createAction("BUY_GEAR", (loot: LootItem) => ({
    payload: { loot },
}));

// Switch the Arcanum's header tab.
export const setArcanumTab = createAction("SET_ARCANUM_TAB", (tab: ArcanumTab) => ({
    payload: { tab },
}));

// Switch the Merchant between its Buy and Sell sides (the header toggle).
export const setMerchantMode = createAction("SET_MERCHANT_MODE", (mode: MerchantMode) => ({
    payload: { mode },
}));

export const sellComponent = createAction("SELL_COMPONENT", (stackId: string, count: number) => ({
    payload: { stackId, count },
}));

// `specialId` optionally slots one owned special item into the craft.
export const craftItem = createAction("CRAFT_ITEM", (recipeId: string, specialId?: string) => ({
    payload: { recipeId, specialId },
}));

export const addSpecial = createAction("ADD_SPECIAL", (id: string) => ({
    payload: { id },
}));

export const sellComponentStack = createAction("SELL_COMPONENT_STACK", (stackId: string) => ({
    payload: { stackId },
}));

export const addLoot = createAction("ADD_LOOT", (id: string) => ({
    payload: { id },
}));

export const addXP = createAction("ADD_XP", (value: number) => ({
    payload: { value },
}));

export const buyLoot = createAction("BUY_LOOT", (loot: LootItem) => ({
    payload: { loot },
}));

export const equipLoot = createAction("EQUIP_LOOT", (loot: LootItem) => ({
    payload: { loot },
}));

export const loadGame = createAction("LOAD_GAME", (state: Partial<GameState>) => ({
    payload: { state },
}));

export const setEnemiesRemaining = createAction("SET_ENEMIES_REMAINING", (value: number) => ({
    payload: { value },
}));

export const setBossActive = createAction("SET_BOSS_ACTIVE", (value: boolean) => ({
    payload: { value },
}));

export const selectCharacter = createAction("SELECT_CHARACTER", (character: PlayerName) => ({
    payload: { character },
}));

export const selectLoot = createAction("SELECT_LOOT", (loot: LootItem) => ({
    payload: { loot },
}));

export const sellLoot = createAction("SELL_LOOT", (loot: LootItem) => ({
    payload: { loot },
}));

export const setBaseStats = createAction(
    "SET_BASE_STATS",
    (base_stats: PlayerStats | Record<string, ResourceStats>) => ({
        payload: { base_stats },
    })
);

export const setLevel = createAction("SET_LEVEL", (level: Level) => ({
    payload: { level },
}));

export const setSaveSlot = createAction("SET_SAVE_SLOT", (saveSlot: string) => ({
    payload: { saveSlot },
}));

export const setStats = createAction(
    "SET_STATS",
    (stats: PlayerStats | Record<string, ResourceStats>) => ({
        payload: { stats },
    })
);

export const switchUi = createAction("SWITCH_UI", (menu: string) => ({
    payload: { menu },
}));

export const toggleFilter = createAction("TOGGLE_FILTER", (key: string) => ({
    payload: { key },
}));

export const toggleHUD = createAction("TOGGLE_HUD", (showHUD: boolean) => ({
    payload: { showHUD },
}));

export const toggleUi = createAction("TOGGLE_UI", (menu: string | undefined) => ({
    payload: { menu },
}));

export const unequipLoot = createAction("UNEQUIP_LOOT", (loot: LootItem) => ({
    payload: { loot },
}));

export const updateBaseStats = createAction(
    "UPDATE_BASE_STATS",
    (base_stats: Partial<PlayerStats>) => ({
        payload: { base_stats },
    })
);

export const updateStats = createAction("UPDATE_STATS", (stats: Partial<PlayerStats>) => ({
    payload: { stats },
}));

export const requestTravel = createAction("REQUEST_TRAVEL", (destination: TravelDestination) => ({
    payload: { destination },
}));

export const clearTravelRequest = createAction("CLEAR_TRAVEL_REQUEST");

export const setCurrentArea = createAction("SET_CURRENT_AREA", (area: string) => ({
    payload: { area },
}));

export const setPlayerPosition = createAction(
    "SET_PLAYER_POSITION",
    (position: { x: number; y: number }) => ({
        payload: { position },
    })
);

// Read one scroll: learn the spell at the scroll's level, or raise it to that
// level. Refused (no-op) when the spell is off-class, the player holds no such
// scroll, or the scroll is not above the spell's current level. A newly learned
// spell fills the first empty active slot — allowed anywhere, even mid-run.
export const readScroll = createAction("READ_SCROLL", (spell: SpellType, level: SpellLevel) => ({
    payload: { spell, level },
}));

// Pick up one scroll item (#385): it goes unread into `scrolls` at its level.
export const addScroll = createAction("ADD_SCROLL", (spell: SpellType, level: SpellLevel) => ({
    payload: { spell, level },
}));

// Put a learned spell in an active slot (or empty it with null). A spell sits
// in at most one slot: choosing one already slotted elsewhere swaps the two
// slots. Refused outside town (loadout changes are town-only).
export const equipAbility = createAction(
    "EQUIP_ABILITY",
    (slot: number, spell: SpellType | null) => ({
        payload: { slot, spell },
    })
);

// Sell `count` scrolls of a spell at a level (clamped to what is held).
export const sellScroll = createAction(
    "SELL_SCROLL",
    (spell: SpellType, level: SpellLevel, count: number) => ({
        payload: { spell, level, count },
    })
);

// Arcanum Merge (#386): 3 scrolls of a spell at one level → 1 of the next level.
// Off-class scrolls merge too. Refused outside town, at max level, or when fewer
// than 3 are held.
export const combineScrolls = createAction(
    "COMBINE_SCROLLS",
    (spell: SpellType, level: SpellLevel) => ({
        payload: { spell, level },
    })
);

// Arcanum crafting (#580). All town-only and all-or-nothing; the guards live in
// `src/lib/spellCraft.ts` so the Arcanum's buttons match.
// Trade 1 scroll (any level) to learn its spell's recipe.
export const tradeScroll = createAction("TRADE_SCROLL", (spell: SpellType, level: SpellLevel) => ({
    payload: { spell, level },
}));

// Craft 1 L1 scroll of a learnt recipe from its components, coins and special.
export const craftSpell = createAction("CRAFT_SPELL", (spell: SpellType) => ({
    payload: { spell },
}));

// Break 1 scroll of a learnt recipe into its components + special (×3 per level
// above L1) for a flat coin fee.
export const dispelScroll = createAction(
    "DISPEL_SCROLL",
    (spell: SpellType, level: SpellLevel) => ({
        payload: { spell, level },
    })
);

const giveScroll = (scrolls: ScrollStock, spell: SpellType, level: SpellLevel) => {
    const byLevel = scrolls[spell] ?? {};
    byLevel[level] = (byLevel[level] ?? 0) + 1;
    scrolls[spell] = byLevel;
};

// Remove `count` scrolls, dropping emptied level and spell entries.
const takeScrolls = (scrolls: ScrollStock, spell: SpellType, level: SpellLevel, count: number) => {
    const byLevel = scrolls[spell];
    if (!byLevel) return;
    const left = (byLevel[level] ?? 0) - count;
    if (left > 0) byLevel[level] = left;
    else delete byLevel[level];
    if (Object.keys(byLevel).length === 0) delete scrolls[spell];
};

const syncStats = (state: GameState) => (state.stats = state.base_stats);

// Add one component of `type` to the stacks: fill an existing non-full stack of
// that type before opening a new one; once every stack of the type is at
// stackMax, start a fresh stack (overflow → new stack). Shared by the loot
// pickup (addComponent) and the merchant purchase (buyComponent).
const stackComponent = (components: ComponentStack[], type: ComponentType) => {
    const def = COMPONENT_DEFS[type];
    const stack = components.find((s) => s.type === type && s.quantity < def.stackMax);
    if (stack) {
        stack.quantity += 1;
    } else {
        components.push({ id: Math.random().toString(), type, quantity: 1 });
    }
};

// Re-exported: the Blacksmith and its tests import them from the store.
export { componentTotal, missingMaterials };

// Spend `count` of `type` across the player's stacks, draining partial stacks
// first so the inventory compacts rather than leaving a trail of near-empty
// stacks. Emptied stacks are removed. Callers must have already checked the
// player holds enough (see `missingMaterials`).
const consumeComponent = (components: ComponentStack[], type: ComponentType, count: number) => {
    let left = count;
    // Smallest stacks first: drains the partials before breaking into a full one.
    const stacks = components
        .filter((s) => s.type === type)
        .sort((a, b) => a.quantity - b.quantity);
    for (const stack of stacks) {
        if (left <= 0) break;
        const taken = Math.min(stack.quantity, left);
        stack.quantity -= taken;
        left -= taken;
    }
    remove(components, (s) => s.type === type && s.quantity <= 0);
};

// Mint the finished gear for a recipe. The statline is fixed by the recipe, so
// only the identity is generated: a fresh uuid per craft keeps two copies of the
// same recipe distinct in the inventory (ids are how gear is selected, equipped
// and sold). `color` comes from the same quality→border mapping the Armory uses,
// so a crafted item sits beside a bought one without looking different.
// The recipe's fixed statline, plus the special's bonus when one is slotted:
// added to an existing stat of the same name, else appended.
export const craftedStats = (recipe: Recipe, special?: SpecialItem) => {
    const stats = recipe.result.stats.map((stat) => ({ ...stat }));
    if (special) {
        const existing = stats.find((stat) => stat.name === special.bonus.name);
        if (existing) existing.value += special.bonus.value;
        else stats.push({ ...special.bonus });
    }
    return stats;
};

const craftedItem = (recipe: Recipe, special?: SpecialItem): LootItem => {
    const { result } = recipe;
    const id = uuid();
    return {
        __typename: "Item",
        id,
        uuid: id,
        name: result.name,
        category: result.category,
        set: result.set,
        icon: result.icon,
        // A special adds its own worth, so the crafted item sells for more.
        cost: result.cost + (special?.cost ?? 0),
        color: colorForQuality(result.quality),
        stats: craftedStats(recipe, special).map((stat) => ({
            id: uuid(),
            name: stat.name,
            value: stat.value,
        })),
    };
};

export const gameReducer = createReducer(initState, (builder) => {
    builder
        .addCase(addCoins, (state, action: PayloadAction<{ value: number }>) => {
            state.coins += action.payload.value;
        })
        .addCase(setCoins, (state, action: PayloadAction<{ value: number }>) => {
            state.coins = action.payload.value;
        })
        .addCase(grantStarterItems, (state) => {
            state.coins = STARTER_ITEMS.coins;
            state.components = [];
            for (const type of Object.keys(COMPONENT_DEFS) as ComponentType[]) {
                for (let i = 0; i < STARTER_ITEMS.componentsEach; i++) {
                    stackComponent(state.components, type);
                }
            }
            state.specials = Object.fromEntries(
                SPECIAL_ITEMS.map((special) => [special.id, STARTER_ITEMS.specialsEach])
            );
            // Needs the class, so dispatch after selectCharacter (CharacterCard does).
            state.scrolls = starterScrolls(state.character);
            // Learn the first two kit spells' recipes so Craft/Dispel are
            // testable; the off-class starter scroll is left to Trade.
            state.spellRecipes = isKnownClass(state.character)
                ? CLASS_KITS[state.character].slice(0, 2)
                : [];
        })
        .addCase(addComponent, (state, action: PayloadAction<{ type: ComponentType }>) => {
            const { type } = action.payload;
            // Ignore unknown component types so a stray/corrupt name can't create a
            // stack with no definition (its stackMax/sellValue would be undefined).
            if (!COMPONENT_DEFS[type]) return;
            stackComponent(state.components, type);
        })
        .addCase(buyComponent, (state, action: PayloadAction<{ type: ComponentType }>) => {
            const { type } = action.payload;
            // Unknown types have no definition (and so no price) — ignore them.
            if (!COMPONENT_DEFS[type]) return;
            // The shop must actually hold one: base roll for the current window plus
            // the run's net delta. `partsWindow` is kept current by refreshMerchant,
            // so this stays pure (no Date.now() in the reducer).
            const stock =
                merchantPartsBase(state.merchant.partsWindow, type) +
                (state.merchant.partsDelta[type] ?? 0);
            if (stock <= 0) return;
            const price = componentBuyPrice(type);
            // Refuse the purchase if the player can't afford it, so coins never go
            // negative. The Merchant UI also disables the button, but the reducer is
            // the source of truth. (Stricter than buyLoot, which does not guard.)
            if (state.coins < price) return;
            state.coins -= price;
            // Buying removes one from the shop's stock for this window.
            state.merchant.partsDelta[type] = (state.merchant.partsDelta[type] ?? 0) - 1;
            stackComponent(state.components, type);
        })
        .addCase(setArcanumTab, (state, action: PayloadAction<{ tab: ArcanumTab }>) => {
            if (ARCANUM_TABS.includes(action.payload.tab)) state.arcanumTab = action.payload.tab;
        })
        .addCase(setMerchantMode, (state, action: PayloadAction<{ mode: MerchantMode }>) => {
            state.merchant.mode = action.payload.mode;
        })
        .addCase(refreshMerchant, (state, action: PayloadAction<{ window: number }>) => {
            const { window } = action.payload;
            // Only a genuine window change rolls the stock: wipe the run's net
            // sold/bought part counts so stock returns to the fresh random roll.
            if (window !== state.merchant.partsWindow) {
                state.merchant.partsWindow = window;
                state.merchant.partsDelta = {};
            }
        })
        .addCase(buyGear, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot } = action.payload;
            // Only gear the player actually sold to the Merchant is buyable back.
            if (!state.merchant.gearStock.some((l) => l.id === loot.id)) return;
            // No merchant margin on gear: the buy-back price is exactly the sell
            // refund (see sellLoot's `Math.round(loot.cost / 3)`).
            const price = Math.round(loot.cost / 3);
            if (state.coins < price) return;
            state.coins -= price;
            remove(state.merchant.gearStock, (l) => l.id === loot.id);
            // sellLoot also pushed it into the armory `loot` pool; keep them in sync.
            remove(state.loot, (l) => l.id === loot.id);
            state.inventory.push(loot);
        })
        .addCase(
            sellComponent,
            (state, action: PayloadAction<{ stackId: string; count: number }>) => {
                const { stackId, count } = action.payload;
                const stack = state.components.find((s) => s.id === stackId);
                if (!stack) return;
                // Clamp to what the stack actually holds; a non-positive count is a no-op.
                const sold = Math.min(Math.max(count, 0), stack.quantity);
                if (sold === 0) return;
                stack.quantity -= sold;
                state.coins += COMPONENT_DEFS[stack.type].sellValue * sold;
                // Selling raises the Merchant's stock for this window (can exceed
                // MERCHANT_MAX_STOCK; wiped when the window rolls over).
                state.merchant.partsDelta[stack.type] =
                    (state.merchant.partsDelta[stack.type] ?? 0) + sold;
                if (stack.quantity <= 0) remove(state.components, (s) => s.id === stackId);
            }
        )
        .addCase(addSpecial, (state, action: PayloadAction<{ id: string }>) => {
            const { id } = action.payload;
            // Unknown ids have no definition — ignore them, like addComponent.
            if (!specialById(id)) return;
            state.specials[id] = (state.specials[id] ?? 0) + 1;
        })
        .addCase(
            craftItem,
            (state, action: PayloadAction<{ recipeId: string; specialId?: string }>) => {
                const recipe = recipeById(action.payload.recipeId);
                // Unknown id, or a recipe the player has not learnt — neither can be
                // crafted. The Blacksmith only offers known recipes, but the reducer
                // is the source of truth (same stance as buyComponent).
                if (!recipe || !state.recipes.includes(recipe.id)) return;
                // Materials and coins are both all-or-nothing: refuse outright rather
                // than partially consuming, so a short craft can't eat the player's
                // components or push coins negative.
                if (Object.keys(missingMaterials(state.components, recipe)).length > 0) return;
                if (state.coins < recipe.coins) return;
                // A slotted special must be known and owned, or the whole craft is
                // refused — all-or-nothing, like materials and coins.
                const { specialId } = action.payload;
                const special = specialId ? specialById(specialId) : undefined;
                if (specialId && (!special || (state.specials[specialId] ?? 0) < 1)) return;

                for (const [type, count] of Object.entries(recipe.materials) as Array<
                    [ComponentType, number]
                >) {
                    consumeComponent(state.components, type, count);
                }
                state.coins -= recipe.coins;
                if (special) {
                    state.specials[special.id] -= 1;
                    if (state.specials[special.id] <= 0) delete state.specials[special.id];
                }
                state.inventory.push(craftedItem(recipe, special));
            }
        )
        .addCase(sellComponentStack, (state, action: PayloadAction<{ stackId: string }>) => {
            const { stackId } = action.payload;
            const stack = state.components.find((s) => s.id === stackId);
            if (!stack) return;
            state.coins += COMPONENT_DEFS[stack.type].sellValue * stack.quantity;
            state.merchant.partsDelta[stack.type] =
                (state.merchant.partsDelta[stack.type] ?? 0) + stack.quantity;
            remove(state.components, (s) => s.id === stackId);
        })
        .addCase(addLoot, (state, action: PayloadAction<{ id: string }>) => {
            const loot = state.loot.find((l) => l.id === action.payload.id);
            if (loot) {
                state.inventory.push(loot);
            }
        })
        .addCase(addXP, (state, action: PayloadAction<{ value: number }>) => {
            state.xp += action.payload.value;
        })
        .addCase(buyLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot } = action.payload;
            remove(state.loot, (l) => l.id === loot.id);
            state.inventory.push(loot);
            state.coins -= loot.cost;
            state.selected = null;
        })
        .addCase(equipLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const {
                loot,
                loot: { stats },
            } = action.payload;
            (state.equipment as Record<string, LootItem | null>)[action.payload.loot.set] = loot;
            remove(state.inventory, (l) => l.id === loot.id);
            stats.map((s) => {
                const current = state.base_stats[s.name];
                if (typeof current === "number") {
                    state.base_stats[s.name] = current + appliedStatValue(s.name, s.value);
                }
            });
            syncStats(state);
        })
        .addCase(loadGame, (state, action: PayloadAction<{ state: Partial<GameState> }>) => {
            // Migration: pre-overhaul saves stored components as individual
            // `crafting`-category LootItems inside `inventory`, plus a now-removed
            // `crafting` slice. Discard both (maintainer-confirmed) and guarantee the
            // new `components` slice exists. Only `category === "crafting"` items are
            // dropped, so gear is never touched. Never throws on a partial save.
            //
            // Migration: saves written before the wave mechanic was removed carry
            // a `wave` counter. Drop it and seed the area-progress fields, which
            // are run state that the scene overwrites on entry anyway.
            const loaded = action.payload.state as GameState & {
                crafting?: unknown;
                wave?: unknown;
            };
            const inventory = (loaded.inventory ?? []).filter(
                (item) => item.category !== "crafting"
            );
            delete loaded.crafting;
            delete loaded.wave;
            return {
                ...loaded,
                inventory,
                components: loaded.components ?? [],
                // Saves written before the Blacksmith carry no recipe list. Seed
                // them with the starters rather than an empty set, so an existing
                // character isn't locked out of crafting until a schematic drops.
                recipes: loaded.recipes ?? [...INITIAL_RECIPES],
                // Saves written before special items (Step 4d) own none.
                specials: loaded.specials ?? {},
                enemiesRemaining: loaded.enemiesRemaining ?? 0,
                bossActive: loaded.bossActive ?? false,
                // Transient: a request captured mid-save would teleport the
                // player on load.
                travelRequest: null,
                // Ephemeral shop stock — loading a save is a reset, so the
                // Merchant starts fresh rather than restoring any saved stock.
                merchant: freshMerchant(),
                arcanumTab: "merge",
                // Saves written before abilities get the class kit at L1 and the
                // kit loadout; unknown spell ids are dropped.
                ...migrateAbilities(
                    isKnownClass(loaded.character) ? loaded.character : null,
                    loaded as unknown as Record<string, unknown>
                ),
            } as GameState;
        })
        .addCase(setEnemiesRemaining, (state, action: PayloadAction<{ value: number }>) => {
            state.enemiesRemaining = action.payload.value;
        })
        .addCase(setBossActive, (state, action: PayloadAction<{ value: boolean }>) => {
            state.bossActive = action.payload.value;
        })
        .addCase(selectLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            state.selected = action.payload.loot;
        })
        .addCase(selectCharacter, (state, action: PayloadAction<{ character: PlayerName }>) => {
            const { character } = action.payload;
            // A different character means a new game: seed its class kit. Loading a
            // save dispatches loadGame and then selectCharacter with the same
            // character, so the loaded abilities are kept.
            const abilities = state.character !== character ? seedAbilities(character) : {};
            return { ...state, showUi: false, ...action.payload, ...abilities };
        })
        .addCase(
            readScroll,
            (state, action: PayloadAction<{ spell: SpellType; level: SpellLevel }>) => {
                const { spell, level } = action.payload;
                if (!isKnownSpell(spell) || !isSpellLevel(level)) return;
                if (!isOnClass(state.character, spell)) return;
                if ((state.scrolls[spell]?.[level] ?? 0) < 1) return;
                const current = state.learnedSpells[spell];
                if (current !== undefined && level <= current) return;

                state.learnedSpells[spell] = level;
                takeScrolls(state.scrolls, spell, level, 1);
                if (current === undefined && !state.abilityLoadout.includes(spell)) {
                    const empty = state.abilityLoadout.indexOf(null);
                    if (empty !== -1) state.abilityLoadout[empty] = spell;
                }
            }
        )
        .addCase(
            addScroll,
            (state, action: PayloadAction<{ spell: SpellType; level: SpellLevel }>) => {
                const { spell, level } = action.payload;
                // Unknown spells or levels have no scroll — ignore them, like addSpecial.
                if (!isKnownSpell(spell) || !isSpellLevel(level)) return;
                giveScroll(state.scrolls, spell, level);
            }
        )
        .addCase(
            equipAbility,
            (state, action: PayloadAction<{ slot: number; spell: SpellType | null }>) => {
                const { slot, spell } = action.payload;
                if (state.currentArea !== "town") return;
                if (!Number.isInteger(slot) || slot < 0 || slot >= ABILITY_SLOTS) return;
                if (spell === null) {
                    state.abilityLoadout[slot] = null;
                    return;
                }
                if (!state.learnedSpells[spell]) return;
                const from = state.abilityLoadout.indexOf(spell);
                // Swap: the slot's previous occupant (or empty) moves to where the
                // spell was.
                if (from !== -1) state.abilityLoadout[from] = state.abilityLoadout[slot];
                state.abilityLoadout[slot] = spell;
            }
        )
        .addCase(
            sellScroll,
            (
                state,
                action: PayloadAction<{ spell: SpellType; level: SpellLevel; count: number }>
            ) => {
                const { spell, level, count } = action.payload;
                if (!isSpellLevel(level)) return;
                // NaN/Infinity would slip past the clamp and corrupt coins.
                if (!Number.isFinite(count)) return;
                const held = state.scrolls[spell]?.[level] ?? 0;
                // Clamp to what is held; a non-positive count is a no-op.
                const sold = Math.min(Math.max(Math.floor(count), 0), held);
                if (sold === 0) return;
                takeScrolls(state.scrolls, spell, level, sold);
                state.coins += SCROLL_SELL_VALUE[level] * sold;
            }
        )
        .addCase(
            combineScrolls,
            (state, action: PayloadAction<{ spell: SpellType; level: SpellLevel }>) => {
                const { spell, level } = action.payload;
                if (state.currentArea !== "town") return;
                if (!isKnownSpell(spell) || !isSpellLevel(level)) return;
                const next = level + 1;
                if (!isSpellLevel(next)) return;
                if ((state.scrolls[spell]?.[level] ?? 0) < SCROLL_MERGE_COUNT) return;
                takeScrolls(state.scrolls, spell, level, SCROLL_MERGE_COUNT);
                giveScroll(state.scrolls, spell, next);
            }
        )
        .addCase(
            tradeScroll,
            (state, action: PayloadAction<{ spell: SpellType; level: SpellLevel }>) => {
                const { spell, level } = action.payload;
                if (state.currentArea !== "town") return;
                if (!isKnownSpell(spell) || !isSpellLevel(level)) return;
                if (!tradeStatus(state, spell, level).enabled) return;
                takeScrolls(state.scrolls, spell, level, 1);
                state.spellRecipes.push(spell);
            }
        )
        .addCase(craftSpell, (state, action: PayloadAction<{ spell: SpellType }>) => {
            const { spell } = action.payload;
            if (state.currentArea !== "town") return;
            if (!isKnownSpell(spell)) return;
            if (!craftStatus(state, spell).enabled) return;
            const recipe = SPELL_RECIPES[spell];
            for (const [type, count] of Object.entries(recipe.materials) as Array<
                [ComponentType, number]
            >) {
                consumeComponent(state.components, type, count);
            }
            state.coins -= recipe.coins;
            state.specials[recipe.special] -= 1;
            if (state.specials[recipe.special] <= 0) delete state.specials[recipe.special];
            giveScroll(state.scrolls, spell, 1);
        })
        .addCase(
            dispelScroll,
            (state, action: PayloadAction<{ spell: SpellType; level: SpellLevel }>) => {
                const { spell, level } = action.payload;
                if (state.currentArea !== "town") return;
                if (!isKnownSpell(spell) || !isSpellLevel(level)) return;
                if (!dispelStatus(state, spell, level).enabled) return;
                takeScrolls(state.scrolls, spell, level, 1);
                state.coins -= SCROLL_DISPEL_COST;
                const { materials, special, specials } = dispelYield(spell, level);
                for (const [type, count] of Object.entries(materials) as Array<
                    [ComponentType, number]
                >) {
                    for (let i = 0; i < count; i++) stackComponent(state.components, type);
                }
                state.specials[special] = (state.specials[special] ?? 0) + specials;
            }
        )
        .addCase(sellLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot } = action.payload;
            remove(state.inventory, (l) => l.id === loot.id);
            state.loot.push(loot);
            // Sold gear becomes buyable back from the Merchant for the rest of the
            // session (gear stock is not tied to the parts restock window).
            state.merchant.gearStock.push(loot);
            state.coins += Math.round(loot.cost / 3);
            state.selected = null;
        })
        .addCase(
            setBaseStats,
            (
                state,
                action: PayloadAction<{ base_stats: PlayerStats | Record<string, ResourceStats> }>
            ) => {
                state.base_stats = {
                    ...state.base_stats,
                    ...(action.payload.base_stats as Partial<PlayerStats>),
                };
            }
        )
        .addCase(setLevel, (state, action: PayloadAction<{ level: Level }>) => {
            return { ...state, ...action.payload };
        })
        .addCase(setSaveSlot, (state, action: PayloadAction<{ saveSlot: string }>) => {
            state.saveSlot = action.payload.saveSlot;
        })
        .addCase(
            setStats,
            (
                state,
                action: PayloadAction<{ stats: PlayerStats | Record<string, ResourceStats> }>
            ) => {
                state.stats = { ...state.stats, ...(action.payload.stats as Partial<PlayerStats>) };
            }
        )
        .addCase(switchUi, (state, action: PayloadAction<{ menu: string }>) => {
            // Record where we navigated from so a screen's close button can send
            // the player back to the previous screen instead of closing the UI.
            return { ...state, previousMenu: state.menu, ...action.payload };
        })
        .addCase(toggleFilter, (state, action: PayloadAction<{ key: string }>) => {
            const { key } = action.payload;
            key
                ? state.filters.includes(key)
                    ? pull(state.filters, key)
                    : state.filters.push(key)
                : (state.filters = []);
        })
        .addCase(toggleHUD, (state, action: PayloadAction<{ showHUD: boolean }>) => {
            return { ...state, ...action.payload };
        })
        .addCase(toggleUi, (state, action: PayloadAction<{ menu: string | undefined }>) => {
            return { ...state, showUi: !state.showUi, ...action.payload };
        })
        .addCase(unequipLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const {
                loot,
                loot: { stats },
            } = action.payload;
            (state.equipment as Record<string, LootItem | null>)[loot.set] = null;
            state.inventory.push(loot);
            stats.map((s) => {
                const current = state.base_stats[s.name];
                if (typeof current === "number") {
                    state.base_stats[s.name] = current - appliedStatValue(s.name, s.value);
                }
            });
            syncStats(state);
        })
        .addCase(updateStats, (state, action: PayloadAction<{ stats: Partial<PlayerStats> }>) => {
            mergeWith(state.stats, action.payload.stats, (o: number, s: number) => o + s);
        })
        .addCase(
            requestTravel,
            (state, action: PayloadAction<{ destination: TravelDestination }>) => {
                state.travelRequest = action.payload.destination;
            }
        )
        .addCase(clearTravelRequest, (state) => {
            state.travelRequest = null;
        })
        .addCase(setCurrentArea, (state, action: PayloadAction<{ area: string }>) => {
            state.currentArea = action.payload.area;
        })
        .addCase(
            setPlayerPosition,
            (state, action: PayloadAction<{ position: { x: number; y: number } }>) => {
                state.playerPosition = action.payload.position;
            }
        );
});
