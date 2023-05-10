import { POKEMON } from "../actions/actionType";

const initialState = {
    pokemon: []
}

function PokemonReducer (state = initialState, action) {
    switch (action.type) {
        case POKEMON:
            return {
                ...state,
                pokemon: action.payload
            }
        default:
            return state;
    }
}

export default PokemonReducer