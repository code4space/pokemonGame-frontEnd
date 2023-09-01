import { useSelector } from "react-redux"
import { useOutletContext } from "react-router-dom"

// Asset
import shadow from '../assets/icon/shadow.png'
import { useState } from "react"

// In-game Functions
function setMyAbility(pokemon, setAbilityAndItem) {
  let temp = {}
  pokemon.forEach((el) => {
    const { name, role } = el
    temp[name] = skillAndItem.find(el1 => el1.role === role)
  })
  setAbilityAndItem(temp)
}

export default function PagePvP() {
  // Game Info
  const room = useOutletContext().roomInfo
  const socket = useOutletContext().socket

  // Pokemon deck
  const deck = useSelector((state) => state.UserReducer.deck)
  const [opponent, setOpponent] = useOutletContext().opponent

  // Game flow ~~
  const [menu, setMenu] = useState({})
  const [turn, setTurn] = useState({ turn: 0, isMyTurn: null })

  // pokemon info
  const [myPokemon, setMyPokemon] = useState({})
  const [opponentPokemon, setOpponentPokemon] = useState({})

  // Ability

  // Item


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

        <div className="pokemon-place enemy">
          <img src={shadow} alt="pokemon-shadow" className='shadow' />
        </div>
        <div className="pokemon-place">
          <img src={shadow} alt="pokemon-shadow" className='shadow' />
          <div className="pokemon-char">
            {deck.map(el => {
              console.log(el)
              return (
                <div className="pokemon-img-ctrl">
                  <img src={el.backView} alt={el.name + '_img'} />
                  <div className="hp-bar">
                    <p>Hp.</p>
                    <span className="hp">
                      <span></span>
                      <span></span>
                    </span>
                  </div>
                  <div className="name"></div>
                </div>
              )
            })}
          </div>
        </div>

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