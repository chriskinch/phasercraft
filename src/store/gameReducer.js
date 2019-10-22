import { createAction, createReducer } from 'redux-starter-kit'

const initState = {
    character: null,
    showUi: true,
    menu: "character",
    stats: {}
};

export const selectCharacter = createAction("SELECT_CHARACTER", character => ({
    payload: { character }
}));

export const switchUi = createAction("SWITCH_UI", menu => ({
    payload: { menu }
}));

export const toggleUi = createAction("TOGGLE_UI", menu => ({
    payload: { menu }
}));

export const updateStats = createAction("UPDATE_STATS", stats => ({
    payload: { stats }
}));

export const gameReducer = createReducer(initState, {
    [selectCharacter]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [switchUi]: (state, action) => ({ ...state, ...action.payload }),
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [updateStats]: (state, action) => ({ ...state, ...action.payload })
});