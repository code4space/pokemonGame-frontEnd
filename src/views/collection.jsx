import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getPokemon } from "../store/actions/fetchPokemon"
import { clickSound } from "../components/playSound"
import CardDetail from "../components/cardDetail"
import LoadingScreen from "../components/loading"
import CollectionBox from "../components/collectionBox"

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
    const totalPage = Math.ceil(totalPokemon / 40)
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
                    <CollectionBox pokemon={pokemon} handleButtonDetail={handleButtonDetail} />
                    <div className="paging">
                        <button onClick={() => back(page)} className="logout" style={page < 2 ? { opacity: '0', pointerEvents: 'none' } : null}>Back</button>
                        <span>{page}</span>
                        <button onClick={() => next(page)} className="logout" style={(page === totalPage) ? { opacity: '0', pointerEvents: 'none' } : null}>Next</button>
                    </div>
                </div>
                {activeDetail &&
                    <div className="detail-collection">
                        <div className="nav-bg" onClick={handleCloseButtonDetail}></div>
                        <CardDetail pokemon={pokemon[selectedPokemon]} />
                    </div>}
            </>
        )
    }
}