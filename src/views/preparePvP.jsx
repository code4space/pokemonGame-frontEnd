import { connect, useDispatch, useSelector } from "react-redux";
import CollectionBox from "../components/collectionBox";
import { useEffect, useState } from "react";
import { getPokemon } from "../store/actions/fetchPokemon";
import { clickSound } from "../components/playSound";
import CardDetail from "../components/cardDetail";
import { storeMyDeck } from "../store/actions/setGameSettings";
import io from 'socket.io-client';
import { baseUrl } from "../constant/url";
import LoadingScreen from "../components/loading";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


function PreparePvP({ deck }) {
    const [isLoading, setIsLoading] = useState(true)
    const [activeSort, setActiveSort] = useState(false)
    const [activeDetail, setActiveDetail] = useState(false)
    const [activeDetailOpponent, setActiveDetailOpponent] = useState(false)
    const [selectedPokemon, setSelectedPokemon] = useState()
    const [isFind, setIsFind] = useState(true)
    const [ready, setReady] = useState(false)

    const [isDeck, setIsDeck] = useState(false)
    const [myDeck, setMyDeck] = useState(deck)
    const [socket, setSocket] = useState(null);
    const [roomInfo, setRoomInfo] = useState(null)
    const [opponent, setOpponent] = useState({
        username: '',
        deck: []
    })

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const pokemon = useSelector((state) => state.PokemonReducer.pokemon)
    const page = useSelector((state) => state.PokemonReducer.page)
    const totalPokemon = useSelector((state) => state.PokemonReducer.totalPokemon)
    const username = useSelector((state) => state.UserReducer.username)
    const totalPage = Math.ceil(totalPokemon / 50)

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

    useEffect(() => {
        const newSocket = io.connect(baseUrl);
        setSocket(newSocket)
        console.log('masuk')

        newSocket.emit('joinRoom', { username }); // Emit the 'joinRoom' event when connecting

        newSocket.on('roomInfo', ({ roomName, users, disconnect, username: opponentName }) => {
            if (users === 2) {
                newSocket.emit('opponent-name', { room: roomName, username })
                setIsFind(false)
            }
            if (disconnect) {
                newSocket.disconnect();
                navigate('/')
                Swal.fire({
                    position: "middle",
                    icon: "error",
                    title: "Your oppenent disconnected",
                    showConfirmButton: true,
                    timer: 3000,
                });
            }
            setRoomInfo(roomName);
        });

        newSocket.on('opponent-deck', ({ opponentDeck, opponentName }) => {
            if (username === opponentName) setOpponent(prevData => ({ ...prevData, deck: opponentDeck }))
        });

        newSocket.on('opponent-name', ({ opponentName }) => {
            if (username !== opponentName) setOpponent(prevData => ({ ...prevData, username: opponentName }))
        })

        return () => {
            newSocket.off('opponent-deck', (data) => setOpponent(prevData => ({ ...prevData, deck: data.opponentDeck })));
            newSocket.disconnect();
        };
    }, []);

    function sort() {
        const newActiveSort = !activeSort;
        setActiveSort(newActiveSort);
        dispatch(getPokemon(1, newActiveSort.toString()));
    }

    function handleButtonDetail(index, deck) {
        clickSound()
        setActiveDetail(!activeDetail)

        if (deck) setIsDeck(true)
        setSelectedPokemon(index)
    }

    function handleButtonDetailOpponent(index, deck) {
        clickSound()
        setActiveDetailOpponent(!activeDetailOpponent)
        setSelectedPokemon(index)
    }

    function handleCloseButtonDetail() {
        setActiveDetail(!activeDetail)
        setIsDeck(false)
    }
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
        socket.emit('opponent-deck', { room: roomInfo, opponentDeck: temp, opponentName: opponent.username })
        handleCloseButtonDetail()
        setReady(false)
    }

    function readyButton() {
        if (!ready && !myDeck.length) {
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
        clickSound()
        setReady(!ready)
        socket.emit('ready', { ready, opponentName: opponent.username, room: roomInfo })
    }

    function discard() {
        clickSound()
        let temp = myDeck
        temp.splice(selectedPokemon, 1);
        setMyDeck(temp)
        setReady(false)
        handleCloseButtonDetail()
        socket.emit('opponent-deck', { room: roomInfo, opponentDeck: temp, opponentName: opponent.username })
    }

    if (isFind || isLoading) return <LoadingScreen find={isFind ? true : false} />
    else return (
        <div className="lobby">
            <div className="collection-title" style={{ height: 'auto', fontSize: '13px' }}>
                <h1 className="title-deck">Enemy Deck</h1>
            </div>
            <CollectionBox pokemon={opponent.deck} handleButtonDetail={handleButtonDetailOpponent} deck={true} />
            <div className="collection-title" style={{ height: 'auto', marginTop: '10px', fontSize: '13px' }}>
                <h1 className="title-deck">Your Deck</h1>
            </div>
            <CollectionBox pokemon={myDeck} handleButtonDetail={handleButtonDetail} deck={true} borderColor={ready ? '#29c94f' : ''} />
            <CollectionBox pokemon={pokemon} handleButtonDetail={handleButtonDetail} height={'180px'} />
            {activeDetail &&
                <div className="select-detail">
                    {console.log(isDeck)}
                    <span className="bg-select" onClick={handleCloseButtonDetail}></span>
                    <CardDetail pokemon={isDeck ? myDeck[selectedPokemon] : pokemon[selectedPokemon]} />
                    {isDeck ? <button className="logout" onClick={discard}>Discard</button> : <button className="logout" onClick={addToMyDeck} style={{ backgroundColor: 'rgb(112, 157, 255)' }}>Select</button>}
                </div>}
            {activeDetailOpponent &&
                <div className="select-detail">
                    <span className="bg-select" onClick={() => {
                        clickSound()
                        setActiveDetailOpponent(false)
                    }}></span>
                    <CardDetail pokemon={opponent.deck[selectedPokemon]} />
                </div>}
            <div className="paging">
                <button onClick={() => back(page)} className="logout" style={page < 2 ? { opacity: '0', pointerEvents: 'none' } : null}>Back</button>
                <span>{page}</span>
                <button onClick={() => next(page)} className="logout" style={page === totalPage ? { opacity: '0', pointerEvents: 'none' } : null}>Next</button>
                <button className="logout sort-box" onClick={sort} style={activeSort ? { backgroundColor: "#399ae7" } : { backgroundColor: "#6dbfb8" }}>Sort</button>
            </div>
            <button onClick={readyButton} className="logout battle ready" style={{ backgroundColor: ready ? '#f6424b' : '#29c94f', fontSize: '13px', padding: '5px' }}>{ready ? 'cancel' : 'ready'}
            </button>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        deck: state.UserReducer.deck,
    };
};

const mapDispatchToProps = {
    storeMyDeck,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreparePvP);