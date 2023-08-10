import { POKEMON, RANDOM_POKEMON } from "../actions/actionType";
import { setRoleAndPercentage } from "../../constant/helper";

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
            const pokemon = action.payload.pokemon.map(el => {
                const roleAndPercentage = setRoleAndPercentage(el.base_stat)
                return {...el, ...roleAndPercentage}
            })

            return {
                ...state,
                pokemon,
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