import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./gameReducer";
import type { GameState } from "./gameReducer";

export interface RootState {
    game: GameState;
}

export default configureStore({
    reducer: {
        game: gameReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});