import logoPokemon from '../assets/logo/logoPokemon.png'
import pikachu from '../assets/icon/pikachu.gif'
import { clickSound } from "../components/playSound"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPokemon } from '../store/actions/fetchPokemon'
import { getUserInfo } from '../store/actions/fetchUser'
import LoadingScreen from '../components/loading'

export default function HomePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [isLoading, setIsLoading] = useState(true);

    let totalPokemon, draw
    totalPokemon = useSelector((state) => {
        return state.PokemonReducer.totalPokemon
    })
    draw = useSelector((state) => {
        return state.UserReducer.draw
    })

    //notification
    function notification(count) {
        if (count > 0) {
            return <span className="notification">{count}</span>
        } else {
            return null
        }
    }

    //handle button
    function Move(route) {
        clickSound()
        return navigate(route)
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await dispatch(getPokemon());
                dispatch(getUserInfo())
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [dispatch])

    if (isLoading) {
        return (
            <LoadingScreen />
        )
    } else {
        return (
            <div className="lobby">
                <img src={pikachu} alt="pikachu_gif" className="pikachu-gif right-pikachu-position" />
                <img src={pikachu} alt="pikachu_gif" className="pikachu-gif left-pikachu-position" />
                <img src={logoPokemon} alt="pokemon_logo" className="logoPokemon" />
                <div className="button-lobby-ctrl">
                    <div className="pixelated-border pixelated-border-effect button-lobby" onClick={() => { Move('/prepare') }}>Play</div>
                    <div className="pixelated-border pixelated-border-effect button-lobby" onClick={() => { Move('/collection') }}>
                        {notification(totalPokemon)}
                        Collection
                    </div>
                </div>

                <div className="pixelated-border pixelated-border-effect button-draw" onClick={() => { Move('/draw') }}>
                    {notification(draw)}
                    Draw
                </div>
            </div>
        )
    }
}