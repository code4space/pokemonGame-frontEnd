import {applyMiddleware, legacy_createStore as createStore } from "redux";
import thunk from "redux-thunk"
import rootReducer from "./reducers/root";

const logger = store => next => action => {
    const result = next(action)
    return result
}

const store = createStore(rootReducer, applyMiddleware(logger, thunk))

export default store