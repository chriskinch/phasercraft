import { createAction, createReducer } from "redux-starter-kit"
import LootTable from "../Entities/Loot/LootTable"
import cloneDeep from "lodash/cloneDeep"
import findIndex from "lodash/findIndex"
import mergeWith from "lodash/mergeWith"
import pull from "lodash/pull"

// Init

const initState = {
    character: null,
    showUi: true,
    menu: "character",
    base_stats: {},
    stats: {},
    loot: [],
    inventory: [],
    equipment: {
        amulet: null,
        body: null,
        helm: null,
        weapon: null
    },
    coins: 999
};

// Actions
export const addCoins = createAction("ADD_COIN");

export const addLoot = createAction("ADD_LOOT", id => ({
    payload: { id }
}));

export const deductCoin = createAction("DEDUCT_COIN", cost => ({
    payload: { cost }
}));

export const equipLoot = createAction("EQUIP_LOOT", loot => ({
    payload: { loot }
}));

export const selectCharacter = createAction("SELECT_CHARACTER", character => ({
    payload: { character }
}));

export const setBaseStats = createAction("SET_BASE_STATS", base_stats => ({
    payload: { base_stats }
}));

export const setStats = createAction("SET_STATS", stats => ({
    payload: { stats }
}));

export const sortLoot = createAction("SORT_LOOT", (key, order) => ({
    payload: { key, order }
}));

export const switchUi = createAction("SWITCH_UI", menu => ({
    payload: { menu }
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

export const generateLootTable = createAction("UPDATE_LOOT_TABLE", quantity => ({
    payload: { quantity }
}));


// Helpers

const addStats = (stats, add) => mergeWith(stats, add, (o,s) => o+s);
const removeStats = (stats, add) => mergeWith(stats, add, (o,s) => o-s);
const syncStats = (state) => state.stats = state.base_stats;
const sortAscending = key => (a, b) => a[key] > b[key] ? 1 : -1;
const sortDecending = key => (a, b) => a[key] < b[key] ? 1 : -1;

// Reducers

export const gameReducer = createReducer(initState, {
    [addCoins]: state => { state.coins++ },
    [addLoot]: (state, action) => {
        const loot = state.loot[action.payload.id];
        pull(state.loot, loot);
        state.inventory.push(loot);
    },
    [deductCoin]: (state, action) => { state.coins -= action.payload.cost },
    [equipLoot]: (state, action) => {
        state.equipment[action.payload.loot.set] = cloneDeep(action.payload.loot);
        action.payload.loot.hide = true;
        addStats(state.base_stats, action.payload.loot.stats);
        syncStats(state);
    },
    [selectCharacter]: (state, action) => ({ ...state, showUi: false, ...action.payload }),
    [setBaseStats]: (state, action) => {state.base_stats = {...state.base_stats, ...action.payload.base_stats}},
    [setStats]: (state, action) => {state.stats = {...state.stats, ...action.payload.stats}},
    [sortLoot]: (state, action) => {
        const func = (action.payload.order === "ascending") ? sortAscending : sortDecending;
        const sorted = state.loot.slice().sort(func(action.payload.key));
        state.loot = sorted;
    },
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [unequipLoot]: (state, action) => {
        const check = action.payload.loot === state.equipment[action.payload.loot.set];
        if(check) {
            const index = findIndex(state.inventory, action.payload.loot);
            state.equipment[action.payload.loot.set] = null;
            state.inventory[index] = action.payload.loot;
            removeStats(state.base_stats, action.payload.loot.stats);
            syncStats(state);
        }
    },
    [updateStats]: (state, action) => {
        addStats(state.stats, action.payload.stats);
    },
    [generateLootTable]: (state, action) => {
        state.loot = new LootTable(action.payload.quantity).loot
    }
});