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
import { COMPONENT_DEFS } from "@/types/game";
import type { PlayerName } from "@entities/Player/AssignClass";

// Types

interface Level {
    xpRemaining: number;
    toNextLevel: number;
    currentLevel: number;
}

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
    wave: number;
    xp: number;
    currentArea: string;
    playerPosition: { x: number; y: number };
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
    wave: 1,
    xp: 0,
    currentArea: "town",
    playerPosition: { x: 400, y: 300 },
};

// Actions
export const addCoins = createAction("ADD_COIN", (value: number) => ({
    payload: { value },
}));

export const addComponent = createAction("ADD_COMPONENT", (type: ComponentType) => ({
    payload: { type },
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

export const nextWave = createAction("NEXT_WAVE");

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

// Reducers
export const gameReducer = createReducer(initState, (builder) => {
    builder
        .addCase(addCoins, (state, action: PayloadAction<{ value: number }>) => {
            state.coins += action.payload.value;
        })
        .addCase(addComponent, (state, action: PayloadAction<{ type: ComponentType }>) => {
            const { type } = action.payload;
            const def = COMPONENT_DEFS[type];
            // Ignore unknown component types so a stray/corrupt name can't create a
            // stack with no definition (its stackMax/sellValue would be undefined).
            if (!def) return;
            // Fill an existing non-full stack of this type before opening a new one;
            // once every stack of the type is at stackMax, the pickup starts a fresh
            // stack (overflow → new stack).
            const stack = state.components.find(
                (s) => s.type === type && s.quantity < def.stackMax
            );
            if (stack) {
                stack.quantity += 1;
            } else {
                state.components.push({ id: Math.random().toString(), type, quantity: 1 });
            }
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
                if (stack.quantity <= 0) remove(state.components, (s) => s.id === stackId);
            }
        )
        .addCase(sellComponentStack, (state, action: PayloadAction<{ stackId: string }>) => {
            const { stackId } = action.payload;
            const stack = state.components.find((s) => s.id === stackId);
            if (!stack) return;
            state.coins += COMPONENT_DEFS[stack.type].sellValue * stack.quantity;
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
                    state.base_stats[s.name] = current + s.value;
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
            const loaded = action.payload.state as GameState & { crafting?: unknown };
            const inventory = (loaded.inventory ?? []).filter(
                (item) => item.category !== "crafting"
            );
            delete loaded.crafting;
            return { ...loaded, inventory, components: loaded.components ?? [] } as GameState;
        })
        .addCase(nextWave, (state) => {
            state.wave++;
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
                    state.base_stats[s.name] = current - s.value;
                }
            });
            syncStats(state);
        })
        .addCase(updateStats, (state, action: PayloadAction<{ stats: Partial<PlayerStats> }>) => {
            mergeWith(state.stats, action.payload.stats, (o: number, s: number) => o + s);
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
