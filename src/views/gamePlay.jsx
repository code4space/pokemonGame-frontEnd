import { useEffect } from 'react'
import '../assets/css/gamePlay.css'

export default function GamePlayPage() {

    function renderStripes() {
        const height = [10, 8, 6, 4, 2, 0.1]
        return (
            height.map((el, i) => {
                return (
                    <span key={i} style={{ height: `${el}px` }}></span>
                )
            })
        )
    }
    useEffect(() => {
        console.log(window.innerWidth)
    }, [window.innerWidth])

    return (
        <>
            <div className="play-bg">
                <div className='play-bg-stripes'>
                    <div>
                        {renderStripes()}
                    </div>
                    <div>
                        {renderStripes()}
                    </div>
                </div>

                {/* <div className="enemy-side">
                    <div className='pokemon-place'>
                        <div className='shadow'>
                            <div className='shadow1'></div>
                        </div>
                        <div className="pokemon-img-container">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="" />
                        </div>
                        <div className="pokemon-img-container">
                            <img style={{ animation: "moveRight 1s linear infinite" }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="" />
                        </div>
                        <div className="pokemon-img-container">
                            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png" alt="" />
                        </div>
                    </div>
                </div>

                <div className='pokemon-place'>
                    <div className='shadow'>
                        <div className='shadow1'></div>
                    </div>
                    <div className="pokemon-img-container">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png" alt="" />
                    </div>
                    <div className="pokemon-img-container">
                        <img style={{ animation: "moveRight 1s linear infinite" }} src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png" alt="" />
                    </div>
                    <div className="pokemon-img-container">
                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png" alt="" />
                    </div>
                </div> */}

            </div>
            <div className='dialogue-container'>
                <div className='dialogue-border'>
                    <div className='dialogue-border1'>
                        <div className='dialogue-border2'>
                            <div className='dialogue-border3'>
                                <p>IVYSOUR Turn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}