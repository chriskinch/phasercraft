import { combineReducers } from "redux";
import gameReducer from "./gameReducer";
import spellReducer from "./spellReducer";

export default combineReducers({
    game: gameReducer,
    spell: spellReducer
})
