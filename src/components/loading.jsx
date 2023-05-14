import runningPikachu from '../assets/icon/runningPikachu.gif'

export default function LoadingScreen() {
    return (
        <div className="lobby loading">
            <img src={runningPikachu} alt="" />
            <h1>Loading..</h1>
        </div>
    )
}