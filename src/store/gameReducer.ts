import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import mergeWith from "lodash/mergeWith";
import remove from "lodash/remove";
import pull from "lodash/pull";
import type {
    LootItem,
    PlayerStats,
    ResourceStats,
    Equipment as GameEquipment,
    ComponentStack,
    ComponentType,
} from "@/types/game";
import { COMPONENT_DEFS, componentBuyPrice, merchantWindow, merchantPartsBase } from "@/types/game";
import { appliedStatValue } from "@/lib/statConversion";
import type { PlayerName } from "@entities/Player/AssignClass";
import type { BiomeId } from "@/scenes/biomes/biomes";

// Where the player has asked to travel. The React overlay writes it, the active
// Phaser scene reads it and clears it — the store is the only bridge between the
// two halves of the app. Temporary shape: the dedicated portal travel screen
// will replace the biome picker that sets it.
export type TravelDestination = BiomeId | "town";

// Types

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
export interface MerchantState {
    partsWindow: number;
    partsDelta: Partial<Record<ComponentType, number>>;
    gearStock: LootItem[];
}

const freshMerchant = (): MerchantState => ({
    partsWindow: merchantWindow(Date.now()),
    partsDelta: {},
    gearStock: [],
});

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
}

// Init
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
};

// Actions
export const addCoins = createAction("ADD_COIN", (value: number) => ({
    payload: { value },
}));

export const setCoins = createAction("SET_COINS", (value: number) => ({
    payload: { value },
}));

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

export const sellComponent = createAction("SELL_COMPONENT", (stackId: string, count: number) => ({
    payload: { stackId, count },
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

// Helpers
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

// Reducers
export const gameReducer = createReducer(initState, (builder) => {
    builder
        .addCase(addCoins, (state, action: PayloadAction<{ value: number }>) => {
            state.coins += action.payload.value;
        })
        .addCase(setCoins, (state, action: PayloadAction<{ value: number }>) => {
            state.coins = action.payload.value;
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
                enemiesRemaining: loaded.enemiesRemaining ?? 0,
                bossActive: loaded.bossActive ?? false,
                // Transient: a request captured mid-save would teleport the
                // player on load.
                travelRequest: null,
                // Ephemeral shop stock — loading a save is a reset, so the
                // Merchant starts fresh rather than restoring any saved stock.
                merchant: freshMerchant(),
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
            return { ...state, showUi: false, ...action.payload };
        })
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
