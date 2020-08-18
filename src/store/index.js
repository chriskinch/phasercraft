import { createLogger } from "redux-logger"
import { createStore, /*applyMiddleware*/ } from "redux"
import reducer from "./reducers"

export default createStore(
    reducer, /* preloadedState, */
    // applyMiddleware(createLogger()),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
