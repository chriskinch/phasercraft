import { createAction, createReducer } from "@reduxjs/toolkit"

// Init
const initState = {
    primed: null,
    disabled: [],
    list: {}
};

// Actions
export const listSpell = createAction("LIST_SPELL", spell => ({
    payload: { spell }
}));

export const clearSpell = createAction("CLEAR_SPELL", spell => ({
    payload: { spell }
}));

export const disableAllSpells = createAction("DISABLE_ALL_SPELLS");


export const disableSpell = createAction("DISABLE_SPELL", spell => ({
    payload: { spell }
}));

export const enableSpell = createAction("ENABLE_SPELL", spell => ({
    payload: { spell }
}));

export const primeSpell = createAction("PRIME_SPELL", spell => ({
    payload: { spell }
}));

export const removeCooldown = createAction("REMOVE_COOLDOWN", spell => ({
    payload: { spell }
}));

export const setCooldown = createAction("SET_COOLDOWN", (spell, time) => ({
    payload: { spell, time }
}));

// Reducers
export default createReducer(initState, {
    [clearSpell]: (state, action) => { state.list[action.payload.spell].primed = false },
    [enableSpell]: (state, action) => {
        state.list[action.payload.spell].cooldown = null
        state.list[action.payload.spell].disabled = false
    },
    [disableAllSpells]: state => { Object.keys(state.list).forEach(key => state.list[key].disabled = true) },
    [disableSpell]: (state, action) => {
        state.list[action.payload.spell].disabled = true
        state.list[action.payload.spell].primed = false
    },
    [listSpell]: (state, action) => { 
        state.list[action.payload.spell] = { primed: false, disabled: true, cooldown: false } },
    [primeSpell]: (state, action) => {
        Object.keys(state.list).forEach(key => state.list[key].primed = false)
        state.list[action.payload.spell].primed = true
    },
    [removeCooldown]: (state, action) => {
        state.list[action.payload.spell].cooldown = null
    },
    [setCooldown]: (state, action) => {
        state.list[action.payload.spell].cooldown = action.payload.time
        state.list[action.payload.spell].disabled = true
    }
});