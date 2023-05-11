import { POKEMON } from "./actionType";
import axios from "axios";

export function pokemonFetchSuccess(payload) {
  return {
    type: POKEMON,
    payload,
  };
}

export function getPokemon() {
    return async (dispatch, getState) => {
      try {
        const { data } = await axios({
          url: "https://pokeapi.co/api/v2/pokemon?limit=100&offset=0",
          method: "GET",
        });
  
        const promises = data.results.map(async (el) => {
          const { data: pokemonData } = await axios.get(el.url);
          const { data: pokemonData1 } = await axios.get(pokemonData.species.url);
          const pokemon = {
            name: el.name,
            atack: pokemonData.stats[1].base_stat,
            hp: pokemonData.stats[0].base_stat,
            def: pokemonData.stats[2].base_stat,
            baseExp: pokemonData.base_experience,
            power: pokemonData.base_experience + pokemonData.stats[2].base_stat + pokemonData.stats[1].base_stat + pokemonData.stats[0].base_stat,
            img: pokemonData.sprites.other.dream_world.front_default,
            otherImg: pokemonData.sprites.other['official-artwork'].front_default,
            summary: pokemonData1.flavor_text_entries[0].flavor_text,
          };
          return pokemon;
        });
  
        const pokemon = await Promise.all(promises);
        dispatch(pokemonFetchSuccess(pokemon));
      } catch (error) {
        console.log(error);
      }
    };
  }
  
