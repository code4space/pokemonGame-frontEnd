import { useOutletContext } from "react-router-dom"


export default function PagePvP() {
  const [opponent, setOpponent] = useOutletContext().opponent
  const room = useOutletContext().roomInfo
  const socket = useOutletContext().socket
  console.log(opponent)
  return (
    <>
      <div className="play-bg">
        <div className='play-bg-stripes'>
          <div>
            <span style={{ height: '10px' }}></span>
            <span style={{ height: '8px' }}></span>
            <span style={{ height: '6px' }}></span>
            <span style={{ height: '4px' }}></span>
            <span style={{ height: '2px' }}></span>
            <span style={{ height: '0.1px' }}></span>
          </div>
        </div>

        <div className="pokemon-place enemy"></div>
        <div className="pokemon-place"></div>

        <div className="dialogue-container">
          <div className="dialogue-border">
            <div className="dialogue-border1">
              <div className="dialogue-border2">
                <div className="dialogue-border3">
                  <p>Coba</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}