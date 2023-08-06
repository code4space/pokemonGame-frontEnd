import sword from '../assets/icon/sword.png'
import health from '../assets/icon/health.png'
import shield from '../assets/icon/shield.png'
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
                <div className="middle">
                    <p className='title'>Stats</p>
                    <div className="stat">
                        <span>
                            <img src={sword} alt="atk" />: {attack}
                        </span>
                        <span>
                            <img src={health} alt="health" />: {hp}
                        </span>
                        <span>
                            <img src={shield} alt="def" />: {def}
                        </span>
                        <span>
                            <img src={fist} alt="power" />: {power}
                        </span>
                    </div>
                </div>
                {/* <div className="bottom">
                </div>
                <p>star</p>
                <p>weakness</p>
                <p>evolve to</p> */}
            </div>
        </div>
    );
}



