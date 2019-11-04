import { createStore } from "redux";
import { gameReducer } from "./gameReducer";

export default createStore(
    gameReducer, /* preloadedState, */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
