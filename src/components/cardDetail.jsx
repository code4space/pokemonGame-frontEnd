import sword from '../assets/icon/sword.png'
import health from '../assets/icon/health.png'
import shield from '../assets/icon/shield.png'
import Star from '../assets/icon/star.png'
import fist from '../assets/icon/power.png'
import { calculateMaximumStat, setColor, styleType } from '../constant/helper'
import { useEffect, useRef, useState } from 'react'
import VanillaTilt from 'vanilla-tilt'
import LoadingScreen from './loading'
import axios from 'axios'
import { baseUrl } from '../constant/url'
import { clickSound, evolveSound } from './playSound'
import { useDispatch } from 'react-redux'
import { getPokemon } from '../store/actions/fetchPokemon'
import Swal from 'sweetalert2'
import { useLocation } from 'react-router-dom'

export default function CardDetail({ pokemon: PokemonData, cardCtrl = false }) {
    const [pokemon, setPokemon] = useState({ ...PokemonData })
    const [detail, setDetail] = useState(false)
    const [rotate, setRotate] = useState(false)
    const [animation, setAnimation] = useState(false)

    const cardRef = useRef(null);
    const dispatch = useDispatch()
    const location = useLocation()
    const { img2, name, power, attack, hp, def, summary, baseExp, type, star, evolves_name, evolves_pokedex, base_stat, level } = pokemon
    
    function detailButton() {
        setDetail(!detail)
        setRotate(true)
        const timeOut = setTimeout(() => {
            setRotate(false)
        }, 1300)
        return () => clearTimeout(timeOut)
    }

    useEffect(() => {
        VanillaTilt.init(cardRef.current, {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.1,
            gyroscope: false,
        });
    }, []);

    function cardClass() {
        let result = 'card-detail'
        if (animation) result += ' evolving'
        if (cardCtrl) result += ' card-ctrl'
        if (rotate) result += ' transition'
        if (detail) result += ' rotate'

        return result
    }

    function removeDuplicates(arr) {
        if (!arr) return []
        const uniqueValues = [];
        const seenValues = {};

        for (const value of arr) {
            if (!seenValues[value]) {
                seenValues[value] = true;
                uniqueValues.push(value);
            }
        }

        return uniqueValues;
    }

    function canEvolve(name, star) {
        if (!name) return { message: "Evolve not available", avaible: false }
        else {
            if (star < 2) return { message: "Need more star to evolve", avaible: false }
            else if (level < star * 30) return { message: "level must reach its maximum", avaible: false }
            else {
                if (location.pathname !== '/collection') return { message: "Ready to evolve", avaible: false }
                else return { message: "Ready to evolve", avaible: true }   
            }
        }
    }

    async function evolve() {
        clickSound()
        setDetail(!detail)
        setAnimation(true)
        const timeOut = setTimeout(() => {
            setAnimation(false)
        }, 5000)

        await axios({
            method: 'PATCH',
            headers: { access_token: localStorage.getItem('access_token') },
            url: baseUrl + `/pokemon/evolve/${pokemon.id}`,
            data: { evolves_pokedex }
        })
            .then(res => {
                if (res.status !== 200) throw new Error("something went wrong");
                else {
                    setTimeout(() => {
                        evolveSound()
                        setPokemon({ ...res.data.pokemon })
                    }, 2400)
                }
                dispatch(getPokemon())
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: `ERROR ${error.response.status}`,
                    text: error.response.data.message,
                });
                console.log(error)
            });
        return () => clearTimeout(timeOut)
    }

    if (!pokemon) return <LoadingScreen />
    else return (
        <div ref={cardRef} className="card-wrapper">
            <div className={cardClass()}>
                <div className="front-card">
                    {img2 && <img src={img2} alt="pokemon_pic" className="pokemon-img" />}
                    <h3 style={{ color: setColor(baseExp) }}>Level {!cardCtrl ? `${level}/${star * 30}` : '1'}</h3>
                    <h2>{name}</h2>
                    <p className='summary'>{summary}</p>
                    <div className='type'>
                        {type?.elements.map((el, i) => {
                            return <span key={i} style={{ backgroundColor: styleType(el, 'background'), borderColor: styleType(el, 'border') }}>{el}</span>
                        })}
                    </div>
                    <div className="color-rank" style={{ backgroundColor: setColor(baseExp) }}>
                        <p onClick={detailButton}>More Detail &#8644;</p>
                    </div>
                </div>
                <div className="back-card" style={{ '--border-card': setColor(baseExp) }}>
                    <p onClick={detailButton} className='back-detail'>Back &#8644;</p>
                    <div className='back-content'>
                        <div className="power">
                            <img src={fist} alt="fist" />
                            <span>{Math.floor(power)}</span>
                        </div>
                        <div className="stat-group">
                            <div className="stat">
                                <img src={sword} alt="sword" />
                                <p>Attack</p>
                                <span style={{ '--stat': calculateMaximumStat(base_stat?.attack ?? attack, 'attack') }}></span>
                            </div>
                            <div className="stat">
                                <img src={health} alt="health" />
                                <p>HP</p>
                                <span style={{ '--stat': calculateMaximumStat(base_stat?.hp ?? hp, 'hp') }} ></span>
                            </div>
                            <div className="stat">
                                <img src={shield} alt="shield" />
                                <p>Def</p>
                                <span style={{ '--stat': calculateMaximumStat(base_stat?.def ?? def, 'def') }}></span>
                            </div>
                        </div>
                        <p>Next Evolution : {evolves_name ? evolves_name : 'none'}</p>
                        <p className='weakness'>Weakness : {removeDuplicates(type?.weakness).map((el, i) => {
                            return <span key={i} style={{ backgroundColor: styleType(el, 'background'), borderColor: styleType(el, 'border') }}>{el}</span>
                        })}</p>
                        <div className="bottom">
                            <div className="star">
                                {Array.from({ length: star }, (_, index) => index).map((el) => {
                                    return <img src={Star} alt="star" key={el} />
                                })}
                                {Array.from({ length: evolves_name ? 2 - star : 5 - star }, (_, index) => index).map((el) => {
                                    return <img src={Star} alt="star" key={el} className='star-off' />
                                })}
                            </div>
                            <div className="evolve">
                                {}
                                <i>{canEvolve(evolves_name, star).message}</i>
                                {canEvolve(evolves_name, star).avaible ? <button className='logout' onClick={evolve}>Evolve</button> : <button className='deactive'>Evolve</button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

