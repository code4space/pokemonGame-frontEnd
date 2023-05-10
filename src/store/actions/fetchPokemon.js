import { POKEMON } from "./actionType";
import axios from 'axios';

export function pokemonFetchSuccess(payload) {
    return {
        type: POKEMON,
        payload
    }
}

export function getPokemon () {
    return async (dispatch, getState) => {
        try { 
            const {data} = await axios({
                url: 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=1',
                method: 'GET'
            })
            dispatch(pokemonFetchSuccess(data.results))
        }

        catch (error) {
            console.log(error)
        }
    }
}