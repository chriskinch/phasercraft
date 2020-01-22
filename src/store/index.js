// import { createLogger } from "redux-logger"
// import { applyMiddleware } from "redux-logger"
import { createStore } from "redux";
import { gameReducer } from "./gameReducer";

export default createStore(
    gameReducer, /* preloadedState, */
    // applyMiddleware(createLogger()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
