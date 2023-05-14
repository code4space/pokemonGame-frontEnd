import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPokemon } from "../store/actions/fetchPokemon"
import { clickSound } from "../components/playSound"
import CardDetail from "../components/cardDetail"
import { setColor } from "../constant/helper"
import LoadingScreen from "../components/loading"

export default function CollectionPage() {
    const dispatch = useDispatch()
    const pokemon = useSelector((state) => {
        return state.PokemonReducer.pokemon
    })
    const page = useSelector((state) => {
        return state.PokemonReducer.page
    })
    const totalPokemon = useSelector((state) => {
        return state.PokemonReducer.totalPokemon
    })
    const totalPage = Math.ceil(totalPokemon / 50)
    const [activeDetail, setActiveDetail] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState(null)
    const [activeSort, setActiveSort] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    function handleButtonDetail(index) {
        clickSound()
        setActiveDetail(!activeDetail)
        setSelectedPokemon(index)
    }

    function handleCloseButtonDetail() {
        setActiveDetail(!activeDetail)
    }

    function next(page) {
        clickSound()
        if (totalPage > page) dispatch(getPokemon(+page + 1, activeSort.toString()))
    }

    function back(page) {
        clickSound()
        if (page > 1) dispatch(getPokemon(page = +page - 1, activeSort.toString()))
    }

    function sort() {
        const newActiveSort = !activeSort;
        setActiveSort(newActiveSort);
        dispatch(getPokemon(1, newActiveSort.toString()));
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await dispatch(getPokemon());
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [dispatch])

    if (isLoading) {
        return <LoadingScreen />
    } else {
        return (
            <>
                <div className="lobby collection">
                    <div className="collection-title">
                        <span>Total: {totalPokemon}</span>
                        <h1>COLLECTION</h1>
                        <button className="logout" onClick={sort} style={activeSort ? { backgroundColor: "#399ae7" } : { backgroundColor: "#6dbfb8" }}>Sort</button>
                    </div>
                    <div className="box-collection">
                        {pokemon.map((el, i) => {
                            return (
                                <div key={i} className="item-collection" style={el.baseExp > 307 ? { animationName: 'glow', animationDuration: '2s', animationDelay: '1s', animationIterationCount: 'infinite', backgroundColor: setColor(el.baseExp) } : { backgroundColor: setColor(el.baseExp) }} onClick={() => handleButtonDetail(i)}>
                                    {(el.baseExp > 219 && el.baseExp < 308) && <div className="shining-animation"></div>}
                                    <img src={el.img1} alt="" />
                                </div>
                            )
                        })}
                    </div>
                    <div className="paging">
                        <button onClick={() => back(page)} className="logout" style={page < 2 ? { display: 'none' } : null}>Back</button>
                        <span>{page}</span>
                        <button onClick={() => next(page)} className="logout" style={page === totalPage ? { display: 'none' } : null}>Next</button>
                    </div>
                </div>
                {activeDetail &&
                    <div className="detail-collection" onClick={handleCloseButtonDetail}>
                        <CardDetail pokemon={pokemon[selectedPokemon]} />
                    </div>}

            </>
        )
    }
}