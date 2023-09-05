import { useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"

// Asset
import shadow from '../assets/icon/shadow.png'
import { useEffect, useState } from "react"
import LoadingScreen from "../components/loading"
import { damageDealt, getBarrier, skillAndItem } from "../constant/helper"
import { clickSound1, hitSound } from "../components/playSound"
import InstructionPage from "../components/instruction"
import bookIcon from '../assets/icon/book.png'


// In-game Functions
function setThePokemonInfo(pokemon, setState) {
  let temp = {}
  pokemon.forEach((el) => {
    const { name, role, hp, attack, def, type, power } = el
    temp[name] = {
      role,
      ability: skillAndItem.find(el1 => el1.role === role).ability,
      item: skillAndItem.find(el1 => el1.role === role).item,
      hp,
      barrier: 0,
      attack,
      def,
      type,
      power
    };
  })
  setState(temp)
}

const getName = (pokemon, turn) => Object.keys(pokemon)[turn.index]
const getDetail = (deck, pokemon, turn) => deck.find(el => el.name === getName(pokemon, turn))
const getDetailByName = (deck, name) => deck.find(el => el.name === name)

export default function PagePvP() {
  const navigate = useNavigate()

  // Game Info
  const room = useOutletContext().roomInfo
  const socket = useOutletContext().socket
  const [firstTurn, setFirstTurn] = useState(null)

  // Pokemon deck
  const deck = useSelector((state) => state.UserReducer.deck)
  const [opponent, setOpponent] = useOutletContext().opponent

  // Game flow ~~
  const [turn, setTurn] = useState({ index: 0, isMyTurn: null })
  const [hitEffect, setHitEffect] = useState({ damage: 0, effectiveness: null, target: undefined })
  const [menu, setMenu] = useState({
    isMenu: true,
    attackMenu: false,
    skillMenu: false,
    abilityMenu: false,
    itemMenu: false,
    sightMenu: false,
    instruction: false,
    sightTarget: null,
  })

  // pokemon info
  const [myPokemon, setMyPokemon] = useState()
  const [opponentPokemon, setOpponentPokemon] = useState()

  // Ability

  // Item

  useEffect(() => {
    if (!deck.length) navigate('/pvp/draft');
    setThePokemonInfo(deck, setMyPokemon);
    setThePokemonInfo(opponent.deck, setOpponentPokemon);
    socket.emit('set-first-turn', { room, opponentName: opponent.username });

    // Set up event listeners
    const handleSetFirstTurn = ({ score, name }) => {
      setFirstTurn(prevState => {
        if (opponent.username === name) {
          return { ...prevState, opponent: score };
        } else {
          return { ...prevState, me: score };
        }
      });
    };

    function handleSetPokemon({ pokemon, name }) {
      if (opponent.username !== name) setOpponentPokemon(pokemon)
    }

    socket.on('set-first-turn', handleSetFirstTurn);
    socket.on('update-pokemon', handleSetPokemon)

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('set-first-turn', handleSetFirstTurn);
      socket.off('update-pokemon', handleSetPokemon);
    };
  }, []);

  useEffect(() => {
    if (firstTurn?.me > firstTurn?.opponent) setTurn({ ...turn, isMyTurn: true })
    else setTurn({ ...turn, isMyTurn: false })
  }, [firstTurn])

  useEffect(() => {
    const handleAddTurn = ({ name, pokemon }) => {
      if (opponent.username !== name) {
        if (turn.index + 1 >= Object.keys(opponentPokemon).length) {
          setTurn({ isMyTurn: true, index: 0 })
          cleanBarrier(pokemon, setMyPokemon)
        }
        else setTurn(prevState => ({ ...prevState, index: prevState.index + 1 }))
      }
    };

    function handleAttack({ target, name, damage }) {
      if (opponent.username !== name) attackingTarget(target, false, damage)
    }

    socket.on('add-turn', handleAddTurn);
    socket.on('attack', handleAttack)

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('add-turn', handleAddTurn);
      socket.off('attack', handleAttack)
    };
  }, [opponentPokemon, turn, myPokemon])

  // Other functions
  function setNextTurn(pokemon) {
    if (turn.index + 1 >= Object.keys(myPokemon).length) {
      setTurn({ isMyTurn: false, index: 0 })
      cleanBarrier(pokemon, setOpponentPokemon)
    } else {
      setTurn(prevState => ({ ...prevState, index: prevState.index + 1 }))
    }

    socket.emit('add-turn', { room, name: opponent.username, pokemon })
  }

  function cleanBarrier(pokemon, setPokemon) {
    const updatedMyPokemon = { ...pokemon };

    for (const pokemonName in updatedMyPokemon) {
      if (updatedMyPokemon.hasOwnProperty(pokemonName)) {
        updatedMyPokemon[pokemonName] = {
          ...updatedMyPokemon[pokemonName],
          barrier: 0,
        };
      }
    }

    setPokemon(updatedMyPokemon);
  }

  // Button Handle
  function back(option) {
    clickSound1()
    setMenu({ ...menu, [option]: false, isMenu: true })
  }

  function setActiveMenu(option) {
    clickSound1()
    setMenu({ ...menu, [option]: true, isMenu: false })
  }

  function handleButtonInstruction() {
    clickSound1()
    setMenu(prevMenu => ({ ...prevMenu, instruction: !prevMenu.instruction }));

  }

  function closeSight() {
    setMenu({ ...menu, sightTarget: null })
  }

  function seeTarget(name) {
    setMenu({ ...menu, sightTarget: name })
  }

  function handleButtonDef(name) {
    clickSound1()

    const pokemonInfo = myPokemon[name]
    const gainBarrier = getBarrier(pokemonInfo.def, pokemonInfo.hp, pokemonInfo.role === 'tanker')

    let pokemonDetail = { ...myPokemon };
    pokemonDetail[name] = {
      ...pokemonDetail[name],
      barrier: gainBarrier,
    };
    setMyPokemon(pokemonDetail);

    socket.emit('update-pokemon', { pokemon: pokemonDetail, room, name: opponent.username })

    // if (ejectButton[myDeck[turn].name]) {
    //   ejectUsed()
    //   return undefined
    // }

    setNextTurn(opponentPokemon)
  }

  console.log(firstTurn)

  function attackingTarget(target, toOpponent, damage) {
    setMenu({ ...menu, attackMenu: false, isMenu: true })
    hitSound()

    let attacker = toOpponent ? { ...myPokemon[getName(myPokemon, turn)] } : { ...opponentPokemon[getName(opponentPokemon, turn)] }
    let defender = toOpponent ? { ...opponentPokemon[target] } : { ...myPokemon[target] }
    const dd = damage || damageDealt(attacker.attack, defender.def, attacker.power, defender.type, attacker.type)
    if (toOpponent) socket.emit('attack', { room, name: opponent.username, target, damage: dd })

    if (attacker.role === 'Combat' && dd.status === 'Effective') dd.damage += Math.floor(dd.damage * (50 / 100))
    setHitEffect({ damage: dd.damage, effectiveness: dd.status, target })
    const timer = setTimeout(async () => {
      setHitEffect({ damage: 0, effectiveness: null, target: undefined })
      defender.barrier -= dd.damage
      if (defender.barrier < 0) {
        defender.hp += defender.barrier
        defender.barrier = 0
      }
      if (defender.hp > 0) { //? when pokemon still alive
        if (toOpponent) {
          setOpponentPokemon({ ...opponentPokemon, [target]: defender })
          setNextTurn({ ...opponentPokemon, [target]: defender })
        }
        else setMyPokemon(prevState => ({ ...prevState, [target]: defender }))
      }
      else { //? when pokemon are dead
        if (toOpponent) {
          const copy = { ...opponentPokemon }
          delete copy[target]

          //? is win
          if (!Object.keys(copy).length) navigate('/pvp/win', {state: {difficulty: 'PvP'}})
          setNextTurn(copy)
          setOpponentPokemon(copy)
        }
        else {
          const copy = { ...myPokemon }
          delete copy[target]
          //? is lose
          if (!Object.keys(copy).length) navigate('/pvp/lose', {state: {difficulty: 'PvP'}})
          setMyPokemon(copy)
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }

  // HTML function
  function renderDialogueBox(condition) {
    const result = {
      true: condition === true && <>
        <p>Lv.{getDetail(deck, myPokemon, turn).level} {getName(myPokemon, turn).toUpperCase()} Turn</p>
        {<div className={menu.isMenu ? 'turn-opt menu' : 'turn-opt'}>
          {menu.attackMenu && <>{Object.keys(opponentPokemon).map((el) => {
            return <span key={el} onClick={() => { attackingTarget(el, true) }}>* Lv. {getDetailByName(opponent.deck, el).level} {el} [{opponentPokemon[el].type.elements.join(', ')}]</span>
          })}
            <span onClick={() => back('attackMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.sightMenu && <>{Object.keys(opponentPokemon).map((el) => {
            return <span key={el} onClick={() => seeTarget(el)}>* Lv. {getDetail(opponent.deck, opponentPokemon, turn).level} {el} [{opponentPokemon[el].type.elements.join(', ')}]</span>
          })}
            <span onClick={() => back('sightMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.abilityMenu && <>{myPokemon[getName(myPokemon, turn)].ability.map((el) => {
            return <span key={el.name}>* {el.name} <i>({el.description})</i></span>
          })}
            <span onClick={() => back('abilityMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.itemMenu && <>{myPokemon[getName(myPokemon, turn)].item.map((el) => {
            return <span key={el.name}>* {el.name} <i>({el.description})</i></span>
          })}
            <span onClick={() => back('itemMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.isMenu && <><span onClick={() => setActiveMenu('attackMenu')}>* Attack</span>
            <span onClick={() => handleButtonDef(getName(myPokemon, turn))}>* Def</span>
            <span onClick={() => setActiveMenu('abilityMenu')}>* Skill</span>
            <span onClick={() => setActiveMenu('itemMenu')}>* Item</span>
            <span onClick={() => setActiveMenu('sightMenu')}>* Sight</span>
          </>}
        </div>}
      </>,
      false: <>
        <p>ENEMY turn</p>
        <div className='turn-opt'>
          <span>{getName(opponentPokemon, turn)} move...</span>
        </div>
      </>,
      hitEffect: condition === 'hitEffect' && <>
        <p>Lv.{getDetail(deck, myPokemon, turn).level} {getName(myPokemon, turn).toUpperCase()} Turn</p>
        <div className='turn-opt'>
          <span style={{ marginTop: '20px' }}>...Action</span>
        </div>
      </>
    }

    return result[condition]
  }

  if (!myPokemon || !opponentPokemon) return <LoadingScreen />
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
          <div className="pokemon-char">
            {Object.keys(opponentPokemon).map(el => {
              const { frontView, hp: fullHP } = opponent.deck.find(({ name }) => name === el)
              const { hp, barrier } = opponentPokemon[el]
              return (
                <div className="pokemon-img-ctrl" key={el}>
                  <img src={frontView} alt={el + '_img'} style={(hitEffect.target === el && turn.isMyTurn) ? { animation: 'shake 0.4s linear 0s, hitEffect 1s linear 0s' } : null} />
                  <div className="hp-bar">
                    <p>Hp.</p>
                    <span className="hp">
                      <span style={{ width: `${(hp / fullHP) * 100}%` }}></span>
                      <span style={{ width: `${(barrier / fullHP) * 100}%` }}></span>
                    </span>
                  </div>
                  <div className="name">{el}</div>
                  {(hitEffect.target === el && turn.isMyTurn) && <h5><b style={hitEffect.effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : hitEffect.effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : hitEffect.effectiveness === 'Ineffective' ? { color: 'rgb(216, 214, 77)' } : { color: 'white' }}>{hitEffect.effectiveness}</b> {hitEffect.damage}</h5>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="pokemon-place">
          <img src={shadow} alt="pokemon-shadow" className='shadow' />
          <div className="pokemon-char">
            {Object.keys(myPokemon).map(el => {
              const { backView, hp: fullHP } = deck.find(({ name }) => name === el)
              const { hp, barrier } = myPokemon[el]
              return (
                <div className="pokemon-img-ctrl" key={el}>
                  <img src={backView} alt={el + '_img'} style={(hitEffect.target === el && !turn.isMyTurn) ? { animation: 'shake 0.4s linear 0s, hitEffect 1s linear 0s' } : null} />
                  <div className="hp-bar">
                    <p>Hp.</p>
                    <span className="hp">
                      <span style={{ width: `${(hp / fullHP) * 100}%` }}></span>
                      <span style={{ width: `${(barrier / fullHP) * 100}%` }}></span>
                    </span>
                  </div>
                  <div className="name">{el}</div>
                  {(hitEffect.target === el && !turn.isMyTurn) && <h5><b style={hitEffect.effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : hitEffect.effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : hitEffect.effectiveness === 'Ineffective' ? { color: 'rgb(216, 214, 77)' } : { color: 'white' }}>{hitEffect.effectiveness}</b> {hitEffect.damage}</h5>}
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
                  {renderDialogueBox((hitEffect.target && turn.isMyTurn) ? 'hitEffect' : turn.isMyTurn)}
                  <div className='book' onClick={handleButtonInstruction}><img src={bookIcon} alt="book" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {menu.instruction && <InstructionPage close={handleButtonInstruction} />}
        {menu.sightTarget && <InstructionPage sight={true} close={closeSight} pokemon={getDetailByName(opponent.deck, menu.sightTarget)} />}
      </div>
    </>
  )
}