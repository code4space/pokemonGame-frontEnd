import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PokemonTheme2 } from "./playSound";


export default function TopNavbar() {
    const [activeMusic, setActiveMusic] = useState(true)
    const navigate = useNavigate()

    function musicButton() {
        setActiveMusic(!activeMusic)
    }

    function logout () {
        navigate('/login')
    } 

    return (
        <>
            {PokemonTheme2(undefined, activeMusic)}
            <div className="top-icon">
                <button className={activeMusic ? "music-icon music-active" : "music-icon"} onClick={musicButton}>Music</button>
                <button className="logout" onClick={logout}>Logout</button>
            </div>
            <Outlet />
        </>
    )
}