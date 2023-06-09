import '../assets/css/losePage.css'
import { useEffect, useState } from 'react'
import { clickSound, loseSound } from '../components/playSound'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'

export default function LosePage() {
    const [blink, setBlink] = useState(false)
    const navigate = useNavigate()

    const location = useLocation()
    const state = location.state;

    useEffect(() => {
        loseSound()
        const timer = setTimeout(() => {
            setBlink(true)
        }, 5100)

        return () => clearTimeout(timer);
    }, [])

    function handleButton() {
        clickSound()
        navigate('/')
    }

    if (!state) {
        return <Navigate to={'/'}></Navigate>;
    }
    else {
        return (
            <>
                <div className='black-bg'>
                    {blink ?
                        <><p style={{ color: 'rgb(233, 95, 95)' }}>{state.difficulty ? `${state.pokemon} Exiled from your Collection` : 'You lose nothing on this challange'}</p>
                            <p>Oops... Apologies for the loss. Keep striving, don't let it discourage you.
                                Remember, failure in a game is not the end, but rather a chance to learn and grow.
                            </p>
                            <button className='logout' onClick={handleButton}>Home</button></> : <h1>YOU LOSE</h1>}
                </div>
            </>
        )
    }

}