import sword from '../assets/icon/sword.png'
import health from '../assets/icon/health.png'
import shield from '../assets/icon/shield.png'
import { setColor } from '../constant/helper'
import { useEffect, useRef } from 'react'
import VanillaTilt from 'vanilla-tilt'

export default function CardDetail({ pokemon = {}, cardCtrl = false }) {
    const { otherImg, name, power, atack, hp, def, summary, baseExp } = pokemon;
    const cardRef = useRef(null);

    useEffect(() => {
        VanillaTilt.init(cardRef.current, {
            max: 5,
            speed: 400,
            glare: true,
            'max-glare': 0.5,
        });
    }, []);

    return (
        <div className={cardCtrl? 'card-detail card-ctrl' : 'card-detail'} ref={cardRef}>
            {otherImg && <img src={otherImg} alt="pokemon_pic" className="pokemon-img" />}
            <h2>{name}</h2>
            <h3>Power: {power}</h3>
            <div className="stat">
                <span>
                    <img src={sword} alt="atk" />: {atack}
                </span>
                <span>
                    <img src={health} alt="health" />: {hp}
                </span>
                <span>
                    <img src={shield} alt="def" />: {def}
                </span>
            </div>
            <p>{summary?.replace('\f', ' ')}</p>
            <div className="color-rank" style={{ backgroundColor: setColor(baseExp) }}></div>
        </div>
    );
}
