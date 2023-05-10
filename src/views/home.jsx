import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPokemon } from "../store/actions/fetchPokemon"
import logoPokemon from '../assets/logo/logoPokemon.png'
import pikachu from '../assets/icon/pikachu.gif'
import { PokemonTheme2, clickSound } from "../components/playSound"
import { useLocation, useNavigate } from "react-router-dom"

export default function HomePage() {
    const navigate = useNavigate()
    const location = useLocation()

    //redux test
    const dispatch = useDispatch()
    const pokemon = useSelector((state) => {
        console.log(state.PokemonReducer.pokemon)
        return state.PokemonReducer.pokemon
    })
    useEffect(() => {
        dispatch(getPokemon())
    }, [])

    //notification
    function notification() {
        const count = 5

        if (count > 0) {
            return <span className="notification">{count}</span>
        } else {
            return null
        }
    }

    //to get 10 pokemon in the very first
    function getFiveRandomNumbers() {
        const result = [];
        for (let i = 0; i < 10; i++) {
            const random = Math.ceil((Math.random() * 1281))
            if (result.includes(random)) {
                i -= 1
                continue;
            } else {
                result.push(random)
            }
        }

        console.log(result)
    }

    //handle button
    function Move(route) {
        clickSound()
        return navigate(route)
    }

    return (
        <>
            <div className="lobby">
                <img src={pikachu} alt="pikachu_gif" className="pikachu-gif right-pikachu-position" />
                <img src={pikachu} alt="pikachu_gif" className="pikachu-gif left-pikachu-position" />
                <img src={logoPokemon} alt="pokemon_logo" className="logoPokemon" />
                <div className="button-lobby-ctrl">
                    <div className="pixelated-border pixelated-border-effect button-lobby" onClick={() => { Move('/') }}>Play</div>
                    <div className="pixelated-border pixelated-border-effect button-lobby" onClick={() => { Move('/collection') }}>
                        {notification()}
                        Collection
                    </div>
                </div>

                <div className="pixelated-border pixelated-border-effect button-draw" onClick={clickSound}>
                    {notification()}
                    Draw
                </div>
            </div>
        </>
    )
}