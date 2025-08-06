import { createAction, createReducer, PayloadAction } from "@reduxjs/toolkit";
import mergeWith from "lodash/mergeWith";
import remove from "lodash/remove";
import pull from "lodash/pull";
import type { LootItem } from "@/types/game";
import type { PlayerType } from "@entities/Player/AssignClass";

// Types
interface Equipment {
    amulet: LootItem | null;
    body: LootItem | null;
    helm: LootItem | null;
    weapon: LootItem | null;
}

interface Level {
    xpRemaining: number;
    toNextLevel: number;
    currentLevel: number;
}

export interface GameState {
    character: PlayerType | null;
    showHUD: boolean;
    showUi: boolean;
    menu: string | undefined;
    base_stats: { [key: string]: any };
    stats: { [key: string]: any };
    level: Level;
    loot: LootItem[];
    filters: string[];
    inventory: LootItem[];
    equipment: Equipment;
    coins: number;
    crafting: any[];
    selected: LootItem | null;
    saveSlot: string | null;
    wave: number;
    xp: number;
}

// Init
const initState: GameState = {
    character: null,
    showHUD: false,
    showUi: false,
    menu: "save",
    base_stats: {},
    stats: {},
    level: {
        xpRemaining: 0,
        toNextLevel: 0,
        currentLevel: 1
    },
    loot: [],
    filters: [],
    inventory: [],
    equipment: {
        amulet: null,
        body: null,
        helm: null,
        weapon: null
    },
    coins: 999,
    crafting: [],
    selected: null,
    saveSlot: null,
    wave: 1,
    xp: 0,
};

// Actions
export const addCoins = createAction("ADD_COIN", (value: number) => ({
    payload: { value }
}));

export const addCrafting = createAction("ADD_CRAFTING", (key: string) => ({
    payload: { key }
}));

export const addLoot = createAction("ADD_LOOT", (id: string) => ({
    payload: { id }
}));

export const addXP = createAction("ADD_XP", (value: number) => ({
    payload: { value }
}));

export const buyLoot = createAction("BUY_LOOT", (loot: LootItem) => ({
    payload: { loot }
}));

export const equipLoot = createAction("EQUIP_LOOT", (loot: LootItem) => ({
    payload: { loot }
}));

export const loadGame = createAction("LOAD_GAME", (state: any) => ({
    payload: { state }
}));

export const nextWave = createAction("NEXT_WAVE");

export const selectCharacter = createAction("SELECT_CHARACTER", (character: any) => ({
    payload: { character }
}));

export const selectLoot = createAction("SELECT_LOOT", (loot: LootItem) => ({
    payload: { loot }
}));

export const sellLoot = createAction("SELL_LOOT", (loot: LootItem) => ({
    payload: { loot }
}));

export const setBaseStats = createAction("SET_BASE_STATS", (base_stats: { [key: string]: any }) => ({
    payload: { base_stats }
}));

export const setLevel = createAction("SET_LEVEL", (level: Level) => ({
    payload: { level }
}));

export const setSaveSlot = createAction("SET_SAVE_SLOT", (saveSlot: string) => ({
    payload: { saveSlot }
}));

export const setStats = createAction("SET_STATS", (stats: { [key: string]: any }) => ({
    payload: { stats }
}));

export const switchUi = createAction("SWITCH_UI", (menu: string) => ({
    payload: { menu }
}));

export const toggleFilter = createAction("TOGGLE_FILTER", (key: string) => ({
    payload: { key }
}));

export const toggleHUD = createAction("TOGGLE_HUD", (showHUD: boolean) => ({
    payload: { showHUD }
}));

export const toggleUi = createAction("TOGGLE_UI", (menu: string | undefined) => ({
    payload: { menu }
}));

export const unequipLoot = createAction("UNEQUIP_LOOT", (loot: LootItem) => ({
    payload: { loot }
}));

export const updateBaseStats = createAction("UPDATE_BASE_STATS", (base_stats: { [key: string]: any }) => ({
    payload: { base_stats }
}));

export const updateStats = createAction("UPDATE_STATS", (stats: { [key: string]: any }) => ({
    payload: { stats }
}));

