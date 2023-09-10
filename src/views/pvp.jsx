import { useSelector } from "react-redux"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"

// Asset
import shadow from '../assets/icon/shadow.png'
import LoadingScreen from "../components/loading"
import { damageDealt, getBarrier, heal, skillAndItem } from "../constant/helper"
import { clickSound1, growSound, healingSound, hitSound, roarSound } from "../components/playSound"
import InstructionPage from "../components/instruction"
import bookIcon from '../assets/icon/book.png'
import HealingAnimation from "../components/healingAnimation"
import targetIcon from '../assets/icon/target.png'
import Select from "../components/selectAnimation"
import RoaringAnimation from "../components/roaringAnimation"
import BuffAttackAnimation from "../components/buffAttackAnimation"
import { baseUrl } from "../constant/url"
import axios from "axios"


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
  const username = useOutletContext().username
  const [firstTurn, setFirstTurn] = useState({ opponent: null, me: null })

  // Pokemon deck
  const deck = useSelector((state) => state.UserReducer.deck)
  const [opponent, setOpponent] = useOutletContext().opponent

  // Game flow ~~
  const [turn, setTurn] = useState({ index: 0, isMyTurn: null })
  const [hitEffect, setHitEffect] = useState({ damage: 0, effectiveness: null, target: undefined })
  const [otherEffect, setOtherEffect] = useState({
    healAnimation: false,
    targetHeal: null,
    healAll: false,
    tauntingAnimation: false,
  })
  const [menu, setMenu] = useState({
    isMenu: true,
    attackMenu: false,
    skillMenu: false,
    abilityMenu: false,
    itemMenu: false,
    sightMenu: false,
    healMenu: false,
    instruction: false,
    sightTarget: null,
  })

  const [itemAbility, setItemAblity] = useState({
    focusSash: [],
    smokeBomb: [],
    dopping: [],
    taunt: [],
    charge: [],
    ejectButton: ''
  })

  // pokemon info
  const [myPokemon, setMyPokemon] = useState()
  const [opponentPokemon, setOpponentPokemon] = useState()

  // UseEffect hooks
  useEffect(() => {
    if (!deck.length) navigate('/pvp/draft');
    setThePokemonInfo(deck, setMyPokemon);
    setThePokemonInfo(opponent.deck, setOpponentPokemon);

    const random = Math.random() * 100
    socket.emit('set-first-turn', { room, name: opponent.username, score: random });
    setFirstTurn(prevState => ({ ...prevState, opponent: random }))
    // Set up event listeners
    const handleSetFirstTurn = ({ score, name }) => {
      if (name !== opponent.username) setFirstTurn(prevState => ({ ...prevState, me: score }));
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
        console.log(itemAbility)
        console.log(getName(opponentPokemon, turn), itemAbility.ejectButton, turn.index, turn.isMyTurn)
        if (itemAbility.ejectButton === getName(opponentPokemon, turn)) setItemAblity(prevState => ({ ...prevState, ejectButton: '' }))
        else if (turn.index + 1 >= Object.keys(opponentPokemon).length) {
          setTurn({ isMyTurn: true, index: 0 })
          cleanBarrier(true)
          cleanItemAbility(username)
        }
        else {
          console.log('masuk')
          setTurn(prevState => ({ ...prevState, index: prevState.index + 1 }))
        }
      }
    };

    function handleAttack({ target, name, damage }) {
      if (opponent.username !== name) attackingTarget(target, false, damage)
    }

    function handleUseItem({ name, itemName }) {
      if (opponent.username !== name) useItem(itemName)
    }

    function handleUseAbility({ name, abilityName, type }) {
      if (opponent.username !== name) useAbility({ name: abilityName, type })
    }

    function handleHealingTarget({ name, target }) {
      if (opponent.username !== name) healingTarget(target)
    }

    socket.on('add-turn', handleAddTurn);
    socket.on('attack', handleAttack)
    socket.on('use-item', handleUseItem)
    socket.on('use-ability', handleUseAbility)
    socket.on('healing-target', handleHealingTarget)

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('add-turn', handleAddTurn);
      socket.off('attack', handleAttack)
      socket.off('use-item', handleUseItem)
      socket.off('use-ability', handleUseAbility)
      socket.off('healing-target', handleHealingTarget)
    };
  }, [opponentPokemon, turn, myPokemon, itemAbility])

  useEffect(() => {
    if (!myPokemon || !opponentPokemon) return

    let pokemon, detail
    if (turn.isMyTurn) {
      pokemon = { ...myPokemon[getName(myPokemon, turn)] }
      detail = getDetail(deck, myPokemon, turn)
    }
    else {
      pokemon = { ...opponentPokemon[getName(opponentPokemon, turn)] }
      detail = getDetail(opponent.deck, opponentPokemon, turn)
    }

    if (pokemon.role !== 'Support') return;

    healingSound()
    let healAmmount = heal(pokemon.hp)
    pokemon.hp += healAmmount
    if (detail.hp < pokemon.hp) pokemon.hp = detail.hp

    if (turn.isMyTurn) setMyPokemon({ ...myPokemon, [detail.name]: pokemon })
    else setOpponentPokemon({ ...opponentPokemon, [detail.name]: pokemon })

    setOtherEffect({ ...otherEffect, healAnimation: true, targetHeal: detail.name })
    const timer = setTimeout(() => {
      setOtherEffect({ ...otherEffect, healAnimation: false, targetHeal: null })
    }, 1500)

    return () => clearTimeout(timer)

  }, [turn.index])

  // Other functions
  function setNextTurn(pokemon) {
    if (itemAbility.ejectButton === getName(myPokemon, turn)) {
      socket.emit('add-turn', { room, name: opponent.username, pokemon })
      return setItemAblity(prevState => ({ ...prevState, ejectButton: '' }))
    }
    else if (turn.index + 1 >= Object.keys(myPokemon).length) {
      setTurn({ isMyTurn: false, index: 0 })
      cleanBarrier(false)
      cleanItemAbility(opponent.username)
    } else {
      setTurn(prevState => ({ ...prevState, index: prevState.index + 1 }))
    }

    socket.emit('add-turn', { room, name: opponent.username, pokemon })
  }

  function cleanItemAbility(user) {
    let copy = { ...itemAbility }
    for (let key in copy) {
      let value = [...copy[key]]
      if (!value.length) continue
      if (key === 'focusSash' || key === 'taunt' || key === 'smokeBomb') value = value.filter(el => el.user !== user)
      else if (key === 'dopping') {
        value = value.filter(el => {
          const condition = (el.user !== user) || (el.round < 1)
          if (!condition) {
            const isMe = user === username
            const detail = getDetailByName(isMe ? deck : opponent.deck, el.name)
            const setState = isMe ? setMyPokemon : setOpponentPokemon
            setState(prevState => {
              const pokemon = prevState[el.name]
              pokemon.def = detail.def
              pokemon.attack = detail.attack
              return { ...prevState, [el.name]: pokemon }
            })
          }
          return condition
        })
        value = value.map(el => ({ ...el, round: el.user === user ? el.round + 1 : el.round }))
      }
      copy[key] = value
    }

    setItemAblity(copy)
  }

  function cleanBarrier(isMe) {
    const setState = isMe ? setMyPokemon : setOpponentPokemon
    setState(prevState => {
      for (const pokemonName in prevState) {
        if (prevState.hasOwnProperty(pokemonName)) {
          prevState[pokemonName] = {
            ...prevState[pokemonName],
            barrier: 0,
          };
        }
      }
      return { ...prevState }
    });
  }

  function doesHeal(turn, name) {
    if (otherEffect.healAll && turn) return <HealingAnimation />
    if (!turn) return;
    if (!otherEffect.healAnimation) return;
    if (otherEffect.targetHeal !== name) return;

    return <HealingAnimation />
  }

  // Button Handle
  function back(option) {
    clickSound1()
    setMenu({ ...menu, [option]: false, isMenu: true })
  }

  function setActiveMenu(option) {
    clickSound1()
    if (option === 'attackMenu') {
      const taunting = itemAbility.taunt.find(el => el.user === opponent.username)
      if (taunting) return attackingTarget(taunting.name, true)
    }
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

    const pokemonInfo = getDetailByName(deck, name)
    const gainBarrier = getBarrier(pokemonInfo.def, pokemonInfo.hp, pokemonInfo.role === 'tanker')

    let pokemonDetail = { ...myPokemon };
    pokemonDetail[name] = {
      ...pokemonDetail[name],
      barrier: pokemonDetail[name].barrier + gainBarrier,
    };
    setMyPokemon(pokemonDetail);

    socket.emit('update-pokemon', { pokemon: pokemonDetail, room, name: opponent.username })

    // if (ejectButton[myDeck[turn].name]) {
    //   ejectUsed()
    //   return undefined
    // }

    setNextTurn(opponentPokemon)
  }

  function attackingTarget(target, toOpponent, damage) {
    setMenu(prevState => ({ ...prevState, attackMenu: false, isMenu: true }))
    hitSound()

    let attacker = toOpponent ? { ...myPokemon[getName(myPokemon, turn)] } : { ...opponentPokemon[getName(opponentPokemon, turn)] }
    let defender = toOpponent ? { ...opponentPokemon[target] } : { ...myPokemon[target] }
    let dd = damage || damageDealt(attacker.attack, defender.def, attacker.power, defender.type, attacker.type)

    // damage modified
    const index = itemAbility.charge.findIndex(({ name, user }) => name === getName(toOpponent ? myPokemon : opponentPokemon, turn) && user === toOpponent ? username : opponent.username)

    if (!damage) {
      if (index >= 0) dd.damage *= 2.5

      if (defender.role === 'Tanker') dd.damage = Math.ceil(dd.damage * (80 / 100))
      else if (attacker.role === 'Combat' && dd.status === 'Effective') dd.damage += Math.floor(dd.damage * (50 / 100))
    }

    // clean charge ability
    if (index >= 0) {
      setItemAblity(prevState => {
        let copy = [...prevState.charge]
        copy.splice(index, 1)
        return { ...prevState, charge: copy }
      })
    }

    if (toOpponent) {
      if (itemAbility.smokeBomb.find(({ name, user }) => name === target && user === toOpponent ? opponent.username : username)) {
        const random = Math.random() * 10
        if (random > 7) dd = { damage: 0, status: 'Miss' }
      }
      socket.emit('attack', { room, name: opponent.username, target, damage: dd })
    }

    setHitEffect({ damage: dd.damage, effectiveness: dd.status, target })
    const timer = setTimeout(async () => {
      setHitEffect({ damage: 0, effectiveness: null, target: undefined })
      defender.barrier -= dd.damage
      const isZombie = itemAbility.focusSash.find(el => (el.name === target) && (el.user === toOpponent ? opponent.username : username))
      if (defender.barrier < 0) {
        defender.hp += defender.barrier
        defender.barrier = 0
        if (isZombie && defender.hp <= 0) defender.hp = 1
      }

      if (defender.hp > 0) { //? when pokemon still alive
        if (toOpponent) {
          setOpponentPokemon(prevState => ({ ...prevState, [target]: defender }))
          setNextTurn({ ...opponentPokemon, [target]: defender })
        }
        else setMyPokemon(prevState => ({ ...prevState, [target]: defender }))
      }
      else { //? when pokemon are dead
        if (toOpponent) {
          const copy = { ...opponentPokemon }
          delete copy[target]

          //? is win
          if (!Object.keys(copy).length) {
            const id = deck.map(el => el.id);
            await axios({
              url: baseUrl + `/user/pokeball/increase`,
              method: 'PATCH',
              headers: { access_token: localStorage.getItem('access_token') },
              data: {
                listBall: [
                  { ball: 'pokeball', increase: 0 },
                  { ball: 'greatball', increase: 0 },
                  { ball: 'ultraball', increase: 0 },
                  { ball: 'masterball', increase: 3 },
                ],
              }
            })
            navigate('/pvp/win', { state: { difficulty: 'PvP', opponent: opponent.username } })
          }

          setNextTurn(copy)
          setOpponentPokemon(copy)
        }
        else {
          const copy = { ...myPokemon }
          delete copy[target]

          //? is lose
          if (!Object.keys(copy).length) navigate('/pvp/lose', { state: { difficulty: 'PvP' } })
          setMyPokemon(copy)
        }

        // clean itemAbility dead pokemon
        setItemAblity(prevState => {
          let itemAbilityCopy = { ...prevState }
          for (const key in prevState) {
            if (typeof prevState[key] === 'string') continue;
            let copy = [...prevState[key]]
            copy = copy.filter(({ name, user }) => (name !== target) && (user !== toOpponent ? opponent.username : username))
            itemAbilityCopy = { ...itemAbilityCopy, [key]: copy }
          }
          return itemAbilityCopy
        })
      }
    }, 800);

    return () => clearTimeout(timer);
  }

  function healingTarget(target) {
    healingSound()
    setMenu({ ...menu, healMenu: false, isMenu: true })

    let pokemon = turn.isMyTurn ? { ...myPokemon[target] } : { ...opponentPokemon[target] },
      detail = turn.isMyTurn ? getDetailByName(deck, target) : getDetailByName(opponent.deck, target)

    if (turn.isMyTurn) socket.emit('healing-target', { room, name: opponent.username, target })

    let healAmmount = heal(turn.isMyTurn ? myPokemon[getName(myPokemon, turn)].hp : opponentPokemon[getName(opponentPokemon, turn)].hp, 22)
    pokemon.hp += healAmmount
    if (pokemon.hp > detail.hp) pokemon.hp = detail.hp

    if (turn.isMyTurn) setMyPokemon({ ...myPokemon, [detail.name]: pokemon })
    else setOpponentPokemon({ ...opponentPokemon, [detail.name]: pokemon })

    // Effect
    setOtherEffect(prevState => ({ ...prevState, healAnimation: true, targetHeal: target }))
    setHitEffect(prevState => ({ ...prevState, effectiveness: 'healing', damage: healAmmount }))
    setTimeout(() => {
      setOtherEffect(prevState => ({ ...prevState, healAnimation: false, targetHeal: null }))
      setHitEffect(prevState => ({ ...prevState, effectiveness: null, damage: 0 }))
      if (turn.isMyTurn) setNextTurn(opponentPokemon)
    }, 1500)
  }

  function useItem(itemName) {
    back('itemMenu')
    let pokemons = turn.isMyTurn ? { ...myPokemon } : { ...opponentPokemon },
      details = turn.isMyTurn ? deck : opponent.deck,
      pokemon = turn.isMyTurn ? { ...myPokemon[getName(myPokemon, turn)] } : { ...opponentPokemon[getName(opponentPokemon, turn)] },
      detail = turn.isMyTurn ? getDetail(deck, myPokemon, turn) : getDetail(opponent.deck, opponentPokemon, turn)

    if (itemName === 'Bottle Potion') {
      healingSound()

      details.forEach(({ name, hp }) => {
        if (!pokemons[name]) return
        let tempPokemon = { ...pokemons[name] }
        tempPokemon.hp += heal(tempPokemon.hp)
        if (tempPokemon.hp > hp) tempPokemon.hp = hp
        pokemons[name] = tempPokemon
      })

      if (turn.isMyTurn) {
        socket.emit("use-item", { name: opponent.username, room, itemName })
      }
      else setOpponentPokemon(pokemons)

      // effect
      setOtherEffect({ ...otherEffect, healAll: true })
      setTimeout(() => {
        setOtherEffect({ ...otherEffect, healAll: false })
      }, 1500)
    } else if (itemName === "Guardian's Elixir") {
      details.forEach(({ name, def, hp }) => {
        if (!pokemons[name]) return
        let tempPokemon = { ...pokemons[name] }
        tempPokemon.barrier += getBarrier(def, hp, tempPokemon.role === 'tanker')
        pokemons[name] = tempPokemon
      })

      if (turn.isMyTurn) {
        socket.emit("use-item", { name: opponent.username, room, itemName })
      }
      else setOpponentPokemon(pokemons)
    } else if (itemName === 'Focus Sash') {
      let focusSash = [...itemAbility.focusSash]
      if (turn.isMyTurn) {
        focusSash.push({ name: detail.name, user: username, round: 0 })
        socket.emit("use-item", { name: opponent.username, room, itemName })
      } else {
        focusSash.push({ name: detail.name, user: opponent.username, round: 0 })
      }
      setItemAblity({ ...itemAbility, focusSash })
    } else if (itemName === 'Dopping') {
      let dopping = [...itemAbility.dopping]
      const defToAttack = Math.ceil(pokemon.def * (40 / 100))
      pokemon.def -= defToAttack
      pokemon.attack += defToAttack

      if (turn.isMyTurn) {
        dopping.push({ name: detail.name, user: username, round: 0 })
        socket.emit("use-item", { name: opponent.username, room, itemName })
        pokemons = { ...pokemons, [detail.name]: pokemon }
      } else {
        dopping.push({ name: detail.name, user: opponent.username, round: 0 })
        setOpponentPokemon(prevState => ({ ...prevState, [detail.name]: pokemon }))
      }
      setItemAblity(prevState => ({ ...prevState, dopping }))
    } else if (itemName === 'Smoke Bomb') {
      let smokeBomb = [...itemAbility.smokeBomb]
      if (turn.isMyTurn) {
        smokeBomb.push({ name: detail.name, user: username, round: 0 })
        socket.emit("use-item", { name: opponent.username, room, itemName })
      } else {
        smokeBomb.push({ name: detail.name, user: opponent.username, round: 0 })
      }
      setItemAblity({ ...itemAbility, smokeBomb })
    } else if (itemName === 'Eject Button') {
      if (turn.isMyTurn) socket.emit("use-item", { name: opponent.username, room, itemName })
      setItemAblity({ ...itemAbility, ejectButton: getName(turn.isMyTurn ? myPokemon : opponentPokemon, turn) })
    }

    if (turn.isMyTurn) {
      // let item = [...pokemons[detail.name].item]
      // item.splice(item.findIndex(el => el.name === itemName), 1)
      // pokemons[detail.name] = { ...pokemons[detail.name], item }
      setMyPokemon(pokemons)
    }
  }

  function useAbility({ name, type }) {
    if (type === 'Passive') return;
    let pokemons = turn.isMyTurn ? { ...myPokemon } : { ...opponentPokemon },
      details = turn.isMyTurn ? deck : opponent.deck,
      pokemon = turn.isMyTurn ? { ...myPokemon[getName(myPokemon, turn)] } : { ...opponentPokemon[getName(opponentPokemon, turn)] },
      detail = turn.isMyTurn ? getDetail(deck, myPokemon, turn) : getDetail(opponent.deck, opponentPokemon, turn)

    if (name === 'Heal') {
      return setMenu({ ...menu, healMenu: true, abilityMenu: false })
    } else if (name === 'Taunt') {
      roarSound()
      setMenu(prevState => ({ ...prevState, abilityMenu: false, isMenu: true }))

      let taunt = [...itemAbility.taunt]
      if (turn.isMyTurn) socket.emit("use-ability", { name: opponent.username, room, abilityName: name, type })
      taunt.push({ name: detail.name, user: turn.isMyTurn ? username : opponent.username, round: 0 })
      setItemAblity(prevState => ({ ...prevState, taunt }))

      // Effect
      setOtherEffect(prevState => ({ ...prevState, tauntingAnimation: true }))
      setHitEffect(prevState => ({ ...prevState, effectiveness: 'healing' }))
      setTimeout(() => {
        setOtherEffect(prevState => ({ ...prevState, tauntingAnimation: false }))
        setHitEffect(prevState => ({ ...prevState, effectiveness: null }))
        if (turn.isMyTurn) setNextTurn(opponentPokemon)
      }, 1500)
    } else if (name === 'Charge') {
      growSound()
      setMenu(prevState => ({ ...prevState, abilityMenu: false, isMenu: true }))

      let charge = [...itemAbility.charge]
      if (turn.isMyTurn) socket.emit("use-ability", { name: opponent.username, room, abilityName: name, type })
      charge.push({ name: detail.name, user: turn.isMyTurn ? username : opponent.username, round: 0 })
      setItemAblity(prevState => ({ ...prevState, charge }))

      // Effect
      setHitEffect(prevState => ({ ...prevState, effectiveness: 'healing' }))
      setTimeout(() => {
        setHitEffect(prevState => ({ ...prevState, effectiveness: null }))
        if (turn.isMyTurn) setNextTurn(opponentPokemon)
      }, 1500)
    }
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
          {menu.healMenu && <>{Object.keys(myPokemon).map((el) => {
            return <span key={el} onClick={() => { healingTarget(el) }}>* Lv. {getDetailByName(deck, el).level} {el} [{myPokemon[el].type.elements.join(', ')}]</span>
          })}
            <span onClick={() => back('healMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.sightMenu && <>{Object.keys(opponentPokemon).map((el) => {
            return <span key={el} onClick={() => seeTarget(el)}>* Lv. {getDetail(opponent.deck, opponentPokemon, turn).level} {el} [{opponentPokemon[el].type.elements.join(', ')}]</span>
          })}
            <span onClick={() => back('sightMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.abilityMenu && <>{myPokemon[getName(myPokemon, turn)].ability.map((el) => {
            return <span key={el.name} className={el.type === 'active' ? 'active-skill' : 'passive-skill'} onClick={() => { useAbility(el) }}>* {el.type === 'passive' ? 'Passive' : el.name} <i>({el.description})</i></span>
          })}
            <span onClick={() => back('abilityMenu')} style={{ marginTop: '20px' }}>* Back</span></>
          }
          {menu.itemMenu && <>{myPokemon[getName(myPokemon, turn)].item.map((el) => {
            return <span key={el.name} onClick={() => useItem(el.name)}>* {el.name} <i>({el.description})</i></span>
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

  console.log(turn)

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
                  {menu.attackMenu && <img src={targetIcon} alt="target_img" className='target' onClick={() => { attackingTarget(el, true) }} />}
                  {doesHeal(!turn.isMyTurn, el)}
                  {(otherEffect.tauntingAnimation && !turn.isMyTurn && getDetail(opponent.deck, opponentPokemon, turn).name === el) && <RoaringAnimation />}
                  {(itemAbility.charge.some(({ name, user }) => name === el && user === opponent.username) && !turn.isMyTurn) && <BuffAttackAnimation />}
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
                  {doesHeal(turn.isMyTurn, el)}
                  {(otherEffect.tauntingAnimation && turn.isMyTurn && getDetail(deck, myPokemon, turn).name === el) && <RoaringAnimation />}
                  {(itemAbility.charge.some(({ name, user }) => name === el && user === username) && turn.isMyTurn) && <BuffAttackAnimation />}
                  {menu.healMenu && <Select />}
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
                  {renderDialogueBox((hitEffect.effectiveness && turn.isMyTurn) ? 'hitEffect' : turn.isMyTurn)}
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