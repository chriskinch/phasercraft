import { createAction, createReducer } from 'redux-starter-kit'

const initState = {
    showUi: true,
    menu: "character",
    stats: {}
};

export const toggleUi = createAction("TOGGLE_UI", character => ({
    payload: character
}));

export const updateStats = createAction("UPDATE_STATS", stats => ({
    payload: { stats }
}));

export const gameReducer = createReducer(initState, {
    [toggleUi]: (state, action) => ({ ...state, showUi: !state.showUi, ...action.payload }),
    [updateStats]: (state, action) => ({ ...state, ...action.payload })
});