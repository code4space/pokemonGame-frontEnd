import { baseUrl } from "../../constant/url";
import { POKEMON } from "./actionType";
import axios from "axios";

export function pokemonFetchSuccess(payload) {
  return {
    type: POKEMON,
    payload,
  };
}

export function getPokemon(page=1,sort="false") {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(baseUrl+`/pokemon?page=${page}&sort=${sort}`, {
        headers: { access_token: localStorage.getItem('access_token') },
      });
      dispatch(pokemonFetchSuccess({page:response.data.page, totalPokemon:response.data.totalPokemon, pokemon:response.data.pokemon}));
    } catch (error) {
      console.log(error);
    }
  };
}

export function randomPokemonFetchSuccess(payload) {
  return {
    type: POKEMON,
    payload,
  };
}

export function getRandomPokemon() {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(baseUrl+`/random/pokemon`, {
        headers: { access_token: localStorage.getItem('access_token') },
      });
      dispatch(randomPokemonFetchSuccess(response.pokemon));
    } catch (error) {
      console.log(error);
    }
  };
}