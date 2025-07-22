import { configureStore } from "@reduxjs/toolkit";
import { gameReducer } from "./gameReducer";

export default configureStore({
    reducer: {
        game: gameReducer
    },
    devTools: process.env.NODE_ENV !== 'production'
});
