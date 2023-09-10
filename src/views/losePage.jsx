import '../assets/css/losePage.css'
import { useEffect, useState } from 'react'
import { clickSound, loseSound } from '../components/playSound'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { SET_BATTLE_DECK } from '../store/actions/actionType'
import { useDispatch } from 'react-redux'

export default function LosePage() {
    const [blink, setBlink] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const location = useLocation()
    const state = location.state;

    useEffect(() => {
        loseSound()
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

    function title({ pokemon, difficulty }) {
        switch (difficulty) {
            case false || 'PvP':
                return 'You lose nothing on this battle'
            case true:
                return `${pokemon} Exiled from your Collection`
            default:
                break;
        }
    }

    if (!state) {
        return <Navigate to={'/'}></Navigate>;
    }
    else {
        return (
            <>
                <div className='black-bg'>
                    {blink ?
                        <><p style={{ color: 'rgb(233, 95, 95)' }}>{title(state)}</p>
                            <p>Improve your Pokémon's level, evolve them, and increase their star</p>
                            <button className='logout' onClick={handleButton}>Home</button></> : <h1>YOU LOSE</h1>}
                </div>
            </>
        )
    }

}