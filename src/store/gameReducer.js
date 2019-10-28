import { createAction, createReducer } from 'redux-starter-kit'

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

export const updateLootTable = createAction("UPDATE_LOOT_TABLE", loot => ({
    payload: { loot }
}));

export const updateStats = createAction("UPDATE_STATS", stats => ({
    payload: { stats }
}));

export const gameReducer = createReducer(initState, {
    [addLoot]: (state, action) => { state.inventory.push(action.payload.loot) },
    [equipLoot]: (state, action) => { state.equipment[action.payload.loot.set] = action.payload.loot },
    [selectCharacter]: (state, action) => ({ ...state, showUi: false, ...action.payload }),
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [updateLootTable]: (state, action) => ({ ...state, ...action.payload }),
    [updateStats]: (state, action) => ({ ...state, ...action.payload })
});