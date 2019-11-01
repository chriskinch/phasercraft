import { createAction, createReducer } from "redux-starter-kit"
import cloneDeep from "lodash/cloneDeep"
import findIndex from "lodash/findIndex"
import mergeWith from "lodash/mergeWith"

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
    }
};

// Actions

export const addLoot = createAction("ADD_LOOT", loot => ({
    payload: { loot }
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

export const updateLootTable = createAction("UPDATE_LOOT_TABLE", loot => ({
    payload: { loot }
}));

export const syncStats = createAction("SYNC_STATS", stats => ({
    payload: { stats }
}));

// Helpers

const addStats = (stats, add) => mergeWith(stats, add, (o,s) => o+s);
const removeStats = (stats, add) => mergeWith(stats, add, (o,s) => o-s);

// Reducers

export const gameReducer = createReducer(initState, {
    [addLoot]: (state, action) => { state.inventory.push(action.payload.loot) },
    [equipLoot]: (state, action) => {
        state.equipment[action.payload.loot.set] = cloneDeep(action.payload.loot);
        action.payload.loot.hide = true;
        addStats(state.base_stats, action.payload.loot.stats);
    },
    [selectCharacter]: (state, action) => ({ ...state, showUi: false, ...action.payload }),
    [setBaseStats]: (state, action) => {state.base_stats = {...state.base_stats, ...action.payload.base_stats}},
    [setStats]: (state, action) => {state.stats = {...state.stats, ...action.payload.stats}},
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [unequipLoot]: (state, action) => {
        const check = action.payload.loot === state.equipment[action.payload.loot.set];
        if(check) {
            const index = findIndex(state.inventory, action.payload.loot);
            state.equipment[action.payload.loot.set] = null;
            removeStats(state.base_stats, action.payload.loot.stats);
            state.inventory[index] = action.payload.loot;
        }
    },
    [updateStats]: (state, action) => {
        addStats(state.stats, action.payload.stats);
        // mergeWith(state.base_stats, action.payload.base_stats, (ov, sv) => {
        //     return ov + sv;
        // });
    },
    [updateLootTable]: (state, action) => ({ ...state, ...action.payload })
});