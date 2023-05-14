import { combineReducers } from "redux";
import PokemonReducer from "./pokemon";
import UserReducer from "./user";

const rootReducer = combineReducers({
    PokemonReducer,
    UserReducer,
})

export default rootReducer