import { createAction, createReducer } from "redux-starter-kit"
import cloneDeep from "lodash/cloneDeep"
import findIndex from "lodash/findIndex"
import mergeWith from "lodash/mergeWith"

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

export const updateBaseStats = createAction("UPDATE_BASE_STATS", stats => ({
    payload: { stats }
}));

export const updateLootTable = createAction("UPDATE_LOOT_TABLE", loot => ({
    payload: { loot }
}));

export const updateStats = createAction("UPDATE_STATS", stats => ({
    payload: { stats }
}));


export const gameReducer = createReducer(initState, {
    [addLoot]: (state, action) => { state.inventory.push(action.payload.loot) },
    [equipLoot]: (state, action) => {
        state.equipment[action.payload.loot.set] = cloneDeep(action.payload.loot);
        mergeWith(state.stats, action.payload.loot.stats, (ov, sv) => {
            return ov + sv;
        });
        action.payload.loot.hide = true;
    },
    [selectCharacter]: (state, action) => ({ ...state, showUi: false, ...action.payload }),
    [setBaseStats]: (state, action) => ({ ...state, ...action.payload }),
    [setStats]: (state, action) => ({ ...state, ...action.payload }),
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [unequipLoot]: (state, action) => {
        const check = action.payload.loot === state.equipment[action.payload.loot.set];
        if(check) {
            const index = findIndex(state.inventory, action.payload.loot);
            state.equipment[action.payload.loot.set] = null;
            mergeWith(state.stats, action.payload.loot.stats, (ov, sv) => {
                return ov - sv;
            });
            state.inventory[index] = action.payload.loot;
        }
    },
    [updateLootTable]: (state, action) => ({ ...state, ...action.payload }),
    [updateBaseStats]: (state, action) => {
        mergeWith(state.stats, action.payload.stats, (ov, sv) => {
            return ov + sv;
        });
    },
    [updateStats]: (state, action) => ({ ...state, ...action.payload })
});