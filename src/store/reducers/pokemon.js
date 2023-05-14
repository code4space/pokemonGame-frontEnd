import { POKEMON, RANDOM_POKEMON } from "../actions/actionType";

const initialState = {
    pokemon: [],
    totalPokemon: null,
    page: 1,
    sort: false,
    randomPokemon: {},
}

function PokemonReducer (state = initialState, action) {
    switch (action.type) {
        case POKEMON:
            return {
                ...state,
                pokemon: action.payload.pokemon,
                totalPokemon: action.payload.totalPokemon,
                page: action.payload.page
            }
        case RANDOM_POKEMON:
            return {
                ...state,
                randomPokemon: action.payload
            }
        default:
            return state;
    }
}

export default PokemonReducer