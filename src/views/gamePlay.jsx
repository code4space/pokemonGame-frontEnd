import { useEffect, useState } from 'react'
import '../assets/css/gamePlay.css'
import shadow from '../assets/icon/shadow.png'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useNavigate } from 'react-router-dom'
import { clickSound1, deathSound, hitSound } from '../components/playSound'
import axios from 'axios'
import { baseUrl } from '../constant/url'
import LoadingScreen from '../components/loading'
import { GuardiansElixir, damageDealt, getBarrier, heal, skillAndItem } from '../constant/helper'
import bookIcon from '../assets/icon/book.png'
import InstructionPage from '../components/instruction'
import targetIcon from '../assets/icon/target.png'
import HealingAnimation from '../components/healingAnimation'
import Select from '../components/selectAnimation'

export default function GamePlayPage() {

    // game state
    const [turn, setTurn] = useState(0)
    const [isMyTurn, setIsMyTurn] = useState(true)
    const [enemies, setEnemies] = useState(false)
    const [attackMenu, setAttackMenu] = useState(false)
    const [healMenu, setHealMenu] = useState(false)
    const [sightMenu, setSightMenu] = useState(false)
    const [abilityMenu, setAbilityMenu] = useState(false)
    const [itemMenu, setItemMenu] = useState(false)
    const [menu, setMenu] = useState(true)
    const [sightTarget, setSightTarget] = useState(null)
    const [remainingHP, setRemainingHP] = useState([])
    const [barrier, setBarrier] = useState([10])
    const [myDeck, setMyDeck] = useState([])
    const [instruction, setInstruction] = useState(false)
    const [abilityAndItem, setAbilityAndItem] = useState()
    const [healAnimation, setHealAnimation] = useState(false)

    // set useEffect (if clear the function will run normally)
    const [clear, setClear] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // effect
    const [targetHeal, setTargetHeal] = useState(null)
    const [targetEffect, setTargetEffetct] = useState(false)
    const [hitEffect, setHitEffect] = useState(false)
    const [damage, setDamage] = useState({ total: 0, effectiveness: 'Normal' })


    const navigate = useNavigate()

    const difficulty = useSelector((state) => {
        return state.UserReducer.isHard
    })

    const deck = useSelector((state) => {
        return state.UserReducer.deck
    })

    const lose = async () => {
        let state = { isLose: true, difficulty };
        if (difficulty) {
            const deletedPokemon = deck[Math.floor(Math.random() * deck.length)]
            if (!state['pokemon']) state['pokemon'] = deletedPokemon.name
            await axios({
                url: baseUrl + `/pokemon/${deletedPokemon.id}`,
                method: 'DELETE',
                headers: { access_token: localStorage.getItem('access_token') },
                data: {
                    listBall: [
                        { ball: 'pokeball', increase: difficulty ? 3 : 5 },
                        { ball: 'greatball', increase: difficulty ? 4 : 3 },
                        { ball: 'ultraball', increase: difficulty ? 2 : 1 },
                        { ball: 'masterball', increase: difficulty ? 1 : 0 },
                    ]
                }
            });
        }
        navigate('/play/lose', { state });
    };

    function renderStripes() {
        const height = [10, 8, 6, 4, 2, 0.1]
        return (
            height.map((el, i) => {
                return (
                    <span key={i} style={{ height: `${el}px` }}></span>
                )
            })
        )
    }

    function setActiveMenu(option) {
        clickSound1()
        option(true)
        setMenu(false)
    }

    function setMyAbility(pokemon) {
        let temp = {}
        pokemon.forEach((el) => {
            const { name, role } = el
            temp[name] = skillAndItem.find(el1 => el1.role === role)
        })
        setAbilityAndItem(temp)
    }

    function attackingTarget(target) {
        setAttackMenu(false)
        hitSound()
        setTargetEffetct(target)
        setHitEffect(true);
        const dd = damageDealt(myDeck[turn]?.attack, enemies[target].def, myDeck[turn].power, enemies[target].type, myDeck[turn].type)
        setDamage({ ...damage, total: dd.damage, effectiveness: dd.status })

        const timer = setTimeout(async () => {
            setHitEffect(false);
            const temp = [...remainingHP]
            temp[target + myDeck.length] -= dd.damage

            if (temp[target + myDeck.length] <= 0) {
                deathSound()
                let tempEnemy = [...enemies]
                tempEnemy.splice(target, 1)
                setEnemies(tempEnemy)
                temp.splice(target + myDeck.length, 1)
                setRemainingHP(temp)
                if (tempEnemy.length < 1) {
                    try {
                        const state = { isWin: true, difficulty };
                        navigate('/play/win', { state });
                        const id = deck.map(el => el.id);

                        await axios({
                            url: baseUrl + `/user/reward`,
                            method: 'PATCH',
                            headers: { access_token: localStorage.getItem('access_token') },
                            data: {
                                pokemonId: id, upLevel: difficulty ? 2 : 1,
                                listBall: [
                                    { ball: 'pokeball', increase: difficulty ? 3 : 5 },
                                    { ball: 'greatball', increase: difficulty ? 4 : 3 },
                                    { ball: 'ultraball', increase: difficulty ? 2 : 1 },
                                    { ball: 'masterball', increase: difficulty ? 1 : 0 },
                                ],
                                drawAmount: difficulty ? 7 : 4
                            }
                        })
                    } catch (err) {
                        console.log(err);
                    }
                }
            } else {
                setRemainingHP(temp)
            }

            if (turn + 1 === myDeck.length) {
                setTurn(turn + 1)
                return setIsMyTurn(false)
            }
            setMenu(true)

            return setTurn(turn + 1)
        }, 800);

        return () => clearTimeout(timer);
    }

    function enemyTurn(index) {
        if (!myDeck[0]) return lose()
        const temp = [...remainingHP]
        const dd = damageDealt(enemies[index - myDeck.length]?.attack, myDeck[0]?.def, enemies[index - myDeck.length]?.power, myDeck[0]?.type, enemies[index - myDeck.length]?.type)

        // barrier
        const tempBarrier = [...barrier]
        tempBarrier[0] -= dd.damage

        if (tempBarrier[0] > 0) setBarrier(tempBarrier)
        else {
            temp[0] += tempBarrier[0]
            tempBarrier[0] = 0
        }


        let tempDeck = [...myDeck]
        setDamage({ ...damage, total: dd.damage, effectiveness: dd.status })

        hitSound()
        setTargetEffetct(0)
        setHitEffect(true);

        const timer = setTimeout(() => {
            setHitEffect(false);
            if (temp[0] <= 0) {
                deathSound()
                tempDeck.splice(0, 1)
                temp.splice(0, 1)
                setMyDeck(tempDeck)
                tempBarrier.splice(0, 1)
                setBarrier(tempBarrier)

                if (!enemies[index - tempDeck.length]) {
                    setTurn(0)
                    setRemainingHP(temp)
                    setMenu(true)
                    setBarrier([0, 0, 0])
                    return setIsMyTurn(true)
                }
                return setRemainingHP(temp)
            } else {
                setBarrier(tempBarrier)
                setRemainingHP(temp)
            }

            if (turn + 1 === myDeck.length + enemies.length) {
                setTurn(0)
                setBarrier([0, 0, 0])
                setMenu(true)
                return setIsMyTurn(true)
            }

            return setTurn(turn + 1)
        }, 2000)
        return () => clearTimeout(timer);
    }

    function handleButtonDef(index) {
        clickSound1()

        const gainBarrier = getBarrier(myDeck[index].def, myDeck[index].hp, myDeck[index].role === 'tanker' ? true : false)
        let tempBarrier = [...barrier]
        tempBarrier[index] += gainBarrier
        setBarrier(tempBarrier)

        if (turn + 1 === myDeck.length) {
            setTurn(turn + 1)
            return setIsMyTurn(false)
        }

        return setTurn(turn + 1)
    }

    function back(choosenMenu) {
        clickSound1()
        choosenMenu(false)
        setMenu(true)
    }

    function fetchRemainingHp(enemies) {
        if (remainingHP.length) return null
        else {
            let temp = []
            let tempBarrier = []
            deck.forEach(el => {
                temp.push(el.hp)
                tempBarrier.push(0)
            })
            enemies.forEach(el => {
                temp.push(el.hp)
            })
            setRemainingHP(temp)
            setBarrier(tempBarrier)
        }
    }

    useEffect(() => {
        axios({
            url: baseUrl + `/pokemon/enemies/${difficulty}`,
            method: "GET",
            headers: { access_token: localStorage.getItem('access_token') },
        }).then((res) => {
            const temp = [...deck]
            setMyDeck(temp)
            setMyAbility(temp)
            setEnemies(res.data.pokemon)
            setIsLoading(false)
            fetchRemainingHp(res.data.pokemon)
            setClear(true)
        }).catch(error => {
            console.log(error);
        });
    }, [])

    console.log(myDeck)
    useEffect(() => {
        if (isMyTurn && myDeck[turn]?.role === 'Support') {
            let tempHp = [...remainingHP]
            const healAmmount = heal(myDeck[turn].hp)

            tempHp[turn] += healAmmount
            if (tempHp[turn] > myDeck[turn].hp) tempHp[turn] = myDeck[turn].hp
            setRemainingHP(tempHp)

            setHealAnimation(true)
            setTargetHeal(turn)
            setTimeout(() => {
                setTargetHeal(null)
                setHealAnimation(false)
            }, 1500)
        }
        if (turn >= myDeck.length && clear) {
            enemyTurn(turn);
        }
    }, [turn, enemies, myDeck]);

    function useItem(itemName) {
        if (itemName === "Guardian's Elixir") {
            const barrierAmmount = GuardiansElixir(myDeck)
            let temp = [...barrier]
            barrierAmmount.forEach((el, i) => {
                temp[i] += el
            })
            setBarrier(temp)
        }
        else if (itemName === "Bottle Potion") {
            let temp = [...remainingHP]

            for (let i = 0; i < myDeck.length; i++) {
                const healAmmount = myDeck[i].hp * (15 / 100)
                temp[i] += healAmmount
                if (temp[i] > myDeck[i].hp) temp[i] = myDeck[i].hp
            }
            setRemainingHP(temp)

            setHealAnimation(true)
            setTimeout(() => {
                setHealAnimation(false)
            }, 3000)
        }
        back(setItemMenu)
    }

    function useAbility(abilityName, index) {
        if (abilityName === 'Heal') {
            setHealMenu(true)
            setAbilityMenu(false)
        }
    }

    function healingTarget(index) {
        let tempHp = [...remainingHP]
        const healAmmount = heal(myDeck[index].hp)

        tempHp[index] += healAmmount
        if (tempHp[index] > myDeck[index].hp) tempHp[index] = myDeck[index].hp
        setRemainingHP(tempHp)
        setHitEffect(true)

        setHealAnimation(true)
        setTargetHeal(index)
        setTimeout(() => {
            setHitEffect(false)
            setTargetHeal(null)
            setHealAnimation(false)
            back(setHealMenu)

            if (turn + 1 === myDeck.length) {
                setTurn(turn + 1)
                return setIsMyTurn(false)
            }

            return setTurn(turn + 1)
        }, 1500)
    }

    function handleButtonInstruction() {
        setInstruction(!instruction)
    }

    function seeTarget(index) {
        setSightTarget(index)
    }

    function closeSight() {
        setSightTarget(null)
    }

    if (isLoading) return <LoadingScreen />
    else {
        if (!deck.length) {
            return <Navigate to={'/prepare'}></Navigate>;
        }
        return (
            <>
                <div className="play-bg">
                    <div className='play-bg-stripes'>
                        <div>
                            {renderStripes()}
                        </div>
                    </div>

                    <div className='pokemon-place enemy'>
                        <img src={shadow} alt="pokemon-shadow" className='shadow' />
                        <div className='pokemon-char'>
                            {enemies.map((el, i) => {
                                return (
                                    <div className='pokemon-img-ctrl' key={i}>
                                        <img src={el.frontView} alt="" style={((hitEffect && isMyTurn) && targetEffect === i) ? { animation: 'shake 0.4s linear 0s, hitEffect 1s linear 0s' } : null} />
                                        {attackMenu && <img src={targetIcon} alt="target_img" className='target' onClick={() => { attackingTarget(i) }} />}
                                        <span className='hp-bar'><p>Hp.</p> <span className='hp'>
                                            <span style={{ width: `${(remainingHP[i + myDeck.length] / el.hp) * 100}%` }}></span>
                                        </span></span>
                                        <div>{el.name}</div>
                                        {((hitEffect && isMyTurn) && targetEffect === i) && <h5><b style={damage.effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : damage.effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : damage.effectiveness === 'Ineffective' ? { color: 'rgb(216, 214, 77)' } : { color: 'white' }}>{damage.effectiveness}</b> {damage.total}</h5>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='pokemon-place'>
                        <img src={shadow} alt="pokemon-shadow" className='shadow' />
                        <div className='pokemon-char'>
                            {myDeck.map((el, i) => {
                                return (
                                    <div className='pokemon-img-ctrl' key={i}>
                                        <img src={el.backView} alt="" style={((hitEffect && !isMyTurn) && i === 0) ? { animation: 'shake1 2s linear 0s infinite, hitEffect1 2s linear 0s infinite' } : null} />
                                        {(healAnimation && targetHeal === null) && <HealingAnimation />}
                                        {(healAnimation && targetHeal === i) && <HealingAnimation />}
                                        {healMenu && <Select />}

                                        <span className='hp-bar'><p>Hp.</p> <span className='hp'>
                                            <span style={{ width: `${(remainingHP[i] / el.hp) * 100}%` }}></span>
                                            <span style={{ width: `${(barrier[i] / el.hp) * 100}%` }}></span>
                                        </span></span>
                                        <div>{el.name}</div>
                                        {((hitEffect && !isMyTurn) && 0 === i) && <h5><b style={damage.effectiveness === 'Normal' ? { color: 'rgb(93, 216, 77)' } : damage.effectiveness === 'Effective' ? { color: 'rgb(216, 77, 77)' } : damage.effectiveness === 'Ineffective' ? { color: 'rgb(216, 214, 77)' } : { color: 'white' }}>{damage.effectiveness}</b> {damage.total}</h5>}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className='dialogue-container'>
                    <div className='dialogue-border'>
                        <div className='dialogue-border1'>
                            <div className='dialogue-border2'>
                                <div className='dialogue-border3'>
                                    {
                                        isMyTurn ?
                                            hitEffect ?
                                                <>
                                                    <p>Lv.{myDeck[turn]?.level} {myDeck[turn]?.name.toUpperCase()} Turn</p>
                                                    <div className='turn-opt'>
                                                        <span style={{ marginTop: '20px' }}>...Action</span>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <p>Lv.{myDeck[turn]?.level} {myDeck[turn]?.name.toUpperCase()} Turn</p>
                                                    <div className={menu ? 'turn-opt menu' : 'turn-opt'}>
                                                        {attackMenu && <>{enemies.map((el, i) => {
                                                            return <span key={el.id} onClick={() => attackingTarget(i)}>* Lv. {el?.level} {el.name} [{el.type.elements.join(', ')}]</span>
                                                        })}
                                                            <span onClick={() => back(setAttackMenu)} style={{ marginTop: '20px' }}>* Back</span></>
                                                        }
                                                        {healMenu && <>{myDeck.map((el, i) => {
                                                            return <span key={el.id} onClick={() => healingTarget(i)}>* Lv. {el?.level} {el.name} [{el.type.elements.join(', ')}]</span>
                                                        })}
                                                            <span onClick={() => back(setHealMenu)} style={{ marginTop: '20px' }}>* Back</span></>
                                                        }
                                                        {sightMenu && <>{enemies.map((el, i) => {
                                                            return <span key={el.id} onClick={() => seeTarget(i)}>* Lv. {el?.level} {el.name} [{el.type.elements.join(', ')}]</span>
                                                        })}
                                                            <span onClick={() => back(setSightMenu)} style={{ marginTop: '20px' }}>* Back</span></>
                                                        }
                                                        {abilityMenu && <>{abilityAndItem[myDeck[turn].name].ability.map((el, i) => {
                                                            return <span key={el.name} onClick={() => useAbility(el.name, i)}>* {el.name} <i>({el.description})</i></span>
                                                        })}
                                                            <span onClick={() => back(setAbilityMenu)} style={{ marginTop: '20px' }}>* Back</span></>
                                                        }
                                                        {itemMenu && <>{abilityAndItem[myDeck[turn].name].item.map((el, i) => {
                                                            return <span key={el.name} onClick={() => useItem(el.name)}>{el.ammount}x {el.name} <i>({el.description})</i></span>
                                                        })}
                                                            <span onClick={() => back(setItemMenu)} style={{ marginTop: '20px' }}>* Back</span></>
                                                        }
                                                        {menu && <><span onClick={() => setActiveMenu(setAttackMenu)}>* Attack</span>
                                                            <span onClick={() => { handleButtonDef(turn) }}>* Def</span>
                                                            <span onClick={() => setActiveMenu(setAbilityMenu)}>* Skill</span>
                                                            <span onClick={() => setActiveMenu(setItemMenu)}>* Item</span>
                                                            <span onClick={() => setActiveMenu(setSightMenu)}>* Sight</span>
                                                        </>}
                                                    </div>
                                                </>
                                            :
                                            <>
                                                <p>ENEMY turn</p>
                                                <div className='turn-opt'>
                                                    <span>{enemies[turn - myDeck.length]?.name} attacking...</span>
                                                </div>
                                            </>
                                    }
                                    <div className='book' onClick={handleButtonInstruction}><img src={bookIcon} alt="book" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                {instruction && <InstructionPage close={handleButtonInstruction} />}
                {sightTarget !== null && <InstructionPage sight={true} close={closeSight} pokemon={enemies[sightTarget]} />}
            </>
        )
    }
}