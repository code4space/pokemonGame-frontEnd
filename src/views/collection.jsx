import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPokemon } from "../store/actions/fetchPokemon"
import { clickSound } from "../components/playSound"
import sword from '../assets/icon/sword.png'
import health from '../assets/icon/health.png'
import shield from '../assets/icon/shield.png'

export default function CollectionPage() {
    const color = ['#cbcbcb', '#bebb98', '#667af8', '#a749f0', '#ec5f58', 'rgb(255, 140, 39)', '#303638']
    const dispatch = useDispatch()
    const pokemon = useSelector((state) => {
        return state.PokemonReducer.pokemon
    })
    const [activeDetail, setActiveDetail] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState(null)

    function setColor(baseExp) {
        if (baseExp < 44) {
            return color[0]
        } else if (baseExp < 88) {
            return color[1]
        } else if (baseExp < 132) {
            return color[2]
        } else if (baseExp < 176) {
            return color[3]
        } else if (baseExp < 220) {
            return color[4]
        } else if (baseExp < 264) {
            return color[5]
        } else if (baseExp < 308) {
            return color[6]
        }
    }

    function handleButtonDetail(index) {
        clickSound()
        setActiveDetail(!activeDetail)
        setSelectedPokemon(index)
    }

    function handleCloseButtonDetail() {
        setActiveDetail(!activeDetail)
    }

    useEffect(() => {
        dispatch(getPokemon())
    }, [dispatch])
    return (
        <>
            <div className="lobby collection">
                <h1>COLLECTION</h1>
                <div className="box-collection">
                    {pokemon.map((el, i) => {
                        return (
                            <div key={i} className="item-collection" style={{ backgroundColor: setColor(el.baseExp) }} onClick={() => handleButtonDetail(i)}>
                                {el.baseExp > 219 && <div className="shining-animation"></div>}
                                <img src={el.img} alt="" />
                            </div>
                        )
                    })}
                </div>
            </div>
            {activeDetail && <div className="detail-collection" onClick={handleCloseButtonDetail}>
                    <div className="card-detail">
                        <img src={pokemon[selectedPokemon].otherImg} alt="pokemon_pic" className="pokemon-img"/>
                        <h2>{pokemon[selectedPokemon].name}</h2>
                        <h3>Power : {pokemon[selectedPokemon].power}</h3>
                        <div className="stat">
                            <span><img src={sword} alt="atk"/>: {pokemon[selectedPokemon].atack}</span>
                            <span><img src={health} alt="health"/>: {pokemon[selectedPokemon].hp}</span>
                            <span><img src={shield} alt="def"/>: {pokemon[selectedPokemon].def}</span>
                        </div>
                        <p>{pokemon[selectedPokemon].summary.replace('\f', ' ')}</p>
                        <div className="color-rank" style={{backgroundColor: setColor(pokemon[selectedPokemon].baseExp)}}></div>
                    </div>
                    {/* style={{background: 'radial-gradient(circle, rgba(255,0,0,0.6699054621848739) 0%, rgba(255,0,0,1) 100%)'}} */}
            </div>}
        </>
    )
}