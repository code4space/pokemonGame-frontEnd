import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import CardDetail from "../components/cardDetail"
import pokeBall from "../assets/icon/pokeball.png"
import greatBall from "../assets/icon/greatball.png"
import ultraBall from "../assets/icon/ultraball.png"
import masterBall from "../assets/icon/masterball.png"
import { gameNotificationSound } from "../components/playSound"
import axios from "axios"
import { baseUrl } from "../constant/url"
import { getUserInfo } from "../store/actions/fetchUser"
import LoadingScreen from "../components/loading"
import Swal from "sweetalert2"
import giphy from "../assets/icon/giphy.gif"
import { drawPokemon } from "../constant/helper"

export default function DrawPage() {
    const [pokemon, setPokemon] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch()
    const draw = useSelector((state) => {
        return state.UserReducer.draw
    })
    const balls = useSelector((state) => {
        return state.UserReducer.balls
    })

    useEffect(() => {
        axios({
            url: baseUrl + '/one/pokemon',
            method: "GET",
            headers: { access_token: localStorage.getItem('access_token') }
        }).then((res) => {
            res.data.pokemon.type = res.data.pokemon.type.split(',')
            setPokemon(res.data.pokemon)
            setIsLoading(false)
        }).catch(error => {
            console.log(error);
        });
        dispatch(getUserInfo())
    }, [])

    async function skip() {
        setIsLoading(true);

        try {
            await axios.patch(baseUrl + "/skip/pokemon", null, {
                headers: { access_token: localStorage.getItem("access_token") }
            });

            dispatch(getUserInfo());

            const response = await axios.get(baseUrl + '/one/pokemon', {
                headers: { access_token: localStorage.getItem('access_token') }
            });

            const pokemonData = response.data.pokemon;
            pokemonData.type = pokemonData.type.split(',');

            setPokemon(pokemonData);
            setIsLoading(false); // Clear the loading state
        } catch (error) {
            console.log(error);
            setIsLoading(false); // Clear the loading state
        }
    }


    async function success(pokemon) {
        setIsLoading(true);

        try {
            await Swal.fire({
                title: `<div style="font-size:40px;">CONGRATS</div>`,
                html: `you get <p style="margin-top:10px;">${pokemon.name}</p>`,
                width: 600,
                padding: '3em',
                color: '#716add',
                background: '#fff',
                backdrop: `
              rgba(0,0,0,0.6)
              url(${giphy})
              left top
              no-repeat
            `
            });

            pokemon.type = pokemon.type.join(',');

            await axios.post(baseUrl + '/pokemon', pokemon, {
                headers: { access_token: localStorage.getItem("access_token") }
            });

            skip();
        } catch (error) {
            console.log(error);
        }
    }


    function failed() {
        Swal.fire({
            title: 'FAILED :(',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            },
            timer: 3000
        })
    }

    async function get(ballType, pokemon) {
        try {
            gameNotificationSound();

            if (draw < 1 || balls[ballType] < 1) {
                return '';
            }

            const baseExp = pokemon.baseExp;
            setIsLoading(true);

            await axios.patch(baseUrl + "/pokeball/decrease", {
                ballType: ballType
            }, {
                headers: {
                    access_token: localStorage.getItem("access_token")
                }
            });

            dispatch(getUserInfo());
            setIsLoading(false);

            if (drawPokemon(ballType, baseExp)) {
                return success(pokemon);
            } else {
                failed();
            }
        } catch (err) {
            console.log(err);
        }
    }


    if (isLoading) {
        return (
            <LoadingScreen />
        )
    } else {
        return (
            <>
                <div className="lobby">
                    <h1 className="draw-title">DRAW {draw}X</h1>
                    <div className="draw-container">
                        <CardDetail pokemon={pokemon} cardCtrl={true} />
                        <div className="draw-ctrl-right-btn">
                            <div className="pokeball">
                                <button onClick={() => { get('pokeball', pokemon) }} style={{ border: 'rgb(77, 77, 77) solid 3px' }}>
                                    <img src={pokeBall} alt="" />
                                    <h3>Just a regular pokeball</h3>
                                </button>
                                <span>{balls.pokeball}</span>
                                <button onClick={() => { get('greatball', pokemon) }} style={{ border: 'rgb(0, 123, 255) solid 3px' }}>
                                    <img src={greatBall} alt="" />
                                    <h3>1,5 times more effective</h3>
                                </button>
                                <span>{balls.greatball}</span>
                                <button onClick={() => { get('ultraball', pokemon) }} style={{ border: 'rgb(255, 140, 0) solid 3px' }}>
                                    <img src={ultraBall} alt="" />
                                    <h3>2 times more effective</h3>
                                </button>
                                <span>{balls.ultraball}</span>
                                <button onClick={() => { get('masterball', pokemon) }} style={{ border: 'rgb(181, 0, 139) solid 3px' }}>
                                    <img src={masterBall} alt="" />
                                    <h3>You must be kidding</h3>
                                </button>
                                <span>{balls.masterball}</span>
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
}