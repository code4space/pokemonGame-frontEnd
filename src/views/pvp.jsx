import { useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"

// Asset
import shadow from '../assets/icon/shadow.png'
import { useEffect, useState } from "react"
import LoadingScreen from "../components/loading"
import { getBarrier, skillAndItem } from "../constant/helper"
import { clickSound1 } from "../components/playSound"
import InstructionPage from "../components/instruction"
import bookIcon from '../assets/icon/book.png'


// In-game Functions
function setThePokemonInfo(pokemon, setState) {
  let temp = {}
  pokemon.forEach((el) => {
    const { name, role, hp, attack, def, type } = el
    temp[name] = {
      role,
      ability: skillAndItem.find(el1 => el1.role === role).ability,
      item: skillAndItem.find(el1 => el1.role === role).item,
      hp,
      barrier: 0,
      attack,
      def,
      type
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

    function handleSetBarrier({ pokemon, name }) {
      console.log('masuk', pokemon, name)
      if (opponent.username !== name) setOpponentPokemon(pokemon)
    }

    socket.on('set-first-turn', handleSetFirstTurn);
    socket.on('update-pokemon', handleSetBarrier)

    // Clean up event listeners when the component unmounts
    return () => {
      socket.off('set-first-turn', handleSetFirstTurn);
      socket.off('update-pokemon', handleSetFirstTurn);
    };
  }, []);

  useEffect(() => {
    if (firstTurn?.me > firstTurn?.opponent) setTurn({ ...turn, isMyTurn: true })
    else setTurn({ ...turn, isMyTurn: false })
  }, [firstTurn])

  console.log(myPokemon)

  useEffect(() => {
    const handleAddTurn = ({ name }) => {
      if (opponent.username !== name) {
        if (turn.index + 1 === Object.keys(opponentPokemon).length) {
          setTurn({ isMyTurn: true, index: 0 })
          cleanBarrier(myPokemon, setMyPokemon)
        }
        else setTurn(prevState => ({ ...prevState, index: prevState.index + 1 }))
      }
    };

    socket.on('add-turn', handleAddTurn);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('add-turn', handleAddTurn);
    };
  }, [opponentPokemon, turn])

  // Other functions
  function setNextTurn() {
    if (turn.index + 1 === Object.keys(myPokemon).length) {
      setTurn({ isMyTurn: false, index: 0 })
      cleanBarrier(opponentPokemon, setOpponentPokemon)
    } else {
      setTurn(prevState => ({ ...prevState, index: prevState.index + 1 }))
    }

    socket.emit('add-turn', { room, name: opponent.username })
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

    setNextTurn()
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
              const { frontView } = opponent.deck.find(({ name }) => name === el)
              const { hp, barrier } = opponentPokemon[el]
              return (
                <div className="pokemon-img-ctrl" key={el}>
                  <img src={frontView} alt={el + '_img'} />
                  <div className="hp-bar">
                    <p>Hp.</p>
                    <span className="hp">
                      <span style={{ width: `${(hp / opponentPokemon[el].hp) * 100}%` }}></span>
                      <span style={{ width: `${(barrier / opponentPokemon[el].hp) * 100}%` }}></span>
                    </span>
                  </div>
                  <div className="name">{el}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="pokemon-place">
          <img src={shadow} alt="pokemon-shadow" className='shadow' />
          <div className="pokemon-char">
            {Object.keys(myPokemon).map(el => {
              const { backView } = deck.find(({ name }) => name === el)
              const { hp, barrier } = myPokemon[el]
              return (
                <div className="pokemon-img-ctrl" key={el}>
                  <img src={backView} alt={el + '_img'} />
                  <div className="hp-bar">
                    <p>Hp.</p>
                    <span className="hp">
                      <span style={{ width: `${(hp / myPokemon[el].hp) * 100}%` }}></span>
                      <span style={{ width: `${(barrier / myPokemon[el].hp) * 100}%` }}></span>
                    </span>
                  </div>
                  <div className="name">{el}</div>
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
                  {turn.isMyTurn ?
                    <>
                      <p>Lv.{getDetail(deck, myPokemon, turn).level} {getName(myPokemon, turn).toUpperCase()} Turn</p>
                      {<div className={menu.isMenu ? 'turn-opt menu' : 'turn-opt'}>
                        {menu.attackMenu && <>{Object.keys(opponentPokemon).map((el) => {
                          return <span key={el}>* Lv. {getDetail(opponent.deck, opponentPokemon, turn).level} {el} [{opponentPokemon[el].type.elements.join(', ')}]</span>
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
                    </> :
                    <>
                      <p>ENEMY turn</p>
                      <div className='turn-opt'>
                        <span>{getDetail(opponent.deck, opponentPokemon, turn).name} move...</span>
                      </div>
                    </>
                  }
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