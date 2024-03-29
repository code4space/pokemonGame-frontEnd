import '../assets/css/winPage.css'

import { useEffect, useState } from 'react'
import { clickSound, winSound } from '../components/playSound'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import pokeBall from "../assets/icon/pokeball.png"
import greatBall from "../assets/icon/greatball.png"
import ultraBall from "../assets/icon/ultraball.png"
import masterBall from "../assets/icon/masterball.png"
import { SET_BATTLE_DECK } from '../store/actions/actionType'
import { useDispatch } from 'react-redux'

export default function WinPage() {
    const [blink, setBlink] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation()
    const state = location.state;

    useEffect(() => {
        winSound()
        const timer = setTimeout(() => {
            setBlink(true)
        }, 5100)


        dispatch({ type: SET_BATTLE_DECK, payload: [] });
        return () => clearTimeout(timer);
    }, [])

    function handleButton() {
        clickSound()
        navigate('/')
    }

    function title({ difficulty, opponent }) {
        switch (difficulty) {
            case 'PvP':
                return <div className='win-content pixelated-border'>
                    <h2>CONGRATULATIONS</h2>
                    <p>You successfully defeated {opponent} in PvP.</p>
                    <div className='reward-control'>
                        <div className='ball-reward'>
                            <img src={masterBall} alt="pokeball" />
                            <span>3X</span>
                        </div>
                    </div>
                </div>
            default:
                return <div className='win-content pixelated-border'>
                    <h2>CONGRATS</h2>
                    <p>You received these rewards after defeating the {difficulty === false ? 'normal' : 'extreme'} difficulty, Your Pokémon in the deck just leveled up by 1!</p>
                    <div className='reward-control'>
                        <div className='ball-reward'>
                            <img src={pokeBall} alt="pokeBall" />
                            <span>{difficulty === false ? '5' : '3'}X</span>
                        </div>
                        <div className='ball-reward'>
                            <img src={greatBall} alt="greatBall" />
                            <span>{difficulty === false ? '3' : '4'}X</span>
                        </div>
                        <div className='ball-reward'>
                            <img src={ultraBall} alt="pokeball" />
                            <span>{difficulty === false ? '1' : '2'}X</span>
                        </div>
                        {difficulty && <div className='ball-reward'>
                            <img src={masterBall} alt="pokeball" />
                            <span>1X</span>
                        </div>}
                    </div>
                </div>
        }
    }

    if (!state) {
        return <Navigate to={'/'}></Navigate>;
    }
    else {
        return (
            <>
                <div className='black-bg'>
                    {blink ? <>
                        {title(state)}
                        <button onClick={handleButton}>Home</button>
                    </> : <h1>YOU WIN</h1>}
                </div>
            </>
        )
    }

}