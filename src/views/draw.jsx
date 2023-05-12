import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPokemon } from "../store/actions/fetchPokemon"
import CardDetail from "../components/cardDetail"
import pokeBall from "../assets/icon/pokeball.png"
import greatBall from "../assets/icon/greatball.png"
import ultraBall from "../assets/icon/ultraball.png"
import masterBall from "../assets/icon/masterball.png"
import { clickSound, gameNotificationSound } from "../components/playSound"

export default function DrawPage() {
    const dispatch = useDispatch()
    const pokemon = useSelector((state) => {
        return state.PokemonReducer.pokemon
    })

    useEffect(() => {
        dispatch(getPokemon())
    }, [dispatch])

    function skip () {
        clickSound()
    }

    function get (ballType) {
        gameNotificationSound()
    }
    return (
        <>
            <div className="lobby">
                <div className="draw-container">
                    <h1>DRAW 3X</h1>
                    <CardDetail pokemon={pokemon[0]} cardCtrl={true}/>
                    <div className="draw-ctrl-right-btn">
                        <div className="pokeball">
                            <button onClick={() => {get('pokeball')}} style={{ border: 'rgb(77, 77, 77) solid 3px' }}>
                                <img src={pokeBall} alt="" />
                            </button>
                            <span>3</span>
                            <button onClick={() => {get('greatball')}} style={{ border: 'rgb(0, 123, 255) solid 3px' }}>
                                <img src={greatBall} alt="" />
                            </button>
                            <span>3</span>
                            <button onClick={() => {get('ultraball')}} style={{ border: 'rgb(255, 140, 0) solid 3px' }}>
                                <img src={ultraBall} alt="" />
                            </button>
                            <span>3</span>
                            <button onClick={() => {get('masterball')}} style={{ border: 'rgb(181, 0, 139) solid 3px' }}>
                                <img src={masterBall} alt="" />
                            </button>
                            <span>3</span>
                        </div>
                        <button className="skip logout" onClick={skip}>
                            Skip
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}