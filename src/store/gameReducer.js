import { createAction, createReducer } from "@reduxjs/toolkit"
import mergeWith from "lodash/mergeWith"
import remove from "lodash/remove"
import pull from "lodash/pull"

// Init
const initState = {
    character: null,
    showHUD: false,
    showUi: false,
    menu: "save",
    base_stats: {},
    stats: {},
    level: {},
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
export const addCoins = createAction("ADD_COIN", value => ({
    payload: { value }
}));

export const addCrafting = createAction("ADD_CRAFTING", key => ({
    payload: { key }
}));

export const addLoot = createAction("ADD_LOOT", id => ({
    payload: { id }
}));

export const addXP = createAction("ADD_XP", value => ({
    payload: { value }
}));

export const buyLoot = createAction("BUY_LOOT", loot => ({
    payload: { loot }
}));

export const equipLoot = createAction("EQUIP_LOOT", loot => ({
    payload: { loot }
}));

export const loadGame = createAction("LOAD_GAME", state => ({
    payload: { state }
}));

export const nextWave = createAction("NEXT_WAVE");

export const selectCharacter = createAction("SELECT_CHARACTER", character => ({
    payload: { character }
}));

export const selectLoot = createAction("SELECT_LOOT", (id) => ({
    payload: { id }
}));

export const sellLoot = createAction("SELL_LOOT", loot => ({
    payload: { loot }
}));

export const setBaseStats = createAction("SET_BASE_STATS", base_stats => ({
    payload: { base_stats }
}));

export const setLevel = createAction("SET_LEVEL", level => ({
    payload: { level }
}));

export const setSaveSlot = createAction("SET_SAVE_SLOT", saveSlot => ({
    payload: { saveSlot }
}));

export const setStats = createAction("SET_STATS", stats => ({
    payload: { stats }
}));

export const switchUi = createAction("SWITCH_UI", menu => ({
    payload: { menu }
}));

export const toggleFilter = createAction("TOGGLE_FILTER", key => ({
    payload: { key }
}));

export const toggleHUD = createAction("TOGGLE_HUD", showHUD => ({
    payload: { showHUD }
}));

export const toggleUi = createAction("TOGGLE_UI", menu => ({
    payload: { menu }
}));

export const unequipLoot = createAction("UNEQUIP_LOOT", loot => ({
    payload: { loot }
}));

export const updateBaseStats = createAction("UPDATE_BASE_STATS", base_stats => ({
    payload: { base_stats }
}));

export const updateStats = createAction("UPDATE_BASE_STATS", stats => ({
    payload: { stats }
}));


// Helpers

const syncStats = (state) => state.stats = state.base_stats;

// Reducers

export const gameReducer = createReducer(initState, {
    [addCoins]: (state, action) => { state.coins += action.payload.value },
    [addCrafting]: (state, action) => { 
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
        })
    },
    [addLoot]: (state, action) => {
        const loot = state.loot[action.payload.id];
        state.inventory.push(loot);
    },
    [addXP]: (state, action) => { state.xp += action.payload.value },
    [buyLoot]: (state, action) => {
        const { loot } = action.payload;
        remove(state.loot, l => l.id === loot.id);
        state.inventory.push(loot);
        state.coins -= loot.cost
        state.selected = null;
    },
    [equipLoot]: (state, action) => {
        const { loot, loot:{ stats } } = action.payload;
        state.equipment[action.payload.loot.set] = loot;
        remove(state.inventory, l => l.id === loot.id);
        stats.map(s => state.base_stats[s.name] += s.value);
        syncStats(state);
    },
    [loadGame]: (state, action) => action.payload.state,
    [nextWave]: state => { state.wave++ },
    [selectLoot]: (state, action) => { state.selected = action.payload.id },
    [selectCharacter]: (state, action) => ({ ...state, showUi: false, ...action.payload }),
    [sellLoot]: (state, action) => {
        const { loot } = action.payload;
        remove(state.inventory, l => l.id === loot.id);
        state.loot.push(loot);
        state.coins += Math.round(loot.cost/3);
        state.selected = null;
    },
    [setBaseStats]: (state, action) => {state.base_stats = {...state.base_stats, ...action.payload.base_stats}},
    [setLevel]: (state, action) => ({ ...state, ...action.payload }),
    [setSaveSlot]: (state, action) => {state.saveSlot = action.payload.saveSlot},
    [setStats]: (state, action) => {state.stats = {...state.stats, ...action.payload.stats}},
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleFilter]: (state, action) => {
        const { key } = action.payload;
        key ?
            state.filters.includes(key) ? pull(state.filters, key) : state.filters.push(key) :
            state.filters = [];
    },
    [toggleHUD]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [unequipLoot]: (state, action) => {
        const { loot, loot:{ stats } } = action.payload;
        state.equipment[loot.set] = null;
        state.inventory.push(loot);
        stats.map(s => state.base_stats[s.name] -= s.value);
        syncStats(state);
    },
    [updateStats]: (state, action) => { mergeWith(state.stats, action.payload.stats, (o,s) => o+s) }
});