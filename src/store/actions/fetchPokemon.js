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
        url: "https://pokeapi.co/api/v2/pokemon?limit=50&offset=200",
        method: "GET",
      });

      function additionalPower(baseExp) {
        if (baseExp < 44) {
          return Math.ceil(baseExp*0.1);
        } else if (baseExp < 88) {
          return Math.ceil(baseExp*0.2);
        } else if (baseExp < 132) {
          return Math.ceil(baseExp*0.3);
        } else if (baseExp < 176) {
          return Math.ceil(baseExp*0.4);
        } else if (baseExp < 220) {
          return Math.ceil(baseExp*0.5);
        } else if (baseExp < 264) {
          return Math.ceil(baseExp*0.6);
        } else if (baseExp < 308) {
          return Math.ceil(baseExp*0.8)
        } else {
          return Math.ceil(baseExp*0.9)
        }
      }

      const promises = data.results.map(async (el) => {
        const { data: pokemonData } = await axios.get(el.url);
        const { data: pokemonData1 } = await axios.get(pokemonData.species.url);
        let summary, fte = pokemonData1.flavor_text_entries
        for (let i = 0; i < fte.length; i++) {
          if (fte[i].language.name === 'en') {
            summary = fte[i].flavor_text
            break;
          }
        }
        const pokemon = {
          name: el.name,
          atack: pokemonData.stats[1].base_stat,
          hp: pokemonData.stats[0].base_stat,
          def: pokemonData.stats[2].base_stat,
          baseExp: pokemonData.base_experience,
          power:
            pokemonData.base_experience +
            pokemonData.stats[2].base_stat +
            pokemonData.stats[1].base_stat +
            pokemonData.stats[0].base_stat + additionalPower(pokemonData.base_experience),
          img: pokemonData.sprites.other.dream_world.front_default,
          otherImg: pokemonData.sprites.other["official-artwork"].front_default,
          summary:summary,
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
