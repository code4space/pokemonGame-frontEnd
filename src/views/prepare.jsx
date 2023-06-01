import { connect, useDispatch, useSelector } from "react-redux"
import CollectionBox from "../components/collectionBox";
import { useEffect, useState } from "react";
import LoadingScreen from "../components/loading";
import { getPokemon } from "../store/actions/fetchPokemon"
import { clickSound } from "../components/playSound";
import CardDetail from "../components/cardDetail";
import '../assets/css/prepare.css'
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import swordIcon from '../assets/icon/sword1.png'

function PreparePage({ isHard }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
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

    const [selectedPokemon, setSelectedPokemon] = useState(null)
    const [myDeck, setMyDeck] = useState([])
    const [isDeck, setIsDeck] = useState(false)
    const [activeSort, setActiveSort] = useState(false)
    const [activeDetail, setActiveDetail] = useState(false)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        function fetchData() {
            try {
                dispatch(getPokemon());
                setIsLoading(false);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [dispatch])

    function addToMyDeck() {
        clickSound()
        if (myDeck.length === 3) {
            handleCloseButtonDetail()
            return Swal.fire({
                title: 'Discard one of your Pokémon',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                timer: 3000
            })
        }
        const found = myDeck.find(el => el.name === pokemon[selectedPokemon].name)
        if (found) {
            handleCloseButtonDetail()
            return Swal.fire({
                title: 'Cannot have two of the same Pokémon in a deck',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                timer: 3000
            })
        }
        let temp = myDeck
        temp.push(pokemon[selectedPokemon])
        setMyDeck(temp)
        handleCloseButtonDetail()
    }

    function discard() {
        clickSound()
        let temp = myDeck
        temp.splice(selectedPokemon, 1);
        setMyDeck(temp)
        handleCloseButtonDetail()
    }

    function handleButtonDetail(index, deck) {
        clickSound()
        setActiveDetail(!activeDetail)

        if (deck) setIsDeck(true)
        setSelectedPokemon(index)
    }

    function handleCloseButtonDetail() {
        setActiveDetail(!activeDetail)
        setIsDeck(false)
    }

    function handleButtonBattle() {
        clickSound()
        if (myDeck.length < 1) {
            return Swal.fire({
                title: 'At least 1 Pokémon in the deck',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                timer: 3000
            })
        }
        navigate('/play')
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


    if (isLoading) {
        return <LoadingScreen />
    } else {
        return (
            <div className="lobby">
                <div className="collection-title">
                    <span></span>
                    <h1 className="title-deck">Battle Deck</h1>
                    <span></span>
                </div>
                <CollectionBox pokemon={myDeck} handleButtonDetail={handleButtonDetail} deck={true} />
                <CollectionBox pokemon={pokemon} handleButtonDetail={handleButtonDetail} />
                <div className="paging">
                    <button onClick={() => back(page)} className="logout" style={page < 2 ? { display: 'none' } : null}>Back</button>
                    <span>{page}</span>
                    <button onClick={() => next(page)} className="logout" style={page === totalPage ? { display: 'none' } : null}>Next</button>
                </div>
                <button className="logout sort-box" onClick={sort} style={activeSort ? { backgroundColor: "#399ae7" } : { backgroundColor: "#6dbfb8" }}>Sort</button>
                {activeDetail &&
                    <div className="select-detail">
                        <span className="bg-select" onClick={handleCloseButtonDetail}></span>
                        <CardDetail pokemon={isDeck ? myDeck[selectedPokemon] : pokemon[selectedPokemon]} />
                        {isDeck ? <button className="logout" onClick={discard}>Discard</button> : <button className="logout" onClick={addToMyDeck} style={{ backgroundColor: 'rgb(112, 157, 255)' }}>Select</button>}
                    </div>}
                <button className="logout battle" onClick={handleButtonBattle}>
                    <img src={swordIcon}></img>
                    <p>Battle</p>
                </button>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isHard: state.UserReducer.isHard,
    };
};

export default connect(mapStateToProps)(PreparePage);