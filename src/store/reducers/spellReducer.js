import { createAction, createReducer } from "@reduxjs/toolkit"
import remove from "lodash/remove"

// Init
const initState = {
    primed: null,
    disabled: []
};

// Actions
export const clearSpell = createAction("CLEAR_SPELL");

export const disableSpell = createAction("DISABLE_SPELL", spell => ({
    payload: { spell }
}));

export const enableSpell = createAction("ENABLE_SPELL", spell => ({
    payload: { spell }
}));

export const primeSpell = createAction("PRIME_SPELL", primed => ({
    payload: { primed }
}));

// Reducers
export default createReducer(initState, {
    [clearSpell]: (state) => ({ ...state, primed: null }),
    [enableSpell]: (state, action) => { remove(state.disabled, (spell) => spell === action.payload.spell.name) },
    [disableSpell]: (state, action) => { state.disabled.push(action.payload.spell) },
    [primeSpell]: (state, action) => ({ ...state, ...action.payload })
});