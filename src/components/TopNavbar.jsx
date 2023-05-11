import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PokemonTheme2, clickSound } from "./playSound";


export default function TopNavbar() {
    const [activeMusic, setActiveMusic] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    function musicButton() {
        setActiveMusic(!activeMusic)
    }

    function logout () {
        clickSound()
        localStorage.clear()
        navigate('/login')
    } 

    function back () {
        clickSound()
        navigate('/')
    }

    return (
        <>
            {PokemonTheme2(undefined, activeMusic)}
            <div className="top-icon-left">
                {location.pathname !== '/' && <button className="back" onClick={back}>Back</button>}
            </div>
            <div className="top-icon-right">
                <button className={activeMusic ? "music-icon music-active" : "music-icon"} onClick={musicButton}>Music</button>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
            <Outlet />
        </>
    )
}