import { useLocation, useNavigate } from "react-router-dom"
import { useRef, useEffect, useState } from "react"
import { PokemonTheme1, clickSound } from "../components/playSound"
import Typewriter from 'typewriter-effect'


export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    function login(e) {
        e.preventDefault()
        localStorage.setItem('access_token', '123')
        navigate("/")
    }

    return (
        <>
            {location.pathname === "/login" && PokemonTheme1()}
            <div className="login-ctrl">
                <form className="login-container pixelated-border" onSubmit={login}>
                    <span className="user-login">User<Typewriter
                        options={{
                            strings: ['Login', 'Register'],
                            autoStart: true,
                            loop: true,
                            pauseFor: 1500,
                            cursorClassName: 'blinking-cursor',
                            skipAddStyles: true,
                        }}
                    /></span>
                    <input type="text" placeholder="Username" onChange={(e) => { setUser({ ...user, username: e.target.value }) }} value={user.username} required />
                    <input type="password" placeholder="Password" onChange={(e) => { setUser({ ...user, password: e.target.value }) }} value={user.password} required />
                    <div className="button-login-ctrl">
                        <button type="submit" onClick={clickSound}>Login</button>
                        <button onClick={clickSound}>Register</button>
                    </div>
                </form>
            </div>
        </>
    )
}