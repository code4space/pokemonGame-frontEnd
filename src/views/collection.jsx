import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPokemon } from "../store/actions/fetchPokemon"
import { clickSound } from "../components/playSound"
import CardDetail from "../components/cardDetail"
import { setColor } from "../constant/helper"

export default function CollectionPage() {
    const dispatch = useDispatch()
    const pokemon = useSelector((state) => {
        return state.PokemonReducer.pokemon
    })
    const [activeDetail, setActiveDetail] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState(null)

    function handleButtonDetail(index) {
        clickSound()
        setActiveDetail(!activeDetail)
        setSelectedPokemon(index)
    }

    function handleCloseButtonDetail() {
        setActiveDetail(!activeDetail)
    }

    function next() {
        clickSound()
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
                            <div key={i} className="item-collection" style={el.baseExp > 307 ? { animationName: 'glow', animationDuration: '2s', animationDelay: '1s', animationIterationCount: 'infinite', backgroundColor: setColor(el.baseExp) } : { backgroundColor: setColor(el.baseExp) }} onClick={() => handleButtonDetail(i)}>
                                {(el.baseExp > 219 && el.baseExp < 308) && <div className="shining-animation"></div>}
                                <img src={el.img} alt="" />
                            </div>
                        )
                    })}
                </div>
                <div className="paging">
                    <button onClick={next} className="logout">Back</button>
                    <span>1</span>
                    <button onClick={next} className="logout">Next</button>
                </div>
            </div>
            {activeDetail &&
                <div className="detail-collection" onClick={handleCloseButtonDetail}>
                    <CardDetail pokemon={pokemon[selectedPokemon]} />
                </div>}

        </>
    )
}