import { useLocation, useNavigate } from "react-router-dom"
import { useRef, useEffect, useState } from "react"
import { PokemonTheme1 } from "../components/playSound"


export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    function login() {
        navigate("/")
    }

    return (
        <>
            {location.pathname === "/login" && PokemonTheme1()}
            <div className="login-ctrl">
                <form className="login-container pixelated-border">
                    <span>User Login</span>
                    <input type="text" placeholder="Username" onChange={(e) => { setUser({ ...user, username: e.target.value }) }} value={user.username} required/>
                    <input type="text" placeholder="Password" onChange={(e) => { setUser({ ...user, password: e.target.password }) }} value={user.password} required/>
                    <div className="button-login-ctrl">
                        <button type='submit' onClick={login}>Login</button>
                        <button onClick={login}>Register</button>
                    </div>
                </form>
            </div>
        </>
    )
}