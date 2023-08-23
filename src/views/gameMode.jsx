import { useNavigate } from "react-router-dom"
import { clickSound } from "../components/playSound"
import { useSelector } from "react-redux"


export default function GameModePage() {
    const navigate = useNavigate()

    const username = useSelector((state) => {
        return state.UserReducer.username
    })

    console.log(username)

    function Move(route) {
        clickSound()
        return navigate(route)
    }

    function handlePvP(route) {
        clickSound()
        return navigate(route)
    }
    return (
        <div className="lobby">
            <div className="pixelated-border pixelated-border-effect button-lobby" onClick={() => { Move('/prepare') }}>
                Solo
            </div>
            <div className="pixelated-border pixelated-border-effect button-lobby" onClick={() => { handlePvP('/pvp/draft') }}>
                PvP
            </div>
        </div>
    )
}