// Helpers
const syncStats = (state: GameState) => state.stats = state.base_stats;

// Reducers
export const gameReducer = createReducer(initState, (builder) => {
    builder
        .addCase(addCoins, (state, action: PayloadAction<{ value: number }>) => { 
            state.coins += action.payload.value;
        })
        .addCase(addCrafting, (state, action: PayloadAction<{ key: string }>) => { 
            const { key } = action.payload;
            state.inventory.push({
                __typename: 'Item',
                id: Math.random().toString(),
                category: "crafting",
                color: "#bbbbbb",
                icon: key,
                set: "crafting",
                uuid: Math.random().toString(),
                stats: [],
                cost: 5,
                name: key
            });
        })
        .addCase(addLoot, (state, action: PayloadAction<{ id: string }>) => {
            const loot = state.loot[action.payload.id as any];
            state.inventory.push(loot);
        })
        .addCase(addXP, (state, action: PayloadAction<{ value: number }>) => { 
            state.xp += action.payload.value;
        })
        .addCase(buyLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot } = action.payload;
            remove(state.loot, l => l.id === loot.id);
            state.inventory.push(loot);
            state.coins -= loot.cost;
            state.selected = null;
        })
        .addCase(equipLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot, loot: { stats } } = action.payload;
            (state.equipment as any)[action.payload.loot.set] = loot;
            remove(state.inventory, l => l.id === loot.id);
            stats.map(s => state.base_stats[s.name] += s.value);
            syncStats(state);
        })
        .addCase(loadGame, (state, action: PayloadAction<{ state: any }>) => {
            return action.payload.state.game;
        })
        .addCase(nextWave, state => { 
            state.wave++;
        })
        .addCase(selectLoot, (state, action: PayloadAction<{ loot: LootItem }>) => { 
            state.selected = action.payload.loot;
        })
        .addCase(selectCharacter, (state, action: PayloadAction<{ character: any }>) => {
            return { ...state, showUi: false, ...action.payload };
        })
        .addCase(sellLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot } = action.payload;
            remove(state.inventory, l => l.id === loot.id);
            state.loot.push(loot);
            state.coins += Math.round(loot.cost/3);
            state.selected = null;
        })
        .addCase(setBaseStats, (state, action: PayloadAction<{ base_stats: { [key: string]: any } }>) => {
            state.base_stats = {...state.base_stats, ...action.payload.base_stats};
        })
        .addCase(setLevel, (state, action: PayloadAction<{ level: Level }>) => {
            return { ...state, ...action.payload };
        })
        .addCase(setSaveSlot, (state, action: PayloadAction<{ saveSlot: string }>) => {
            state.saveSlot = action.payload.saveSlot;
        })
        .addCase(setStats, (state, action: PayloadAction<{ stats: { [key: string]: any } }>) => {
            state.stats = {...state.stats, ...action.payload.stats};
        })
        .addCase(switchUi, (state, action: PayloadAction<{ menu: string }>) => {
            return { ...state, ...action.payload };
        })
        .addCase(toggleFilter, (state, action: PayloadAction<{ key: string }>) => {
            const { key } = action.payload;
            key ?
                state.filters.includes(key) ? pull(state.filters, key) : state.filters.push(key) :
                state.filters = [];
        })
        .addCase(toggleHUD, (state, action: PayloadAction<{ showHUD: boolean }>) => {
            return { ...state, ...action.payload };
        })
        .addCase(toggleUi, (state, action: PayloadAction<{ menu: string | undefined }>) => {
            return { ...state, showUi: !state.showUi, ...action.payload };
        })
        .addCase(unequipLoot, (state, action: PayloadAction<{ loot: LootItem }>) => {
            const { loot, loot: { stats } } = action.payload;
            (state.equipment as any)[loot.set] = null;
            state.inventory.push(loot);
            stats.map(s => state.base_stats[s.name] -= s.value);
            syncStats(state);
        })
        .addCase(updateStats, (state, action: PayloadAction<{ stats: { [key: string]: any } }>) => { 
            mergeWith(state.stats, action.payload.stats, (o: any, s: any) => o + s);
        });
});