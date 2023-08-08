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

export default function CardDetail({ pokemon = undefined, cardCtrl = false }) {
    const { img2, name, power, attack, hp, def, summary, baseExp, type, star, evolves_name, evolves_pokedex, base_stat } = pokemon;
    const cardRef = useRef(null);
    const [detail, setDetail] = useState(false)
    const [rotate, setRotate] = useState(false)
    const [animation, setAnimation] = useState(false)

    console.log(pokemon)

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
        });
    }, []);

    function cardClass() {
        let result = 'card-detail evolving'
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
        if (!name) return "Evolve not available"
        else {
            if (star < 2) return 'Need more star to evolve'
            else if (pokemon.level < star * 30) return 'level must reach its maximum'
            else return 'Ready to evolve'
        }
    }

    const readyToEvolve = (level, star) => {
        console.log(level, star)
        if (star < 2 || level < star * 30) return false
        else return true
    }

    async function evolve() {
        setAnimation(true)
        await axios({
            method: 'PATCH',
            headers: { access_token: localStorage.getItem('access_token') },
            url: baseUrl + `/pokemon/evolve/${pokemon.id}`,
            data: { evolves_pokedex }
        })
            .then(res => {
                if (res.status !== 200) throw new Error("something went wrong");

            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: `ERROR ${error.response.status}`,
                    text: error.response.data.message,
                });
            });
    }

    return (
        <div className={cardClass()} ref={cardRef}>
            <div className="front-card">
                {img2 && <img src={img2} alt="pokemon_pic" className="pokemon-img" />}
                <h3 style={{ color: setColor(baseExp) }}>Level {!cardCtrl ? `${pokemon.level}/${star * 30}` : '1'}</h3>
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
                            <p>Defense</p>
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
                            <i>{canEvolve(evolves_name, star)}</i>
                            {console.log(readyToEvolve(pokemon.level, star))}
                            {readyToEvolve(pokemon.level, star) ? <button className='logout' onClick={evolve}>Evolve</button> : <button className='deactive'>Evolve</button>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



