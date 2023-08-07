import sword from '../assets/icon/sword.png'
import health from '../assets/icon/health.png'
import shield from '../assets/icon/shield.png'
import Star from '../assets/icon/star.png'
import fist from '../assets/icon/power.png'
import { setColor, styleType } from '../constant/helper'
import { useEffect, useRef, useState } from 'react'
import VanillaTilt from 'vanilla-tilt'
import LoadingScreen from './loading'

export default function CardDetail({ pokemon = undefined, cardCtrl = false }) {
    const { img2, name, power, attack, hp, def, summary, baseExp, type, star, } = pokemon;
    const cardRef = useRef(null);
    const [detail, setDetail] = useState(false)
    const [rotate, setRotate] = useState(false)

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
        let result = 'card-detail'
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

    return (
        <div className={cardClass()} ref={cardRef}>
            <div className="front-card">
                {img2 && <img src={img2} alt="pokemon_pic" className="pokemon-img" />}
                <h3 style={{ color: setColor(baseExp) }}>Level {pokemon.level}</h3>
                <h2>{name}</h2>
                <p className='summary'>{summary}</p>
                <div className='type'>
                    {cardCtrl ? type?.map((el, i) => {
                        return <span key={i} style={{ backgroundColor: styleType(el, 'background'), borderColor: styleType(el, 'border') }}>{el}</span>
                    }) :
                        type?.elements.map((el, i) => {
                            return <span key={i} style={{ backgroundColor: styleType(el, 'background'), borderColor: styleType(el, 'border') }}>{el}</span>
                        })
                    }
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
                        <span>{power}</span>
                    </div>
                    <div className="stat-group">
                        <div className="stat">
                            <img src={sword} alt="sword" />
                            <p>Attack</p>
                            <span></span>
                            <p>{attack}</p>
                        </div>
                        <div className="stat">
                            <img src={health} alt="health" />
                            <p>HP</p>
                            <span></span>
                            <p>{hp}</p>
                        </div>
                        <div className="stat">
                            <img src={shield} alt="shield" />
                            <p>Defense</p>
                            <span></span>
                            <p>{def}</p>
                        </div>
                    </div>
                    <p>Next Evolution : none</p>
                    <p className='weakness'>Weakness : {removeDuplicates(type?.weakness).map((el, i) => {
                        return <span key={i} style={{ backgroundColor: styleType(el, 'background'), borderColor: styleType(el, 'border') }}>{el}</span>
                    })}</p>
                    <div className="bottom">
                        <div className="star">
                            {new Array(star).map((el) => {
                                <img src={Star} alt="star" key={el}/>
                            })}
                        </div>
                        <div className="evolve">
                            <i>Need more star to evolve</i>
                            <button>Evolve</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}



