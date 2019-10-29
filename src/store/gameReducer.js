import { createAction, createReducer } from "redux-starter-kit"
import cloneDeep from "lodash/cloneDeep"
import findIndex from "lodash/findIndex"

const initState = {
    character: null,
    showUi: true,
    menu: "character",
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

export const switchUi = createAction("SWITCH_UI", menu => ({
    payload: { menu }
}));

export const toggleUi = createAction("TOGGLE_UI", menu => ({
    payload: { menu }
}));

export const unequipLoot = createAction("UNEQUIP_LOOT", loot => ({
    payload: { loot }
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
        action.payload.loot.hide = true;
    },
    [selectCharacter]: (state, action) => ({ ...state, showUi: false, ...action.payload }),
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [unequipLoot]: (state, action) => {
        const check = action.payload.loot === state.equipment[action.payload.loot.set];
        if(check) {
            const index = findIndex(state.inventory, action.payload.loot);
            state.equipment[action.payload.loot.set] = null;
            state.inventory[index] = action.payload.loot;
        }
    },
    [updateLootTable]: (state, action) => ({ ...state, ...action.payload }),
    [updateStats]: (state, action) => ({ ...state, ...action.payload })
});